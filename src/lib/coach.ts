import { addDays, keyOf } from './date'
import { AREA_NOME, AREAS, scoreDia, sequencia } from './score'
import type { AppData, Area, CoachReport } from './types'

export type Relatorio = CoachReport & {
  temDados: boolean
  /** Nota de hoje (ou média dos dias com registro, se hoje ainda está vazio). */
  nota: number
  /** Média dos últimos 7 dias por área (0–10). */
  medias: Record<Area, number>
}

const FORTE: Record<Area, string> = {
  habitos: 'Disciplina nos hábitos',
  treino: 'Boa constância no treino',
  financas: 'Finanças registradas com regularidade',
  vendas: 'Ritmo de vendas e contatos em dia',
  biblia: 'Leitura bíblica constante',
  foco: 'Foco profundo consistente',
  leitura: 'Leitura regular',
  sono: 'Sono dentro da meta',
}

const FRACO: Record<Area, string> = {
  habitos: 'Hábitos pouco concluídos',
  treino: 'Treino irregular',
  financas: 'Poucos registros financeiros',
  vendas: 'Abaixo da meta de vendas/contatos',
  biblia: 'Leitura bíblica irregular',
  foco: 'Pouco tempo de foco profundo',
  leitura: 'Pouca leitura de negócios',
  sono: 'Sono irregular ou abaixo da meta',
}

const ACAO: Record<Area, (d: AppData) => string> = {
  habitos: () => 'Escolha 2 hábitos e conclua os dois logo cedo.',
  treino: () => 'Faça um treino curto de 20 min, mesmo que leve.',
  financas: () => 'Registre as entradas e saídas do dia em 2 minutos.',
  vendas: (d) => `Faça ${d.settings.metas.vendasDia} contatos de vendas antes do almoço.`,
  biblia: () => 'Leia um capítulo e anote um versículo.',
  foco: (d) => `Reserve um bloco de ${Math.min(d.settings.metas.focoMin, 50)} min sem celular.`,
  leitura: (d) => `Leia ${d.settings.metas.leituraPaginas} páginas de um livro de negócios.`,
  sono: (d) => `Durma ${d.settings.metas.sonoHoras} h: defina um horário fixo para deitar.`,
}

/** Avaliação por regras locais (sem IA). Usada sempre como base e como fallback. */
export function relatorioLocal(d: AppData, ref = new Date()): Relatorio {
  const dias = Array.from({ length: 7 }, (_, i) => keyOf(addDays(ref, -i)))
  const scores = dias.map((k) => scoreDia(d, k))
  const medias = {} as Record<Area, number>
  for (const a of AREAS) medias[a] = Math.round((scores.reduce((s, x) => s + x[a], 0) / 7) * 10) / 10

  const hoje = scores[0]
  const comDados = scores.filter((s) => s.temDados)
  const temDados = comDados.length > 0
  const nota = hoje.temDados
    ? hoje.total
    : comDados.length
      ? Math.round((comDados.reduce((s, x) => s + x.total, 0) / comDados.length) * 10) / 10
      : 0

  if (!temDados) {
    return {
      temDados, nota, medias,
      mensagem: 'Registre seu primeiro dia para receber uma avaliação.',
      fortes: [], melhorar: [],
      recomendacoes: ['Conclua um hábito em “Hoje”.', 'Abra “Registrar” e anote um treino, uma venda ou uma leitura.', 'Volte aqui amanhã para ver sua nota.'],
      areas: [],
    }
  }

  const ord = [...AREAS].sort((a, b) => medias[b] - medias[a])
  const fortes = ord.filter((a) => medias[a] >= 6).slice(0, 3)
  const fracas = [...ord].reverse().filter((a) => medias[a] < 5).slice(0, 3)
  const seq = sequencia(d, ref)

  const mensagem =
    nota >= 8 ? 'Você está no caminho certo! Continue mantendo o foco e a disciplina.'
    : nota >= 5 ? 'Bom ritmo. Ajustando poucos pontos, sua nota sobe rápido.'
    : 'Comece pequeno hoje: um passo já muda o dia.'

  const recs = fracas.map((a) => ACAO[a](d))
  if (recs.length < 3) recs.push('Mantenha o que está funcionando: repita amanhã os mesmos hábitos.')
  if (seq >= 3 && recs.length < 3) recs.push(`Você está há ${seq} dias seguidos ativo. Proteja essa sequência.`)

  return {
    temDados, nota, medias, mensagem,
    fortes: fortes.map((a) => FORTE[a]),
    melhorar: fracas.map((a) => FRACO[a]),
    recomendacoes: recs.slice(0, 4),
    areas: fracas,
  }
}

export const nomeDaArea = (a: Area) => AREA_NOME[a]
