import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../components/brand/Logo';
import { AuroraBackground } from '../components/brand/AuroraBackground';
import { GrainOverlay } from '../components/brand/GrainOverlay';
import { MockBadge } from '../components/domain/MockBadge';
import { Button } from '../components/ui/Button';
import { APP_CONFIG } from '../content/config';
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Users,
  Globe2,
  CheckSquare,
  FileText,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: 'Visão geral', path: '/app', icon: LayoutDashboard },
    { label: 'Análises', path: '/app/analises', icon: BarChart3 },
    { label: 'Respostas da IA', path: '/app/respostas', icon: MessageSquare },
    { label: 'Concorrentes', path: '/app/concorrentes', icon: Users },
    { label: 'Fontes', path: '/app/fontes', icon: Globe2 },
    { label: 'Presença', path: '/app/presenca', icon: ShieldCheck },
    { label: 'Plano de ação', path: '/app/plano', icon: CheckSquare },
    { label: 'Relatórios', path: '/app/relatorios', icon: FileText },
    { label: 'Conta', path: '/app/conta', icon: User },
  ];

  return (
    <div className="relative min-h-screen flex bg-[#050B10] text-[var(--texto)] overflow-x-hidden">
      <AuroraBackground variant="app" />
      <GrainOverlay />

      {/* Sidebar Desktop (240px ou recolhida para 72px) */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r border-[var(--linha)] glass-panel z-40 transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
      >
        <div className="p-4 flex flex-col gap-6">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between">
            <NavLink to="/app" aria-label="Início do App">
              <Logo size="sm" showText={!collapsed} />
            </NavLink>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-full text-[var(--texto-suave)] hover:text-white"
              aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Navegação */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm transition-colors ${
                    isActive
                      ? 'bg-white/10 text-[var(--menta)] font-medium border border-white/5'
                      : 'text-[var(--texto-suave)] hover:text-white hover:bg-white/[0.03]'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={19} className="flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Barra Lateral: Botão "Fazer por mim" */}
        <div className="p-4 border-t border-[var(--linha)]">
          <a
            href={`https://wa.me/${APP_CONFIG.whatsappNumero}?text=${encodeURIComponent(
              APP_CONFIG.whatsappMensagemPadrao
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="secondary" size="sm" fullWidth={!collapsed}>
              {!collapsed ? 'Fazer por mim' : 'WhatsApp'}
            </Button>
          </a>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Cabeçalho do App */}
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-8 border-b border-[var(--linha)] backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[var(--texto)]">
              {(() => {
                const negRaw = localStorage.getItem('visibilidade_negocio');
                if (negRaw) {
                  try {
                    const parsed = JSON.parse(negRaw);
                    if (parsed.nome) return parsed.nome;
                  } catch (e) {}
                }
                const diagRaw = localStorage.getItem('diagnostico_atual');
                if (diagRaw) {
                  try {
                    const diag = JSON.parse(diagRaw);
                    if (diag.negocioNome) return diag.negocioNome;
                  } catch (e) {}
                }
                return 'Seu Negócio';
              })()}
            </span>
            <span className="text-xs text-[var(--texto-suave)] hidden sm:inline">
              · Atualizado recentemente
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MockBadge />
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/onboarding')}
              className="gap-1.5"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Rodar nova análise</span>
            </Button>
          </div>
        </header>

        {/* Área de Visualização da Rota */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1440px] w-full mx-auto relative z-10">
          <Outlet />
        </main>
      </div>

      {/* Barra Inferior Mobile (5 itens fixos per section 13.1) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 glass-panel border-t border-[var(--vidro-borda)] z-50 flex items-center justify-around px-2">
        <NavLink
          to="/app"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] ${
              isActive ? 'text-[var(--menta)] font-medium' : 'text-[var(--texto-suave)]'
            }`
          }
        >
          <LayoutDashboard size={18} />
          <span>Início</span>
        </NavLink>
        <NavLink
          to="/app/respostas"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] ${
              isActive ? 'text-[var(--menta)] font-medium' : 'text-[var(--texto-suave)]'
            }`
          }
        >
          <MessageSquare size={18} />
          <span>Respostas</span>
        </NavLink>
        <NavLink
          to="/app/plano"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] ${
              isActive ? 'text-[var(--menta)] font-medium' : 'text-[var(--texto-suave)]'
            }`
          }
        >
          <CheckSquare size={18} />
          <span>Plano</span>
        </NavLink>
        <NavLink
          to="/app/presenca"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] ${
              isActive ? 'text-[var(--menta)] font-medium' : 'text-[var(--texto-suave)]'
            }`
          }
        >
          <ShieldCheck size={18} />
          <span>Presença</span>
        </NavLink>
        <NavLink
          to="/app/conta"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] ${
              isActive ? 'text-[var(--menta)] font-medium' : 'text-[var(--texto-suave)]'
            }`
          }
        >
          <User size={18} />
          <span>Mais</span>
        </NavLink>
      </nav>
    </div>
  );
};
