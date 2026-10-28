import { z } from 'zod';

export const analysisTypeEnum = z.enum([
  'general_safety',
  'boundary_respect',
  'financial_pressure',
  'intimate_image_pressure',
  'communication_patterns',
]).default('general_safety');

export const analyzeRequestSchema = z.object({
  conversationText: z
    .string()
    .trim()
    .min(10, 'Please provide at least 10 characters of conversation text to analyze.')
    .max(25000, 'Conversation text exceeds maximum limit of 25,000 characters.'),
  situationDescription: z.string().trim().max(1000).optional(),
  analysisType: analysisTypeEnum.optional(),
  anonymize: z.boolean().default(false).optional(),
  saveHistoryConsent: z.boolean().default(false).optional(),
});

export const confidenceEnum = z.preprocess((val) => {
  if (typeof val === 'string') {
    const lower = val.toLowerCase();
    if (lower === 'moderate') return 'medium';
    if (['low', 'medium', 'high'].includes(lower)) return lower;
  }
  return 'medium';
}, z.enum(['low', 'medium', 'high']));

export const findingItemSchema = z.object({
  category: z.string().default('communication_patterns'),
  title: z.string().default('Observed Communication Pattern'),
  evidence: z.string().default('Direct excerpt from conversation'),
  explanation: z.string().default('Contextual observation regarding communication tone or boundary pacing.'),
  confidence: confidenceEnum.default('medium'),
  recommendedAction: z.string().default('Assert personal comfort levels clearly and maintain independent pacing.'),
});

export const boundaryStatusEnum = z.preprocess((val) => {
  if (typeof val === 'string') {
    const s = val.trim();
    if (/respected/i.test(s) && !/possibly|repeatedly|not/i.test(s)) return 'Appears respected';
    if (/repeatedly/i.test(s) || /violation/i.test(s)) return 'Repeatedly challenged';
    if (/possibly/i.test(s) || /challenged/i.test(s) || /tested/i.test(s)) return 'Possibly challenged';
    if (/evidence/i.test(s) || /untested/i.test(s)) return 'Not enough evidence';
    return s;
  }
  return 'Not enough evidence';
}, z.enum([
  'Appears respected',
  'Possibly challenged',
  'Repeatedly challenged',
  'Not enough evidence',
  'potential_violation', // Backward compatibility for legacy tests
  'respected',
  'untested',
]));

export const boundaryCheckItemSchema = z.object({
  boundaryTitle: z.string(),
  status: boundaryStatusEnum.default('Not enough evidence'),
  evidenceExcerpt: z.string().optional().default(''),
  explanation: z.string().optional().default(''),
  guidance: z.string().optional().default(''),
});

export const manipulationPatternSchema = z.object({
  pattern: z.string(),
  evidence: z.string().default(''),
  explanation: z.string().default(''),
  uncertaintyNote: z.string().optional(),
});

export const positiveSignalSchema = z.object({
  behavior: z.string(),
  evidence: z.string().default(''),
  significance: z.string().default(''),
});

export const repliesSchema = z.object({
  gentle: z.string().default("I appreciate your thoughts, but I prefer to take things at my own pace and keep our communication comfortable."),
  firm: z.string().default("I have clear personal boundaries and expect them to be respected. Let's keep things at a comfortable pace."),
  direct: z.string().default("No. I am not comfortable with this."),
});

export const structuredAnalysisOutputSchema = z.object({
  summary: z.string(),
  concernLevel: z.preprocess((val) => {
    if (typeof val === 'string') {
      const lower = val.toLowerCase();
      if (['low', 'moderate', 'high'].includes(lower)) return lower;
    }
    return 'low';
  }, z.enum(['low', 'moderate', 'high'])),
  findings: z.array(findingItemSchema).default([]),
  evidence: z.array(z.string()).default([]),
  evidenceStrength: z.preprocess((val) => {
    if (typeof val === 'string') {
      const lower = val.toLowerCase();
      if (['weak', 'moderate', 'strong'].includes(lower)) return lower;
    }
    return 'moderate';
  }, z.enum(['weak', 'moderate', 'strong'])).default('moderate'),
  boundaryAnalysis: z.array(boundaryCheckItemSchema).default([]),
  boundaryChecks: z.array(boundaryCheckItemSchema).default([]), // Backward compatibility alias
  possibleManipulationPatterns: z.array(manipulationPatternSchema).default([]),
  positiveSignals: z.array(positiveSignalSchema).default([]),
  recommendedActions: z.array(z.string()).default([]),
  safetySteps: z.array(z.string()).default([]), // Backward compatibility alias
  suggestedReplies: repliesSchema.default({
    gentle: "I appreciate your thoughts, but I prefer to take things at my own pace.",
    firm: "I have clear personal boundaries and expect them to be respected.",
    direct: "No. I am not comfortable with this.",
  }),
  replySuggestions: repliesSchema.default({
    gentle: "I appreciate your thoughts, but I prefer to take things at my own pace.",
    firm: "I have clear personal boundaries and expect them to be respected.",
    direct: "No. I am not comfortable with this.",
  }), // Backward compatibility alias
  limitations: z.array(z.string()).default([]),
  engine: z.enum(['ai_llm', 'pattern_rules_fallback']).default('ai_llm'),
});

export type StructuredAnalysisOutput = z.infer<typeof structuredAnalysisOutputSchema>;
export type BoundaryStatus = z.infer<typeof boundaryStatusEnum>;

export const conversationInputItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  text: z.string().optional(),
  date: z.string().optional(),
  context: z.string().optional(),
  concernLevel: z.enum(['low', 'moderate', 'high']).optional(),
  summary: z.string().optional(),
});

export const multiConversationRequestSchema = z.object({
  conversations: z.array(conversationInputItemSchema).optional(),
  analysisIds: z.array(z.string()).optional(),
  dateRange: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
  focusTopic: z.string().optional(),
  concernFilter: z.enum(['all', 'low', 'moderate', 'high']).optional(),
});

export const recurringTopicSchema = z.object({
  topic: z.string(),
  frequency: z.number(),
  riskLevel: z.enum(['low', 'moderate', 'high']),
  description: z.string(),
});

export const crossPatternSchema = z.object({
  pattern: z.string(),
  occurrenceCount: z.number(),
  explanation: z.string(),
  advice: z.string(),
});

export const conversationTrendItemSchema = z.object({
  date: z.string(),
  title: z.string(),
  concernLevel: z.enum(['low', 'moderate', 'high']),
  sentiment: z.string(),
  topic: z.string(),
});

export const individualSummaryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  concernLevel: z.enum(['low', 'moderate', 'high']),
  sentiment: z.enum(['positive', 'neutral', 'cautious', 'concerning']),
  userIntent: z.string(),
  counterpartyIntent: z.string(),
  topics: z.array(z.string()),
  keyPoints: z.array(z.string()),
  summary: z.string(),
  actionableAdvice: z.string(),
  findingsCount: z.number(),
});

export const multiConversationOutputSchema = z.object({
  totalConversations: z.number(),
  overallSummary: z.string(),
  sentimentDistribution: z.object({
    positive: z.number(),
    neutral: z.number(),
    cautious: z.number(),
    concerning: z.number(),
  }),
  intentAnalysis: z.object({
    userIntent: z.array(z.string()),
    counterpartyIntent: z.array(z.string()),
    summary: z.string(),
  }),
  recurringTopics: z.array(recurringTopicSchema),
  crossConversationPatterns: z.array(crossPatternSchema),
  conversationTrends: z.array(conversationTrendItemSchema),
  strategicRecommendations: z.array(z.string()),
  individualSummaries: z.array(individualSummaryItemSchema),
  engine: z.enum(['ai_llm', 'pattern_rules_fallback']),
});

export type MultiConversationRequest = z.infer<typeof multiConversationRequestSchema>;
export type MultiConversationOutput = z.infer<typeof multiConversationOutputSchema>;
export type IndividualSummaryItem = z.infer<typeof individualSummaryItemSchema>;

