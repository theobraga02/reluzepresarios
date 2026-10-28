import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Bookmark, BookOpen, ExternalLink, GraduationCap, Globe, PlayCircle, Sparkles } from 'lucide-react'
import { BottomNav } from '../components/ui'
import { Btn } from '../components/kit'
import { CATALOGO, TIPO_NOME, TRILHAS } from '../lib/conteudo'
import { relatorioLocal } from '../lib/coach'
import { atualizarCursosSeNecessario, buscarCursosIA, IAError, textoErro } from '../lib/ia'
import { setConsent, update, useData } from '../lib/store'
import type { Area, Item, Tipo } from '../lib/types'

type Aba = 'curso' | 'livro' | 'video' | 'trilha'
const ABAS: { k: Aba; label: string }[] = [
  { k: 'curso', label: 'Cursos' },
  { k: 'livro', label: 'Livros' },
  { k: 'video', label: 'Vídeos' },
  { k: 'trilha', label: 'Trilhas' },
]

const TIPO_ICON: Record<Tipo, typeof BookOpen> = { curso: GraduationCap, livro: BookOpen, video: PlayCircle, plataforma: Globe }
const TONS = ['#2a2a2e', '#332c28', '#26302b', '#2b2833', '#33282b', '#28303a', '#2f2f26']

function Linha({ item, i, salvo, onSalvar }: { item: Item; i: number; salvo: boolean; onSalvar?: () => void }) {
  const Icon = TIPO_ICON[item.tipo]
  const corpo = (
    <>
      <span className="capa" style={{ background: `linear-gradient(145deg, ${TONS[i % TONS.length]}, #131314)` }}>
        <Icon size={18} strokeWidth={1.4} />
      </span>
      <span className="learn__txt">
        <small>
          {TIPO_NOME[item.tipo]}
          {item.fonte === 'ia' ? ' · IA' : ''}
          {item.exemplo ? ' · exemplo' : ''}
          {item.verificadoEm ? ' · link verificado' : ''}
        </small>
        <b>{item.titulo}</b>
        <small>{item.meta}</small>
        {item.motivo && <small className="why">{item.motivo}</small>}
      </span>
    </>
  )
  return (
    <li className="learn">
      {item.url ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="learn__main" aria-label={`${item.titulo} (abre em nova aba)`}>
          {corpo}
          <ExternalLink size={12} className="learn__ext" />
        </a>
      ) : (
        <div className="learn__main">{corpo}</div>
      )}
      {onSalvar && (
        <button type="button" className={`icon-btn ${salvo ? 'saved' : ''}`} aria-pressed={salvo} aria-label={salvo ? 'Remover dos salvos' : 'Salvar'} onClick={onSalvar}>
          <Bookmark size={14} strokeWidth={1.6} fill={salvo ? 'currentColor' : 'none'} />
        </button>
      )}
    </li>
  )
}

export default function Aprender({ preview = false }: { preview?: boolean }) {
  const d = useData()
  const [aba, setAba] = useState<Aba>('curso')
  const [buscando, setBuscando] = useState(false)
  const [aviso, setAviso] = useState('')

  const rel = useMemo(() => relatorioLocal(d), [d])
  const fracas: Area[] = rel.areas ?? []

  // Atualização semanal automática (só com consentimento e depois de ter registros).
  useEffect(() => {
    if (preview || !rel.temDados) return
    void atualizarCursosSeNecessario(fracas)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, rel.temDados])

  const peso = (it: Item) => {
    const i = fracas.indexOf(it.area)
    return i < 0 ? 99 : i
  }
  const ordenar = (l: Item[]) => (fracas.length ? [...l].sort((a, b) => peso(a) - peso(b)) : l)

  const tipoDaAba: Tipo[] = aba === 'curso' ? ['curso', 'plataforma'] : aba === 'livro' ? ['livro'] : ['video']
  const lista = ordenar(
    [...(aba === 'curso' ? d.aiCourses : []), ...CATALOGO.filter((c) => tipoDaAba.includes(c.tipo))],
  )
  const salvos = new Set(d.savedCourses)
  const trocar = (id: string) =>
    update((x) => ({ ...x, savedCourses: x.savedCourses.includes(id) ? x.savedCourses.filter((s) => s !== id) : [...x.savedCourses, id] }))
  const todosSalvos = [...d.aiCourses, ...CATALOGO].filter((i) => salvos.has(i.id))

  async function buscar() {
    setAviso('')
    setBuscando(true)
    try {
      const itens = await buscarCursosIA(d, fracas)
      setAviso(itens.length ? `${itens.length} cursos novos, com link verificado.` : 'Nenhum curso confiável encontrado agora. Tente mais tarde.')
    } catch (e) {
      setAviso(textoErro(e, 'Não foi possível buscar agora.'))
    } finally {
      setBuscando(false)
    }
  }

  return (
    <div className="scr">
      <header className="scr-head">
        <h2>Aprender</h2>
        <Link to="/app/mais" className="icon-btn" aria-label="Mais opções"><Bell size={15} strokeWidth={1.6} /></Link>
      </header>
      <div className="scr-body">
        <div className="seg" role="tablist">
          {ABAS.map((a) => (
            <button key={a.k} type="button" role="tab" aria-selected={aba === a.k} className={aba === a.k ? 'on' : ''} onClick={() => setAba(a.k)}>
              {a.label}
            </button>
          ))}
        </div>

        {aba === 'trilha' ? (
          <ul className="rows">
            {TRILHAS.map((t) => {
              const sem = Math.min(t.totalWeeks, d.trilhas[t.id] ?? 1)
              const fim = (d.trilhas[t.id] ?? 1) > t.totalWeeks
              return (
                <li key={t.id} className="card trilha">
                  <b>{t.title}</b>
                  <small>{fim ? 'Concluída' : `Semana ${sem} de ${t.totalWeeks}`}</small>
                  <div className="bar"><i style={{ width: `${(fim ? t.totalWeeks : sem - 1) / t.totalWeeks * 100}%` }} /></div>
                  {!fim && <p>{t.practices[sem - 1]}</p>}
                  {!preview && (
                    <Btn kind="ghost" onClick={() => update((x) => ({ ...x, trilhas: { ...x.trilhas, [t.id]: (x.trilhas[t.id] ?? 1) + 1 } }))} disabled={fim}>
                      {fim ? 'Trilha concluída' : 'Concluir semana'}
                    </Btn>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <>
            {aba === 'curso' && !preview && (
              <div className="card ia-box">
                <span className="chip-ic"><Sparkles size={13} strokeWidth={1.7} /></span>
                <div>
                  <b>Cursos gratuitos com IA</b>
                  <p>{d.aiCoursesAt ? `Atualizado em ${d.aiCoursesAt.split('-').reverse().join('/')}.` : 'A IA pesquisa na web e só mostra links que abrem de verdade.'}</p>
                  {d.settings.aiConsent ? (
                    <Btn kind="ghost" onClick={buscar} disabled={buscando}>{buscando ? 'Buscando…' : 'Buscar agora'}</Btn>
                  ) : (
                    <Btn kind="ghost" onClick={() => setConsent(true)}>Ativar IA</Btn>
                  )}
                  {aviso && <small className="aviso" role="status">{aviso}</small>}
                </div>
              </div>
            )}

            {todosSalvos.length > 0 && aba === 'curso' && (
              <>
                <b className="sec-title">Salvos</b>
                <ul className="learn-list">{todosSalvos.map((it, i) => <Linha key={it.id} item={it} i={i} salvo onSalvar={() => trocar(it.id)} />)}</ul>
              </>
            )}

            <b className="sec-title">{fracas.length ? 'Recomendado para você' : 'Para começar'}</b>
            <ul className="learn-list">
              {lista.map((it, i) => <Linha key={it.id} item={it} i={i} salvo={salvos.has(it.id)} onSalvar={preview ? undefined : () => trocar(it.id)} />)}
            </ul>
            <p className="fine">Livros são obras reais. Itens “exemplo” são sugestões: confira a oferta no site indicado.</p>
          </>
        )}
      </div>
      <BottomNav active="aprender" />
    </div>
  )
}
