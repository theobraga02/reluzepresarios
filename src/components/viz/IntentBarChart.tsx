import React, { useState } from 'react';
import { Table, Eye } from 'lucide-react';

interface IntentBar {
  tipo: string;
  rotulo: string;
  porcentagem: number;
  totalRespostas: number;
}

interface IntentBarChartProps {
  dados?: IntentBar[];
}

export const IntentBarChart: React.FC<IntentBarChartProps> = ({
  dados = [
    { tipo: 'urgencia', rotulo: 'Urgência e aberto agora', porcentagem: 0, totalRespostas: 8 },
    { tipo: 'bairro', rotulo: 'Buscas por bairro', porcentagem: 12, totalRespostas: 12 },
    { tipo: 'ocasiao', rotulo: 'Por ocasião / encontro', porcentagem: 20, totalRespostas: 10 },
    { tipo: 'descoberta', rotulo: 'Descoberta geral na cidade', porcentagem: 25, totalRespostas: 12 },
    { tipo: 'marca', rotulo: 'Busca direta pelo nome', porcentagem: 75, totalRespostas: 6 },
  ],
}) => {
  const [modoTabela, setModoTabela] = useState(false);

  // Identificar o pior tipo para o título inteligente
  const pior = dados[0];

  return (
    <div className="p-6 rounded-[24px] glass-panel border border-[var(--vidro-borda)] flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 text-left">
        <div>
          <h4 className="text-base font-medium text-[var(--texto)]">
            Você aparece pouco nas buscas de urgência e bairro
          </h4>
          <span className="text-xs text-[var(--texto-suave)]">
            Citação detalhada por intenção de busca do cliente
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

      {modoTabela ? (
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--linha)] text-[var(--texto-suave)]">
              <th className="py-2 px-3">Tipo de busca</th>
              <th className="py-2 px-3">Taxa de citação</th>
              <th className="py-2 px-3">Respostas analisadas</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((d, i) => (
              <tr key={i} className="border-b border-[var(--linha)]/50">
                <td className="py-2 px-3 text-[var(--texto)]">{d.rotulo}</td>
                <td className="py-2 px-3 font-semibold">{d.porcentagem}%</td>
                <td className="py-2 px-3 text-[var(--texto-suave)]">{d.totalRespostas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="space-y-3.5 my-2">
          {dados.map((d, i) => {
            let corBarra = 'bg-[var(--coral)]';
            if (d.porcentagem >= 70) corBarra = 'bg-[var(--aurora)]';
            else if (d.porcentagem >= 25) corBarra = 'bg-[var(--ambar)]';

            return (
              <div key={i} className="space-y-1 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--texto)]">{d.rotulo}</span>
                  <span className="text-[var(--texto-suave)] tabular-nums font-medium">
                    {d.porcentagem}%{' '}
                    <span className="text-[10px] text-[var(--texto-suave)]/70">
                      ({d.totalRespostas} respostas)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${corBarra}`}
                    style={{ width: `${Math.max(3, d.porcentagem)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
