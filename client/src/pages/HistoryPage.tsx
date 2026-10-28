import React, { useEffect, useState } from 'react';
import { analysisApi } from '../services/api';
import { SavedAnalysis } from '../types';
import { Button } from '../components/ui/Button';
import { Alert, Spinner } from '../components/ui';
import { History, Trash2, Eye, Shield, Lock, ArrowRight } from 'lucide-react';
import { formatDate, getConcernColors, getApiErrorMessage } from '../utils';
import { AnalysisResultsView } from '../components/analyzer/AnalysisResultsView';

export function HistoryPage() {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await analysisApi.listHistory();
      setAnalyses(res.data.analyses || []);
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this saved analysis record?')) return;

    try {
      await analysisApi.deleteById(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(null);
      }
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-lightPrimary dark:text-text-darkPrimary tracking-tight">
          Saved Analysis History
        </h1>
        <p className="text-sm text-text-lightSecondary dark:text-text-darkSecondary mt-1 leading-relaxed">
          Review previous conversation evaluations you explicitly opted to save.
        </p>
      </div>

      {/* Privacy Callout */}
      <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 text-xs text-teal-800 dark:text-teal-300 flex items-center gap-2">
        <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
        <span>
          <strong>Data Retention Guarantee:</strong> Saved records contain only structured findings and recommendations. Raw conversation text is never saved or stored.
        </span>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Detail Modal / View */}
      {selectedAnalysis && (
        <div className="space-y-4 pb-6">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200 dark:border-navy-800">
            <h3 className="text-sm font-semibold text-text-lightPrimary dark:text-text-darkPrimary">
              Saved Analysis from {formatDate(selectedAnalysis.createdAt)}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedAnalysis(null)}>
              Close Details
            </Button>
          </div>
          <AnalysisResultsView
            analysis={{
              summary: selectedAnalysis.summary,
              concernLevel: selectedAnalysis.concernLevel,
              findings: selectedAnalysis.findings || [],
              boundaryAnalysis: [],
              boundaryChecks: [],
              suggestedReplies: selectedAnalysis.replySuggestions,
              replySuggestions: selectedAnalysis.replySuggestions,
              recommendedActions: selectedAnalysis.safetySteps || [],
              safetySteps: selectedAnalysis.safetySteps || [],
              limitations: selectedAnalysis.limitations || [],
              engine: 'pattern_rules_fallback',
            }}
            onReset={() => setSelectedAnalysis(null)}
          />
        </div>
      )}

      {/* History List */}
      {!selectedAnalysis && (
        <>
          {loading ? (
            <div className="py-16 flex justify-center">
              <Spinner className="w-8 h-8 text-teal-500" />
            </div>
          ) : analyses.length === 0 ? (
            <div className="card p-12 text-center border-dashed border-ivory-300 dark:border-navy-700 space-y-3">
              <History className="w-10 h-10 text-teal-500 mx-auto" />
              <h3 className="text-base font-semibold text-text-lightPrimary dark:text-text-darkPrimary">
                No Saved Analyses
              </h3>
              <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary max-w-md mx-auto leading-relaxed">
                TrustLens does not store analyses by default. When you run an analysis, check "Save findings to my private history" to keep a record here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.map((a) => {
                const concern = getConcernColors(a.concernLevel);
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAnalysis(a)}
                    className="card p-5 border border-ivory-300 dark:border-navy-700 hover:border-teal-500 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={concern.badge}>{concern.label}</span>
                        <span className="text-xs text-text-lightSecondary dark:text-text-darkSecondary font-mono">
                          {formatDate(a.createdAt)}
                        </span>
                        <span className="text-xs text-text-lightSecondary font-medium">
                          {a.findingsCount || a.findings?.length || 0} findings
                        </span>
                      </div>
                      <p className="text-sm font-medium text-text-lightPrimary dark:text-text-darkPrimary line-clamp-2">
                        {a.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAnalysis(a);
                        }}
                        className="gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Button>
                      <button
                        onClick={(e) => handleDelete(a.id, e)}
                        className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-text-lightSecondary hover:text-red-500 transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
