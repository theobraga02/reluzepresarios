import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'

export default function RadarAreas({ dados }: { dados: { area: string; v: number }[] }) {
  return (
    <div style={{ width: '100%', height: 240 }} role="img" aria-label={'Notas por área: ' + dados.map((x) => `${x.area} ${x.v}`).join(', ')}>
      <ResponsiveContainer>
        <RadarChart data={dados} outerRadius="70%">
          <PolarGrid stroke="#2e2e31" />
          <PolarAngleAxis dataKey="area" tick={{ fill: '#9a9aa0', fontSize: 10 }} />
          <Radar dataKey="v" stroke="#f4f4f5" fill="#f4f4f5" fillOpacity={0.22} isAnimationActive />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
