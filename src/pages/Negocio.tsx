import { useState } from 'react'
import { ArrowRight, Plus, Trash2 } from 'lucide-react'
import { BottomNav } from '../components/ui'
import { Btn, Empty, Field, Sheet, SubHead } from '../components/kit'
import { todayKey } from '../lib/date'
import { uid, update, useData } from '../lib/store'
import type { BusinessProfile, Stage } from '../lib/types'

const ETAPAS: { k: Stage; l: string }[] = [
  { k: 'conheci', l: 'Conheci' }, { k: 'conversei', l: 'Conversei' }, { k: 'proposta', l: 'Proposta' }, { k: 'fechou', l: 'Fechou' },
]

export default function Negocio() {
  const d = useData()
  const p = d.businessProfile
  const [tags, setTags] = useState(p.targetClientTags.join(', '))
  const [salvo, setSalvo] = useState(false)
  const [novo, setNovo] = useState(false)
  const [nome, setNome] = useState('')
  const [notas, setNotas] = useState('')
  const set = (k: keyof BusinessProfile, v: string) => { setSalvo(false); update((x) => ({ ...x, businessProfile: { ...x.businessProfile, [k]: v } })) }

  return (
    <div className="scr">
      <SubHead title="Meu negócio" sub="Perfil e funil de clientes" />
      <div className="scr-body">
        <div className="card list-card">
          <b>Perfil</b>
          <Field label="Produto / serviço" text value={p.productName} onChange={(v) => set('productName', v)} />
          <Field label="Área de atuação" text value={p.area} onChange={(v) => set('area', v)} />
          <Field label="Preço médio" text value={p.price} onChange={(v) => set('price', v)} placeholder="Ex.: R$ 150" />
          <Field label="Cliente ideal (separe por vírgula)" text value={tags} onChange={(v) => { setTags(v); setSalvo(false) }} placeholder="Ex.: clínicas, restaurantes" />
          <Field label="Principal dor do cliente" text value={p.clientPain} onChange={(v) => set('clientPain', v)} />
          <Field label="Cidade" text value={p.city} onChange={(v) => set('city', v)} />
          <Btn onClick={() => { update((x) => ({ ...x, businessProfile: { ...x.businessProfile, targetClientTags: tags.split(',').map((t) => t.trim()).filter(Boolean) } })); setSalvo(true) }}>
            {salvo ? 'Salvo ✓' : 'Salvar perfil'}
          </Btn>
        </div>

        <div className="sec-row"><b className="sec-title">Funil de clientes</b><small>{d.clients.length} no total</small></div>
        <button type="button" className="act" onClick={() => setNovo(true)}><Plus size={14} /> Novo cliente / lead</button>
        {d.clients.length === 0 && <Empty>Cadastre quem você conheceu e avance cada pessoa pelo funil.</Empty>}
        {ETAPAS.map((e) => {
          const l = d.clients.filter((c) => c.stage === e.k)
          if (!l.length) return null
          return (
            <section key={e.k}>
              <small className="fine">{e.l} ({l.length})</small>
              <ul className="rows" style={{ marginTop: 6 }}>
                {l.map((c) => (
                  <li key={c.id} className="card agenda-item">
                    <span className="row__txt"><b>{c.name}</b>{c.notes && <small>{c.notes}</small>}</span>
                    {e.k !== 'fechou' && (
                      <button type="button" className="icon-btn" aria-label={`Avançar ${c.name} para a próxima etapa`} onClick={() => update((x) => ({ ...x, clients: x.clients.map((y) => (y.id === c.id ? { ...y, stage: ETAPAS[ETAPAS.findIndex((t) => t.k === y.stage) + 1].k } : y)) }))}><ArrowRight size={14} /></button>
                    )}
                    <button type="button" className="icon-btn" aria-label={`Excluir ${c.name}`} onClick={() => update((x) => ({ ...x, clients: x.clients.filter((y) => y.id !== c.id) }))}><Trash2 size={13} strokeWidth={1.5} /></button>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
      <BottomNav />
      {novo && (
        <Sheet title="Novo cliente / lead" onClose={() => setNovo(false)}>
          <Field label="Nome" text value={nome} onChange={setNome} />
          <Field label="Observações" text multiline value={notas} onChange={setNotas} />
          <Btn disabled={!nome.trim()} onClick={() => {
            update((x) => ({ ...x, clients: [...x.clients, { id: uid('c'), name: nome.trim(), stage: 'conheci', notes: notas.trim() || undefined, createdAt: todayKey() }] }))
            setNome(''); setNotas(''); setNovo(false)
          }}>Adicionar</Btn>
        </Sheet>
      )}
    </div>
  )
}
