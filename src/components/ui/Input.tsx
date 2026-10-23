import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium text-[var(--texto)] flex justify-between"
        >
          <span>{label}</span>
          {hint && <span className="text-[12px] text-[var(--texto-suave)]">{hint}</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`h-[52px] w-full px-4 rounded-[14px] bg-[rgba(255,255,255,0.03)] border ${
            error ? 'border-[var(--coral)]' : 'border-[var(--vidro-borda)]'
          } text-[var(--texto)] placeholder-[var(--texto-suave)]/50 focus:outline-none focus:border-[var(--menta)] focus:ring-1 focus:ring-[var(--menta)] transition-colors ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="flex items-center gap-1.5 text-[12px] text-[var(--coral)] mt-0.5"
            role="alert"
          >
            <AlertCircle size={14} />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
