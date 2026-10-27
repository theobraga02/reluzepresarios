import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Btn, Field, Sheet } from './kit'
import { Logo } from './ui'
import { Sidebar } from './Sidebar'
import { TermosTexto } from './TermosTexto'
import { aceitarTermos, criarConta, entrar, novaSenha, recuperarSenha, sair, useCloud } from '../lib/cloud'
import { HABITOS_INICIAIS } from '../lib/defaults'
import { resetAll, update, useData } from '../lib/store'

const onbKey = (uid: string) => `empresario:onb:${uid}`
export const onboardingFeito = (uid?: string) => { try { return !!uid && localStorage.getItem(onbKey(uid)) === '1' } catch { return false } }
export const concluirOnboarding = (uid?: string) => { try { if (uid) localStorage.setItem(onbKey(uid), '1') } catch { /* ignora */ } }

function Carregando({ texto }: { texto: string }) {
  return <div className="gate"><Logo /><p className="fine" aria-busy="true">{texto}</p></div>
}

function Entrada() {
  const c = useCloud()
  const [modo, setModo] = useState<'entrar' | 'criar'>('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nova, setNova] = useState('')
  const [aceito, setAceito] = useState(false)
  const [ler, setLer] = useState(false)
  const busy = c.phase === 'busy'
  const ok = email.includes('@') && senha.length >= 6

  if (c.recovery) {
    return (
      <div className="gate">
        <Logo />
        <div className="card list-card">
          <b>Criar nova senha</b>
          <Field label="Nova senha (mín. 6)" text value={nova} onChange={setNova} />
          <Btn disabled={nova.length < 6 || busy} onClick={() => void novaSenha(nova)}>Salvar nova senha</Btn>
          {c.msg && <p className="aviso" role="status">{c.msg}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="gate">
      <Logo />
      <p className="gate__sub">Entre ou crie sua conta para usar o app. Seus dados ficam salvos e acompanham você em qualquer aparelho.</p>
      <div className="card list-card">
        <div className="seg" role="tablist">
          <button type="button" role="tab" aria-selected={modo === 'entrar'} className={modo === 'entrar' ? 'on' : ''} onClick={() => setModo('entrar')}>Entrar</button>
          <button type="button" role="tab" aria-selected={modo === 'criar'} className={modo === 'criar' ? 'on' : ''} onClick={() => setModo('criar')}>Criar conta</button>
        </div>
        <Field label="E-mail" text value={email} onChange={setEmail} placeholder="voce@email.com" />
        <label className="fld">
          <span>Senha (mín. 6)</span>
          <div><input type="password" autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'} value={senha} onChange={(e) => setSenha(e.target.value)} /></div>
        </label>
        {modo === 'criar' && (
          <label className="check">
            <input type="checkbox" checked={aceito} onChange={(e) => setAceito(e.target.checked)} />
            <span>Li e aceito os <button type="button" className="lnk" onClick={() => setLer(true)}>Termos de Uso e a Política de Privacidade</button>.</span>
          </label>
        )}
        {modo === 'entrar'
          ? <Btn disabled={busy || !ok} onClick={() => void entrar(email, senha)}>{busy ? 'Aguarde…' : 'Entrar'}</Btn>
          : <Btn disabled={busy || !ok || !aceito} onClick={() => void criarConta(email, senha, aceito)}>{busy ? 'Aguarde…' : 'Criar conta'}</Btn>}
        {modo === 'entrar' && <button type="button" className="act" disabled={!email.includes('@')} onClick={() => void recuperarSenha(email)}>Esqueci minha senha</button>}
        {c.msg && <p className="aviso" role="status">{c.msg}</p>}
      </div>
      <Link to="/" className="fine lnk">← Voltar ao início</Link>
      {ler && <Sheet title="Termos de Uso" onClose={() => setLer(false)}><TermosTexto /></Sheet>}
    </div>
  )
}

function AceiteTermos() {
  const c = useCloud()
  const [aceito, setAceito] = useState(false)
  const [busy, setBusy] = useState(false)
  return (
    <div className="gate gate--wide">
      <Logo />
      <div className="card list-card">
        <b>Antes de continuar</b>
        <p className="fine">Leia os termos e confirme para usar o app com a conta {c.email}.</p>
        <div className="termos-box"><TermosTexto /></div>
        <label className="check">
          <input type="checkbox" checked={aceito} onChange={(e) => setAceito(e.target.checked)} />
          <span>Li e aceito os Termos de Uso e a Política de Privacidade.</span>
        </label>
        <Btn disabled={!aceito || busy} onClick={async () => { setBusy(true); await aceitarTermos(); setBusy(false) }}>Aceitar e continuar</Btn>
        <button type="button" className="act" onClick={() => void sair()}>Sair da conta</button>
        {c.msg && <p className="aviso" role="status">{c.msg}</p>}
      </div>
    </div>
  )
}

/** Exige conta, aceite dos termos e a escolha dos hábitos antes de liberar o app. */
export function Porteiro() {
  const c = useCloud()
  const d = useData()
  const loc = useLocation()
  const nav = useNavigate()
  const liberado = Boolean(c.email && c.termos)
  const feito = onboardingFeito(c.uid)
  const noInicio = loc.pathname === '/app/habitos' && loc.search.includes('inicio=1')
  const [limpo, setLimpo] = useState(false)
  const padrao = new Set(HABITOS_INICIAIS.map((h) => h.id))
  const nova = d.exemplo || (d.habits.length > 0 && d.habits.every((h) => padrao.has(h.id)) && Object.keys(d.habitLog).length === 0)
  const [, bump] = useState(0)

  useEffect(() => {
    if (!liberado || feito || c.phase === 'busy') return
    // Conta com hábitos já escolhidos (por exemplo, vindos da nuvem): nada a escolher.
    if (!nova && d.habits.length > 0) { concluirOnboarding(c.uid); bump((n) => n + 1); return }
    // Conta nova: começa do zero (sem dados de exemplo) para a pessoa escolher os próprios hábitos.
    if (nova && !limpo) { resetAll(); update((x) => ({ ...x, habits: [], exemplo: false })); setLimpo(true); return }
    if (!noInicio) nav('/app/habitos?inicio=1', { replace: true })
  }, [liberado, feito, c.phase, c.uid, nova, d.habits.length, noInicio, limpo, nav])

  if (!c.pronto) return <Carregando texto="Abrindo…" />
  if (!c.email) return <Entrada />
  if (!c.termos) return <AceiteTermos />
  if (c.phase === 'busy') return <Carregando texto="Sincronizando seus dados…" />
  if (!feito && !noInicio) return <Carregando texto="Preparando seu app…" />
  return (
    <div className="shell">
      <Sidebar />
      <div className="shell__main"><Outlet /></div>
    </div>
  )
}
