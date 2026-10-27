import { Link, useLocation } from 'react-router-dom'
import {
  BookOpen, BriefcaseBusiness, CalendarDays, ChartNoAxesCombined, GraduationCap, Handshake, House, ListChecks, LogOut, Settings, SquarePen, Sparkles,
} from 'lucide-react'
import { Logo } from './ui'
import { sair, useCloud } from '../lib/cloud'

const GRUPOS: { t: string; itens: { to: string; l: string; Icon: typeof House }[] }[] = [
  { t: 'Visão geral', itens: [
    { to: '/app', l: 'Hoje', Icon: House },
    { to: '/app/painel', l: 'Evolução', Icon: ChartNoAxesCombined },
    { to: '/app/registrar', l: 'Registrar', Icon: SquarePen },
    { to: '/app/habitos', l: 'Hábitos', Icon: ListChecks },
  ] },
  { t: 'Desenvolvimento', itens: [
    { to: '/app/aprender', l: 'Aprender', Icon: GraduationCap },
    { to: '/app/coach', l: 'Coach com IA', Icon: Sparkles },
    { to: '/app/biblia', l: 'Bíblia', Icon: BookOpen },
  ] },
  { t: 'Gestão', itens: [
    { to: '/app/agenda', l: 'Agenda', Icon: CalendarDays },
    { to: '/app/rede', l: 'Rede', Icon: Handshake },
    { to: '/app/negocio', l: 'Meu negócio', Icon: BriefcaseBusiness },
  ] },
]

/** Navegação lateral do desktop (no celular continua a barra inferior). */
export function Sidebar() {
  const { pathname } = useLocation()
  const c = useCloud()
  const ativo = (to: string) => (to === '/app' ? pathname === '/app' : pathname.startsWith(to))
  return (
    <aside className="side" aria-label="Navegação lateral">
      <Link to="/app" className="side__brand" aria-label="Reluz Empresários — início"><Logo size={26} /></Link>
      <nav>
        {GRUPOS.map((g) => (
          <div key={g.t} className="side__grp">
            <small>{g.t}</small>
            {g.itens.map(({ to, l, Icon }) => (
              <Link key={to} to={to} className={ativo(to) ? 'on' : ''} aria-current={ativo(to) ? 'page' : undefined}>
                <Icon size={17} strokeWidth={1.6} /> {l}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="side__foot">
        <Link to="/app/mais" className={ativo('/app/mais') ? 'on' : ''}><Settings size={17} strokeWidth={1.6} /> Configurações</Link>
        <button type="button" onClick={() => void sair()}><LogOut size={17} strokeWidth={1.6} /> Sair</button>
        <small title={c.email}>{c.email}</small>
      </div>
    </aside>
  )
}
