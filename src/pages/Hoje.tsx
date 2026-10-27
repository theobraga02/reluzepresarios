import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarClock, Check, Plus, Sparkles, Trash2, User } from 'lucide-react'
import { BottomNav } from '../components/ui'
import { NovoHabito } from '../components/NovoHabito'
import { Motivacao } from '../components/Motivacao'
import { Sino } from '../components/Notificacoes'
import { addDays, dayOfYear, fromKey, todayKey } from '../lib/date'
import { media, serieHabitos } from '../lib/serie-habitos'
import { HABIT_AREAS, HABIT_TO_AREA } from '../lib/defaults'
import { relatorioLocal } from '../lib/coach'
import { confete, useContagem } from '../lib/efeitos'
import { moeda, saldoDia, sequencia } from '../lib/score'
import { removeHabit, toggleHabit, useData } from '../lib/store'
import { TRADUCAO, VERSICULOS } from '../lib/conteudo'

const Grafico = lazy(() => import('../components/GraficoConsistencia'))
type Aba = 'pend' | 'feitos' | 'todos'

export default function Hoje() {
  const d = useData()
  const [novo, setNovo] = useState(false)
  const [apagar, setApagar] = useState<string | null>(null)
  const [aba, setAba] = useState<Aba>('pend')
  const [dias, setDias] = useState(7)
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

  // Séries calculadas dos registros reais (nada é estimado).
  const serie = useMemo(() => serieHabitos(d, dias), [d, dias])
  const sem = useMemo(() => serieHabitos(d, 7), [d])
  const semAnt = useMemo(() => serieHabitos(d, 7, addDays(new Date(), -7)), [d])
  const consist = media(sem)
  const delta = consist - media(semAnt)
  const consistAnim = useContagem(consist)

  const antes = useRef(nFeitos)
  useEffect(() => {
    if (total > 0 && nFeitos === total && antes.current < nFeitos) void confete(true)
    antes.current = nFeitos
  }, [nFeitos, total])

  // Retomada sem culpa: avisa só quando faz 3 dias ou mais sem nenhum hábito marcado.
  const diasParado = (() => {
    const ult = Object.entries(d.habitLog).filter(([, ids]) => ids.length > 0).map(([k]) => k).sort().pop()
    return ult ? Math.floor((Date.now() - fromKey(ult).getTime()) / 864e5) : 0
  })()
  const lista = aba === 'pend' ? pendentes : aba === 'feitos' ? d.habits.filter((h) => feitos.has(h.id)) : [...pendentes, ...d.habits.filter((h) => feitos.has(h.id))]

  // Uma única ação principal, escolhida pelo contexto.
  const acao = pendentes.length > 0
    ? { txt: `Concluir: ${pendentes[0].title}`, run: () => toggleHabit(pendentes[0].id) }
    : prox ? { txt: 'Ver a agenda', to: '/app/agenda' }
    : { txt: 'Registrar o dia', to: '/app/registrar' }

  const semHistorico = consist === 0 && media(semAnt) === 0
  const Tend = delta >= 0 ? ArrowUpRight : ArrowDownRight

  return (
    <div className="scr">
      <header className="scr-head">
        <div>
          <p className="eyebrow">{hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
          <h2>Construa sua melhor versão.</h2>
          <p className="scr-sub">Clareza para decidir. Disciplina para executar. Consistência para evoluir.</p>
        </div>
        <div className="head-act"><Sino /><Link to="/app/mais" className="icon-btn" aria-label="Configurações e conta"><User size={16} strokeWidth={1.6} /></Link></div>
      </header>
      <div className="scr-body dash">
        {d.exemplo && <p className="badge-ex">Exibindo dados de exemplo</p>}

        <section className="kpis" aria-label="Indicadores">
          <div className="kpi">
            <div className="kpi__top"><small>Hábitos hoje</small><span className="tag">{pctAnim}%</span></div>
            <b>{nFeitos}<em>/{total}</em></b>
            <p>{total === 0 ? 'Nenhum hábito ativo' : nFeitos === total ? 'Dia concluído' : `${total - nFeitos} ${total - nFeitos === 1 ? 'pendente' : 'pendentes'}`}</p>
            <i className="bar"><u style={{ width: `${pct}%` }} /></i>
          </div>
          <div className="kpi">
            <div className="kpi__top"><small>Consistência</small>{!semHistorico && <span className={`tag ${delta >= 0 ? 'up' : 'down'}`}><Tend size={11} /> {delta >= 0 ? '+' : ''}{delta}</span>}</div>
            <b>{consistAnim}<em>%</em></b>
            <p>{semHistorico ? 'Últimos 7 dias · sem histórico' : delta > 0 ? 'Acima da semana anterior' : delta < 0 ? 'Abaixo da semana anterior' : 'Igual à semana anterior'}</p>
          </div>
          <div className="kpi">
            <div className="kpi__top"><small>Sequência</small></div>
            <b>{seq}<em> {seq === 1 ? 'dia' : 'dias'}</em></b>
            <p>Treino hoje: {treinoHoje ? 'feito' : 'pendente'}</p>
          </div>
          <div className="kpi">
            <div className="kpi__top"><small>Saldo hoje</small><span className="tag">Vendas {vendasHoje}/{d.settings.metas.vendasDia}</span></div>
            <b className="kpi__money">{moeda(saldoDia(d, key))}</b>
            <p>Entradas menos saídas de hoje</p>
          </div>
        </section>

        <section className="card graf-card dash__wide">
          <div className="graf-card__head">
            <div><b>Consistência dos hábitos</b><small>Hábitos concluídos e nota geral · últimos {dias} dias</small></div>
            <div className="seg seg--sm" role="tablist" aria-label="Período">
              {[7, 30, 90].map((n) => <button key={n} type="button" role="tab" aria-selected={dias === n} className={dias === n ? 'on' : ''} onClick={() => setDias(n)}>{n}d</button>)}
            </div>
          </div>
          <Suspense fallback={<div className="graf" aria-busy="true" />}><Grafico dados={serie} /></Suspense>
        </section>

        <aside className="dash__side">
          <Link to="/app/coach" className="insight">
            <small className="eyebrow"><Sparkles size={12} strokeWidth={1.6} /> Insight do dia</small>
            <p className="serif">{rel.mensagem}</p>
            <span>Leitura automática dos seus registros · abrir o Coach <ArrowRight size={12} /></span>
          </Link>
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
        </aside>

        <section className="dash__wide tabela">
          {diasParado >= 3 && nFeitos === 0 && total > 0 && (
            <div className="retomar">
              <b>Recomeçar também é progresso.</b>
              <p>Faz {diasParado} dias desde o último registro. Hoje, conclua apenas um hábito e a sequência volta a andar.</p>
            </div>
          )}
          <div className="tabela__head">
            <div className="tabs" role="tablist" aria-label="Filtro das prioridades">
              <button type="button" role="tab" aria-selected={aba === 'pend'} className={aba === 'pend' ? 'on' : ''} onClick={() => setAba('pend')}>Pendentes <em>{pendentes.length}</em></button>
              <button type="button" role="tab" aria-selected={aba === 'feitos'} className={aba === 'feitos' ? 'on' : ''} onClick={() => setAba('feitos')}>Concluídos <em>{nFeitos}</em></button>
              <button type="button" role="tab" aria-selected={aba === 'todos'} className={aba === 'todos' ? 'on' : ''} onClick={() => setAba('todos')}>Todos <em>{total}</em></button>
            </div>
            <div className="tabela__act">
              <Link to="/app/habitos" className="btn-sm"><Plus size={13} /> Escolher</Link>
              <button type="button" className="btn-sm" onClick={() => setNovo(true)}><Plus size={13} /> Criar</button>
            </div>
          </div>
          {total === 0 && <p className="empty">Grandes mudanças começam com uma decisão clara. <Link to="/app/habitos" className="lnk">Escolher meus hábitos</Link></p>}
          {total > 0 && lista.length === 0 && <p className="empty">{aba === 'pend' ? 'Tudo concluído por hoje.' : 'Nada concluído ainda.'}</p>}
          {lista.length > 0 && (
            <ul className="tbl" aria-label="Hábitos de hoje">
              <li className="tbl__h" aria-hidden><span /><span>Hábito</span><span>Área</span><span>Meta</span><span>Status</span><span /></li>
              {lista.map((h) => {
                const on = feitos.has(h.id)
                const area = HABIT_TO_AREA[h.area]
                return (
                  <li key={h.id} className={`tbl__r ${on ? 'is-done' : ''}`}>
                    <button type="button" className={`row__mark ${on ? 'on' : ''}`} aria-pressed={on} aria-label={`${on ? 'Desmarcar' : 'Concluir'}: ${h.title}`} onClick={() => toggleHabit(h.id)}>
                      {on && <Check size={11} strokeWidth={3} />}
                    </button>
                    <span className="tbl__t"><span className="emo">{h.icon}</span><b>{h.title}</b>{area && !on && <small>registre em Registrar</small>}</span>
                    <span className="tbl__a"><span className="pill">{HABIT_AREAS.find((a) => a.id === h.area)?.label}</span></span>
                    <span className="tbl__m">{h.target ? `${h.target}${h.unit ? ' ' + h.unit : ''}` : '—'}</span>
                    <span className="tbl__s"><span className={`stt ${on ? 'ok' : ''}`}>{on ? 'Concluído' : 'Pendente'}</span></span>
                    {apagar === h.id ? (
                      <button type="button" className="mini-act" onClick={() => { removeHabit(h.id); setApagar(null) }}>Excluir</button>
                    ) : (
                      <button type="button" className="icon-btn" aria-label={`Excluir hábito ${h.title}`} onClick={() => setApagar(h.id)}><Trash2 size={13} strokeWidth={1.5} /></button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="dash__wide duo">
          <Motivacao />
          <div className="verse">
            <small className="eyebrow">Versículo do dia · {TRADUCAO}</small>
            <p className="serif">“{v.texto}”</p>
            <b>{v.referencia}</b>
          </div>
        </section>
      </div>
      <BottomNav active="hoje" />
      {novo && <NovoHabito onClose={() => setNovo(false)} />}
    </div>
  )
}
