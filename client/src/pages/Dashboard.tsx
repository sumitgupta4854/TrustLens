import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { boundaryApi, analysisApi } from '../services/api';
import { Boundary, SavedAnalysis } from '../types';
import { Button } from '../components/ui/Button';
import { Card, Spinner } from '../components/ui';
import {
  MessageCircle,
  Search,
  BookmarkCheck,
  MessageSquareReply,
  CheckSquare,
  ArrowRight,
  Shield,
  Plus,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { formatDate, getConcernColors } from '../utils';

export function DashboardPage() {
  const { user } = useAuth();
  const [boundaries, setBoundaries] = useState<Boundary[]>([]);
  const [recentAnalyses, setRecentAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [boundRes, histRes] = await Promise.allSettled([
          boundaryApi.list(),
          analysisApi.listHistory(),
        ]);

        if (boundRes.status === 'fulfilled') {
          setBoundaries(boundRes.value.data.boundaries || []);
        }
        if (histRes.status === 'fulfilled') {
          setRecentAnalyses(histRes.value.data.analyses || []);
        }
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const activeBoundaries = boundaries.filter((b) => b.isActive);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="card p-6 lg:p-8 bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-transparent border border-teal-200 dark:border-midnight-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-semibold">
                Welcome, {user?.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-txt-lightPrimary dark:text-txt-darkPrimary tracking-tight">
              Your Space for Safer Connections.
            </h1>
            <p className="text-sm text-txt-lightSecondary dark:text-txt-darkSecondary max-w-2xl leading-relaxed">
              Understand conversations, maintain your personal boundaries, and make informed choices about your relationships.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link to="/chat">
              <Button variant="secondary" size="md" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>AI Safety Chat</span>
              </Button>
            </Link>
            <Link to="/analyze">
              <Button variant="primary" size="md" className="gap-2">
                <Search className="w-4 h-4" />
                <span>Analyze Chat</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/chat">
          <Card hover className="h-full border border-lightbg-300 dark:border-midnight-700">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center mb-3 text-teal-700 dark:text-teal-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary mb-1">
              AI Safety Chat
            </h3>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
              Interactive conversation advice and boundary sounding board.
            </p>
          </Card>
        </Link>

        <Link to="/analyze">
          <Card hover className="h-full border border-lightbg-300 dark:border-midnight-700">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center mb-3 text-teal-700 dark:text-teal-400">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary mb-1">
              Analyze Conversation
            </h3>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
              Examine dialogue against pattern indicators & personal boundaries.
            </p>
          </Card>
        </Link>

        <Link to="/boundaries">
          <Card hover className="h-full border border-lightbg-300 dark:border-midnight-700">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center mb-3 text-teal-700 dark:text-teal-400">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
                Boundaries
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-semibold font-mono">
                {activeBoundaries.length} Active
              </span>
            </div>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
              Define personal rules to automatically check during analysis.
            </p>
          </Card>
        </Link>

        <Link to="/safety-checklist">
          <Card hover className="h-full border border-lightbg-300 dark:border-midnight-700">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center mb-3 text-teal-700 dark:text-teal-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary mb-1">
              Safety Checklist
            </h3>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
              Interactive preparation steps for first in-person meetings.
            </p>
          </Card>
        </Link>
      </div>

      {/* Main Content Split: Boundaries & Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Boundary Tracker Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-teal-500" />
              <h2 className="text-base font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
                Active Personal Boundaries
              </h2>
            </div>
            <Link to="/boundaries" className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="card p-8 flex items-center justify-center text-txt-lightSecondary">
              <Spinner className="w-6 h-6 text-teal-500" />
            </div>
          ) : boundaries.length === 0 ? (
            <div className="card p-6 border-dashed border-lightbg-300 dark:border-midnight-700 text-center space-y-3">
              <p className="text-sm text-txt-lightSecondary dark:text-txt-darkSecondary">
                You haven't defined any personal boundaries yet. Setting boundaries helps TrustLens alert you when messages cross your comfort zone.
              </p>
              <Link to="/boundaries">
                <Button variant="secondary" size="sm" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Add Your First Boundary</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {boundaries.slice(0, 3).map((b) => (
                <div key={b.id} className="card p-4 border border-lightbg-300 dark:border-midnight-700 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
                        {b.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-lightbg-200 dark:bg-midnight-800 text-txt-lightSecondary font-medium">
                        {b.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary line-clamp-1">
                      {b.description}
                    </p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${b.isActive ? 'badge-low' : 'badge-default'}`}>
                    {b.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Saved Analyses Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
              Recent Saved Analyses
            </h2>
            <Link
              to="/analyze?tab=dashboard"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>Trends Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="card p-8 flex items-center justify-center text-txt-lightSecondary">
              <Spinner className="w-6 h-6 text-teal-500" />
            </div>
          ) : recentAnalyses.length === 0 ? (
            <div className="card p-6 border-dashed border-lightbg-300 dark:border-midnight-700 text-center space-y-2">
              <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
                No saved analyses yet. By default, TrustLens analyzes text in memory. If you choose to save an analysis result for future reference, it will appear here.
              </p>
              <Link to="/analyze">
                <Button variant="ghost" size="sm">Start an Analysis</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.slice(0, 3).map((a) => {
                const concern = getConcernColors(a.concernLevel);
                return (
                  <div key={a.id} className="card p-4 border border-lightbg-300 dark:border-midnight-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={concern.badge}>{concern.label}</span>
                      <span className="text-[11px] text-txt-lightSecondary dark:text-txt-darkSecondary">
                        {formatDate(a.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-txt-lightPrimary dark:text-txt-darkPrimary line-clamp-2 leading-relaxed">
                      {a.summary}
                    </p>
                    <div className="text-[10px] text-txt-lightSecondary flex items-center gap-2 pt-1 border-t border-lightbg-200 dark:border-midnight-800">
                      <span>{a.findingsCount || a.findings?.length || 0} findings</span>
                      <span>•</span>
                      <span>3 reply suggestions</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
