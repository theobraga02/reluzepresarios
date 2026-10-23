import React from 'react';
import { Button } from '../ui/Button';
import { LucideIcon, Clock, Zap } from 'lucide-react';

interface PriorityCardProps {
  gravidade: 'critica' | 'media' | 'baixa';
  titulo: string;
  evidencia: string;
  impacto: 'Alto' | 'Médio' | 'Baixo';
  esforcoMin: number;
  onVerComoResolver: () => void;
}

export const PriorityCard: React.FC<PriorityCardProps> = ({
  gravidade,
  titulo,
  evidencia,
  impacto,
  esforcoMin,
  onVerComoResolver,
}) => {
  let corBorda = 'border-l-[var(--coral)]';
  if (gravidade === 'media') corBorda = 'border-l-[var(--ambar)]';
  if (gravidade === 'baixa') corBorda = 'border-l-[var(--aurora)]';

  return (
    <div
      className={`relative p-5 rounded-[20px] glass-panel border border-[var(--vidro-borda)] border-l-4 ${corBorda} flex flex-col justify-between gap-4`}
    >
      <div className="space-y-1.5 text-left">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
              gravidade === 'critica'
                ? 'bg-[var(--coral)]/15 text-[var(--coral)]'
                : gravidade === 'media'
                ? 'bg-[var(--ambar)]/15 text-[var(--ambar)]'
                : 'bg-[var(--aurora)]/15 text-[var(--aurora)]'
            }`}
          >
            {gravidade === 'critica' ? 'Crítico' : gravidade === 'media' ? 'Importante' : 'Melhoria'}
          </span>
        </div>
        <h4 className="text-sm font-medium text-[var(--texto)]">{titulo}</h4>
        <p className="text-xs text-[var(--texto-suave)] leading-relaxed">{evidencia}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--linha)]">
        <div className="flex items-center gap-2 text-[11px] text-[var(--texto-suave)]">
          <span className="flex items-center gap-1">
            <Zap size={12} className="text-[var(--menta)]" /> Impacto {impacto}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {esforcoMin} min
          </span>
        </div>

        <Button variant="secondary" size="sm" onClick={onVerComoResolver}>
          Ver como resolver
        </Button>
      </div>
    </div>
  );
};
