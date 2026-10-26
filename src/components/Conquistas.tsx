import { lazy, Suspense, useMemo } from 'react'
import { addDays, keyOf } from '../lib/date'
import { AREAS, AREA_NOME, scoreDia, sequencia } from '../lib/score'
import { useData } from '../lib/store'

const Radar = lazy(() => import('./RadarAreas'))

export function Conquistas() {
  const d = useData()
  const { dados, medalhas } = useMemo(() => {
    const dias = Array.from({ length: 7 }, (_, i) => keyOf(addDays(new Date(), -i)))
    const sc = dias.map((k) => scoreDia(d, k))
    const dados = AREAS.map((a) => ({ area: AREA_NOME[a], v: Math.round((sc.reduce((s, x) => s + x[a], 0) / 7) * 10) / 10 }))
    const seq = sequencia(d)
    const med = [
      { ic: '🔥', t: '3 dias seguidos', ok: seq >= 3 }, { ic: '⚡', t: '7 dias seguidos', ok: seq >= 7 }, { ic: '👑', t: '30 dias seguidos', ok: seq >= 30 },
      { ic: '💪', t: '10 treinos', ok: d.workoutRecords.length >= 10 }, { ic: '📖', t: '10 capítulos', ok: d.bibleRecords.length >= 10 },
      { ic: '💰', t: '10 vendas', ok: d.saleRecords.length >= 10 }, { ic: '🎯', t: '5 hábitos', ok: d.habits.length >= 5 },
    ]
    return { dados, medalhas: med }
  }, [d])
  return (
    <>
      <div className="card">
        <b className="sec-title">Equilíbrio · últimos 7 dias</b>
        <Suspense fallback={<p className="empty">Carregando…</p>}><Radar dados={dados} /></Suspense>
      </div>
      <div className="card">
        <b className="sec-title">Conquistas · {medalhas.filter((m) => m.ok).length}/{medalhas.length}</b>
        <ul className="medalhas">
          {medalhas.map((m) => <li key={m.t} className={m.ok ? 'on' : ''}><span>{m.ic}</span><small>{m.t}</small></li>)}
        </ul>
      </div>
    </>
  )
}
