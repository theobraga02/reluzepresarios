export type Area = 'habitos' | 'treino' | 'financas' | 'vendas' | 'biblia' | 'sono' | 'foco'

export const AREAS: Area[] = ['habitos', 'treino', 'financas', 'vendas', 'biblia', 'sono', 'foco']

export const AREA_NOME: Record<Area, string> = {
  habitos: 'Hábitos',
  treino: 'Treino',
  financas: 'Finanças',
  vendas: 'Vendas',
  biblia: 'Bíblia',
  sono: 'Sono',
  foco: 'Foco',
}

export type Habit = { id: string; nome: string }

export const HABITOS_PADRAO: Habit[] = [
  { id: 'ler', nome: 'Ler 10 minutos' },
  { id: 'meditar', nome: 'Meditar ou orar' },
  { id: 'agua', nome: 'Beber 2 L de água' },
  { id: 'acordar', nome: 'Acordar cedo' },
  { id: 'planejar', nome: 'Planejar o dia' },
  { id: 'metas', nome: 'Revisar minhas metas' },
  { id: 'redes', nome: 'Manhã sem redes sociais' },
  { id: 'gratidao', nome: 'Anotar uma gratidão' },
  { id: 'alimentacao', nome: 'Comer bem' },
  { id: 'dormir', nome: 'Dormir no horário' },
]

export const META = {
  vendasDia: 5,
  treinoMin: 30,
  treinoSemana: 5,
  focoMin: 120,
  bibliaMin: 10,
  sonoIdeal: 8,
}

export type DayLog = {
  habitos: string[]
  treino: { feito: boolean; minutos: number; nota: string }
  financas: { receita: number; gastos: number; nota: string }
  vendas: { contatos: number; propostas: number; fechadas: number }
  biblia: { minutos: number; nota: string }
  sono: { horas: number }
  foco: { minutos: number; nota: string }
}

export const emptyLog = (): DayLog => ({
  habitos: [],
  treino: { feito: false, minutos: 0, nota: '' },
  financas: { receita: 0, gastos: 0, nota: '' },
  vendas: { contatos: 0, propostas: 0, fechadas: 0 },
  biblia: { minutos: 0, nota: '' },
  sono: { horas: 0 },
  foco: { minutos: 0, nota: '' },
})

/** Garante todos os campos mesmo se o dado salvo for de uma versão antiga. */
export function normalizeLog(l?: Partial<DayLog>): DayLog {
  const e = emptyLog()
  if (!l) return e
  return {
    habitos: Array.isArray(l.habitos) ? l.habitos : e.habitos,
    treino: { ...e.treino, ...l.treino },
    financas: { ...e.financas, ...l.financas },
    vendas: { ...e.vendas, ...l.vendas },
    biblia: { ...e.biblia, ...l.biblia },
    sono: { ...e.sono, ...l.sono },
    foco: { ...e.foco, ...l.foco },
  }
}

const clamp = (n: number, a = 0, b = 10) => Math.min(b, Math.max(a, n))
const r1 = (n: number) => Math.round(n * 10) / 10

export const acoesVendas = (l: DayLog) => l.vendas.contatos + l.vendas.propostas + l.vendas.fechadas
export const saldo = (l: DayLog) => l.financas.receita - l.financas.gastos

export type Scores = Record<Area, number> & { total: number }

export function scoreLog(log: DayLog | undefined, totalHabitos: number): Scores {
  if (!log) return { habitos: 0, treino: 0, financas: 0, vendas: 0, biblia: 0, sono: 0, foco: 0, total: 0 }
  const l = normalizeLog(log)

  const habitos = totalHabitos ? clamp((l.habitos.length / totalHabitos) * 10) : 0

  const treino = l.treino.feito
    ? clamp(l.treino.minutos > 0 ? (l.treino.minutos / META.treinoMin) * 10 : 7, 5, 10)
    : 0

  let financas = 0
  if (l.financas.receita > 0 || l.financas.gastos > 0) {
    const s = saldo(l)
    if (s >= 0) financas = 8 + Math.min(2, (2 * s) / Math.max(l.financas.receita, 1))
    else financas = Math.max(0, 8 * (1 + s / Math.max(l.financas.gastos, 1)))
  }

  const vendas = clamp((acoesVendas(l) / META.vendasDia) * 10)
  const biblia = clamp((l.biblia.minutos / META.bibliaMin) * 10)
  const sono = l.sono.horas > 0 ? clamp(10 - Math.abs(l.sono.horas - META.sonoIdeal) * 2.5) : 0
  const foco = clamp((l.foco.minutos / META.focoMin) * 10)

  const parts = { habitos, treino, financas, vendas, biblia, sono, foco }
  const total = AREAS.reduce((acc, a) => acc + parts[a], 0) / AREAS.length
  return {
    habitos: r1(habitos), treino: r1(treino), financas: r1(financas), vendas: r1(vendas),
    biblia: r1(biblia), sono: r1(sono), foco: r1(foco), total: r1(total),
  }
}

export const fmtBRL = (n: number) =>
  `${n < 0 ? '-' : ''}R$ ${Math.abs(Math.round(n)).toLocaleString('pt-BR')}`

export type Desafio = { texto: string; atual: number; meta: number }

const DESAFIOS: ((l: DayLog) => Desafio)[] = [
  (l) => ({ texto: 'Complete 3 hábitos hoje.', atual: Math.min(l.habitos.length, 3), meta: 3 }),
  (l) => ({ texto: 'Faça 30 min de treino.', atual: Math.min(l.treino.minutos, 30), meta: 30 }),
  (l) => ({ texto: 'Leia 10 min da Bíblia.', atual: Math.min(l.biblia.minutos, 10), meta: 10 }),
  (l) => ({ texto: 'Faça 5 ações de vendas.', atual: Math.min(acoesVendas(l), 5), meta: 5 }),
  (l) => ({ texto: 'Acumule 60 min de foco profundo.', atual: Math.min(l.foco.minutos, 60), meta: 60 }),
]

export function desafioDoDia(dia: number, log: DayLog): Desafio {
  return DESAFIOS[dia % DESAFIOS.length](log)
}
