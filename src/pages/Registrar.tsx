import { useState, type ReactNode } from 'react'
import { Check, ChevronDown, Plus, X } from 'lucide-react'
import { AREA_ICON, BottomNav } from '../components/ui'
import { Btn, Chips, Field, num, Toggle } from '../components/kit'
import { todayKey } from '../lib/date'
import { HABIT_TO_AREA } from '../lib/defaults'
import { horasDeSono } from '../lib/score'
import { addRecord, toggleHabit, uid, useData } from '../lib/store'
import type { Area } from '../lib/types'

const META: Record<Area, { titulo: string; dica: string }> = {
  habitos: { titulo: 'Hábitos', dica: 'Marque o que você concluiu' },
  treino: { titulo: 'Treino', dica: 'Exercícios, séries e esforço' },
  financas: { titulo: 'Finanças', dica: 'Entradas e saídas' },
  vendas: { titulo: 'Vendas', dica: 'Produto, quantidade e valor' },
  biblia: { titulo: 'Bíblia', dica: 'Leitura e reflexão' },
  foco: { titulo: 'Foco', dica: 'Minutos de foco profundo' },
  leitura: { titulo: 'Leitura', dica: 'Livro e páginas' },
  sono: { titulo: 'Sono', dica: 'Horário e qualidade' },
}
const ORDEM: Area[] = ['habitos', 'treino', 'financas', 'vendas', 'biblia', 'foco', 'leitura', 'sono']

type Salvar = (msg?: string) => void

/* ───────── formulários ───────── */

function FormTreino({ dia, ok }: { dia: string; ok: Salvar }) {
  const [ex, setEx] = useState([{ name: '', sets: '', reps: '', load: '' }])
  const [esforco, setEsforco] = useState('3')
  const [notas, setNotas] = useState('')
  const set = (i: number, k: string, v: string) => setEx((l) => l.map((e, j) => (j === i ? { ...e, [k]: v } : e)))
  const exercicios = ex.filter((e) => e.name.trim())
  return (
    <>
      {ex.map((e, i) => (
        <div className="exrow" key={i}>
          <Field label={i === 0 ? 'Exercício' : ''} text value={e.name} onChange={(v) => set(i, 'name', v)} placeholder="Ex.: Supino" />
          <Field label={i === 0 ? 'Séries' : ''} value={e.sets} onChange={(v) => set(i, 'sets', v)} />
          <Field label={i === 0 ? 'Reps' : ''} value={e.reps} onChange={(v) => set(i, 'reps', v)} />
          <Field label={i === 0 ? 'Kg' : ''} value={e.load} onChange={(v) => set(i, 'load', v)} />
          {ex.length > 1 && <button type="button" className="icon-btn" aria-label="Remover exercício" onClick={() => setEx((l) => l.filter((_, j) => j !== i))}><X size={13} /></button>}
        </div>
      ))}
      <button type="button" className="act" onClick={() => setEx((l) => [...l, { name: '', sets: '', reps: '', load: '' }])}><Plus size={14} /> Exercício</button>
      <Chips label="Esforço (1 leve – 5 máximo)" value={esforco} onChange={setEsforco} options={['1', '2', '3', '4', '5'].map((v) => ({ v, l: v }))} />
      <Field label="Anotações" text multiline value={notas} onChange={setNotas} placeholder="Ex.: Peito e tríceps" />
      <Btn
        disabled={!exercicios.length}
        onClick={() => {
          addRecord('workoutRecords', {
            id: uid(), date: dia, effort: Number(esforco), notes: notas.trim() || undefined,
            exercises: exercicios.map((e) => ({ name: e.name.trim(), sets: num(e.sets), reps: num(e.reps), load: num(e.load) })),
          }, 'treino', dia)
          ok('Treino salvo')
        }}
      >Salvar treino</Btn>
    </>
  )
}

function FormFinancas({ dia, ok }: { dia: string; ok: Salvar }) {
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada')
  const [valor, setValor] = useState('')
  const [cat, setCat] = useState('')
  const [desc, setDesc] = useState('')
  const [status, setStatus] = useState<'recebido' | 'a_receber'>('recebido')
  const [rec, setRec] = useState(false)
  return (
    <>
      <Chips value={tipo} onChange={setTipo} options={[{ v: 'entrada', l: 'Entrada' }, { v: 'saida', l: 'Saída' }]} />
      <Field label="Valor" value={valor} onChange={setValor} suffix="R$" />
      <Field label="Categoria" text value={cat} onChange={setCat} placeholder="Ex.: Venda, Aluguel, Marketing" />
      <Field label="Descrição" text value={desc} onChange={setDesc} />
      <Chips value={status} onChange={setStatus} options={[{ v: 'recebido', l: tipo === 'entrada' ? 'Recebido' : 'Pago' }, { v: 'a_receber', l: tipo === 'entrada' ? 'A receber' : 'A pagar' }]} />
      <Toggle on={rec} onChange={setRec}>Recorrente (todo mês)</Toggle>
      <Btn
        disabled={num(valor) <= 0}
        onClick={() => {
          addRecord('incomeRecords', { id: uid(), date: dia, amount: num(valor), category: cat.trim() || 'Geral', description: desc.trim(), type: tipo, status, isRecurring: rec }, 'financas', dia)
          ok('Lançamento salvo')
        }}
      >Salvar lançamento</Btn>
    </>
  )
}

function FormVendas({ dia, ok }: { dia: string; ok: Salvar }) {
  const [produto, setProduto] = useState('')
  const [qtd, setQtd] = useState('1')
  const [preco, setPreco] = useState('')
  const [cliente, setCliente] = useState('')
  const [canal, setCanal] = useState('')
  const total = num(qtd) * num(preco)
  return (
    <>
      <Field label="Produto / serviço" text value={produto} onChange={setProduto} />
      <div className="grid2">
        <Field label="Quantidade" value={qtd} onChange={setQtd} />
        <Field label="Preço unitário" value={preco} onChange={setPreco} suffix="R$" />
      </div>
      <Field label="Cliente (opcional)" text value={cliente} onChange={setCliente} />
      <Field label="Canal (opcional)" text value={canal} onChange={setCanal} placeholder="WhatsApp, Instagram, indicação…" />
      <p className="fine">Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
      <Btn
        disabled={!produto.trim() || total <= 0}
        onClick={() => {
          addRecord('saleRecords', { id: uid(), date: dia, product: produto.trim(), quantity: num(qtd), unitPrice: num(preco), total, clientName: cliente.trim() || undefined, channel: canal.trim() || undefined }, 'vendas', dia)
          ok('Venda salva')
        }}
      >Salvar venda</Btn>
    </>
  )
}

function FormBiblia({ dia, ok }: { dia: string; ok: Salvar }) {
  const [plano, setPlano] = useState('Leitura livre')
  const [livro, setLivro] = useState('')
  const [cap, setCap] = useState('')
  const [vers, setVers] = useState('')
  const [aprendi, setAprendi] = useState('')
  const [grat, setGrat] = useState('')
  return (
    <>
      <Chips value={plano} onChange={setPlano} options={[{ v: 'Leitura livre', l: 'Leitura livre' }, { v: 'Plano de Sabedoria', l: 'Plano de Sabedoria' }]} />
      <div className="grid2">
        <Field label="Livro" text value={livro} onChange={setLivro} placeholder="Provérbios" />
        <Field label="Capítulo" value={cap} onChange={setCap} />
      </div>
      <Field label="Versículo marcante" text value={vers} onChange={setVers} placeholder="Ex.: 3:5" />
      <Field label="O que aprendi" text multiline value={aprendi} onChange={setAprendi} />
      <Field label="Gratidão" text multiline value={grat} onChange={setGrat} />
      <Btn
        disabled={!livro.trim()}
        onClick={() => {
          addRecord('bibleRecords', { id: uid(), date: dia, plan: plano, book: livro.trim(), chapter: num(cap), highlightVerse: vers.trim() || undefined, learned: aprendi.trim() || undefined, gratitude: grat.trim() || undefined }, 'biblia', dia)
          ok('Leitura salva')
        }}
      >Salvar leitura</Btn>
    </>
  )
}

function FormFoco({ dia, ok }: { dia: string; ok: Salvar }) {
  const [min, setMin] = useState('')
  return (
    <>
      <Field label="Foco profundo" value={min} onChange={setMin} suffix="min" />
      <div className="chips">{[25, 50, 90].map((m) => <button key={m} type="button" onClick={() => setMin(String(m))}>{m} min</button>)}</div>
      <Btn
        disabled={num(min) <= 0}
        onClick={() => { addRecord('focusRecords', { id: uid(), date: dia, durationMinutes: num(min) }, 'foco', dia); ok('Foco salvo') }}
      >Salvar foco</Btn>
    </>
  )
}

function FormLeitura({ dia, ok }: { dia: string; ok: Salvar }) {
  const [livro, setLivro] = useState('')
  const [pag, setPag] = useState('')
  const [notas, setNotas] = useState('')
  return (
    <>
      <Field label="Livro" text value={livro} onChange={setLivro} />
      <Field label="Páginas lidas" value={pag} onChange={setPag} />
      <Field label="Anotações" text multiline value={notas} onChange={setNotas} />
      <Btn
        disabled={!livro.trim() || num(pag) <= 0}
        onClick={() => { addRecord('readingRecords', { id: uid(), date: dia, bookTitle: livro.trim(), pagesRead: num(pag), notes: notas.trim() || undefined }, 'leitura', dia); ok('Leitura salva') }}
      >Salvar leitura</Btn>
    </>
  )
}

function FormSono({ dia, ok }: { dia: string; ok: Salvar }) {
  const [dormi, setDormi] = useState('23:00')
  const [acordei, setAcordei] = useState('07:00')
  const [q, setQ] = useState('4')
  return (
    <>
      <div className="grid2">
        <Field label="Dormi às" type="time" value={dormi} onChange={setDormi} />
        <Field label="Acordei às" type="time" value={acordei} onChange={setAcordei} />
      </div>
      <p className="fine">Total: {horasDeSono(dormi, acordei)} h</p>
      <Chips label="Qualidade (1 ruim – 5 ótima)" value={q} onChange={setQ} options={['1', '2', '3', '4', '5'].map((v) => ({ v, l: v }))} />
      <Btn
        disabled={!dormi || !acordei}
        onClick={() => { addRecord('sleepRecords', { id: uid(), date: dia, bedtime: dormi, wakeTime: acordei, quality: Number(q) }, 'sono', dia); ok('Sono salvo') }}
      >Salvar sono</Btn>
    </>
  )
}

/* ───────── tela ───────── */

export default function Registrar({ preview = false }: { preview?: boolean }) {
  const d = useData()
  const [dia, setDia] = useState(todayKey())
  const [aberto, setAberto] = useState<Area | null>(null)
  const [aviso, setAviso] = useState('')

  const ok: Salvar = (msg = 'Salvo') => {
    setAviso(`${msg} ✓`)
    setAberto(null)
    window.setTimeout(() => setAviso(''), 2200)
  }

  const feitosHab = new Set(d.habitLog[dia] ?? [])
  const feito: Record<Area, boolean> = {
    habitos: d.habits.length > 0 && d.habits.every((h) => feitosHab.has(h.id)),
    treino: d.workoutRecords.some((r) => r.date === dia),
    financas: d.incomeRecords.some((r) => r.date === dia),
    vendas: d.saleRecords.some((r) => r.date === dia),
    biblia: d.bibleRecords.some((r) => r.date === dia),
    foco: d.focusRecords.some((r) => r.date === dia),
    leitura: d.readingRecords.some((r) => r.date === dia),
    sono: d.sleepRecords.some((r) => r.date === dia),
  }

  const corpo = (a: Area): ReactNode => {
    switch (a) {
      case 'habitos':
        return (
          <div className="checks">
            {d.habits.map((h) => {
              const on = feitosHab.has(h.id)
              return (
                <button type="button" key={h.id} className={on ? 'on' : ''} aria-pressed={on} onClick={() => toggleHabit(h.id, dia)}>
                  <span>{on && <Check size={11} strokeWidth={3} />}</span>{h.title}
                  {HABIT_TO_AREA[h.area] && <small className="fine"> · também por “{META[HABIT_TO_AREA[h.area] as Area].titulo}”</small>}
                </button>
              )
            })}
            {!d.habits.length && <p className="empty">Crie hábitos na tela “Hoje”.</p>}
          </div>
        )
      case 'treino': return <FormTreino dia={dia} ok={ok} />
      case 'financas': return <FormFinancas dia={dia} ok={ok} />
      case 'vendas': return <FormVendas dia={dia} ok={ok} />
      case 'biblia': return <FormBiblia dia={dia} ok={ok} />
      case 'foco': return <FormFoco dia={dia} ok={ok} />
      case 'leitura': return <FormLeitura dia={dia} ok={ok} />
      case 'sono': return <FormSono dia={dia} ok={ok} />
    }
  }

  return (
    <div className="scr">
      <header className="scr-head">
        <div>
          <h2>Registrar</h2>
          <p className="scr-sub">Anote seu progresso.</p>
        </div>
      </header>
      <div className="scr-body">
        {!preview && <Field label="Dia" type="date" value={dia} onChange={(v) => v && v <= todayKey() && setDia(v)} />}
        {aviso && <p className="toast" role="status">{aviso}</p>}
        <ul className="rows">
          {ORDEM.map((a) => {
            const Icon = AREA_ICON[a]
            const isOpen = aberto === a
            return (
              <li key={a} className={isOpen ? 'open' : ''}>
                <button type="button" className="row" aria-expanded={isOpen} onClick={() => setAberto(isOpen ? null : a)}>
                  <span className={`row__mark ${feito[a] ? 'on' : ''}`}>
                    {feito[a] ? <Check size={11} strokeWidth={3} /> : <Icon size={12} strokeWidth={1.7} />}
                  </span>
                  <span className="row__txt"><b>{META[a].titulo}</b><small>{META[a].dica}</small></span>
                  <ChevronDown size={14} strokeWidth={1.6} className="row__chev" />
                </button>
                {isOpen && <div className="row__body">{corpo(a)}</div>}
              </li>
            )
          })}
        </ul>
      </div>
      <BottomNav active="registrar" />
    </div>
  )
}
