import React, { useState } from 'react';
import { getDiagnosticProvider } from '../../services/provider';
import { Negocio, Progresso, ResumoPrevia } from '../../services/types';
import { NICHOS_INICIAIS } from '../../content/niches';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { RadarRing, RadarRingState } from '../../components/viz/RadarRing';
import { LockedPreview } from '../../components/domain/LockedPreview';
import { ConfidenceBadge } from '../../components/domain/ConfidenceBadge';
import { MockBadge } from '../../components/domain/MockBadge';
import { CheckCircle2, ChevronRight, MapPin, Building2, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MiniDiagnostic: React.FC = () => {
  const navigate = useNavigate();
  const provider = getDiagnosticProvider();

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [nicho, setNicho] = useState('Pizzaria');
  const [nichoOutro, setNichoOutro] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [mostrarMapsInput, setMostrarMapsInput] = useState(false);

  // Estados de erro
  const [erros, setErros] = useState<Record<string, string>>({});

  // Estados do fluxo
  const [etapa, setEtapa] = useState<'formulario' | 'candidatos' | 'analisando' | 'resultado'>('formulario');
  const [candidatos, setCandidatos] = useState<Negocio[]>([]);
  const [negocioEscolhido, setNegocioEscolhido] = useState<Negocio | null>(null);

  // Estados de análise e progresso
  const [ringState, setRingState] = useState<RadarRingState>('repouso');
  const [progresso, setProgresso] = useState<Progresso>({ feitas: 0, total: 3, etapa: 'resolvendo' });
  const [resultadoPrevia, setResultadoPrevia] = useState<ResumoPrevia | null>(null);
  const [erroAnalise, setErroAnalise] = useState<string | null>(null);

  // Validação
  const validar = (): boolean => {
    const novosErros: Record<string, string> = {};
    if (!nome.trim() || nome.trim().length < 2 || nome.trim().length > 80) {
      novosErros.nome = 'Informe o nome do negócio (de 2 a 80 caracteres).';
    }
    if (!cidade.trim()) {
      novosErros.cidade = 'Informe a cidade (ex: Fortaleza, CE).';
    }
    if (nicho === 'Outro' && !nichoOutro.trim()) {
      novosErros.nicho = 'Descreva o tipo de negócio.';
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Iniciar resolução
  const handleIniciar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    const nichoFinal = nicho === 'Outro' ? nichoOutro : nicho;

    try {
      setRingState('repouso');
      const res = await provider.resolverNegocio({
        nome,
        cidade,
        nicho: nichoFinal,
        mapsUrl: mapsUrl || undefined,
      });

      if (res.candidatos.length > 1) {
        setCandidatos(res.candidatos);
        setEtapa('candidatos');
      } else if (res.candidatos.length === 1) {
        executarAnalise(res.candidatos[0]);
      } else {
        // Negócio não encontrado
        setErros({ nome: 'Não achamos esse negócio. Cole o link no Google Maps ou continue só pelo nome.' });
        setMostrarMapsInput(true);
      }
    } catch (err) {
      setErroAnalise('Sem conexão. Verifique a internet e tente de novo.');
      setRingState('erro');
    }
  };

  // Executar a análise de 3 buscas
  const executarAnalise = async (neg: Negocio) => {
    setNegocioEscolhido(neg);
    setEtapa('analisando');
    setRingState('analisando');
    setErroAnalise(null);

    try {
      const { scanId } = await provider.iniciarPrevia({ negocio: neg, captcha: 'mock-token' });

      // Consumir o streaming assíncrono
      const iterator = provider.acompanhar(scanId, (p) => {
        setProgresso(p);
      });

      for await (const p of iterator) {
        setProgresso(p);
      }

      // Obter o resultado final
      const previa = await provider.obterPrevia(scanId);
      setResultadoPrevia(previa);
      setRingState('resultado');
      setEtapa('resultado');

      // Salvar scanId na sessão para onboarding posterior
      sessionStorage.setItem('visibilidade_scan_id', scanId);
      sessionStorage.setItem('visibilidade_negocio', JSON.stringify(neg));
    } catch (err) {
      setErroAnalise('Não conseguimos consultar a IA agora. Tente de novo em instantes.');
      setRingState('erro');
    }
  };

  return (
    <div className="w-full">
      {/* Grid Desktop de 2 Colunas: Formulário à esquerda, RadarRing à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Coluna da Esquerda: Formulário ou Detalhes da Análise */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {etapa === 'formulario' && (
            <GlassCard tone="default" padding="lg" className="shadow-2xl">
              <form onSubmit={handleIniciar} className="flex flex-col gap-4 text-left">
                <Input
                  label="Nome do negócio"
                  placeholder="Ex: Pizzaria Forno Nobre"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  error={erros.nome}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Cidade"
                    placeholder="Ex: Fortaleza, CE"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    error={erros.cidade}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="nicho-select"
                      className="text-[13px] font-medium text-[var(--texto)]"
                    >
                      Tipo de negócio
                    </label>
                    <select
                      id="nicho-select"
                      value={nicho}
                      onChange={(e) => setNicho(e.target.value)}
                      className="h-[52px] w-full px-4 rounded-[14px] bg-[rgba(255,255,255,0.03)] border border-[var(--vidro-borda)] text-[var(--texto)] focus:outline-none focus:border-[var(--menta)]"
                    >
                      {NICHOS_INICIAIS.map((n) => (
                        <option key={n.slug} value={n.nome} className="bg-[#0B1A22] text-white">
                          {n.nome}
                        </option>
                      ))}
                      <option value="Outro" className="bg-[#0B1A22] text-white">
                        Outro...
                      </option>
                    </select>
                  </div>
                </div>

                {nicho === 'Outro' && (
                  <Input
                    label="Qual é o seu tipo de negócio?"
                    placeholder="Ex: Loja de material esportivo"
                    value={nichoOutro}
                    onChange={(e) => setNichoOutro(e.target.value)}
                    error={erros.nicho}
                  />
                )}

                {/* Link do Google Maps opcional */}
                <div>
                  {!mostrarMapsInput ? (
                    <button
                      type="button"
                      onClick={() => setMostrarMapsInput(true)}
                      className="text-[13px] text-[var(--texto-suave)] hover:text-[var(--menta)] underline underline-offset-4 transition-colors"
                    >
                      + Tenho o link do Google Maps (opcional)
                    </button>
                  ) : (
                    <Input
                      label="Link do Google Maps (opcional)"
                      placeholder="https://maps.google.com/..."
                      value={mapsUrl}
                      onChange={(e) => setMapsUrl(e.target.value)}
                    />
                  )}
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" fullWidth size="lg">
                    Analisar meu negócio
                  </Button>
                  <p className="text-center text-[12px] text-[var(--texto-suave)] mt-2.5">
                    Prévia rápida com 3 buscas reais. Sem necessidade de cadastro inicial.
                  </p>
                </div>
              </form>
            </GlassCard>
          )}

          {/* Etapa de Resolução com Múltiplos Candidatos (Seção 11) */}
          {etapa === 'candidatos' && (
            <GlassCard tone="warn" padding="lg">
              <h3 className="text-lg font-medium text-[var(--texto)] mb-1">
                Encontramos mais de um negócio com esse nome
              </h3>
              <p className="text-xs text-[var(--texto-suave)] mb-4">
                Selecione qual é a sua unidade para analisarmos os dados exatos:
              </p>
              <div className="flex flex-col gap-2.5">
                {candidatos.map((cand) => (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => executarAnalise(cand)}
                    className="p-3.5 rounded-[16px] bg-[rgba(255,255,255,0.03)] border border-[var(--vidro-borda)] hover:border-[var(--menta)] flex items-center justify-between text-left transition-all group"
                  >
                    <div>
                      <span className="font-medium text-sm text-[var(--texto)] block group-hover:text-[var(--menta)]">
                        {cand.nome}
                      </span>
                      <span className="text-xs text-[var(--texto-suave)] flex items-center gap-1 mt-0.5">
                        <MapPin size={12} /> {cand.endereco}
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-[var(--texto-suave)] group-hover:text-[var(--menta)]" />
                  </button>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Etapa Analisando (aria-live com atualizações em tempo real) */}
          {etapa === 'analisando' && (
            <GlassCard padding="lg" tone="good" className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--linha)] pb-3">
                <span className="text-sm font-medium text-[var(--texto)]">
                  Consultando IA para: {negocioEscolhido?.nome}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[rgba(25,184,165,0.15)] text-[var(--menta)] font-medium">
                  {progresso.feitas} de {progresso.total} buscas
                </span>
              </div>

              {/* Lista em tempo real das buscas (aria-live polite) */}
              <div
                className="space-y-3 py-2"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="p-3 rounded-[14px] bg-white/[0.02] border border-white/5 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--menta)] animate-ping" />
                  <span className="text-xs text-[var(--texto)]">
                    {progresso.buscaAtual || 'Executando buscas simuladas...'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[var(--texto-suave)] text-center">
                Duração média esperada: 20 a 35 segundos.
              </p>
            </GlassCard>
          )}

          {/* Etapa de Resultado Parcial (Honestidade dos dados, Regra 2) */}
          {etapa === 'resultado' && resultadoPrevia && (
            <div className="flex flex-col gap-4">
              <GlassCard tone="good" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <MockBadge />
                  <ConfidenceBadge
                    totalRespostas={resultadoPrevia.totalBuscas}
                    modelos={resultadoPrevia.modelos}
                    data={resultadoPrevia.criadoEm}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--texto)]">
                    <CheckCircle2 size={18} className="text-[var(--aurora)]" />
                    <span>
                      Citado em <strong>{resultadoPrevia.citacoes}</strong> de{' '}
                      <strong>{resultadoPrevia.totalBuscas}</strong> buscas realizadas na prévia.
                    </span>
                  </div>

                  {resultadoPrevia.concorrenteExemplo && (
                    <div className="p-3 rounded-[14px] bg-white/[0.03] border border-white/5 text-xs text-[var(--texto-suave)]">
                      <span className="text-[var(--menta)] font-medium">Concorrente identificado: </span>
                      {resultadoPrevia.concorrenteExemplo} apareceu em destaque nas buscas pelo seu nicho.
                    </div>
                  )}

                  {resultadoPrevia.achado && (
                    <div className="p-3 rounded-[14px] bg-[rgba(255,107,74,0.08)] border border-[rgba(255,107,74,0.2)] text-xs text-[var(--coral)]">
                      <strong>Atenção detectada: </strong>
                      {resultadoPrevia.achado}
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Bloqueio de conversão honesto (DOM seguro, sem dados reais escondidos) */}
              <LockedPreview onCtaClick={() => navigate('/criar-conta')} />
            </div>
          )}
        </div>

        {/* Coluna da Direita: RadarRing com Elemento Memorável e Cartões Flutuantes */}
        <div className="lg:col-span-5 flex justify-center items-center py-6 relative">
          {/* Cartão Flutuante 1 (Superior Esquerdo) */}
          <div
            className="hidden sm:flex absolute -top-2 left-0 z-10 px-3.5 py-2 rounded-[16px] glass-panel border border-[var(--vidro-borda)] shadow-lg items-center gap-2 select-none animate-[float_4s_ease-in-out_infinite]"
            style={{ animationDelay: '0s' }}
          >
            <div className="w-2 h-2 rounded-full bg-[var(--aurora)]" />
            <div className="text-left">
              <span className="text-[10px] text-[var(--texto-suave)] block uppercase font-medium">
                {etapa === 'resultado' ? 'Resultado prévia' : 'Exemplo'}
              </span>
              <span className="text-xs font-semibold text-white">
                {etapa === 'resultado' ? 'Citado em 1 de 3 buscas' : 'Citado em 1 de 3 buscas'}
              </span>
            </div>
          </div>

          {/* Cartão Flutuante 2 (Superior Direito) */}
          <div
            className="hidden sm:flex absolute top-12 -right-4 z-10 px-3.5 py-2 rounded-[16px] glass-panel border border-[var(--vidro-borda)] shadow-lg items-center gap-2 select-none animate-[float_5s_ease-in-out_infinite]"
            style={{ animationDelay: '1.2s' }}
          >
            <div className="w-2 h-2 rounded-full bg-[var(--ambar)]" />
            <div className="text-left">
              <span className="text-[10px] text-[var(--texto-suave)] block uppercase font-medium">
                {etapa === 'resultado' ? 'Identificado' : 'Exemplo'}
              </span>
              <span className="text-xs font-semibold text-white">
                {etapa === 'resultado' ? 'Concorrente A apareceu' : 'Concorrente que apareceu'}
              </span>
            </div>
          </div>

          {/* Cartão Flutuante 3 (Inferior Direito) */}
          <div
            className="hidden sm:flex absolute bottom-8 -right-2 z-10 px-3.5 py-2 rounded-[16px] glass-panel border border-[var(--vidro-borda)] shadow-lg items-center gap-2 select-none animate-[float_4.5s_ease-in-out_infinite]"
            style={{ animationDelay: '2.4s' }}
          >
            <div className="w-2 h-2 rounded-full bg-[var(--coral)]" />
            <div className="text-left">
              <span className="text-[10px] text-[var(--texto-suave)] block uppercase font-medium">
                {etapa === 'resultado' ? 'Inconsistência' : 'Exemplo'}
              </span>
              <span className="text-xs font-semibold text-white">
                {etapa === 'resultado' ? 'Horário divergente' : '1 dado diferente do real'}
              </span>
            </div>
          </div>

          <RadarRing
            state={ringState}
            buscaAtualNumero={progresso.feitas}
            totalBuscas={progresso.total}
            score={resultadoPrevia?.score.valor || 41}
            faixaMin={resultadoPrevia?.score.faixaMin || 34}
            faixaMax={resultadoPrevia?.score.faixaMax || 49}
            mensagemErro={erroAnalise || undefined}
          />
        </div>
      </div>
    </div>
  );
};
