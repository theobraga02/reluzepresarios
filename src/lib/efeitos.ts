/* Efeitos visuais leves. Tudo carregado sob demanda e desligado se a pessoa pede menos movimento. */
import { useEffect, useRef, useState } from 'react'

const reduz = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

export function vibrar(ms: number | number[] = 12) {
  try { navigator.vibrate?.(ms) } catch { /* ignora */ }
}

export async function confete(forte = false) {
  vibrar(forte ? [20, 40, 20] : 12)
  if (reduz()) return
  const { default: c } = await import('canvas-confetti')
  const cores = ['#f4f4f5', '#d4d4d8', '#a1a1aa', '#f3a24b']
  c({ particleCount: forte ? 140 : 60, spread: forte ? 90 : 60, startVelocity: 38, origin: { y: 0.7 }, colors: cores, disableForReducedMotion: true })
}

/** Número que "sobe" até o valor final. */
export function useContagem(alvo: number, ms = 700, casas = 0) {
  const [v, setV] = useState(reduz() ? alvo : 0)
  const de = useRef(0)
  useEffect(() => {
    if (reduz()) { setV(alvo); return }
    const ini = performance.now(), a = de.current
    let raf = 0
    const passo = (t: number) => {
      const k = Math.min(1, (t - ini) / ms)
      const e = 1 - Math.pow(1 - k, 3)
      setV(a + (alvo - a) * e)
      if (k < 1) raf = requestAnimationFrame(passo)
      else de.current = alvo
    }
    raf = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(raf)
  }, [alvo, ms])
  return casas ? Number(v.toFixed(casas)) : Math.round(v)
}

/** Inclinação 3D no toque/mouse (só para cartões de destaque). */
export function inclinar(e: React.PointerEvent<HTMLElement>) {
  if (reduz()) return
  const el = e.currentTarget, r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
  el.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`
}
export const desinclinar = (e: React.PointerEvent<HTMLElement>) => { e.currentTarget.style.transform = '' }
