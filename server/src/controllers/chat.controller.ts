import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AIService } from '../services/ai.service.js';
import { ChatMessageModel } from '../models/ChatMessage.js';
import { logger } from '../utils/logger.js';

export const chatController = {
  // POST /api/ai/chat
  async chatWithSafetyAI(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, history, messageId } = req.body;
      const result = await AIService.chat(message, history || []);

      // If user is authenticated, save the user message and assistant reply to DB
      if (req.user) {
        try {
          const userMsgId = messageId || `user-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
          await ChatMessageModel.findOneAndUpdate(
            { userId: req.user._id, messageId: userMsgId },
            {
              userId: req.user._id,
              messageId: userMsgId,
              role: 'user',
              content: message,
              timestamp: new Date(),
              analyzed: false,
            },
            { upsert: true, new: true }
          );

          const assistantMsgId = `assistant-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
          await ChatMessageModel.create({
            userId: req.user._id,
            messageId: assistantMsgId,
            role: 'assistant',
            content: result.response,
            timestamp: new Date(),
            analyzed: false,
          });
        } catch (dbErr: any) {
          logger.warn(`Failed to store chat message to DB: ${dbErr.message}`);
        }
      }

      return res.status(200).json({
        success: true,
        response: result.response,
        engine: result.engine,
        privacyNotice: 'Chat messages are processed in memory and not permanently recorded by default.',
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/ai/chat/analyze-messages
  async analyzeUserMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        messages = [],
        alreadyAnalyzedIds = [],
        forceReanalyze = false,
        page = 1,
        limit = 50,
      } = req.body;

      // 1. Role identification: filter ONLY user messages
      // Distinguish user messages from assistant responses
      const rawUserMessages = messages.filter((m: any) => {
        const role = (m.role || '').toLowerCase();
        return role === 'user';
      });

      // Maintain full history context for AI
      const fullHistory = messages.map((m: any) => ({
        role: m.role || 'user',
        content: m.content || '',
      }));

      // In-memory or client message map with stable deduplication keys
      const userMessageMap = new Map<string, any>();

      // Generate a stable key for each client message
      rawUserMessages.forEach((m: any, idx: number) => {
        const stableId =
          m.id ||
          m.messageId ||
          `msg_${crypto.createHash('md5').update(`${m.content}_${m.timestamp || idx}`).digest('hex').slice(0, 12)}`;
        userMessageMap.set(stableId, {
          id: stableId,
          messageId: stableId,
          role: 'user',
          content: m.content,
          timestamp: m.timestamp || new Date().toISOString(),
          analysis: m.analysis,
        });
      });

      // 2. Database Sync & Pagination if user is authenticated
      const authenticatedUserId = req.user?._id;
      if (authenticatedUserId) {
        // Upsert newly received client user messages to DB
        const upsertPromises = Array.from(userMessageMap.values()).map(async (msg) => {
          return ChatMessageModel.findOneAndUpdate(
            { userId: authenticatedUserId, messageId: msg.id },
            {
              $setOnInsert: {
                userId: authenticatedUserId,
                messageId: msg.id,
                role: 'user',
                content: msg.content,
                timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
                analyzed: false,
              },
            },
            { upsert: true, new: true }
          );
        });
        await Promise.allSettled(upsertPromises);

        // Fetch paginated messages from DB so older messages are not silently omitted
        const skip = (page - 1) * limit;
        const dbMessages = await ChatMessageModel.find({
          userId: authenticatedUserId,
          role: 'user',
        })
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .lean();

        // Merge DB messages into userMessageMap
        dbMessages.forEach((dbMsg) => {
          if (!userMessageMap.has(dbMsg.messageId)) {
            userMessageMap.set(dbMsg.messageId, {
              id: dbMsg.messageId,
              messageId: dbMsg.messageId,
              role: 'user',
              content: dbMsg.content,
              timestamp: dbMsg.timestamp.toISOString(),
              analyzed: dbMsg.analyzed,
              analysis: dbMsg.analysis,
            });
          } else {
            const existing = userMessageMap.get(dbMsg.messageId);
            if (dbMsg.analyzed && dbMsg.analysis) {
              existing.analyzed = true;
              existing.analysis = dbMsg.analysis;
            }
          }
        });
      }

      const allUserMessages = Array.from(userMessageMap.values());

      // 3. Filter Against Existing Messages
      // Compare newly received messages with previously analyzed messages
      const analyzedIdSet = new Set<string>(alreadyAnalyzedIds);

      let newMessages: any[] = [];
      let existingMessages: any[] = [];

      if (forceReanalyze) {
        // Reanalyze all messages
        newMessages = allUserMessages;
        existingMessages = [];
      } else {
        allUserMessages.forEach((msg) => {
          const isAnalyzed =
            analyzedIdSet.has(msg.id) ||
            analyzedIdSet.has(msg.messageId) ||
            Boolean(msg.analyzed);
          if (isAnalyzed) {
            existingMessages.push(msg);
          } else {
            newMessages.push(msg);
          }
        });
      }

      // 4. Run AI Analysis on New Messages
      const analysisResult = await AIService.analyzeUserMessages(
        newMessages,
        existingMessages,
        fullHistory
      );

      // 5. Update analysis status in DB only after AI analysis succeeds
      if (authenticatedUserId && analysisResult.newMessagesAnalysis.length > 0) {
        const updatePromises = analysisResult.newMessagesAnalysis.map((analyzedItem) => {
          return ChatMessageModel.updateOne(
            { userId: authenticatedUserId, messageId: analyzedItem.messageId },
            {
              $set: {
                analyzed: true,
                analysis: analyzedItem,
              },
            }
          );
        });
        await Promise.allSettled(updatePromises);
      }

      return res.status(200).json({
        success: true,
        newMessagesAnalysis: analysisResult.newMessagesAnalysis,
        existingMessagesAnalysis: analysisResult.existingMessagesAnalysis,
        overallAnalysis: analysisResult.overallAnalysis,
        totalUserMessages: allUserMessages.length,
        newCount: analysisResult.newMessagesAnalysis.length,
        existingCount: analysisResult.existingMessagesAnalysis.length,
        engine: analysisResult.engine,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/ai/chat/messages
  async getUserMessages(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(200).json({ success: true, messages: [], total: 0 });
      }

      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 50));
      const skip = (page - 1) * limit;

      const [messages, total] = await Promise.all([
        ChatMessageModel.find({ userId: req.user._id })
          .sort({ timestamp: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        ChatMessageModel.countDocuments({ userId: req.user._id }),
      ]);

      const formatted = messages.map((m) => ({
        id: m.messageId,
        messageId: m.messageId,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
        analyzed: m.analyzed,
        analysis: m.analysis,
      }));

      return res.status(200).json({
        success: true,
        messages: formatted,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/ai/chat/reanalyze
  async reanalyzeAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await ChatMessageModel.updateMany(
          { userId: req.user._id, role: 'user' },
          { $set: { analyzed: false }, $unset: { analysis: '' } }
        );
      }

      return res.status(200).json({
        success: true,
        message: 'All messages reset for re-analysis.',
      });
    } catch (error) {
      next(error);
    }
  },
};
