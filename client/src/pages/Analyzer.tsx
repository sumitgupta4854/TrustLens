import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { analysisApi, aiChatApi } from '../services/api';
import {
  AnalysisResult,
  ChatMessage,
  AnalyzedMessageItem,
  UserMessagesOverallAnalysis,
} from '../types';
import { DEMO_SCENARIOS, DemoScenario } from '../utils/demoData';
import { AnalysisResultsView } from '../components/analyzer/AnalysisResultsView';
import { AnalysisFeatureDropdown, AnalysisFeatureOption, ANALYSIS_FEATURES } from '../components/analyzer/AnalysisFeatureDropdown';
import { AnalysisDashboardView } from '../components/analyzer/AnalysisDashboardView';
import { UserMessagesAnalysisView } from '../components/analyzer/UserMessagesAnalysisView';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui';
import {
  Search,
  Trash2,
  Lock,
  Sparkles,
  Layers,
  UserX,
  FileText,
  BarChart3,
  MessageSquare,
} from 'lucide-react';
import { getApiErrorMessage } from '../utils';

export function AnalyzerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');
  const currentTab: 'scan' | 'messages' | 'dashboard' =
    tabParam === 'dashboard' ? 'dashboard' : tabParam === 'messages' ? 'messages' : 'scan';

  // Analysis form states
  const [conversationText, setConversationText] = useState('');
  const [situationDescription, setSituationDescription] = useState('');
  const [selectedFeatureId, setSelectedFeatureId] = useState('general_safety');
  const [anonymize, setAnonymize] = useState(false);
  const [saveConsent, setSaveConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [savedAnalysisId, setSavedAnalysisId] = useState<string | null>(null);

  // User Messages Analysis States
  const [userMessages, setUserMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('trustlens_chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [analyzedMsgIds, setAnalyzedMsgIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('trustlens_analyzed_message_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newMessagesAnalysis, setNewMessagesAnalysis] = useState<AnalyzedMessageItem[]>([]);
  const [existingMessagesAnalysis, setExistingMessagesAnalysis] = useState<AnalyzedMessageItem[]>([]);
  const [msgOverallAnalysis, setMsgOverallAnalysis] = useState<UserMessagesOverallAnalysis | null>(null);
  const [loadingUserMsgs, setLoadingUserMsgs] = useState(false);

  const charCount = conversationText.length;
  const maxChars = 25000;

  const handleTabChange = (tab: 'scan' | 'messages' | 'dashboard') => {
    if (tab === 'dashboard') setSearchParams({ tab: 'dashboard' });
    else if (tab === 'messages') setSearchParams({ tab: 'messages' });
    else setSearchParams({});
    setError(null);
  };

  // Fetch and analyze user messages
  const fetchAndAnalyzeUserMessages = async (forceReanalyze = false) => {
    setLoadingUserMsgs(true);
    try {
      let currentLocal: ChatMessage[] = [];
      try {
        const stored = localStorage.getItem('trustlens_chat_history');
        if (stored) currentLocal = JSON.parse(stored);
      } catch {}

      const userMsgs = currentLocal.filter((m) => m.role === 'user');
      setUserMessages(currentLocal);

      if (userMsgs.length === 0) {
        setNewMessagesAnalysis([]);
        setExistingMessagesAnalysis([]);
        return;
      }

      const alreadyIds = forceReanalyze ? [] : analyzedMsgIds;
      const res = await aiChatApi.analyzeMessages({
        messages: currentLocal.map((m) => ({
          id: m.id,
          messageId: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        })),
        alreadyAnalyzedIds: alreadyIds,
        forceReanalyze,
      });

      if (res.data.success) {
        setNewMessagesAnalysis(res.data.newMessagesAnalysis);
        setExistingMessagesAnalysis(res.data.existingMessagesAnalysis);
        setMsgOverallAnalysis(res.data.overallAnalysis);

        const newlyAnalyzed = res.data.newMessagesAnalysis.map((m) => m.messageId);
        const allIds = forceReanalyze
          ? newlyAnalyzed
          : Array.from(new Set([...analyzedMsgIds, ...newlyAnalyzed]));

        setAnalyzedMsgIds(allIds);
        try {
          localStorage.setItem('trustlens_analyzed_message_ids', JSON.stringify(allIds));
        } catch {}
      }
    } catch (err: any) {
      console.warn('Failed to analyze user messages:', err);
    } finally {
      setLoadingUserMsgs(false);
    }
  };

  useEffect(() => {
    if (currentTab === 'messages') {
      fetchAndAnalyzeUserMessages(false);
    }
  }, [currentTab]);

  const handleSelectFeature = (feature: AnalysisFeatureOption) => {
    setSelectedFeatureId(feature.id);
  };

  const handleApplyContextPrompt = (contextPrompt: string) => {
    setSituationDescription(contextPrompt);
  };

  const handleSelectScenario = (scenario: DemoScenario) => {
    setConversationText(scenario.conversationText);
    setError(null);
    setAnalysisResult(null);
  };

  const handleClear = () => {
    setConversationText('');
    setSituationDescription('');
    setError(null);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (charCount < 10) {
      setError('Please provide at least 10 characters of conversation text to analyze.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await analysisApi.analyze(conversationText, {
        situationDescription: situationDescription.trim() || undefined,
        analysisType: selectedFeatureId,
        anonymize,
        saveHistoryConsent: saveConsent,
      });
      setAnalysisResult(res.data.analysis);
      setSavedAnalysisId(res.data.savedAnalysisId);
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-lightbg-300 dark:border-midnight-700">
        <div>
          <h1 className="text-2xl font-bold text-txt-lightPrimary dark:text-txt-darkPrimary tracking-tight">
            AI Conversation Analysis
          </h1>
          <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary mt-1 leading-relaxed">
            Evidence-based pattern identification, boundary tracking, and multi-conversation intelligence.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap sm:flex-nowrap items-center p-1 rounded-xl bg-lightbg-200 dark:bg-midnight-850 border border-lightbg-300 dark:border-midnight-700 gap-1 w-full sm:w-auto max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('scan')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex-1 sm:flex-initial whitespace-nowrap min-h-[38px] ${
              currentTab === 'scan'
                ? 'bg-white dark:bg-midnight-700 text-teal-700 dark:text-teal-300 shadow-soft-sm'
                : 'text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-txt-lightPrimary dark:hover:text-txt-darkPrimary'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span>Single Chat Scan</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('messages')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex-1 sm:flex-initial whitespace-nowrap min-h-[38px] ${
              currentTab === 'messages'
                ? 'bg-white dark:bg-midnight-700 text-teal-700 dark:text-teal-300 shadow-soft-sm'
                : 'text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-txt-lightPrimary dark:hover:text-txt-darkPrimary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span>Sent Messages</span>
            {userMessages.filter((m) => m.role === 'user').length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-100 dark:bg-teal-500/30 text-teal-800 dark:text-teal-200 font-mono font-bold">
                {userMessages.filter((m) => m.role === 'user').length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('dashboard')}
            className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex-1 sm:flex-initial whitespace-nowrap min-h-[38px] ${
              currentTab === 'dashboard'
                ? 'bg-white dark:bg-midnight-700 text-teal-700 dark:text-teal-300 shadow-soft-sm'
                : 'text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-txt-lightPrimary dark:hover:text-txt-darkPrimary'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span>All Chats</span>
          </button>
        </div>
      </div>

      {/* Render Active View Tab */}
      {currentTab === 'dashboard' ? (
        <AnalysisDashboardView onStartSingleAnalysis={() => handleTabChange('scan')} />
      ) : currentTab === 'messages' ? (
        <UserMessagesAnalysisView
          newMessages={newMessagesAnalysis}
          existingMessages={existingMessagesAnalysis}
          overallAnalysis={msgOverallAnalysis}
          loading={loadingUserMsgs}
          onAnalyzeNew={() => fetchAndAnalyzeUserMessages(false)}
          onReanalyzeAll={() => fetchAndAnalyzeUserMessages(true)}
          onSwitchToChat={() => navigate('/chat')}
        />
      ) : (
        /* Render Single Chat Scan Tab */
        <div className="space-y-6">
          {/* Demo Scenario Quick-Pickers */}
          {!analysisResult && (
            <div className="card p-4 border border-teal-200 dark:border-midnight-700 bg-teal-50/20 dark:bg-midnight-900/50">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
                <Layers className="w-4 h-4" />
                <span>Quick-Load a Practice Scenario</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {DEMO_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => handleSelectScenario(scenario)}
                    className="p-3 rounded-xl border border-lightbg-300 dark:border-midnight-700 bg-white dark:bg-midnight-850 hover:border-teal-400 dark:hover:border-teal-500 text-left transition-colors space-y-1"
                  >
                    <div className="text-xs font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
                      {scenario.title}
                    </div>
                    <div className="text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary line-clamp-1">
                      {scenario.subtitle}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <Alert type="error">{error}</Alert>}

          {/* Show Results or Input Area */}
          {analysisResult ? (
            <AnalysisResultsView
              analysis={analysisResult}
              savedAnalysisId={savedAnalysisId}
              onReset={() => setAnalysisResult(null)}
              onRegenerateReplies={handleAnalyze}
            />
          ) : (
            <div className="space-y-4">
              <div className="card p-5 border border-lightbg-300 dark:border-midnight-700 bg-white dark:bg-midnight-900 space-y-5">
                {/* Dedicated Categorized Feature Dropdown */}
                <AnalysisFeatureDropdown
                  selectedFeatureId={selectedFeatureId}
                  onSelectFeature={handleSelectFeature}
                  onApplyContextPrompt={handleApplyContextPrompt}
                />

                {/* Situation Context Input */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-txt-lightSecondary dark:text-txt-darkSecondary flex items-center gap-1.5 mb-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-500" />
                    <span>Optional Background Context (Dating App, Timeline, Platform)</span>
                  </label>
                  <input
                    type="text"
                    value={situationDescription}
                    onChange={(e) => setSituationDescription(e.target.value)}
                    placeholder="Optional background context (e.g. Matched on Hinge, haven't met in person yet)..."
                    className="input-base py-2.5 text-xs"
                  />
                </div>

                {/* Conversation Excerpt Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-txt-lightSecondary dark:text-txt-darkSecondary">
                      Conversation Dialogue or Messages
                    </label>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono ${
                          charCount > maxChars
                            ? 'text-coral-500 font-bold'
                            : 'text-txt-lightSecondary dark:text-txt-darkSecondary'
                        }`}
                      >
                        {charCount.toLocaleString()} / {maxChars.toLocaleString()} chars
                      </span>
                      {charCount > 0 && (
                        <button
                          onClick={handleClear}
                          className="text-xs text-txt-lightSecondary hover:text-coral-500 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    value={conversationText}
                    onChange={(e) => setConversationText(e.target.value)}
                    placeholder="Paste conversation messages here (e.g. Alex: Hey! How was your day?)..."
                    rows={10}
                    className="w-full input-base resize-y font-mono text-xs sm:text-sm leading-relaxed p-4"
                    disabled={loading}
                  />
                </div>

                {/* Privacy Invariants & Options */}
                <div className="pt-2 border-t border-lightbg-200 dark:border-midnight-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2 text-txt-lightSecondary dark:text-txt-darkSecondary">
                    <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>
                      <strong>Strict Privacy:</strong> Raw text is analyzed in memory and immediately discarded.
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-txt-lightPrimary dark:text-txt-darkPrimary">
                      <input
                        type="checkbox"
                        checked={anonymize}
                        onChange={(e) => setAnonymize(e.target.checked)}
                        className="rounded text-teal-500 focus:ring-teal-400 w-4 h-4"
                      />
                      <span className="flex items-center gap-1">
                        <UserX className="w-3.5 h-3.5 text-txt-lightSecondary" />
                        Auto-Redact Personal Info
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-txt-lightPrimary dark:text-txt-darkPrimary">
                      <input
                        type="checkbox"
                        checked={saveConsent}
                        onChange={(e) => setSaveConsent(e.target.checked)}
                        className="rounded text-teal-500 focus:ring-teal-400 w-4 h-4"
                      />
                      <span>Save findings to private history</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-1">
                <Button
                  variant="primary"
                  size="lg"
                  loading={loading}
                  onClick={handleAnalyze}
                  className="gap-2 px-8 w-full sm:w-auto min-h-[46px]"
                  disabled={charCount < 10 || charCount > maxChars}
                >
                  <Search className="w-5 h-5 shrink-0" />
                  <span>{loading ? 'Evaluating Patterns…' : 'Analyze Conversation'}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
