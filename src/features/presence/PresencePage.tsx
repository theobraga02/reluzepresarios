import React, { useEffect, useState } from 'react';
import { getDiagnosticProvider } from '../../services/provider';
import { ItemPresenca } from '../../services/types';
import { GlassCard } from '../../components/ui/GlassCard';
import { ResolverDrawer } from '../../components/domain/ResolverDrawer';
import { ShieldCheck, AlertCircle, CheckCircle, Smartphone, Globe, Star } from 'lucide-react';

export const PresencePage: React.FC = () => {
  const provider = getDiagnosticProvider();
  const [itens, setItens] = useState<ItemPresenca[]>([]);
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<ItemPresenca | null>(null);

  useEffect(() => {
    provider.presenca('neg-padrao').then(setItens);
  }, []);

  const abrirDrawer = (item: ItemPresenca) => {
    setItemSelecionado(item);
    setDrawerAberto(true);
  };

  const paineis = [
    {
      categoria: 'google',
      nome: 'Perfil no Google',
      nota: 78,
      icone: Globe,
      desc: 'Completude, categorias, fotos, horários e posts.',
    },
    {
      categoria: 'site',
      nome: 'Site Oficial',
      nota: 62,
      icone: Smartphone,
      desc: 'FAQ, dados estruturados LocalBusiness, telefone e versão mobile.',
    },
    {
      categoria: 'avaliacoes',
      nome: 'Avaliações',
      nota: 54,
      icone: Star,
      desc: 'Quantidade de avaliações, recência e taxa de resposta.',
    },
    {
      categoria: 'consistencia',
      nome: 'Consistência NAP',
      nota: 85,
      icone: ShieldCheck,
      desc: 'Nome, endereço e telefone idênticos em toda a web.',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-display font-medium text-[var(--texto)]">Auditoria de Presença</h2>
        <p className="text-xs text-[var(--texto-suave)] mt-1">
          Avaliamos as bases onde os motores de busca e IAs buscam autoridade para recomendar seu negócio.
        </p>
      </div>

      {/* 4 Painéis de Presença */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paineis.map((p, idx) => {
          const Icon = p.icone;
          return (
            <GlassCard key={idx} padding="md" className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-full bg-white/5 border border-white/10 text-[var(--menta)]">
                    <Icon size={18} />
                  </div>
                  <span className="text-xl font-light text-[var(--texto)] tabular-nums">
                    {p.nota}<span className="text-xs text-[var(--texto-suave)]">/100</span>
                  </span>
                </div>
                <h4 className="text-sm font-medium text-[var(--texto)]">{p.nome}</h4>
                <p className="text-[11px] text-[var(--texto-suave)] mt-1 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--linha)]">
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[var(--menta)] h-full rounded-full"
                    style={{ width: `${p.nota}%` }}
                  />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Lista de Problemas Identificados */}
      <div className="p-6 rounded-[24px] glass-panel border border-[var(--vidro-borda)] space-y-4">
        <h3 className="text-base font-medium text-[var(--texto)]">Itens identificados na auditoria</h3>

        <div className="space-y-3">
          {itens.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-[16px] bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      item.gravidade === 'critica'
                        ? 'bg-[var(--coral)]/15 text-[var(--coral)]'
                        : 'bg-[var(--ambar)]/15 text-[var(--ambar)]'
                    }`}
                  >
                    {item.gravidade}
                  </span>
                  <h5 className="text-sm font-medium text-[var(--texto)]">{item.titulo}</h5>
                </div>
                <p className="text-xs text-[var(--texto-suave)]">{item.evidencia}</p>
              </div>

              <button
                type="button"
                onClick={() => abrirDrawer(item)}
                className="px-4 py-2 rounded-full glass-panel hover:bg-white/10 text-xs font-semibold text-[var(--menta)] self-end sm:self-auto flex-shrink-0"
              >
                Ver como resolver
              </button>
            </div>
          ))}
        </div>
      </div>

      {itemSelecionado && (
        <ResolverDrawer
          isOpen={drawerAberto}
          onClose={() => setDrawerAberto(false)}
          titulo={itemSelecionado.titulo}
          evidencia={itemSelecionado.evidencia}
          passos={[
            'Acesse o perfil da empresa ou o painel do seu site.',
            'Siga a orientação da evidência e confirme as alterações.',
          ]}
          conteudoPronto={itemSelecionado.evidencia}
          concluida={itemSelecionado.concluido}
          onToggleConcluida={() => {
            setItens((prev) =>
              prev.map((i) =>
                i.id === itemSelecionado.id ? { ...i, concluido: !i.concluido } : i
              )
            );
            setItemSelecionado({ ...itemSelecionado, concluido: !itemSelecionado.concluido });
          }}
        />
      )}
    </div>
  );
};
