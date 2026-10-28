import React from 'react';
import { cn } from '../../utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'low' | 'moderate' | 'high' | 'info' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    low: 'badge-low',
    moderate: 'badge-moderate',
    high: 'badge-high',
    info: 'badge-info',
    default: 'bg-lightbg-200 dark:bg-midnight-800 text-txt-lightSecondary dark:text-txt-darkSecondary px-2.5 py-0.5 rounded-full text-xs font-semibold',
  };
  return (
    <span className={cn(variants[variant], className)} aria-label={`${variant} level`}>
      {children}
    </span>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'card p-5',
        hover && 'transition-shadow duration-200 hover:shadow-soft-md cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
      role="status"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

interface AlertProps {
  children: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Alert({ children, type = 'info', className }: AlertProps) {
  const styles = {
    info: 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20 text-teal-800 dark:text-teal-200',
    success: 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20 text-teal-800 dark:text-teal-200',
    warning: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-200',
    error: 'bg-coral-50 dark:bg-coral-500/10 border-coral-200 dark:border-coral-500/20 text-coral-800 dark:text-coral-200',
  };
  return (
    <div className={cn('p-4 rounded-xl border text-sm', styles[type], className)} role="alert">
      {children}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.FC<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-500/15 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-teal-600 dark:text-teal-400" />
      </div>
      <h3 className="text-base font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-txt-lightSecondary dark:text-txt-darkSecondary max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
