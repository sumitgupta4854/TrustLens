export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

export type ConcernLevel = 'low' | 'moderate' | 'high';
export type Confidence = 'low' | 'medium' | 'high';
export type EvidenceStrength = 'weak' | 'moderate' | 'strong';

export type BoundaryCategory =
  | 'financial'
  | 'physical_intimacy'
  | 'personal_privacy'
  | 'meeting_time'
  | 'communication'
  | 'emotional_pace'
  | 'other';

export type BoundaryStatus =
  | 'Appears respected'
  | 'Possibly challenged'
  | 'Repeatedly challenged'
  | 'Not enough evidence'
  | 'potential_violation'
  | 'respected'
  | 'untested';

export interface Finding {
  category: string;
  title: string;
  evidence: string;
  explanation: string;
  confidence: Confidence;
  recommendedAction: string;
}

export interface BoundaryCheck {
  boundaryTitle: string;
  status: BoundaryStatus;
  evidenceExcerpt?: string;
  explanation?: string;
  guidance?: string;
}

export interface ManipulationPattern {
  pattern: string;
  evidence: string;
  explanation: string;
  uncertaintyNote?: string;
}

export interface PositiveSignal {
  behavior: string;
  evidence: string;
  significance: string;
}

export interface ReplySuggestions {
  gentle: string;
  firm: string;
  direct: string;
}

export interface AnalysisResult {
  summary: string;
  concernLevel: ConcernLevel;
  findings: Finding[];
  evidence?: string[];
  evidenceStrength?: EvidenceStrength;
  boundaryAnalysis: BoundaryCheck[];
  boundaryChecks?: BoundaryCheck[];
  possibleManipulationPatterns?: ManipulationPattern[];
  positiveSignals?: PositiveSignal[];
  recommendedActions: string[];
  safetySteps?: string[];
  suggestedReplies: ReplySuggestions;
  replySuggestions?: ReplySuggestions;
  limitations: string[];
  engine: 'ai_llm' | 'pattern_rules_fallback';
}

export interface Boundary {
  id: string;
  title: string;
  description: string;
  category: BoundaryCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavedAnalysis {
  id: string;
  summary: string;
  concernLevel: ConcernLevel;
  findings: Finding[];
  findingsCount: number;
  replySuggestions: ReplySuggestions;
  safetySteps: string[];
  limitations: string[];
  createdAt: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  engine?: 'ai_llm' | 'pattern_rules_fallback';
}

export interface RecurringTopic {
  topic: string;
  frequency: number;
  riskLevel: 'low' | 'moderate' | 'high';
  description: string;
}

export interface CrossConversationPattern {
  pattern: string;
  occurrenceCount: number;
  explanation: string;
  advice: string;
}

export interface ConversationTrendItem {
  date: string;
  title: string;
  concernLevel: 'low' | 'moderate' | 'high';
  sentiment: string;
  topic: string;
}

export interface IndividualChatSummary {
  id: string;
  title: string;
  date: string;
  concernLevel: 'low' | 'moderate' | 'high';
  sentiment: 'positive' | 'neutral' | 'cautious' | 'concerning';
  userIntent: string;
  counterpartyIntent: string;
  topics: string[];
  keyPoints: string[];
  summary: string;
  actionableAdvice: string;
  findingsCount: number;
}

export interface MultiConversationReport {
  totalConversations: number;
  overallSummary: string;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    cautious: number;
    concerning: number;
  };
  intentAnalysis: {
    userIntent: string[];
    counterpartyIntent: string[];
    summary: string;
  };
  recurringTopics: RecurringTopic[];
  crossConversationPatterns: CrossConversationPattern[];
  conversationTrends: ConversationTrendItem[];
  strategicRecommendations: string[];
  individualSummaries: IndividualChatSummary[];
  engine: 'ai_llm' | 'pattern_rules_fallback';
}

export interface MultiConversationOverviewRequest {
  conversations?: Array<{
    id?: string;
    title?: string;
    text?: string;
    date?: string;
    context?: string;
    concernLevel?: 'low' | 'moderate' | 'high';
    summary?: string;
  }>;
  analysisIds?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  focusTopic?: string;
  concernFilter?: 'all' | 'low' | 'moderate' | 'high';
}

export interface AnalyzedMessageItem {
  messageId: string;
  role: 'user';
  content: string;
  timestamp: string;
  meaningAndContext: string;
  topic: string;
  intent: string;
  keyPoints: string[];
  questionsAndRequests: string[];
  actionableInsights: string[];
  category: string;
  connectionToExisting?: string;
  analyzedAt: string;
}

export interface UserMessagesOverallAnalysis {
  overallSummary: string;
  primaryTopics: string[];
  safetyConcerns: string[];
  recommendedFocus: string[];
  totalAnalyzed: number;
  userBoundaryPosture: string;
}

export interface UserMessagesAnalysisResponse {
  success: boolean;
  newMessagesAnalysis: AnalyzedMessageItem[];
  existingMessagesAnalysis: AnalyzedMessageItem[];
  overallAnalysis: UserMessagesOverallAnalysis;
  totalUserMessages: number;
  newCount: number;
  existingCount: number;
  engine: 'ai_llm' | 'pattern_rules_fallback';
}


