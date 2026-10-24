import { useState } from 'react'
import { PainelView } from '../components/screens'
import { type Period, resumo, serie, variacao } from '../lib/analytics'
import { useStore } from '../lib/store'

export default function Painel() {
  const s = useStore()
  const [period, setPeriod] = useState<Period>('semana')
  return (
    <PainelView
      onPeriod={setPeriod}
      d={{ period, serie: serie(s, period), variacao: variacao(s, period), resumo: resumo(s, period) }}
    />
  )
}
