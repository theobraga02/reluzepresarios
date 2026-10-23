import React, { useEffect } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { APP_CONFIG } from '../../content/config';

interface ResolverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  evidencia: string;
  passos: string[];
  conteudoPronto?: string;
  concluida: boolean;
  onToggleConcluida: () => void;
}

export const ResolverDrawer: React.FC<ResolverDrawerProps> = ({
  isOpen,
  onClose,
  titulo,
  evidencia,
  passos,
  conteudoPronto,
  concluida,
  onToggleConcluida,
}) => {
  const [copiado, setCopiado] = React.useState(false);

  // Fechar com tecla Escape e travar o scroll do body
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopiar = () => {
    if (conteudoPronto) {
      navigator.clipboard.writeText(conteudoPronto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel lateral do Drawer (480px no desktop, tela cheia no mobile) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="relative z-10 w-full md:w-[480px] h-full bg-[#0B1A22] border-l border-[var(--vidro-borda)] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
      >
        <div className="space-y-6 text-left">
          {/* Cabeçalho */}
          <div className="flex items-start justify-between border-b border-[var(--linha)] pb-4">
            <div>
              <span className="text-xs text-[var(--menta)] font-semibold uppercase tracking-wider">
                Plano de Ação
              </span>
              <h3 id="drawer-title" className="text-lg font-medium text-[var(--texto)] mt-1">
                {titulo}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-[var(--texto-suave)] hover:text-white"
              aria-label="Fechar painel"
            >
              <X size={20} />
            </button>
          </div>

          {/* Por que isso importa (evidência real) */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--texto)]">
              Por que isso importa
            </h4>
            <p className="text-xs sm:text-sm text-[var(--texto-suave)] leading-relaxed">
              {evidencia}
            </p>
          </div>

          {/* Passo a passo */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--texto)]">
              Passo a passo
            </h4>
            <ol className="space-y-2 text-xs sm:text-sm text-[var(--texto-suave)]">
              {passos.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-[var(--menta)] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Caixa de Texto Pronto para copiar */}
          {conteudoPronto && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--texto)]">
                  Texto pronto para copiar
                </h4>
                <button
                  type="button"
                  onClick={handleCopiar}
                  className="text-xs text-[var(--menta)] flex items-center gap-1 hover:underline"
                >
                  {copiado ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiado ? 'Texto copiado!' : 'Copiar texto'}</span>
                </button>
              </div>

              <div className="p-4 rounded-[14px] bg-[rgba(255,255,255,0.02)] border border-[var(--vidro-borda)] text-xs text-[var(--texto)] font-mono whitespace-pre-line leading-relaxed">
                {conteudoPronto}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé: Conclusão da tarefa e WhatsApp */}
        <div className="pt-6 border-t border-[var(--linha)] space-y-4">
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-[14px] bg-white/[0.03] border border-white/5 hover:border-[var(--menta)]/40 transition-colors">
            <input
              type="checkbox"
              checked={concluida}
              onChange={onToggleConcluida}
              className="w-5 h-5 rounded bg-white/10 border-white/20 text-[var(--menta)] focus:ring-0"
            />
            <span className="text-xs sm:text-sm font-medium text-[var(--texto)]">
              {concluida ? 'Marcado como feito' : 'Marcar como feito'}
            </span>
          </label>

          <div className="text-center">
            <a
              href={`https://wa.me/${APP_CONFIG.whatsappNumero}?text=${encodeURIComponent(
                'Olá! Quero ajuda para resolver o item: ' + titulo
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--texto-suave)] hover:text-[var(--menta)] inline-flex items-center gap-1"
            >
              <span>Prefere que a gente faça por você?</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
