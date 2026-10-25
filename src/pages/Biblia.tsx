import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BottomNav } from '../components/ui'
import { SubHead } from '../components/kit'
import { TRADUCAO, VERSICULOS } from '../lib/conteudo'

export default function Biblia() {
  const [i, setI] = useState(0)
  const v = VERSICULOS[i]
  return (
    <div className="scr">
      <SubHead title="Bíblia" sub={`Plano de Sabedoria · ${i + 1} de ${VERSICULOS.length}`} />
      <div className="scr-body">
        <article className="card reader">
          <small>{v.tema}</small>
          <p>“{v.texto}”</p>
          <b>{v.referencia}</b>
          <small>{TRADUCAO}</small>
        </article>
        <div className="grid2">
          <button type="button" className="act" disabled={i === 0} onClick={() => setI(i - 1)}><ChevronLeft size={14} /> Anterior</button>
          <button type="button" className="act" disabled={i === VERSICULOS.length - 1} onClick={() => setI(i + 1)}>Próximo <ChevronRight size={14} /></button>
        </div>
        <p className="fine">Para registrar uma leitura (livro, capítulo, o que aprendeu), use “Registrar → Bíblia”.</p>
      </div>
      <BottomNav />
    </div>
  )
}
