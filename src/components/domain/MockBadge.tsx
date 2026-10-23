import React from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';

export const MockBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  // Verifica se há chave de API ou se uma análise real já foi executada
  const temChave =
    Boolean(localStorage.getItem('gemini_api_key')) ||
    Boolean(import.meta.env.VITE_GEMINI_API_KEY) ||
    Boolean(localStorage.getItem('diagnostico_atual'));

  if (temChave) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(25,184,165,0.12)] border border-[rgba(25,184,165,0.3)] text-[var(--aurora)] text-[12px] font-medium tracking-wide select-none ${className}`}
        title="Dados apurados em tempo real pelo Google Gemini"
      >
        <CheckCircle size={12} className="text-[var(--menta)]" />
        <span>Dados reais do negócio</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(245,181,68,0.12)] border border-[rgba(245,181,68,0.3)] text-[var(--ambar)] text-[12px] font-medium tracking-wide select-none ${className}`}
      title="Exibindo dados determinísticos de demonstração"
    >
      <Sparkles size={12} className="animate-pulse" />
      <span>Dados de exemplo</span>
    </div>
  );
};
