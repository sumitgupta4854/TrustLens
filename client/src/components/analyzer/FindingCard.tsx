import React from 'react';
import { Finding } from '../../types';
import { getConfidenceLabel } from '../../utils';
import { AlertCircle, Quote, ArrowRight } from 'lucide-react';

interface FindingCardProps {
  finding: Finding;
}

export function FindingCard({ finding }: FindingCardProps) {
  return (
    <div className="card p-5 border border-lightbg-300 dark:border-midnight-700 hover:border-teal-300 dark:hover:border-midnight-600 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-teal-700 dark:text-teal-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
              {finding.title}
            </h4>
            <span className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary uppercase tracking-wider font-mono">
              Pattern: {finding.category.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-lightbg-200 dark:bg-midnight-800 text-txt-lightSecondary dark:text-txt-darkSecondary font-medium shrink-0">
          {getConfidenceLabel(finding.confidence)}
        </span>
      </div>

      {finding.evidence && (
        <div className="my-3 p-3 rounded-xl bg-lightbg-100 dark:bg-midnight-950/70 border border-lightbg-300 dark:border-midnight-800 text-xs">
          <div className="flex items-center gap-1.5 text-txt-lightSecondary dark:text-txt-darkSecondary mb-1 font-medium">
            <Quote className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Direct Text Evidence:</span>
          </div>
          <p className="italic text-txt-lightPrimary dark:text-txt-darkPrimary pl-4 border-l-2 border-teal-500">
            {finding.evidence}
          </p>
        </div>
      )}

      <p className="text-sm text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed mb-4">
        <strong className="text-txt-lightPrimary dark:text-txt-darkPrimary font-medium">Why This Matters: </strong>
        {finding.explanation}
      </p>

      {finding.recommendedAction && (
        <div className="flex items-start gap-2 pt-3 border-t border-lightbg-200 dark:border-midnight-800 text-xs text-teal-700 dark:text-teal-300 font-medium">
          <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>Recommended Next Step: {finding.recommendedAction}</span>
        </div>
      )}
    </div>
  );
}
