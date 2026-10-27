import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, ChartNoAxesCombined, Crosshair, Dumbbell, GraduationCap, Handshake, House,
  Library, Moon, RefreshCw, SquarePen, Wallet,
} from 'lucide-react'
import type { Area } from '../lib/types'

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden>
      <path d="M22 5H8v18h14" />
      <path d="M8 14h10" />
      <path d="M12 9.5h10M12 18.5h10" strokeWidth="1.4" opacity=".55" />
    </svg>
  )
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="brand" style={{ fontSize: size * 0.9 }}>
      <b>RELUZ</b>
      <small>EMPRESÁRIOS</small>
    </span>
  )
}

export const AREA_ICON: Record<Area, typeof Moon> = {
  habitos: RefreshCw,
  treino: Dumbbell,
  financas: Wallet,
  vendas: Handshake,
  biblia: BookOpen,
  sono: Moon,
  foco: Crosshair,
  leitura: Library,
}

export function ScoreRing({
  value, size = 96, stroke = 5, sub,
}: { value: number; size?: number; stroke?: number; sub?: string }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(1, Math.max(0, value / 10))
  return (
    <div className="sring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2A2D32" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#D1AD68" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="sring__txt">
        <b style={{ fontSize: size * 0.3 }}>{value.toFixed(1)}</b>
        {sub && <small style={{ fontSize: Math.max(7, size * 0.09) }}>{sub}</small>}
      </div>
    </div>
  )
}

export type NavKey = 'hoje' | 'painel' | 'registrar' | 'aprender'

const NAV: { key: NavKey; to: string; label: string; Icon: typeof House }[] = [
  { key: 'hoje', to: '/app', label: 'Hoje', Icon: House },
  { key: 'painel', to: '/app/painel', label: 'Painel', Icon: ChartNoAxesCombined },
  { key: 'registrar', to: '/app/registrar', label: 'Registrar', Icon: SquarePen },
  { key: 'aprender', to: '/app/aprender', label: 'Aprender', Icon: GraduationCap },
]

export function BottomNav({ active }: { active?: NavKey }) {
  return (
    <nav className="bnav" aria-label="Navegação principal">
      {NAV.map(({ key, to, label, Icon }) => (
        <Link key={key} to={to} className={key === active ? 'on' : ''} aria-current={key === active ? 'page' : undefined}>
          <Icon size={18} strokeWidth={1.6} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}

/** Mostra uma tela de 360×720 reduzida (usado na landing). */
export function Scaled({
  scale, children, w = 360, h = 720,
}: { scale: number; children: ReactNode; w?: number; h?: number }) {
  return (
    <div className="scaled" style={{ width: w * scale, height: h * scale }} aria-hidden>
      <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  )
}
