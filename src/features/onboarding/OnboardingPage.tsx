import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/brand/Logo';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { RadarRing } from '../../components/viz/RadarRing';
import { AuroraBackground } from '../../components/brand/AuroraBackground';
import { GrainOverlay } from '../../components/brand/GrainOverlay';
import { Check } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  // Dados salvos da prévia (se houver)
  const [passo, setPasso] = useState<1 | 2 | 3 | 4>(1);

  // Passo 1: Confirme seu negócio
  const [nome, setNome] = useState('Pizzaria Exemplo');
  const [endereco, setEndereco] = useState('Rua Desembargador Moreira, 700 - Aldeota, Fortaleza - CE');
  const [mapsUrl, setMapsUrl] = useState('https://maps.google.com/?cid=789');
  const [telefone, setTelefone] = useState('(85) 3244-1234');

  // Passo 2: Onde você já está
  const [site, setSite] = useState('https://pizzariaexemplo.com.br');
  const [instagram, setInstagram] = useState('@pizzariaexemplo');

  // Passo 3: Concorrentes
  const [conc1, setConc1] = useState('Concorrente A');
  const [conc2, setConc2] = useState('Concorrente B');
  const [conc3, setConc3] = useState('Concorrente C');

  // Passo 4: Execução do Diagnóstico Completo
  const [progressoBuscas, setProgressoBuscas] = useState(1);
  const totalBuscas = 48;

  useEffect(() => {
    // Carregar dados salvos da prévia se existirem
    const negSalvo = sessionStorage.getItem('visibilidade_negocio');
    if (negSalvo) {
      try {
        const parsed = JSON.parse(negSalvo);
        if (parsed.nome) setNome(parsed.nome);
        if (parsed.endereco) setEndereco(parsed.endereco);
        if (parsed.mapsUrl) setMapsUrl(parsed.mapsUrl);
        if (parsed.telefone) setTelefone(parsed.telefone);
      } catch (e) {
        // ignora
      }
    }
  }, []);

  // Simulação do progresso do diagnóstico completo no Passo 4
  useEffect(() => {
    if (passo === 4) {
      const interval = setInterval(() => {
        setProgressoBuscas((prev) => {
          if (prev >= totalBuscas) {
            clearInterval(interval);
            setTimeout(() => {
              navigate('/app');
            }, 800);
            return totalBuscas;
          }
          return prev + 3;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [passo, navigate]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <AuroraBackground variant="landing" />
      <GrainOverlay />

      <div className="relative z-10 w-full max-w-xl">
        <div className="text-center mb-6">
          <Logo size="md" className="justify-center" />
          <h1 className="text-2xl font-display font-medium text-[var(--texto)] mt-4">
            {passo < 4 ? 'Configurando seu diagnóstico' : 'Executando diagnóstico completo'}
          </h1>

          {/* Barra de progresso dos 3 passos */}
          {passo < 4 && (
            <div className="flex items-center justify-center gap-2 mt-4 max-w-xs mx-auto">
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  passo >= 1 ? 'bg-[var(--menta)]' : 'bg-white/10'
                }`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  passo >= 2 ? 'bg-[var(--menta)]' : 'bg-white/10'
                }`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  passo >= 3 ? 'bg-[var(--menta)]' : 'bg-white/10'
                }`}
              />
            </div>
          )}
        </div>

        <GlassCard padding="lg" className="shadow-2xl">
          {/* PASSO 1: CONFIRME SEU NEGÓCIO */}
          {passo === 1 && (
            <div className="space-y-4 text-left">
              <h2 className="text-lg font-medium text-[var(--texto)]">1. Confirme seu negócio</h2>
              <p className="text-xs text-[var(--texto-suave)]">
                Esses dados são usados como verdade para comparar o que a IA está respondendo.
              </p>

              <Input
                label="Nome oficial"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <Input
                label="Endereço completo"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                required
              />
              <Input
                label="Link do Google Maps"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
              />
              <Input
                label="Telefone oficial"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />

              <div className="pt-2 flex justify-end">
                <Button variant="primary" onClick={() => setPasso(2)}>
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* PASSO 2: ONDE VOCÊ JÁ ESTÁ */}
          {passo === 2 && (
            <div className="space-y-4 text-left">
              <h2 className="text-lg font-medium text-[var(--texto)]">2. Onde você já está</h2>
              <p className="text-xs text-[var(--texto-suave)]">
                Canais onde clientes já podem encontrar informações sobre o seu negócio.
              </p>

              <Input
                label="Site oficial (opcional)"
                placeholder="https://..."
                value={site}
                onChange={(e) => setSite(e.target.value)}
              />
              <Input
                label="Instagram oficial (opcional)"
                placeholder="@seunegocio"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />

              <div className="pt-2 flex justify-between items-center">
                <Button variant="tertiary" onClick={() => setPasso(1)}>
                  Voltar
                </Button>
                <Button variant="primary" onClick={() => setPasso(3)}>
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* PASSO 3: SEUS CONCORRENTES */}
          {passo === 3 && (
            <div className="space-y-4 text-left">
              <h2 className="text-lg font-medium text-[var(--texto)]">3. Seus concorrentes</h2>
              <p className="text-xs text-[var(--texto-suave)]">
                Até 3 nomes de negócios locais que competem com você. Isso deixa a análise mais precisa.
              </p>

              <Input
                label="Concorrente 1 (opcional)"
                placeholder="Nome do negócio"
                value={conc1}
                onChange={(e) => setConc1(e.target.value)}
              />
              <Input
                label="Concorrente 2 (opcional)"
                placeholder="Nome do negócio"
                value={conc2}
                onChange={(e) => setConc2(e.target.value)}
              />
              <Input
                label="Concorrente 3 (opcional)"
                placeholder="Nome do negócio"
                value={conc3}
                onChange={(e) => setConc3(e.target.value)}
              />

              <div className="pt-2 flex justify-between items-center">
                <Button variant="tertiary" onClick={() => setPasso(2)}>
                  Voltar
                </Button>
                <Button variant="primary" onClick={() => setPasso(4)}>
                  Iniciar diagnóstico completo
                </Button>
              </div>
            </div>
          )}

          {/* PASSO 4: PROGRESSO DO DIAGNÓSTICO COMPLETO */}
          {passo === 4 && (
            <div className="flex flex-col items-center py-6 text-center space-y-6">
              <RadarRing
                state="analisando"
                buscaAtualNumero={progressoBuscas}
                totalBuscas={totalBuscas}
              />

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-[var(--texto)]">
                  Consultando {progressoBuscas} de {totalBuscas} buscas reais...
                </h3>
                <p className="text-xs text-[var(--texto-suave)] max-w-sm">
                  Analisando bairros, horários de atendimento, pratos mais pedidos e fontes citadas pelas IAs.
                </p>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
