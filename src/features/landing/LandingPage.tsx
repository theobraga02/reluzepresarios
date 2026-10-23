import React, { useState } from 'react';
import { Header } from '../../components/brand/Header';
import { Footer } from '../../components/brand/Footer';
import { AuroraBackground } from '../../components/brand/AuroraBackground';
import { GrainOverlay } from '../../components/brand/GrainOverlay';
import { MiniDiagnostic } from '../preview/MiniDiagnostic';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ScoreRing } from '../../components/viz/ScoreRing';
import { MockBadge } from '../../components/domain/MockBadge';
import { FAQS } from '../../content/faq';
import { PLANOS } from '../../content/pricing';
import { APP_CONFIG } from '../../content/config';
import {
  ChevronDown,
  Sparkles,
  Search,
  Layers,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  // Estado do acordeão de FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Estado das abas da seção 6 ("Relatório por dentro")
  const [activeTab, setActiveTab] = useState<'visao' | 'respostas' | 'plano'>('visao');

  // Estado do formulário final
  const [formNome, setFormNome] = useState('');
  const [formTelefone, setFormTelefone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMensagem, setFormMensagem] = useState('');
  const [formEnviado, setFormEnviado] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Perguntas que clientes fazem para a IA (Marquee lento)
  const perguntasMarquee = [
    'melhor pizzaria na Aldeota',
    'dentista de urgência aberto agora',
    'barbearia que atende à noite',
    'salão para noiva perto de mim',
    'oficina de confiança para revisão',
    'academia com aula experimental',
    'restaurante com almoço executivo em Fortaleza',
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      {/* Camadas fixas de fundo aurora e grão */}
      <AuroraBackground variant="landing" />
      <GrainOverlay />

      <Header />

      <main className="relative z-10 flex-1 flex flex-col">
        {/* 1. SEÇÃO HERÓI */}
        <section className="relative pt-8 pb-16 sm:pb-24 px-4 sm:px-8 max-w-[1200px] mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light text-[var(--texto)] tracking-tight leading-[1.05]">
              Quando alguém pergunta à IA,{' '}
              <span className="font-normal text-[var(--menta)]">ela recomenda o seu negócio?</span>
            </h1>
            <p className="mt-6 text-base sm:text-xl text-[var(--texto-suave)] max-w-2xl mx-auto font-normal leading-relaxed">
              Veja o que a IA responde quando um cliente procura o que você vende na sua cidade.
              Prévia grátis em cerca de 30 segundos.
            </p>
          </div>

          {/* Mini-Diagnóstico interativo com o RadarRing memorável */}
          <MiniDiagnostic />
        </section>

        {/* 2. FAIXA DE PERGUNTAS (MARQUEE LENTO) */}
        <section className="relative py-8 border-y border-[var(--linha)] overflow-hidden bg-black/20">
          <div className="flex gap-8 whitespace-nowrap animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
            {[...perguntasMarquee, ...perguntasMarquee].map((p, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel text-xs sm:text-sm text-[var(--texto-suave)] select-none"
              >
                <Search size={14} className="text-[var(--menta)] flex-shrink-0" />
                <span>"{p}"</span>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-[var(--texto-suave)]/70 mt-3">
            Perguntas que clientes fazem para a IA todos os dias (exemplos)
          </p>
        </section>

        {/* 3. O PROBLEMA (DUAS COLUNAS COM SELO EXERCÍCIO ILUSTRATIVO) */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-normal text-[var(--texto)] leading-snug">
                Seu cliente já pergunta para a IA.{' '}
                <span className="text-[var(--menta)]">Ela só cita quem consegue entender.</span>
              </h2>
              <p className="text-base text-[var(--texto-suave)] leading-relaxed">
                Quando seus dados estão incompletos, desencontrados ou só em um lugar, a IA escolhe outro
                negócio. E você nem fica sabendo.
              </p>
            </div>

            {/* Janelas comparativas ilustrativas */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Janela A */}
              <GlassCard padding="md" tone="default">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--linha)]">
                  <span className="text-[11px] font-semibold text-[var(--aurora)] uppercase tracking-wider">
                    Exemplo ilustrativo
                  </span>
                  <span className="text-[11px] text-[var(--texto-suave)]">Busca por nicho</span>
                </div>
                <p className="text-xs text-[var(--texto-suave)] italic mb-3">
                  "Qual a melhor pizzaria aberta domingo à noite na Aldeota?"
                </p>
                <div className="p-3 rounded-[12px] bg-white/[0.03] border border-white/5 text-xs text-[var(--texto)] space-y-2">
                  <p className="text-[var(--texto-suave)] text-[11px]">A IA responde:</p>
                  <p>1. Negócio A (forno a lenha)</p>
                  <p>2. Negócio B (atendimento até 23h)</p>
                  <p>3. Negócio C (entrega expressa)</p>
                </div>
              </GlassCard>

              {/* Janela B */}
              <GlassCard padding="md" tone="bad">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--linha)]">
                  <span className="text-[11px] font-semibold text-[var(--coral)] uppercase tracking-wider">
                    Exemplo ilustrativo
                  </span>
                  <span className="text-[11px] text-[var(--texto-suave)]">O que acontece</span>
                </div>
                <p className="text-xs text-[var(--texto-suave)] italic mb-3">
                  "Qual a melhor pizzaria aberta domingo à noite na Aldeota?"
                </p>
                <div className="p-3 rounded-[12px] bg-[rgba(255,107,74,0.06)] border border-dashed border-[var(--coral)]/40 text-xs text-[var(--texto)] space-y-2">
                  <p className="text-[var(--coral)] text-[11px]">Resultado para sua empresa:</p>
                  <div className="py-4 text-center text-[var(--coral)] font-medium">
                    Seu negócio não apareceu
                  </div>
                  <p className="text-[11px] text-[var(--texto-suave)]">
                    Motivo: horário no perfil marcado como "fechado".
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* 4. COMO FUNCIONA (3 PASSOS REAIS) */}
        <section id="como-funciona" className="py-20 px-4 sm:px-8 max-w-[1200px] mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-normal text-[var(--texto)]">Como funciona</h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--texto-suave)]">
              Em três etapas simples, sem termos técnicos complicados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Passo 1 */}
            <GlassCard padding="lg" className="flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-[rgba(25,184,165,0.15)] border border-[var(--menta)]/30 text-[var(--menta)] font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-medium text-[var(--texto)]">Você informa o negócio</h3>
              <p className="text-sm text-[var(--texto-suave)] leading-relaxed">
                Nome, cidade e tipo. Se quiser, basta colar o link do Google Maps para localizar sua unidade sem dúvidas.
              </p>
            </GlassCard>

            {/* Passo 2 */}
            <GlassCard padding="lg" className="flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-[rgba(25,184,165,0.15)] border border-[var(--menta)]/30 text-[var(--menta)] font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-medium text-[var(--texto)]">A IA faz dezenas de buscas</h3>
              <p className="text-sm text-[var(--texto-suave)] leading-relaxed">
                Do jeito que um cliente faria: por bairro, por serviço, por horário, por ocasião e comparações diretas.
              </p>
            </GlassCard>

            {/* Passo 3 */}
            <GlassCard padding="lg" className="flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-[rgba(25,184,165,0.15)] border border-[var(--menta)]/30 text-[var(--menta)] font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-medium text-[var(--texto)]">Você recebe o diagnóstico</h3>
              <p className="text-sm text-[var(--texto-suave)] leading-relaxed">
                O que a IA responde, quem aparece no seu lugar e um plano de ação completo com textos prontos para copiar.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* 5. O QUE ANALISAMOS (BENTO GRID 12 COLUNAS) */}
        <section id="o-que-analisamos" className="py-20 px-4 sm:px-8 max-w-[1200px] mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-normal text-[var(--texto)]">O que analisamos</h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--texto-suave)]">
              Seis pilares essenciais que decidem se a IA recomenda você ou seus concorrentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Card 1: Citações (6 colunas) */}
            <GlassCard
              padding="lg"
              className="md:col-span-6 flex flex-col justify-between hover:-translate-y-1 transition-transform group"
            >
              <div>
                <span className="text-xs font-semibold text-[var(--menta)] uppercase tracking-wider">
                  Volume de menções
                </span>
                <h3 className="text-xl font-medium text-[var(--texto)] mt-1">Citações</h3>
                <p className="text-sm text-[var(--texto-suave)] mt-2">
                  Quantas vezes a IA fala de você quando clientes procuram na sua cidade.
                </p>
              </div>
              {/* Microvisualização CSS: 10 pontos */}
              <div className="mt-8 flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pt) => (
                  <div
                    key={pt}
                    className={`w-3 h-3 rounded-full ${
                      pt <= 4 ? 'bg-[var(--menta)] shadow-[0_0_8px_var(--menta)]' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </GlassCard>

            {/* Card 2: Posição (6 colunas) */}
            <GlassCard
              padding="lg"
              className="md:col-span-6 flex flex-col justify-between hover:-translate-y-1 transition-transform group"
            >
              <div>
                <span className="text-xs font-semibold text-[var(--menta)] uppercase tracking-wider">
                  Ordem de recomendação
                </span>
                <h3 className="text-xl font-medium text-[var(--texto)] mt-1">Posição</h3>
                <p className="text-sm text-[var(--texto-suave)] mt-2">
                  Primeiro, segundo ou quinto da lista. As respostas recomendam você logo no início?
                </p>
              </div>
              <div className="mt-8 flex items-end gap-3 h-10">
                <div className="w-8 h-10 bg-[var(--aurora)] rounded-t-md" />
                <div className="w-8 h-6 bg-white/20 rounded-t-md" />
                <div className="w-8 h-4 bg-white/10 rounded-t-md" />
              </div>
            </GlassCard>

            {/* Card 3: Dados corretos (4 colunas) */}
            <GlassCard
              padding="lg"
              className="md:col-span-4 flex flex-col justify-between hover:-translate-y-1 transition-transform group"
            >
              <div>
                <h3 className="text-lg font-medium text-[var(--texto)]">Dados corretos</h3>
                <p className="text-xs text-[var(--texto-suave)] mt-1">
                  Endereço, horário e telefone que a IA mostra ao público.
                </p>
              </div>
              <div className="mt-6 space-y-1.5 text-xs text-[var(--texto-suave)]">
                <div className="flex items-center gap-2 text-[var(--aurora)]">
                  <span>✓</span> Endereço oficial
                </div>
                <div className="flex items-center gap-2 text-[var(--aurora)]">
                  <span>✓</span> Telefone de contato
                </div>
                <div className="flex items-center gap-2 text-[var(--coral)]">
                  <span>✕</span> Horário de feriados
                </div>
              </div>
            </GlassCard>

            {/* Card 4: Fontes que mandam (4 colunas) */}
            <GlassCard
              padding="lg"
              className="md:col-span-4 flex flex-col justify-between hover:-translate-y-1 transition-transform group"
            >
              <div>
                <h3 className="text-lg font-medium text-[var(--texto)]">Fontes que mandam</h3>
                <p className="text-xs text-[var(--texto-suave)] mt-1">
                  Os sites e portais de onde a IA tira as informações na sua cidade.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-around py-2">
                <div className="w-8 h-8 rounded-full bg-[var(--menta)]/20 border border-[var(--menta)] flex items-center justify-center text-[10px] text-[var(--menta)]">
                  Maps
                </div>
                <div className="w-6 h-[1px] bg-white/20" />
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-white">
                  Guia
                </div>
                <div className="w-6 h-[1px] bg-white/20" />
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-white">
                  Insta
                </div>
              </div>
            </GlassCard>

            {/* Card 5: Concorrentes (4 colunas) */}
            <GlassCard
              padding="lg"
              className="md:col-span-4 flex flex-col justify-between hover:-translate-y-1 transition-transform group"
            >
              <div>
                <h3 className="text-lg font-medium text-[var(--texto)]">Concorrentes</h3>
                <p className="text-xs text-[var(--texto-suave)] mt-1">
                  Quem aparece no seu lugar e por que eles ganham as respostas.
                </p>
              </div>
              <div className="mt-6 space-y-2">
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div className="bg-[var(--menta)] h-full w-[35%]" />
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div className="bg-white/25 h-full w-[65%]" />
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 6. RELATÓRIO POR DENTRO (COM DADOS REAIS DO MOCKPROVIDER E ETIQUETA OBRIGATÓRIA) */}
        <section className="py-20 px-4 sm:px-8 max-w-[1200px] mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-normal text-[var(--texto)]">
              Veja como é o relatório
            </h2>
            <p className="mt-2 text-sm text-[var(--texto-suave)]">
              Sem dados estáticos. Componentes reais rodando a partir do motor de diagnóstico.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-1 p-1 rounded-full glass-panel overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setActiveTab('visao')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'visao'
                    ? 'bg-white text-[var(--abismo)] shadow-md'
                    : 'text-[var(--texto-suave)] hover:text-white'
                }`}
              >
                Visão geral
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('respostas')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'respostas'
                    ? 'bg-white text-[var(--abismo)] shadow-md'
                    : 'text-[var(--texto-suave)] hover:text-white'
                }`}
              >
                Respostas da IA
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('plano')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'plano'
                    ? 'bg-white text-[var(--abismo)] shadow-md'
                    : 'text-[var(--texto-suave)] hover:text-white'
                }`}
              >
                Plano de ação
              </button>
            </div>
          </div>

          <GlassCard padding="lg" className="border-t border-[var(--menta)]/30">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--linha)]">
              <MockBadge />
              <span className="text-xs text-[var(--texto-suave)]">Pizzaria Exemplo · Fortaleza, CE</span>
            </div>

            {activeTab === 'visao' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 flex justify-center">
                  <ScoreRing score={41} faixaMin={34} faixaMax={49} size={220} />
                </div>
                <div className="md:col-span-7 space-y-4 text-left">
                  <h4 className="text-lg font-medium text-[var(--texto)]">
                    Diagnóstico: Aparece pouco
                  </h4>
                  <p className="text-sm text-[var(--texto-suave)] leading-relaxed">
                    A IA citou seu negócio em 8 de 48 respostas. Você aparece, mas perde para concorrentes em várias buscas.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-[14px] bg-white/[0.03] border border-white/5">
                      <span className="text-xs text-[var(--texto-suave)]">Taxa de citação</span>
                      <p className="text-lg font-semibold text-[var(--texto)] mt-0.5">17%</p>
                    </div>
                    <div className="p-3 rounded-[14px] bg-white/[0.03] border border-white/5">
                      <span className="text-xs text-[var(--texto-suave)]">Posição média</span>
                      <p className="text-lg font-semibold text-[var(--texto)] mt-0.5">3º lugar</p>
                    </div>
                    <div className="p-3 rounded-[14px] bg-white/[0.03] border border-white/5">
                      <span className="text-xs text-[var(--texto-suave)]">Dados corretos</span>
                      <p className="text-lg font-semibold text-[var(--ambar)] mt-0.5">55%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'respostas' && (
              <div className="space-y-4 text-left">
                <div className="p-4 rounded-[16px] bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[var(--menta)] font-medium">Busca por bairro</span>
                    <span className="text-[var(--aurora)] px-2 py-0.5 rounded-full bg-[var(--aurora)]/10 font-semibold">
                      Citou você (3º lugar)
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[var(--texto)] mb-1">
                    "Qual a melhor pizzaria na Aldeota em Fortaleza?"
                  </p>
                  <p className="text-xs text-[var(--texto-suave)] leading-relaxed line-clamp-2">
                    A IA recomendou primeiro Concorrente A e Concorrente B, citando a Pizzaria Exemplo por suas massas artesanais.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'plano' && (
              <div className="space-y-3 text-left">
                <div className="p-4 rounded-[16px] bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--coral)] uppercase">
                      Crítico · Esforço 10 min
                    </span>
                    <h5 className="text-sm font-medium text-[var(--texto)] mt-0.5">
                      Corrigir horário de domingo no Perfil da Empresa no Google
                    </h5>
                    <p className="text-xs text-[var(--texto-suave)] mt-0.5">
                      A IA informou que você estava fechado aos domingos em 5 respostas.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Ver texto pronto
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>
        </section>

        {/* 7. FAIXA "FAÇA POR MIM" */}
        <section className="py-20 px-4 sm:px-8 max-w-[1200px] mx-auto w-full">
          <div className="rounded-[32px] p-8 sm:p-14 bg-gradient-to-br from-[#0E4B5A]/40 via-[#19B8A5]/20 to-[#7FE3C6]/10 border border-[var(--menta)]/30 text-center relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-normal text-[var(--texto)] mb-4">
              Prefere que a gente resolva?
            </h2>
            <p className="max-w-2xl mx-auto text-base text-[var(--texto-suave)] mb-8 leading-relaxed">
              Você nos passa fotos, horários e serviços. A gente cuida do Perfil no Google, das descrições,
              das avaliações e dos relatórios de acompanhamento contínuo.
            </p>
            <a
              href={`https://wa.me/${APP_CONFIG.whatsappNumero}?text=${encodeURIComponent(
                APP_CONFIG.whatsappMensagemPadrao
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="lg">
                Falar no WhatsApp
              </Button>
            </a>
          </div>
        </section>

        {/* 8. PLANOS */}
        <section id="planos" className="py-20 px-4 sm:px-8 max-w-[1200px] mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-normal text-[var(--texto)]">Planos</h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--texto-suave)]">
              Preços honestos e transparentes. Sem contratos de fidelidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANOS.map((plano) => (
              <GlassCard
                key={plano.id}
                padding="lg"
                className="flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-medium text-[var(--texto)]">{plano.nome}</h3>
                  <div className="my-4">
                    <span className="text-3xl font-light text-[var(--menta)]">
                      {plano.destaqueTexto}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--texto-suave)] mb-6 leading-relaxed">
                    {plano.descricao}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {plano.recursos.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--texto)]">
                        <CheckCircle size={15} className="text-[var(--menta)] flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {plano.ctaTipo === 'analise' && (
                    <a href="/#">
                      <Button variant="secondary" fullWidth>
                        {plano.ctaTexto}
                      </Button>
                    </a>
                  )}
                  {plano.ctaTipo === 'cadastro' && (
                    <NavLink to="/criar-conta">
                      <Button variant="primary" fullWidth>
                        {plano.ctaTexto}
                      </Button>
                    </NavLink>
                  )}
                  {plano.ctaTipo === 'whatsapp' && (
                    <a
                      href={`https://wa.me/${APP_CONFIG.whatsappNumero}?text=${encodeURIComponent(
                        APP_CONFIG.whatsappMensagemPadrao
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary" fullWidth>
                        {plano.ctaTexto}
                      </Button>
                    </a>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* 9. PERGUNTAS FREQUENTES (ACORDEÃO ACESSÍVEL) */}
        <section id="perguntas" className="py-20 px-4 sm:px-8 max-w-[800px] mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-normal text-[var(--texto)]">
              Perguntas frequentes
            </h2>
            <p className="mt-2 text-sm text-[var(--texto-suave)]">
              Respostas claras e transparentes sobre como analisamos os dados.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-[18px] glass-panel border border-[var(--vidro-borda)] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-medium text-[var(--texto)] hover:text-[var(--menta)] transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.pergunta}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[var(--texto-suave)] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[var(--menta)]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--texto-suave)] leading-relaxed border-t border-[var(--linha)]">
                      {faq.resposta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 10. FORMULÁRIO FINAL "FALE COM A GENTE" */}
        <section id="contato" className="py-20 px-4 sm:px-8 max-w-[1200px] mx-auto w-full">
          <GlassCard padding="lg" className="bg-gradient-to-b from-[#0B1A22] to-[#0E4B5A]/20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 space-y-4">
                <h2 className="text-3xl font-normal text-[var(--texto)]">Fale com a gente</h2>
                <p className="text-sm text-[var(--texto-suave)] leading-relaxed">
                  Tem dúvidas ou precisa de um atendimento personalizado para a sua empresa?
                  Envie uma mensagem e retornaremos pelo WhatsApp ou e-mail.
                </p>
              </div>

              <div className="lg:col-span-7">
                {formEnviado ? (
                  <div className="p-8 text-center rounded-[18px] bg-[rgba(25,184,165,0.1)] border border-[var(--aurora)]/30">
                    <CheckCircle size={36} className="text-[var(--aurora)] mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-[var(--texto)] mb-1">
                      Mensagem enviada com sucesso!
                    </h4>
                    <p className="text-xs text-[var(--texto-suave)]">
                      Nossa equipe responderá em breve.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFormEnviado(true);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Seu nome"
                        placeholder="Nome completo"
                        value={formNome}
                        onChange={(e) => setFormNome(e.target.value)}
                        required
                      />
                      <Input
                        label="WhatsApp"
                        placeholder="(11) 99999-9999"
                        value={formTelefone}
                        onChange={(e) => setFormTelefone(e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      label="E-mail"
                      type="email"
                      placeholder="seu@email.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                    />
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[13px] font-medium text-[var(--texto)]">
                        Mensagem
                      </label>
                      <textarea
                        rows={3}
                        value={formMensagem}
                        onChange={(e) => setFormMensagem(e.target.value)}
                        placeholder="Como podemos te ajudar?"
                        className="w-full p-4 rounded-[14px] bg-[rgba(255,255,255,0.03)] border border-[var(--vidro-borda)] text-[var(--texto)] placeholder-[var(--texto-suave)]/50 focus:outline-none focus:border-[var(--menta)]"
                        required
                      />
                    </div>
                    <div className="pt-2">
                      <Button type="submit" variant="primary" fullWidth size="md">
                        Enviar mensagem
                      </Button>
                      <p className="text-[11px] text-[var(--texto-suave)] text-center mt-2">
                        Seus dados estão protegidos em conformidade com a LGPD.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </GlassCard>
        </section>
      </main>

      <Footer />
    </div>
  );
};
