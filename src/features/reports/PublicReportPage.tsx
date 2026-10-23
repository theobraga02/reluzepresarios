import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { getDiagnosticProvider } from '../../services/provider';
import { Diagnostico } from '../../services/types';
import { ScoreRing } from '../../components/viz/ScoreRing';
import { ConfidenceBadge } from '../../components/domain/ConfidenceBadge';
import { Logo } from '../../components/brand/Logo';
import { AuroraBackground } from '../../components/brand/AuroraBackground';
import { GrainOverlay } from '../../components/brand/GrainOverlay';
import { APP_CONFIG } from '../../content/config';
import { Button } from '../../components/ui/Button';

export const PublicReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const provider = getDiagnosticProvider();
  const [diag, setDiag] = useState<Diagnostico | null>(null);

  useEffect(() => {
    provider.obterDiagnostico(id || 'diag-padrao').then(setDiag);
  }, [id]);

  if (!diag) return null;

  return (
    <div className="relative min-h-screen flex flex-col bg-[#050B10] text-[var(--texto)]">
      <AuroraBackground variant="landing" />
      <GrainOverlay />

      <header className="sticky top-0 z-30 px-6 py-4 border-b border-[var(--linha)] backdrop-blur-md flex items-center justify-between max-w-[1200px] w-full mx-auto">
        <NavLink to="/">
          <Logo size="md" />
        </NavLink>
        <span className="text-xs text-[var(--texto-suave)] px-3 py-1 rounded-full glass-panel">
          Relatório Compartilhado · Somente Leitura
        </span>
      </header>

      <main className="flex-1 max-w-[900px] w-full mx-auto p-6 sm:p-12 space-y-8 relative z-10 text-center">
        <div>
          <span className="text-xs text-[var(--menta)] uppercase font-semibold tracking-wider">
            Diagnóstico de Visibilidade nas IAs
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-medium text-[var(--texto)] mt-2">
            Pizzaria Exemplo
          </h1>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Fortaleza, CE · Nicho: Pizzaria</p>
        </div>

        <div className="p-8 rounded-[28px] glass-panel border border-[var(--vidro-borda)] flex flex-col items-center justify-center space-y-4">
          <ScoreRing
            score={diag.score.valor}
            faixaMin={diag.score.faixaMin}
            faixaMax={diag.score.faixaMax}
            size={220}
          />

          <p className="text-sm text-[var(--texto-suave)] max-w-md mx-auto leading-relaxed">
            {diag.veredito}
          </p>

          <ConfidenceBadge
            totalRespostas={diag.totalRespostas}
            modelos={diag.modelos}
            data={diag.criadoEm}
          />
        </div>

        {/* Métricas Principais Resumidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-[18px] glass-panel border border-white/5 text-left">
            <span className="text-xs text-[var(--texto-suave)]">Taxa de citação</span>
            <p className="text-xl font-medium text-[var(--texto)] mt-1">
              {diag.metricas.taxaCitacao}%
            </p>
          </div>
          <div className="p-4 rounded-[18px] glass-panel border border-white/5 text-left">
            <span className="text-xs text-[var(--texto-suave)]">Posição média</span>
            <p className="text-xl font-medium text-[var(--texto)] mt-1">
              {diag.metricas.posicaoMedia ? '3º lugar' : '—'}
            </p>
          </div>
          <div className="p-4 rounded-[18px] glass-panel border border-white/5 text-left">
            <span className="text-xs text-[var(--texto-suave)]">Dados corretos</span>
            <p className="text-xl font-medium text-[var(--ambar)] mt-1">
              {diag.metricas.dadosCorretos}%
            </p>
          </div>
          <div className="p-4 rounded-[18px] glass-panel border border-white/5 text-left">
            <span className="text-xs text-[var(--texto-suave)]">Controle de fontes</span>
            <p className="text-xl font-medium text-[var(--texto)] mt-1">
              {diag.metricas.controleFontes}%
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--linha)] text-xs text-[var(--texto-suave)] space-y-3">
          <p>{APP_CONFIG.avisoVariacao}</p>
          <NavLink to="/">
            <Button variant="secondary" size="md">
              Analisar meu negócio grátis
            </Button>
          </NavLink>
        </div>
      </main>
    </div>
  );
};
