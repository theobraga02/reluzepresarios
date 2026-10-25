/* Cadeia de IAs gratuitas: Gemini → Groq → OpenRouter. A primeira com chave e que responder vence. */

export type Mensagem = { role: 'system' | 'user' | 'assistant'; content: string }
export type Resposta = { texto: string; provider: string }

const env = (k: string) => (process.env[k] ?? '').trim()

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

async function gemini(msgs: Mensagem[], json: boolean): Promise<string> {
  const system = msgs.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n')
  const contents = msgs
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))
  const r = await comTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL()}:generateContent`,
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
  if (!r.ok) throw new Error(`gemini ${r.status}`)
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
  if (!r.ok) throw new Error(`${model} ${r.status}`)
  const j: any = await r.json()
  const t = j?.choices?.[0]?.message?.content ?? ''
  if (!t) throw new Error('vazio')
  return t as string
}

export async function perguntar(msgs: Mensagem[], json = false): Promise<Resposta> {
  const cadeia: { nome: string; ok: boolean; run: () => Promise<string> }[] = [
    { nome: 'Gemini', ok: !!env('GEMINI_API_KEY'), run: () => gemini(msgs, json) },
    {
      nome: 'Groq', ok: !!env('GROQ_API_KEY'),
      run: () => compat('https://api.groq.com/openai/v1/chat/completions', env('GROQ_API_KEY'), GROQ_MODEL(), msgs, json),
    },
    {
      nome: 'OpenRouter', ok: !!env('OPENROUTER_API_KEY'),
      run: () => compat('https://openrouter.ai/api/v1/chat/completions', env('OPENROUTER_API_KEY'), OPENROUTER_MODEL(), msgs, json, { 'x-title': 'Empresario' }),
    },
  ]
  let ultimo = 'nenhuma IA configurada'
  for (const p of cadeia) {
    if (!p.ok) continue
    try {
      return { texto: await p.run(), provider: p.nome }
    } catch (e) {
      ultimo = `${p.nome}: ${(e as Error).message}`
    }
  }
  throw new Error(ultimo)
}

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
