import { addDays, keyOf } from './date'
import type { AppData, Area } from './types'

export const AREAS: Area[] = ['habitos', 'treino', 'financas', 'vendas', 'biblia', 'foco', 'leitura', 'sono']

export const AREA_NOME: Record<Area, string> = {
  habitos: 'Hábitos',
  treino: 'Treino',
  financas: 'Finanças',
  vendas: 'Vendas',
  biblia: 'Bíblia',
  foco: 'Foco',
  leitura: 'Leitura',
  sono: 'Sono',
}

export type Scores = Record<Area, number> & { total: number; temDados: boolean }

const clamp = (n: number, a = 0, b = 10) => Math.min(b, Math.max(a, n))
const r1 = (n: number) => Math.round(n * 10) / 10

/** Horas entre dormir e acordar (cruza a meia-noite). */
export function horasDeSono(bed: string, wake: string): number {
  const [bh, bm] = bed.split(':').map(Number)
  const [wh, wm] = wake.split(':').map(Number)
  if ([bh, bm, wh, wm].some((n) => Number.isNaN(n))) return 0
  let min = wh * 60 + wm - (bh * 60 + bm)
  if (min <= 0) min += 24 * 60
  return Math.round((min / 60) * 10) / 10
}

const cache = new WeakMap<AppData, Map<string, Scores>>()

/** Notas (0–10) por área e a nota geral do dia: 50% hábitos + 50% média das outras áreas. */
export function scoreDia(d: AppData, dia: string): Scores {
  let m = cache.get(d)
  if (!m) cache.set(d, (m = new Map()))
  const hit = m.get(dia)
  if (hit) return hit

  const ids = new Set(d.habits.map((h) => h.id))
  const feitos = (d.habitLog[dia] ?? []).filter((id) => ids.has(id)).length
  const treinos = d.workoutRecords.filter((r) => r.date === dia)
  const caixa = d.incomeRecords.filter((r) => r.date === dia)
  const vendas = d.saleRecords.filter((r) => r.date === dia)
  const biblia = d.bibleRecords.filter((r) => r.date === dia)
  const foco = d.focusRecords.filter((r) => r.date === dia)
  const leitura = d.readingRecords.filter((r) => r.date === dia)
  const sono = d.sleepRecords.filter((r) => r.date === dia)
  const mt = d.settings.metas

  const habitos = d.habits.length ? (feitos / d.habits.length) * 10 : 0
  const sonoScore = sono.length
    ? (() => {
        const s = sono[sono.length - 1]
        const h = horasDeSono(s.bedtime, s.wakeTime)
        return clamp(0.7 * clamp(10 - Math.abs(h - mt.sonoHoras) * 2.5) + 0.3 * clamp(s.quality * 2))
      })()
    : 0

  const parts: Record<Area, number> = {
    habitos: clamp(habitos),
    treino: treinos.length ? 10 : 0,
    financas: caixa.length ? 10 : 0,
    vendas: clamp((vendas.length / Math.max(1, mt.vendasDia)) * 10),
    biblia: biblia.length ? 10 : 0,
    foco: clamp((foco.reduce((a, r) => a + r.durationMinutes, 0) / Math.max(1, mt.focoMin)) * 10),
    leitura: clamp((leitura.reduce((a, r) => a + r.pagesRead, 0) / Math.max(1, mt.leituraPaginas)) * 10),
    sono: sonoScore,
  }
  const outras = AREAS.filter((a) => a !== 'habitos')
  const media = outras.reduce((acc, a) => acc + parts[a], 0) / outras.length
  const temDados =
    feitos > 0 || treinos.length + caixa.length + vendas.length + biblia.length + foco.length + leitura.length + sono.length > 0

  const out = {
    habitos: r1(parts.habitos), treino: r1(parts.treino), financas: r1(parts.financas), vendas: r1(parts.vendas),
    biblia: r1(parts.biblia), foco: r1(parts.foco), leitura: r1(parts.leitura), sono: r1(parts.sono),
    total: r1(0.5 * parts.habitos + 0.5 * media), temDados,
  } as Scores
  m.set(dia, out)
  return out
}

/** Dias seguidos (até hoje; se hoje ainda está vazio, conta a partir de ontem) com alguma atividade. */
export function sequencia(d: AppData, ref = new Date()): number {
  let n = 0
  let dia = ref
  if (!scoreDia(d, keyOf(dia)).temDados) dia = addDays(dia, -1)
  while (scoreDia(d, keyOf(dia)).temDados && n < 3650) {
    n++
    dia = addDays(dia, -1)
  }
  return n
}

export const moeda = (v: number) =>
  `${v < 0 ? '-' : ''}R$ ${Math.abs(Math.round(v)).toLocaleString('pt-BR')}`

export const saldoDia = (d: AppData, dia: string) =>
  d.incomeRecords.filter((r) => r.date === dia).reduce((a, r) => a + (r.type === 'entrada' ? r.amount : -r.amount), 0)
