import React, { useEffect, useState } from 'react';
import { getDiagnosticProvider } from '../../services/provider';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { FileText, Copy, ExternalLink, Download, Check } from 'lucide-react';

export const ReportsManagementPage: React.FC = () => {
  const provider = getDiagnosticProvider();
  const [copiado, setCopiado] = useState(false);
  const linkRelatorio = `${window.location.origin}/r/rel-padrao-123`;

  const handleCopiar = () => {
    navigator.clipboard.writeText(linkRelatorio);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-display font-medium text-[var(--texto)]">Relatórios</h2>
        <p className="text-xs text-[var(--texto-suave)] mt-1">
          Gere links compartilháveis somente-leitura ou exporte relatórios consolidados em PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Link Compartilhável */}
        <GlassCard padding="lg" className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-semibold text-[var(--menta)] tracking-wider">
                Compartilhamento
              </span>
            </div>
            <h3 className="text-lg font-medium text-[var(--texto)]">Link público do diagnóstico</h3>
            <p className="text-xs text-[var(--texto-suave)] mt-1 leading-relaxed">
              Compartilhe uma versão segura e sem dados confidenciais do seu diagnóstico com sócios,
              parceiros ou clientes.
            </p>

            <div className="mt-4 p-3 rounded-[12px] bg-white/[0.03] border border-white/5 text-xs text-[var(--texto-suave)] break-all font-mono">
              {linkRelatorio}
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button variant="secondary" size="sm" onClick={handleCopiar} className="gap-1.5 flex-1">
              {copiado ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiado ? 'Link copiado!' : 'Copiar link'}</span>
            </Button>
            <a href={linkRelatorio} target="_blank" rel="noopener noreferrer">
              <Button variant="tertiary" size="sm" className="gap-1.5">
                <ExternalLink size={14} />
                <span>Abrir</span>
              </Button>
            </a>
          </div>
        </GlassCard>

        {/* Card de Exportação PDF */}
        <GlassCard padding="lg" className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-semibold text-[var(--aurora)] tracking-wider">
                Download
              </span>
            </div>
            <h3 className="text-lg font-medium text-[var(--texto)]">Exportar Relatório em PDF</h3>
            <p className="text-xs text-[var(--texto-suave)] mt-1 leading-relaxed">
              Documento completo com gráficos de visibilidade, concorrentes mapeados e plano de ação estruturado.
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => alert('Gerando documento PDF...')}
              className="gap-1.5 w-full sm:w-auto"
            >
              <Download size={14} />
              <span>Exportar PDF</span>
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
