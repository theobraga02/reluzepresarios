import React from 'react';
import { Concorrente } from '../../services/types';

interface ShareBarsProps {
  concorrentes: Concorrente[];
  suaParticipacao?: number;
  seuNome?: string;
}

export const ShareBars: React.FC<ShareBarsProps> = ({
  concorrentes,
  suaParticipacao = 17,
  seuNome = 'Sua empresa',
}) => {
  return (
    <div className="p-6 rounded-[24px] glass-panel border border-[var(--vidro-borda)] text-left flex flex-col justify-between">
      <div>
        <h4 className="text-base font-medium text-[var(--texto)]">Você e concorrentes</h4>
        <p className="text-xs text-[var(--texto-suave)] mb-5">
          Participação relativa nas menções de IA da cidade
        </p>

        {/* Sua Barra em Menta */}
        <div className="space-y-1 mb-4 p-3 rounded-[16px] bg-[rgba(127,227,198,0.06)] border border-[var(--menta)]/20">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-[var(--menta)]">{seuNome}</span>
            <span className="font-bold text-[var(--menta)]">{suaParticipacao}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[var(--menta)] h-full rounded-full transition-all duration-700 shadow-[0_0_8px_var(--menta)]"
              style={{ width: `${suaParticipacao}%` }}
            />
          </div>
        </div>

        {/* Barras dos Concorrentes em branco suave */}
        <div className="space-y-3">
          {concorrentes.slice(0, 4).map((c, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--texto)]">{c.nome}</span>
                <span className="text-[var(--texto-suave)]">{c.participacao}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 rounded-full overflow-hidden">
                <div
                  className="bg-white/30 h-full rounded-full transition-all duration-700"
                  style={{ width: `${c.participacao}%` }}
                />
              </div>
              {/* Chips de por que aparecem */}
              <div className="flex flex-wrap gap-1 pt-0.5">
                {c.atributos.map((at, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-[var(--texto-suave)]"
                  >
                    {at}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
