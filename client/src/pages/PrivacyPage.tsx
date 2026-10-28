import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft, ShieldCheck, Database, Trash2 } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory-100 dark:bg-navy-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <h1 className="text-3xl font-extrabold text-text-lightPrimary dark:text-text-darkPrimary">
              TrustLens Privacy Policy & Retention Architecture
            </h1>
          </div>
          <p className="text-sm text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
            How we protect your sensitive dating messages and maintain complete transparency.
          </p>
        </div>

        <div className="space-y-6">
          <div className="card p-6 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 space-y-3">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold text-sm">
              <Database className="w-4 h-4" />
              <span>1. Zero Raw Conversation Text Storage</span>
            </div>
            <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
              When you submit conversation text to TrustLens, it is evaluated strictly in memory on our secure server. It is never written to disk, database collections, or application logs. As soon as the analysis response is dispatched to your browser, the text is purged from memory.
            </p>
          </div>

          <div className="card p-6 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 space-y-3">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>2. Opt-In Analysis History</span>
            </div>
            <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
              Analysis history is entirely optional. If you explicitly check "Save findings to my private history", TrustLens saves only the structured findings (e.g. summary, concern level, and practical recommendations). The underlying raw dialogue is discarded regardless of whether you save findings.
            </p>
          </div>

          <div className="card p-6 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
              <Trash2 className="w-4 h-4" />
              <span>3. Total Data Deletion</span>
            </div>
            <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
              You retain complete ownership over your account. You can delete individual saved analyses or permanently wipe your account and all associated boundaries with a single click in your Settings dashboard.
            </p>
          </div>

          <div className="card p-6 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 space-y-3">
            <h2 className="text-sm font-bold text-text-lightPrimary dark:text-text-darkPrimary">
              4. External AI Processing Notice
            </h2>
            <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
              If an external OpenAI-compatible LLM endpoint is configured by the operator, message excerpts are sent via encrypted HTTPS solely for inference. When no external provider is active, analysis runs locally using our rule-based Pattern Intelligence engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
