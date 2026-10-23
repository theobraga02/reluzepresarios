import React from 'react';
import { Logo } from '../brand/Logo';
import { APP_CONFIG } from '../../content/config';
import { formatarTelefone } from '../../utils/format';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-[var(--linha)] pt-16 pb-12 px-4 sm:px-8 mt-24">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Coluna 1: Marca & Resumo */}
        <div className="md:col-span-1 space-y-4">
          <Logo size="md" />
          <p className="text-[13px] text-[var(--texto-suave)] leading-relaxed">
            A plataforma que mostra a negócios locais o que as IAs respondem na sua cidade.
          </p>
        </div>

        {/* Coluna 2: Produto */}
        <div className="space-y-3">
          <span className="text-[14px] font-semibold text-[var(--texto)]">Produto</span>
          <ul className="space-y-2 text-[13px] text-[var(--texto-suave)]">
            <li>
              <a href="/#como-funciona" className="hover:text-[var(--texto)] transition-colors">
                Como funciona
              </a>
            </li>
            <li>
              <a href="/#o-que-analisamos" className="hover:text-[var(--texto)] transition-colors">
                O que analisamos
              </a>
            </li>
            <li>
              <a href="/#planos" className="hover:text-[var(--texto)] transition-colors">
                Planos
              </a>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Empresa & Legal */}
        <div className="space-y-3">
          <span className="text-[14px] font-semibold text-[var(--texto)]">Empresa</span>
          <ul className="space-y-2 text-[13px] text-[var(--texto-suave)]">
            <li>
              <a href="/#contato" className="hover:text-[var(--texto)] transition-colors">
                Contato
              </a>
            </li>
            <li>
              <a href="/privacidade" className="hover:text-[var(--texto)] transition-colors">
                Política de Privacidade
              </a>
            </li>
            <li>
              <a href="/termos" className="hover:text-[var(--texto)] transition-colors">
                Termos de Uso
              </a>
            </li>
          </ul>
        </div>

        {/* Coluna 4: Contato & WhatsApp */}
        <div className="space-y-3">
          <span className="text-[14px] font-semibold text-[var(--texto)]">Contato</span>
          <ul className="space-y-2 text-[13px] text-[var(--texto-suave)]">
            <li>
              <a
                href={`mailto:${APP_CONFIG.emailContato}`}
                className="hover:text-[var(--texto)] transition-colors"
              >
                {APP_CONFIG.emailContato}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${APP_CONFIG.whatsappNumero}?text=${encodeURIComponent(
                  APP_CONFIG.whatsappMensagemPadrao
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--texto)] transition-colors inline-flex items-center gap-1.5"
              >
                WhatsApp: {formatarTelefone(APP_CONFIG.whatsappNumero)}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Linha Inferior com Aviso Legal Obrigatório (Regra 2 e 5) */}
      <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-[var(--linha)] flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[var(--texto-suave)] text-center md:text-left">
        <p>© 2026 Visibilidade.AI. Todos os direitos reservados.</p>
        <p className="max-w-xl text-center md:text-right text-[11px] text-[var(--texto-suave)]/80">
          {APP_CONFIG.avisoVariacao}
        </p>
      </div>
    </footer>
  );
};
