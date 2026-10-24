import { Link } from 'react-router-dom'
import { ArrowLeft, Download, FlaskConical, Trash2 } from 'lucide-react'
import { exportJSON, loadSample, resetAll, useStore } from '../lib/store'

export default function Perfil() {
  const s = useStore()
  const total = Object.keys(s.logs).length

  function baixar() {
    const url = URL.createObjectURL(new Blob([exportJSON()], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'empresario-dados.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="scr">
      <header className="scr-head scr-head--back">
        <Link to="/app" className="x-btn" aria-label="Voltar"><ArrowLeft size={16} strokeWidth={1.6} /></Link>
        <div>
          <h2>Dados e privacidade</h2>
          <p className="scr-sub">{total} {total === 1 ? 'dia registrado' : 'dias registrados'}</p>
        </div>
      </header>
      <div className="scr-body">
        <div className="card list-card">
          <b>Seus dados ficam no seu aparelho</b>
          <p className="fine" style={{ margin: 0 }}>
            Nada é enviado para servidores. Você pode exportar tudo em JSON ou apagar definitivamente quando quiser.
          </p>
        </div>

        <button type="button" className="act" onClick={baixar}><Download size={15} strokeWidth={1.6} />Exportar meus dados (JSON)</button>
        <button type="button" className="act" onClick={loadSample}>
          <FlaskConical size={15} strokeWidth={1.6} />Carregar dados de exemplo
        </button>
        <button
          type="button" className="act act--danger"
          onClick={() => { if (window.confirm('Apagar todos os registros deste aparelho? Isso não pode ser desfeito.')) resetAll() }}
        >
          <Trash2 size={15} strokeWidth={1.6} />Apagar tudo
        </button>

        <p className="fine">
          “Dados de exemplo” substitui seus registros por dias fictícios, só para você ver os gráficos. Se estiver passando por
          sofrimento emocional, ligue 188 (CVV, 24 h).
        </p>
      </div>
    </div>
  )
}
