import { Link } from 'react-router-dom'
import { TermosTexto } from '../components/TermosTexto'

export default function Termos() {
  return (
    <div className="gate gate--wide">
      <h1 className="gate__h">Termos de Uso e Privacidade</h1>
      <div className="card"><TermosTexto /></div>
      <Link to="/" className="fine lnk">← Voltar</Link>
    </div>
  )
}
