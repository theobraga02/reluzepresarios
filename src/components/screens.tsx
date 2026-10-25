import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Area as RArea, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Bell, CircleAlert, CircleCheck, Trophy, User, X } from 'lucide-react'
import type { Period, Ponto, Resumo } from '../lib/analytics'
import { moeda as fmtBRL } from '../lib/score'
import type { Area } from '../lib/types'
import { AREA_ICON, BottomNav, LogoMark, ScoreRing } from './ui'

/* ───────────────────────── Hoje ───────────────────────── */

export type HojeData = {
  data: string
  desafio: { texto: string; atual: number; meta: number }
  cards: { area: Area; label: string; valor: string }[]
  nota: number
  mensagem: string
  exemplo?: boolean
}

export function HojeView({ d }: { d: HojeData }) {
  const pct = d.desafio.meta ? (d.desafio.atual / d.desafio.meta) * 100 : 0
  return (
    <div className="scr">
      <header className="scr-head">
        <div>
          <h2>Hoje</h2>
          <p className="scr-sub">{d.data}</p>
        </div>
        <Link to="/app/mais" className="icon-btn" aria-label="Mais opções">
          <User size={16} strokeWidth={1.6} />
        </Link>
      </header>
      <div className="scr-body">
        {d.exemplo && <p className="badge-ex">Exibindo dados de exemplo</p>}
        <div className="card challenge">
          <span className="chip-ic"><Trophy size={13} strokeWidth={1.8} /></span>
          <div className="challenge__txt">
            <b>Desafio do dia</b>
            <p>{d.desafio.texto}</p>
          </div>
          <div className="bar"><i style={{ width: `${pct}%` }} /></div>
          <small className="challenge__n">{d.desafio.atual}/{d.desafio.meta}</small>
        </div>

        <div className="grid2">
          {d.cards.map((c) => {
            const Icon = AREA_ICON[c.area]
            return (
              <div className="card stat" key={c.area}>
                <span className="chip-ic"><Icon size={13} strokeWidth={1.7} /></span>
                <small>{c.label}</small>
                <b>{c.valor}</b>
              </div>
            )
          })}
        </div>

        <Link to="/app/coach" className="card nota">
          <b>Sua nota de hoje</b>
          <div className="nota__row">
            <ScoreRing value={d.nota} size={64} stroke={4} sub="nota média" />
            <p>{d.mensagem}</p>
          </div>
        </Link>
      </div>
      <BottomNav active="hoje" />
    </div>
  )
}

/* ───────────────────────── Painel ───────────────────────── */

export type PainelData = {
  period: Period
  serie: Ponto[]
  variacao: number | null
  resumo: Resumo
}

const PERIODOS: { k: Period; label: string; resumo: string }[] = [
  { k: 'semana', label: 'Semana', resumo: 'Resumo da semana' },
  { k: 'mes', label: 'Mês', resumo: 'Resumo dos últimos 30 dias' },
  { k: 'ano', label: 'Ano', resumo: 'Resumo do ano' },
]

export function PainelView({ d, onPeriod, extra }: { d: PainelData; onPeriod?: (p: Period) => void; extra?: ReactNode }) {
  const v = d.variacao
  const r = d.resumo
  const tem = d.serie.some((p) => p.valor != null)
  return (
    <div className="scr">
      <header className="scr-head">
        <h2>Painel</h2>
        <span className="icon-btn" aria-hidden><Bell size={15} strokeWidth={1.6} /></span>
      </header>
      <div className="scr-body">
        <div className="seg" role="tablist">
          {PERIODOS.map((p) => (
            <button
              key={p.k} role="tab" aria-selected={d.period === p.k}
              className={d.period === p.k ? 'on' : ''} onClick={() => onPeriod?.(p.k)} type="button"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="card chart">
          <div className="chart__head">
            <b>Sua evolução</b>
            <span className={v != null && v < 0 ? 'neg' : ''}>{v == null ? '—' : `${v > 0 ? '+' : ''}${v}%`}</span>
          </div>
          {tem ? (
            <div className="chart__plot">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={d.serie} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gEv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f4f4f5" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#f4f4f5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="label" tickLine={false} axisLine={false} interval="preserveStartEnd"
                    tick={{ fill: '#8d8d92', fontSize: 9 }}
                  />
                  <YAxis hide domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{ background: '#161617', border: '1px solid #2c2c2f', borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: '#9a9aa0' }} itemStyle={{ color: '#f4f4f5' }}
                    formatter={(val) => [Number(val).toFixed(1), 'Nota']}
                  />
                  <RArea
                    type="monotone" dataKey="valor" stroke="#f4f4f5" strokeWidth={2} fill="url(#gEv)"
                    connectNulls isAnimationActive={false} dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="empty">Sem registros neste período. Use “Registrar” para começar.</p>
          )}
        </div>

        <b className="sec-title">{PERIODOS.find((p) => p.k === d.period)?.resumo}</b>
        <div className="grid2">
          <div className="card stat"><span className="chip-ic"><AreaIcon a="habitos" /></span><small>Hábitos</small><b>{r.habitos.a}/{r.habitos.b}</b></div>
          <div className="card stat"><span className="chip-ic"><AreaIcon a="treino" /></span><small>Treino</small><b>{r.treino.a}/{r.treino.b}</b></div>
          <div className="card stat"><span className="chip-ic"><AreaIcon a="financas" /></span><small>Finanças</small><b>{fmtBRL(r.financas)}</b></div>
          <div className="card stat"><span className="chip-ic"><AreaIcon a="vendas" /></span><small>Vendas</small><b>{r.vendas.a}/{r.vendas.b}</b></div>
        </div>
        {extra}
      </div>
      <BottomNav active="painel" />
    </div>
  )
}

function AreaIcon({ a }: { a: Area }) {
  const I = AREA_ICON[a]
  return <I size={13} strokeWidth={1.7} />
}

/* ───────────────────────── IA Coach ───────────────────────── */

export type CoachData = {
  data: string
  nota: number
  fortes: string[]
  melhorar: string[]
  recomendacoes: string[]
  vazio?: boolean
}

export function CoachView({ d }: { d: CoachData }) {
  return (
    <div className="scr">
      <header className="scr-head scr-head--coach">
        <LogoMark size={18} />
        <div>
          <h2>IA Coach</h2>
          <p className="scr-sub">{d.data}</p>
        </div>
        <Link to="/app" className="x-btn" aria-label="Fechar"><X size={16} strokeWidth={1.6} /></Link>
      </header>
      <div className="scr-body">
        <div className="coach-ring">
          <ScoreRing value={d.nota} size={96} stroke={5} sub="nota média" />
          <small>Sua nota de hoje</small>
        </div>

        {d.fortes.length > 0 && (
          <div className="card list-card">
            <b>Pontos fortes</b>
            <ul>
              {d.fortes.map((t) => (
                <li key={t}><CircleCheck size={15} strokeWidth={1.6} className="ok" />{t}</li>
              ))}
            </ul>
          </div>
        )}
        {d.melhorar.length > 0 && (
          <div className="card list-card">
            <b>Pontos a melhorar</b>
            <ul>
              {d.melhorar.map((t) => (
                <li key={t}><CircleAlert size={15} strokeWidth={1.6} className="warn" />{t}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="card list-card">
          <b>Recomendações para amanhã</b>
          <ol>
            {d.recomendacoes.map((t) => <li key={t}>{t}</li>)}
          </ol>
        </div>
        <p className="fine">Avaliação feita por regras locais, a partir dos seus registros. Não é aconselhamento financeiro nem médico.</p>
      </div>
      <Link to="/app/aprender" className="cta-pill">Ver todas as recomendações</Link>
    </div>
  )
}
