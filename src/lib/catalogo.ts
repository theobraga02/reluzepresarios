import { useEffect, useState } from 'react'
import { CATALOGO_HABITOS, type HabitoCatalogo } from './catalogo-habitos'
import { carregarCatalogoRemoto } from './nuvem-admin'

/** Catálogo local + hábitos extras criados no painel de admin (se houver conexão), menos os ocultados. */
export function useCatalogo(): HabitoCatalogo[] {
  const [extra, setExtra] = useState<{ extras: HabitoCatalogo[]; ocultos: string[] }>({ extras: [], ocultos: [] })
  useEffect(() => {
    let vivo = true
    carregarCatalogoRemoto().then((r) => vivo && setExtra(r)).catch(() => {})
    return () => { vivo = false }
  }, [])
  const base = CATALOGO_HABITOS.filter((h) => !extra.ocultos.includes(h.id))
  return [...extra.extras, ...base]
}
