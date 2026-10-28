import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { aiChatApi } from '../services/api';
import {
  ChatMessage,
  AnalyzedMessageItem,
  UserMessagesOverallAnalysis,
} from '../types';
import { UserMessagesAnalysisView } from '../components/analyzer/UserMessagesAnalysisView';
import { Button } from '../components/ui/Button';
import { Spinner, Alert } from '../components/ui';
import {
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Shield,
  MessageCircle,
  RotateCcw,
  Bot,
  User,
  Info,
  Lock,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { getApiErrorMessage, formatTime } from '../utils';

const STARTER_PROMPTS = [
  "Help me understand this dating conversation.",
  "Someone is pressuring me to share personal photos.",
  "How can I set a healthy boundary without sounding rude?",
  "Help me reply without escalating the situation.",
  "What are the warning signs of financial manipulation?",
];

export function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'analysis' ? 'analysis' : 'chat';

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('trustlens_chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // AI Message Analysis States
  const [analyzedIds, setAnalyzedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('trustlens_analyzed_message_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newMessagesAnalysis, setNewMessagesAnalysis] = useState<AnalyzedMessageItem[]>([]);
  const [existingMessagesAnalysis, setExistingMessagesAnalysis] = useState<AnalyzedMessageItem[]>([]);
  const [overallAnalysis, setOverallAnalysis] = useState<UserMessagesOverallAnalysis | null>(null);
  const [analyzingMessages, setAnalyzingMessages] = useState(false);
  const [lastAnalysisNotice, setLastAnalysisNotice] = useState<string | null>(null);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isAnalyzingRef = useRef(false);
  const pendingAnalysisQueueRef = useRef<ChatMessage[] | null>(null);

  const handleTabChange = (tab: 'chat' | 'analysis') => {
    setSearchParams(tab === 'analysis' ? { tab: 'analysis' } : {});
  };

  // Auto-scroll to bottom on message updates (only in chat view)
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, activeTab]);

  // Persist chat in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trustlens_chat_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Persist analyzed message IDs
  useEffect(() => {
    try {
      localStorage.setItem('trustlens_analyzed_message_ids', JSON.stringify(analyzedIds));
    } catch {}
  }, [analyzedIds]);

  /**
   * Robust AI Conversation Analysis Pipeline
   * Filters user messages from AI responses, separates newly sent from previously analyzed,
   * handles race conditions, and updates Section A & B results.
   */
  const runMessagesAnalysis = useCallback(
    async (currentMessages: ChatMessage[], forceReanalyze = false) => {
      // 1. Role identification: filter ONLY user messages
      const userMsgs = currentMessages.filter((m) => m.role === 'user');
      if (userMsgs.length === 0) {
        setNewMessagesAnalysis([]);
        setExistingMessagesAnalysis([]);
        return;
      }

      // Race condition protection: prevent concurrent requests while messages are typed rapidly
      if (isAnalyzingRef.current) {
        pendingAnalysisQueueRef.current = currentMessages;
        return;
      }

      isAnalyzingRef.current = true;
      setAnalyzingMessages(true);

      try {
        const alreadyIds = forceReanalyze ? [] : analyzedIds;
        const res = await aiChatApi.analyzeMessages({
          messages: currentMessages.map((m) => ({
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
          setOverallAnalysis(res.data.overallAnalysis);

          // Update analyzed message IDs
          const newlyAnalyzedIds = res.data.newMessagesAnalysis.map((m) => m.messageId);
          const allNewIds = forceReanalyze
            ? newlyAnalyzedIds
            : Array.from(new Set([...analyzedIds, ...newlyAnalyzedIds]));

          setAnalyzedIds(allNewIds);

          if (res.data.newMessagesAnalysis.length > 0) {
            const latest = res.data.newMessagesAnalysis[res.data.newMessagesAnalysis.length - 1];
            setLastAnalysisNotice(
              `AI Analyzed: "${latest.content.slice(0, 35)}..." (${latest.category})`
            );
            setTimeout(() => setLastAnalysisNotice(null), 7000);
          }
        }
      } catch (err: any) {
        console.warn('AI message analysis error:', err);
      } finally {
        isAnalyzingRef.current = false;
        setAnalyzingMessages(false);

        // Process any queued messages sent during the analysis
        if (pendingAnalysisQueueRef.current) {
          const queued = pendingAnalysisQueueRef.current;
          pendingAnalysisQueueRef.current = null;
          runMessagesAnalysis(queued, false);
        }
      }
    },
    [analyzedIds]
  );

  // Run initial analysis on mount if messages exist
  useEffect(() => {
    if (messages.some((m) => m.role === 'user')) {
      runMessagesAnalysis(messages, false);
    }
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setError(null);
    const userMsgId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setLoading(true);

    try {
      // Send chat history (last 10 messages for context)
      const apiHistory = updatedMessages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await aiChatApi.sendMessage(text, apiHistory.slice(0, -1), userMsgId);

      const aiMsg: ChatMessage = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        role: 'assistant',
        content: res.data.response,
        timestamp: new Date().toISOString(),
        engine: res.data.engine,
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // Trigger AI Conversation Analysis on the updated messages
      runMessagesAnalysis(finalMessages, false);
    } catch (err: any) {
      setError(getApiErrorMessage(err));
      // Still trigger analysis on the user message even if chat assistant fails
      runMessagesAnalysis(updatedMessages, false);
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyzeAll = async () => {
    try {
      await aiChatApi.reanalyzeAll();
    } catch {}
    setAnalyzedIds([]);
    try {
      localStorage.removeItem('trustlens_analyzed_message_ids');
    } catch {}
    runMessagesAnalysis(messages, true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const handleClearChat = () => {
    setMessages([]);
    setAnalyzedIds([]);
    setNewMessagesAnalysis([]);
    setExistingMessagesAnalysis([]);
    setOverallAnalysis(null);
    localStorage.removeItem('trustlens_chat_history');
    localStorage.removeItem('trustlens_analyzed_message_ids');
    setShowClearConfirm(false);
    setError(null);
  };

  const handleRetryLast = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      handleSend(lastUserMessage.content);
    }
  };

  const totalUserMessages = messages.filter((m) => m.role === 'user').length;
  const totalAnalyzed = newMessagesAnalysis.length + existingMessagesAnalysis.length;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-4xl mx-auto space-y-4">
      {/* Chat Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-lightbg-300 dark:border-midnight-700 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-soft-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center gap-2">
              <span>AI Safety Chat & Message Analysis</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-semibold uppercase tracking-wider">
                Companion
              </span>
            </h1>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary">
              Interactive dating safety guidance with automatic user message analysis & boundary tracking.
            </p>
          </div>
        </div>

        {/* Tab Switcher & Clear Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-lightbg-200 dark:bg-midnight-850 border border-lightbg-300 dark:border-midnight-700">
            <button
              type="button"
              onClick={() => handleTabChange('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-midnight-700 text-teal-700 dark:text-teal-300 shadow-soft-sm'
                  : 'text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-txt-lightPrimary'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('analysis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                activeTab === 'analysis'
                  ? 'bg-white dark:bg-midnight-700 text-teal-700 dark:text-teal-300 shadow-soft-sm'
                  : 'text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-txt-lightPrimary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              <span>Message Analysis</span>
              {totalUserMessages > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-100 dark:bg-teal-500/30 text-teal-800 dark:text-teal-200 font-mono font-bold">
                  {totalAnalyzed || totalUserMessages}
                </span>
              )}
              {newMessagesAnalysis.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" title="New messages analyzed" />
              )}
            </button>
          </div>

          {messages.length > 0 && (
            <div className="relative">
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs text-txt-lightSecondary hover:text-coral-500 flex items-center gap-1.5 p-2 rounded-xl hover:bg-lightbg-200 dark:hover:bg-midnight-800 transition-colors"
                  title="Clear conversation and analysis"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Clear</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-white dark:bg-midnight-900 border border-coral-200 dark:border-coral-400/30 p-1.5 rounded-xl shadow-soft-md animate-fade-in text-xs">
                  <span className="text-txt-lightPrimary dark:text-txt-darkPrimary pl-2">Clear all?</span>
                  <Button variant="danger" size="sm" onClick={handleClearChat} className="px-2 py-1 text-xs">
                    Yes
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(false)} className="px-2 py-1 text-xs">
                    No
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Analysis Notice if in Chat View */}
      {activeTab === 'chat' && lastAnalysisNotice && (
        <div className="p-2.5 px-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-200 flex items-center justify-between gap-3 animate-fade-in shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">{lastAnalysisNotice}</span>
          </div>
          <button
            onClick={() => handleTabChange('analysis')}
            className="font-bold underline hover:text-teal-900 dark:hover:text-white shrink-0 flex items-center gap-1"
          >
            <span>View Analysis</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* RENDER VIEW ACCORDING TO ACTIVE TAB */}
      {activeTab === 'analysis' ? (
        /* ========================================================================= */
        /* AI CONVERSATION ANALYSIS VIEW FOR USER MESSAGES */
        /* ========================================================================= */
        <div className="flex-1 overflow-y-auto pr-1">
          <UserMessagesAnalysisView
            newMessages={newMessagesAnalysis}
            existingMessages={existingMessagesAnalysis}
            overallAnalysis={overallAnalysis}
            loading={analyzingMessages}
            onAnalyzeNew={() => runMessagesAnalysis(messages, false)}
            onReanalyzeAll={handleReanalyzeAll}
            onSwitchToChat={() => handleTabChange('chat')}
          />
        </div>
      ) : (
        /* ========================================================================= */
        /* INTERACTIVE CHAT VIEW */
        /* ========================================================================= */
        <>
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-6 animate-fade-in">
                <div className="w-16 h-16 rounded-3xl bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-soft-sm">
                  <Sparkles className="w-8 h-8" />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <h2 className="text-lg font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
                    How can I support your safety today?
                  </h2>
                  <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
                    Type messages, ask questions about dating boundaries, or practice responses. Every message you send is automatically analyzed and categorized.
                  </p>
                </div>

                {/* Starter Prompts */}
                <div className="max-w-lg mx-auto space-y-2 pt-2">
                  <span className="text-xs font-semibold text-txt-lightSecondary dark:text-txt-darkSecondary uppercase tracking-wider block">
                    Suggested Starters
                  </span>
                  <div className="flex flex-col gap-2">
                    {STARTER_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(prompt)}
                        className="p-3 text-left rounded-xl border border-lightbg-300 dark:border-midnight-700 bg-white dark:bg-midnight-900 hover:border-teal-400 dark:hover:border-teal-500/50 hover:bg-teal-50/20 dark:hover:bg-teal-950/20 text-xs font-medium text-txt-lightPrimary dark:text-txt-darkPrimary transition-all duration-150 flex items-center justify-between group"
                      >
                        <span>"{prompt}"</span>
                        <Send className="w-3.5 h-3.5 text-txt-lightSecondary opacity-0 group-hover:opacity-100 transition-opacity text-teal-500" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy Invariant Note */}
                <div className="max-w-md mx-auto p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/30 text-[11px] text-teal-800 dark:text-teal-300 flex items-center gap-2 text-left">
                  <Lock className="w-3.5 h-3.5 shrink-0 text-teal-600 dark:text-teal-400" />
                  <span>
                    Sent messages are analyzed to protect your personal boundaries and privacy. Messages are never shared with third parties.
                  </span>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-fade-in ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-soft-sm mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm space-y-2 relative group ${
                      msg.role === 'user'
                        ? 'bg-teal-500 text-white rounded-tr-sm'
                        : 'bg-white dark:bg-midnight-900 border border-lightbg-300 dark:border-midnight-700 text-txt-lightPrimary dark:text-txt-darkPrimary rounded-tl-sm'
                    }`}
                  >
                    {/* Message Content */}
                    <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                      {msg.content}
                    </div>

                    {/* Footer metadata */}
                    <div
                      className={`flex items-center justify-between gap-4 pt-1 text-[10px] ${
                        msg.role === 'user'
                          ? 'text-teal-100'
                          : 'text-txt-lightSecondary dark:text-txt-darkSecondary'
                      }`}
                    >
                      <span className="font-mono">{formatTime(msg.timestamp)}</span>
                      {msg.role === 'assistant' ? (
                        <div className="flex items-center gap-2">
                          {msg.engine && (
                            <span className="font-mono opacity-75">
                              {msg.engine === 'ai_llm' ? 'AI Neural' : 'Safety Engine'}
                            </span>
                          )}
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="p-1 rounded hover:bg-lightbg-200 dark:hover:bg-midnight-800 transition-colors text-txt-lightSecondary hover:text-teal-600"
                            title="Copy message"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-teal-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleTabChange('analysis')}
                          className="hover:underline flex items-center gap-1 opacity-90 hover:opacity-100"
                          title="View AI analysis of your message"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Analyzed</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-midnight-850 dark:bg-midnight-800 flex items-center justify-center text-txt-lightPrimary dark:text-txt-darkPrimary shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-soft-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-midnight-900 border border-lightbg-300 dark:border-midnight-700 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary ml-2">
                    Thinking through safety principles…
                  </span>
                </div>
              </div>
            )}

            {/* Error and retry */}
            {error && (
              <div className="p-3 rounded-xl bg-coral-50 dark:bg-coral-950/20 border border-coral-200 dark:border-coral-800/40 text-xs text-coral-700 dark:text-coral-300 flex items-center justify-between gap-3">
                <span>{error}</span>
                <Button variant="secondary" size="sm" onClick={handleRetryLast} className="px-2.5 py-1 text-xs gap-1">
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry</span>
                </Button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer Input Box */}
          <div className="card p-3 border border-lightbg-300 dark:border-midnight-700 bg-white dark:bg-midnight-900 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question or paste a message... (Enter to send, Shift+Enter for new line)"
                rows={1}
                disabled={loading}
                className="flex-1 input-base py-2.5 px-3.5 max-h-36 resize-none leading-relaxed text-sm bg-transparent border-0 focus:ring-0 focus:border-0"
              />

              <Button
                variant="primary"
                size="md"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="px-4 py-2.5 shrink-0"
                title="Send message"
              >
                {loading ? <Spinner className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary">
              <span>Enter to send • Shift+Enter for new line</span>
              <span>Automatically analyzed for dating boundaries</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
