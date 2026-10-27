import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { Ponto } from '../lib/serie-habitos'

function Dica({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  const g = (k: string) => payload.find((p) => p.dataKey === k)?.value ?? 0
  return (
    <div className="tip">
      <b>{label}</b>
      <span><i style={{ background: 'var(--gold)' }} /> Hábitos <em>{g('habitos')}%</em></span>
      <span><i style={{ background: '#8A8D93' }} /> Nota geral <em>{(g('nota') / 10).toFixed(1)}</em></span>
    </div>
  )
}

export default function GraficoConsistencia({ dados }: { dados: Ponto[] }) {
  const passo = dados.length > 30 ? 13 : dados.length > 7 ? 4 : 0
  return (
    <div className="graf" role="img" aria-label={`Hábitos concluídos e nota geral nos últimos ${dados.length} dias`}>
      <ResponsiveContainer>
        <AreaChart data={dados} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="gH" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D1AD68" stopOpacity={0.45} /><stop offset="100%" stopColor="#D1AD68" stopOpacity={0.02} /></linearGradient>
            <linearGradient id="gN" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8A8D93" stopOpacity={0.28} /><stop offset="100%" stopColor="#8A8D93" stopOpacity={0.02} /></linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#22252A" />
          <XAxis dataKey="rot" tickLine={false} axisLine={false} tick={{ fill: '#797C82', fontSize: 10 }} interval={passo} minTickGap={14} padding={{ left: 14, right: 14 }} />
          <Tooltip content={<Dica />} cursor={{ stroke: '#3A3E44' }} />
          <Area type="monotone" dataKey="nota" stroke="#8A8D93" strokeWidth={1.4} fill="url(#gN)" isAnimationActive={false} />
          <Area type="monotone" dataKey="habitos" stroke="#D1AD68" strokeWidth={1.8} fill="url(#gH)" isAnimationActive />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
