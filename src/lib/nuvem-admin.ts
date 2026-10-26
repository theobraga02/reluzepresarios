/* Conteúdo gerenciado pelo painel de admin (leitura pública, sem login). Tudo é opcional: sem internet o app usa o conteúdo embutido. */
import { SB_KEY, SB_URL } from './cloud'
import type { HabitoCatalogo, CatId } from './catalogo-habitos'
import type { HabitArea } from './types'

export type Aviso = { id: string; titulo: string; texto: string; link?: string | null }
export type Foto = { url: string; texto: string }

async function ler<T>(tabela: string, query: string): Promise<T[]> {
  const chave = `empresario:rest:${tabela}`
  try {
    const c = JSON.parse(sessionStorage.getItem(chave) || 'null')
    if (c && Date.now() - c.t < 5 * 60_000) return c.v as T[]
  } catch { /* ignora */ }
  const r = await fetch(`${SB_URL}/rest/v1/${tabela}?${query}`, { headers: { apikey: SB_KEY } })
  if (!r.ok) throw new Error(String(r.status))
  const v = (await r.json()) as T[]
  try { sessionStorage.setItem(chave, JSON.stringify({ t: Date.now(), v })) } catch { /* ignora */ }
  return v
}

export function limparCacheRemoto() {
  try { Object.keys(sessionStorage).filter((k) => k.startsWith('empresario:rest:')).forEach((k) => sessionStorage.removeItem(k)) } catch { /* ignora */ }
}

type LinhaCat = { id: string; titulo: string; cat: CatId; icone: string; area: HabitArea; meta: number | null; unidade: string | null; dica: string }

export async function carregarCatalogoRemoto(): Promise<{ extras: HabitoCatalogo[]; ocultos: string[] }> {
  const [l, o] = await Promise.all([
    ler<LinhaCat>('empresario_catalogo', 'select=id,titulo,cat,icone,area,meta,unidade,dica&ativo=eq.true&order=created_at.desc'),
    ler<{ id: string }>('empresario_catalogo_ocultos', 'select=id'),
  ])
  return {
    extras: l.map((x) => ({ id: `x-${x.id}`, titulo: x.titulo, cat: x.cat, icone: x.icone, area: x.area, meta: x.meta ?? undefined, unidade: x.unidade ?? undefined, dica: x.dica, extra: true })),
    ocultos: o.map((x) => x.id),
  }
}

export async function carregarAvisos(): Promise<Aviso[]> {
  return ler<Aviso>('empresario_avisos', 'select=id,titulo,texto,link&order=created_at.desc&limit=10')
}

export async function carregarMidia(): Promise<{ frases: string[]; fotos: Foto[] }> {
  const l = await ler<{ tipo: string; texto: string; url: string | null }>('empresario_midia', 'select=tipo,texto,url&ativo=eq.true&order=created_at.desc&limit=200')
  return {
    frases: l.filter((x) => x.tipo === 'frase' && x.texto).map((x) => x.texto),
    fotos: l.filter((x) => x.tipo === 'foto' && x.url).map((x) => ({ url: x.url!, texto: x.texto })),
  }
}
