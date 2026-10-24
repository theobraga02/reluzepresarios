const pad = (n: number) => String(n).padStart(2, '0')

export const keyOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayKey = () => keyOf(new Date())

export function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function fromKey(k: string) {
  const [y, m, d] = k.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]
export const MESES_CURTOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
export const DIAS_CURTOS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export function dateLabel(d: Date) {
  return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`
}

export function dateLabelLong(d: Date) {
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

export function dayOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 0)
  return Math.floor((d.getTime() - start.getTime()) / 86_400_000)
}
