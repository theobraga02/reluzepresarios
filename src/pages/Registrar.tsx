import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronDown } from 'lucide-react'
import { AREA_ICON, BottomNav } from '../components/ui'
import { todayKey } from '../lib/date'
import { type Area, type DayLog, emptyLog } from '../lib/model'
import { getLog, saveLog, useStore } from '../lib/store'

type Draft = {
  habitos: string[]
  treinoFeito: boolean; treinoMin: string; treinoNota: string
  receita: string; gastos: string
  contatos: string; propostas: string; fechadas: string
  bibliaMin: string; bibliaNota: string
  sono: string
  focoMin: string; focoNota: string
}

const s = (n: number) => (n ? String(n) : '')
const num = (v: string) => Math.max(0, parseFloat(v.replace(',', '.')) || 0)

function toDraft(l: DayLog): Draft {
  return {
    habitos: l.habitos,
    treinoFeito: l.treino.feito, treinoMin: s(l.treino.minutos), treinoNota: l.treino.nota,
    receita: s(l.financas.receita), gastos: s(l.financas.gastos),
    contatos: s(l.vendas.contatos), propostas: s(l.vendas.propostas), fechadas: s(l.vendas.fechadas),
    bibliaMin: s(l.biblia.minutos), bibliaNota: l.biblia.nota,
    sono: s(l.sono.horas),
    focoMin: s(l.foco.minutos), focoNota: l.foco.nota,
  }
}

function fromDraft(d: Draft): DayLog {
  return {
    habitos: d.habitos,
    treino: { feito: d.treinoFeito || num(d.treinoMin) > 0, minutos: num(d.treinoMin), nota: d.treinoNota.trim() },
    financas: { receita: num(d.receita), gastos: num(d.gastos), nota: '' },
    vendas: { contatos: num(d.contatos), propostas: num(d.propostas), fechadas: num(d.fechadas) },
    biblia: { minutos: num(d.bibliaMin), nota: d.bibliaNota.trim() },
    sono: { horas: Math.min(24, num(d.sono)) },
    foco: { minutos: num(d.focoMin), nota: d.focoNota.trim() },
  }
}

function Field({
  label, value, onChange, suffix, text, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; suffix?: string; text?: boolean; placeholder?: string }) {
  return (
    <label className="fld">
      <span>{label}</span>
      <div>
        <input
          type="text" inputMode={text ? 'text' : 'decimal'} value={value} placeholder={placeholder ?? (text ? '' : '0')}
          onChange={(e) => {
            const v = e.target.value
            if (text || /^[0-9]*[.,]?[0-9]*$/.test(v)) onChange(v)
          }}
        />
        {suffix && <em>{suffix}</em>}
      </div>
    </label>
  )
}

export default function Registrar({ preview = false }: { preview?: boolean }) {
  const st = useStore()
  const nav = useNavigate()
  const key = todayKey()
  const [d, setD] = useState<Draft>(() => toDraft(preview ? emptyLog() : getLog(st, key)))
  const [open, setOpen] = useState<Area | null>(null)
  const [saved, setSaved] = useState(false)
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }))

  const filled: Record<Area, boolean> = {
    habitos: d.habitos.length > 0,
    treino: d.treinoFeito || num(d.treinoMin) > 0,
    financas: num(d.receita) > 0 || num(d.gastos) > 0,
    vendas: num(d.contatos) + num(d.propostas) + num(d.fechadas) > 0,
    biblia: num(d.bibliaMin) > 0,
    sono: num(d.sono) > 0,
    foco: num(d.focoMin) > 0,
  }

  const rows: { area: Area; titulo: string; dica: string; corpo: ReactNode }[] = [
    {
      area: 'habitos', titulo: 'Hábitos', dica: 'Ex.: Ler, meditar, água...',
      corpo: (
        <div className="checks">
          {st.habitos.map((h) => {
            const on = d.habitos.includes(h.id)
            return (
              <button
                type="button" key={h.id} className={on ? 'on' : ''} aria-pressed={on}
                onClick={() => set('habitos', on ? d.habitos.filter((x) => x !== h.id) : [...d.habitos, h.id])}
              >
                <span>{on && <Check size={11} strokeWidth={3} />}</span>{h.nome}
              </button>
            )
          })}
        </div>
      ),
    },
    {
      area: 'treino', titulo: 'Treino', dica: 'Ex.: Academia, corrida...',
      corpo: (
        <>
          <button type="button" className={`toggle ${d.treinoFeito ? 'on' : ''}`} aria-pressed={d.treinoFeito} onClick={() => set('treinoFeito', !d.treinoFeito)}>
            <span>{d.treinoFeito && <Check size={11} strokeWidth={3} />}</span>Treinei hoje
          </button>
          <Field label="Duração" value={d.treinoMin} onChange={(v) => set('treinoMin', v)} suffix="min" />
          <Field label="Anotação" text value={d.treinoNota} onChange={(v) => set('treinoNota', v)} placeholder="Ex.: Peito e tríceps" />
        </>
      ),
    },
    {
      area: 'financas', titulo: 'Finanças', dica: 'Ex.: Gastos, receitas...',
      corpo: (
        <>
          <Field label="Receitas do dia" value={d.receita} onChange={(v) => set('receita', v)} suffix="R$" />
          <Field label="Gastos do dia" value={d.gastos} onChange={(v) => set('gastos', v)} suffix="R$" />
        </>
      ),
    },
    {
      area: 'vendas', titulo: 'Vendas', dica: 'Ex.: Contatos, propostas...',
      corpo: (
        <>
          <Field label="Contatos feitos" value={d.contatos} onChange={(v) => set('contatos', v)} />
          <Field label="Propostas enviadas" value={d.propostas} onChange={(v) => set('propostas', v)} />
          <Field label="Vendas fechadas" value={d.fechadas} onChange={(v) => set('fechadas', v)} />
        </>
      ),
    },
    {
      area: 'biblia', titulo: 'Bíblia', dica: 'Ex.: Leitura, reflexão...',
      corpo: (
        <>
          <Field label="Tempo de leitura" value={d.bibliaMin} onChange={(v) => set('bibliaMin', v)} suffix="min" />
          <Field label="Passagem / reflexão" text value={d.bibliaNota} onChange={(v) => set('bibliaNota', v)} placeholder="Ex.: Provérbios 3" />
        </>
      ),
    },
    {
      area: 'sono', titulo: 'Sono', dica: 'Ex.: Horas dormidas...',
      corpo: <Field label="Horas dormidas" value={d.sono} onChange={(v) => set('sono', v)} suffix="h" />,
    },
    {
      area: 'foco', titulo: 'Foco', dica: 'Ex.: Sem redes sociais...',
      corpo: (
        <>
          <Field label="Foco profundo" value={d.focoMin} onChange={(v) => set('focoMin', v)} suffix="min" />
          <Field label="No que você focou" text value={d.focoNota} onChange={(v) => set('focoNota', v)} placeholder="Ex.: Proposta do cliente X" />
        </>
      ),
    },
  ]

  function salvar() {
    saveLog(key, fromDraft(d))
    setSaved(true)
    window.setTimeout(() => nav('/app'), 650)
  }

  return (
    <div className="scr">
      <header className="scr-head">
        <div>
          <h2>Registrar</h2>
          <p className="scr-sub">Anote seu progresso de hoje.</p>
        </div>
      </header>
      <div className="scr-body">
        <ul className="rows">
          {rows.map((r) => {
            const Icon = AREA_ICON[r.area]
            const isOpen = open === r.area
            return (
              <li key={r.area} className={isOpen ? 'open' : ''}>
                <button
                  type="button" className="row" aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : r.area)}
                >
                  <span className={`row__mark ${filled[r.area] ? 'on' : ''}`}>
                    {filled[r.area] ? <Check size={11} strokeWidth={3} /> : <Icon size={12} strokeWidth={1.7} />}
                  </span>
                  <span className="row__txt"><b>{r.titulo}</b><small>{r.dica}</small></span>
                  <ChevronDown size={14} strokeWidth={1.6} className="row__chev" />
                </button>
                {isOpen && <div className="row__body">{r.corpo}</div>}
              </li>
            )
          })}
        </ul>
        <button type="button" className="cta-pill cta-pill--btn" onClick={salvar} disabled={saved}>
          {saved ? 'Salvo ✓' : 'Salvar'}
        </button>
      </div>
      <BottomNav active="registrar" />
    </div>
  )
}
