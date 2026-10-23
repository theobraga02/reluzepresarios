import React from 'react';
import { obterInfoFaixa } from '../../utils/score';

interface ScoreRingProps {
  score: number;
  faixaMin: number;
  faixaMax: number;
  size?: number; // padrão 240px desktop, 200px mobile
  className?: string;
  subtexto?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  faixaMin,
  faixaMax,
  size = 240,
  className = '',
  subtexto,
}) => {
  const infoFaixa = obterInfoFaixa(score);

  // SVG parameters
  const strokeWidth = 10;
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.max(0, Math.min(100, score)) / 100;
  const strokeDashoffset = circumference - progressPercent * circumference;

  return (
    <div
      role="img"
      aria-label={`Score ${score} de 100, faixa ${faixaMin} a ${faixaMax}, ${infoFaixa.rotulo}`}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Halo verde-azulado/menta girando suavemente */}
      <div
        className="absolute inset-2 rounded-full blur-[30px] opacity-40 animate-[spin_60s_linear_infinite] pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, #19B8A5, #7FE3C6, #0E4B5A, #19B8A5)',
        }}
      />

      {/* Disco escuro ocupando ~86% do diâmetro */}
      <div
        className="absolute rounded-full border border-[var(--vidro-borda)] shadow-inner"
        style={{
          width: '86%',
          height: '86%',
          background: 'radial-gradient(circle, #0B1A22 0%, #050B10 100%)',
        }}
      />

      {/* SVG com trilho e arco do score */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full -rotate-90 transform"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="scoreArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#19B8A5" />
            <stop offset="100%" stopColor="#7FE3C6" />
          </linearGradient>
          <filter id="scoreGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Trilho */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Arco do Score animado */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#scoreArcGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#scoreGlow)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Conteúdo central */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <span className="text-5xl md:text-6xl font-light tabular-nums tracking-tighter text-[var(--texto)]">
          {score}
        </span>
        <span className="text-[12px] uppercase tracking-wider text-[var(--texto-suave)] -mt-1 font-medium">
          de 100
        </span>
        <div
          className="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide"
          style={{
            backgroundColor: `rgba(${infoFaixa.chave === 'visivel' ? '25,184,165' : infoFaixa.chave === 'pouco' ? '245,181,68' : '255,107,74'}, 0.15)`,
            color: infoFaixa.corHex,
            border: `1px solid rgba(${infoFaixa.chave === 'visivel' ? '25,184,165' : infoFaixa.chave === 'pouco' ? '245,181,68' : '255,107,74'}, 0.35)`,
          }}
        >
          {infoFaixa.rotulo}
        </div>
        {subtexto && (
          <span className="text-[11px] text-[var(--texto-suave)] mt-1.5">{subtexto}</span>
        )}
      </div>
    </div>
  );
};
