import React, { useEffect, useState } from 'react';
import { getDiagnosticProvider } from '../../services/provider';
import {
  Diagnostico,
  AcaoPlano,
  ItemPresenca,
  Concorrente,
  FonteLocal,
  PontoSerie,
  RespostaIA,
} from '../../services/types';
import { ScoreRing } from '../../components/viz/ScoreRing';
import { KpiCard } from '../../components/viz/KpiCard';
import { PriorityCard } from '../../components/domain/PriorityCard';
import { TimeSeriesChart } from '../../components/viz/TimeSeriesChart';
import { IntentBarChart } from '../../components/viz/IntentBarChart';
import { ShareBars } from '../../components/viz/ShareBars';
import { SourceList } from '../../components/viz/SourceList';
import { ResolverDrawer } from '../../components/domain/ResolverDrawer';
import { ConfidenceBadge } from '../../components/domain/ConfidenceBadge';
import { APP_CONFIG } from '../../content/config';
import { NavLink } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const provider = getDiagnosticProvider();

  // Estados de dados
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null);
  const [acoes, setAcoes] = useState<AcaoPlano[]>([]);
  const [itensPresenca, setItensPresenca] = useState<ItemPresenca[]>([]);
  const [concorrentes, setConcorrentes] = useState<Concorrente[]>([]);
  const [fontes, setFontes] = useState<FonteLocal[]>([]);
  const [pontosSerie, setPontosSerie] = useState<PontoSerie[]>([]);
  const [respostas, setRespostas] = useState<RespostaIA[]>([]);

  // Estado do Drawer "Como resolver"
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [acaoSelecionada, setAcaoSelecionada] = useState<AcaoPlano | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [diag, acts, pres, concs, fts, serie, resps] = await Promise.all([
        provider.obterDiagnostico('diag-padrao'),
        provider.plano('neg-padrao'),
        provider.presenca('neg-padrao'),
        provider.concorrentes('diag-padrao'),
        provider.fontes('diag-padrao'),
        provider.serieTemporal('neg-padrao', 30),
        provider.listarRespostas('diag-padrao'),
      ]);

      setDiagnostico(diag);
      setAcoes(acts);
      setItensPresenca(pres);
      setConcorrentes(concs);
      setFontes(fts);
      setPontosSerie(serie);
      setRespostas(resps);
    } catch (e) {
      setErro('Não conseguimos carregar este bloco. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const abrirDrawer = (acao: AcaoPlano) => {
    setAcaoSelecionada(acao);
    setDrawerAberto(true);
  };

  const toggleConcluida = async () => {
    if (!acaoSelecionada) return;
    const novoStatus = !acaoSelecionada.concluida;
    await provider.concluirAcao(acaoSelecionada.id, novoStatus);

    setAcoes((prev) =>
      prev.map((a) => (a.id === acaoSelecionada.id ? { ...a, concluida: novoStatus } : a))
    );
    setAcaoSelecionada({ ...acaoSelecionada, concluida: novoStatus });
  };

  if (carregando) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 rounded-[28px] bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 rounded-[20px] bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (erro || !diagnostico) {
    return (
      <div className="p-8 rounded-[28px] glass-panel border border-[var(--coral)]/30 text-center space-y-4">
        <AlertCircle size={36} className="text-[var(--coral)] mx-auto" />
        <p className="text-sm text-[var(--texto)]">{erro || 'Erro ao carregar dados.'}</p>
        <button
          type="button"
          onClick={carregarDados}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white"
        >
          Tentar de novo
        </button>
      </div>
    );
  }

  // Filtrar as 3 principais prioridades
  const topPrioridades = acoes.slice(0, 3);
  const totalConcluidas = acoes.filter((a) => a.concluida).length;

  return (
    <div className="space-y-8">
      {/* LINHA 1: ScoreCard (5 col) + O que fazer agora (7 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* BLOCO 1: ScoreCard */}
        <div className="lg:col-span-5 p-6 rounded-[28px] glass-panel border border-[var(--vidro-borda)] flex flex-col items-center justify-between text-center">
          <ScoreRing
            score={diagnostico.score.valor}
            faixaMin={diagnostico.score.faixaMin}
            faixaMax={diagnostico.score.faixaMax}
            size={220}
          />

          <div className="mt-4 space-y-2 text-center max-w-sm">
            <div className="flex items-center justify-center gap-2 text-xs">
              <span className="text-[var(--aurora)] font-semibold">
                ▲ +{diagnostico.variacaoDesdeAnterior} pontos
              </span>
              <span className="text-[var(--texto-suave)]">desde a última análise</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--texto-suave)] leading-relaxed">
              {diagnostico.veredito}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--linha)] w-full flex justify-center">
            <ConfidenceBadge
              totalRespostas={diagnostico.totalRespostas}
              modelos={diagnostico.modelos}
              data={diagnostico.criadoEm}
            />
          </div>
        </div>

        {/* BLOCO 2: O que fazer agora (As 3 maiores prioridades) */}
        <div className="lg:col-span-7 p-6 rounded-[28px] glass-panel border border-[var(--vidro-borda)] flex flex-col justify-between text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-[var(--texto)]">O que fazer agora</h3>
              <p className="text-xs text-[var(--texto-suave)]">
                Ações de maior impacto para destravar citações da IA
              </p>
            </div>
            <NavLink
              to="/app/plano"
              className="text-xs text-[var(--menta)] hover:underline inline-flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ChevronRight size={14} />
            </NavLink>
          </div>

          <div className="space-y-3">
            {topPrioridades.map((acao, idx) => (
              <PriorityCard
                key={acao.id}
                gravidade={idx === 0 ? 'critica' : idx === 1 ? 'media' : 'baixa'}
                titulo={acao.titulo}
                evidencia={
                  idx === 0
                    ? 'A IA mostrou seu horário como "fechado aos domingos" em 5 de 12 respostas.'
                    : idx === 1
                    ? 'Existem 7 avaliações dos últimos meses sem resposta da gerência.'
                    : 'A IA não encontrou dados de entrega e itens vegetarianos no site.'
                }
                impacto={idx === 0 ? 'Alto' : 'Médio'}
                esforcoMin={idx === 0 ? 10 : 20}
                onVerComoResolver={() => abrirDrawer(acao)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* BLOCO 3: CINCO INDICADORES (KPI CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard
          rotulo="Taxa de citação"
          valor={diagnostico.metricas.taxaCitacao}
          ajuda="Percentual de buscas da cidade em que o seu negócio é recomendado pela IA."
          variacao={{ valor: 4, positivo: true }}
        />
        <KpiCard
          rotulo="Posição média"
          valor={diagnostico.metricas.posicaoMedia ? '3º' : '—'}
          unidade="lugar"
          ajuda="Lugar médio ocupado nas listas recomendadas pela IA."
          variacao={{ valor: 1, positivo: true }}
        />
        <KpiCard
          rotulo="Dados corretos"
          valor={diagnostico.metricas.dadosCorretos}
          ajuda="Percentual de menções com nome, endereço, horário e telefone exatos."
          variacao={{ valor: 5, positivo: false }}
        />
        <KpiCard
          rotulo="Controle das fontes"
          valor={diagnostico.metricas.controleFontes}
          ajuda="Fontes citadas pela IA que são canais oficiais seus (site, Google, Instagram)."
          variacao={{ valor: 2, positivo: true }}
        />
        <KpiCard
          rotulo="Qualidade recomendação"
          valor={diagnostico.metricas.qualidadeRecomendacao}
          ajuda="Grau de destaque: se a IA coloca você como primeira escolha ou neutro."
          variacao={{ valor: 6, positivo: true }}
        />
      </div>

      {/* BLOCO 4 & 5: GRÁFICOS (Evolução 30 dias + Citação por tipo de busca) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <TimeSeriesChart pontos={pontosSerie} />
        </div>
        <div className="lg:col-span-5">
          <IntentBarChart />
        </div>
      </div>

      {/* BLOCO 6 & 7: CONCORRENTES + FONTES QUE A IA USA NA CIDADE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5">
          <ShareBars
            concorrentes={concorrentes}
            suaParticipacao={diagnostico.metricas.taxaCitacao}
            seuNome={(() => {
              const negRaw = localStorage.getItem('visibilidade_negocio');
              if (negRaw) {
                try {
                  const parsed = JSON.parse(negRaw);
                  if (parsed.nome) return parsed.nome;
                } catch (e) {}
              }
              return 'Sua empresa';
            })()}
          />
        </div>
        <div className="lg:col-span-7">
          <SourceList fontes={fontes} />
        </div>
      </div>

      {/* BLOCO 8: PLANO DE 30 DIAS (LARGURA TOTAL) */}
      <div className="p-6 rounded-[24px] glass-panel border border-[var(--vidro-borda)] text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-[var(--menta)] tracking-wider">
              Plano de 30 dias
            </span>
            <span className="text-xs text-[var(--texto-suave)]">
              · {totalConcluidas} de {acoes.length} tarefas concluídas
            </span>
          </div>
          <h4 className="text-base font-medium text-[var(--texto)]">
            Aumente suas menções concluindo as correções sugeridas
          </h4>
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden max-w-md">
            <div
              className="bg-[var(--aurora)] h-full rounded-full transition-all duration-500"
              style={{ width: `${(totalConcluidas / (acoes.length || 1)) * 100}%` }}
            />
          </div>
        </div>

        <NavLink to="/app/plano">
          <button
            type="button"
            className="px-6 py-2.5 rounded-full bg-white text-[var(--abismo)] hover:bg-[#F2F7F7] text-xs font-semibold"
          >
            Abrir plano
          </button>
        </NavLink>
      </div>

      {/* BLOCO 9 & 10: O QUE VOCÊ AINDA NÃO FEZ + ÚLTIMAS RESPOSTAS DA IA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Bloco 9: Checklist por categoria */}
        <div className="lg:col-span-7 p-6 rounded-[24px] glass-panel border border-[var(--vidro-borda)] text-left space-y-4">
          <h4 className="text-base font-medium text-[var(--texto)]">O que você ainda não fez</h4>
          <p className="text-xs text-[var(--texto-suave)] -mt-2">
            Itens pendentes organizados por canal
          </p>

          <div className="space-y-2.5">
            {itensPresenca.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-[16px] bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3"
              >
                <div>
                  <span className="text-xs font-medium text-[var(--texto)] block">
                    {item.titulo}
                  </span>
                  <span className="text-[11px] text-[var(--texto-suave)]">{item.evidencia}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    abrirDrawer({
                      id: item.id,
                      titulo: item.titulo,
                      janela: 'semana',
                      passos: ['Siga as instruções do perfil e confirme os dados.'],
                      conteudoPronto: item.evidencia,
                      concluida: item.concluido,
                    })
                  }
                  className="px-3 py-1 rounded-full glass-panel hover:bg-white/10 text-[11px] font-medium text-[var(--menta)] flex-shrink-0"
                >
                  Texto pronto
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco 10: Últimas respostas da IA */}
        <div className="lg:col-span-5 p-6 rounded-[24px] glass-panel border border-[var(--vidro-borda)] text-left space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-medium text-[var(--texto)]">Últimas respostas da IA</h4>
            <NavLink to="/app/respostas" className="text-xs text-[var(--menta)] hover:underline">
              Ver todas
            </NavLink>
          </div>

          <div className="space-y-3">
            {respostas.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-[16px] bg-white/[0.02] border border-white/5 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--texto-suave)] text-[11px]">{r.modelo}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      r.citouNegocio
                        ? 'bg-[var(--aurora)]/15 text-[var(--aurora)]'
                        : 'bg-[var(--coral)]/15 text-[var(--coral)]'
                    }`}
                  >
                    {r.citouNegocio ? 'Citou você' : 'Não citou você'}
                  </span>
                </div>
                <p className="text-xs font-medium text-[var(--texto)]">"{r.pergunta}"</p>
                <p className="text-[11px] text-[var(--texto-suave)] line-clamp-2 leading-relaxed">
                  {r.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rodapé do Dashboard com Aviso Permanente da Regra 2 & 5 */}
      <div className="pt-8 border-t border-[var(--linha)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--texto-suave)]">
        <p>{APP_CONFIG.avisoVariacao}</p>
        <button
          type="button"
          onClick={() => alert('Relatório formatado pronto para exportação.')}
          className="px-4 py-2 rounded-full glass-panel hover:bg-white/10 text-white font-medium"
        >
          Exportar relatório
        </button>
      </div>

      {/* Drawer "Como resolver" */}
      {acaoSelecionada && (
        <ResolverDrawer
          isOpen={drawerAberto}
          onClose={() => setDrawerAberto(false)}
          titulo={acaoSelecionada.titulo}
          evidencia={
            'A IA mostrou inconsistências nos dados coletados durante as buscas simuladas.'
          }
          passos={acaoSelecionada.passos}
          conteudoPronto={acaoSelecionada.conteudoPronto}
          concluida={acaoSelecionada.concluida}
          onToggleConcluida={toggleConcluida}
        />
      )}
    </div>
  );
};
