import React, { useState } from 'react';
import { ReplySuggestions } from '../../types';
import { Copy, Check, Sparkles, RefreshCw, ShieldAlert } from 'lucide-react';

interface ReplyCoachCardProps {
  suggestions: ReplySuggestions;
  onRegenerate?: () => void;
}

export function ReplyCoachCard({ suggestions, onRegenerate }: ReplyCoachCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {}
  };

  const tones = [
    {
      key: 'gentle',
      title: 'Gentle',
      desc: 'Friendly, calm & non-confrontational boundary',
      text: suggestions.gentle,
      badge: 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40',
    },
    {
      key: 'firm',
      title: 'Firm',
      desc: 'Clear, respectful & unwavering boundary',
      text: suggestions.firm,
      badge: 'bg-coral-50 text-coral-700 dark:bg-coral-400/20 dark:text-coral-300 border border-coral-200 dark:border-coral-800/40',
    },
    {
      key: 'direct',
      title: 'Direct',
      desc: 'Short, decisive & unambiguous limit',
      text: suggestions.direct,
      badge: 'bg-lightbg-200 dark:bg-midnight-800 text-txt-lightPrimary dark:text-txt-darkPrimary border border-lightbg-300 dark:border-midnight-700',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-500" />
          <h3 className="text-base font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
            AI Reply Coach Suggestions
          </h3>
        </div>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
        )}
      </div>

      <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/30 text-xs text-teal-800 dark:text-teal-300 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-teal-600 dark:text-teal-400" />
        <p className="leading-relaxed">
          <strong>Safety guidance:</strong> Never feel pressured to reply immediately. When someone uses threats, blackmail, or abusive language, not replying or blocking is often the safest choice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tones.map((tone) => (
          <div
            key={tone.key}
            className="card p-4 flex flex-col justify-between border border-lightbg-300 dark:border-midnight-700 hover:border-teal-400 dark:hover:border-teal-500/50 transition-all duration-150"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${tone.badge}`}>
                  {tone.title}
                </span>
                <button
                  onClick={() => handleCopy(tone.key, tone.text)}
                  className="p-1.5 rounded-lg text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-teal-600 dark:hover:text-teal-400 hover:bg-lightbg-200 dark:hover:bg-midnight-800 transition-colors"
                  title="Copy reply text"
                  aria-label={`Copy ${tone.title}`}
                >
                  {copiedKey === tone.key ? (
                    <Check className="w-4 h-4 text-teal-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary mb-3">
                {tone.desc}
              </p>
              <div className="p-3 rounded-xl bg-lightbg-100 dark:bg-midnight-950/70 border border-lightbg-200 dark:border-midnight-800 text-sm font-sans text-txt-lightPrimary dark:text-txt-darkPrimary leading-relaxed">
                "{tone.text}"
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-lightbg-200 dark:border-midnight-800 flex justify-end">
              <button
                onClick={() => handleCopy(tone.key, tone.text)}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1.5"
              >
                {copiedKey === tone.key ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-teal-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Response</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
