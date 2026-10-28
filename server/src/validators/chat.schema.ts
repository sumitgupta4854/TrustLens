import { z } from 'zod';

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().trim().min(1, 'Message content cannot be empty.').max(10000, 'Message content is too long.'),
});

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1, 'Please enter a message.').max(5000, 'Message is too long.'),
  history: z.array(chatMessageSchema).max(50).default([]),
  messageId: z.string().optional(),
});

export const flexibleChatMessageSchema = z.object({
  id: z.string().optional(),
  messageId: z.string().optional(),
  role: z.string(),
  content: z.string().min(1, 'Message cannot be empty.'),
  timestamp: z.string().optional(),
});

export const analyzeMessagesRequestSchema = z.object({
  messages: z.array(flexibleChatMessageSchema).default([]),
  alreadyAnalyzedIds: z.array(z.string()).default([]),
  forceReanalyze: z.boolean().default(false),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(50),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type FlexibleChatMessage = z.infer<typeof flexibleChatMessageSchema>;
export type AnalyzeMessagesRequest = z.infer<typeof analyzeMessagesRequestSchema>;
