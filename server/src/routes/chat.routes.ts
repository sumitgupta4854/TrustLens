import { Router } from 'express';
import { chatController } from '../controllers/chat.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { analyzeLimiter } from '../middleware/rateLimiter.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  chatRequestSchema,
  analyzeMessagesRequestSchema,
} from '../validators/chat.schema.js';

const router = Router();

// Chat endpoint (protected with rate limiting and schema validation)
router.post(
  '/chat',
  requireAuth,
  analyzeLimiter,
  validateBody(chatRequestSchema),
  chatController.chatWithSafetyAI
);

// AI Conversation Analysis for user messages (filters new vs existing messages)
router.post(
  '/chat/analyze-messages',
  optionalAuth,
  analyzeLimiter,
  validateBody(analyzeMessagesRequestSchema),
  chatController.analyzeUserMessages
);

router.post(
  '/analyze-messages',
  optionalAuth,
  analyzeLimiter,
  validateBody(analyzeMessagesRequestSchema),
  chatController.analyzeUserMessages
);

// Get stored chat messages for user
router.get(
  '/chat/messages',
  optionalAuth,
  chatController.getUserMessages
);

// Reset & reanalyze all messages
router.post(
  '/chat/reanalyze',
  optionalAuth,
  chatController.reanalyzeAll
);

export default router;
