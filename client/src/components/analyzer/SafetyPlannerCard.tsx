import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface SafetyPlannerCardProps {
  safetySteps: string[];
  limitations: string[];
}

export function SafetyPlannerCard({ safetySteps, limitations }: SafetyPlannerCardProps) {
  return (
    <div className="space-y-5">
      {/* Context-Aware Safety Action Plan */}
      <div className="card p-5 border border-teal-200 dark:border-teal-900/40 bg-teal-50/20 dark:bg-teal-950/10">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-base font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
            Context-Aware Safety Action Plan
          </h3>
        </div>
        <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary mb-4">
          Recommended evidence-based safety steps tailored to the patterns detected in this conversation:
        </p>

        <ul className="space-y-2.5">
          {safetySteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-txt-lightPrimary dark:text-txt-darkPrimary">
              <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Critical Limitations & Responsible AI Disclaimer */}
      <div className="card p-4 border border-lightbg-300 dark:border-midnight-700 bg-lightbg-100/50 dark:bg-midnight-900/40">
        <div className="flex items-center gap-2 mb-2 text-txt-lightSecondary dark:text-txt-darkSecondary">
          <Info className="w-4 h-4 text-teal-500" />
          <h4 className="text-xs font-semibold uppercase tracking-wider">
            Important TrustLens Limitations & Privacy Boundaries
          </h4>
        </div>
        <ul className="space-y-1.5 text-xs text-txt-lightSecondary dark:text-txt-darkSecondary">
          {limitations.map((limit, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-teal-500 font-bold">•</span>
              <span>{limit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
