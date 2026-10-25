import { addDays, DIAS_CURTOS_SEMANA, fromKey, keyOf, MESES_CURTOS } from './date'
import { scoreDia, horasDeSono } from './score'
import type { AppData, Stage } from './types'

export type Period = 'semana' | 'mes' | 'ano'

function mondayOf(d: Date) {
  const x = new Date(d)
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7))
  x.setHours(0, 0, 0, 0)
  return x
}

/** Datas (YYYY-MM-DD) do período; offset=1 devolve o período anterior. */
export function rangeKeys(period: Period, ref = new Date(), offset = 0): string[] {
  if (period === 'semana') {
    const m = addDays(mondayOf(ref), -7 * offset)
    return Array.from({ length: 7 }, (_, i) => keyOf(addDays(m, i)))
  }
  if (period === 'mes') {
    const end = addDays(ref, -30 * offset)
    return Array.from({ length: 30 }, (_, i) => keyOf(addDays(end, i - 29)))
  }
  const y = ref.getFullYear() - offset
  const out: string[] = []
  for (let d = new Date(y, 0, 1); d.getFullYear() === y; d = addDays(d, 1)) out.push(keyOf(d))
  return out
}

const media = (d: AppData, keys: string[]) => {
  const v = keys.map((k) => scoreDia(d, k)).filter((s) => s.temDados).map((s) => s.total)
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null
}

export type Ponto = { label: string; valor: number | null }

export function serie(d: AppData, period: Period, ref = new Date()): Ponto[] {
  const hoje = keyOf(ref)
  const keys = rangeKeys(period, ref)
  if (period === 'ano') {
    return MESES_CURTOS.map((label, m) => {
      const ks = keys.filter((k) => fromKey(k).getMonth() === m && k <= hoje)
      const v = media(d, ks)
      return { label, valor: v == null ? null : Math.round(v * 10) / 10 }
    })
  }
  return keys.map((k, i) => {
    const s = scoreDia(d, k)
    return {
      label: period === 'semana' ? DIAS_CURTOS_SEMANA[i] : String(fromKey(k).getDate()),
      valor: s.temDados && k <= hoje ? s.total : null,
    }
  })
}

/** Variação % da nota média vs. período anterior (null se não der para comparar). */
export function variacao(d: AppData, period: Period, ref = new Date()): number | null {
  const a = media(d, rangeKeys(period, ref))
  const b = media(d, rangeKeys(period, ref, 1))
  if (a == null || b == null || b === 0) return null
  return Math.round(((a - b) / b) * 100)
}

export type Resumo = {
  habitos: { a: number; b: number }
  treino: { a: number; b: number }
  financas: number
  vendas: { a: number; b: number }
}

export function resumo(d: AppData, period: Period, ref = new Date()): Resumo {
  const keys = rangeKeys(period, ref)
  const hoje = keyOf(ref)
  const set = new Set(keys.filter((k) => k <= hoje))
  const dias = keys.length
  let hab = 0
  for (const k of set) if (scoreDia(d, k).habitos >= 7) hab++
  const treinoDias = new Set(d.workoutRecords.filter((r) => set.has(r.date)).map((r) => r.date)).size
  const fin = d.incomeRecords.filter((r) => set.has(r.date)).reduce((a, r) => a + (r.type === 'entrada' ? r.amount : -r.amount), 0)
  const vendas = d.saleRecords.filter((r) => set.has(r.date)).length
  return {
    habitos: { a: hab, b: dias },
    treino: { a: treinoDias, b: Math.round((dias / 7) * d.settings.metas.treinosSemana) },
    financas: fin,
    vendas: { a: vendas, b: d.settings.metas.vendasDia * dias },
  }
}

export type Negocio = {
  entradas: number
  saidas: number
  saldo: number
  vendasTotal: number
  vendasQtd: number
  ticket: number
  funil: Record<Stage, number>
}

/** Visão de negócio (tudo que já foi registrado, como no painel do app antigo). */
export function negocio(d: AppData): Negocio {
  const entradas = d.incomeRecords.filter((r) => r.type === 'entrada').reduce((a, r) => a + r.amount, 0)
  const saidas = d.incomeRecords.filter((r) => r.type === 'saida').reduce((a, r) => a + r.amount, 0)
  const vendasTotal = d.saleRecords.reduce((a, s) => a + s.total, 0)
  const funil: Record<Stage, number> = { conheci: 0, conversei: 0, proposta: 0, fechou: 0 }
  d.clients.forEach((c) => { funil[c.stage]++ })
  return {
    entradas, saidas, saldo: entradas - saidas, vendasTotal, vendasQtd: d.saleRecords.length,
    ticket: d.saleRecords.length ? Math.round(vendasTotal / d.saleRecords.length) : 0, funil,
  }
}

export type Pessoal = {
  treinos: number
  capitulos: number
  sonoQualidade: number | null
  sonoHoras: number | null
  focoMin: number
  paginas: number
}

/** Visão pessoal dos últimos 30 dias. */
export function pessoal(d: AppData, ref = new Date()): Pessoal {
  const set = new Set(rangeKeys('mes', ref))
  const sono = d.sleepRecords.filter((r) => set.has(r.date))
  return {
    treinos: d.workoutRecords.filter((r) => set.has(r.date)).length,
    capitulos: d.bibleRecords.filter((r) => set.has(r.date)).length,
    sonoQualidade: sono.length ? Math.round((sono.reduce((a, s) => a + s.quality, 0) / sono.length) * 10) / 10 : null,
    sonoHoras: sono.length ? Math.round((sono.reduce((a, s) => a + horasDeSono(s.bedtime, s.wakeTime), 0) / sono.length) * 10) / 10 : null,
    focoMin: d.focusRecords.filter((r) => set.has(r.date)).reduce((a, r) => a + r.durationMinutes, 0),
    paginas: d.readingRecords.filter((r) => set.has(r.date)).reduce((a, r) => a + r.pagesRead, 0),
  }
}

/** 12 semanas (colunas) × 7 dias (linhas, seg→dom) com nível 0–3 da nota do dia. */
export function mapaCalor(d: AppData, ref = new Date()): { key: string; nivel: number; futuro: boolean }[][] {
  const hoje = keyOf(ref)
  const inicio = addDays(mondayOf(ref), -7 * 11)
  const cols: { key: string; nivel: number; futuro: boolean }[][] = []
  for (let w = 0; w < 12; w++) {
    const col = []
    for (let i = 0; i < 7; i++) {
      const key = keyOf(addDays(inicio, w * 7 + i))
      const s = scoreDia(d, key)
      const nivel = !s.temDados ? 0 : s.total >= 7 ? 3 : s.total >= 4 ? 2 : 1
      col.push({ key, nivel, futuro: key > hoje })
    }
    cols.push(col)
  }
  return cols
}
