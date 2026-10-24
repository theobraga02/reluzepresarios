import { Link } from 'react-router-dom'
import {
  ArrowRight, Check, Crosshair, Dumbbell, Handshake, Heart, Lightbulb, Link2, Moon, Package,
  RefreshCw, Sparkles, Star, Wallet, BookOpen,
} from 'lucide-react'
import { ClosingArt, HeroBackdrop } from '../components/art'
import { CoachView, HojeView, PainelView, type CoachData, type HojeData, type PainelData } from '../components/screens'
import { AREA_ICON, BottomNav, Logo, LogoMark, ScoreRing, Scaled } from '../components/ui'
import Aprender from './Aprender'
import Registrar from './Registrar'
import type { Area } from '../lib/model'

/* Dados ilustrativos (exemplo) usados só nas vitrines da landing. */
const DEMO_HOJE: HojeData = {
  data: 'Quarta, 23 de abril',
  desafio: { texto: 'Complete 3 hábitos e faça 30 min de leitura.', atual: 2, meta: 3 },
  cards: [
    { area: 'habitos', label: 'Hábitos', valor: '8/10' },
    { area: 'treino', label: 'Treino', valor: '1/1' },
    { area: 'financas', label: 'Finanças', valor: 'R$ 1.250' },
    { area: 'vendas', label: 'Vendas', valor: '3/5' },
  ],
  nota: 8.5,
  mensagem: 'Você está no caminho certo! Continue mantendo o foco e a disciplina.',
}

const DEMO_PAINEL: PainelData = {
  period: 'semana',
  variacao: 12,
  serie: [
    { label: 'Seg', valor: 5.6 }, { label: 'Ter', valor: 6.4 }, { label: 'Qua', valor: 6.1 },
    { label: 'Qui', valor: 7.0 }, { label: 'Sex', valor: 7.5 }, { label: 'Sáb', valor: 7.2 },
    { label: 'Dom', valor: 8.3 },
  ],
  resumo: {
    habitos: { a: 6, b: 7 }, treino: { a: 4, b: 5 }, financas: 2480, vendas: { a: 8, b: 10 },
  },
}

const DEMO_COACH: CoachData = {
  data: '22 de abril de 2025',
  nota: 8.5,
  fortes: ['Disciplina nos hábitos', 'Boa performance no treino'],
  melhorar: ['Sono ainda irregular', 'Controle de gastos'],
  recomendacoes: [
    'Assista: Hábitos Atômicos (YouTube)',
    'Leia: 10 min — Bíblia',
    'Faça: Treino de força + 20 min de leitura',
  ],
}

const HERO_ROWS: { a: Area; v: number }[] = [
  { a: 'habitos', v: 9.0 }, { a: 'treino', v: 8.5 }, { a: 'financas', v: 7.5 }, { a: 'vendas', v: 8.0 },
  { a: 'biblia', v: 9.0 }, { a: 'sono', v: 8.0 }, { a: 'foco', v: 8.5 },
]
const ROW_NOME: Record<Area, string> = {
  habitos: 'Hábitos', treino: 'Treino', financas: 'Finanças', vendas: 'Vendas', biblia: 'Bíblia', sono: 'Sono', foco: 'Foco',
}

function HeroPhone() {
  return (
    <div className="hp" aria-hidden>
      <div className="hp__screen">
        <div className="hp__status"><span>9:41</span><i /></div>
        <h3>Bom dia, Theo</h3>
        <p>Disciplina hoje, liberdade amanhã.</p>
        <div className="hp__card">
          <ScoreRing value={8.5} size={56} stroke={4} />
          <span>Sua nota de hoje</span>
        </div>
        <ul className="hp__rows">
          {HERO_ROWS.map(({ a, v }) => {
            const Icon = AREA_ICON[a]
            return (
              <li key={a}>
                <Icon size={10} strokeWidth={1.8} />
                <span>{ROW_NOME[a]}</span>
                <i><b style={{ width: `${v * 10}%` }} /></i>
                <em>{v.toFixed(1)}</em>
              </li>
            )
          })}
        </ul>
        <BottomNav active="painel" />
      </div>
    </div>
  )
}

const PERKS = [
  { Icon: Link2, t: 'Desenvolvimento pessoal' },
  { Icon: Crosshair, t: 'Acompanhamento com IA' },
  { Icon: Package, t: 'Dados reais e organizados' },
  { Icon: Heart, t: 'Para uma vida com propósito' },
]

const FEATS = [
  { Icon: RefreshCw, t: 'Hábitos', d: 'Construa disciplina e veja seu progresso dia após dia.' },
  { Icon: BookOpen, t: 'Bíblia', d: 'Leia, reflita e aplique a palavra de Deus no seu dia a dia.' },
  { Icon: Dumbbell, t: 'Treino', d: 'Treinos personalizados e acompanhamento da sua evolução.' },
  { Icon: Moon, t: 'Sono', d: 'Melhore sua energia e sua performance.' },
  { Icon: Wallet, t: 'Financeiro', d: 'Controle seus gastos, receitas e metas.' },
  { Icon: Crosshair, t: 'Foco', d: 'Elimine distrações e mantenha o que realmente importa.' },
  { Icon: Handshake, t: 'Vendas', d: 'Organize suas oportunidades e aumente seus resultados.' },
  { Icon: Lightbulb, t: 'IA Coach', d: 'Receba avaliações diárias e recomendações personalizadas de cursos, livros e vídeos.' },
]

const IDEIAS = [
  'Modo escuro/claro automático', 'Notificações inteligentes', 'Metas personalizadas', 'Comunidade (opcional)',
  'Integração com calendário', 'Gamificação (conquistas e badges)', 'Suporte 24/7', 'Versão web e app (PWA)',
]

const SHOW = 0.585
const SH = 680

export default function Landing() {
  return (
    <div className="landing">
      <section className="top">
        <div className="hero">
          <HeroBackdrop />
          <header className="nav">
            <Link to="/" aria-label="Empresário — início"><Logo /></Link>
            <nav className="nav__links" aria-label="Seções">
              <a className="on" href="#inicio">Início</a>
              <a href="#recursos">Recursos</a>
              <a href="#planos">Planos</a>
              <a href="#sobre">Sobre</a>
            </nav>
            <Link to="/app" className="btn-dark">Entrar</Link>
          </header>

          <div className="hero__main" id="inicio">
            <div className="hero__copy">
              <h1>
                Sua rotina<br />mais <span className="dim">produtiva,</span><br />seu <span className="dim">futuro</span> maior.
              </h1>
              <p>
                O app que te ajuda a evoluir todos os dias, com hábitos, foco, saúde, finanças, vendas e aprendizado — tudo
                em um só lugar.
              </p>
              <div className="hero__cta">
                <Link to="/app" className="btn-white">Comece agora</Link>
                <a href="#recursos" className="btn-ghost"><span><ArrowRight size={12} strokeWidth={1.8} /></span>Saiba mais</a>
              </div>
            </div>
          </div>
          <HeroPhone />

          <ul className="perks">
            {PERKS.map(({ Icon, t }) => (
              <li key={t}><Icon size={22} strokeWidth={1.3} />{t}</li>
            ))}
          </ul>
        </div>

        <aside className="features" id="recursos">
          <h2>Tudo o que você precisa,<br />em um só app.</h2>
          <ul className="feat-grid">
            {FEATS.map(({ Icon, t, d }) => (
              <li key={t}>
                <span className="feat-ic"><Icon size={17} strokeWidth={1.4} /></span>
                <div><b>{t}</b><p>{d}</p></div>
              </li>
            ))}
          </ul>
          <div className="partner">
            <span className="feat-ic feat-ic--lg"><Sparkles size={20} strokeWidth={1.3} /></span>
            <div>
              <b>Mais do que um app. <strong>Um parceiro na sua jornada.</strong></b>
              <p>O Empresário foi feito para quem quer evoluir de verdade. Com tecnologia, propósito e um plano claro.</p>
              <span className="sign">Disciplina gera liberdade.</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="showcase" aria-label="Telas do app">
        <div className="showcase__row">
          <figure>
            <div className="frame"><Scaled scale={SHOW} h={SH}><HojeView d={DEMO_HOJE} /></Scaled></div>
            <figcaption><b>Tela Hoje</b><p>Veja seu progresso, receba desafios e mantenha o foco no que importa.</p></figcaption>
          </figure>
          <figure>
            <div className="frame"><Scaled scale={SHOW} h={SH}><PainelView d={DEMO_PAINEL} /></Scaled></div>
            <figcaption><b>Tela Painel</b><p>Visualize seus dados, acompanhe evoluções e veja onde melhorar.</p></figcaption>
          </figure>
          <figure>
            <div className="frame"><Scaled scale={SHOW} h={SH}><Registrar preview /></Scaled></div>
            <figcaption><b>Tela Registrar</b><p>Registre sua rotina de forma simples e rápida.</p></figcaption>
          </figure>
          <figure>
            <div className="frame"><Scaled scale={SHOW} h={SH}><Aprender preview /></Scaled></div>
            <figcaption><b>Tela Aprender</b><p>Receba recomendações personalizadas de cursos, livros e vídeos.</p></figcaption>
          </figure>
          <figure className="coach-fig">
            <div className="phone"><Scaled scale={0.58} h={SH + 40}><CoachView d={DEMO_COACH} /></Scaled></div>
            <figcaption><b>IA Coach</b><p>Avaliação diária e recomendações feitas especialmente para você.</p></figcaption>
          </figure>
        </div>
        <p className="showcase__note">Telas ilustrativas, com dados de exemplo.</p>
      </section>

      <section className="closing">
        <div className="closing__col closing__hero" id="planos">
          <ClosingArt />
          <div className="closing__copy">
            <h2>Grandes resultados<br />não acontecem por acaso.</h2>
            <p>
              Eles são o resultado de hábitos, foco, disciplina e boas decisões todos os dias. O Empresário te ajuda a
              colocar isso em prática, de forma simples e eficiente.
            </p>
            <Link to="/app" className="btn-white btn-white--sm">Comece agora</Link>
          </div>
        </div>

        <div className="closing__col closing__design" id="sobre">
          <h3>Design moderno. Experiência única.</h3>
          <p>Interface limpa, intuitiva e pensada para você ter o melhor desempenho, todos os dias.</p>
          <div className="minis" aria-hidden>
            <div className="mini"><Scaled scale={0.2} h={680}><CoachView d={DEMO_COACH} /></Scaled></div>
            <div className="mini"><Scaled scale={0.2} h={680}><PainelView d={DEMO_PAINEL} /></Scaled></div>
            <div className="mini"><Scaled scale={0.2} h={680}><Aprender preview /></Scaled></div>
            <div className="mini mini--splash">
              <Star size={20} strokeWidth={1.2} />
              <small>Disciplina hoje,<br />liberdade amanhã.</small>
              <LogoMark size={18} />
              <em>EMPRESÁRIO</em>
            </div>
          </div>
        </div>

        <div className="closing__col closing__ideas">
          <h3><Lightbulb size={20} strokeWidth={1.3} />Próximas ideias</h3>
          <ul>
            {IDEIAS.map((t) => (
              <li key={t}><span><Check size={10} strokeWidth={2.4} /></span>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="foot">
        <Logo size={22} />
        <span>Disciplina. Foco. Resultados.</span>
        <span>Seu futuro começa com as escolhas de hoje.</span>
      </footer>
    </div>
  )
}
