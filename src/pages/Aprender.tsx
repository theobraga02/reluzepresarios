import { useMemo, useState } from 'react'
import { Bell, BookOpen, GraduationCap, PlayCircle } from 'lucide-react'
import { BottomNav } from '../components/ui'
import { CONTEUDO, type Item, TIPO_NOME, type Tipo } from '../lib/conteudo'
import { todayKey } from '../lib/date'
import { AREAS, scoreLog } from '../lib/model'
import { useStore } from '../lib/store'

const ABAS: { k: Tipo; label: string }[] = [
  { k: 'curso', label: 'Cursos' },
  { k: 'livro', label: 'Livros' },
  { k: 'video', label: 'Vídeos' },
]

const TIPO_ICON = { curso: GraduationCap, livro: BookOpen, video: PlayCircle }
const TONS = ['#2a2a2e', '#332c28', '#26302b', '#2b2833', '#33282b', '#28303a', '#2f2f26']

function Capa({ item, i }: { item: Item; i: number }) {
  const Icon = TIPO_ICON[item.tipo]
  return (
    <span className="capa" style={{ background: `linear-gradient(145deg, ${TONS[i % TONS.length]}, #131314)` }}>
      <Icon size={18} strokeWidth={1.4} />
    </span>
  )
}

function Linha({ item, i }: { item: Item; i: number }) {
  return (
    <li className="learn">
      <Capa item={item} i={i} />
      <span className="learn__txt">
        <small>{TIPO_NOME[item.tipo]}{item.exemplo ? ' · exemplo' : ''}</small>
        <b>{item.titulo}</b>
        <small>{item.meta}</small>
      </span>
    </li>
  )
}

export default function Aprender({ preview = false }: { preview?: boolean }) {
  const st = useStore()
  const [aba, setAba] = useState<Tipo>('curso')

  const lista = useMemo(() => {
    const key = todayKey()
    const sc = st.logs[key] && !preview ? scoreLog(st.logs[key], st.habitos.length) : null
    // Sem registro hoje: ordem original. Com registro: áreas com menor nota primeiro.
    const peso = (it: Item) => (sc ? sc[it.area] : AREAS.indexOf(it.area))
    const base = CONTEUDO.filter((c) => c.tipo === aba)
    return sc ? [...base].sort((a, b) => peso(a) - peso(b)) : base
  }, [aba, st.logs, st.habitos.length, preview])

  const rec = lista.slice(0, 3)
  const perfil = lista.slice(3, 5)

  return (
    <div className="scr">
      <header className="scr-head">
        <h2>Aprender</h2>
        <span className="icon-btn" aria-hidden><Bell size={15} strokeWidth={1.6} /></span>
      </header>
      <div className="scr-body">
        <div className="seg" role="tablist">
          {ABAS.map((a) => (
            <button key={a.k} type="button" role="tab" aria-selected={aba === a.k} className={aba === a.k ? 'on' : ''} onClick={() => setAba(a.k)}>
              {a.label}
            </button>
          ))}
        </div>

        <b className="sec-title">Recomendado para você</b>
        <ul className="learn-list">{rec.map((it, i) => <Linha key={it.id} item={it} i={i} />)}</ul>

        {perfil.length > 0 && (
          <>
            <div className="sec-row"><b className="sec-title">Baseado no seu perfil</b><small>Ver todos</small></div>
            <ul className="learn-list">{perfil.map((it, i) => <Linha key={it.id} item={it} i={i + 3} />)}</ul>
          </>
        )}
        <p className="fine">Livros são obras reais. Itens marcados “exemplo” são sugestões ilustrativas, sem link.</p>
      </div>
      <BottomNav active="aprender" />
    </div>
  )
}
