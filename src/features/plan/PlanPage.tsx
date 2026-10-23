import React, { useEffect, useState } from 'react';
import { getDiagnosticProvider } from '../../services/provider';
import { AcaoPlano } from '../../services/types';
import { GlassCard } from '../../components/ui/GlassCard';
import { ResolverDrawer } from '../../components/domain/ResolverDrawer';
import { Clock, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

export const PlanPage: React.FC = () => {
  const provider = getDiagnosticProvider();
  const [acoes, setAcoes] = useState<AcaoPlano[]>([]);
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [acaoSelecionada, setAcaoSelecionada] = useState<AcaoPlano | null>(null);

  useEffect(() => {
    provider.plano('neg-padrao').then(setAcoes);
  }, []);

  const abrirDrawer = (acao: AcaoPlano) => {
    setAcaoSelecionada(acao);
    setDrawerAberto(true);
  };

  const semanaAcoes = acoes.filter((a) => a.janela === 'semana');
  const trintaDiasAcoes = acoes.filter((a) => a.janela === '30dias');
  const continuoAcoes = acoes.filter((a) => a.janela === 'continuo');

  const renderColuna = (titulo: string, items: AcaoPlano[]) => (
    <div className="space-y-4 flex-1">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--linha)]">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--menta)]">
          {titulo}
        </h3>
        <span className="text-xs text-[var(--texto-suave)]">{items.length} itens</span>
      </div>

      <div className="space-y-3">
        {items.map((acao) => (
          <div
            key={acao.id}
            className={`p-4 rounded-[18px] glass-panel border transition-all text-left space-y-3 ${
              acao.concluida
                ? 'opacity-60 border-white/5 bg-white/[0.01]'
                : 'border-[var(--vidro-borda)] hover:border-white/20'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h4
                className={`text-xs sm:text-sm font-medium ${
                  acao.concluida ? 'line-through text-[var(--texto-suave)]' : 'text-[var(--texto)]'
                }`}
              >
                {acao.titulo}
              </h4>
              {acao.concluida && <CheckCircle2 size={16} className="text-[var(--aurora)] flex-shrink-0" />}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--linha)] text-xs">
              <span className="text-[11px] text-[var(--texto-suave)] flex items-center gap-1">
                <Clock size={12} /> ~15 min
              </span>
              <button
                type="button"
                onClick={() => abrirDrawer(acao)}
                className="text-[11px] font-semibold text-[var(--menta)] hover:underline"
              >
                Ver texto pronto
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-display font-medium text-[var(--texto)]">Plano de Ação</h2>
        <p className="text-xs text-[var(--texto-suave)] mt-1">
          Passos priorizados com textos prontos para copiar e colar diretamente nos seus canais.
        </p>
      </div>

      {/* Grid de 3 Colunas no Desktop / Acordeão no Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderColuna('Esta semana', semanaAcoes)}
        {renderColuna('Próximos 30 dias', trintaDiasAcoes)}
        {renderColuna('Contínuo', continuoAcoes)}
      </div>

      {acaoSelecionada && (
        <ResolverDrawer
          isOpen={drawerAberto}
          onClose={() => setDrawerAberto(false)}
          titulo={acaoSelecionada.titulo}
          evidencia="Passo indispensável para melhorar a recomendação da IA para seu nicho."
          passos={acaoSelecionada.passos}
          conteudoPronto={acaoSelecionada.conteudoPronto}
          concluida={acaoSelecionada.concluida}
          onToggleConcluida={() => {
            const novo = !acaoSelecionada.concluida;
            setAcoes((prev) =>
              prev.map((a) => (a.id === acaoSelecionada.id ? { ...a, concluida: novo } : a))
            );
            setAcaoSelecionada({ ...acaoSelecionada, concluida: novo });
          }}
        />
      )}
    </div>
  );
};
