import livrosJson from './biblia-livros.json'

export type Livro = { code: string; nome: string; abrev: string; caps: number }
export const LIVROS = livrosJson as Livro[]
export const AT = LIVROS.slice(0, 39)
export const NT = LIVROS.slice(39)
export const livroPorCode = (c: string) => LIVROS.find((l) => l.code === c)

const cache = new Map<string, string[][]>()

/** Carrega um livro (lista de capítulos → lista de versículos). Fica em cache na memória e no service worker. */
export async function carregarLivro(code: string): Promise<string[][]> {
  const hit = cache.get(code)
  if (hit) return hit
  const r = await fetch(`/biblia/${code}.json`)
  if (!r.ok) throw new Error('falha ao carregar')
  const j = (await r.json()) as string[][]
  cache.set(code, j)
  return j
}

export type Achado = { code: string; nome: string; cap: number; v: number; texto: string }

const norm = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

/** Busca por palavra/frase em toda a Bíblia (carrega os 66 livros na primeira busca). */
export async function buscar(termo: string, max = 60, onProg?: (n: number) => void): Promise<Achado[]> {
  const t = norm(termo.trim())
  if (t.length < 3) return []
  const out: Achado[] = []
  let feitos = 0
  for (const l of LIVROS) {
    const caps = await carregarLivro(l.code)
    caps.forEach((vs, ci) =>
      vs.forEach((txt, vi) => {
        if (out.length < max && norm(txt).includes(t)) out.push({ code: l.code, nome: l.nome, cap: ci + 1, v: vi + 1, texto: txt })
      }),
    )
    onProg?.(++feitos / LIVROS.length)
    if (out.length >= max) break
  }
  return out
}
