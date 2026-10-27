import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarClock, Check, Flame, Plus, Sparkles, Trash2, User } from 'lucide-react'
import { BottomNav } from '../components/ui'
import { NovoHabito } from '../components/NovoHabito'
import { Motivacao } from '../components/Motivacao'
import { Sino } from '../components/Notificacoes'
import { addDays, DIAS_CURTOS_SEMANA, fromKey, keyOf, todayKey } from '../lib/date'
import { dayOfYear } from '../lib/date'
import { HABIT_AREAS, HABIT_TO_AREA } from '../lib/defaults'
import { relatorioLocal } from '../lib/coach'
import { confete, useContagem } from '../lib/efeitos'
import { moeda, saldoDia, sequencia } from '../lib/score'
import { removeHabit, toggleHabit, useData } from '../lib/store'
import { TRADUCAO, VERSICULOS } from '../lib/conteudo'

export default function Hoje() {
  const d = useData()
  const [novo, setNovo] = useState(false)
  const [apagar, setApagar] = useState<string | null>(null)
  const hoje = new Date()
  const key = todayKey()
  const feitos = new Set(d.habitLog[key] ?? [])
  const rel = relatorioLocal(d)
  const v = VERSICULOS[dayOfYear(hoje) % VERSICULOS.length]
  const prox = d.appointments
    .filter((a) => a.date >= key)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0]
  const total = d.habits.length
  const nFeitos = d.habits.filter((h) => feitos.has(h.id)).length
  const pendentes = d.habits.filter((h) => !feitos.has(h.id))
  const vendasHoje = d.saleRecords.filter((r) => r.date === key).length
  const treinoHoje = d.workoutRecords.some((r) => r.date === key)
  const seq = sequencia(d)
  const pct = total ? Math.round((nFeitos / total) * 100) : 0
  const pctAnim = useContagem(pct)

  // Consistência dos últimos 7 dias: hábitos concluídos ÷ (hábitos × dias), calculada dos registros reais.
  const semana = useMemo(() => {
    const ids = new Set(d.habits.map((h) => h.id))
    return Array.from({ length: 7 }, (_, i) => {
      const dia = addDays(new Date(), i - 6)
      const k = keyOf(dia)
      const n = (d.habitLog[k] ?? []).filter((id) => ids.has(id)).length
      return { k, n, p: ids.size ? n / ids.size : 0, rot: DIAS_CURTOS_SEMANA[(dia.getDay() + 6) % 7] }
    })
  }, [d.habits, d.habitLog])
  const consist = Math.round((semana.reduce((s, x) => s + x.p, 0) / 7) * 100)

  const antes = useRef(nFeitos)
  useEffect(() => {
    if (total > 0 && nFeitos === total && antes.current < nFeitos) void confete(true)
    antes.current = nFeitos
  }, [nFeitos, total])

  const ordenados = [...pendentes, ...d.habits.filter((h) => feitos.has(h.id))]

  // Uma única ação principal, escolhida pelo contexto.
  const acao = pendentes.length > 0
    ? { txt: `Concluir: ${pendentes[0].title}`, run: () => toggleHabit(pendentes[0].id) }
    : prox ? { txt: 'Ver a agenda', to: '/app/agenda' }
    : { txt: 'Registrar o dia', to: '/app/registrar' }

  return (
    <div className="scr">
      <header className="scr-head">
        <div>
          <p className="eyebrow">{hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
          <h2 className="serif">Construa sua melhor versão.</h2>
          <p className="scr-sub">Clareza para decidir. Disciplina para executar. Consistência para evoluir.</p>
        </div>
        <div className="head-act"><Sino /><Link to="/app/mais" className="icon-btn" aria-label="Configurações e conta"><User size={16} strokeWidth={1.6} /></Link></div>
      </header>
      <div className="scr-body dash">
        {d.exemplo && <p className="badge-ex">Exibindo dados de exemplo</p>}

        <section className="dash__main">
          <div className="exec">
            <div className="exec__top">
              <div>
                <small className="eyebrow">Progresso de hoje</small>
                <b className="exec__n">{nFeitos}<span>/{total}</span></b>
                <small className="exec__s">{total === 0 ? 'Nenhum hábito ativo' : nFeitos === total ? 'Dia concluído' : `${total - nFeitos} ${total - nFeitos === 1 ? 'pendente' : 'pendentes'}`}</small>
              </div>
              <b className="exec__pct">{pctAnim}%</b>
            </div>
            <i className="bar bar--lg"><u style={{ width: `${pct}%` }} /></i>
            <ul className="exec__kpi">
              <li><small>Sequência</small><b><Flame size={12} strokeWidth={1.8} /> {seq} {seq === 1 ? 'dia' : 'dias'}</b></li>
              <li><small>Consistência 7 dias</small><b>{consist}%</b></li>
              <li><small>Treino</small><b>{treinoHoje ? 'Feito' : 'Pendente'}</b></li>
              <li><small>Vendas</small><b>{vendasHoje}/{d.settings.metas.vendasDia}</b></li>
              <li><small>Saldo do dia</small><b>{moeda(saldoDia(d, key))}</b></li>
            </ul>
          </div>

          <div className="sec-row">
            <b className="sec-title">Prioridades de hoje</b>
            <small className="streak"><Link to="/app/habitos" className="lnk">Gerenciar hábitos</Link></small>
          </div>
          {total === 0 && <p className="empty">Grandes mudanças começam com uma decisão clara. <Link to="/app/habitos" className="lnk">Escolher meus hábitos</Link></p>}
          <ul className="rows rows--flat">
            {ordenados.map((h) => {
              const on = feitos.has(h.id)
              const area = HABIT_TO_AREA[h.area]
              return (
                <li key={h.id} className={on ? 'is-done' : ''}>
                  <div className="row">
                    <button type="button" className={`row__mark ${on ? 'on' : ''}`} aria-pressed={on} aria-label={`${on ? 'Desmarcar' : 'Concluir'}: ${h.title}`} onClick={() => toggleHabit(h.id)}>
                      {on && <Check size={11} strokeWidth={3} />}
                    </button>
                    <span className="row__txt">
                      <b className={on ? 'done' : ''}>{h.icon} {h.title}</b>
                      <small>{HABIT_AREAS.find((a) => a.id === h.area)?.label}{h.target ? ` · meta ${h.target}${h.unit ? ' ' + h.unit : ''}` : ''}{area && !on ? ' · registre em Registrar' : ''}</small>
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
        </section>

        <aside className="dash__side">
          <Link to="/app/coach" className="insight">
            <small className="eyebrow"><Sparkles size={12} strokeWidth={1.6} /> Insight do dia</small>
            <p className="serif">{rel.mensagem}</p>
            <span>Leitura automática dos seus registros · abrir o Coach <ArrowRight size={12} /></span>
          </Link>

          <div className="card week">
            <div className="sec-row"><b className="sec-title">Evolução recente</b><small className="streak">Hábitos · 7 dias</small></div>
            <div className="week__bars" role="img" aria-label={`Hábitos concluídos nos últimos 7 dias: ${semana.map((x) => `${x.rot} ${x.n}`).join(', ')}`}>
              {semana.map((x, i) => (
                <div key={x.k} className={i === 6 ? 'hoje' : ''}>
                  <i style={{ height: `${Math.max(6, x.p * 100)}%` }} />
                  <small>{x.rot}</small>
                </div>
              ))}
            </div>
          </div>

          {acao.to
            ? <Link to={acao.to} className="kbtn kbtn--main">{acao.txt} <ArrowRight size={14} /></Link>
            : <button type="button" className="kbtn kbtn--main" onClick={acao.run}>{acao.txt}</button>}

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

          <Motivacao />

          <div className="verse">
            <small className="eyebrow">Versículo do dia · {TRADUCAO}</small>
            <p className="serif">“{v.texto}”</p>
            <b>{v.referencia}</b>
          </div>
        </aside>
      </div>
      <BottomNav active="hoje" />
      {novo && <NovoHabito onClose={() => setNovo(false)} />}
    </div>
  )
}
