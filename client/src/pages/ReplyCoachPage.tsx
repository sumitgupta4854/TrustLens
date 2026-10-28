import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui';
import { Copy, Check, Sparkles, ShieldAlert, AlertTriangle, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PresetCoach {
  id: string;
  situation: string;
  gentle: string;
  firm: string;
  direct: string;
  safetyNote?: string;
}

const PRESET_COACHES: PresetCoach[] = [
  {
    id: 'money',
    situation: 'Requests for money, crypto, or emergency wire transfers',
    gentle: "I really enjoy getting to know you, but I have a personal principle never to send money, gift cards, or crypto to someone online. I hope you understand.",
    firm: "I do not send money or financial assistance to online connections under any circumstance. Please do not ask me again.",
    direct: "No. I do not send money or financial transfers to people I meet online.",
    safetyNote: "If they claim an emergency, sudden medical bill, or customs fee, this is the #1 hallmark of romance scam scripts. Do not send funds.",
  },
  {
    id: 'photos',
    situation: 'Pressure to send private or intimate photographs',
    gentle: "I'm not comfortable sending pictures like that. I'd prefer to keep our conversation respectful and focus on getting to know each other.",
    firm: "I've already told you I don't send private photos. I expect you to respect my comfort level and stop asking.",
    direct: "I do not send intimate photos. Drop the subject.",
    safetyNote: "If they threaten to leak or post photos if you refuse, that is sextortion. Stop all contact, do not pay, and preserve screenshots for reporting.",
  },
  {
    id: 'pacing',
    situation: 'Love-bombing, rushed intimacy, or pressure to move off-app immediately',
    gentle: "I appreciate your enthusiasm, but I prefer to take things slow and get to know someone steadily over time. I'd like to stay on this app for now.",
    firm: "We've only just connected, and I need us to take things at a measured, realistic pace. I'm keeping our chats here until we meet in person.",
    direct: "This is moving too fast for me. Let's slow down, or this won't work.",
    safetyNote: "Scammers often rush to isolate you on WhatsApp or Telegram within minutes so their dating app profile isn't flagged.",
  },
  {
    id: 'location',
    situation: 'Requests for home address or insistence on a private meetup location',
    gentle: "For my safety and comfort, I always arrange my own transport and meet in busy public venues for our first few dates.",
    firm: "I do not share my home address or meet in private spaces with someone I haven't met in person yet.",
    direct: "I only meet in public coffee shops or restaurants. I will not meet at private residences.",
    safetyNote: "Never allow a first date to pick you up at your home or insist on isolated trails or private hotel rooms.",
  },
  {
    id: 'guilt',
    situation: 'Emotional guilt-tripping ("If you really liked or trusted me, you would...")',
    gentle: "My boundaries are about my personal safety and comfort, not my feelings toward you. Healthy trust is built over time.",
    firm: "Guilt-tripping me for holding healthy boundaries isn't respectful communication. I expect my limits to be honored.",
    direct: "I will not be guilt-tripped into doing something I'm uncomfortable with.",
    safetyNote: "Manipulative guilt-tripping usually accelerates if you capitulate. Standing firm tests whether they respect you as an individual.",
  },
];

export function ReplyCoachPage() {
  const [selectedId, setSelectedId] = useState<string>('money');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activePreset = PRESET_COACHES.find((p) => p.id === selectedId) || PRESET_COACHES[0];

  const handleCopy = async (toneKey: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(toneKey);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-lightPrimary dark:text-text-darkPrimary tracking-tight">
          AI Reply Coach
        </h1>
        <p className="text-sm text-text-lightSecondary dark:text-text-darkSecondary mt-1 leading-relaxed">
          Pre-crafted, respectful boundary responses. Choose the tone that best fits your communication style and current comfort level.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-xs text-teal-800 dark:text-teal-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-teal-900 dark:text-teal-100">
            Boundary Tip: Boundaries are a litmus test
          </p>
          <p className="leading-relaxed">
            A respectful person will graciously acknowledge your limits without bargaining, passive aggression, or guilt. If someone pushes back or attacks your boundary, you have your answer about their respect for you.
          </p>
        </div>
      </div>

      {/* When NOT Replying is Safer (Critical Safety Advice) */}
      <div className="p-4 rounded-xl bg-coral-500/10 border border-coral-500/25 text-xs text-text-lightPrimary dark:text-text-darkPrimary space-y-2">
        <div className="flex items-center gap-2 text-coral-600 dark:text-coral-400 font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>When NOT Replying or Blocking Immediately is the Safest Choice</span>
        </div>
        <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
          You are never obligated to reply or give closure. If someone displays any of the following, <strong>do not send a reasoned reply</strong> — take screenshots, block their profile immediately, and report them to the platform or authorities:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
          <li className="flex items-center gap-1.5 text-coral-700 dark:text-coral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500 shrink-0" />
            Explicit threats of violence, harm, or blackmail
          </li>
          <li className="flex items-center gap-1.5 text-coral-700 dark:text-coral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500 shrink-0" />
            Demanding ransom or threatening to expose images
          </li>
          <li className="flex items-center gap-1.5 text-coral-700 dark:text-coral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500 shrink-0" />
            Showing up uninvited or tracking your real-life location
          </li>
          <li className="flex items-center gap-1.5 text-coral-700 dark:text-coral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500 shrink-0" />
            Continuing contact from new numbers/accounts after being told no
          </li>
        </ul>
      </div>

      {/* Scenario Tabs */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-lightSecondary dark:text-text-darkSecondary">
          Select a Dating Situation
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_COACHES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedId(preset.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedId === preset.id
                  ? 'bg-teal-600 text-white shadow-glow-teal'
                  : 'bg-white dark:bg-navy-900 border border-ivory-300 dark:border-navy-700 text-text-lightSecondary dark:text-text-darkSecondary hover:border-teal-400'
              }`}
            >
              {preset.situation}
            </button>
          ))}
        </div>
      </div>

      {/* Reply Style Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {/* Gentle */}
        <div className="card p-5 border border-teal-500/20 dark:border-teal-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300">
                Gentle Tone
              </span>
              <button
                onClick={() => handleCopy('gentle', activePreset.gentle)}
                className="p-1.5 rounded-lg hover:bg-ivory-200 dark:hover:bg-navy-800 text-text-lightSecondary transition-colors"
                title="Copy gentle reply"
              >
                {copiedKey === 'gentle' ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary mb-3">
              Friendly, polite, and calm. Explains personal comfort without accusation or confrontation.
            </p>
            <div className="p-3.5 rounded-xl bg-ivory-100 dark:bg-navy-950 border border-ivory-200 dark:border-navy-800 text-sm text-text-lightPrimary dark:text-text-darkPrimary leading-relaxed font-sans italic">
              "{activePreset.gentle}"
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleCopy('gentle', activePreset.gentle)}
            className="w-full"
          >
            {copiedKey === 'gentle' ? 'Copied to Clipboard!' : 'Copy Gentle Reply'}
          </Button>
        </div>

        {/* Firm */}
        <div className="card p-5 border border-coral-500/25 dark:border-coral-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-coral-500/15 text-coral-700 dark:text-coral-300">
                Firm Tone
              </span>
              <button
                onClick={() => handleCopy('firm', activePreset.firm)}
                className="p-1.5 rounded-lg hover:bg-ivory-200 dark:hover:bg-navy-800 text-text-lightSecondary transition-colors"
                title="Copy firm reply"
              >
                {copiedKey === 'firm' ? <Check className="w-4 h-4 text-coral-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary mb-3">
              Clear, resolute, and unwavering. Reasserts boundary when initial gentle refusal was ignored.
            </p>
            <div className="p-3.5 rounded-xl bg-ivory-100 dark:bg-navy-950 border border-ivory-200 dark:border-navy-800 text-sm text-text-lightPrimary dark:text-text-darkPrimary leading-relaxed font-sans italic">
              "{activePreset.firm}"
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleCopy('firm', activePreset.firm)}
            className="w-full"
          >
            {copiedKey === 'firm' ? 'Copied to Clipboard!' : 'Copy Firm Reply'}
          </Button>
        </div>

        {/* Direct */}
        <div className="card p-5 border border-ivory-300 dark:border-navy-700 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-ivory-200 dark:bg-navy-800 text-text-lightPrimary dark:text-text-darkPrimary">
                Direct Tone
              </span>
              <button
                onClick={() => handleCopy('direct', activePreset.direct)}
                className="p-1.5 rounded-lg hover:bg-ivory-200 dark:hover:bg-navy-800 text-text-lightSecondary transition-colors"
                title="Copy direct reply"
              >
                {copiedKey === 'direct' ? <Check className="w-4 h-4 text-teal-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary mb-3">
              Short, decisive, and unambiguous. Sets an immediate stop without explanation or invitation to debate.
            </p>
            <div className="p-3.5 rounded-xl bg-ivory-100 dark:bg-navy-950 border border-ivory-200 dark:border-navy-800 text-sm text-text-lightPrimary dark:text-text-darkPrimary leading-relaxed font-sans italic">
              "{activePreset.direct}"
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleCopy('direct', activePreset.direct)}
            className="w-full"
          >
            {copiedKey === 'direct' ? 'Copied to Clipboard!' : 'Copy Direct Reply'}
          </Button>
        </div>
      </div>

      {/* Context Advice & AI Assistant Link */}
      {activePreset.safetyNote && (
        <div className="p-4 rounded-xl bg-ivory-100 dark:bg-navy-900 border border-ivory-300 dark:border-navy-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-lightSecondary dark:text-text-darkSecondary">
              Expert Context for this Scenario
            </span>
            <p className="text-xs text-text-lightPrimary dark:text-text-darkPrimary">
              {activePreset.safetyNote}
            </p>
          </div>
          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline shrink-0"
          >
            Discuss with AI Safety Chat <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
