import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  radius?: 'lg' | 'md' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  tone?: 'default' | 'good' | 'warn' | 'bad';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  radius = 'lg',
  padding = 'md',
  tone = 'default',
  interactive = false,
  className = '',
  ...props
}) => {
  const radiusClass =
    radius === 'full'
      ? 'rounded-full'
      : radius === 'md'
      ? 'rounded-[16px]'
      : 'rounded-[28px]';

  const paddingClass =
    padding === 'none'
      ? 'p-0'
      : padding === 'sm'
      ? 'p-4'
      : padding === 'lg'
      ? 'p-8'
      : 'p-6';

  let borderTone = 'border-[var(--vidro-borda)]';
  if (tone === 'good') borderTone = 'border-t-[var(--aurora)] border-[var(--vidro-borda)]';
  if (tone === 'warn') borderTone = 'border-t-[var(--ambar)] border-[var(--vidro-borda)]';
  if (tone === 'bad') borderTone = 'border-t-[var(--coral)] border-[var(--vidro-borda)]';

  const interactiveClass = interactive
    ? 'cursor-pointer hover:border-[rgba(255,255,255,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--menta)] transition-all duration-200'
    : '';

  return (
    <div
      className={`glass-panel relative overflow-hidden text-[var(--texto)] ${radiusClass} ${paddingClass} ${borderTone} ${interactiveClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
