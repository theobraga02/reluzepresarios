import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/brand/Logo';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuroraBackground } from '../../components/brand/AuroraBackground';
import { GrainOverlay } from '../../components/brand/GrainOverlay';
import { AlertCircle, Check } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [aceiteLgpd, setAceiteLgpd] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Se o usuário veio da prévia
  const scanId = sessionStorage.getItem('visibilidade_scan_id');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro('Preencha seu e-mail e senha.');
      return;
    }
    if (senha.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (!aceiteLgpd) {
      setErro('É necessário aceitar os termos da Política de Privacidade para continuar.');
      return;
    }

    // Salva sessão de autenticação simulada
    localStorage.setItem('visibilidade_user', JSON.stringify({ email, whatsapp }));
    navigate('/onboarding');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <AuroraBackground variant="landing" />
      <GrainOverlay />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <NavLink to="/">
            <Logo size="lg" className="justify-center" />
          </NavLink>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-[var(--texto)] mt-6">
            Crie sua conta grátis
          </h1>
          <p className="text-xs sm:text-sm text-[var(--texto-suave)] mt-1.5">
            {scanId
              ? 'Vamos continuar de onde você parou e liberar seu relatório completo.'
              : 'Comece a acompanhar o que as IAs respondem na sua cidade.'}
          </p>
        </div>

        <GlassCard padding="lg" className="shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <div
                className="p-3 rounded-[14px] bg-[rgba(255,107,74,0.12)] border border-[var(--coral)]/30 text-xs text-[var(--coral)] flex items-center gap-2"
                role="alert"
              >
                <AlertCircle size={15} />
                <span>{erro}</span>
              </div>
            )}

            <Input
              label="E-mail profissional"
              type="email"
              placeholder="seu@negocio.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo de 8 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <Input
              label="WhatsApp (opcional)"
              type="tel"
              placeholder="(85) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              hint="Para alertas de visibilidade"
            />

            {/* Caixa de consentimento LGPD obrigatória */}
            <label className="flex items-start gap-2.5 pt-2 cursor-pointer text-left select-none">
              <input
                type="checkbox"
                checked={aceiteLgpd}
                onChange={(e) => setAceiteLgpd(e.target.checked)}
                className="mt-1 rounded bg-white/5 border-white/20 text-[var(--menta)] focus:ring-0 focus:ring-offset-0"
                required
              />
              <span className="text-xs text-[var(--texto-suave)] leading-relaxed">
                Li e aceito a{' '}
                <NavLink to="/privacidade" target="_blank" className="text-[var(--menta)] underline">
                  Política de Privacidade
                </NavLink>{' '}
                e autorizo o uso dos dados do negócio para fins de diagnóstico.
              </span>
            </label>

            <div className="pt-2">
              <Button type="submit" variant="primary" fullWidth size="lg">
                Criar conta e continuar
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--linha)] text-center text-xs text-[var(--texto-suave)]">
            Já tem uma conta?{' '}
            <NavLink to="/entrar" className="text-[var(--menta)] hover:underline font-medium">
              Fazer login
            </NavLink>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
