import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, BookOpen, Cloud, LogOut, RefreshCw, Briefcase, CalendarDays, Download, FlaskConical, Handshake, HeartHandshake, Sparkles, Trash2, Upload } from 'lucide-react'
import { BottomNav } from '../components/ui'
import { Btn, Field, num, Toggle } from '../components/kit'
import { apagarNuvem, criarConta, entrar, novaSenha, recuperarSenha, sair, sincronizar, useCloud, cliente } from '../lib/cloud'
import { exportJSON, importJSON, loadSample, resetAll, setConsent, update, useData } from '../lib/store'

const ATALHOS = [
  { to: '/app/coach', Icon: Sparkles, l: 'IA Coach' },
  { to: '/app/agenda', Icon: CalendarDays, l: 'Agenda' },
  { to: '/app/rede', Icon: Handshake, l: 'Rede e eventos' },
  { to: '/app/negocio', Icon: Briefcase, l: 'Meu negócio' },
  { to: '/app/biblia', Icon: BookOpen, l: 'Bíblia' },
  { to: '/app/habitos', Icon: BookOpen, l: 'Catálogo de hábitos' },
]

function Conta() {
  const c = useCloud()
  const [adm, setAdm] = useState(false)
  useEffect(() => {
    if (!c.email) return
    let vivo = true
    void cliente().then((cl) => cl.rpc('empresario_is_admin')).then(({ data }) => vivo && setAdm(data === true)).catch(() => {})
    return () => { vivo = false }
  }, [c.email])
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nova, setNova] = useState('')
  const [apagar, setApagar] = useState(false)
  const busy = c.phase === 'busy'

  if (c.recovery) {
    return (
      <div className="card list-card">
        <b><Cloud size={13} /> Criar nova senha</b>
        <Field label="Nova senha (mín. 6)" text value={nova} onChange={setNova} />
        <Btn disabled={nova.length < 6 || busy} onClick={() => void novaSenha(nova)}>Salvar nova senha</Btn>
        {c.msg && <p className="aviso" role="status">{c.msg}</p>}
      </div>
    )
  }

  if (c.email) {
    return (
      <div className="card list-card">
        <b><Cloud size={13} /> Conta e nuvem</b>
        <p className="fine">
          {c.email}<br />
          {busy ? 'Sincronizando…' : c.phase === 'error' ? 'Sem sincronizar.' : c.syncedAt ? `Sincronizado às ${new Date(c.syncedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.` : ''}
        </p>
        <button type="button" className="act" onClick={() => void sincronizar()} disabled={busy}><RefreshCw size={14} /> Sincronizar agora</button>
        {adm && <Link to="/admin" className="act">Painel de administração</Link>}
        <button type="button" className="act" onClick={() => void sair()}><LogOut size={14} /> Sair da conta</button>
        {apagar ? (
          <div className="confirma"><p className="fine">Apagar seus dados da nuvem e sair? Os dados deste aparelho ficam.</p><Btn kind="danger" onClick={() => { void apagarNuvem(); setApagar(false) }}>Apagar da nuvem</Btn><Btn kind="ghost" onClick={() => setApagar(false)}>Cancelar</Btn></div>
        ) : (
          <button type="button" className="act act--danger" onClick={() => setApagar(true)}><Trash2 size={14} /> Apagar dados da nuvem</button>
        )}
        {c.msg && <p className="aviso" role="status">{c.msg}</p>}
      </div>
    )
  }

  return (
    <div className="card list-card">
      <b><Cloud size={13} /> Conta e nuvem (opcional)</b>
      <p className="fine">Entre para guardar seus dados na nuvem e usar em vários aparelhos. Sem conta, tudo continua só neste aparelho.</p>
      <Field label="E-mail" text value={email} onChange={setEmail} placeholder="voce@email.com" />
      <label className="fld">
        <span>Senha (mín. 6)</span>
        <div><input type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} /></div>
      </label>
      <Btn disabled={busy || !email.includes('@') || senha.length < 6} onClick={() => void entrar(email, senha)}>{busy ? 'Aguarde…' : 'Entrar'}</Btn>
      <Btn kind="ghost" disabled={busy || !email.includes('@') || senha.length < 6} onClick={() => void criarConta(email, senha)}>Criar conta</Btn>
      <button type="button" className="act" disabled={!email.includes('@')} onClick={() => void recuperarSenha(email)}>Esqueci minha senha</button>
      {c.msg && <p className="aviso" role="status">{c.msg}</p>}
    </div>
  )
}

function Seguranca() {
  const c = useCloud()
  const [nova, setNova] = useState('')
  const [msg, setMsg] = useState('')
  if (!c.email) return null
  return (
    <div className="card list-card">
      <b>Segurança</b>
      <Field label="Nova senha (mín. 6)" text value={nova} onChange={setNova} />
      <Btn kind="ghost" disabled={nova.length < 6} onClick={async () => { const ok = await novaSenha(nova); setMsg(ok ? 'Senha atualizada.' : 'Não foi possível atualizar a senha agora.'); if (ok) setNova('') }}>Alterar senha</Btn>
      {msg && <p className="aviso" role="status">{msg}</p>}
    </div>
  )
}

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
        <h3 className="grp">Conta</h3>
        <Conta />
        <Seguranca />

        <h3 className="grp">Atalhos</h3>
        <ul className="rows">
          {ATALHOS.map(({ to, Icon, l }) => (
            <li key={to}><Link to={to} className="row"><span className="row__mark"><Icon size={12} strokeWidth={1.7} /></span><span className="row__txt"><b>{l}</b></span></Link></li>
          ))}
        </ul>

        <h3 className="grp">Preferências</h3>
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

        <h3 className="grp">Privacidade e dados</h3>
        <div className="card list-card">
          <b>Seus dados</b>
          <p className="fine">Seus dados ficam neste aparelho e, com a conta, também na nuvem. Faça um backup de vez em quando.</p>
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
          Empresário v2 · Bíblia: Almeida 1911 (domínio público). Cursos, livros e vídeos listados são sugestões; confira preço e certificação no site de origem.
          O app não substitui orientação financeira, jurídica ou médica.
        </p>
      </div>
      <BottomNav />
    </div>
  )
}
