import React, { useState, useEffect } from 'react';
import { analysisApi } from '../../services/api';
import {
  MultiConversationReport,
  IndividualChatSummary,
  SavedAnalysis,
} from '../../types';
import { DEMO_SCENARIOS } from '../../utils/demoData';
import { Button } from '../ui/Button';
import { Card, Spinner, Alert } from '../ui';
import {
  TrendingUp,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Calendar,
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw,
  Layers,
  MessageCircle,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Tag,
  Clock,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import { getConcernColors, formatDate, getApiErrorMessage } from '../../utils';
import { AnalysisResultsView } from './AnalysisResultsView';

interface Props {
  onStartSingleAnalysis?: () => void;
}

export function AnalysisDashboardView({ onStartSingleAnalysis }: Props) {
  const [report, setReport] = useState<MultiConversationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [concernFilter, setConcernFilter] = useState<'all' | 'low' | 'moderate' | 'high'>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | '7days' | '30days'>('all');

  // Detailed Modal View for a specific chat
  const [selectedChat, setSelectedChat] = useState<IndividualChatSummary | null>(null);
  const [detailedSavedAnalysis, setDetailedSavedAnalysis] = useState<SavedAnalysis | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);

  // Fetch cross-conversation overview
  const fetchOverview = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Calculate date filters if any
      let start: string | undefined;
      const now = new Date();
      if (dateRangeFilter === '7days') {
        start = new Date(now.getTime() - 7 * 86400000).toISOString();
      } else if (dateRangeFilter === '30days') {
        start = new Date(now.getTime() - 30 * 86400000).toISOString();
      }

      // Also grab any practice/local chat history from localStorage to include
      let localChats: any[] = [];
      try {
        const storedLocal = localStorage.getItem('trustlens_chat_history');
        if (storedLocal) {
          const parsed = JSON.parse(storedLocal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const userMessages = parsed.filter((m: any) => m.role === 'user').map((m: any) => m.content).join(' ');
            if (userMessages.trim().length > 10) {
              localChats.push({
                id: 'local-session-1',
                title: 'AI Safety Chat Session',
                text: userMessages.slice(0, 1500),
                date: new Date().toISOString().split('T')[0],
                context: 'Recent interactive discussion with AI Safety Companion',
              });
            }
          }
        }
      } catch {}

      const res = await analysisApi.getOverview({
        conversations: localChats,
        concernFilter: concernFilter === 'all' ? undefined : concernFilter,
        focusTopic: topicFilter === 'all' ? undefined : topicFilter,
        dateRange: start ? { start } : undefined,
      });

      setReport(res.data.report);
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [concernFilter, topicFilter, dateRangeFilter]);

  const handleLoadSampleDataset = async () => {
    setLoadingSample(true);
    setError(null);
    try {
      const demoConversations = DEMO_SCENARIOS.map((s, idx) => ({
        id: `demo-${s.id}`,
        title: s.title,
        text: s.conversationText,
        date: new Date(Date.now() - idx * 86400000).toISOString().split('T')[0],
        context: s.description,
      }));
      const res = await analysisApi.getOverview({
        conversations: demoConversations,
      });
      setReport(res.data.report);
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoadingSample(false);
    }
  };

  // Inspect detail for a single conversation
  const handleInspectDetail = async (chat: IndividualChatSummary) => {
    setSelectedChat(chat);
    setDetailedSavedAnalysis(null);

    // If it's a mongo ID, fetch full saved analysis
    if (chat.id && chat.id.length === 24) {
      setDetailLoading(true);
      try {
        const res = await analysisApi.getById(chat.id);
        setDetailedSavedAnalysis(res.data.analysis);
      } catch {
        // Fallback to local summary view
      } finally {
        setDetailLoading(false);
      }
    }
  };

  // Filter individual summaries for search
  const filteredSummaries = (report?.individualSummaries || []).filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.topics.some((t) => t.toLowerCase().includes(q)) ||
      item.userIntent.toLowerCase().includes(q) ||
      item.counterpartyIntent.toLowerCase().includes(q);

    const matchesConcern = concernFilter === 'all' || item.concernLevel === concernFilter;
    const matchesTopic =
      topicFilter === 'all' || item.topics.some((t) => t.toLowerCase().includes(topicFilter.toLowerCase()));

    return matchesSearch && matchesConcern && matchesTopic;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="card p-6 border border-lightbg-300 dark:border-midnight-700 bg-white dark:bg-midnight-900 shadow-soft-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Multi-Conversation Intelligence Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-txt-lightPrimary dark:text-txt-darkPrimary tracking-tight">
              Cross-Conversation Analysis & Trends
            </h1>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed max-w-2xl">
              AI-driven synthesis across all your conversation evaluations, identifying recurring tactics, sentiment patterns, and holistic relationship boundary insights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fetchOverview(true)}
              loading={refreshing}
              className="gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Synthesis</span>
            </Button>
            {onStartSingleAnalysis && (
              <Button variant="primary" size="sm" onClick={onStartSingleAnalysis} className="gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Scan New Chat</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {loading ? (
        <div className="card p-16 text-center space-y-3 border border-lightbg-300 dark:border-midnight-700">
          <Spinner className="w-8 h-8 text-teal-500 mx-auto" />
          <p className="text-sm font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
            Synthesizing Cross-Conversation Intelligence…
          </p>
          <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary max-w-md mx-auto">
            Examining recurring topics, boundary resistance, and communication patterns across your conversations.
          </p>
        </div>
      ) : !report || report.totalConversations === 0 ? (
        <div className="card p-12 text-center border-dashed border-lightbg-300 dark:border-midnight-700 space-y-4">
          <Layers className="w-10 h-10 text-teal-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
              No Conversations Analyzed Yet
            </h3>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary max-w-md mx-auto leading-relaxed">
              When you evaluate conversations in the Analyzer and save findings, TrustLens builds an ongoing intelligence report of recurring patterns, sentiment trends, and safety recommendations here.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onStartSingleAnalysis && (
              <Button variant="primary" size="md" onClick={onStartSingleAnalysis} className="gap-2">
                <Search className="w-4 h-4" />
                <span>Analyze Your First Conversation</span>
              </Button>
            )}
            <Button
              variant="secondary"
              size="md"
              onClick={handleLoadSampleDataset}
              loading={loadingSample}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Sample Multi-Chat Intelligence</span>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 border border-lightbg-300 dark:border-midnight-700 space-y-1">
              <span className="text-[11px] font-semibold text-txt-lightSecondary dark:text-txt-darkSecondary uppercase tracking-wider">
                Total Conversations
              </span>
              <div className="text-2xl font-extrabold text-txt-lightPrimary dark:text-txt-darkPrimary font-mono">
                {report.totalConversations}
              </div>
              <p className="text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary">
                Evaluated for safety patterns
              </p>
            </div>

            <div className="card p-4 border border-lightbg-300 dark:border-midnight-700 space-y-1">
              <span className="text-[11px] font-semibold text-coral-600 dark:text-coral-400 uppercase tracking-wider">
                High Concern Flags
              </span>
              <div className="text-2xl font-extrabold text-coral-600 dark:text-coral-400 font-mono">
                {report.sentimentDistribution.concerning}
              </div>
              <p className="text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary">
                Require strict boundary enforcement
              </p>
            </div>

            <div className="card p-4 border border-lightbg-300 dark:border-midnight-700 space-y-1">
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Cautionary Patterns
              </span>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                {report.sentimentDistribution.cautious}
              </div>
              <p className="text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary">
                Pacing or boundary tests
              </p>
            </div>

            <div className="card p-4 border border-lightbg-300 dark:border-midnight-700 space-y-1">
              <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Respectful Interactions
              </span>
              <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
                {report.sentimentDistribution.positive}
              </div>
              <p className="text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary">
                Honored limits & healthy signals
              </p>
            </div>
          </div>

          {/* AI Executive Synthesis Banner */}
          <div className="card p-6 border border-teal-500/25 dark:border-teal-500/30 bg-teal-50/15 dark:bg-teal-500/10 space-y-4">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Overall Cross-Conversation Synthesis</span>
            </div>
            <p className="text-sm text-txt-lightPrimary dark:text-txt-darkPrimary leading-relaxed">
              {report.overallSummary}
            </p>

            {/* Sentiment Bar */}
            <div className="space-y-1.5 pt-2 border-t border-teal-500/20">
              <div className="flex items-center justify-between text-xs font-semibold text-txt-lightSecondary dark:text-txt-darkSecondary">
                <span>Sentiment & Risk Distribution</span>
                <span className="font-mono text-[11px]">
                  {report.totalConversations} chats total
                </span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-lightbg-300 dark:bg-midnight-800">
                {report.sentimentDistribution.positive > 0 && (
                  <div
                    style={{ width: `${(report.sentimentDistribution.positive / report.totalConversations) * 100}%` }}
                    className="bg-teal-500 transition-all"
                    title={`Positive: ${report.sentimentDistribution.positive}`}
                  />
                )}
                {report.sentimentDistribution.neutral > 0 && (
                  <div
                    style={{ width: `${(report.sentimentDistribution.neutral / report.totalConversations) * 100}%` }}
                    className="bg-slate-400 transition-all"
                    title={`Neutral: ${report.sentimentDistribution.neutral}`}
                  />
                )}
                {report.sentimentDistribution.cautious > 0 && (
                  <div
                    style={{ width: `${(report.sentimentDistribution.cautious / report.totalConversations) * 100}%` }}
                    className="bg-amber-400 transition-all"
                    title={`Cautious: ${report.sentimentDistribution.cautious}`}
                  />
                )}
                {report.sentimentDistribution.concerning > 0 && (
                  <div
                    style={{ width: `${(report.sentimentDistribution.concerning / report.totalConversations) * 100}%` }}
                    className="bg-coral-500 transition-all"
                    title={`Concerning: ${report.sentimentDistribution.concerning}`}
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1">
                <span className="flex items-center gap-1.5 text-teal-700 dark:text-teal-300">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  Positive ({report.sentimentDistribution.positive})
                </span>
                <span className="flex items-center gap-1.5 text-txt-lightSecondary">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Neutral ({report.sentimentDistribution.neutral})
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Cautious ({report.sentimentDistribution.cautious})
                </span>
                <span className="flex items-center gap-1.5 text-coral-700 dark:text-coral-300">
                  <span className="w-2 h-2 rounded-full bg-coral-500" />
                  Concerning ({report.sentimentDistribution.concerning})
                </span>
              </div>
            </div>
          </div>

          {/* User Intent & Counterparty Intent Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-5 border border-lightbg-300 dark:border-midnight-700 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                <UserCheck className="w-4 h-4" />
                <span>Detected User Communication Intent</span>
              </div>
              <ul className="space-y-2 text-xs text-txt-lightPrimary dark:text-txt-darkPrimary">
                {report.intentAnalysis.userIntent.map((intent, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                    <span>{intent}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5 border border-lightbg-300 dark:border-midnight-700 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-coral-600 dark:text-coral-400">
                <UserX className="w-4 h-4" />
                <span>Recurring Counterparty Behavioral Intent</span>
              </div>
              <ul className="space-y-2 text-xs text-txt-lightPrimary dark:text-txt-darkPrimary">
                {report.intentAnalysis.counterpartyIntent.map((intent, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-coral-500 shrink-0 mt-0.5" />
                    <span>{intent}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recurring Topics & Cross-Conversation Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recurring Topics */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-sm font-bold text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center gap-2">
                <Tag className="w-4 h-4 text-teal-500" />
                <span>Recurring Topics & Frequencies</span>
              </h3>
              <div className="space-y-2.5">
                {report.recurringTopics.map((t, idx) => (
                  <div
                    key={idx}
                    className="card p-3.5 border border-lightbg-300 dark:border-midnight-700 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
                          {t.topic}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          t.riskLevel === 'high' ? 'badge-high' : t.riskLevel === 'moderate' ? 'badge-moderate' : 'badge-low'
                        }`}>
                          {t.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      <p className="text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary leading-tight">
                        {t.description}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-lightbg-200 dark:bg-midnight-800 text-xs font-mono font-bold text-txt-lightPrimary dark:text-txt-darkPrimary shrink-0">
                      {t.frequency}x
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Conversation Repeated Patterns */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-sm font-bold text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-500" />
                <span>Cross-Conversation Patterns</span>
              </h3>
              <div className="space-y-2.5">
                {report.crossConversationPatterns.map((pat, idx) => (
                  <div
                    key={idx}
                    className="card p-3.5 border border-coral-500/20 dark:border-coral-500/30 bg-coral-50/10 dark:bg-coral-500/5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-coral-700 dark:text-coral-300">
                        {pat.pattern}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral-500/15 text-coral-600 dark:text-coral-300 font-semibold font-mono">
                        Seen in {pat.occurrenceCount} chats
                      </span>
                    </div>
                    <p className="text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary leading-tight">
                      {pat.explanation}
                    </p>
                    <div className="text-[11px] text-txt-lightPrimary dark:text-txt-darkPrimary pt-1 border-t border-coral-500/20 font-medium flex items-start gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <span>{pat.advice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Strategic Proactive Recommendations */}
          <div className="card p-5 border border-lightbg-300 dark:border-midnight-700 bg-white dark:bg-midnight-900 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              <span>AI-Generated Strategic Recommendations</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {report.strategicRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-lightbg-100 dark:bg-midnight-850 border border-lightbg-200 dark:border-midnight-800 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-txt-lightPrimary dark:text-txt-darkPrimary leading-relaxed">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Bar for Individual Conversations */}
          <div className="space-y-4 pt-4 border-t border-lightbg-300 dark:border-midnight-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
                  Individual Conversation Reports & Summaries
                </h3>
                <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary mt-0.5">
                  Select any specific chat below to review detailed findings, excerpts, and reply suggestions.
                </p>
              </div>

              <div className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary font-mono">
                Showing {filteredSummaries.length} of {report.totalConversations}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-txt-lightSecondary dark:text-txt-darkSecondary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, summary, or intent..."
                  className="input-base pl-9 py-2 text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={concernFilter}
                  onChange={(e) => setConcernFilter(e.target.value as any)}
                  className="input-base py-2 text-xs"
                >
                  <option value="all">All Concern Levels</option>
                  <option value="high">High Concern Only</option>
                  <option value="moderate">Moderate Concern Only</option>
                  <option value="low">Low Concern Only</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <select
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value as any)}
                  className="input-base py-2 text-xs"
                >
                  <option value="all">All Available Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>
            </div>

            {/* Conversation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSummaries.map((chat) => {
                const concern = getConcernColors(chat.concernLevel);
                return (
                  <div
                    key={chat.id}
                    className="card p-5 border border-lightbg-300 dark:border-midnight-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-150 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={concern.badge}>{concern.label}</span>
                            <span className="text-[10px] text-txt-lightSecondary dark:text-txt-darkSecondary font-mono">
                              {chat.date}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
                            {chat.title}
                          </h4>
                        </div>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                          chat.sentiment === 'concerning'
                            ? 'bg-coral-50 text-coral-700 dark:bg-coral-400/20 dark:text-coral-300'
                            : chat.sentiment === 'cautious'
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300'
                            : 'bg-teal-50 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300'
                        }`}>
                          {chat.sentiment}
                        </span>
                      </div>

                      <p className="text-xs text-txt-lightPrimary dark:text-txt-darkPrimary leading-relaxed line-clamp-2">
                        {chat.summary}
                      </p>

                      {/* Topic Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {chat.topics.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-lg bg-lightbg-200 dark:bg-midnight-800 text-txt-lightSecondary dark:text-txt-darkSecondary font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Key Point Excerpt */}
                      <div className="p-2.5 rounded-xl bg-lightbg-100 dark:bg-midnight-850 text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary space-y-1">
                        <div className="font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-teal-500" />
                          <span>Actionable Advice:</span>
                        </div>
                        <p className="line-clamp-2">{chat.actionableAdvice}</p>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleInspectDetail(chat)}
                      className="w-full gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Detailed Report</span>
                    </Button>
                  </div>
                );
              })}

              {filteredSummaries.length === 0 && (
                <div className="col-span-2 card p-8 text-center text-xs text-txt-lightSecondary dark:text-txt-darkSecondary">
                  No conversations match the selected filter criteria.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Detailed Report Modal */}
      {selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/70 backdrop-blur-sm animate-fade-in">
          <div className="card max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-lightbg-300 dark:border-midnight-700 bg-white dark:bg-midnight-900 p-6 space-y-5 shadow-soft-xl animate-fade-in-up">
            <div className="flex items-center justify-between pb-3 border-b border-lightbg-300 dark:border-midnight-700">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={getConcernColors(selectedChat.concernLevel).badge}>
                    {getConcernColors(selectedChat.concernLevel).label}
                  </span>
                  <span className="text-xs text-txt-lightSecondary font-mono">{selectedChat.date}</span>
                </div>
                <h3 className="text-lg font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
                  {selectedChat.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedChat(null)}
                className="p-1.5 rounded-xl hover:bg-lightbg-200 dark:hover:bg-midnight-800 text-txt-lightSecondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="py-12 text-center space-y-2">
                <Spinner className="w-6 h-6 text-teal-500 mx-auto" />
                <p className="text-xs text-txt-lightSecondary">Loading detailed analysis record…</p>
              </div>
            ) : detailedSavedAnalysis ? (
              <AnalysisResultsView
                analysis={{
                  summary: detailedSavedAnalysis.summary,
                  concernLevel: detailedSavedAnalysis.concernLevel,
                  findings: detailedSavedAnalysis.findings || [],
                  boundaryAnalysis: [],
                  boundaryChecks: [],
                  suggestedReplies: detailedSavedAnalysis.replySuggestions,
                  replySuggestions: detailedSavedAnalysis.replySuggestions,
                  recommendedActions: detailedSavedAnalysis.safetySteps || [],
                  safetySteps: detailedSavedAnalysis.safetySteps || [],
                  limitations: detailedSavedAnalysis.limitations || [],
                  engine: 'pattern_rules_fallback',
                }}
                onReset={() => setSelectedChat(null)}
              />
            ) : (
              <div className="space-y-4 text-xs">
                <div className="card p-4 bg-lightbg-100 dark:bg-midnight-850 border border-lightbg-200 dark:border-midnight-800 space-y-2">
                  <h4 className="font-bold text-txt-lightPrimary dark:text-txt-darkPrimary text-sm">
                    AI Summary & Overview
                  </h4>
                  <p className="leading-relaxed text-txt-lightPrimary dark:text-txt-darkPrimary">
                    {selectedChat.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-teal-500/20 bg-teal-50/10 space-y-1">
                    <span className="font-bold text-teal-700 dark:text-teal-300">User Intent</span>
                    <p className="text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
                      {selectedChat.userIntent}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-coral-500/20 bg-coral-50/10 space-y-1">
                    <span className="font-bold text-coral-700 dark:text-coral-300">Counterparty Intent</span>
                    <p className="text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
                      {selectedChat.counterpartyIntent}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
                    Key Analysis Points
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedChat.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-txt-lightPrimary dark:text-txt-darkPrimary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 space-y-1">
                  <span className="font-bold">Proactive Safety Recommendation</span>
                  <p className="leading-relaxed">{selectedChat.actionableAdvice}</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="secondary" size="sm" onClick={() => setSelectedChat(null)}>
                    Close Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
