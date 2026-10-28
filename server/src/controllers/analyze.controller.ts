import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service.js';
import { Boundary } from '../models/Boundary.js';
import { SafetyAnalysis } from '../models/SafetyAnalysis.js';
import { UserBoundaryItem } from '../services/pattern.service.js';

export const analyzeController = {
  // POST /api/analyze
  async analyzeConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        conversationText,
        situationDescription,
        analysisType,
        anonymize,
        saveHistoryConsent,
      } = req.body;

      // Retrieve user boundaries if authenticated
      let userBoundaries: UserBoundaryItem[] = [];
      if (req.user) {
        const dbBoundaries = await Boundary.find({
          userId: req.user._id,
          isActive: true,
        }).select('_id title description category');

        userBoundaries = dbBoundaries.map((b) => ({
          id: b._id.toString(),
          title: b.title,
          description: b.description,
          category: b.category,
        }));
      }

      // Execute upgraded AI Analysis (with automatic rule-based fallback)
      const analysisResult = await AIService.analyze(
        conversationText,
        userBoundaries,
        {
          situationDescription,
          analysisType,
          anonymize,
        }
      );

      // Handle opt-in analysis history saving
      let savedAnalysisId: string | null = null;
      if (req.user && saveHistoryConsent === true) {
        // Privacy invariant: ONLY save structured findings & summary, NEVER raw conversation text!
        const savedRecord = await SafetyAnalysis.create({
          userId: req.user._id,
          summary: analysisResult.summary,
          concernLevel: analysisResult.concernLevel,
          findings: analysisResult.findings,
          replySuggestions: analysisResult.suggestedReplies,
          safetySteps: analysisResult.recommendedActions,
          limitations: analysisResult.limitations,
          isOptInSaved: true,
        });
        savedAnalysisId = savedRecord._id.toString();
      }

      return res.status(200).json({
        success: true,
        analysis: analysisResult,
        savedAnalysisId,
        privacyNotice:
          'Original conversation text was analyzed in memory and was NOT stored in the database.',
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/analyze/overview
  async analyzeMultiConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        conversations = [],
        analysisIds,
        dateRange,
        focusTopic,
        concernFilter,
      } = req.body;

      let itemsToAnalyze = [...conversations];

      // If user is authenticated and either requested their saved records or didn't supply raw conversations
      if (req.user) {
        const query: any = { userId: req.user._id };

        if (Array.isArray(analysisIds) && analysisIds.length > 0) {
          query._id = { $in: analysisIds };
        }

        if (dateRange?.start || dateRange?.end) {
          query.createdAt = {};
          if (dateRange.start) query.createdAt.$gte = new Date(dateRange.start);
          if (dateRange.end) query.createdAt.$lte = new Date(dateRange.end);
        }

        const dbRecords = await SafetyAnalysis.find(query)
          .sort({ createdAt: -1 })
          .limit(50);

        const mappedDbRecords = dbRecords.map((rec, i) => {
          const primaryFinding = rec.findings?.[0]?.title;
          const displayTitle = primaryFinding
            ? `Evaluation: ${primaryFinding}`
            : rec.concernLevel === 'high'
            ? `High Concern Evaluation #${dbRecords.length - i}`
            : `Conversation Evaluation #${dbRecords.length - i}`;

          return {
            id: rec._id.toString(),
            title: displayTitle,
            summary: rec.summary,
            date: rec.createdAt.toISOString().split('T')[0],
            concernLevel: rec.concernLevel,
            findings: rec.findings,
          };
        });

        itemsToAnalyze = [...itemsToAnalyze, ...mappedDbRecords];
      }

      // Execute AI Multi-Conversation Intelligence
      const report = await AIService.analyzeMultiConversations(
        itemsToAnalyze,
        focusTopic,
        concernFilter
      );

      return res.status(200).json({
        success: true,
        report,
      });
    } catch (error) {
      next(error);
    }
  },
};
