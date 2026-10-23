import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    let baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed';

    let sizeStyles = 'h-[48px] px-6 text-[15px]';
    if (size === 'sm') sizeStyles = 'h-[38px] px-4 text-[13px]';
    if (size === 'lg') sizeStyles = 'h-[52px] px-8 text-[16px]';

    let variantStyles = '';

    if (variant === 'primary') {
      variantStyles =
        'bg-[#FFFFFF] text-[var(--abismo)] hover:bg-[#F2F7F7] hover:shadow-[0_0_0_6px_rgba(127,227,198,0.18)] focus-visible:ring-2 focus-visible:ring-[var(--menta)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--abismo)] active:scale-[0.98]';
    } else if (variant === 'secondary') {
      variantStyles =
        'glass-panel text-[var(--texto)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] focus-visible:ring-2 focus-visible:ring-[var(--menta)] active:scale-[0.98]';
    } else if (variant === 'tertiary') {
      variantStyles =
        'bg-transparent text-[var(--texto-suave)] hover:text-[var(--texto)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--menta)]';
    } else if (variant === 'danger') {
      variantStyles =
        'bg-[var(--coral)] text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--coral)]';
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
