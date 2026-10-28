import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleAlert, CircleCheck, Send, Sparkles, X } from 'lucide-react'
import { BottomNav, ScoreRing } from '../components/ui'
import { Btn } from '../components/kit'
import { relatorioLocal } from '../lib/coach'
import { CATALOGO } from '../lib/conteudo'
import { dateLabelLong, todayKey } from '../lib/date'
import { avaliarComIA, conversarComCoach, IAError, type Msg } from '../lib/ia'
import { setConsent, useData } from '../lib/store'
import type { CoachReport } from '../lib/types'

function msgErro(e: unknown, padrao: string) {
  if (!(e instanceof IAError)) return padrao
  const det = e.detalhe.length ? ` (${e.detalhe[0].slice(0, 140)})` : ''
  return e.message + det
}

export default function Coach() {
  const d = useData()
  const local = relatorioLocal(d)
  const cache = d.coachCache?.date === todayKey() ? d.coachCache.report : null
  const [rel, setRel] = useState<CoachReport | null>(cache)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [chat, setChat] = useState<Msg[]>([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const fim = useRef<HTMLDivElement>(null)

  useEffect(() => { fim.current?.scrollIntoView({ block: 'end' }) }, [chat, enviando])

  const r = rel ?? local
  const areas = r.areas?.length ? r.areas : local.areas ?? []
  const sugestoes = CATALOGO.filter((c) => areas.includes(c.area) && c.tipo !== 'plataforma').slice(0, 3)
  const consent = d.settings.aiConsent

  async function avaliar() {
    setErro('')
    setCarregando(true)
    try {
      setRel(await avaliarComIA(d))
    } catch (e) {
      setErro(msgErro(e, 'Não foi possível avaliar agora.'))
    } finally {
      setCarregando(false)
    }
  }

  async function enviar() {
    const t = texto.trim()
    if (!t || enviando) return
    const novo: Msg[] = [...chat, { role: 'user', content: t }]
    setChat(novo)
    setTexto('')
    setErro('')
    setEnviando(true)
    try {
      const j = await conversarComCoach(novo, d)
      setChat([...novo, { role: 'assistant', content: j.resposta }])
    } catch (e) {
      setErro(msgErro(e, 'Não foi possível responder agora.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="scr">
      <header className="scr-head scr-head--coach">
        <div>
          <h2>IA Coach</h2>
          <p className="scr-sub">{dateLabelLong(new Date())}</p>
        </div>
        <Link to="/app" className="x-btn" aria-label="Fechar"><X size={16} strokeWidth={1.6} /></Link>
      </header>
      <div className="scr-body">
        <div className="coach-ring">
          <ScoreRing value={local.nota} size={96} stroke={5} sub="nota média" />
          <small>{r.mensagem}</small>
        </div>

        {r.fortes.length > 0 && (
          <div className="card list-card">
            <b>Pontos fortes</b>
            <ul>{r.fortes.map((t) => <li key={t}><CircleCheck size={15} strokeWidth={1.6} className="ok" />{t}</li>)}</ul>
          </div>
        )}
        {r.melhorar.length > 0 && (
          <div className="card list-card">
            <b>Pontos a melhorar</b>
            <ul>{r.melhorar.map((t) => <li key={t}><CircleAlert size={15} strokeWidth={1.6} className="warn" />{t}</li>)}</ul>
          </div>
        )}
        <div className="card list-card">
          <b>Recomendações para amanhã</b>
          <ol>{r.recomendacoes.map((t) => <li key={t}>{t}</li>)}</ol>
        </div>

        {sugestoes.length > 0 && (
          <div className="card list-card">
            <b>Para estudar</b>
            <ul>
              {sugestoes.map((s) => (
                <li key={s.id}>{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="lnk">{s.titulo}</a> : s.titulo} <small className="fine">· {s.meta}</small></li>
              ))}
            </ul>
          </div>
        )}

        <p className="fine">
          {rel?.provider ? `Avaliação gerada por IA (${rel.provider}) a partir de um resumo numérico dos seus últimos 7 dias.` : 'Avaliação por regras locais, a partir dos seus registros.'}
          {' '}Não é aconselhamento financeiro, médico ou jurídico.
        </p>

        {consent ? (
          <Btn onClick={avaliar} disabled={carregando}>
            <Sparkles size={14} /> {carregando ? 'Avaliando…' : rel ? 'Avaliar de novo com IA' : 'Avaliar com IA'}
          </Btn>
        ) : (
          <button type="button" className="card ia-box" onClick={() => setConsent(true)}>
            <span className="chip-ic"><Sparkles size={13} strokeWidth={1.7} /></span>
            <div><b>Ativar o Coach com IA</b><p>Toque aqui para liberar. A IA recebe só um resumo numérico dos seus últimos 7 dias.</p></div>
          </button>
        )}
        {erro && <p className="aviso" role="alert">{erro}</p>}

        {consent && (
          <div className="chat">
            <b className="sec-title">Converse com o Coach</b>
            {chat.map((m, i) => <p key={i} className={`bolha ${m.role}`}>{m.content}</p>)}
            {enviando && <p className="bolha assistant">Pensando…</p>}
            <div ref={fim} />
          </div>
        )}
      </div>
      {consent && (
        <form className="chatbar" onSubmit={(e) => { e.preventDefault(); void enviar() }}>
          <input value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={400} placeholder="Pergunte algo ao Coach…" aria-label="Mensagem para o Coach" />
          <button type="submit" className="icon-btn" aria-label="Enviar" disabled={!texto.trim() || enviando}><Send size={15} /></button>
        </form>
      )}
      <BottomNav active="coach" />
    </div>
  )
}
