import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { BottomNav } from '../components/ui'
import { Btn, Chips, Empty, Field, Sheet, SubHead } from '../components/kit'
import { dateLabel, fromKey, todayKey } from '../lib/date'
import { uid, update, useData } from '../lib/store'
import type { Appointment } from '../lib/types'

const TIPOS: { v: Appointment['type']; l: string }[] = [
  { v: 'compromisso', l: 'Compromisso' }, { v: 'networking', l: 'Networking' }, { v: 'habito', l: 'Hábito' },
]

export default function Agenda() {
  const d = useData()
  const [novo, setNovo] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [data, setData] = useState(todayKey())
  const [hora, setHora] = useState('09:00')
  const [local, setLocal] = useState('')
  const [tipo, setTipo] = useState<Appointment['type']>('compromisso')
  const hoje = todayKey()

  const futuros = d.appointments.filter((a) => a.date >= hoje).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const passados = d.appointments.filter((a) => a.date < hoje).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)).slice(0, 5)
  const grupos = futuros.reduce<Record<string, Appointment[]>>((acc, a) => ((acc[a.date] ??= []).push(a), acc), {})

  const Linha = ({ a }: { a: Appointment }) => (
    <li className="card agenda-item">
      <span className="hora">{a.time}</span>
      <span className="row__txt"><b>{a.title}</b><small>{TIPOS.find((t) => t.v === a.type)?.l}{a.location ? ` · ${a.location}` : ''}</small></span>
      <button type="button" className="icon-btn" aria-label={`Excluir ${a.title}`} onClick={() => update((x) => ({ ...x, appointments: x.appointments.filter((p) => p.id !== a.id) }))}><Trash2 size={13} strokeWidth={1.5} /></button>
    </li>
  )

  return (
    <div className="scr">
      <SubHead title="Agenda" sub="Seus compromissos" />
      <div className="scr-body">
        <button type="button" className="act" onClick={() => setNovo(true)}><Plus size={14} /> Novo compromisso</button>
        {futuros.length === 0 && <Empty>Um dia organizado começa com um compromisso claro. Adicione o primeiro.</Empty>}
        {Object.entries(grupos).map(([dia, l]) => (
          <section key={dia}>
            <b className="sec-title">{dia === hoje ? 'Hoje' : dateLabel(fromKey(dia))}</b>
            <ul className="rows" style={{ marginTop: 8 }}>{l.map((a) => <Linha key={a.id} a={a} />)}</ul>
          </section>
        ))}
        {passados.length > 0 && (
          <section>
            <b className="sec-title">Recentes</b>
            <ul className="rows" style={{ marginTop: 8 }}>{passados.map((a) => <Linha key={a.id} a={a} />)}</ul>
          </section>
        )}
      </div>
      <BottomNav />
      {novo && (
        <Sheet title="Novo compromisso" onClose={() => setNovo(false)}>
          <Field label="Título" text value={titulo} onChange={setTitulo} placeholder="Ex.: Reunião com cliente" />
          <div className="grid2">
            <Field label="Data" type="date" value={data} onChange={setData} />
            <Field label="Hora" type="time" value={hora} onChange={setHora} />
          </div>
          <Field label="Local (opcional)" text value={local} onChange={setLocal} />
          <Chips value={tipo} onChange={setTipo} options={TIPOS} />
          <Btn
            disabled={!titulo.trim() || !data || !hora}
            onClick={() => {
              update((x) => ({ ...x, appointments: [...x.appointments, { id: uid('a'), title: titulo.trim(), date: data, time: hora, location: local.trim() || undefined, type: tipo }] }))
              setTitulo(''); setLocal(''); setNovo(false)
            }}
          >Salvar</Btn>
        </Sheet>
      )}
    </div>
  )
}
