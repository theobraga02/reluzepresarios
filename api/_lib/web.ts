/* Busca na web (Tavily ou Brave) + verificação de links com proteção contra SSRF. */
import { lookup } from 'node:dns/promises'
import net from 'node:net'

export type Achado = { titulo: string; url: string; trecho: string }
const env = (k: string) => (process.env[k] ?? '').trim()

export const temBusca = () => Boolean(env('TAVILY_API_KEY') || env('BRAVE_API_KEY'))

async function comTimeout(url: string, init: RequestInit, ms = 8000) {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), ms)
  try {
    return await fetch(url, { ...init, signal: ctl.signal })
  } finally {
    clearTimeout(t)
  }
}

export async function buscar(consulta: string, max = 6): Promise<Achado[]> {
  if (env('TAVILY_API_KEY')) {
    const r = await comTimeout('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${env('TAVILY_API_KEY')}` },
      body: JSON.stringify({ query: consulta, max_results: max, search_depth: 'basic' }),
    })
    if (r.ok) {
      const j: any = await r.json()
      return (j.results ?? []).map((x: any) => ({ titulo: String(x.title ?? ''), url: String(x.url ?? ''), trecho: String(x.content ?? '').slice(0, 280) }))
    }
  }
  if (env('BRAVE_API_KEY')) {
    const r = await comTimeout(`https://api.search.brave.com/res/v1/web/search?count=${max}&q=${encodeURIComponent(consulta)}`, {
      headers: { 'x-subscription-token': env('BRAVE_API_KEY'), accept: 'application/json' },
    })
    if (r.ok) {
      const j: any = await r.json()
      return (j.web?.results ?? []).map((x: any) => ({ titulo: String(x.title ?? ''), url: String(x.url ?? ''), trecho: String(x.description ?? '').replace(/<[^>]+>/g, '').slice(0, 280) }))
    }
  }
  return []
}

function ipPrivado(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number)
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224
  }
  const v = ip.toLowerCase()
  return v === '::1' || v === '::' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80') || v.startsWith('::ffff:')
}

/** Só aceita https público (sem IP literal, sem localhost, sem DNS que resolva para rede interna). */
export async function urlSegura(u: string): Promise<URL | null> {
  let url: URL
  try {
    url = new URL(u)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' || url.username || url.password) return null
  if (url.port && url.port !== '443') return null
  const h = url.hostname.toLowerCase()
  if (!h.includes('.') || h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal') || net.isIP(h)) return null
  try {
    const addrs = await lookup(h, { all: true })
    if (!addrs.length || addrs.some((a) => ipPrivado(a.address))) return null
  } catch {
    return null
  }
  return url
}

/** Abre o link (até 3 redirecionamentos, cada um revalidado). true = respondeu 2xx. */
export async function linkAbre(u: string): Promise<boolean> {
  let atual = u
  for (let i = 0; i < 4; i++) {
    const url = await urlSegura(atual)
    if (!url) return false
    try {
      const r = await comTimeout(url.toString(), { method: 'GET', redirect: 'manual', headers: { 'user-agent': 'Mozilla/5.0 EmpresarioBot', range: 'bytes=0-2048' } }, 6000)
      if (r.status >= 300 && r.status < 400) {
        const loc = r.headers.get('location')
        if (!loc) return false
        atual = new URL(loc, url).toString()
        continue
      }
      return r.status >= 200 && r.status < 300
    } catch {
      return false
    }
  }
  return false
}
