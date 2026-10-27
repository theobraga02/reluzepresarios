import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { concluirOnboarding } from '../components/Porteiro'
import { useCloud } from '../lib/cloud'
import { confete } from '../lib/efeitos'
import { Check, Plus, Search, Sparkles } from 'lucide-react'
import { BottomNav } from '../components/ui'
import { NovoHabito } from '../components/NovoHabito'
import { SubHead } from '../components/kit'
import { CATEGORIAS, type CatId, type HabitoCatalogo } from '../lib/catalogo-habitos'
import { useCatalogo } from '../lib/catalogo'
import { relatorioLocal } from '../lib/coach'
import { HABIT_TO_AREA } from '../lib/defaults'
import { vibrar } from '../lib/efeitos'
import { addHabit, removeHabit, useData } from '../lib/store'

const norm = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

export default function Habitos() {
  const d = useData()
  const nav = useNavigate()
  const cloud = useCloud()
  const inicio = useLocation().search.includes('inicio=1')
  const catalogo = useCatalogo()
  const [cat, setCat] = useState<CatId | 'todos'>('todos')
  const [q, setQ] = useState('')
  const [novo, setNovo] = useState(false)
  const ativos = new Set(d.habits.map((h) => h.id))
  const titulos = new Set(d.habits.map((h) => norm(h.title)))
  const tem = (h: HabitoCatalogo) => ativos.has(h.id) || titulos.has(norm(h.titulo))

  const fracas = useMemo(() => relatorioLocal(d).areas ?? [], [d])
  const sugeridos = useMemo(
    () =>
      catalogo
        .filter((h) => !tem(h) && fracas.some((a) => HABIT_TO_AREA[h.area] === a))
        .slice(0, 4),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [catalogo, fracas, d.habits],
  )

  const lista = catalogo.filter((h) => (cat === 'todos' || h.cat === cat) && (!q || norm(`${h.titulo} ${h.dica}`).includes(norm(q))))

  const alternar = (h: HabitoCatalogo) => {
    vibrar(10)
    if (tem(h)) {
      const alvo = d.habits.find((x) => x.id === h.id || norm(x.title) === norm(h.titulo))
      if (alvo) removeHabit(alvo.id)
    } else {
      addHabit({ id: h.id, title: h.titulo, area: h.area, icon: h.icone, target: h.meta, unit: h.unidade })
    }
  }

  const Card = ({ h }: { h: HabitoCatalogo }) => {
    const on = tem(h)
    return (
      <li className={`card hab ${on ? 'on' : ''}`}>
        <span className="hab__ic">{h.icone}</span>
        <span className="hab__txt">
          <b>{h.titulo}</b>
          <small>{h.dica}</small>
          {h.meta && <em>Meta sugerida: {h.meta.toLocaleString('pt-BR')}{h.unidade ? ` ${h.unidade}` : ''}</em>}
        </span>
        <button type="button" className="hab__add" aria-pressed={on} aria-label={`${on ? 'Remover' : 'Adicionar'}: ${h.titulo}`} onClick={() => alternar(h)}>
          {on ? <Check size={16} strokeWidth={2.4} /> : <Plus size={16} strokeWidth={2} />}
        </button>
      </li>
    )
  }

  return (
    <div className="scr">
      {inicio && (
        <div className="card onb">
          <b>Bem-vindo! Escolha seus hábitos</b>
          <p className="fine">Toque no + dos hábitos que quer acompanhar. Você pode mudar depois.</p>
          <button type="button" className="kbtn kbtn--main" disabled={d.habits.length === 0} onClick={() => { concluirOnboarding(cloud.uid); void confete(true); nav('/app', { replace: true }) }}>{d.habits.length === 0 ? 'Escolha pelo menos 1 hábito' : `Concluir com ${d.habits.length} ${d.habits.length === 1 ? 'hábito' : 'hábitos'}`}</button>
        </div>
      )}
      <SubHead title="Escolher hábitos" sub={`${d.habits.length} ativos · ${catalogo.length} ideias`} back="/app" />
      <div className="scr-body">
        <form className="buscabar" onSubmit={(e) => e.preventDefault()}>
          <Search size={14} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar hábito…" aria-label="Buscar hábito" />
        </form>
        <div className="chips chips--scroll" role="tablist" aria-label="Categorias">
          <button type="button" role="tab" aria-selected={cat === 'todos'} className={cat === 'todos' ? 'on' : ''} onClick={() => setCat('todos')}>Todos</button>
          {CATEGORIAS.map((c) => (
            <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} className={cat === c.id ? 'on' : ''} onClick={() => setCat(c.id)}>{c.icone} {c.nome}</button>
          ))}
        </div>
        <button type="button" className="act" onClick={() => setNovo(true)}><Plus size={14} /> Criar um hábito meu</button>

        {sugeridos.length > 0 && cat === 'todos' && !q && (
          <>
            <b className="sec-title"><Sparkles size={12} /> Sugeridos para você</b>
            <ul className="rows">{sugeridos.map((h) => <Card key={h.id} h={h} />)}</ul>
          </>
        )}
        <b className="sec-title">{lista.length} {lista.length === 1 ? 'hábito' : 'hábitos'}</b>
        <ul className="rows">{lista.map((h) => <Card key={h.id} h={h} />)}</ul>
        {lista.length === 0 && <p className="empty">Nenhum hábito encontrado. Que tal criar o seu?</p>}
        <p className="fine">Comece com poucos (3 a 5) e aumente aos poucos. As ideias são gerais e não substituem orientação médica.</p>
      </div>
      <BottomNav active="hoje" />
      {novo && <NovoHabito onClose={() => setNovo(false)} />}
    </div>
  )
}
