import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  Camera,
  DollarSign,
  BookmarkCheck,
  HeartHandshake,
  MessageSquare,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Search,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';

export interface AnalysisFeatureOption {
  id: string;
  category: 'Safety & Risk Audit' | 'Boundary & Communication' | 'Contextual & Positive Signals';
  label: string;
  badge: string;
  badgeColor: string;
  description: string;
  recommendedContext: string;
  icon: React.ElementType;
}

export const ANALYSIS_FEATURES: AnalysisFeatureOption[] = [
  // Category 1: Safety & Risk Audit
  {
    id: 'general_safety',
    category: 'Safety & Risk Audit',
    label: 'General Safety & Comprehensive Risk Audit',
    badge: 'Core Scan',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300',
    description: 'Full multi-angle audit: boundary checks, urgency indicators, manipulation tactics & safety planner.',
    recommendedContext: 'Matched recently; evaluating overall communication safety, pacing, and comfort.',
    icon: ShieldAlert,
  },
  {
    id: 'intimate_image_pressure',
    category: 'Safety & Risk Audit',
    label: 'Intimate Media & Coercion Defense',
    badge: 'High Risk',
    badgeColor: 'bg-coral-50 text-coral-700 dark:bg-coral-400/20 dark:text-coral-300',
    description: 'Checks for early photo pressure, requests to move to Snapchat/Telegram, and refusal scripts.',
    recommendedContext: 'Counterpart is repeatedly asking for private photos or pressing to move off the dating app.',
    icon: Camera,
  },
  {
    id: 'financial_pressure',
    category: 'Safety & Risk Audit',
    label: 'Financial Solicitations & Scam Detection',
    badge: 'Urgent',
    badgeColor: 'bg-amber-50 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300',
    description: 'Detects emergencies, travel fees, crypto platforms, cash apps, and sudden economic crises.',
    recommendedContext: 'Mention of travel ticket issues, hospital bills, customs fees, or crypto investments.',
    icon: DollarSign,
  },

  // Category 2: Boundary & Communication
  {
    id: 'boundary_respect',
    category: 'Boundary & Communication',
    label: 'Boundary Respect & Pushback Tracker',
    badge: 'Boundaries',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300',
    description: 'Cross-checks messages against your defined personal boundaries to evaluate if they are honored or resisted.',
    recommendedContext: 'You stated a boundary (pacing, location, or communication frequency) and want to verify respect.',
    icon: BookmarkCheck,
  },
  {
    id: 'emotional_pacing',
    category: 'Boundary & Communication',
    label: 'Emotional Pacing & Love-Bombing Radar',
    badge: 'Pacing',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300',
    description: 'Flags premature soulmate declarations, excessive praise, rushed exclusivity, and artificial intimacy.',
    recommendedContext: 'Conversation is escalating intensely or partner claims profound love after only a few days.',
    icon: HeartHandshake,
  },
  {
    id: 'communication_patterns',
    category: 'Boundary & Communication',
    label: 'Manipulation Tactics & Guilt Radar',
    badge: 'Psychology',
    badgeColor: 'bg-coral-50 text-coral-700 dark:bg-coral-400/20 dark:text-coral-300',
    description: 'Identifies subtle obligation shifts, passive-aggressive remarks, gaslighting, and defensive replies.',
    recommendedContext: 'Feeling confused or guilty after messages; evaluating whether communication is respectful.',
    icon: MessageSquare,
  },

  // Category 3: Contextual & Positive Signals
  {
    id: 'first_meetup',
    category: 'Contextual & Positive Signals',
    label: 'First-Date & In-Person Safety Protocol',
    badge: 'Meetup Prep',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300',
    description: 'Examines proposed venues, transit independence, private location pressure, and check-in plans.',
    recommendedContext: 'Discussing initial in-person meeting places and transit options for a first date.',
    icon: MapPin,
  },
  {
    id: 'positive_signals',
    category: 'Contextual & Positive Signals',
    label: 'Healthy Green Flags & Reciprocal Respect',
    badge: 'Green Flags',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300',
    description: 'Surfaces mutual curiosity, patience, balanced vulnerability, and graceful boundary acceptance.',
    recommendedContext: 'Assessing whether communication demonstrates genuine mutual respect and healthy pacing.',
    icon: CheckCircle2,
  },
];

interface Props {
  selectedFeatureId: string;
  onSelectFeature: (feature: AnalysisFeatureOption) => void;
  onApplyContextPrompt?: (contextText: string) => void;
}

export function AnalysisFeatureDropdown({
  selectedFeatureId,
  onSelectFeature,
  onApplyContextPrompt,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedFeature =
    ANALYSIS_FEATURES.find((f) => f.id === selectedFeatureId) || ANALYSIS_FEATURES[0];

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filter features by search query
  const filteredFeatures = ANALYSIS_FEATURES.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      f.label.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.badge.toLowerCase().includes(q)
    );
  });

  // Group by category
  const categories: Array<'Safety & Risk Audit' | 'Boundary & Communication' | 'Contextual & Positive Signals'> = [
    'Safety & Risk Audit',
    'Boundary & Communication',
    'Contextual & Positive Signals',
  ];

  const handleSelect = (feature: AnalysisFeatureOption) => {
    onSelectFeature(feature);
    setIsOpen(false);
  };

  const SelectedIcon = selectedFeature.icon;

  return (
    <div className="relative space-y-2" ref={dropdownRef}>
      <label className="text-xs font-semibold uppercase tracking-wider text-txt-lightSecondary dark:text-txt-darkSecondary flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" />
          <span>Analysis Feature & Focus</span>
        </span>
        <span className="text-[11px] font-normal normal-case text-teal-600 dark:text-teal-400">
          8 Specialized Modes
        </span>
      </label>

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full card p-3.5 border border-lightbg-300 dark:border-midnight-700 bg-white dark:bg-midnight-850 hover:border-teal-500/50 text-left transition-all duration-150 flex items-center justify-between gap-3 shadow-soft-sm group focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <SelectedIcon className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-txt-lightPrimary dark:text-txt-darkPrimary truncate">
                {selectedFeature.label}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${selectedFeature.badgeColor}`}>
                {selectedFeature.badge}
              </span>
            </div>
            <p className="text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary truncate mt-0.5">
              {selectedFeature.description}
            </p>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-txt-lightSecondary dark:text-txt-darkSecondary transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-teal-500' : 'group-hover:text-teal-500'
          }`}
        />
      </button>

      {/* Selected Feature Info Pill */}
      <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start sm:items-center gap-2 text-txt-lightPrimary dark:text-txt-darkPrimary">
          <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-[11px] leading-tight">
            <strong>Active Mode:</strong> {selectedFeature.description}
          </span>
        </div>

        {onApplyContextPrompt && (
          <button
            type="button"
            onClick={() => onApplyContextPrompt(selectedFeature.recommendedContext)}
            className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 hover:underline shrink-0 text-left"
          >
            + Auto-fill context suggestion
          </button>
        )}
      </div>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 top-full mt-1.5 rounded-2xl border border-lightbg-300 dark:border-midnight-700 bg-white dark:bg-midnight-900 shadow-soft-xl overflow-hidden animate-fade-in-up"
        >
          {/* Search Header */}
          <div className="p-3 border-b border-lightbg-300 dark:border-midnight-700 bg-lightbg-100/50 dark:bg-midnight-950/50">
            <div className="relative">
              <Search className="w-4 h-4 text-txt-lightSecondary dark:text-txt-darkSecondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features (e.g. photos, money, pacing, green flags)..."
                className="w-full bg-white dark:bg-midnight-850 border border-lightbg-300 dark:border-midnight-700 rounded-xl pl-9 pr-3 py-2 text-xs text-txt-lightPrimary dark:text-txt-darkPrimary outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Categorized Options List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-3">
            {categories.map((category) => {
              const categoryFeatures = filteredFeatures.filter((f) => f.category === category);
              if (categoryFeatures.length === 0) return null;

              return (
                <div key={category} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    {category}
                  </div>
                  {categoryFeatures.map((feature) => {
                    const isSelected = feature.id === selectedFeatureId;
                    const FeatureIcon = feature.icon;

                    return (
                      <button
                        key={feature.id}
                        type="button"
                        onClick={() => handleSelect(feature)}
                        className={`w-full p-2.5 rounded-xl text-left transition-all duration-150 flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-teal-50 dark:bg-teal-500/15 border border-teal-300 dark:border-teal-500/30'
                            : 'hover:bg-lightbg-100 dark:hover:bg-midnight-850 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-teal-500 text-white'
                                : 'bg-lightbg-200 dark:bg-midnight-800 text-txt-lightSecondary dark:text-txt-darkSecondary'
                            }`}
                          >
                            <FeatureIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold ${
                                  isSelected
                                    ? 'text-teal-900 dark:text-teal-200'
                                    : 'text-txt-lightPrimary dark:text-txt-darkPrimary'
                                }`}
                              >
                                {feature.label}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${feature.badgeColor}`}>
                                {feature.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary leading-tight mt-0.5 line-clamp-1">
                              {feature.description}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {filteredFeatures.length === 0 && (
              <div className="py-6 text-center text-xs text-txt-lightSecondary dark:text-txt-darkSecondary">
                No analysis features found matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
