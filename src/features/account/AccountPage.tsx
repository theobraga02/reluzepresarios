import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Shield, Bell, Download, Trash2, CheckCircle2 } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const [nome, setNome] = useState('Pizzaria Exemplo');
  const [cidade, setCidade] = useState('Fortaleza, CE');
  const [telefone, setTelefone] = useState('(85) 3244-1234');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWhats, setNotifWhats] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  };

  const handleExportarDados = () => {
    const dados = {
      empresa: nome,
      cidade,
      telefone,
      historicoDiagnosticos: ['diag-padrao', 'diag-0'],
      exportadoEm: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dados-visibilidade-ai-${Date.now()}.json`;
    a.click();
  };

  const handleExcluirConta = () => {
    const confirm1 = confirm('Tem certeza de que deseja excluir sua conta e todos os dados associados?');
    if (confirm1) {
      const confirm2 = confirm('Esta ação é irreversível e apagará permanentemente todos os diagnósticos. Deseja prosseguir em conformidade com a LGPD?');
      if (confirm2) {
        localStorage.clear();
        sessionStorage.clear();
        alert('Todos os seus dados foram permanentemente excluídos.');
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      <div>
        <h2 className="text-2xl font-display font-medium text-[var(--texto)]">Minha Conta</h2>
        <p className="text-xs text-[var(--texto-suave)] mt-1">
          Gerencie os dados oficiais do seu negócio, notificações e privacidade.
        </p>
      </div>

      {/* Dados do Negócio */}
      <GlassCard padding="lg" className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--linha)] pb-3">
          <h3 className="text-base font-medium text-[var(--texto)]">Dados Oficiais do Negócio</h3>
          {salvo && (
            <span className="text-xs text-[var(--aurora)] flex items-center gap-1">
              <CheckCircle2 size={13} /> Dados salvos!
            </span>
          )}
        </div>

        <form onSubmit={handleSalvar} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome do negócio"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <Input
              label="Cidade / UF"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            />
          </div>
          <Input
            label="Telefone oficial"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />

          <div className="pt-2">
            <Button type="submit" variant="primary" size="sm">
              Salvar alterações
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Preferências de Notificação */}
      <GlassCard padding="lg" className="space-y-4">
        <h3 className="text-base font-medium text-[var(--texto)] border-b border-[var(--linha)] pb-3">
          Notificações e Alertas
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifEmail}
              onChange={(e) => setNotifEmail(e.target.checked)}
              className="rounded bg-white/5 border-white/20 text-[var(--menta)]"
            />
            <span className="text-xs sm:text-sm text-[var(--texto)]">
              Receber resumo semanal com a evolução da visibilidade por e-mail
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifWhats}
              onChange={(e) => setNotifWhats(e.target.checked)}
              className="rounded bg-white/5 border-white/20 text-[var(--menta)]"
            />
            <span className="text-xs sm:text-sm text-[var(--texto)]">
              Receber alertas imediatos quando a IA exibir horário incorreto pelo WhatsApp
            </span>
          </label>
        </div>
      </GlassCard>

      {/* Privacidade LGPD e Exclusão */}
      <GlassCard padding="lg" tone="bad" className="space-y-4">
        <h3 className="text-base font-medium text-[var(--coral)] border-b border-[var(--linha)] pb-3">
          Privacidade e Dados (LGPD)
        </h3>
        <p className="text-xs text-[var(--texto-suave)] leading-relaxed">
          Você tem total controle sobre seus dados. Pode exportar um arquivo JSON com todas as
          informações coletadas ou solicitar a exclusão imediata e definitiva de todo o histórico.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleExportarDados}
            className="gap-1.5"
          >
            <Download size={14} />
            <span>Exportar meus dados (JSON)</span>
          </Button>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleExcluirConta}
            className="gap-1.5"
          >
            <Trash2 size={14} />
            <span>Excluir minha conta e dados</span>
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};
