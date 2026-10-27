import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, BookOpen, CalendarClock, CircleCheck, Flame, Megaphone, Quote, Trophy } from 'lucide-react'
import { Sheet } from './kit'
import { dayOfYear, todayKey } from '../lib/date'
import { sequencia } from '../lib/score'
import { useData } from '../lib/store'
import { VERSICULOS } from '../lib/conteudo'
import { carregarAvisos, type Aviso } from '../lib/nuvem-admin'
import { FRASES } from '../lib/motivacao'

type Item = { id: string; icone: typeof Bell; titulo: string; texto: string; to?: string }
const LS = 'empresario:notif'
const lido = () => { try { return localStorage.getItem(LS) ?? '' } catch { return '' } }

/** Central de notificações do dia: sino com contador + lista. */
export function Sino() {
  const d = useData()
  const [aberto, setAberto] = useState(false)
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [visto, setVisto] = useState(lido())
  const key = todayKey()
  useEffect(() => { void carregarAvisos().then(setAvisos).catch(() => {}) }, [])

  const itens = useMemo<Item[]>(() => {
    const l: Item[] = []
    const hoje = new Date()
    const pend = d.habits.filter((h) => !(d.habitLog[key] ?? []).includes(h.id))
    const seq = sequencia(d)
    const hora = hoje.getHours()
    if (pend.length > 0) l.push({ id: 'hab', icone: CircleCheck, titulo: `${pend.length} ${pend.length === 1 ? 'hábito falta' : 'hábitos faltam'} hoje`, texto: pend.slice(0, 3).map((h) => h.title).join(', ') + (pend.length > 3 ? '…' : ''), to: '/app' })
    else if (d.habits.length) l.push({ id: 'hab-ok', icone: Trophy, titulo: 'Todos os hábitos concluídos', texto: 'Dia fechado com chave de ouro.' })
    if (seq > 0 && pend.length > 0 && hora >= 18) l.push({ id: 'seq', icone: Flame, titulo: `Sua sequência de ${seq} ${seq === 1 ? 'dia' : 'dias'} está em risco`, texto: 'Conclua pelo menos um hábito antes de dormir.', to: '/app' })
    for (const a of d.appointments.filter((x) => x.date === key).sort((x, y) => x.time.localeCompare(y.time))) l.push({ id: 'ag' + a.id, icone: CalendarClock, titulo: `${a.time} · ${a.title}`, texto: 'Compromisso de hoje', to: '/app/agenda' })
    const v = VERSICULOS[dayOfYear(hoje) % VERSICULOS.length]
    l.push({ id: 'ver', icone: BookOpen, titulo: `Versículo do dia · ${v.referencia}`, texto: v.texto, to: '/app/biblia' })
    l.push({ id: 'fr', icone: Quote, titulo: 'Para o seu dia', texto: FRASES[dayOfYear(hoje) % FRASES.length] })
    for (const a of avisos) l.push({ id: 'av' + a.id, icone: Megaphone, titulo: a.titulo, texto: a.texto, to: a.link && (a.link.startsWith('/') || a.link.startsWith('https://')) ? a.link : undefined })
    return l
  }, [d, avisos, key])

  const marca = key + ':' + itens.length
  const novo = visto !== marca ? itens.length : 0
  const abrir = () => { setAberto(true); try { localStorage.setItem(LS, marca) } catch { /* ignora */ } setVisto(marca) }

  return (
    <>
      <button type="button" className="icon-btn sino" aria-label={novo ? `Notificações, ${novo} novas` : 'Notificações'} onClick={abrir}>
        <Bell size={16} strokeWidth={1.6} />
        {novo > 0 && <i>{novo > 9 ? '9+' : novo}</i>}
      </button>
      {aberto && (
        <Sheet title="Notificações de hoje" onClose={() => setAberto(false)}>
          <ul className="notif">
            {itens.map((i) => {
              const c = (<><span className="notif__ic"><i.icone size={16} strokeWidth={1.6} /></span><span className="row__txt"><b>{i.titulo}</b><small>{i.texto}</small></span></>)
              return <li key={i.id}>{i.to ? (i.to.startsWith('/') ? <Link to={i.to} onClick={() => setAberto(false)}>{c}</Link> : <a href={i.to} target="_blank" rel="noreferrer noopener">{c}</a>) : <div>{c}</div>}</li>
            })}
          </ul>
        </Sheet>
      )}
    </>
  )
}
