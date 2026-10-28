import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface ChecklistItem {
  id: string;
  category: string;
  text: string;
  explanation: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'fin-1',
    category: 'Financial Safety',
    text: 'Never transfer money, cryptocurrency, or gift cards to someone you have not met in person.',
    explanation: 'Scammers frequently construct dramatic emergencies (frozen accounts, travel distress, hospital fees) to test compliance and elicit funds.',
  },
  {
    id: 'fin-2',
    category: 'Financial Safety',
    text: 'Do not invest in crypto or business opportunities recommended by an online romantic connection.',
    explanation: 'Romance investment scams ("pig butchering") involve weeks of grooming followed by fabricated cryptocurrency returns.',
  },
  {
    id: 'info-1',
    category: 'Personal Information',
    text: 'Never disclose two-factor SMS authentication codes, passwords, or PINs.',
    explanation: 'Verification codes allow unauthorized account takeovers of your Google, Apple, or social profiles.',
  },
  {
    id: 'info-2',
    category: 'Personal Information',
    text: 'Keep your exact residential address and workplace private during early chats.',
    explanation: 'Early privacy prevents unwanted physical visits or doxxing before mutual safety and trust are verified.',
  },
  {
    id: 'photo-1',
    category: 'Intimate Photographs',
    text: 'Never feel pressured to send intimate or compromising photos.',
    explanation: 'Once sent, digital photos can be archived, leaked, or used for coercive extortion. A respectful partner accepts "no" on the first request.',
  },
  {
    id: 'meet-1',
    category: 'First-Meeting Precautions',
    text: 'Always meet in a well-lit, populated public location (e.g. busy coffee shop or cafe).',
    explanation: 'Avoid private residences, isolated trails, or unfamiliar vehicles for initial meetups.',
  },
  {
    id: 'meet-2',
    category: 'First-Meeting Precautions',
    text: 'Inform a trusted friend or family member of your meetup time, location, and date name.',
    explanation: 'Share a live location pin or agree on a safety check-in call with your trusted contact.',
  },
  {
    id: 'meet-3',
    category: 'First-Meeting Precautions',
    text: 'Arrange your own independent transportation to and from the venue.',
    explanation: 'Ensuring you can leave whenever you wish protects your autonomy throughout the date.',
  },
  {
    id: 'emot-1',
    category: 'Emotional Pacing',
    text: 'Beware of love-bombing, premature soulmate claims, and artificial urgency.',
    explanation: 'Rapid emotional acceleration is often used to bypass normal rational boundary assessments.',
  },
  {
    id: 'rep-1',
    category: 'Reporting & Blocking',
    text: 'Document evidence (take screenshots) before blocking threatening profiles.',
    explanation: 'Screenshots preserve critical evidence for dating platform trust & safety investigations or law enforcement reports if needed.',
  },
];

export function SafetyChecklistPage() {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('trustlens_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('trustlens_checklist', JSON.stringify(completed));
    } catch {}
  }, [completed]);

  const toggleItem = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => {
    if (window.confirm('Reset all checklist progress?')) {
      setCompleted({});
    }
  };

  const total = CHECKLIST_ITEMS.length;
  const doneCount = Object.values(completed).filter(Boolean).length;
  const progressPercent = Math.round((doneCount / total) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-lightPrimary dark:text-text-darkPrimary tracking-tight">
            Interactive Safety Checklist
          </h1>
          <p className="text-sm text-text-lightSecondary dark:text-text-darkSecondary mt-1 leading-relaxed">
            Essential precautions for online communication and in-person meetups.
          </p>
        </div>
        {doneCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetAll} className="gap-1.5 text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </Button>
        )}
      </div>

      {/* Progress Bar Card */}
      <div className="card p-5 border border-teal-200 dark:border-navy-700 bg-teal-50/20 dark:bg-teal-950/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-300">
            <ShieldCheck className="w-4 h-4" />
            <span>Safety Preparedness: {doneCount} of {total} Complete</span>
          </div>
          <span className="font-mono text-teal-600 dark:text-teal-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-ivory-300 dark:bg-navy-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-teal-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist List */}
      <div className="space-y-3">
        {CHECKLIST_ITEMS.map((item) => {
          const isDone = !!completed[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`card p-4 border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                isDone
                  ? 'border-teal-300 dark:border-teal-800 bg-teal-50/10 dark:bg-teal-950/5'
                  : 'border-ivory-300 dark:border-navy-700 hover:border-teal-400'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-teal-600 dark:text-teal-400 shrink-0"
                aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-teal-500" />
                ) : (
                  <Square className="w-5 h-5 text-text-lightSecondary" />
                )}
              </button>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-lightSecondary dark:text-text-darkSecondary">
                    {item.category}
                  </span>
                </div>
                <h4
                  className={`text-sm font-semibold transition-colors ${
                    isDone
                      ? 'line-through text-text-lightSecondary dark:text-text-darkSecondary'
                      : 'text-text-lightPrimary dark:text-text-darkPrimary'
                  }`}
                >
                  {item.text}
                </h4>
                <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
