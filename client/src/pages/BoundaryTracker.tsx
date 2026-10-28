import React, { useEffect, useState } from 'react';
import { boundaryApi } from '../services/api';
import { Boundary, BoundaryCategory } from '../types';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Alert, Spinner } from '../components/ui';
import {
  BookmarkCheck,
  Plus,
  Trash2,
  Edit2,
  X,
  Filter,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { getApiErrorMessage } from '../utils';

const CATEGORIES: { value: BoundaryCategory; label: string }[] = [
  { value: 'financial', label: 'Financial / Money' },
  { value: 'physical_intimacy', label: 'Physical & Intimacy' },
  { value: 'personal_privacy', label: 'Personal Privacy & Address' },
  { value: 'meeting_time', label: 'Meeting Pace & Location' },
  { value: 'communication', label: 'Communication Frequency' },
  { value: 'emotional_pace', label: 'Emotional Pace & Guilt' },
  { value: 'other', label: 'Other Personal Boundary' },
];

const PRESET_BOUNDARIES = [
  {
    title: 'I will not send intimate photos.',
    category: 'physical_intimacy' as BoundaryCategory,
    description: 'I decline requests for private, unclothed, or provocative photos regardless of pressure.',
  },
  {
    title: 'I will not lend money to someone I just met.',
    category: 'financial' as BoundaryCategory,
    description: 'I do not send money, gift cards, or crypto transfers to online connections.',
  },
  {
    title: 'I want to take relationships slowly.',
    category: 'emotional_pace' as BoundaryCategory,
    description: 'I prefer measured pacing and do not respond to premature declarations of love or soulmates.',
  },
  {
    title: 'I do not want to share my home address yet.',
    category: 'personal_privacy' as BoundaryCategory,
    description: 'I keep my exact location private and meet only at public cafes until trust is established.',
  },
];

export function BoundaryTrackerPage() {
  const [boundaries, setBoundaries] = useState<Boundary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form modal/card state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BoundaryCategory>('financial');
  const [isActive, setIsActive] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const fetchBoundaries = async () => {
    setLoading(true);
    try {
      const res = await boundaryApi.list();
      setBoundaries(res.data.boundaries || []);
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoundaries();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategory('financial');
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (b: Boundary) => {
    setEditingId(b.id);
    setTitle(b.title);
    setDescription(b.description);
    setCategory(b.category);
    setIsActive(b.isActive);
    setIsFormOpen(true);
  };

  const handleSelectPreset = (preset: typeof PRESET_BOUNDARIES[0]) => {
    setEditingId(null);
    setTitle(preset.title);
    setDescription(preset.description);
    setCategory(preset.category);
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      if (editingId) {
        await boundaryApi.update(editingId, { title, description, category, isActive });
      } else {
        await boundaryApi.create({ title, description, category, isActive });
      }
      setIsFormOpen(false);
      await fetchBoundaries();
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (b: Boundary) => {
    try {
      await boundaryApi.update(b.id, { isActive: !b.isActive });
      setBoundaries((prev) =>
        prev.map((item) => (item.id === b.id ? { ...item, isActive: !item.isActive } : item))
      );
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this personal boundary?')) return;
    try {
      await boundaryApi.delete(id);
      setBoundaries((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    }
  };

  const filtered = boundaries.filter((b) => {
    if (filterCategory === 'all') return true;
    return b.category === filterCategory;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-lightPrimary dark:text-txt-darkPrimary tracking-tight">
            Personal Boundary Tracker
          </h1>
          <p className="text-sm text-txt-lightSecondary dark:text-txt-darkSecondary mt-1 leading-relaxed">
            Define your personal non-negotiables. TrustLens cross-references conversations against these boundaries during analysis.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenCreate} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add Custom Boundary</span>
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Preset Suggestions Bar */}
      <div className="card p-4 border border-teal-200 dark:border-midnight-700 bg-teal-50/20 dark:bg-midnight-900/40 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-300 block">
          Quick-Add Common Dating Boundaries:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_BOUNDARIES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className="text-xs px-3 py-1.5 rounded-xl border border-lightbg-300 dark:border-midnight-700 bg-white dark:bg-midnight-850 hover:border-teal-400 dark:hover:border-teal-500 text-txt-lightPrimary dark:text-txt-darkPrimary transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3 text-teal-500" />
              <span>"{p.title}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Boundary Form Modal / Drawer */}
      {isFormOpen && (
        <div className="card p-6 border-2 border-teal-400 dark:border-teal-500 bg-white dark:bg-midnight-900 shadow-soft-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-lightbg-200 dark:border-midnight-800">
            <h3 className="text-base font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
              {editingId ? 'Edit Personal Boundary' : 'Create New Personal Boundary'}
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-txt-lightSecondary hover:text-txt-lightPrimary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Boundary Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. I will not send money to someone I just met."
              required
            />

            <div>
              <label className="text-sm font-medium text-txt-lightPrimary dark:text-txt-darkPrimary block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BoundaryCategory)}
                className="input-base"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Description / Context"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how you want to enforce this boundary (e.g. Any mention of wire transfers, CashApp, or crypto will be declined)."
              rows={3}
              required
            />

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-txt-lightPrimary dark:text-txt-darkPrimary">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-teal-500 focus:ring-teal-400 w-4 h-4"
              />
              <span>Activate this boundary for future conversation analyses</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={formLoading}>
                {editingId ? 'Save Changes' : 'Create Boundary'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-txt-lightSecondary" />
          <span className="text-xs text-txt-lightSecondary font-medium">Filter Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs rounded-lg px-2.5 py-1.5 bg-white dark:bg-midnight-900 border border-lightbg-300 dark:border-midnight-700 text-txt-lightPrimary dark:text-txt-darkPrimary"
          >
            <option value="all">All Categories ({boundaries.length})</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-txt-lightSecondary font-mono">
          Showing {filtered.length} boundaries
        </span>
      </div>

      {/* Boundary Cards List */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <Spinner className="w-8 h-8 text-teal-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center border-dashed border-lightbg-300 dark:border-midnight-700 space-y-3">
          <BookmarkCheck className="w-10 h-10 text-teal-400 mx-auto" />
          <h3 className="text-base font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">
            No Boundaries Configured
          </h3>
          <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary max-w-md mx-auto leading-relaxed">
            Personal boundaries provide a baseline for TrustLens to alert you when a match tests your comfort level.
          </p>
          <Button variant="secondary" size="sm" onClick={handleOpenCreate} className="mt-2">
            Create Your First Boundary
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className={`card p-5 border ${b.isActive ? 'border-lightbg-300 dark:border-midnight-700' : 'border-lightbg-200 dark:border-midnight-850 opacity-60'} flex flex-col justify-between space-y-3`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-semibold uppercase tracking-wider">
                    {b.category.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(b)}
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium transition-colors ${b.isActive ? 'badge-low' : 'badge-default'}`}
                      title={b.isActive ? 'Deactivate boundary' : 'Activate boundary'}
                    >
                      {b.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="p-1 rounded-lg text-txt-lightSecondary hover:text-teal-600 transition-colors"
                      title="Edit boundary"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1 rounded-lg text-txt-lightSecondary hover:text-coral-500 transition-colors"
                      title="Delete boundary"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
                  {b.title}
                </h3>
                <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
