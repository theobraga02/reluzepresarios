import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'

export default function RadarAreas({ dados }: { dados: { area: string; v: number }[] }) {
  return (
    <div style={{ width: '100%', height: 240 }} role="img" aria-label={'Notas por área: ' + dados.map((x) => `${x.area} ${x.v}`).join(', ')}>
      <ResponsiveContainer>
        <RadarChart data={dados} outerRadius="70%">
          <PolarGrid stroke="#2A2D32" />
          <PolarAngleAxis dataKey="area" tick={{ fill: '#B0B0AD', fontSize: 10 }} />
          <Radar dataKey="v" stroke="#D1AD68" fill="#D1AD68" fillOpacity={0.22} isAnimationActive />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
