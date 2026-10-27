/* Login e sincronização opcionais (Supabase). O app funciona 100% sem conta: a nuvem só espelha os dados locais. */
import { useSyncExternalStore } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getData, onDataChange, replaceAll } from './store'
import type { AppData } from './types'

// URL e chave publicável são públicas por desenho (a segurança vem das regras RLS da tabela).
export const SB_URL = (import.meta.env.NEXT_PUBLIC_emp_SUPABASE_URL as string | undefined) || 'https://wmajikhplenbyligglhv.supabase.co'
export const SB_KEY =
  (import.meta.env.NEXT_PUBLIC_emp_SUPABASE_PUBLISHABLE_KEY as string | undefined) || 'sb_publishable_tS5Ztr1uKKlfjZYahLkk1Q_GHbZ65B8'
const TABLE = 'empresario_dados'
const META = 'empresario:cloud'

export const TERMOS_V = '1'
const termosKey = (uid: string) => `empresario:termos:${uid}`
const termosLocal = (uid: string) => { try { return localStorage.getItem(termosKey(uid)) === TERMOS_V } catch { return false } }

export type CloudState = {
  phase: 'off' | 'busy' | 'ok' | 'error'
  /** false enquanto o app confere se já existe uma sessão salva neste aparelho. */
  pronto: boolean
  uid?: string
  termos?: boolean
  email?: string
  syncedAt?: string
  msg?: string
  recovery?: boolean
}

let st: CloudState = { phase: 'off', pronto: false }
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

export async function cliente() {
  return sb()
}

async function sb() {
  if (client) return client
  const { createClient } = await import('@supabase/supabase-js')
  client = createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  client.auth.onAuthStateChange((ev, session) => {
    if (ev === 'PASSWORD_RECOVERY') set({ recovery: true })
    if (session?.user && session.user.id !== userId) void entrou(session.user.id, session.user.email ?? '', session.user.user_metadata)
    if (!session && userId) {
      userId = null
      set({ phase: 'off', pronto: true, email: undefined, uid: undefined, termos: undefined, syncedAt: undefined, msg: undefined })
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
    leitor: { last: a.leitor.last ?? b.leitor.last, marcados: Array.from(new Set([...a.leitor.marcados, ...b.leitor.marcados])) },
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

async function entrou(id: string, email: string, meta?: Record<string, unknown>) {
  userId = id
  set({ phase: 'busy', pronto: true, uid: id, email, termos: meta?.termos_v === TERMOS_V || termosLocal(id), msg: undefined })
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
  if (temSessao || location.hash.includes('access_token') || location.search.includes('code=')) {
    void sb()
      .then(async (c) => {
        const { data } = await c.auth.getSession()
        if (data.session && !userId) await entrou(data.session.user.id, data.session.user.email ?? '', data.session.user.user_metadata)
      })
      .catch(() => {})
      .finally(() => set({ pronto: true }))
  } else set({ pronto: true })
}

type ErroAuth = { message: string; code?: string; status?: number }
/** Traduz o erro do Supabase e mantém o código técnico no fim, para o diagnóstico ficar fácil. */
const traduz = (e: ErroAuth) => {
  const m = e.message ?? ''
  const c = e.code ?? ''
  const txt =
    c === 'invalid_credentials' || /invalid login/i.test(m) ? 'E-mail ou senha incorretos. Se a conta foi criada em outro app com a mesma conta, use “Esqueci minha senha”.'
    : c === 'user_already_exists' || /already registered|already been registered/i.test(m) ? 'Esse e-mail já tem conta. Use “Entrar” (ou “Esqueci minha senha”).'
    : c === 'weak_password' || /password should be at least/i.test(m) ? 'A senha precisa ter pelo menos 6 caracteres.'
    : c === 'email_not_confirmed' || /email not confirmed/i.test(m) ? 'Falta confirmar o e-mail. Abra o link que enviamos ou peça um novo abaixo.'
    : c === 'signup_disabled' || /signups? not allowed/i.test(m) ? 'O cadastro de novas contas está desativado no Supabase (Authentication → Sign In / Providers → Allow new users to sign up).'
    : c === 'over_email_send_rate_limit' || /rate limit|too many/i.test(m) ? 'Limite de e-mails do Supabase atingido. Aguarde cerca de 1 hora ou configure um SMTP próprio.'
    : /error sending|sending confirmation|smtp/i.test(m) ? 'O Supabase não conseguiu enviar o e-mail de confirmação (SMTP). Veja Authentication → Emails → SMTP Settings.'
    : /failed to fetch|network|load failed/i.test(m) ? 'Sem conexão com o servidor. Verifique a internet e tente de novo.'
    : c === 'validation_failed' || /valid email|invalid email/i.test(m) ? 'Digite um e-mail válido.'
    : 'Não foi possível concluir agora. Tente novamente.'
  return c || e.status ? `${txt} (${c || e.status})` : txt
}

export async function entrar(email: string, senha: string) {
  const c = await sb()
  set({ phase: 'busy', msg: undefined })
  try {
    const { error } = await c.auth.signInWithPassword({ email: email.trim(), password: senha })
    if (error) { set({ phase: 'off', msg: traduz(error) }); return false }
    return true
  } catch (e) { set({ phase: 'off', msg: traduz(e as ErroAuth) }); return false }
}

export async function criarConta(email: string, senha: string, aceitou = false) {
  const c = await sb()
  set({ phase: 'busy', msg: undefined })
  try {
    const { data, error } = await c.auth.signUp({ email: email.trim(), password: senha, options: { emailRedirectTo: `${location.origin}/app`, data: aceitou ? { termos_v: TERMOS_V, termos_em: new Date().toISOString() } : {} } })
    if (error) { set({ phase: 'off', msg: traduz(error) }); return false }
    // O Supabase devolve um usuário "falso" sem identidades quando o e-mail já existe (para não revelar contas).
    if (data.user && data.user.identities?.length === 0) { set({ phase: 'off', msg: 'Esse e-mail já tem conta. Use “Entrar” (ou “Esqueci minha senha”).' }); return false }
    if (!data.session) set({ phase: 'off', msg: 'Conta criada. Enviamos um link de confirmação para o seu e-mail: abra-o e depois entre aqui.' })
    return true
  } catch (e) { set({ phase: 'off', msg: traduz(e as ErroAuth) }); return false }
}

export async function recuperarSenha(email: string) {
  const c = await sb()
  try {
    const { error } = await c.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/app` })
    set({ msg: error ? traduz(error) : 'Se esse e-mail tiver conta, enviamos um link para criar nova senha.' })
  } catch (e) { set({ msg: traduz(e as ErroAuth) }) }
}

export async function novaSenha(senha: string) {
  const c = await sb()
  const { error } = await c.auth.updateUser({ password: senha })
  set(error ? { msg: traduz(error) } : { recovery: false, msg: 'Senha atualizada.' })
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

export async function aceitarTermos() {
  const c = await sb()
  const { error } = await c.auth.updateUser({ data: { termos_v: TERMOS_V, termos_em: new Date().toISOString() } })
  if (error) { set({ msg: 'Não consegui registrar o aceite agora. Tente de novo.' }); return false }
  try { if (userId) localStorage.setItem(termosKey(userId), TERMOS_V) } catch { /* ignora */ }
  set({ termos: true, msg: undefined })
  return true
}

export async function reenviarConfirmacao(email: string) {
  try {
    const c = await sb()
    const { error } = await c.auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: `${location.origin}/app` } })
    set({ msg: error ? traduz(error) : 'Enviamos um novo link de confirmação.' })
  } catch (e) { set({ msg: traduz(e as ErroAuth) }) }
}
