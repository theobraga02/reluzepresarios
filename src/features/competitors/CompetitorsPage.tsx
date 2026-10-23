import React, { useEffect, useState } from 'react';
import { getDiagnosticProvider } from '../../services/provider';
import { Concorrente } from '../../services/types';
import { GlassCard } from '../../components/ui/GlassCard';
import { Users, Plus, CheckCircle, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CompetitorsPage: React.FC = () => {
  const provider = getDiagnosticProvider();
  const [concorrentes, setConcorrentes] = useState<Concorrente[]>([]);
  const [novoNome, setNovoNome] = useState('');
  const [adicionando, setAdicionando] = useState(false);

  useEffect(() => {
    provider.concorrentes('diag-padrao').then(setConcorrentes);
  }, []);

  const handleAdicionar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;
    setConcorrentes([
      ...concorrentes,
      {
        nome: novoNome.trim(),
        participacao: 15,
        atributos: ['novo competidor', 'atendimento local'],
        fontes: ['Google Maps'],
        diferenciais: ['Perfil cadastrado'],
      },
    ]);
    setNovoNome('');
    setAdicionando(false);
  };

  const removerConcorrente = (nome: string) => {
    setConcorrentes(concorrentes.filter((c) => c.nome !== nome));
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium text-[var(--texto)]">Concorrentes</h2>
          <p className="text-xs text-[var(--texto-suave)] mt-1">
            Negócios que aparecem quando clientes buscam o que você vende na sua cidade.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setAdicionando(!adicionando)}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Adicionar concorrente</span>
        </Button>
      </div>

      {adicionando && (
        <GlassCard padding="md" tone="default">
          <form onSubmit={handleAdicionar} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Nome do concorrente na sua cidade..."
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="flex-1 h-[44px] px-4 rounded-[12px] bg-white/[0.04] border border-[var(--vidro-borda)] text-xs text-white focus:outline-none focus:border-[var(--menta)]"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" variant="primary" size="sm">
                Salvar
              </Button>
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                onClick={() => setAdicionando(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Grid de Cards de Concorrentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concorrentes.map((c, idx) => (
          <GlassCard key={idx} padding="lg" className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-medium text-[var(--texto)]">{c.nome}</h3>
                  <span className="text-xs text-[var(--menta)] font-semibold mt-0.5 block">
                    {c.participacao}% das citações da IA
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removerConcorrente(c.nome)}
                  className="text-[var(--texto-suave)] hover:text-[var(--coral)] p-1 transition-colors"
                  title="Remover concorrente"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Atributos que a IA cita */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[11px] font-semibold text-[var(--texto-suave)] uppercase tracking-wider">
                  Atributos citados pela IA
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {c.atributos.map((at, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/5 text-[var(--texto)]"
                    >
                      {at}
                    </span>
                  ))}
                </div>
              </div>

              {/* Diferenciais / O que ele tem que você não tem */}
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-semibold text-[var(--texto-suave)] uppercase tracking-wider">
                  O que ele tem que você não tem
                </span>
                <ul className="space-y-1 text-xs text-[var(--texto-suave)]">
                  {c.diferenciais.map((dif, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[var(--menta)]">•</span>
                      <span>{dif}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Fontes onde ele está presente */}
            <div className="pt-3 border-t border-[var(--linha)] text-[11px] text-[var(--texto-suave)]">
              Presente em: <span className="text-white">{c.fontes.join(', ')}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
