import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Trash2 } from 'lucide-react'
import { Btn, Chips, Field } from '../components/kit'
import { CATALOGO_HABITOS, CATEGORIAS, type CatId } from '../lib/catalogo-habitos'
import { cliente, useCloud } from '../lib/cloud'
import { limparCacheRemoto } from '../lib/nuvem-admin'

type Aba = 'resumo' | 'usuarios' | 'habitos' | 'avisos' | 'midia'
const ABAS: { k: Aba; l: string }[] = [
  { k: 'resumo', l: 'Resumo' }, { k: 'usuarios', l: 'Usuários' }, { k: 'habitos', l: 'Hábitos' }, { k: 'avisos', l: 'Avisos' }, { k: 'midia', l: 'Frases e fotos' },
]
const norm = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
const dt = (s?: string | null) => (s ? new Date(s).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—')

type Resumo = { usuarios: number; novos7d: number; com_dados: number; ativos7d: number; habitos_top: { titulo: string; n: number }[]; registros: Record<string, number> }
type Usuario = { id: string; email: string; criado: string; ultimo_acesso: string | null; sincronizado: string | null; habitos: number; registros: number }

/** Executa uma chamada ao Supabase e devolve só a mensagem de erro (ou null). */
async function run(f: () => PromiseLike<{ error: { message: string } | null }>) {
  const { error } = await f()
  if (!error) limparCacheRemoto()
  return error ? error.message : null
}

function Resumo() {
  const [r, setR] = useState<Resumo | null>(null)
  const [erro, setErro] = useState('')
  useEffect(() => {
    void cliente().then((c) => c.rpc('empresario_admin_resumo')).then(({ data, error }) => (error ? setErro(error.message) : setR(data as Resumo)))
  }, [])
  if (erro) return <p className="aviso">{erro}</p>
  if (!r) return <p className="empty">Carregando…</p>
  const max = Math.max(1, ...r.habitos_top.map((h) => h.n))
  return (
    <>
      <div className="adm-grid">
        <div className="card stat"><small>Usuários</small><b>{r.usuarios}</b></div>
        <div className="card stat"><small>Novos (7 dias)</small><b>{r.novos7d}</b></div>
        <div className="card stat"><small>Com dados na nuvem</small><b>{r.com_dados}</b></div>
        <div className="card stat"><small>Ativos (7 dias)</small><b>{r.ativos7d}</b></div>
      </div>
      <div className="card list-card">
        <b>Registros totais</b>
        <div className="adm-grid">
          {Object.entries(r.registros).map(([k, v]) => <div key={k} className="stat"><small>{k}</small><b>{v}</b></div>)}
        </div>
      </div>
      <div className="card list-card">
        <b>Hábitos mais usados</b>
        {r.habitos_top.length === 0 && <p className="fine">Ainda sem dados.</p>}
        <ul className="funil">
          {r.habitos_top.map((h) => <li key={h.titulo}><span title={h.titulo}>{h.titulo.slice(0, 18)}</span><i><u style={{ width: `${(h.n / max) * 100}%` }} /></i><em>{h.n}</em></li>)}
        </ul>
      </div>
      <p className="fine">O painel mostra e-mails e números agregados. O conteúdo das anotações dos usuários não é exibido aqui.</p>
    </>
  )
}

function Usuarios() {
  const [l, setL] = useState<Usuario[] | null>(null)
  const [q, setQ] = useState('')
  const [erro, setErro] = useState('')
  useEffect(() => {
    void cliente().then((c) => c.rpc('empresario_admin_usuarios')).then(({ data, error }) => (error ? setErro(error.message) : setL(data as Usuario[])))
  }, [])
  if (erro) return <p className="aviso">{erro}</p>
  if (!l) return <p className="empty">Carregando…</p>
  const f = l.filter((u) => norm(u.email).includes(norm(q)))
  return (
    <>
      <Field label="Buscar e-mail" text value={q} onChange={setQ} />
      <p className="fine">{f.length} de {l.length} usuários</p>
      <div className="adm-table" role="region" aria-label="Usuários" tabIndex={0}>
        <table>
          <thead><tr><th>E-mail</th><th>Criado</th><th>Último acesso</th><th>Sincronizou</th><th>Hábitos</th><th>Registros</th></tr></thead>
          <tbody>
            {f.map((u) => <tr key={u.id}><td>{u.email}</td><td>{dt(u.criado)}</td><td>{dt(u.ultimo_acesso)}</td><td>{dt(u.sincronizado)}</td><td>{u.habitos}</td><td>{u.registros}</td></tr>)}
          </tbody>
        </table>
      </div>
    </>
  )
}

type Linha = { id: string; titulo: string; cat: CatId; icone: string; area: string; meta: number | null; unidade: string | null; dica: string; ativo: boolean }

function Habitos() {
  const [extras, setExtras] = useState<Linha[]>([])
  const [ocultos, setOcultos] = useState<string[]>([])
  const [msg, setMsg] = useState('')
  const [q, setQ] = useState('')
  const [f, setF] = useState({ titulo: '', cat: 'foco' as CatId, icone: '⭐', meta: '', unidade: '', dica: '' })

  const carregar = useCallback(async () => {
    const c = await cliente()
    const [a, b] = await Promise.all([
      c.from('empresario_catalogo').select('*').order('created_at', { ascending: false }),
      c.from('empresario_catalogo_ocultos').select('id'),
    ])
    setExtras((a.data as Linha[]) ?? [])
    setOcultos(((b.data as { id: string }[]) ?? []).map((x) => x.id))
  }, [])
  useEffect(() => { void carregar() }, [carregar])

  const aviso = async (p: Promise<string | null>) => { const e = await p; setMsg(e ?? 'Salvo.'); await carregar() }
  const criar = async () => {
    const c = await cliente()
    const area = CATEGORIAS.find((x) => x.id === f.cat)!.area
    await aviso(run(() => c.from('empresario_catalogo').insert({ titulo: f.titulo.trim(), cat: f.cat, icone: f.icone || '⭐', area, meta: f.meta ? Number(f.meta.replace(',', '.')) : null, unidade: f.unidade.trim() || null, dica: f.dica.trim() })))
    setF({ ...f, titulo: '', dica: '', meta: '', unidade: '' })
  }
  const local = useMemo(() => CATALOGO_HABITOS.filter((h) => norm(h.titulo).includes(norm(q))), [q])

  return (
    <>
      {msg && <p className="toast" role="status">{msg}</p>}
      <div className="card list-card">
        <b>Novo hábito no catálogo</b>
        <Field label="Título" text value={f.titulo} onChange={(v) => setF({ ...f, titulo: v })} />
        <div className="chips">
          {CATEGORIAS.map((c) => <button key={c.id} type="button" className={f.cat === c.id ? 'on' : ''} onClick={() => setF({ ...f, cat: c.id })}>{c.icone} {c.nome}</button>)}
        </div>
        <div className="grid2">
          <Field label="Ícone (emoji)" text value={f.icone} onChange={(v) => setF({ ...f, icone: v })} />
          <Field label="Unidade" text value={f.unidade} onChange={(v) => setF({ ...f, unidade: v })} placeholder="min, páginas…" />
          <Field label="Meta sugerida" value={f.meta} onChange={(v) => setF({ ...f, meta: v })} />
        </div>
        <Field label="Dica" text value={f.dica} onChange={(v) => setF({ ...f, dica: v })} />
        <Btn disabled={f.titulo.trim().length < 2} onClick={() => void criar()}>Adicionar ao catálogo</Btn>
      </div>

      <b className="sec-title">Criados por você ({extras.length})</b>
      <ul className="rows">
        {extras.map((h) => (
          <li key={h.id} className="card agenda-item">
            <span className="row__txt"><b>{h.icone} {h.titulo}</b><small>{CATEGORIAS.find((c) => c.id === h.cat)?.nome}{h.ativo ? '' : ' · desativado'}</small></span>
            <button type="button" className="icon-btn" aria-label={h.ativo ? 'Desativar' : 'Ativar'} onClick={async () => aviso(run(async () => (await cliente()).from('empresario_catalogo').update({ ativo: !h.ativo }).eq('id', h.id)))}>{h.ativo ? <Eye size={14} /> : <EyeOff size={14} />}</button>
            <button type="button" className="icon-btn" aria-label="Excluir" onClick={async () => aviso(run(async () => (await cliente()).from('empresario_catalogo').delete().eq('id', h.id)))}><Trash2 size={14} /></button>
          </li>
        ))}
      </ul>

      <b className="sec-title">Catálogo embutido ({CATALOGO_HABITOS.length}) · {ocultos.length} escondidos</b>
      <Field label="Filtrar" text value={q} onChange={setQ} />
      <ul className="rows">
        {local.slice(0, 80).map((h) => {
          const oculto = ocultos.includes(h.id)
          return (
            <li key={h.id} className="card agenda-item">
              <span className="row__txt"><b className={oculto ? 'done' : ''}>{h.icone} {h.titulo}</b><small>{CATEGORIAS.find((c) => c.id === h.cat)?.nome}</small></span>
              <button type="button" className="icon-btn" aria-label={oculto ? 'Mostrar de novo' : 'Esconder do catálogo'} onClick={async () => aviso(run(async () => { const c = await cliente(); return oculto ? c.from('empresario_catalogo_ocultos').delete().eq('id', h.id) : c.from('empresario_catalogo_ocultos').insert({ id: h.id }) }))}>{oculto ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

type Aviso = { id: string; titulo: string; texto: string; link: string | null; ativo: boolean; inicio: string; fim: string | null }

function Avisos() {
  const [l, setL] = useState<Aviso[]>([])
  const [msg, setMsg] = useState('')
  const [f, setF] = useState({ titulo: '', texto: '', link: '', fim: '' })
  const carregar = useCallback(async () => setL((((await (await cliente()).from('empresario_avisos').select('*').order('created_at', { ascending: false })).data) as Aviso[]) ?? []), [])
  useEffect(() => { void carregar() }, [carregar])
  const aviso = async (p: Promise<string | null>) => { const e = await p; setMsg(e ?? 'Salvo.'); await carregar() }
  return (
    <>
      {msg && <p className="toast" role="status">{msg}</p>}
      <div className="card list-card">
        <b>Novo aviso (aparece nas notificações do dia)</b>
        <Field label="Título" text value={f.titulo} onChange={(v) => setF({ ...f, titulo: v })} />
        <Field label="Texto (até 300)" text multiline value={f.texto} onChange={(v) => setF({ ...f, texto: v.slice(0, 300) })} />
        <Field label="Link (opcional, https:// ou /app/…)" text value={f.link} onChange={(v) => setF({ ...f, link: v })} />
        <Field label="Mostrar até (opcional)" type="date" value={f.fim} onChange={(v) => setF({ ...f, fim: v })} />
        <Btn disabled={f.titulo.trim().length < 2 || !f.texto.trim()} onClick={async () => {
          await aviso(run(async () => (await cliente()).from('empresario_avisos').insert({ titulo: f.titulo.trim(), texto: f.texto.trim(), link: f.link.trim() || null, fim: f.fim || null })))
          setF({ titulo: '', texto: '', link: '', fim: '' })
        }}>Publicar aviso</Btn>
      </div>
      <ul className="rows">
        {l.map((a) => (
          <li key={a.id} className="card agenda-item">
            <span className="row__txt"><b>{a.titulo}</b><small>{a.texto}</small><small>{a.ativo ? 'Ativo' : 'Desativado'} · desde {a.inicio}{a.fim ? ` até ${a.fim}` : ''}</small></span>
            <button type="button" className="icon-btn" aria-label={a.ativo ? 'Desativar' : 'Ativar'} onClick={async () => aviso(run(async () => (await cliente()).from('empresario_avisos').update({ ativo: !a.ativo }).eq('id', a.id)))}>{a.ativo ? <Eye size={14} /> : <EyeOff size={14} />}</button>
            <button type="button" className="icon-btn" aria-label="Excluir" onClick={async () => aviso(run(async () => (await cliente()).from('empresario_avisos').delete().eq('id', a.id)))}><Trash2 size={14} /></button>
          </li>
        ))}
        {l.length === 0 && <p className="empty">Nenhum aviso ainda.</p>}
      </ul>
    </>
  )
}

type Midia = { id: string; tipo: 'frase' | 'foto'; texto: string; url: string | null; ativo: boolean }

function MidiaTab() {
  const [l, setL] = useState<Midia[]>([])
  const [msg, setMsg] = useState('')
  const [tipo, setTipo] = useState<'frase' | 'foto'>('frase')
  const [texto, setTexto] = useState('')
  const [url, setUrl] = useState('')
  const carregar = useCallback(async () => setL((((await (await cliente()).from('empresario_midia').select('*').order('created_at', { ascending: false })).data) as Midia[]) ?? []), [])
  useEffect(() => { void carregar() }, [carregar])
  const aviso = async (p: Promise<string | null>) => { const e = await p; setMsg(e ?? 'Salvo.'); await carregar() }
  const ok = tipo === 'frase' ? texto.trim().length >= 3 : /^https:\/\//.test(url.trim())
  return (
    <>
      {msg && <p className="toast" role="status">{msg}</p>}
      <div className="card list-card">
        <b>Adicionar</b>
        <Chips value={tipo} onChange={setTipo} options={[{ v: 'frase', l: 'Frase' }, { v: 'foto', l: 'Foto de motivação' }]} />
        {tipo === 'foto' && <Field label="Endereço da imagem (https://…)" text value={url} onChange={setUrl} />}
        <Field label={tipo === 'frase' ? 'Frase (até 240)' : 'Legenda (opcional)'} text multiline={tipo === 'frase'} value={texto} onChange={(v) => setTexto(v.slice(0, 240))} />
        {tipo === 'foto' && /^https:\/\//.test(url) && <img className="adm-prev" src={url} alt="Pré-visualização" referrerPolicy="no-referrer" />}
        <p className="fine">Use só imagens e frases que você tenha direito de usar (suas, de bancos gratuitos como Pexels/Unsplash, ou de domínio público).</p>
        <Btn disabled={!ok} onClick={async () => {
          await aviso(run(async () => (await cliente()).from('empresario_midia').insert({ tipo, texto: texto.trim(), url: tipo === 'foto' ? url.trim() : null })))
          setTexto(''); setUrl('')
        }}>Adicionar</Btn>
      </div>
      <ul className="rows">
        {l.map((m) => (
          <li key={m.id} className="card agenda-item">
            {m.tipo === 'foto' && m.url && <img className="adm-thumb" src={m.url} alt="" loading="lazy" referrerPolicy="no-referrer" />}
            <span className="row__txt"><b>{m.tipo === 'frase' ? m.texto : m.texto || 'Foto'}</b><small>{m.tipo === 'frase' ? 'Frase' : 'Foto'}{m.ativo ? '' : ' · desativada'}</small></span>
            <button type="button" className="icon-btn" aria-label={m.ativo ? 'Desativar' : 'Ativar'} onClick={async () => aviso(run(async () => (await cliente()).from('empresario_midia').update({ ativo: !m.ativo }).eq('id', m.id)))}>{m.ativo ? <Eye size={14} /> : <EyeOff size={14} />}</button>
            <button type="button" className="icon-btn" aria-label="Excluir" onClick={async () => aviso(run(async () => (await cliente()).from('empresario_midia').delete().eq('id', m.id)))}><Trash2 size={14} /></button>
          </li>
        ))}
        {l.length === 0 && <p className="empty">Nada cadastrado. O app usa as frases e fotos embutidas.</p>}
      </ul>
    </>
  )
}

export default function Admin() {
  const c = useCloud()
  const [ok, setOk] = useState<'?' | 'sim' | 'nao'>('?')
  const [aba, setAba] = useState<Aba>('resumo')

  useEffect(() => {
    if (!c.email) return
    let vivo = true
    void cliente().then((cl) => cl.rpc('empresario_is_admin')).then(({ data }) => vivo && setOk(data === true ? 'sim' : 'nao'))
    return () => { vivo = false }
  }, [c.email])

  return (
    <div className="adm">
      <header className="adm-head">
        <Link to="/app/mais" className="icon-btn" aria-label="Voltar ao app"><ArrowLeft size={18} /></Link>
        <h1>Administração</h1>
        <small>{c.email ?? ''}</small>
      </header>
      {!c.email && <div className="card"><p>Entre com a conta de administrador em <Link to="/app/mais" className="lnk">Mais → Conta e nuvem</Link> e volte aqui.</p></div>}
      {c.email && ok === '?' && <p className="empty">Verificando acesso…</p>}
      {c.email && ok === 'nao' && <div className="card"><p>Esta conta não tem acesso de administrador. Confirme o e-mail da conta e tente de novo.</p></div>}
      {ok === 'sim' && (
        <>
          <div className="seg adm-seg" role="tablist">
            {ABAS.map((a) => <button key={a.k} type="button" role="tab" aria-selected={aba === a.k} className={aba === a.k ? 'on' : ''} onClick={() => setAba(a.k)}>{a.l}</button>)}
          </div>
          <main className="adm-body">
            {aba === 'resumo' && <Resumo />}
            {aba === 'usuarios' && <Usuarios />}
            {aba === 'habitos' && <Habitos />}
            {aba === 'avisos' && <Avisos />}
            {aba === 'midia' && <MidiaTab />}
          </main>
        </>
      )}
    </div>
  )
}
