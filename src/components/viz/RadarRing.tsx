import React from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { obterInfoFaixa } from '../../utils/score';

export type RadarRingState = 'repouso' | 'analisando' | 'resultado' | 'erro';

interface RadarRingProps {
  state: RadarRingState;
  buscaAtualNumero?: number; // ex: 1, 2, 3
  totalBuscas?: number; // ex: 3
  score?: number;
  faixaMin?: number;
  faixaMax?: number;
  mensagemErro?: string;
  className?: string;
}

export const RadarRing: React.FC<RadarRingProps> = ({
  state = 'repouso',
  buscaAtualNumero = 1,
  totalBuscas = 3,
  score = 41,
  faixaMin = 34,
  faixaMax = 49,
  mensagemErro = 'Não foi possível analisar',
  className = '',
}) => {
  const infoFaixa = obterInfoFaixa(score);

  // SVG parameters
  const strokeWidth = 10;
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.max(0, Math.min(100, score)) / 100;
  const strokeDashoffset =
    state === 'resultado'
      ? circumference - progressPercent * circumference
      : circumference;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Container principal do anel */}
      <div
        role="img"
        aria-label={
          state === 'resultado'
            ? `Score ${score} de 100, faixa ${faixaMin} a ${faixaMax}, ${infoFaixa.rotulo}`
            : state === 'analisando'
            ? `Análise em andamento: ${buscaAtualNumero} de ${totalBuscas} buscas concluídas`
            : state === 'erro'
            ? `Erro: ${mensagemErro}`
            : 'Anel de radar Visibilidade.AI pronto para analisar'
        }
        className={`relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[440px] md:h-[440px] xl:w-[520px] xl:h-[520px] flex items-center justify-center transition-transform duration-700 ${
          state === 'repouso' ? 'hover:scale-[1.01]' : ''
        }`}
      >
        {/* Halo verde-azulado/menta */}
        <div
          className={`absolute inset-4 rounded-full blur-[45px] transition-opacity duration-700 pointer-events-none ${
            state === 'erro' ? 'opacity-10' : state === 'analisando' ? 'opacity-70' : 'opacity-40'
          }`}
          style={{
            background: 'conic-gradient(from 0deg, #19B8A5, #7FE3C6, #0E4B5A, #19B8A5)',
          }}
        />

        {/* Feixe de radar durante análise (gira a 2.4s por volta) */}
        {state === 'analisando' && (
          <div
            className="absolute inset-0 rounded-full animate-[spin_2.4s_linear_infinite] pointer-events-none"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg 300deg, rgba(127,227,198,0.55) 360deg)',
              mask: 'radial-gradient(transparent 65%, black 66%)',
              WebkitMask: 'radial-gradient(transparent 65%, black 66%)',
            }}
          />
        )}

        {/* Disco escuro ocupando 86% do diâmetro */}
        <div
          className="absolute rounded-full border border-[var(--vidro-borda)] shadow-2xl"
          style={{
            width: '86%',
            height: '86%',
            background: 'radial-gradient(circle, #0B1A22 0%, #050B10 100%)',
          }}
        />

        {/* Aro luminoso fino (2px) com conic-gradient */}
        <div
          className={`absolute rounded-full pointer-events-none transition-all duration-500 ${
            state === 'erro' ? 'border-[var(--texto-suave)]' : ''
          }`}
          style={{
            width: '86%',
            height: '86%',
            border: state === 'erro' ? '2px solid rgba(143,166,171,0.3)' : '2px solid rgba(127,227,198,0.4)',
            boxShadow:
              state === 'erro'
                ? 'none'
                : '0 0 24px rgba(25, 184, 165, 0.55), inset 0 0 12px rgba(127, 227, 198, 0.2)',
          }}
        />

        {/* Arco do Score (SVG) */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full -rotate-90 transform pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="radarScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#19B8A5" />
              <stop offset="100%" stopColor="#7FE3C6" />
            </linearGradient>
            <filter id="radarScoreGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Trilho visível apenas em resultado ou analisando */}
          {(state === 'resultado' || state === 'analisando') && (
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
            />
          )}

          {/* Arco do score preenchido em resultado */}
          {state === 'resultado' && (
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="url(#radarScoreGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              filter="url(#radarScoreGlow)"
              className="transition-all duration-1000 ease-out"
            />
          )}
        </svg>

        {/* Conteúdo Central conforme o estado */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 max-w-[80%]">
          {state === 'repouso' && (
            <div className="flex flex-col items-center gap-2 animate-in fade-in duration-500">
              <div className="w-12 h-12 rounded-full bg-[rgba(25,184,165,0.12)] border border-[var(--menta)]/20 flex items-center justify-center text-[var(--menta)]">
                <Search size={22} />
              </div>
              <span className="text-base sm:text-lg font-medium text-[var(--texto)]">
                Pronto para analisar
              </span>
              <span className="text-xs text-[var(--texto-suave)]">
                3 buscas de clientes na sua cidade
              </span>
            </div>
          )}

          {state === 'analisando' && (
            <div className="flex flex-col items-center gap-2 animate-in fade-in duration-300">
              <span className="text-4xl sm:text-5xl font-light text-[var(--menta)] tabular-nums">
                {buscaAtualNumero} <span className="text-xl sm:text-2xl text-[var(--texto-suave)] font-normal">de {totalBuscas}</span>
              </span>
              <span className="text-xs uppercase tracking-widest text-[var(--texto-suave)]">
                Consultando IA...
              </span>
            </div>
          )}

          {state === 'resultado' && (
            <div className="flex flex-col items-center gap-1 animate-in zoom-in-95 duration-500">
              <span className="text-5xl sm:text-7xl font-light tabular-nums tracking-tighter text-[var(--texto)]">
                {score}
              </span>
              <span className="text-xs uppercase tracking-wider text-[var(--texto-suave)] -mt-1 font-medium">
                de 100
              </span>
              <div
                className="mt-1.5 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide"
                style={{
                  backgroundColor: `rgba(${infoFaixa.chave === 'visivel' ? '25,184,165' : infoFaixa.chave === 'pouco' ? '245,181,68' : '255,107,74'}, 0.15)`,
                  color: infoFaixa.corHex,
                  border: `1px solid rgba(${infoFaixa.chave === 'visivel' ? '25,184,165' : infoFaixa.chave === 'pouco' ? '245,181,68' : '255,107,74'}, 0.35)`,
                }}
              >
                {infoFaixa.rotulo}
              </div>
            </div>
          )}

          {state === 'erro' && (
            <div className="flex flex-col items-center gap-2 animate-in fade-in text-[var(--coral)]">
              <AlertTriangle size={32} />
              <span className="text-sm font-medium text-[var(--texto)]">{mensagemErro}</span>
            </div>
          )}
        </div>
      </div>

      {/* Reflexo espelhado abaixo do anel */}
      <div
        className="w-[240px] sm:w-[320px] md:w-[400px] h-[60px] pointer-events-none opacity-20 -mt-8 overflow-hidden blur-[8px]"
        style={{
          transform: 'scaleY(-1)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 80%)',
          background: 'radial-gradient(ellipse at center, rgba(25, 184, 165, 0.4) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
};
