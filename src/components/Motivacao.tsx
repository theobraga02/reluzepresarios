import { useState } from 'react'
import { useMotivacao } from '../lib/motivacao'
import { inclinar, desinclinar } from '../lib/efeitos'

/** Cartão com foto de motivação do dia; se a foto não carregar, cai num degradê. */
export function Motivacao() {
  const m = useMotivacao()
  const [falhou, setFalhou] = useState('')
  const ok = falhou !== m.foto.url
  return (
    <div className="moti" onPointerMove={inclinar} onPointerLeave={desinclinar}>
      {ok && <img src={m.foto.url} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFalhou(m.foto.url)} />}
      <div className="moti__txt">
        <small>{m.foto.texto || 'Motivação do dia'}</small>
        <p>{m.frase}</p>
      </div>
    </div>
  )
}
