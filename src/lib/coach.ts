import { type Area, AREAS, type Scores } from './model'

const TEXTO: Record<Area, { forte: string; fraco: string; vazio: string; dica: string }> = {
  habitos: {
    forte: 'Disciplina nos hábitos',
    fraco: 'Constância nos hábitos',
    vazio: 'Hábitos sem registro hoje',
    dica: 'Cumpra seus hábitos principais antes do meio-dia',
  },
  treino: {
    forte: 'Boa performance no treino',
    fraco: 'Treino abaixo da meta',
    vazio: 'Sem treino registrado hoje',
    dica: 'Faça um treino de 30 min',
  },
  financas: {
    forte: 'Finanças em equilíbrio',
    fraco: 'Controle de gastos',
    vazio: 'Finanças sem registro hoje',
    dica: 'Anote todas as receitas e gastos antes de dormir',
  },
  vendas: {
    forte: 'Ritmo de vendas em dia',
    fraco: 'Ritmo de vendas baixo',
    vazio: 'Vendas sem registro hoje',
    dica: 'Faça 5 contatos comerciais logo cedo',
  },
  biblia: {
    forte: 'Leitura bíblica em dia',
    fraco: 'Leitura bíblica curta',
    vazio: 'Sem leitura bíblica hoje',
    dica: 'Leia 10 min da Bíblia ao acordar',
  },
  sono: {
    forte: 'Sono regular',
    fraco: 'Sono ainda irregular',
    vazio: 'Sono sem registro hoje',
    dica: 'Durma 7 a 8 h e largue as telas 30 min antes',
  },
  foco: {
    forte: 'Foco profundo em dia',
    fraco: 'Pouco foco profundo',
    vazio: 'Foco sem registro hoje',
    dica: 'Bloqueie 90 min sem notificações para a tarefa mais importante',
  },
}

export type Relatorio = {
  temDados: boolean
  fortes: string[]
  melhorar: string[]
  recomendacoes: string[]
  mensagem: string
}

/** Avaliação por regras locais (sem IA externa) a partir das notas do dia. */
export function relatorio(sc: Scores, temDados: boolean): Relatorio {
  if (!temDados) {
    return {
      temDados,
      fortes: [],
      melhorar: [],
      recomendacoes: ['Registre seu dia em “Registrar” para receber a avaliação.'],
      mensagem: 'Registre o dia para ver sua nota.',
    }
  }
  const ordem = [...AREAS].sort((a, b) => sc[a] - sc[b])
  const fortes = AREAS.filter((a) => sc[a] >= 8).map((a) => TEXTO[a].forte).slice(0, 3)
  const melhorar = ordem
    .filter((a) => sc[a] < 6)
    .map((a) => (sc[a] === 0 ? TEXTO[a].vazio : TEXTO[a].fraco))
    .slice(0, 3)
  const recomendacoes = ordem.filter((a) => sc[a] < 8).slice(0, 3).map((a) => TEXTO[a].dica)
  if (!recomendacoes.length) recomendacoes.push('Mantenha o ritmo: repita a rotina de hoje amanhã.')
  const mensagem =
    sc.total >= 8
      ? 'Você está no caminho certo! Continue mantendo o foco e a disciplina.'
      : sc.total >= 5
        ? 'Bom progresso. Pequenos ajustes já fazem diferença.'
        : 'Um dia imperfeito também conta. Comece pelo próximo passo.'
  return { temDados, fortes, melhorar, recomendacoes, mensagem }
}
