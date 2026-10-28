import React from 'react';
import { AnalysisResult } from '../../types';
import { getConcernColors } from '../../utils';
import { FindingCard } from './FindingCard';
import { BoundaryCheckCard } from './BoundaryCheckCard';
import { ReplyCoachCard } from './ReplyCoachCard';
import { SafetyPlannerCard } from './SafetyPlannerCard';
import { Shield, RefreshCw, CheckCircle2, Cpu, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface AnalysisResultsViewProps {
  analysis: AnalysisResult;
  savedAnalysisId?: string | null;
  onReset: () => void;
  onRegenerateReplies?: () => void;
}

export function AnalysisResultsView({
  analysis,
  savedAnalysisId,
  onReset,
  onRegenerateReplies,
}: AnalysisResultsViewProps) {
  const concernInfo = getConcernColors(analysis.concernLevel);
  const boundaryList = analysis.boundaryAnalysis?.length
    ? analysis.boundaryAnalysis
    : analysis.boundaryChecks || [];
  const safetyList = analysis.recommendedActions?.length
    ? analysis.recommendedActions
    : analysis.safetySteps || [];
  const replies = analysis.suggestedReplies || analysis.replySuggestions;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className={`p-4 sm:p-6 rounded-2xl border ${concernInfo.border} ${concernInfo.bg} relative overflow-hidden max-w-full`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${concernInfo.badge}`}>
                {concernInfo.label}
              </span>
              <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-lightbg-200 dark:bg-midnight-800 text-txt-lightSecondary dark:text-txt-darkSecondary font-mono">
                <Cpu className="w-3 h-3 text-teal-500" />
                {analysis.engine === 'ai_llm' ? 'AI Neural Model' : 'Pattern Intelligence Engine'}
              </span>
              {analysis.evidenceStrength && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-lightbg-200 dark:bg-midnight-800 text-txt-lightSecondary dark:text-txt-darkSecondary font-medium">
                  Evidence: {analysis.evidenceStrength}
                </span>
              )}
              {savedAnalysisId && (
                <span className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saved to History
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
              Conversation Pattern Assessment
            </h2>
            <p className="text-xs sm:text-sm text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed max-w-3xl">
              {analysis.summary}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto">
            <Button variant="secondary" size="sm" onClick={onReset} className="w-full sm:w-auto min-h-[40px] justify-center">
              <RefreshCw className="w-4 h-4" />
              <span>Analyze Another</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Positive Signals (if any detected) */}
      {analysis.positiveSignals && analysis.positiveSignals.length > 0 && (
        <section className="card p-5 border border-teal-200 dark:border-teal-900/40 bg-teal-50/20 dark:bg-teal-950/10 space-y-3">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-base font-semibold">Positive Communication Signals</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.positiveSignals.map((sig, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white dark:bg-midnight-900 border border-teal-100 dark:border-teal-900/30 text-xs space-y-1">
                <div className="font-semibold text-teal-700 dark:text-teal-300">{sig.behavior}</div>
                {sig.evidence && <p className="italic text-txt-lightSecondary">"{sig.evidence}"</p>}
                <p className="text-txt-lightSecondary dark:text-txt-darkSecondary">{sig.significance}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Boundary Cross-Check */}
      {boundaryList.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-500" />
            <h3 className="text-base font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
              Personal Boundary Cross-Check
            </h3>
          </div>
          <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary">
            Evaluated against your active personal boundaries:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {boundaryList.map((check, idx) => (
              <BoundaryCheckCard key={idx} check={check} />
            ))}
          </div>
        </section>
      )}

      {/* Identified Pattern Findings */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
            Evidence-Based Findings ({analysis.findings.length})
          </h3>
          <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary">
            Concrete observations from the supplied text paired with objective pattern interpretations:
          </p>
        </div>

        {analysis.findings.length === 0 ? (
          <div className="card p-6 text-center border-dashed border-lightbg-300 dark:border-midnight-700">
            <p className="text-sm text-teal-700 dark:text-teal-300 font-medium">
              No concerning communication patterns were identified in the submitted excerpt.
            </p>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary mt-1">
              Remember that healthy initial messages are a positive sign, but cannot guarantee someone's character.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {analysis.findings.map((finding, idx) => (
              <FindingCard key={idx} finding={finding} />
            ))}
          </div>
        )}
      </section>

      {/* Possible Manipulation Patterns (if any) */}
      {analysis.possibleManipulationPatterns && analysis.possibleManipulationPatterns.length > 0 && (
        <section className="card p-5 border border-coral-200 dark:border-coral-900/30 bg-coral-50/15 dark:bg-coral-950/10 space-y-3">
          <div className="flex items-center gap-2 text-coral-600 dark:text-coral-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-semibold">Potential Manipulation Dynamics</h3>
          </div>
          <div className="space-y-2.5">
            {analysis.possibleManipulationPatterns.map((pat, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white dark:bg-midnight-900 border border-coral-100 dark:border-coral-900/20 text-xs space-y-1">
                <div className="font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">{pat.pattern}</div>
                {pat.evidence && <p className="italic text-coral-700 dark:text-coral-300">Evidence: {pat.evidence}</p>}
                <p className="text-txt-lightSecondary dark:text-txt-darkSecondary">{pat.explanation}</p>
                {pat.uncertaintyNote && (
                  <p className="text-[11px] text-txt-lightSecondary italic">{pat.uncertaintyNote}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Reply Coach */}
      {replies && (
        <section className="pt-2">
          <ReplyCoachCard suggestions={replies} onRegenerate={onRegenerateReplies} />
        </section>
      )}

      {/* Safety Planner & Responsible AI Limitations */}
      <section className="pt-2">
        <SafetyPlannerCard
          safetySteps={safetyList}
          limitations={analysis.limitations || []}
        />
      </section>
    </div>
  );
}
