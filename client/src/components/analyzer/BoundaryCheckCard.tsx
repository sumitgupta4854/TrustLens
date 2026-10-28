import React from 'react';
import { BoundaryCheck } from '../../types';
import { getBoundaryStatusInfo } from '../../utils';
import { ShieldCheck, AlertTriangle, HelpCircle, AlertOctagon } from 'lucide-react';

interface BoundaryCheckCardProps {
  check: BoundaryCheck;
}

export function BoundaryCheckCard({ check }: BoundaryCheckCardProps) {
  const statusInfo = getBoundaryStatusInfo(check.status);

  return (
    <div className="card p-4 border border-lightbg-300 dark:border-midnight-700 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {check.status === 'Repeatedly challenged' ? (
            <AlertOctagon className="w-4 h-4 text-coral-500 shrink-0" />
          ) : check.status === 'Possibly challenged' || check.status === 'potential_violation' ? (
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          ) : check.status === 'Appears respected' || check.status === 'respected' ? (
            <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
          ) : (
            <HelpCircle className="w-4 h-4 text-txt-lightSecondary shrink-0" />
          )}
          <h5 className="text-sm font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
            {check.boundaryTitle}
          </h5>
        </div>
        <span className={statusInfo.badge}>{statusInfo.label}</span>
      </div>

      {check.evidenceExcerpt && (
        <p className="text-xs italic text-txt-lightSecondary dark:text-txt-darkSecondary bg-lightbg-100 dark:bg-midnight-950 p-2.5 rounded-lg border border-lightbg-300 dark:border-midnight-800">
          Excerpt: {check.evidenceExcerpt}
        </p>
      )}

      {check.explanation && (
        <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary">
          {check.explanation}
        </p>
      )}

      {check.guidance && (
        <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
          Guidance: {check.guidance}
        </p>
      )}
    </div>
  );
}
