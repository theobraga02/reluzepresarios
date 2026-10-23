import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const ringSizes = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  const ringDiameter = ringSizes[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Símbolo do anel aberto luminoso com ponto brilhante */}
      <svg
        width={ringDiameter}
        height={ringDiameter}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#19B8A5" />
            <stop offset="100%" stopColor="#7FE3C6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Anel aberto (arco de ~290 graus) */}
        <path
          d="M 16 3 A 13 13 0 1 1 5 21"
          stroke="url(#ringGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
        />

        {/* Ponto brilhante */}
        <circle cx="16" cy="3" r="2" fill="#FFFFFF" filter="url(#glow)" />
      </svg>

      {showText && (
        <span
          className="font-display font-[500] tracking-tight text-[var(--texto)]"
          style={{ fontSize: size === 'sm' ? '1.1rem' : size === 'lg' ? '1.5rem' : '1.25rem' }}
        >
          Visibilidade<span className="text-[var(--menta)]">.AI</span>
        </span>
      )}
    </div>
  );
};
