import React from 'react';
import { FonteLocal } from '../../services/types';
import { Check, X, ExternalLink, Globe } from 'lucide-react';

interface SourceListProps {
  fontes: FonteLocal[];
}

export const SourceList: React.FC<SourceListProps> = ({ fontes }) => {
  // Ordenar priorizando as mais citadas onde o negócio NÃO está
  const ordenadas = [...fontes].sort((a, b) => {
    if (!a.negocioPresente && b.negocioPresente) return -1;
    if (a.negocioPresente && !b.negocioPresente) return 1;
    return b.citacoes - a.citacoes;
  });

  return (
    <div className="p-6 rounded-[24px] glass-panel border border-[var(--vidro-borda)] text-left flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-base font-medium text-[var(--texto)]">
            Fontes que a IA mais usa na sua cidade
          </h4>
          <span className="text-xs text-[var(--texto-suave)]">
            Onde a IA busca referências
          </span>
        </div>
        <p className="text-xs text-[var(--texto-suave)] mb-4">
          Estar presente nessas fontes é o fator que mais atrai recomendações automáticas.
        </p>

        <div className="space-y-3">
          {ordenadas.map((f, i) => (
            <div
              key={i}
              className="p-3.5 rounded-[16px] bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--texto-suave)] flex-shrink-0">
                  <Globe size={15} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-medium text-[var(--texto)] block">
                    {f.nome}
                  </span>
                  <span className="text-[11px] text-[var(--texto-suave)]">
                    {f.citacoes} citações registradas nas respostas
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {f.negocioPresente ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgba(25,184,165,0.12)] text-[var(--aurora)] text-xs font-medium">
                    <Check size={12} /> Você está
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgba(255,107,74,0.12)] text-[var(--coral)] text-xs font-medium">
                      <X size={12} /> Você não está
                    </span>
                    {f.urlCadastro && (
                      <a
                        href={f.urlCadastro}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[var(--texto)] text-xs font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Cadastrar</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
