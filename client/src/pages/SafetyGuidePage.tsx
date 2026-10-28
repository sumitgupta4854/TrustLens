import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, AlertCircle, Phone, Lock, HeartHandshake } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function SafetyGuidePage() {
  return (
    <div className="min-h-screen bg-ivory-100 dark:bg-navy-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to TrustLens</span>
        </Link>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-500" />
            <h1 className="text-3xl font-extrabold text-text-lightPrimary dark:text-text-darkPrimary">
              Dating Safety Guidance & Best Practices
            </h1>
          </div>
          <p className="text-sm text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
            Practical strategies for establishing clear personal boundaries and safeguarding your well-being online and in person.
          </p>
        </div>

        {/* Emergency Resources */}
        <div className="card p-6 border border-red-200 dark:border-red-900/50 bg-red-50/20 dark:bg-red-950/20 space-y-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
            <Phone className="w-4 h-4" />
            <span>Immediate Safety Support Resources</span>
          </div>
          <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
            If you feel in immediate danger, contact your local emergency services (e.g. 911 in North America, 112 in the EU, or 999 in the UK).
          </p>
          <ul className="text-xs space-y-1 text-text-lightPrimary dark:text-text-darkPrimary font-medium">
            <li>• National Domestic Violence Hotline: 1-800-799-SAFE (7233) or text "START" to 88788</li>
            <li>• Cyber Civil Rights Initiative Helpline (Intimate Media Protection): 844-878-2274</li>
            <li>• Crisis Text Line: Text "HOME" to 741741</li>
          </ul>
        </div>

        {/* Core Principles */}
        <div className="space-y-6">
          <div className="card p-6 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 space-y-3">
            <h2 className="text-base font-bold text-text-lightPrimary dark:text-text-darkPrimary">
              1. The Principle of Gradual Disclosure
            </h2>
            <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
              Trust develops over time through consistent, observable actions—not through dramatic declarations. Keep sensitive identifiers (home address, personal schedules, employer name, family details) private until you have verified each other's presence in real life.
            </p>
          </div>

          <div className="card p-6 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 space-y-3">
            <h2 className="text-base font-bold text-text-lightPrimary dark:text-text-darkPrimary">
              2. Financial Boundaries are Non-Negotiable
            </h2>
            <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
              There is virtually no legitimate scenario where someone you met online needs money, gift cards, or crypto transfers before you have built a verified offline connection. Recognize that emotional guilt and urgency are the primary mechanisms used to disarm financial hesitation.
            </p>
          </div>

          <div className="card p-6 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 space-y-3">
            <h2 className="text-base font-bold text-text-lightPrimary dark:text-text-darkPrimary">
              3. First Meetup Protocol
            </h2>
            <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed">
              Always select a public venue during daylight or busy hours. Arrange your own transit, let a trusted friend know your location, and avoid getting into an unfamiliar vehicle on the first date.
            </p>
          </div>
        </div>

        <div className="pt-4 text-center">
          <Link to="/analyze">
            <Button variant="primary" size="md">
              Try the Conversation Analyzer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
