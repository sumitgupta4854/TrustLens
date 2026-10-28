import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory-100 dark:bg-navy-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-violet-500" />
            <h1 className="text-3xl font-extrabold text-text-lightPrimary dark:text-text-darkPrimary">
              TrustLens Terms of Service
            </h1>
          </div>
          <p className="text-sm text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
            Essential terms regarding the intended use, limitations, and scope of TrustLens.
          </p>
        </div>

        <div className="card p-6 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 space-y-4 text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
          <h2 className="text-sm font-bold text-text-lightPrimary dark:text-text-darkPrimary">
            1. Nature of the Service
          </h2>
          <p>
            TrustLens is an educational and supportive AI companion designed to help users recognize communication patterns and maintain personal boundaries in dating contexts. TrustLens is NOT a background check service, identity verification platform, or law enforcement agency.
          </p>

          <h2 className="text-sm font-bold text-text-lightPrimary dark:text-text-darkPrimary">
            2. No Guarantee of Safety or Character
          </h2>
          <p>
            Evaluations are based solely on user-submitted text excerpts. A "low concern" outcome does NOT guarantee that an individual is safe, honest, or trustworthy. Conversely, a "high concern" outcome represents observed communication patterns, not conclusive legal proof of fraud or malice.
          </p>

          <h2 className="text-sm font-bold text-text-lightPrimary dark:text-text-darkPrimary">
            3. Prohibited Uses
          </h2>
          <p>
            You agree not to use TrustLens to harass, stalk, dox, blackmail, or retaliate against any individual. TrustLens must not be used for unauthorized surveillance or invasive private investigation.
          </p>
        </div>
      </div>
    </div>
  );
}
