import { useSyncExternalStore } from 'react'
import { addDays, keyOf, todayKey } from './date'
import { getDefaultData, HABIT_TO_AREA } from './defaults'
import { gerarExemplo } from './sample'
import type { AppData, Area, Habit } from './types'

const KEY = 'empresario:v2'

/** Aceita o formato atual, o export do app antigo ({version, data}) e dados parciais. */
export function normalizeData(raw: unknown): AppData {
  const base = getDefaultData()
  const root = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>
  const src = (root.data && typeof root.data === 'object' ? root.data : root) as Record<string, any>
  const arr = <T,>(v: unknown, fb: T[]): T[] => (Array.isArray(v) ? (v as T[]) : fb)

  const habitLog: Record<string, string[]> =
    src.habitLog && typeof src.habitLog === 'object' ? { ...src.habitLog } : {}

  // App antigo: cada hábito tinha `completed` (sem data). Vira "feito hoje".
  const habitsIn = arr<any>(src.habits, base.habits)
  const habits: Habit[] = habitsIn.map((h) => {
    const { completed, ...rest } = h
    return rest as Habit
  })
  const doneOld = habitsIn.filter((h) => h?.completed).map((h) => h.id)
  if (doneOld.length && !src.habitLog) habitLog[todayKey()] = doneOld

  return {
    ...base,
    habits,
    habitLog,
    appointments: arr(src.appointments, []),
    incomeRecords: arr(src.incomeRecords, []),
    saleRecords: arr(src.saleRecords, []),
    workoutRecords: arr(src.workoutRecords, []),
    bibleRecords: arr(src.bibleRecords, []),
    focusRecords: arr(src.focusRecords, []),
    readingRecords: arr(src.readingRecords, []),
    sleepRecords: arr(src.sleepRecords, []),
    businessProfile: { ...base.businessProfile, ...(src.businessProfile ?? {}) },
    clients: arr(src.clients, []),
    networkingContacts: arr(src.networkingContacts, []),
    savedCourses: arr(src.savedCourses, []),
    trilhas: src.trilhas && typeof src.trilhas === 'object' ? { ...src.trilhas } : {},
    settings: {
      ...base.settings,
      ...(src.settings ?? {}),
      metas: { ...base.settings.metas, ...(src.settings?.metas ?? {}) },
    },
    aiCourses: arr(src.aiCourses, []),
    aiCoursesAt: typeof src.aiCoursesAt === 'string' ? src.aiCoursesAt : '',
    aiEvents: arr(src.aiEvents, []),
    aiEventsAt: typeof src.aiEventsAt === 'string' ? src.aiEventsAt : '',
    coachCache: src.coachCache,
    exemplo: Boolean(src.exemplo),
  }
}

function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return normalizeData(JSON.parse(raw))
  } catch {
    /* armazenamento indisponível ou corrompido: começa limpo */
  }
  return getDefaultData()
}

let state: AppData = load()
const subs = new Set<() => void>()

function commit(next: AppData) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignora */
  }
  subs.forEach((f) => f())
}

const subscribe = (f: () => void) => {
  subs.add(f)
  return () => {
    subs.delete(f)
  }
}

export const useData = () => useSyncExternalStore(subscribe, () => state)
export const getData = () => state
export const update = (fn: (prev: AppData) => AppData) => commit(fn(state))

export const uid = (p = 'r') => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/* ───────── ações ───────── */

export function toggleHabit(id: string, dia = todayKey()) {
  update((d) => {
    const cur = d.habitLog[dia] ?? []
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    return { ...d, habitLog: { ...d.habitLog, [dia]: next } }
  })
}

export function addHabit(h: Habit) {
  update((d) => ({ ...d, habits: [...d.habits, h] }))
}

export function removeHabit(id: string) {
  update((d) => ({ ...d, habits: d.habits.filter((h) => h.id !== id) }))
}

type RecordKey =
  | 'workoutRecords' | 'incomeRecords' | 'saleRecords' | 'bibleRecords' | 'focusRecords' | 'readingRecords' | 'sleepRecords'

/** Salva um registro e marca como feitos os hábitos da mesma área (como no app antigo). */
export function addRecord<K extends RecordKey>(key: K, rec: AppData[K][number], area: Area, dia = todayKey()) {
  update((d) => {
    const ids = d.habits.filter((h) => HABIT_TO_AREA[h.area] === area).map((h) => h.id)
    const cur = d.habitLog[dia] ?? []
    const merged = Array.from(new Set([...cur, ...ids]))
    return {
      ...d,
      [key]: [...(d[key] as unknown[]), rec],
      habitLog: { ...d.habitLog, [dia]: merged },
    } as AppData
  })
}

export function exportJSON() {
  return JSON.stringify({ version: '2.0', exportedAt: new Date().toISOString(), data: state }, null, 2)
}

export function importJSON(text: string): { ok: boolean; msg: string } {
  try {
    const parsed = JSON.parse(text)
    const probe = parsed?.data ?? parsed
    if (!probe || typeof probe !== 'object' || !('habits' in probe || 'incomeRecords' in probe || 'logs' in probe)) {
      return { ok: false, msg: 'Arquivo não parece ser um backup do Empresário.' }
    }
    if ('logs' in probe && !('habits' in probe)) return { ok: false, msg: 'Backup da versão anterior não é compatível.' }
    commit(normalizeData(parsed))
    return { ok: true, msg: 'Dados importados com sucesso.' }
  } catch {
    return { ok: false, msg: 'Não consegui ler o arquivo (JSON inválido).' }
  }
}

export function resetAll() {
  commit(getDefaultData())
}

export function loadSample() {
  const hoje = new Date()
  const s = gerarExemplo(state.habits.map((h) => h.id), (n) => keyOf(addDays(hoje, -n)), (n) => keyOf(addDays(hoje, n)))
  commit({ ...getDefaultData(), ...s, habits: state.habits, settings: state.settings, businessProfile: state.businessProfile, exemplo: true })
}

export function setConsent(v: boolean) {
  update((d) => ({ ...d, settings: { ...d.settings, aiConsent: v } }))
}
