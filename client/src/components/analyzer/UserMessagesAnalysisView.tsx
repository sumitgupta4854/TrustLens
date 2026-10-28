import React, { useState } from 'react';
import {
  AnalyzedMessageItem,
  UserMessagesOverallAnalysis,
  ChatMessage,
} from '../../types';
import { Button } from '../ui/Button';
import { Spinner, Alert } from '../ui';
import {
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  HelpCircle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Clock,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  Compass,
} from 'lucide-react';
import { formatDate } from '../../utils';

interface Props {
  newMessages: AnalyzedMessageItem[];
  existingMessages: AnalyzedMessageItem[];
  overallAnalysis?: UserMessagesOverallAnalysis | null;
  loading?: boolean;
  onAnalyzeNew?: () => void;
  onReanalyzeAll?: () => void;
  onSwitchToChat?: () => void;
}

export function UserMessagesAnalysisView({
  newMessages = [],
  existingMessages = [],
  overallAnalysis,
  loading = false,
  onAnalyzeNew,
  onReanalyzeAll,
  onSwitchToChat,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showExistingSection, setShowExistingSection] = useState(true);

  const allCategories = Array.from(
    new Set(
      [...newMessages, ...existingMessages]
        .map((m) => m.category)
        .filter(Boolean)
    )
  );

  const filterItem = (item: AnalyzedMessageItem) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.content.toLowerCase().includes(q) ||
      item.topic.toLowerCase().includes(q) ||
      item.intent.toLowerCase().includes(q) ||
      item.meaningAndContext.toLowerCase().includes(q) ||
      item.keyPoints.some((p) => p.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  };

  const filteredNew = newMessages.filter(filterItem);
  const filteredExisting = existingMessages.filter(filterItem);
  const totalAnalyzed = newMessages.length + existingMessages.length;

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Boundary Setting':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300 border-teal-300 dark:border-teal-700';
      case 'Safety Verification':
        return 'bg-coral-50 text-coral-700 dark:bg-coral-400/20 dark:text-coral-300 border-coral-200 dark:border-coral-800';
      case 'Red Flag Inquiry':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Practical Planning':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-400/20 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Emotional Expression':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-400/20 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-lightbg-200 text-txt-lightSecondary dark:bg-midnight-800 dark:text-txt-darkSecondary border-lightbg-300 dark:border-midnight-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Overview & Controls */}
      <div className="card p-5 border border-lightbg-300 dark:border-midnight-700 bg-white dark:bg-midnight-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>User Message Filter & AI Analysis</span>
            </div>
            <h2 className="text-xl font-bold text-txt-lightPrimary dark:text-txt-darkPrimary tracking-tight">
              Sent Messages Intelligence
            </h2>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary">
              Evaluates your manually sent messages, filters newly typed dialogue from previously analyzed history, and uncovers intents, boundaries, and actionable insights.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {onReanalyzeAll && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onReanalyzeAll}
                disabled={loading || totalAnalyzed === 0}
                className="gap-1.5 text-xs"
                title="Reset and re-run analysis across all sent messages"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Reanalyze All Messages</span>
              </Button>
            )}

            {onAnalyzeNew && newMessages.length === 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={onAnalyzeNew}
                disabled={loading}
                className="gap-1.5 text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Check For New Messages</span>
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-lightbg-200 dark:border-midnight-800">
          <div className="p-3 rounded-xl bg-lightbg-100 dark:bg-midnight-850 border border-lightbg-200 dark:border-midnight-800">
            <span className="text-[10px] font-semibold text-txt-lightSecondary uppercase tracking-wider block">
              Total Messages
            </span>
            <span className="text-lg font-bold text-txt-lightPrimary dark:text-txt-darkPrimary font-mono">
              {totalAnalyzed}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40">
            <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider block">
              New Messages
            </span>
            <span className="text-lg font-bold text-teal-700 dark:text-teal-300 font-mono">
              {newMessages.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-lightbg-100 dark:bg-midnight-850 border border-lightbg-200 dark:border-midnight-800">
            <span className="text-[10px] font-semibold text-txt-lightSecondary uppercase tracking-wider block">
              Previously Analyzed
            </span>
            <span className="text-lg font-bold text-txt-lightPrimary dark:text-txt-darkPrimary font-mono">
              {existingMessages.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-lightbg-100 dark:bg-midnight-850 border border-lightbg-200 dark:border-midnight-800">
            <span className="text-[10px] font-semibold text-txt-lightSecondary uppercase tracking-wider block">
              Boundary Posture
            </span>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 block truncate mt-1">
              {overallAnalysis?.userBoundaryPosture || 'Observant & Safe'}
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-txt-lightSecondary absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter messages by topic, intent, meaning, or keywords..."
              className="w-full input-base pl-9 py-2 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-txt-lightSecondary shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-base py-2 text-xs bg-white dark:bg-midnight-850"
            >
              <option value="all">All Categories ({totalAnalyzed})</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="card p-8 text-center space-y-3 border border-teal-200 dark:border-midnight-700 bg-teal-50/10">
          <Spinner className="w-7 h-7 text-teal-500 mx-auto" />
          <p className="text-sm font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
            AI Analyzing Messages & Filtering Dialogue…
          </p>
          <p className="text-xs text-txt-lightSecondary max-w-md mx-auto">
            Comparing incoming messages against previously evaluated history and extracting contextual intent.
          </p>
        </div>
      )}

      {/* Overall Conversation Synthesis Banner */}
      {overallAnalysis && totalAnalyzed > 0 && (
        <div className="card p-5 border border-teal-500/25 bg-teal-50/20 dark:bg-teal-950/20 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300">
            <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Collective Message Synthesis & Posture</span>
          </div>

          <p className="text-xs sm:text-sm text-txt-lightPrimary dark:text-txt-darkPrimary leading-relaxed">
            {overallAnalysis.overallSummary}
          </p>

          {/* Primary Topics Tags */}
          {overallAnalysis.primaryTopics?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-semibold text-txt-lightSecondary uppercase tracking-wider mr-1">
                Topics:
              </span>
              {overallAnalysis.primaryTopics.map((top, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-medium"
                >
                  {top}
                </span>
              ))}
            </div>
          )}

          {/* Recommended Focus Points */}
          {overallAnalysis.recommendedFocus?.length > 0 && (
            <div className="pt-2 border-t border-teal-500/20 space-y-1.5">
              <span className="text-[11px] font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Recommended Focus for Your Next Messages:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {overallAnalysis.recommendedFocus.map((foc, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-white/70 dark:bg-midnight-900/70 border border-teal-500/20 text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary"
                  >
                    {foc}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State when 0 messages */}
      {totalAnalyzed === 0 && !loading && (
        <div className="card p-12 text-center border-dashed border-lightbg-300 dark:border-midnight-700 space-y-4">
          <MessageSquare className="w-10 h-10 text-teal-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
              No User Messages Detected Yet
            </h3>
            <p className="text-xs text-txt-lightSecondary max-w-md mx-auto leading-relaxed">
              When you type and send messages in the AI Safety Chat or submit your dating conversations, TrustLens captures and analyzes each message, isolating newly sent messages from previously analyzed history.
            </p>
          </div>
          {onSwitchToChat && (
            <Button variant="primary" size="sm" onClick={onSwitchToChat} className="gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Go to AI Safety Chat</span>
            </Button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION A: NEW MESSAGES ANALYSIS (Unanalyzed / Newly Analyzed) */}
      {/* ========================================================================= */}
      {totalAnalyzed > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-lightbg-300 dark:border-midnight-700">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <h3 className="text-sm font-bold text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center gap-2">
                <span>SECTION A: New Messages Analysis</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300 font-mono">
                  {newMessages.length} unanalyzed / newly detected
                </span>
              </h3>
            </div>
            <span className="text-[11px] text-txt-lightSecondary">
              Filtered from existing history
            </span>
          </div>

          {newMessages.length === 0 ? (
            <div className="p-4 rounded-xl border border-lightbg-300 dark:border-midnight-700 bg-lightbg-100/50 dark:bg-midnight-900/50 text-center text-xs text-txt-lightSecondary">
              No new unanalyzed messages. All sent messages have been evaluated and are cataloged in Section B below. Any new message you send will immediately appear here.
            </div>
          ) : filteredNew.length === 0 ? (
            <div className="p-4 rounded-xl border border-lightbg-300 dark:border-midnight-700 bg-lightbg-100/50 dark:bg-midnight-900/50 text-center text-xs text-txt-lightSecondary">
              No new messages match your current filter criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNew.map((item, idx) => (
                <MessageAnalysisCard
                  key={item.messageId || idx}
                  item={item}
                  isNew={true}
                  badgeClass={getCategoryBadgeClass(item.category)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION B: EXISTING MESSAGES ANALYSIS (Previously Analyzed) */}
      {/* ========================================================================= */}
      {totalAnalyzed > 0 && (
        <div className="space-y-3 pt-4 border-t border-lightbg-300 dark:border-midnight-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowExistingSection((prev) => !prev)}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-txt-lightSecondary/60" />
              <h3 className="text-sm font-bold text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center gap-2 group-hover:text-teal-600 transition-colors">
                <span>SECTION B: Existing Messages Analysis</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-lightbg-200 text-txt-lightSecondary dark:bg-midnight-800 dark:text-txt-darkSecondary font-mono">
                  {existingMessages.length} previously cataloged
                </span>
              </h3>
              {showExistingSection ? (
                <ChevronUp className="w-4 h-4 text-txt-lightSecondary" />
              ) : (
                <ChevronDown className="w-4 h-4 text-txt-lightSecondary" />
              )}
            </button>

            <span className="text-[11px] text-txt-lightSecondary">
              Historical evaluations
            </span>
          </div>

          {showExistingSection && (
            <>
              {existingMessages.length === 0 ? (
                <div className="p-4 rounded-xl border border-lightbg-300 dark:border-midnight-700 bg-lightbg-100/50 dark:bg-midnight-900/50 text-center text-xs text-txt-lightSecondary">
                  No previously analyzed messages stored yet. Newly analyzed messages will be saved here on future scans.
                </div>
              ) : filteredExisting.length === 0 ? (
                <div className="p-4 rounded-xl border border-lightbg-300 dark:border-midnight-700 bg-lightbg-100/50 dark:bg-midnight-900/50 text-center text-xs text-txt-lightSecondary">
                  No existing messages match the current search or category filter.
                </div>
              ) : (
                <div className="space-y-3 opacity-95">
                  {filteredExisting.map((item, idx) => (
                    <MessageAnalysisCard
                      key={item.messageId || idx}
                      item={item}
                      isNew={false}
                      badgeClass={getCategoryBadgeClass(item.category)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Individual message breakdown card
 */
function MessageAnalysisCard({
  item,
  isNew,
  badgeClass,
}: {
  item: AnalyzedMessageItem;
  isNew: boolean;
  badgeClass: string;
}) {
  return (
    <div
      className={`card p-4 sm:p-5 border transition-all duration-150 space-y-3 ${
        isNew
          ? 'border-teal-400 dark:border-teal-500/50 bg-teal-50/10 dark:bg-teal-950/15 shadow-soft-sm'
          : 'border-lightbg-300 dark:border-midnight-700 bg-white dark:bg-midnight-900'
      }`}
    >
      {/* Top Header: Message Quote & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 pb-2 border-b border-lightbg-200 dark:border-midnight-800">
        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badgeClass}`}
            >
              {item.category}
            </span>
            <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 font-mono">
              Topic: {item.topic}
            </span>
            {isNew ? (
              <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-teal-500 text-white">
                New Message
              </span>
            ) : (
              <span className="text-[9px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded bg-lightbg-200 dark:bg-midnight-800 text-txt-lightSecondary">
                Previously Analyzed
              </span>
            )}
          </div>

          {/* Original User Message Excerpt */}
          <div className="p-2.5 rounded-lg bg-lightbg-100 dark:bg-midnight-850 border border-lightbg-200 dark:border-midnight-800 text-xs font-mono text-txt-lightPrimary dark:text-txt-darkPrimary leading-relaxed">
            "{item.content}"
          </div>
        </div>

        <div className="text-[10px] text-txt-lightSecondary font-mono shrink-0">
          {item.timestamp ? formatDate(item.timestamp) : 'Recent'}
        </div>
      </div>

      {/* Meaning & Context */}
      <div className="space-y-1">
        <span className="text-[11px] font-semibold text-txt-lightSecondary uppercase tracking-wider block">
          Context & Linguistic Nuance
        </span>
        <p className="text-xs text-txt-lightPrimary dark:text-txt-darkPrimary leading-relaxed">
          {item.meaningAndContext}
        </p>
      </div>

      {/* Intent & Connection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-lightbg-100/70 dark:bg-midnight-850/70 border border-lightbg-200 dark:border-midnight-800 space-y-1">
          <span className="font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-1 text-[11px]">
            <Compass className="w-3.5 h-3.5" />
            <span>Identified User Intent:</span>
          </span>
          <p className="text-txt-lightPrimary dark:text-txt-darkPrimary leading-relaxed text-[11px]">
            {item.intent}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-lightbg-100/70 dark:bg-midnight-850/70 border border-lightbg-200 dark:border-midnight-800 space-y-1">
          <span className="font-semibold text-txt-lightSecondary flex items-center gap-1 text-[11px]">
            <Layers className="w-3.5 h-3.5 text-teal-500" />
            <span>Connection to Dialogue:</span>
          </span>
          <p className="text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed text-[11px]">
            {item.connectionToExisting || 'Continues current conversational context.'}
          </p>
        </div>
      </div>

      {/* Key Points & Questions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        {item.keyPoints?.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-txt-lightSecondary uppercase tracking-wider block">
              Key Points Extracted
            </span>
            <ul className="space-y-1">
              {item.keyPoints.map((pt, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 text-txt-lightPrimary dark:text-txt-darkPrimary text-[11px]"
                >
                  <CheckCircle2 className="w-3 h-3 text-teal-500 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.questionsAndRequests?.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-txt-lightSecondary uppercase tracking-wider block">
              Questions & Inquiries Asked
            </span>
            <ul className="space-y-1">
              {item.questionsAndRequests.map((q, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 text-txt-lightPrimary dark:text-txt-darkPrimary text-[11px]"
                >
                  <HelpCircle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actionable Insights */}
      {item.actionableInsights?.length > 0 && (
        <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-900/40 space-y-1">
          <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Actionable Safety & Boundary Advice:</span>
          </span>
          <ul className="space-y-1 pt-0.5">
            {item.actionableInsights.map((ins, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-[11px] text-teal-900 dark:text-teal-200 leading-relaxed"
              >
                <ArrowRight className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
                <span>{ins}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
