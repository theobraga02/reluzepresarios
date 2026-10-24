import { useSyncExternalStore } from 'react'
import { addDays, keyOf } from './date'
import { type DayLog, type Habit, HABITOS_PADRAO, normalizeLog } from './model'
import { gerarExemplo } from './sample'

export type State = {
  v: 1
  habitos: Habit[]
  logs: Record<string, DayLog>
  /** true quando os registros vieram do botão "dados de exemplo". */
  exemplo: boolean
}

const KEY = 'empresario:v1'

const initial = (): State => ({ v: 1, habitos: HABITOS_PADRAO, logs: {}, exemplo: false })

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (p && p.v === 1) return { ...initial(), ...p }
    }
  } catch {
    /* armazenamento indisponível: segue em memória */
  }
  return initial()
}

let state: State = load()
const subs = new Set<() => void>()

function commit(next: State) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
  subs.forEach((f) => f())
}

const subscribe = (f: () => void) => {
  subs.add(f)
  return () => {
    subs.delete(f)
  }
}

export const useStore = () => useSyncExternalStore(subscribe, () => state)

export const getLog = (s: State, key: string) => normalizeLog(s.logs[key])

export function saveLog(key: string, log: DayLog) {
  commit({ ...state, logs: { ...state.logs, [key]: log } })
}

export function exportJSON() {
  return JSON.stringify(state, null, 2)
}

export function resetAll() {
  commit(initial())
}

export function loadSample() {
  const logs = gerarExemplo(state.habitos.map((h) => h.id), keyOf(new Date()), (n) => keyOf(addDays(new Date(), -n)))
  commit({ ...state, logs, exemplo: true })
}
