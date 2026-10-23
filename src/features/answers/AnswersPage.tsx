import React, { useEffect, useState } from 'react';
import { getDiagnosticProvider } from '../../services/provider';
import { RespostaIA } from '../../services/types';
import { GlassCard } from '../../components/ui/GlassCard';
import { ConfidenceBadge } from '../../components/domain/ConfidenceBadge';
import { Search, Filter, X, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';

export const AnswersPage: React.FC = () => {
  const provider = getDiagnosticProvider();
  const [respostas, setRespostas] = useState<RespostaIA[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroCitou, setFiltroCitou] = useState<'todos' | 'citou' | 'nao_citou'>('todos');
  const [respostaAberta, setRespostaAberta] = useState<RespostaIA | null>(null);

  useEffect(() => {
    provider.listarRespostas('diag-padrao').then((res) => {
      setRespostas(res);
      setCarregando(false);
    });
  }, []);

  const respostasFiltradas = respostas.filter((r) => {
    const matchTexto =
      r.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
      r.texto.toLowerCase().includes(busca.toLowerCase());
    const matchCitou =
      filtroCitou === 'todos'
        ? true
        : filtroCitou === 'citou'
        ? r.citouNegocio
        : !r.citouNegocio;
    return matchTexto && matchCitou;
  });

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-display font-medium text-[var(--texto)]">Respostas da IA</h2>
        <p className="text-xs text-[var(--texto-suave)] mt-1">
          Veja a íntegra de cada pergunta feita e como a IA respondeu ao cliente.
        </p>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3.5 text-[var(--texto-suave)]" />
          <input
            type="text"
            placeholder="Buscar por pergunta ou texto da resposta..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 h-[44px] rounded-[14px] bg-white/[0.03] border border-[var(--vidro-borda)] text-xs text-white focus:outline-none focus:border-[var(--menta)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltroCitou('todos')}
            className={`px-4 h-[44px] rounded-[14px] text-xs font-medium transition-colors ${
              filtroCitou === 'todos'
                ? 'bg-white text-[var(--abismo)]'
                : 'glass-panel text-[var(--texto-suave)] hover:text-white'
            }`}
          >
            Todas ({respostas.length})
          </button>
          <button
            type="button"
            onClick={() => setFiltroCitou('citou')}
            className={`px-4 h-[44px] rounded-[14px] text-xs font-medium transition-colors ${
              filtroCitou === 'citou'
                ? 'bg-[var(--aurora)] text-[var(--abismo)]'
                : 'glass-panel text-[var(--texto-suave)] hover:text-white'
            }`}
          >
            Citou você
          </button>
          <button
            type="button"
            onClick={() => setFiltroCitou('nao_citou')}
            className={`px-4 h-[44px] rounded-[14px] text-xs font-medium transition-colors ${
              filtroCitou === 'nao_citou'
                ? 'bg-[var(--coral)] text-white'
                : 'glass-panel text-[var(--texto-suave)] hover:text-white'
            }`}
          >
            Não citou
          </button>
        </div>
      </div>

      {/* Lista / Tabela de Respostas */}
      <div className="space-y-3">
        {respostasFiltradas.map((r) => (
          <div
            key={r.id}
            onClick={() => setRespostaAberta(r)}
            className="p-5 rounded-[20px] glass-panel border border-[var(--vidro-borda)] hover:border-white/20 cursor-pointer transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[var(--menta)] font-medium capitalize">
                  Busca: {r.tipoBusca}
                </span>
                <span className="text-[var(--texto-suave)]">· {r.modelo}</span>
              </div>

              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                  r.citouNegocio
                    ? 'bg-[var(--aurora)]/15 text-[var(--aurora)]'
                    : 'bg-[var(--coral)]/15 text-[var(--coral)]'
                }`}
              >
                {r.citouNegocio ? `Citou você (${r.posicao}º lugar)` : 'Não citou'}
              </span>
            </div>

            <p className="text-sm font-medium text-[var(--texto)]">"{r.pergunta}"</p>
            <p className="text-xs text-[var(--texto-suave)] line-clamp-2 leading-relaxed">
              {r.texto}
            </p>
          </div>
        ))}
      </div>

      {/* Drawer da Resposta Aberta */}
      {respostaAberta && (
        <div className="fixed inset-0 z-60 flex justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setRespostaAberta(null)}
          />

          <div className="relative z-10 w-full md:w-[560px] h-full bg-[#0B1A22] border-l border-[var(--vidro-borda)] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-[var(--linha)] pb-4">
                <div>
                  <span className="text-xs font-semibold text-[var(--menta)] uppercase">
                    Detalhes da Resposta
                  </span>
                  <h3 className="text-base font-medium text-[var(--texto)] mt-1">
                    "{respostaAberta.pergunta}"
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setRespostaAberta(null)}
                  className="p-1 rounded-full text-[var(--texto-suave)] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Resposta Completa */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-semibold text-[var(--texto)]">
                  Resposta completa da IA
                </h4>
                <div className="p-4 rounded-[14px] bg-white/[0.02] border border-white/5 text-xs text-[var(--texto)] leading-relaxed whitespace-pre-line">
                  {respostaAberta.texto}
                </div>
              </div>

              {/* Comparação: O que a IA mostrou vs Dados reais */}
              {respostaAberta.dadosExibidos && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-semibold text-[var(--texto)]">
                    O que a IA mostrou vs. Seus dados reais
                  </h4>
                  <div className="p-4 rounded-[14px] bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[var(--texto-suave)]">Endereço:</span>
                      <span className="text-[var(--texto)]">
                        {respostaAberta.dadosExibidos.endereco}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--texto-suave)]">Horário:</span>
                      <span
                        className={
                          respostaAberta.dadosCorretos === false
                            ? 'text-[var(--coral)] font-semibold'
                            : 'text-[var(--aurora)]'
                        }
                      >
                        {respostaAberta.dadosExibidos.horario} (
                        {respostaAberta.dadosCorretos === false
                          ? 'Divergência detectada'
                          : 'Correto'}
                        )
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Negócios Citados em Ordem */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-semibold text-[var(--texto)]">
                  Negócios citados na resposta
                </h4>
                <div className="space-y-2">
                  {respostaAberta.negociosCitados.map((n, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-[12px] flex items-center justify-between text-xs ${
                        n.ehOCliente
                          ? 'bg-[var(--aurora)]/10 border border-[var(--aurora)]/30 text-[var(--menta)] font-medium'
                          : 'bg-white/[0.02] border border-white/5 text-[var(--texto-suave)]'
                      }`}
                    >
                      <span>
                        {n.posicao}º {n.nome} {n.ehOCliente && '(Você)'}
                      </span>
                      <div className="flex gap-1">
                        {n.atributos.map((at, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5"
                          >
                            {at}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--linha)]">
              <button
                type="button"
                onClick={() => alert('Imagem gerada apenas com dados públicos da empresa.')}
                className="w-full py-2.5 rounded-full glass-panel hover:bg-white/10 text-xs font-semibold text-[var(--texto)] flex items-center justify-center gap-2"
              >
                <ImageIcon size={14} />
                <span>Gerar imagem da resposta para redes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
