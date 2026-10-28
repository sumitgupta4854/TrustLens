import { Router } from 'express';
import { analyzeController } from '../controllers/analyze.controller.js';
import { chatController } from '../controllers/chat.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';
import { analyzeLimiter } from '../middleware/rateLimiter.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  analyzeRequestSchema,
  multiConversationRequestSchema,
} from '../validators/analyze.schema.js';
import { analyzeMessagesRequestSchema } from '../validators/chat.schema.js';

const router = Router();

// Allows analyzing conversation (works for visitors or authenticated users, checking their boundaries if logged in)
router.post(
  '/',
  analyzeLimiter,
  optionalAuth,
  validateBody(analyzeRequestSchema),
  analyzeController.analyzeConversation
);

// Cross-conversation aggregate AI intelligence overview
router.post(
  '/overview',
  analyzeLimiter,
  optionalAuth,
  validateBody(multiConversationRequestSchema),
  analyzeController.analyzeMultiConversations
);

// AI Conversation Analysis specifically for user messages (filters new vs existing)
router.post(
  '/messages',
  analyzeLimiter,
  optionalAuth,
  validateBody(analyzeMessagesRequestSchema),
  chatController.analyzeUserMessages
);

export default router;
