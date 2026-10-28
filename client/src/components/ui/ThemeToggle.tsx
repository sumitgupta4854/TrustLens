import React, { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
  ];

  return (
    <div
      className={cn(
        'flex items-center gap-0.5 p-1 rounded-xl',
        'bg-lightbg-200 dark:bg-midnight-850 border border-lightbg-300 dark:border-midnight-700',
        className
      )}
      role="group"
      aria-label="Theme selector"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={`${label} theme`}
          aria-pressed={theme === value}
          className={cn(
            'p-1.5 rounded-lg transition-all duration-150',
            theme === value
              ? 'bg-white dark:bg-midnight-900 shadow-soft-sm text-teal-600 dark:text-teal-400'
              : 'text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-txt-lightPrimary dark:hover:text-txt-darkPrimary'
          )}
        >
          <Icon className="w-3.5 h-3.5" aria-hidden />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}
