import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/brand/Logo';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuroraBackground } from '../../components/brand/AuroraBackground';
import { GrainOverlay } from '../../components/brand/GrainOverlay';
import { AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro('Informe seu e-mail e sua senha.');
      return;
    }

    localStorage.setItem('visibilidade_user', JSON.stringify({ email }));
    navigate('/app');
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
            Acessar sua conta
          </h1>
          <p className="text-xs sm:text-sm text-[var(--texto-suave)] mt-1.5">
            Visualize seus diagnósticos, histórico e evolução das IAs.
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
              label="E-mail"
              type="email"
              placeholder="seu@negocio.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <a
                href="#esqueci"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Um link de recuperação será enviado para o seu e-mail.');
                }}
                className="text-xs text-[var(--texto-suave)] hover:text-[var(--menta)]"
              >
                Esqueci minha senha
              </a>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" fullWidth size="lg">
                Entrar
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--linha)] text-center text-xs text-[var(--texto-suave)]">
            Ainda não tem conta?{' '}
            <NavLink to="/criar-conta" className="text-[var(--menta)] hover:underline font-medium">
              Criar conta grátis
            </NavLink>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
