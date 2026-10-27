import { addDays, DIAS_CURTOS_SEMANA, keyOf, MESES_CURTOS } from './date'
import { scoreDia } from './score'
import type { AppData } from './types'

export type Ponto = { k: string; rot: string; habitos: number; nota: number }

/** Últimos `dias` dias: % de hábitos concluídos e nota geral (0–100), calculados dos registros reais. */
export function serieHabitos(d: AppData, dias: number, fim = new Date()): Ponto[] {
  const ids = new Set(d.habits.map((h) => h.id))
  return Array.from({ length: dias }, (_, i) => {
    const dia = addDays(fim, i - (dias - 1))
    const k = keyOf(dia)
    const n = (d.habitLog[k] ?? []).filter((id) => ids.has(id)).length
    const sc = scoreDia(d, k)
    return {
      k,
      rot: dias <= 7 ? DIAS_CURTOS_SEMANA[(dia.getDay() + 6) % 7] : `${dia.getDate()} ${MESES_CURTOS[dia.getMonth()]}`,
      habitos: ids.size ? Math.round((n / ids.size) * 100) : 0,
      nota: sc.temDados ? Math.round(sc.total * 10) : 0,
    }
  })
}

export const media = (l: Ponto[]) => (l.length ? Math.round(l.reduce((s, x) => s + x.habitos, 0) / l.length) : 0)
