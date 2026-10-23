import React, { useState } from 'react';
import { setApiKeyAndSwitchToGemini } from '../../services/provider';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Key, Check, Sparkles, X } from 'lucide-react';

export const ApiKeyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [key, setKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [salvo, setSalvo] = useState(false);

  if (!isOpen) return null;

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      setApiKeyAndSwitchToGemini(key.trim());
      setSalvo(true);
      setTimeout(() => {
        setSalvo(false);
        onClose();
        window.location.reload();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md">
        <GlassCard padding="lg" tone="good" className="shadow-2xl text-left space-y-4">
          <div className="flex items-start justify-between border-b border-[var(--linha)] pb-3">
            <div className="flex items-center gap-2 text-[var(--menta)]">
              <Key size={18} />
              <h3 className="text-base font-medium text-white">Chave Gratuita da API do Gemini</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[var(--texto-suave)] hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-xs text-[var(--texto-suave)] leading-relaxed">
            Para que o Visibilidade.AI faça buscas reais com a inteligência artificial do Google sem banco de dados, insira sua chave gratuita do Google AI Studio. Os dados ficam salvos 100% no seu navegador (localStorage).
          </p>

          <form onSubmit={handleSalvar} className="space-y-3">
            <input
              type="password"
              placeholder="Cole sua chave AIzaSy..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full h-[46px] px-4 rounded-[12px] bg-white/[0.04] border border-[var(--vidro-borda)] text-xs text-white focus:outline-none focus:border-[var(--menta)] font-mono"
              required
            />

            <div className="flex items-center justify-between pt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--menta)] hover:underline inline-flex items-center gap-1"
              >
                <span>Obter chave grátis no Google AI Studio</span>
              </a>

              <Button type="submit" variant="primary" size="sm">
                {salvo ? 'Conectado!' : 'Ativar IA Real'}
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
