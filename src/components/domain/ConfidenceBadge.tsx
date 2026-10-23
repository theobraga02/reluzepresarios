import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { formatarDataPtBr } from '../../utils/format';

interface ConfidenceBadgeProps {
  totalRespostas: number;
  modelos: string[];
  data: string | Date;
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  totalRespostas,
  modelos,
  data,
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  const modeloTexto =
    modelos.length === 1 ? '1 modelo de IA' : `${modelos.length} modelos de IA`;

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[var(--texto-suave)] hover:text-[var(--texto)] text-[12px] font-medium transition-colors"
        aria-label="Informações sobre a confiabilidade dos dados"
      >
        <Info size={13} className="text-[var(--menta)]" />
        <span>
          {totalRespostas} respostas · {modeloTexto} · {formatarDataPtBr(data)}
        </span>
      </button>

      {open && (
        <div
          role="tooltip"
          className="absolute bottom-full left-0 mb-2 w-64 p-3 rounded-[16px] glass-panel bg-[#0B1A22]/95 border border-[var(--vidro-borda)] text-[12px] text-[var(--texto)] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <p className="font-semibold text-[var(--menta)] mb-1">Base estatística</p>
          <p className="text-[var(--texto-suave)] leading-relaxed">
            Quanto mais respostas, mais confiável o resultado. A faixa mostra a variação esperada
            com 95% de confiança estatística.
          </p>
        </div>
      )}
    </div>
  );
};
