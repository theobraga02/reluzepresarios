import { useState } from 'react'
import { Conquistas } from '../components/Conquistas'
import { PainelView } from '../components/screens'
import { type Period, mapaCalor, negocio, pessoal, resumo, serie, variacao } from '../lib/analytics'
import { moeda } from '../lib/score'
import { useData } from '../lib/store'
import type { Stage } from '../lib/types'

const ETAPAS: { k: Stage; l: string }[] = [
  { k: 'conheci', l: 'Conheci' }, { k: 'conversei', l: 'Conversei' }, { k: 'proposta', l: 'Proposta' }, { k: 'fechou', l: 'Fechou' },
]

export default function Painel() {
  const d = useData()
  const [period, setPeriod] = useState<Period>('semana')
  const n = negocio(d)
  const p = pessoal(d)
  const mapa = mapaCalor(d)
  const maxF = Math.max(1, ...Object.values(n.funil))
  const temNeg = n.entradas + n.saidas + n.vendasQtd + d.clients.length > 0

  const extra = (
    <>
      <Conquistas />

      <b className="sec-title">Negócio</b>
      {temNeg ? (
        <>
          <div className="grid2">
            <div className="card stat"><small>Entradas</small><b>{moeda(n.entradas)}</b></div>
            <div className="card stat"><small>Saídas</small><b>{moeda(n.saidas)}</b></div>
            <div className="card stat"><small>Saldo</small><b>{moeda(n.saldo)}</b></div>
            <div className="card stat"><small>Ticket médio</small><b>{moeda(n.ticket)}</b></div>
          </div>
          <div className="card list-card">
            <b>Funil de clientes</b>
            <ul className="funil">
              {ETAPAS.map((e) => (
                <li key={e.k}><span>{e.l}</span><i><u style={{ width: `${(n.funil[e.k] / maxF) * 100}%` }} /></i><em>{n.funil[e.k]}</em></li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p className="empty">Registre vendas e finanças para ver o painel do seu negócio.</p>
      )}

      <b className="sec-title">Pessoal · 30 dias</b>
      <div className="grid2">
        <div className="card stat"><small>Treinos</small><b>{p.treinos}</b></div>
        <div className="card stat"><small>Capítulos lidos</small><b>{p.capitulos}</b></div>
        <div className="card stat"><small>Sono médio</small><b>{p.sonoHoras == null ? '—' : `${p.sonoHoras} h`}</b></div>
        <div className="card stat"><small>Foco total</small><b>{Math.round(p.focoMin / 60 * 10) / 10} h</b></div>
      </div>

      <div className="card">
        <b className="sec-title">Constância · 12 semanas</b>
        <div className="heat" role="img" aria-label="Mapa de constância das últimas 12 semanas">
          {mapa.map((col, i) => (
            <div key={i}>{col.map((c) => <i key={c.key} className={`l${c.nivel}${c.futuro ? ' fut' : ''}`} title={c.key} />)}</div>
          ))}
        </div>
      </div>
      <p className="fine">Notas: 50% hábitos + 50% média das outras áreas, de 0 a 10.</p>
    </>
  )

  return (
    <PainelView
      onPeriod={setPeriod}
      extra={extra}
      d={{ period, serie: serie(d, period), variacao: variacao(d, period), resumo: resumo(d, period) }}
    />
  )
}
