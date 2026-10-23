import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { Menu, X } from 'lucide-react';
import { ApiKeyModal } from '../domain/ApiKeyModal';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalApiKey, setModalApiKey] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-4 backdrop-blur-md transition-all">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" aria-label="Visibilidade.AI - Página Inicial">
          <Logo size="md" />
        </NavLink>

        {/* Pílula de navegação central (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full glass-panel shadow-sm"
          aria-label="Navegação principal"
        >
          <a
            href="/#como-funciona"
            className="px-3.5 py-1.5 rounded-full text-[14px] text-[var(--texto-suave)] hover:text-[var(--texto)] transition-colors"
          >
            Como funciona
          </a>
          <a
            href="/#o-que-analisamos"
            className="px-3.5 py-1.5 rounded-full text-[14px] text-[var(--texto-suave)] hover:text-[var(--texto)] transition-colors"
          >
            O que analisamos
          </a>
          <a
            href="/#planos"
            className="px-3.5 py-1.5 rounded-full text-[14px] text-[var(--texto-suave)] hover:text-[var(--texto)] transition-colors"
          >
            Planos
          </a>
          <a
            href="/#perguntas"
            className="px-3.5 py-1.5 rounded-full text-[14px] text-[var(--texto-suave)] hover:text-[var(--texto)] transition-colors"
          >
            Perguntas
          </a>
        </nav>

        {/* Botões à direita (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => setModalApiKey(true)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--menta)]/40 text-[var(--menta)] hover:bg-[var(--menta)]/10 transition-colors"
          >
            {localStorage.getItem('gemini_api_key') ? '✓ Gemini IA Ativo' : 'Conectar Gemini Grátis'}
          </button>
          <NavLink to="/entrar">
            <Button variant="secondary" size="sm">
              Entrar
            </Button>
          </NavLink>
          <NavLink to="/criar-conta">
            <Button variant="primary" size="sm">
              Criar conta grátis
            </Button>
          </NavLink>
        </div>

        {/* Botão Menu Mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full glass-panel text-[var(--texto)] focus:outline-none"
          aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Painel Mobile em Vidro */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 p-6 rounded-[24px] glass-panel bg-[#0B1A22]/95 border border-[var(--vidro-borda)] shadow-2xl flex flex-col gap-4 z-50 animate-in fade-in zoom-in-95 duration-200">
          <nav className="flex flex-col gap-3">
            <a
              href="/#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-[15px] font-medium text-[var(--texto-suave)] hover:text-[var(--texto)] border-b border-[var(--linha)]"
            >
              Como funciona
            </a>
            <a
              href="/#o-que-analisamos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-[15px] font-medium text-[var(--texto-suave)] hover:text-[var(--texto)] border-b border-[var(--linha)]"
            >
              O que analisamos
            </a>
            <a
              href="/#planos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-[15px] font-medium text-[var(--texto-suave)] hover:text-[var(--texto)] border-b border-[var(--linha)]"
            >
              Planos
            </a>
            <a
              href="/#perguntas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-[15px] font-medium text-[var(--texto-suave)] hover:text-[var(--texto)] border-b border-[var(--linha)]"
            >
              Perguntas
            </a>
          </nav>
          <div className="flex flex-col gap-2.5 pt-2">
            <NavLink to="/entrar" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" fullWidth size="md">
                Entrar
              </Button>
            </NavLink>
            <NavLink to="/criar-conta" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" fullWidth size="md">
                Criar conta grátis
              </Button>
            </NavLink>
          </div>
        </div>
      )}

      {/* Modal de Conexão da Chave Gemini */}
      <ApiKeyModal isOpen={modalApiKey} onClose={() => setModalApiKey(false)} />
    </header>
  );
};
