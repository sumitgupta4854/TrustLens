import { Request, Response, NextFunction } from 'express';
import { SafetyAnalysis } from '../models/SafetyAnalysis.js';
import { NotFoundError, UnauthorizedError, ForbiddenError } from '../utils/errors.js';

export const historyController = {
  // GET /api/analyses
  async listAnalyses(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const analyses = await SafetyAnalysis.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .select('-__v');

      return res.status(200).json({
        success: true,
        analyses: analyses.map((a) => ({
          id: a._id.toString(),
          summary: a.summary,
          concernLevel: a.concernLevel,
          findingsCount: a.findings.length,
          findings: a.findings,
          replySuggestions: a.replySuggestions,
          safetySteps: a.safetySteps,
          limitations: a.limitations,
          createdAt: a.createdAt.toISOString(),
        })),
        privacyNotice: 'Saved records contain only structured findings and recommendations. Raw conversation text is never stored.',
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/analyses/:id
  async getAnalysisById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const analysis = await SafetyAnalysis.findById(req.params.id);
      if (!analysis) {
        throw new NotFoundError('Saved analysis record not found.');
      }

      // Strict ownership check
      if (analysis.userId.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('You do not have permission to view this analysis.');
      }

      return res.status(200).json({
        success: true,
        analysis: {
          id: analysis._id.toString(),
          summary: analysis.summary,
          concernLevel: analysis.concernLevel,
          findings: analysis.findings,
          replySuggestions: analysis.replySuggestions,
          safetySteps: analysis.safetySteps,
          limitations: analysis.limitations,
          createdAt: analysis.createdAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/analyses/:id
  async deleteAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const analysis = await SafetyAnalysis.findById(req.params.id);
      if (!analysis) {
        throw new NotFoundError('Saved analysis record not found.');
      }

      // Strict ownership check
      if (analysis.userId.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('You do not have permission to delete this analysis.');
      }

      await SafetyAnalysis.deleteOne({ _id: analysis._id });

      return res.status(200).json({
        success: true,
        message: 'Analysis record successfully deleted from history.',
      });
    } catch (error) {
      next(error);
    }
  },
};
