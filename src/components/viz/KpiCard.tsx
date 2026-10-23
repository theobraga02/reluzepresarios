import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface KpiCardProps {
  rotulo: string;
  valor: string | number;
  unidade?: string;
  variacao?: {
    valor: number;
    positivo?: boolean;
  };
  ajuda: string;
  sparklineData?: number[];
  carregando?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  rotulo,
  valor,
  unidade = '%',
  variacao,
  ajuda,
  sparklineData = [30, 32, 35, 33, 38, 41],
  carregando = false,
}) => {
  const [showHelp, setShowHelp] = useState(false);

  if (carregando) {
    return (
      <div className="p-5 rounded-[20px] glass-panel border border-[var(--vidro-borda)] animate-pulse">
        <div className="h-3 w-1/2 bg-white/10 rounded-full mb-3" />
        <div className="h-8 w-1/3 bg-white/20 rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative p-5 rounded-[20px] glass-panel border border-[var(--vidro-borda)] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[var(--texto-suave)] font-medium">{rotulo}</span>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="text-[var(--texto-suave)] hover:text-white p-0.5"
          aria-label={`Ajuda sobre ${rotulo}`}
        >
          <HelpCircle size={14} />
        </button>
      </div>

      {showHelp && (
        <div className="absolute top-10 right-2 z-30 p-3 rounded-[14px] bg-[#0B1A22] border border-[var(--vidro-borda)] text-xs text-[var(--texto-suave)] max-w-[200px] shadow-2xl">
          {ajuda}
        </div>
      )}

      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-3xl font-light tabular-nums text-[var(--texto)]">{valor}</span>
        {unidade && <span className="text-sm text-[var(--texto-suave)]">{unidade}</span>}
      </div>

      {/* Sparkline minimalista */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-[var(--linha)]">
        {variacao ? (
          <span
            className={`text-[11px] font-medium ${
              variacao.positivo !== false ? 'text-[var(--aurora)]' : 'text-[var(--coral)]'
            }`}
          >
            {variacao.positivo !== false ? '▲ +' : '▼ -'}
            {Math.abs(variacao.valor)}%
          </span>
        ) : (
          <span className="text-[11px] text-[var(--texto-suave)]">Sem comparação</span>
        )}

        {/* SVG Sparkline (30 dias) */}
        <svg className="w-16 h-5" viewBox="0 0 60 20" fill="none" aria-hidden="true">
          <polyline
            points="0,15 12,14 24,11 36,13 48,7 60,4"
            stroke="var(--aurora)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
