import { CoachView } from '../components/screens'
import { relatorio } from '../lib/coach'
import { dateLabelLong, todayKey } from '../lib/date'
import { scoreLog } from '../lib/model'
import { useStore } from '../lib/store'

export default function Coach() {
  const s = useStore()
  const key = todayKey()
  const sc = scoreLog(s.logs[key], s.habitos.length)
  const rel = relatorio(sc, !!s.logs[key])
  return (
    <CoachView
      d={{
        data: dateLabelLong(new Date()),
        nota: sc.total,
        fortes: rel.fortes,
        melhorar: rel.melhorar,
        recomendacoes: rel.recomendacoes,
        vazio: !rel.temDados,
      }}
    />
  )
}
