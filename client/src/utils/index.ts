import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

export function getConcernColors(level: 'low' | 'moderate' | 'high') {
  switch (level) {
    case 'high':
      return {
        badge: 'badge-high',
        bg: 'bg-coral-50/70 dark:bg-coral-400/10',
        border: 'border-coral-200 dark:border-coral-400/20',
        text: 'text-coral-700 dark:text-coral-400',
        icon: 'text-coral-500',
        label: 'High Concern',
      };
    case 'moderate':
      return {
        badge: 'badge-moderate',
        bg: 'bg-amber-50/70 dark:bg-amber-400/10',
        border: 'border-amber-200 dark:border-amber-400/20',
        text: 'text-amber-800 dark:text-amber-400',
        icon: 'text-amber-500',
        label: 'Moderate Concern',
      };
    default:
      return {
        badge: 'badge-low',
        bg: 'bg-teal-50/70 dark:bg-teal-500/10',
        border: 'border-teal-200 dark:border-teal-500/20',
        text: 'text-teal-800 dark:text-teal-300',
        icon: 'text-teal-500',
        label: 'Low Concern',
      };
  }
}

export function getConfidenceLabel(c: 'low' | 'medium' | 'high') {
  switch (c) {
    case 'high': return 'Strong evidence';
    case 'medium': return 'Moderate evidence';
    default: return 'Weak evidence';
  }
}

export function getBoundaryStatusInfo(status: string) {
  switch (status) {
    case 'Repeatedly challenged':
      return { label: 'Repeatedly Challenged', badge: 'badge-high', icon: '⚠' };
    case 'Possibly challenged':
    case 'potential_violation':
      return { label: 'Possibly Challenged', badge: 'badge-moderate', icon: '⚠' };
    case 'Appears respected':
    case 'respected':
      return { label: 'Appears Respected', badge: 'badge-low', icon: '✓' };
    default:
      return { label: 'Not Enough Evidence', badge: 'badge-info', icon: '–' };
  }
}

export function getApiErrorMessage(error: any): string {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.details?.[0]?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
}
