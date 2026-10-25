import { useEffect, useId, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronLeft, X } from 'lucide-react'

/** Folha deslizante (modal) usada nos formulários. */
export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [onClose])
  return (
    <div className="sheet-bg" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <header>
          <b>{title}</b>
          <button type="button" className="x-btn" onClick={onClose} aria-label="Fechar"><X size={16} strokeWidth={1.6} /></button>
        </header>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  )
}

export function Field({
  label, value, onChange, suffix, text, placeholder, type, multiline,
}: {
  label: string; value: string; onChange: (v: string) => void; suffix?: string; text?: boolean
  placeholder?: string; type?: 'date' | 'time'; multiline?: boolean
}) {
  const id = useId()
  return (
    <label className="fld" htmlFor={id}>
      <span>{label}</span>
      <div>
        {multiline ? (
          <textarea id={id} rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input
            id={id} type={type ?? 'text'} inputMode={type || text ? undefined : 'decimal'} value={value}
            placeholder={placeholder ?? (text || type ? '' : '0')}
            onChange={(e) => {
              const v = e.target.value
              if (text || type || /^[0-9]*[.,]?[0-9]*$/.test(v)) onChange(v)
            }}
          />
        )}
        {suffix && <em>{suffix}</em>}
      </div>
    </label>
  )
}

export function Chips<T extends string>({
  label, value, options, onChange,
}: { label?: string; value: T; options: { v: T; l: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="fld">
      {label && <span>{label}</span>}
      <div className="chips" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.v} type="button" role="radio" aria-checked={value === o.v} className={value === o.v ? 'on' : ''} onClick={() => onChange(o.v)}>
            {o.l}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Toggle({ on, onChange, children }: { on: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <button type="button" className={`toggle ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => onChange(!on)}>
      <span>{on && <Check size={11} strokeWidth={3} />}</span>
      {children}
    </button>
  )
}

export function Btn({
  children, onClick, kind = 'main', disabled, type = 'button',
}: { children: ReactNode; onClick?: () => void; kind?: 'main' | 'ghost' | 'danger'; disabled?: boolean; type?: 'button' | 'submit' }) {
  return (
    <button type={type} className={`kbtn kbtn--${kind}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export function SubHead({ title, sub, back = '/app/mais' }: { title: string; sub?: string; back?: string }) {
  return (
    <header className="scr-head scr-head--back">
      <Link to={back} className="icon-btn" aria-label="Voltar"><ChevronLeft size={18} strokeWidth={1.6} /></Link>
      <div>
        <h2>{title}</h2>
        {sub && <p className="scr-sub">{sub}</p>}
      </div>
    </header>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>
}

/** Converte "12,5" em 12.5 (nunca negativo). */
export const num = (v: string) => Math.max(0, parseFloat(v.replace(',', '.')) || 0)
