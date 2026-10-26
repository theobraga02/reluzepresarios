import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight, Minus, Plus, Search } from 'lucide-react'
import { BottomNav } from '../components/ui'
import { Btn, Empty, SubHead } from '../components/kit'
import { AT, type Achado, buscar, carregarLivro, livroPorCode, LIVROS, NT } from '../lib/biblia'
import { todayKey } from '../lib/date'
import { addRecord, uid, update, useData } from '../lib/store'

const TAM_KEY = 'empresario:biblia:tam'
const getTam = () => {
  try { return Number(localStorage.getItem(TAM_KEY)) || 16 } catch { return 16 }
}

function Leitor({ code, cap }: { code: string; cap: number }) {
  const d = useData()
  const nav = useNavigate()
  const livro = livroPorCode(code)!
  const [caps, setCaps] = useState<string[][] | null>(null)
  const [erro, setErro] = useState(false)
  const [tam, setTam] = useState(getTam)
  const [lido, setLido] = useState(false)
  const marcados = useMemo(() => new Set(d.leitor.marcados), [d.leitor.marcados])

  useEffect(() => {
    let vivo = true
    setCaps(null); setErro(false); setLido(false)
    carregarLivro(code).then((c) => vivo && setCaps(c)).catch(() => vivo && setErro(true))
    update((x) => ({ ...x, leitor: { ...x.leitor, last: { livro: code, cap } } }))
    window.scrollTo(0, 0)
    return () => { vivo = false }
  }, [code, cap])

  const ant = cap > 1 ? { code, cap: cap - 1 } : (() => { const i = LIVROS.findIndex((l) => l.code === code); return i > 0 ? { code: LIVROS[i - 1].code, cap: LIVROS[i - 1].caps } : null })()
  const prox = cap < livro.caps ? { code, cap: cap + 1 } : (() => { const i = LIVROS.findIndex((l) => l.code === code); return i < LIVROS.length - 1 ? { code: LIVROS[i + 1].code, cap: 1 } : null })()
  const ir = (p: { code: string; cap: number } | null) => p && nav(`/app/biblia/${p.code}/${p.cap}`)
  const mudaTam = (n: number) => { const v = Math.min(26, Math.max(13, n)); setTam(v); try { localStorage.setItem(TAM_KEY, String(v)) } catch { /* ignora */ } }
  const jaRegistrado = lido || d.bibleRecords.some((r) => r.date === todayKey() && r.book === livro.nome && r.chapter === cap)
  const toggle = (v: number) => {
    const k = `${code}.${cap}.${v}`
    update((x) => ({ ...x, leitor: { ...x.leitor, marcados: x.leitor.marcados.includes(k) ? x.leitor.marcados.filter((m) => m !== k) : [...x.leitor.marcados, k] } }))
    if (navigator.vibrate) navigator.vibrate(8)
  }

  return (
    <div className="scr">
      <SubHead title={`${livro.nome} ${cap}`} sub="Almeida 1911" back="/app/biblia" />
      <div className="scr-body leitor">
        <div className="leitor__tools">
          <button type="button" className="icon-btn" aria-label="Diminuir letra" onClick={() => mudaTam(tam - 1)}><Minus size={14} /></button>
          <span>Aa</span>
          <button type="button" className="icon-btn" aria-label="Aumentar letra" onClick={() => mudaTam(tam + 1)}><Plus size={14} /></button>
        </div>
        {!caps && !erro && <p className="empty">Carregando…</p>}
        {erro && <p className="aviso" role="alert">Não consegui carregar este livro. Verifique a internet e tente de novo.</p>}
        {caps && (
          <article className="texto" style={{ fontSize: tam }}>
            {(caps[cap - 1] ?? []).map((t, i) => {
              const on = marcados.has(`${code}.${cap}.${i + 1}`)
              return (
                <p key={i} className={on ? 'mk' : ''} onClick={() => toggle(i + 1)}>
                  <sup>{i + 1}</sup>{t}
                </p>
              )
            })}
          </article>
        )}
        {caps && (
          <Btn
            disabled={jaRegistrado}
            onClick={() => {
              addRecord('bibleRecords', { id: uid(), date: todayKey(), plan: 'Leitura livre', book: livro.nome, chapter: cap }, 'biblia')
              setLido(true)
              void import('../lib/efeitos').then((m) => m.confete())
            }}
          >
            <Check size={14} /> {jaRegistrado ? 'Capítulo registrado hoje' : 'Marcar como lido'}
          </Btn>
        )}
        <div className="grid2">
          <button type="button" className="act" disabled={!ant} onClick={() => ir(ant)}><ChevronLeft size={14} /> Anterior</button>
          <button type="button" className="act" disabled={!prox} onClick={() => ir(prox)}>Próximo <ChevronRight size={14} /></button>
        </div>
        <p className="fine">Toque num versículo para marcar. Texto em domínio público.</p>
      </div>
      <BottomNav />
    </div>
  )
}

function Indice() {
  const d = useData()
  const nav = useNavigate()
  const [aba, setAba] = useState<'AT' | 'NT'>('AT')
  const [livro, setLivro] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [res, setRes] = useState<Achado[] | null>(null)
  const [prog, setProg] = useState(0)
  const [buscando, setBuscando] = useState(false)
  const last = d.leitor.last
  const lv = last && LIVROS.find((l) => l.code === last.livro)
  const sab = LIVROS.find((l) => l.code === 'PRO')!
  const diaMes = new Date().getDate()
  const lista = aba === 'AT' ? AT : NT
  const sel = livro ? LIVROS.find((l) => l.code === livro)! : null

  async function pesquisar() {
    setBuscando(true); setProg(0)
    try { setRes(await buscar(q, 60, setProg)) } catch { setRes([]) } finally { setBuscando(false) }
  }

  return (
    <div className="scr">
      <SubHead title="Bíblia" sub="Almeida 1911 · 66 livros" back="/app/mais" />
      <div className="scr-body">
        <form className="buscabar" onSubmit={(e) => { e.preventDefault(); void pesquisar() }}>
          <Search size={14} />
          <input value={q} onChange={(e) => { setQ(e.target.value); if (!e.target.value) setRes(null) }} placeholder="Buscar palavra ou frase…" aria-label="Buscar na Bíblia" />
        </form>
        {buscando && <div className="bar"><i style={{ width: `${prog * 100}%` }} /></div>}

        {res ? (
          <>
            <b className="sec-title">{res.length ? `${res.length}${res.length >= 60 ? '+' : ''} resultados` : 'Nada encontrado'}</b>
            <ul className="rows">
              {res.map((r) => (
                <li key={`${r.code}${r.cap}${r.v}`} className="card">
                  <Link to={`/app/biblia/${r.code}/${r.cap}`} className="achado">
                    <b>{r.nome} {r.cap}:{r.v}</b>
                    <span>{r.texto}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            {lv && last && (
              <Link to={`/app/biblia/${last.livro}/${last.cap}`} className="card continuar">
                <small>Continuar de onde parou</small>
                <b>{lv.nome} {last.cap}</b>
              </Link>
            )}
            <Link to={`/app/biblia/PRO/${diaMes <= sab.caps ? diaMes : sab.caps}`} className="card continuar">
              <small>Plano de Sabedoria · hoje</small>
              <b>Provérbios {diaMes <= sab.caps ? diaMes : sab.caps}</b>
            </Link>

            <div className="seg" role="tablist">
              <button type="button" role="tab" aria-selected={aba === 'AT'} className={aba === 'AT' ? 'on' : ''} onClick={() => { setAba('AT'); setLivro(null) }}>Antigo Testamento</button>
              <button type="button" role="tab" aria-selected={aba === 'NT'} className={aba === 'NT' ? 'on' : ''} onClick={() => { setAba('NT'); setLivro(null) }}>Novo Testamento</button>
            </div>

            {sel ? (
              <>
                <div className="sec-row"><b className="sec-title">{sel.nome}</b><button type="button" className="mini-act" style={{ color: 'inherit' }} onClick={() => setLivro(null)}>Voltar aos livros</button></div>
                <div className="capgrid">
                  {Array.from({ length: sel.caps }, (_, i) => (
                    <button key={i} type="button" onClick={() => nav(`/app/biblia/${sel.code}/${i + 1}`)}>{i + 1}</button>
                  ))}
                </div>
              </>
            ) : (
              <div className="livrogrid">
                {lista.map((l) => (
                  <button key={l.code} type="button" onClick={() => (l.caps === 1 ? nav(`/app/biblia/${l.code}/1`) : setLivro(l.code))}>
                    <b>{l.abrev}</b><small>{l.nome}</small>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        {res && res.length === 0 && !buscando && <Empty>Tente outra palavra (a ortografia é a de 1911, ex.: “Deus”, “amor”, “fé”).</Empty>}
      </div>
      <BottomNav />
    </div>
  )
}

export default function Biblia() {
  const { livro, cap } = useParams()
  const l = livro ? livroPorCode(livro) : undefined
  const n = Number(cap)
  if (l && Number.isInteger(n) && n >= 1 && n <= l.caps) return <Leitor code={l.code} cap={n} />
  return <Indice />
}
