import React from 'react';
import { Button } from '../ui/Button';
import { Lock } from 'lucide-react';

interface LockedPreviewProps {
  onCtaClick: () => void;
  className?: string;
}

export const LockedPreview: React.FC<LockedPreviewProps> = ({ onCtaClick, className = '' }) => {
  return (
    <div className={`relative mt-8 rounded-[28px] overflow-hidden glass-panel p-8 text-center ${className}`}>
      {/* Elementos placeholders puramente sintéticos (SEM conter dados reais no DOM) */}
      <div className="space-y-4 filter blur-[6px] opacity-40 select-none pointer-events-none" aria-hidden="true">
        <div className="h-6 w-3/4 mx-auto bg-white/10 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="h-28 bg-white/5 rounded-[16px] border border-white/5 p-4 flex flex-col justify-between">
            <div className="h-4 w-1/2 bg-white/10 rounded-full" />
            <div className="h-8 w-1/3 bg-white/10 rounded-full" />
          </div>
          <div className="h-28 bg-white/5 rounded-[16px] border border-white/5 p-4 flex flex-col justify-between">
            <div className="h-4 w-1/2 bg-white/10 rounded-full" />
            <div className="h-8 w-1/3 bg-white/10 rounded-full" />
          </div>
          <div className="h-28 bg-white/5 rounded-[16px] border border-white/5 p-4 flex flex-col justify-between">
            <div className="h-4 w-1/2 bg-white/10 rounded-full" />
            <div className="h-8 w-1/3 bg-white/10 rounded-full" />
          </div>
        </div>
        <div className="h-16 w-full bg-white/5 rounded-[16px] border border-white/5" />
        <div className="h-16 w-full bg-white/5 rounded-[16px] border border-white/5" />
      </div>

      {/* Conteúdo central de conversão */}
      <div className="relative z-10 -mt-36 max-w-lg mx-auto py-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-[rgba(25,184,165,0.15)] border border-[var(--menta)]/30 flex items-center justify-center text-[var(--menta)] mb-4">
          <Lock size={20} />
        </div>
        <h3 className="text-xl md:text-2xl font-display font-medium text-[var(--texto)] mb-2">
          Relatório completo com mais de 40 buscas
        </h3>
        <p className="text-[var(--texto-suave)] text-sm mb-6 leading-relaxed">
          Crie sua conta grátis para ver as outras respostas detalhadas, auditoria completa de
          concorrentes, lista de fontes locais e o plano de ação com textos prontos para copiar.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" onClick={onCtaClick} className="w-full sm:w-auto">
            Criar conta e ver o relatório
          </Button>
          <a
            href="/entrar"
            className="text-sm text-[var(--texto-suave)] hover:text-[var(--texto)] hover:underline py-2"
          >
            Já tenho conta
          </a>
        </div>
      </div>
    </div>
  );
};
