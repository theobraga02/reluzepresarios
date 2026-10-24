import { addDays, DIAS_CURTOS_SEMANA, fromKey, keyOf, MESES_CURTOS } from './date'
import { acoesVendas, META, saldo, scoreLog } from './model'
import type { State } from './store'

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

const media = (s: State, keys: string[]) => {
  const v = keys.filter((k) => s.logs[k]).map((k) => scoreLog(s.logs[k], s.habitos.length).total)
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null
}

export type Ponto = { label: string; valor: number | null }

export function serie(s: State, period: Period, ref = new Date()): Ponto[] {
  const hoje = keyOf(ref)
  const keys = rangeKeys(period, ref)
  if (period === 'ano') {
    return MESES_CURTOS.map((label, m) => {
      const ks = keys.filter((k) => fromKey(k).getMonth() === m && k <= hoje)
      const v = media(s, ks)
      return { label, valor: v == null ? null : Math.round(v * 10) / 10 }
    })
  }
  return keys.map((k, i) => ({
    label: period === 'semana' ? DIAS_CURTOS_SEMANA[i] : String(fromKey(k).getDate()),
    valor: s.logs[k] && k <= hoje ? scoreLog(s.logs[k], s.habitos.length).total : null,
  }))
}

/** Variação percentual da nota média vs. período anterior (null se não der para comparar). */
export function variacao(s: State, period: Period, ref = new Date()): number | null {
  const a = media(s, rangeKeys(period, ref))
  const b = media(s, rangeKeys(period, ref, 1))
  if (a == null || b == null || b === 0) return null
  return Math.round(((a - b) / b) * 100)
}

export type Resumo = {
  habitos: { a: number; b: number }
  treino: { a: number; b: number }
  financas: number
  vendas: { a: number; b: number }
}

export function resumo(s: State, period: Period, ref = new Date()): Resumo {
  const keys = rangeKeys(period, ref)
  let hab = 0, tre = 0, fin = 0, ven = 0
  for (const k of keys) {
    const l = s.logs[k]
    if (!l || k > keyOf(ref)) continue
    if (scoreLog(l, s.habitos.length).habitos >= 7) hab++
    if (l.treino?.feito) tre++
    fin += saldo(l)
    ven += acoesVendas(l)
  }
  const dias = keys.length
  return {
    habitos: { a: hab, b: dias },
    treino: { a: tre, b: Math.round((dias / 7) * META.treinoSemana) },
    financas: fin,
    vendas: { a: ven, b: META.vendasDia * dias },
  }
}
