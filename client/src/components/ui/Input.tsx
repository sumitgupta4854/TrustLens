import React from 'react';
import { cn } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-txt-lightPrimary dark:text-txt-darkPrimary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input-base',
            error && 'border-coral-400 dark:border-coral-600 focus:ring-coral-400',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-coral-500 dark:text-coral-400 flex items-center gap-1">
            <span aria-hidden>⚠</span> {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-txt-lightPrimary dark:text-txt-darkPrimary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'input-base resize-none leading-relaxed',
            error && 'border-coral-400 dark:border-coral-600 focus:ring-coral-400',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p className="text-xs text-coral-500 dark:text-coral-400 flex items-center gap-1">
            <span aria-hidden>⚠</span> {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary">{hint}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
