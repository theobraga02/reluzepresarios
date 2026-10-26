import { useState } from 'react'
import { Btn, Field, Sheet } from './kit'
import { HABIT_AREAS } from '../lib/defaults'
import { addHabit, uid } from '../lib/store'
import type { HabitArea } from '../lib/types'

export function NovoHabito({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [area, setArea] = useState<HabitArea>('foco')
  const [alvo, setAlvo] = useState('')
  const [unidade, setUnidade] = useState('')
  const info = HABIT_AREAS.find((a) => a.id === area)!
  return (
    <Sheet title="Novo hábito" onClose={onClose}>
      <Field label="Nome do hábito" text value={title} onChange={setTitle} placeholder="Ex.: Beber 2 L de água" />
      <div className="fld">
        <span>Área</span>
        <div className="chips">
          {HABIT_AREAS.map((a) => (
            <button key={a.id} type="button" className={area === a.id ? 'on' : ''} onClick={() => setArea(a.id)}>{a.icon} {a.label}</button>
          ))}
        </div>
      </div>
      <div className="grid2">
        <Field label="Meta (opcional)" value={alvo} onChange={setAlvo} />
        <Field label="Unidade" text value={unidade} onChange={setUnidade} placeholder="min, páginas…" />
      </div>
      <Btn
        disabled={!title.trim()}
        onClick={() => {
          addHabit({ id: uid('h'), title: title.trim(), area, icon: info.icon, target: parseFloat(alvo.replace(',', '.')) || undefined, unit: unidade.trim() || undefined })
          onClose()
        }}
      >
        Adicionar hábito
      </Btn>
    </Sheet>
  )
}
