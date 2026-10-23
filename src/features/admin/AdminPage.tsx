import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Download, Users, FileText, CheckCircle } from 'lucide-react';
import { formatarDataPtBr } from '../../utils/format';

interface Lead {
  id: string;
  nome: string;
  negocio: string;
  cidade: string;
  nicho: string;
  whatsapp: string;
  data: string;
  status: 'previa' | 'cadastrado' | 'contatado';
}

export const AdminPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'lead-1',
      nome: 'Carlos Silva',
      negocio: 'Pizzaria Forno Nobre',
      cidade: 'Fortaleza, CE',
      nicho: 'Pizzaria',
      whatsapp: '(85) 99123-4567',
      data: '2026-10-19T14:30:00Z',
      status: 'cadastrado',
    },
    {
      id: 'lead-2',
      nome: 'Dra. Mariana Costa',
      negocio: 'Clínica Odonto Vida',
      cidade: 'Fortaleza, CE',
      nicho: 'Clínica odontológica',
      whatsapp: '(85) 98877-6655',
      data: '2026-10-19T16:00:00Z',
      status: 'previa',
    },
    {
      id: 'lead-3',
      nome: 'Roberto Mendes',
      negocio: 'Barbearia Retrô',
      cidade: 'Fortaleza, CE',
      nicho: 'Barbearia',
      whatsapp: '(85) 99444-1122',
      data: '2026-10-18T19:20:00Z',
      status: 'contatado',
    },
  ]);

  const exportarCSV = () => {
    const cabecalho = 'ID,Nome,Negocio,Cidade,Nicho,WhatsApp,Data,Status\n';
    const linhas = leads
      .map(
        (l) =>
          `"${l.id}","${l.nome}","${l.negocio}","${l.cidade}","${l.nicho}","${l.whatsapp}","${l.data}","${l.status}"`
      )
      .join('\n');
    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-visibilidade-ai-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto p-6 sm:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-semibold text-[var(--coral)] tracking-wider">
            Acesso Restrito
          </span>
          <h2 className="text-2xl font-display font-medium text-[var(--texto)] mt-1">
            Painel do Administrador
          </h2>
          <p className="text-xs text-[var(--texto-suave)] mt-1">
            Gestão de leads da prévia, conversões e exportação de dados.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={exportarCSV} className="gap-1.5 self-start sm:self-auto">
          <Download size={14} />
          <span>Exportar CSV</span>
        </Button>
      </div>

      {/* Tabela de Leads */}
      <GlassCard padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--linha)] text-[var(--texto-suave)] bg-white/[0.02]">
                <th className="py-3 px-4">Responsável</th>
                <th className="py-3 px-4">Negócio</th>
                <th className="py-3 px-4">Cidade / Nicho</th>
                <th className="py-3 px-4">WhatsApp</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-[var(--linha)]/50 hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-medium text-white">{l.nome}</td>
                  <td className="py-3 px-4 text-[var(--texto)]">{l.negocio}</td>
                  <td className="py-3 px-4 text-[var(--texto-suave)]">
                    {l.cidade} · {l.nicho}
                  </td>
                  <td className="py-3 px-4 text-[var(--menta)]">{l.whatsapp}</td>
                  <td className="py-3 px-4 text-[var(--texto-suave)]">
                    {formatarDataPtBr(l.data)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        l.status === 'cadastrado'
                          ? 'bg-[var(--aurora)]/15 text-[var(--aurora)]'
                          : l.status === 'contatado'
                          ? 'bg-white/10 text-white'
                          : 'bg-[var(--ambar)]/15 text-[var(--ambar)]'
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
