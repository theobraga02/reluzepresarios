import { HojeView } from '../components/screens'
import { dateLabel, dayOfYear, todayKey } from '../lib/date'
import { relatorio } from '../lib/coach'
import { acoesVendas, desafioDoDia, fmtBRL, META, saldo, scoreLog } from '../lib/model'
import { getLog, useStore } from '../lib/store'

export default function Hoje() {
  const s = useStore()
  const hoje = new Date()
  const key = todayKey()
  const log = getLog(s, key)
  const sc = scoreLog(s.logs[key], s.habitos.length)
  const rel = relatorio(sc, !!s.logs[key])
  return (
    <HojeView
      d={{
        data: dateLabel(hoje),
        desafio: desafioDoDia(dayOfYear(hoje), log),
        cards: [
          { area: 'habitos', label: 'Hábitos', valor: `${log.habitos.length}/${s.habitos.length}` },
          { area: 'treino', label: 'Treino', valor: `${log.treino.feito ? 1 : 0}/1` },
          { area: 'financas', label: 'Finanças', valor: fmtBRL(saldo(log)) },
          { area: 'vendas', label: 'Vendas', valor: `${acoesVendas(log)}/${META.vendasDia}` },
        ],
        nota: sc.total,
        mensagem: rel.mensagem,
        exemplo: s.exemplo,
      }}
    />
  )
}
