import React, { useEffect, useState } from 'react';
import { getDiagnosticProvider } from '../../services/provider';
import { FonteLocal } from '../../services/types';
import { GlassCard } from '../../components/ui/GlassCard';
import { Globe, Check, X, ExternalLink, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const SourcesPage: React.FC = () => {
  const provider = getDiagnosticProvider();
  const [fontes, setFontes] = useState<FonteLocal[]>([]);
  const [filtro, setFiltro] = useState<'todas' | 'presente' | 'ausente'>('todas');

  useEffect(() => {
    provider.fontes('diag-padrao').then(setFontes);
  }, []);

  const fontesFiltradas = fontes.filter((f) => {
    if (filtro === 'presente') return f.negocioPresente;
    if (filtro === 'ausente') return !f.negocioPresente;
    return true;
  });

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium text-[var(--texto)]">Fontes Locais</h2>
          <p className="text-xs text-[var(--texto-suave)] mt-1">
            Diretórios, portais e guias de onde as IAs extraem informações sobre negócios da sua cidade.
          </p>
        </div>

        {/* Filtros em Pílula */}
        <div className="flex items-center gap-1.5 p-1 rounded-full glass-panel self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFiltro('todas')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filtro === 'todas' ? 'bg-white text-[var(--abismo)]' : 'text-[var(--texto-suave)] hover:text-white'
            }`}
          >
            Todas ({fontes.length})
          </button>
          <button
            type="button"
            onClick={() => setFiltro('presente')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filtro === 'presente' ? 'bg-[var(--aurora)] text-[var(--abismo)]' : 'text-[var(--texto-suave)] hover:text-white'
            }`}
          >
            Você está
          </button>
          <button
            type="button"
            onClick={() => setFiltro('ausente')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filtro === 'ausente' ? 'bg-[var(--coral)] text-white' : 'text-[var(--texto-suave)] hover:text-white'
            }`}
          >
            Você não está
          </button>
        </div>
      </div>

      {/* Lista Completa de Fontes */}
      <div className="space-y-3">
        {fontesFiltradas.map((f, idx) => (
          <div
            key={idx}
            className="p-5 rounded-[20px] glass-panel border border-[var(--vidro-borda)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--texto-suave)] flex-shrink-0">
                <Globe size={18} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[var(--texto)]">{f.nome}</h4>
                <span className="text-xs text-[var(--texto-suave)]">
                  Citada em {f.citacoes} respostas dos modelos de IA
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {f.negocioPresente ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(25,184,165,0.12)] border border-[var(--aurora)]/30 text-[var(--aurora)] text-xs font-medium">
                  <Check size={14} /> Você está cadastrado
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(255,107,74,0.12)] border border-[var(--coral)]/30 text-[var(--coral)] text-xs font-medium">
                    <X size={14} /> Não cadastrado
                  </span>
                  {f.urlCadastro && (
                    <a
                      href={f.urlCadastro}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-white text-[var(--abismo)] hover:bg-[#F2F7F7] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Cadastrar</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
