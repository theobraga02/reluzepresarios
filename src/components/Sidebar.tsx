import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BookOpen, BriefcaseBusiness, CalendarDays, ChartNoAxesCombined, GraduationCap, Handshake, House, ListChecks, LogOut, PanelLeftClose, PanelLeftOpen, Settings, SquarePen, Sparkles,
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
  const [min, setMin] = useState(() => { try { return localStorage.getItem('empresario:side') === 'min' } catch { return false } })
  const alternar = () => { setMin(!min); try { localStorage.setItem('empresario:side', min ? 'max' : 'min') } catch { /* ignora */ } }
  const ativo = (to: string) => (to === '/app' ? pathname === '/app' : pathname.startsWith(to))
  return (
    <aside className={`side ${min ? 'side--min' : ''}`} aria-label="Navegação lateral">
      <Link to="/app" className="side__brand" aria-label="Reluz Empresários — início">{min ? <b className="side__mono">R</b> : <Logo size={26} />}</Link>
      <nav>
        {GRUPOS.map((g) => (
          <div key={g.t} className="side__grp">
            <small>{min ? '' : g.t}</small>
            {g.itens.map(({ to, l, Icon }) => (
              <Link key={to} to={to} title={l} className={ativo(to) ? 'on' : ''} aria-current={ativo(to) ? 'page' : undefined}>
                <Icon size={17} strokeWidth={1.6} /> <span>{l}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="side__foot">
        <Link to="/app/mais" title="Configurações" className={ativo('/app/mais') ? 'on' : ''}><Settings size={17} strokeWidth={1.6} /> <span>Configurações</span></Link>
        <button type="button" title="Sair" onClick={() => void sair()}><LogOut size={17} strokeWidth={1.6} /> <span>Sair</span></button>
        <button type="button" title={min ? 'Expandir menu' : 'Recolher menu'} aria-label={min ? 'Expandir menu' : 'Recolher menu'} onClick={alternar}>{min ? <PanelLeftOpen size={17} strokeWidth={1.6} /> : <PanelLeftClose size={17} strokeWidth={1.6} />} <span>Recolher</span></button>
        <small title={c.email}>{c.email}</small>
      </div>
    </aside>
  )
}
