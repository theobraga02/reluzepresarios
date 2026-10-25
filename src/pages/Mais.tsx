import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, BookOpen, Briefcase, CalendarDays, Download, FlaskConical, Handshake, HeartHandshake, Sparkles, Trash2, Upload } from 'lucide-react'
import { BottomNav } from '../components/ui'
import { Btn, Field, num, Toggle } from '../components/kit'
import { exportJSON, importJSON, loadSample, resetAll, setConsent, update, useData } from '../lib/store'

const ATALHOS = [
  { to: '/app/coach', Icon: Sparkles, l: 'IA Coach' },
  { to: '/app/agenda', Icon: CalendarDays, l: 'Agenda' },
  { to: '/app/rede', Icon: Handshake, l: 'Rede e eventos' },
  { to: '/app/negocio', Icon: Briefcase, l: 'Meu negócio' },
  { to: '/app/biblia', Icon: BookOpen, l: 'Bíblia' },
]

export default function Mais() {
  const d = useData()
  const arq = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [confirma, setConfirma] = useState<'limpar' | 'exemplo' | null>(null)
  const m = d.settings.metas
  const setMeta = (k: keyof typeof m, v: string) =>
    update((x) => ({ ...x, settings: { ...x.settings, metas: { ...x.settings.metas, [k]: Math.max(1, num(v)) } } }))

  function baixar() {
    const url = URL.createObjectURL(new Blob([exportJSON()], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `empresario-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function lembrete(on: boolean) {
    if (on && 'Notification' in window && Notification.permission === 'default') await Notification.requestPermission()
    update((x) => ({ ...x, settings: { ...x.settings, reminderEnabled: on } }))
  }

  return (
    <div className="scr">
      <header className="scr-head"><div><h2>Mais</h2><p className="scr-sub">Atalhos, metas e dados</p></div></header>
      <div className="scr-body">
        <ul className="rows">
          {ATALHOS.map(({ to, Icon, l }) => (
            <li key={to}><Link to={to} className="row"><span className="row__mark"><Icon size={12} strokeWidth={1.7} /></span><span className="row__txt"><b>{l}</b></span></Link></li>
          ))}
        </ul>

        <div className="card list-card">
          <b>IA (Gemini, Groq, OpenRouter)</b>
          <p className="fine">A IA recebe apenas um resumo numérico (notas por área e metas). Anotações, nomes de clientes e valores em R$ nunca são enviados. Cursos e eventos vêm de busca na web, com link verificado.</p>
          <Toggle on={d.settings.aiConsent} onChange={setConsent}>Permitir uso de IA no app</Toggle>
        </div>

        <div className="card list-card">
          <b>Metas diárias</b>
          <div className="grid2">
            <Field label="Contatos de vendas/dia" value={String(m.vendasDia)} onChange={(v) => setMeta('vendasDia', v)} />
            <Field label="Foco (min/dia)" value={String(m.focoMin)} onChange={(v) => setMeta('focoMin', v)} />
            <Field label="Leitura (págs/dia)" value={String(m.leituraPaginas)} onChange={(v) => setMeta('leituraPaginas', v)} />
            <Field label="Sono (horas)" value={String(m.sonoHoras)} onChange={(v) => setMeta('sonoHoras', v)} />
            <Field label="Treinos/semana" value={String(m.treinosSemana)} onChange={(v) => setMeta('treinosSemana', v)} />
          </div>
        </div>

        <div className="card list-card">
          <b>Lembrete diário</b>
          <Toggle on={d.settings.reminderEnabled} onChange={lembrete}><Bell size={13} /> Lembrar de registrar o dia</Toggle>
          {d.settings.reminderEnabled && <Field label="Horário" type="time" value={d.settings.reminderTime} onChange={(v) => update((x) => ({ ...x, settings: { ...x.settings, reminderTime: v } }))} />}
          <p className="fine">O lembrete funciona com o app aberto no navegador.</p>
        </div>

        <div className="card list-card">
          <b>Seus dados</b>
          <p className="fine">Tudo fica salvo só neste aparelho. Faça backup de vez em quando.</p>
          <button type="button" className="act" onClick={baixar}><Download size={14} /> Exportar backup (JSON)</button>
          <button type="button" className="act" onClick={() => arq.current?.click()}><Upload size={14} /> Importar backup</button>
          <input ref={arq} type="file" accept="application/json,.json" hidden onChange={async (e) => {
            const f = e.target.files?.[0]
            e.target.value = ''
            if (f) setMsg(importJSON(await f.text()).msg)
          }} />
          {confirma === 'exemplo' ? (
            <div className="confirma"><p className="fine">Isso substitui seus registros por dados de exemplo. Seus hábitos e perfil são mantidos.</p><Btn onClick={() => { loadSample(); setConfirma(null); setMsg('Dados de exemplo carregados.') }}>Confirmar</Btn><Btn kind="ghost" onClick={() => setConfirma(null)}>Cancelar</Btn></div>
          ) : (
            <button type="button" className="act" onClick={() => setConfirma('exemplo')}><FlaskConical size={14} /> Carregar dados de exemplo</button>
          )}
          {confirma === 'limpar' ? (
            <div className="confirma"><p className="fine">Apagar tudo, sem volta?</p><Btn kind="danger" onClick={() => { resetAll(); setConfirma(null); setMsg('Dados apagados.') }}>Apagar tudo</Btn><Btn kind="ghost" onClick={() => setConfirma(null)}>Cancelar</Btn></div>
          ) : (
            <button type="button" className="act act--danger" onClick={() => setConfirma('limpar')}><Trash2 size={14} /> Apagar todos os dados</button>
          )}
          {msg && <p className="aviso" role="status">{msg}</p>}
        </div>

        <div className="card list-card">
          <b><HeartHandshake size={13} /> Apoio</b>
          <p className="fine">Se estiver passando por um momento difícil, o CVV atende 24 h, de graça, pelo telefone 188 ou em cvv.org.br.</p>
        </div>

        <p className="fine">
          Empresário v2 · Versículos: Almeida Revista e Corrigida. Cursos, livros e vídeos listados são sugestões; confira preço e certificação no site de origem.
          O app não substitui orientação financeira, jurídica ou médica. Login e sincronização em nuvem do app antigo não foram migrados.
        </p>
      </div>
      <BottomNav />
    </div>
  )
}
