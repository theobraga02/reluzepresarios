import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, Check, Flame, Plus, Trash2, User } from 'lucide-react'
import { BottomNav, ScoreRing, AREA_ICON } from '../components/ui'
import { NovoHabito } from '../components/NovoHabito'
import { Motivacao } from '../components/Motivacao'
import { Sino } from '../components/Notificacoes'
import { useCloud } from '../lib/cloud'
import { confete, useContagem } from '../lib/efeitos'
import { dateLabel, dayOfYear, fromKey, todayKey } from '../lib/date'
import { HABIT_AREAS, HABIT_TO_AREA } from '../lib/defaults'
import { relatorioLocal } from '../lib/coach'
import { moeda, saldoDia, scoreDia, sequencia } from '../lib/score'
import { removeHabit, toggleHabit, useData } from '../lib/store'
import { TRADUCAO, VERSICULOS } from '../lib/conteudo'

export default function Hoje() {
  const d = useData()
  const nuvem = useCloud()
  const [novo, setNovo] = useState(false)
  const [apagar, setApagar] = useState<string | null>(null)
  const hoje = new Date()
  const key = todayKey()
  const feitos = new Set(d.habitLog[key] ?? [])
  const sc = scoreDia(d, key)
  const rel = relatorioLocal(d)
  const v = VERSICULOS[dayOfYear(hoje) % VERSICULOS.length]
  const prox = d.appointments
    .filter((a) => a.date >= key)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0]
  const nFeitos = d.habits.filter((h) => feitos.has(h.id)).length
  const vendasHoje = d.saleRecords.filter((r) => r.date === key).length
  const treinoHoje = d.workoutRecords.some((r) => r.date === key)
  const seq = sequencia(d)
  const pct = useContagem(d.habits.length ? Math.round((nFeitos / d.habits.length) * 100) : 0)
  const antes = useRef(nFeitos)
  useEffect(() => {
    if (d.habits.length > 0 && nFeitos === d.habits.length && antes.current < nFeitos) void confete(true)
    antes.current = nFeitos
  }, [nFeitos, d.habits.length])

  return (
    <div className="scr">
      <header className="scr-head">
        <div>
          <h2>Hoje</h2>
          <p className="scr-sub">{dateLabel(hoje)}</p>
        </div>
        <div className="head-act"><Sino /><Link to="/app/mais" className="icon-btn" aria-label="Mais opções"><User size={16} strokeWidth={1.6} /></Link></div>
      </header>
      <div className="scr-body">
        {d.exemplo && <p className="badge-ex">Exibindo dados de exemplo</p>}

        {!nuvem.email && <Link to="/app/mais" className="card next"><span><small>Conta</small><b>Entrar ou criar conta</b><small>Salve seus dados na nuvem e use em vários aparelhos</small></span></Link>}

        <Motivacao />

        <div className="card verse">
          <small>Versículo do dia · {TRADUCAO}</small>
          <p>“{v.texto}”</p>
          <b>{v.referencia}</b>
        </div>

        <div className="grid2">
          <div className="card stat"><span className="chip-ic"><AREA_ICON.habitos size={13} strokeWidth={1.7} /></span><small>Hábitos</small><b>{nFeitos}/{d.habits.length}</b><i className="bar"><u style={{ width: `${pct}%` }} /></i></div>
          <div className="card stat"><span className="chip-ic"><AREA_ICON.treino size={13} strokeWidth={1.7} /></span><small>Treino</small><b>{treinoHoje ? '1/1' : '0/1'}</b></div>
          <div className="card stat"><span className="chip-ic"><AREA_ICON.financas size={13} strokeWidth={1.7} /></span><small>Finanças</small><b>{moeda(saldoDia(d, key))}</b></div>
          <div className="card stat"><span className="chip-ic"><AREA_ICON.vendas size={13} strokeWidth={1.7} /></span><small>Vendas</small><b>{vendasHoje}/{d.settings.metas.vendasDia}</b></div>
        </div>

        <div className="sec-row">
          <b className="sec-title">Seus hábitos</b>
          <small className="streak"><Flame size={12} strokeWidth={1.8} /> {seq} {seq === 1 ? 'dia' : 'dias'} seguidos</small>
        </div>
        {d.habits.length === 0 && <p className="empty">Nenhum hábito ainda. Adicione o primeiro.</p>}
        <ul className="rows">
          {d.habits.map((h) => {
            const on = feitos.has(h.id)
            const area = HABIT_TO_AREA[h.area]
            return (
              <li key={h.id}>
                <div className="row">
                  <button type="button" className={`row__mark ${on ? 'on' : ''}`} aria-pressed={on} aria-label={`${on ? 'Desmarcar' : 'Concluir'}: ${h.title}`} onClick={() => toggleHabit(h.id)}>
                    {on && <Check size={11} strokeWidth={3} />}
                  </button>
                  <span className="row__txt">
                    <b className={on ? 'done' : ''}>{h.icon} {h.title}</b>
                    <small>{h.target ? `Meta: ${h.target}${h.unit ? ' ' + h.unit : ''}` : HABIT_AREAS.find((a) => a.id === h.area)?.label}{area ? ' · registre em “Registrar”' : ''}</small>
                  </span>
                  {apagar === h.id ? (
                    <button type="button" className="mini-act" onClick={() => { removeHabit(h.id); setApagar(null) }}>Excluir</button>
                  ) : (
                    <button type="button" className="icon-btn" aria-label={`Excluir hábito ${h.title}`} onClick={() => setApagar(h.id)}><Trash2 size={13} strokeWidth={1.5} /></button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        <div className="grid2">
          <Link to="/app/habitos" className="act"><Plus size={14} /> Escolher hábitos</Link>
          <button type="button" className="act" onClick={() => setNovo(true)}><Plus size={14} /> Criar o meu</button>
        </div>

        {prox && (
          <Link to="/app/agenda" className="card next">
            <span className="chip-ic"><CalendarClock size={13} strokeWidth={1.7} /></span>
            <span>
              <small>Próximo compromisso</small>
              <b>{prox.title}</b>
              <small>{prox.date === key ? 'Hoje' : fromKey(prox.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} · {prox.time}</small>
            </span>
          </Link>
        )}

        <Link to="/app/coach" className="card nota">
          <b>Sua nota de hoje</b>
          <div className="nota__row">
            <ScoreRing value={sc.temDados ? sc.total : rel.nota} size={64} stroke={4} sub="nota média" />
            <p>{rel.mensagem}</p>
          </div>
        </Link>
      </div>
      <BottomNav active="hoje" />
      {novo && <NovoHabito onClose={() => setNovo(false)} />}
    </div>
  )
}
