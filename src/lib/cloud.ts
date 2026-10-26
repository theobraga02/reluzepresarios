/* Login e sincronização opcionais (Supabase). O app funciona 100% sem conta: a nuvem só espelha os dados locais. */
import { useSyncExternalStore } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getData, onDataChange, replaceAll } from './store'
import type { AppData } from './types'

// URL e chave publicável são públicas por desenho (a segurança vem das regras RLS da tabela).
const URL_ = (import.meta.env.NEXT_PUBLIC_emp_SUPABASE_URL as string | undefined) || 'https://wmajikhplenbyligglhv.supabase.co'
const KEY_ =
  (import.meta.env.NEXT_PUBLIC_emp_SUPABASE_PUBLISHABLE_KEY as string | undefined) || 'sb_publishable_tS5Ztr1uKKlfjZYahLkk1Q_GHbZ65B8'
const TABLE = 'empresario_dados'
const META = 'empresario:cloud'

export type CloudState = {
  phase: 'off' | 'busy' | 'ok' | 'error'
  email?: string
  syncedAt?: string
  msg?: string
  recovery?: boolean
}

let st: CloudState = { phase: 'off' }
const subs = new Set<() => void>()
const set = (p: Partial<CloudState>) => {
  st = { ...st, ...p }
  subs.forEach((f) => f())
}
export const useCloud = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => st)

let client: SupabaseClient | null = null
let userId: string | null = null
let applying = false
let dirty = false
let timer: number | undefined

async function sb() {
  if (client) return client
  const { createClient } = await import('@supabase/supabase-js')
  client = createClient(URL_, KEY_, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  client.auth.onAuthStateChange((ev, session) => {
    if (ev === 'PASSWORD_RECOVERY') set({ recovery: true })
    if (session?.user && session.user.id !== userId) void entrou(session.user.id, session.user.email ?? '')
    if (!session && userId) {
      userId = null
      set({ phase: 'off', email: undefined, syncedAt: undefined, msg: undefined })
    }
  })
  return client
}

/* ───────── metadados locais (por usuário) ───────── */
type Meta = Record<string, { remoteAt: string; dirty: boolean }>
const readMeta = (): Meta => {
  try { return JSON.parse(localStorage.getItem(META) || '{}') } catch { return {} }
}
const writeMeta = (uid: string, v: { remoteAt: string; dirty: boolean }) => {
  try { localStorage.setItem(META, JSON.stringify({ ...readMeta(), [uid]: v })) } catch { /* ignora */ }
}

/* ───────── mesclagem ───────── */
function uniao<T extends { id: string }>(local: T[], remoto: T[]): T[] {
  const m = new Map(remoto.map((x) => [x.id, x]))
  local.forEach((x) => m.set(x.id, x))
  return [...m.values()]
}

export function mesclar(a: AppData, b: AppData): AppData {
  const log: Record<string, string[]> = { ...b.habitLog }
  for (const [dia, ids] of Object.entries(a.habitLog)) log[dia] = Array.from(new Set([...(log[dia] ?? []), ...ids]))
  const trilhas = { ...b.trilhas }
  for (const [k, v] of Object.entries(a.trilhas)) trilhas[k] = Math.max(trilhas[k] ?? 1, v)
  const maisNovoCursos = a.aiCoursesAt >= b.aiCoursesAt
  const maisNovoEventos = a.aiEventsAt >= b.aiEventsAt
  return {
    ...b, ...a,
    habits: uniao(a.habits, b.habits), habitLog: log,
    appointments: uniao(a.appointments, b.appointments),
    incomeRecords: uniao(a.incomeRecords, b.incomeRecords), saleRecords: uniao(a.saleRecords, b.saleRecords),
    workoutRecords: uniao(a.workoutRecords, b.workoutRecords), bibleRecords: uniao(a.bibleRecords, b.bibleRecords),
    focusRecords: uniao(a.focusRecords, b.focusRecords), readingRecords: uniao(a.readingRecords, b.readingRecords),
    sleepRecords: uniao(a.sleepRecords, b.sleepRecords),
    clients: uniao(a.clients, b.clients), networkingContacts: uniao(a.networkingContacts, b.networkingContacts),
    savedCourses: Array.from(new Set([...a.savedCourses, ...b.savedCourses])), trilhas,
    businessProfile: a.businessProfile.productName || a.businessProfile.area ? a.businessProfile : b.businessProfile,
    aiCourses: maisNovoCursos ? a.aiCourses : b.aiCourses, aiCoursesAt: maisNovoCursos ? a.aiCoursesAt : b.aiCoursesAt,
    aiEvents: maisNovoEventos ? a.aiEvents : b.aiEvents, aiEventsAt: maisNovoEventos ? a.aiEventsAt : b.aiEventsAt,
    exemplo: a.exemplo && b.exemplo,
  }
}

/* ───────── envio / recebimento ───────── */
async function enviar(): Promise<boolean> {
  if (!userId || !client) return false
  const agora = new Date().toISOString()
  const { error } = await client.from(TABLE).upsert({ user_id: userId, data: getData(), updated_at: agora })
  if (error) {
    set({ phase: 'error', msg: 'Não consegui salvar na nuvem. Vou tentar de novo.' })
    return false
  }
  dirty = false
  writeMeta(userId, { remoteAt: agora, dirty: false })
  set({ phase: 'ok', syncedAt: agora, msg: undefined })
  return true
}

function agendarEnvio() {
  window.clearTimeout(timer)
  timer = window.setTimeout(() => void enviar(), 1800)
}

export async function sincronizar() {
  if (!userId || !client) return
  set({ phase: 'busy', msg: undefined })
  const { data: row, error } = await client.from(TABLE).select('data, updated_at').eq('user_id', userId).maybeSingle()
  if (error) return set({ phase: 'error', msg: 'Sem conexão com a nuvem agora.' })
  const meta = readMeta()[userId]
  if (!row) {
    await enviar()
    return
  }
  const remotoMudou = !meta || row.updated_at > meta.remoteAt
  const localMudou = dirty || !meta || meta.dirty
  if (remotoMudou && localMudou) {
    applying = true
    replaceAll(mesclar(getData(), { ...(row.data as AppData) } as AppData))
    applying = false
    await enviar()
  } else if (remotoMudou) {
    applying = true
    replaceAll(row.data)
    applying = false
    writeMeta(userId, { remoteAt: row.updated_at, dirty: false })
    set({ phase: 'ok', syncedAt: row.updated_at })
  } else if (localMudou) {
    await enviar()
  } else {
    set({ phase: 'ok', syncedAt: meta.remoteAt })
  }
}

async function entrou(id: string, email: string) {
  userId = id
  set({ phase: 'busy', email, msg: undefined })
  await sincronizar()
}

/* ───────── ações públicas ───────── */
let iniciado = false
/** Chame uma vez ao abrir o app. Só carrega a biblioteca se já houver sessão salva neste aparelho. */
export function iniciarNuvem() {
  if (iniciado) return
  iniciado = true
  onDataChange(() => {
    if (applying || !userId) return
    dirty = true
    writeMeta(userId, { remoteAt: readMeta()[userId]?.remoteAt ?? '', dirty: true })
    agendarEnvio()
  })
  window.addEventListener('online', () => void sincronizar())
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && void sincronizar())
  let temSessao = false
  try {
    temSessao = Object.keys(localStorage).some((k) => k.startsWith('sb-') && k.endsWith('-auth-token'))
  } catch { /* ignora */ }
  if (temSessao || location.hash.includes('access_token') || location.search.includes('code=')) void sb().then((c) => c.auth.getSession())
}

const traduz = (m: string) =>
  /invalid login/i.test(m) ? 'E-mail ou senha incorretos.'
  : /already registered|already been registered/i.test(m) ? 'Esse e-mail já tem conta. Use “Entrar”.'
  : /password should be at least/i.test(m) ? 'A senha precisa ter pelo menos 6 caracteres.'
  : /email not confirmed/i.test(m) ? 'Confirme seu e-mail pelo link que enviamos e tente de novo.'
  : /rate limit|too many/i.test(m) ? 'Muitas tentativas. Aguarde alguns minutos.'
  : /valid email|invalid email/i.test(m) ? 'Digite um e-mail válido.'
  : 'Não foi possível concluir agora. Tente novamente.'

export async function entrar(email: string, senha: string) {
  const c = await sb()
  set({ phase: 'busy', msg: undefined })
  const { error } = await c.auth.signInWithPassword({ email: email.trim(), password: senha })
  if (error) { set({ phase: 'off', msg: traduz(error.message) }); return false }
  return true
}

export async function criarConta(email: string, senha: string) {
  const c = await sb()
  set({ phase: 'busy', msg: undefined })
  const { data, error } = await c.auth.signUp({ email: email.trim(), password: senha, options: { emailRedirectTo: `${location.origin}/app/mais` } })
  if (error) { set({ phase: 'off', msg: traduz(error.message) }); return false }
  if (!data.session) set({ phase: 'off', msg: 'Enviamos um link de confirmação para o seu e-mail. Abra-o e depois entre aqui.' })
  return true
}

export async function recuperarSenha(email: string) {
  const c = await sb()
  const { error } = await c.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/app/mais` })
  set({ msg: error ? traduz(error.message) : 'Se esse e-mail tiver conta, enviamos um link para criar nova senha.' })
}

export async function novaSenha(senha: string) {
  const c = await sb()
  const { error } = await c.auth.updateUser({ password: senha })
  set(error ? { msg: traduz(error.message) } : { recovery: false, msg: 'Senha atualizada.' })
  return !error
}

export async function sair() {
  window.clearTimeout(timer)
  if (dirty) await enviar()
  await client?.auth.signOut()
}

export async function apagarNuvem() {
  if (!userId || !client) return
  const { error } = await client.from(TABLE).delete().eq('user_id', userId)
  if (error) return set({ phase: 'error', msg: 'Não consegui apagar agora.' })
  // Sai da conta para não reenviar tudo automaticamente; os dados deste aparelho continuam aqui.
  window.clearTimeout(timer)
  await client.auth.signOut()
  set({ msg: 'Dados da nuvem apagados e conta desconectada. Os dados deste aparelho continuam aqui.' })
}
