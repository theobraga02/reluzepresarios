import React, { useEffect, useState } from 'react';
import { getDiagnosticProvider } from '../../services/provider';
import { Diagnostico } from '../../services/types';
import { GlassCard } from '../../components/ui/GlassCard';
import { ScoreRing } from '../../components/viz/ScoreRing';
import { Button } from '../../components/ui/Button';
import { formatarDataPtBr } from '../../utils/format';
import { BarChart3, Plus, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DiagnosticsHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const provider = getDiagnosticProvider();
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>([]);

  useEffect(() => {
    provider.listarDiagnosticos('neg-padrao').then((res) => {
      setDiagnosticos(res);
      if (res.length >= 2) {
        setSelecionados([res[0].id, res[1].id]);
      }
    });
  }, []);

  const diag1 = diagnosticos.find((d) => d.id === selecionados[0]);
  const diag2 = diagnosticos.find((d) => d.id === selecionados[1]);

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-medium text-[var(--texto)]">Histórico de Análises</h2>
          <p className="text-xs text-[var(--texto-suave)] mt-1">
            Compare o score e métricas de diferentes análises para acompanhar a evolução.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/onboarding')}
          className="self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Nova análise</span>
        </Button>
      </div>

      {/* Comparação lado a lado (Seção 15) */}
      {diag1 && diag2 && (
        <GlassCard padding="lg" tone="good" className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--linha)] pb-3">
            <h3 className="text-base font-medium text-[var(--texto)]">Comparação lado a lado</h3>
            <span className="text-xs text-[var(--texto-suave)]">
              {formatarDataPtBr(diag2.criadoEm)} vs. {formatarDataPtBr(diag1.criadoEm)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Análise Anterior */}
            <div className="p-5 rounded-[20px] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center space-y-3">
              <span className="text-xs text-[var(--texto-suave)]">
                Análise em {formatarDataPtBr(diag2.criadoEm)}
              </span>
              <ScoreRing
                score={diag2.score.valor}
                faixaMin={diag2.score.faixaMin}
                faixaMax={diag2.score.faixaMax}
                size={160}
              />
              <div className="grid grid-cols-2 gap-2 w-full pt-2 text-xs">
                <div className="p-2 rounded bg-white/5">
                  <span className="text-[var(--texto-suave)] text-[10px]">Citação</span>
                  <p className="font-semibold text-white">{diag2.metricas.taxaCitacao}%</p>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <span className="text-[var(--texto-suave)] text-[10px]">Dados corretos</span>
                  <p className="font-semibold text-white">{diag2.metricas.dadosCorretos}%</p>
                </div>
              </div>
            </div>

            {/* Análise Atual */}
            <div className="p-5 rounded-[20px] bg-white/[0.02] border border-[var(--menta)]/30 flex flex-col items-center text-center space-y-3 relative">
              <span className="text-xs text-[var(--menta)] font-medium">
                Análise mais recente ({formatarDataPtBr(diag1.criadoEm)})
              </span>
              <ScoreRing
                score={diag1.score.valor}
                faixaMin={diag1.score.faixaMin}
                faixaMax={diag1.score.faixaMax}
                size={160}
              />
              <div className="grid grid-cols-2 gap-2 w-full pt-2 text-xs">
                <div className="p-2 rounded bg-white/5">
                  <span className="text-[var(--texto-suave)] text-[10px]">Citação</span>
                  <p className="font-semibold text-[var(--aurora)]">
                    {diag1.metricas.taxaCitacao}% (▲ +{diag1.metricas.taxaCitacao - diag2.metricas.taxaCitacao}%)
                  </p>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <span className="text-[var(--texto-suave)] text-[10px]">Dados corretos</span>
                  <p className="font-semibold text-[var(--aurora)]">
                    {diag1.metricas.dadosCorretos}% (▲ +{diag1.metricas.dadosCorretos - diag2.metricas.dadosCorretos}%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Lista de Análises Realizadas */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--texto-suave)]">
          Todas as análises
        </h4>
        {diagnosticos.map((d) => (
          <div
            key={d.id}
            className="p-5 rounded-[20px] glass-panel border border-[var(--vidro-borda)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--texto)]">
                  Análise Completa · {formatarDataPtBr(d.criadoEm)}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-[var(--texto-suave)]">
                  {d.modelos.join(', ')}
                </span>
              </div>
              <span className="text-xs text-[var(--texto-suave)] mt-1 block">
                {d.totalRespostas} respostas analisadas · Score {d.score.valor} (faixa {d.score.faixaMin} a {d.score.faixaMax})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-light text-[var(--menta)] tabular-nums">
                {d.score.valor} <span className="text-xs text-[var(--texto-suave)]">/100</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
