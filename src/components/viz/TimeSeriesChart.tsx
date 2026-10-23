import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from 'recharts';
import { PontoSerie } from '../../services/types';
import { formatarDiaMesPtBr } from '../../utils/format';
import { ConfidenceBadge } from '../domain/ConfidenceBadge';
import { Table, Eye } from 'lucide-react';

interface TimeSeriesChartProps {
  pontos: PontoSerie[];
  onDotClick?: (acaoId: string) => void;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ pontos, onDotClick }) => {
  const [modoTabela, setModoTabela] = useState(false);

  // Fallback para estado vazio (< 2 análises)
  if (pontos.length < 2) {
    return (
      <div className="p-6 rounded-[24px] glass-panel border border-[var(--vidro-borda)] text-center py-12">
        <h4 className="text-base font-medium text-[var(--texto)] mb-2">Visibilidade em 30 dias</h4>
        <p className="text-xs text-[var(--texto-suave)] max-w-sm mx-auto">
          Ainda não há histórico suficiente. Rode uma nova análise na próxima semana para ver a evolução.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-[24px] glass-panel border border-[var(--vidro-borda)] flex flex-col justify-between">
      {/* Cabeçalho do Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 text-left">
        <div>
          <h4 className="text-base font-medium text-[var(--texto)]">
            Evolução da Visibilidade nos últimos 30 dias
          </h4>
          <span className="text-xs text-[var(--texto-suave)]">
            Score com faixa de confiança estatística de 95%
          </span>
        </div>

        <button
          type="button"
          onClick={() => setModoTabela(!modoTabela)}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--texto-suave)] hover:text-[var(--menta)] self-start sm:self-auto"
        >
          {modoTabela ? <Eye size={13} /> : <Table size={13} />}
          <span>{modoTabela ? 'Ver como gráfico' : 'Ver como tabela'}</span>
        </button>
      </div>

      {/* Visualização: Tabela HTML Acessível ou Gráfico Recharts */}
      {modoTabela ? (
        <div className="overflow-x-auto max-h-[280px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--linha)] text-[var(--texto-suave)]">
                <th className="py-2 px-3">Data</th>
                <th className="py-2 px-3">Score</th>
                <th className="py-2 px-3">Faixa Mín</th>
                <th className="py-2 px-3">Faixa Máx</th>
                <th className="py-2 px-3">Ação concluída</th>
              </tr>
            </thead>
            <tbody>
              {pontos.map((p, idx) => (
                <tr key={idx} className="border-b border-[var(--linha)]/50 hover:bg-white/[0.02]">
                  <td className="py-2 px-3">{formatarDiaMesPtBr(p.data)}</td>
                  <td className="py-2 px-3 font-medium text-[var(--texto)]">{p.valor}</td>
                  <td className="py-2 px-3 text-[var(--texto-suave)]">{p.min}</td>
                  <td className="py-2 px-3 text-[var(--texto-suave)]">{p.max}</td>
                  <td className="py-2 px-3 text-[var(--menta)]">{p.acaoTitulo || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-[280px] w-full" aria-label="Gráfico de linha de evolução de score">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pontos} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="auroraBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#19B8A5" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#19B8A5" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />

              <XAxis
                dataKey="data"
                tickFormatter={(val) => formatarDiaMesPtBr(val)}
                stroke="#8FA6AB"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#8FA6AB"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as PontoSerie;
                    return (
                      <div className="p-3 rounded-[14px] glass-panel bg-[#0B1A22] border border-[var(--vidro-borda)] text-xs text-left shadow-2xl">
                        <p className="text-[var(--texto-suave)] mb-1">
                          {formatarDiaMesPtBr(data.data)}
                        </p>
                        <p className="font-semibold text-[var(--menta)]">
                          Score: {data.valor} (faixa {data.min} a {data.max})
                        </p>
                        {data.acaoTitulo && (
                          <p className="text-[var(--aurora)] mt-1 text-[11px]">
                            Concluído: {data.acaoTitulo}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Banda de Confiança */}
              <Area
                type="monotone"
                dataKey="max"
                stroke="none"
                fill="url(#auroraBand)"
                isAnimationActive={true}
              />

              {/* Linha do Score */}
              <Line
                type="monotone"
                dataKey="valor"
                stroke="var(--aurora)"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={true}
              />

              {/* Marcadores de ação concluída */}
              {pontos
                .filter((p) => p.acaoId)
                .map((p, idx) => (
                  <ReferenceDot
                    key={idx}
                    x={p.data}
                    y={p.valor}
                    r={5}
                    fill="#7FE3C6"
                    stroke="#050B10"
                    strokeWidth={2}
                  />
                ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Rodapé com ConfidenceBadge */}
      <div className="pt-4 border-t border-[var(--linha)] flex justify-end">
        <ConfidenceBadge
          totalRespostas={48}
          modelos={['Gemini 2.5 Flash']}
          data="2026-10-18T10:00:00Z"
        />
      </div>
    </div>
  );
};
