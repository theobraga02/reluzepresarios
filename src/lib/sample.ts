import { type DayLog, emptyLog } from './model'

// Gerador pseudoaleatório determinístico (mulberry32) — dados de EXEMPLO, não reais.
function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function gerarExemplo(habitIds: string[], _hoje: string, keyDaysAgo: (n: number) => string) {
  const logs: Record<string, DayLog> = {}
  const rand = rng(2026)
  const dias = 400
  for (let i = dias; i >= 0; i--) {
    // tendência leve de melhora ao longo do tempo
    const bonus = (dias - i) / dias
    const l = emptyLog()
    const nHab = Math.min(habitIds.length, Math.round(4 + rand() * 4 + bonus * 2))
    l.habitos = habitIds.slice(0, nHab)
    if (rand() < 0.45 + bonus * 0.3) l.treino = { feito: true, minutos: 25 + Math.round(rand() * 35), nota: '' }
    if (rand() < 0.8) {
      l.financas.receita = Math.round(rand() * 1600)
      l.financas.gastos = Math.round(120 + rand() * 600)
    }
    l.vendas = { contatos: Math.round(1 + rand() * 4), propostas: Math.round(rand() * 2), fechadas: Math.round(rand() * 2) }
    l.biblia.minutos = rand() < 0.7 ? [5, 10, 15, 20][Math.floor(rand() * 4)] : 0
    l.sono.horas = Math.round((5.5 + rand() * 3) * 2) / 2
    l.foco.minutos = Math.round(30 + rand() * 150)
    logs[keyDaysAgo(i)] = l
  }
  return logs
}
