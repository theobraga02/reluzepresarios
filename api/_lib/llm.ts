/* Cadeia de IAs gratuitas: Gemini → Groq → OpenRouter. A primeira com chave e que responder vence. */

export type Mensagem = { role: 'system' | 'user' | 'assistant'; content: string }
export type Resposta = { texto: string; provider: string }

const ALIAS: Record<string, string[]> = {
  GEMINI_API_KEY: ['gemini', 'GEMINI_KEY', 'GOOGLE_API_KEY'],
  GROQ_API_KEY: ['groq', 'GROQ_KEY'],
  OPENROUTER_API_KEY: ['openrouter_key', 'openrouter', 'OPENROUTER_KEY'],
  TAVILY_API_KEY: ['tavily_key', 'tavily', 'TAVILY_KEY'],
}
const env = (k: string) => {
  for (const n of [k, ...(ALIAS[k] ?? [])]) {
    const v = (process.env[n] ?? '').trim()
    if (v) return v
  }
  return ''
}

const GEMINI_MODEL = () => env('GEMINI_MODEL') || 'gemini-2.5-flash'
const GROQ_MODEL = () => env('GROQ_MODEL') || 'llama-3.3-70b-versatile'
const OPENROUTER_MODEL = () => env('OPENROUTER_MODEL') || 'meta-llama/llama-3.3-70b-instruct:free'

export const temAlgumaIA = () => Boolean(env('GEMINI_API_KEY') || env('GROQ_API_KEY') || env('OPENROUTER_API_KEY'))

async function comTimeout(url: string, init: RequestInit, ms = 25000) {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), ms)
  try {
    return await fetch(url, { ...init, signal: ctl.signal })
  } finally {
    clearTimeout(t)
  }
}

async function gemini(msgs: Mensagem[], json: boolean, model = GEMINI_MODEL()): Promise<string> {
  const system = msgs.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n')
  const contents = msgs
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))
  const r = await comTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': env('GEMINI_API_KEY') },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents,
        generationConfig: { temperature: 0.5, ...(json ? { responseMimeType: 'application/json' } : {}) },
      }),
    },
  )
  if (!r.ok) throw new Error(`${model} HTTP ${r.status} ${(await r.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160)}`)
  const j: any = await r.json()
  const t = j?.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? '').join('') ?? ''
  if (!t) throw new Error('gemini vazio')
  return t
}

async function compat(url: string, key: string, model: string, msgs: Mensagem[], json: boolean, extra: Record<string, string> = {}) {
  const r = await comTimeout(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}`, ...extra },
    body: JSON.stringify({
      model, messages: msgs, temperature: 0.5,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  })
  if (!r.ok) throw new Error(`${model} HTTP ${r.status} ${(await r.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 160)}`)
  const j: any = await r.json()
  const t = j?.choices?.[0]?.message?.content ?? ''
  if (!t) throw new Error('vazio')
  return t as string
}

const unico = (l: string[]) => [...new Set(l.filter(Boolean))]

type Passo = { nome: string; run: () => Promise<string> }
function passos(msgs: Mensagem[], json: boolean): Passo[] {
  const l: Passo[] = []
  if (env('GEMINI_API_KEY'))
    for (const m of unico([GEMINI_MODEL(), 'gemini-2.5-flash-lite', 'gemini-2.0-flash']))
      l.push({ nome: `Gemini ${m}`, run: () => gemini(msgs, json, m) })
  if (env('GROQ_API_KEY'))
    for (const m of unico([GROQ_MODEL(), 'llama-3.1-8b-instant']))
      l.push({ nome: `Groq ${m}`, run: () => compat('https://api.groq.com/openai/v1/chat/completions', env('GROQ_API_KEY'), m, msgs, json) })
  if (env('OPENROUTER_API_KEY'))
    for (const m of unico([OPENROUTER_MODEL(), 'google/gemma-3-27b-it:free', 'openrouter/free']))
      l.push({ nome: `OpenRouter ${m}`, run: () => compat('https://openrouter.ai/api/v1/chat/completions', env('OPENROUTER_API_KEY'), m, msgs, json && !m.includes('gemma'), { 'x-title': 'Empresario' }) })
  return l
}

export class FalhaIA extends Error {
  detalhes: string[]
  constructor(d: string[]) {
    super(d.join(' | ') || 'nenhuma IA configurada')
    this.detalhes = d
  }
}

export async function perguntar(msgs: Mensagem[], json = false): Promise<Resposta> {
  const falhas: string[] = []
  for (const p of passos(msgs, json)) {
    try {
      return { texto: await p.run(), provider: p.nome.split(' ')[0] }
    } catch (e) {
      falhas.push(`${p.nome}: ${(e as Error).message}`)
    }
  }
  throw new FalhaIA(falhas)
}

/** Diagnóstico: testa cada provedor com uma pergunta mínima (sem expor chaves). */
export async function diagnostico() {
  const out: Record<string, string> = {}
  for (const p of passos([{ role: 'user', content: 'Responda apenas: ok' }], false)) {
    try {
      await p.run()
      out[p.nome] = 'ok'
    } catch (e) {
      out[p.nome] = (e as Error).message.slice(0, 200)
    }
  }
  return out
}

export const configurados = () => ({ gemini: !!env('GEMINI_API_KEY'), groq: !!env('GROQ_API_KEY'), openrouter: !!env('OPENROUTER_API_KEY'), busca: !!env('TAVILY_API_KEY') })

/** Extrai o primeiro objeto JSON de um texto (modelos às vezes cercam com ```). */
export function extrairJSON<T = any>(txt: string): T | null {
  const limpo = txt.replace(/```json|```/gi, '')
  const ini = limpo.indexOf('{')
  const fim = limpo.lastIndexOf('}')
  if (ini < 0 || fim <= ini) return null
  try {
    return JSON.parse(limpo.slice(ini, fim + 1)) as T
  } catch {
    return null
  }
}
