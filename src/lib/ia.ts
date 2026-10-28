import { addDays, keyOf } from './date'
import { scoreDia, sequencia, AREAS, AREA_NOME } from './score'
import { getData, update } from './store'
import { todayKey } from './date'
import type { AppData, ApproachScript, Area, BusinessProfile, CoachReport, Item, NetworkingEvent } from './types'

/** Resumo numérico enviado à IA. Nunca inclui textos livres (anotações, nomes de clientes, etc.). */
export function resumoParaIA(d: AppData, ref = new Date()) {
  const dias = Array.from({ length: 7 }, (_, i) => keyOf(addDays(ref, -i)))
  const scores = dias.map((k) => scoreDia(d, k))
  const medias: Record<string, number> = {}
  for (const a of AREAS) medias[AREA_NOME[a]] = Math.round((scores.reduce((s, x) => s + x[a], 0) / 7) * 10) / 10
  return {
    notaHoje: scores[0].total,
    notaMedia7d: Math.round((scores.reduce((s, x) => s + x.total, 0) / 7) * 10) / 10,
    diasComRegistro7d: scores.filter((s) => s.temDados).length,
    sequenciaDias: sequencia(d, ref),
    mediasPorArea7d: medias,
    metas: d.settings.metas,
  }
}

export class IAError extends Error {
  code: 'consent' | 'config' | 'limit' | 'net' | 'server'
  detalhe: string[]
  constructor(msg: string, code: 'consent' | 'config' | 'limit' | 'net' | 'server' = 'server', detalhe: string[] = []) {
    super(msg)
    this.code = code
    this.detalhe = detalhe
  }
}

async function chamar<T>(corpo: Record<string, unknown>): Promise<T> {
  if (!getData().settings.aiConsent) throw new IAError('Ative o uso de IA em “Mais” para continuar.', 'consent')
  let r: Response
  try {
    r = await fetch('/api/ia', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(corpo),
    })
  } catch {
    throw new IAError('Sem conexão com o servidor de IA.', 'net')
  }
  let j: any = null
  try {
    j = await r.json()
  } catch {
    /* resposta sem JSON (ex.: rodando só o Vite, sem a função) */
  }
  if (!r.ok || !j || j.erro) {
    const code = r.status === 429 ? 'limit' : j?.codigo === 'config' ? 'config' : r.status === 404 ? 'config' : 'server'
    const msg =
      r.status === 404 ? 'A IA só funciona no site publicado (ou com “vercel dev”).' : j?.erro || 'A IA não respondeu agora. Tente novamente.'
    throw new IAError(msg, code, Array.isArray(j?.detalhe) ? j.detalhe : [])
  }
  return j as T
}

export async function avaliarComIA(d: AppData): Promise<CoachReport> {
  const j = await chamar<{ relatorio: CoachReport }>({ tarefa: 'coach', resumo: resumoParaIA(d) })
  const rel = j.relatorio
  update((x) => ({ ...x, coachCache: { date: todayKey(), hash: String(rel.mensagem.length), report: rel } }))
  return rel
}

export type Msg = { role: 'user' | 'assistant'; content: string }

export async function conversarComCoach(mensagens: Msg[], d: AppData): Promise<{ resposta: string; provider?: string }> {
  return chamar({ tarefa: 'chat', mensagens: mensagens.slice(-10), resumo: resumoParaIA(d) })
}

export async function buscarCursosIA(d: AppData, fracas: Area[]): Promise<Item[]> {
  const j = await chamar<{ itens: Item[] }>({
    tarefa: 'cursos',
    areas: (fracas.length ? fracas : (['foco', 'vendas'] as Area[])).map((a) => AREA_NOME[a]),
    perfil: { area: d.businessProfile.area, produto: d.businessProfile.productName },
  })
  update((x) => ({ ...x, aiCourses: j.itens, aiCoursesAt: todayKey() }))
  return j.itens
}

export async function buscarEventosIA(d: AppData): Promise<NetworkingEvent[]> {
  const p = d.businessProfile
  const j = await chamar<{ eventos: NetworkingEvent[] }>({
    tarefa: 'eventos',
    cidade: p.city || '',
    area: p.area || '',
  })
  update((x) => ({ ...x, aiEvents: j.eventos, aiEventsAt: todayKey() }))
  return j.eventos
}

export async function roteiroIA(ev: NetworkingEvent, p: BusinessProfile): Promise<ApproachScript> {
  const j = await chamar<{ roteiro: ApproachScript }>({
    tarefa: 'roteiro',
    evento: { titulo: ev.title, local: ev.location, motivo: ev.matchReason },
    perfil: { produto: p.productName, area: p.area, publico: p.targetClientTags, dor: p.clientPain, cidade: p.city },
  })
  return j.roteiro
}

/** Atualização semanal automática dos cursos (só com consentimento e se houver registros). */
export async function atualizarCursosSeNecessario(fracas: Area[]) {
  const d = getData()
  if (!d.settings.aiConsent) return
  const ultimo = d.aiCoursesAt
  if (ultimo && keyOf(addDays(new Date(), -7)) < ultimo) return
  try {
    await buscarCursosIA(d, fracas)
  } catch {
    /* silencioso: o catálogo local continua valendo */
  }
}

/** Mensagem amigável + motivo técnico curto (ajuda a diagnosticar chave/modelo). */
export function textoErro(e: unknown, padrao: string) {
  if (!(e instanceof IAError)) return padrao
  return e.detalhe.length ? `${e.message} (${e.detalhe[0].slice(0, 140)})` : e.message
}
