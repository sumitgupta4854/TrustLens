import React from 'react';
import { cn } from '../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'coral' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white rounded-xl shadow-soft-sm hover:shadow-soft-md',
    secondary: 'bg-teal-100 dark:bg-teal-500/20 hover:bg-teal-200 dark:hover:bg-teal-500/30 text-teal-800 dark:text-teal-300 rounded-xl',
    coral: 'bg-coral-400 hover:bg-coral-500 active:bg-coral-600 text-white rounded-xl shadow-soft-sm',
    ghost: 'hover:bg-lightbg-200 dark:hover:bg-midnight-850 text-txt-lightSecondary dark:text-txt-darkSecondary rounded-xl',
    danger: 'bg-coral-50 dark:bg-coral-400/10 hover:bg-coral-100 dark:hover:bg-coral-400/20 text-coral-600 dark:text-coral-400 rounded-xl border border-coral-200 dark:border-coral-400/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading…
        </>
      ) : children}
    </button>
  );
}
