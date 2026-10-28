import { useMemo, useState } from 'react'
import { CalendarPlus, Check, ExternalLink, Lightbulb, Plus, Sparkles, Trash2 } from 'lucide-react'
import { BottomNav } from '../components/ui'
import { Btn, Empty, Field, Sheet, SubHead } from '../components/kit'
import { DICAS_NETWORKING, eventosExemplo, roteiroLocal } from '../lib/conteudo'
import { dateLabel, dayOfYear, fromKey, todayKey } from '../lib/date'
import { buscarEventosIA, IAError, textoErro, roteiroIA } from '../lib/ia'
import { setConsent, uid, update, useData } from '../lib/store'
import type { ApproachScript, NetworkingEvent } from '../lib/types'

function Evento({ ev }: { ev: NetworkingEvent }) {
  const d = useData()
  const [aberto, setAberto] = useState(false)
  const [rot, setRot] = useState<ApproachScript | null>(null)
  const [msg, setMsg] = useState('')
  const [carregando, setCarregando] = useState(false)
  const agendado = d.appointments.some((a) => a.title === ev.title && a.date === ev.date)

  async function iaRoteiro() {
    setCarregando(true)
    setMsg('')
    try {
      setRot(await roteiroIA(ev, d.businessProfile))
    } catch (e) {
      setMsg(textoErro(e, 'Não foi possível gerar agora.'))
    } finally {
      setCarregando(false)
    }
  }

  const script = rot ?? roteiroLocal(ev, d.businessProfile)
  return (
    <li className="card evento">
      <small className="fine">
        {ev.isExample ? 'Exemplo ilustrativo' : ev.verifiedAt ? 'Link verificado' : ''}
        {ev.isExample || ev.verifiedAt ? ' · ' : ''}
        {ev.priceType === 'gratuito' ? 'Gratuito' : `Pago${ev.price ? ' · ' + ev.price : ''}`} · {ev.isOnline ? 'Online' : ev.city}
      </small>
      <b>{ev.title}</b>
      <small>{ev.date ? dateLabel(fromKey(ev.date)) : 'Data a confirmar'}{ev.time ? ` · ${ev.time}` : ''} · {ev.location}</small>
      <p>{ev.matchReason}</p>
      <div className="evento__acoes">
        <a className="kbtn kbtn--ghost" href={ev.sourceUrl} target="_blank" rel="noopener noreferrer">{ev.sourceName} <ExternalLink size={12} /></a>
        <button type="button" className="kbtn kbtn--ghost" onClick={() => setAberto(!aberto)}>Roteiro</button>
        <button
          type="button" className="kbtn kbtn--ghost" disabled={agendado || !ev.date}
          onClick={() => update((x) => ({ ...x, appointments: [...x.appointments, { id: uid('a'), title: ev.title, date: ev.date, time: ev.time || '19:00', location: ev.location, type: 'networking' }] }))}
        >
          <CalendarPlus size={12} /> {agendado ? 'Na agenda' : 'Agendar'}
        </button>
      </div>
      {aberto && (
        <div className="roteiro">
          <small className="fine">{rot ? `Gerado por IA${rot.provider ? ' (' + rot.provider + ')' : ''}` : 'Modelo pronto — personalize com seu perfil em “Meu negócio”.'}</small>
          <b>Abertura</b><p>{script.openingPhrase}</p>
          <b>Perguntas</b>
          <ol>{script.questions.map((q) => <li key={q}>{q}</li>)}</ol>
          <b>Pedir o próximo passo</b><p>{script.followUpRequest}</p>
          {d.settings.aiConsent && <Btn kind="ghost" onClick={iaRoteiro} disabled={carregando}><Sparkles size={13} /> {carregando ? 'Gerando…' : 'Gerar com IA'}</Btn>}
          {msg && <p className="aviso" role="alert">{msg}</p>}
        </div>
      )}
    </li>
  )
}

export default function Rede() {
  const d = useData()
  const [aba, setAba] = useState<'eventos' | 'contatos'>('eventos')
  const [buscando, setBuscando] = useState(false)
  const [aviso, setAviso] = useState('')
  const [novo, setNovo] = useState(false)
  const [nome, setNome] = useState('')
  const [onde, setOnde] = useState('')
  const [notas, setNotas] = useState('')
  const exemplos = useMemo(eventosExemplo, [])
  const eventos = d.aiEvents.length ? d.aiEvents : exemplos
  const dica = DICAS_NETWORKING[dayOfYear(new Date()) % DICAS_NETWORKING.length]

  async function buscar() {
    setAviso('')
    setBuscando(true)
    try {
      const l = await buscarEventosIA(d)
      setAviso(l.length ? `${l.length} eventos encontrados, com link verificado.` : 'Nenhum evento confiável encontrado agora.')
    } catch (e) {
      setAviso(textoErro(e, 'Não foi possível buscar agora.'))
    } finally {
      setBuscando(false)
    }
  }

  return (
    <div className="scr">
      <SubHead title="Rede" sub="Eventos e contatos" />
      <div className="scr-body">
        <div className="seg" role="tablist">
          <button type="button" role="tab" aria-selected={aba === 'eventos'} className={aba === 'eventos' ? 'on' : ''} onClick={() => setAba('eventos')}>Eventos</button>
          <button type="button" role="tab" aria-selected={aba === 'contatos'} className={aba === 'contatos' ? 'on' : ''} onClick={() => setAba('contatos')}>Contatos</button>
        </div>
        <p className="card dica"><Lightbulb size={14} strokeWidth={1.6} /> {dica}</p>

        {aba === 'eventos' ? (
          <>
            {d.settings.aiConsent ? (
              <Btn kind="ghost" onClick={buscar} disabled={buscando}><Sparkles size={13} /> {buscando ? 'Buscando…' : 'Buscar eventos reais com IA'}</Btn>
            ) : (
              <Btn kind="ghost" onClick={() => setConsent(true)}><Sparkles size={13} /> Ativar IA para buscar eventos reais</Btn>
            )}
            {aviso && <p className="aviso" role="status">{aviso}</p>}
            {!d.businessProfile.city && <p className="fine">Dica: informe sua cidade em “Meu negócio” para a busca ficar local.</p>}
            <ul className="rows">{eventos.map((e) => <Evento key={e.id} ev={e} />)}</ul>
          </>
        ) : (
          <>
            <button type="button" className="act" onClick={() => setNovo(true)}><Plus size={14} /> Novo contato</button>
            {d.networkingContacts.length === 0 && <Empty>Anote quem você conhece nos eventos e lembre de fazer o follow-up em 48h.</Empty>}
            <ul className="rows">
              {d.networkingContacts.map((c) => (
                <li key={c.id} className="card agenda-item">
                  <button type="button" className={`row__mark ${c.followUpDone ? 'on' : ''}`} aria-pressed={c.followUpDone} aria-label={`Follow-up feito com ${c.name}`} onClick={() => update((x) => ({ ...x, networkingContacts: x.networkingContacts.map((y) => (y.id === c.id ? { ...y, followUpDone: !y.followUpDone } : y)) }))}>
                    {c.followUpDone && <Check size={11} strokeWidth={3} />}
                  </button>
                  <span className="row__txt"><b>{c.name}</b><small>{c.eventName ? `${c.eventName} · ` : ''}{c.metAt}{c.notes ? ` · ${c.notes}` : ''}</small></span>
                  <button type="button" className="icon-btn" aria-label={`Excluir ${c.name}`} onClick={() => update((x) => ({ ...x, networkingContacts: x.networkingContacts.filter((y) => y.id !== c.id) }))}><Trash2 size={13} strokeWidth={1.5} /></button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <BottomNav />
      {novo && (
        <Sheet title="Novo contato" onClose={() => setNovo(false)}>
          <Field label="Nome" text value={nome} onChange={setNome} />
          <Field label="Onde conheceu" text value={onde} onChange={setOnde} />
          <Field label="Observações" text multiline value={notas} onChange={setNotas} />
          <Btn disabled={!nome.trim()} onClick={() => {
            update((x) => ({ ...x, networkingContacts: [...x.networkingContacts, { id: uid('n'), name: nome.trim(), eventName: onde.trim(), metAt: todayKey(), notes: notas.trim() || undefined, followUpDone: false }] }))
            setNome(''); setOnde(''); setNotas(''); setNovo(false)
          }}>Salvar</Btn>
        </Sheet>
      )}
    </div>
  )
}
