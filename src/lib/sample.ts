import type { AppData } from './types'

// Gerador pseudoaleatório determinístico (mulberry32). DADOS DE EXEMPLO — não são reais.
function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Sample = Pick<
  AppData,
  | 'habitLog' | 'appointments' | 'incomeRecords' | 'saleRecords' | 'workoutRecords' | 'bibleRecords'
  | 'focusRecords' | 'readingRecords' | 'sleepRecords' | 'clients' | 'networkingContacts'
>

export function gerarExemplo(habitIds: string[], diaAtras: (n: number) => string, diaFrente: (n: number) => string): Sample {
  const rand = rng(2026)
  const pick = <T,>(a: T[]) => a[Math.floor(rand() * a.length)]
  const out: Sample = {
    habitLog: {}, appointments: [], incomeRecords: [], saleRecords: [], workoutRecords: [], bibleRecords: [],
    focusRecords: [], readingRecords: [], sleepRecords: [], clients: [], networkingContacts: [],
  }
  const dias = 120
  let n = 0
  const id = (p: string) => `ex-${p}-${n++}`

  for (let i = dias; i >= 0; i--) {
    const date = diaAtras(i)
    const tendencia = (dias - i) / dias // melhora leve ao longo do tempo
    const nHab = Math.min(habitIds.length, Math.round(1 + rand() * 3 + tendencia * 2))
    out.habitLog[date] = habitIds.slice(0, nHab)

    if (rand() < 0.4 + tendencia * 0.3)
      out.workoutRecords.push({
        id: id('w'), date, effort: 5 + Math.round(rand() * 4), notes: '',
        exercises: [{ name: pick(['Agachamento', 'Supino', 'Corrida', 'Remada']), sets: 3, reps: 10, load: 20 + Math.round(rand() * 40) }],
      })
    if (rand() < 0.8) {
      out.incomeRecords.push({
        id: id('i'), date, amount: Math.round(80 + rand() * 500), category: pick(['Fornecedores', 'Operacional', 'Marketing']),
        description: 'Gasto de exemplo', type: 'saida', status: 'recebido',
      })
      if (rand() < 0.6)
        out.incomeRecords.push({
          id: id('i'), date, amount: Math.round(200 + rand() * 1400), category: 'Serviços',
          description: 'Entrada de exemplo', type: 'entrada', status: 'recebido',
        })
    }
    const vendas = rand() < 0.55 ? Math.round(1 + rand() * 2) : 0
    for (let v = 0; v < vendas; v++) {
      const unit = Math.round(150 + rand() * 900)
      out.saleRecords.push({
        id: id('s'), date, product: pick(['Consultoria', 'Pacote mensal', 'Serviço avulso']), quantity: 1,
        unitPrice: unit, total: unit, clientName: '', channel: pick(['WhatsApp', 'Indicação', 'Instagram / Redes']),
      })
    }
    if (rand() < 0.6) out.bibleRecords.push({ id: id('b'), date, plan: 'Geral', book: 'Provérbios', chapter: 1 + Math.floor(rand() * 30) })
    if (rand() < 0.75) out.focusRecords.push({ id: id('f'), date, durationMinutes: pick([25, 45, 60, 90]) })
    if (rand() < 0.5) out.readingRecords.push({ id: id('l'), date, bookTitle: 'Livro de exemplo', pagesRead: 8 + Math.round(rand() * 20) })
    if (rand() < 0.85)
      out.sleepRecords.push({
        id: id('z'), date, bedtime: pick(['22:30', '23:00', '23:45', '00:30']), wakeTime: pick(['06:00', '06:30', '07:00']),
        quality: 2 + Math.round(rand() * 3),
      })
  }

  const hoje = diaAtras(0)
  const clientes: [string, 'conheci' | 'conversei' | 'proposta' | 'fechou'][] = [
    ['Cliente exemplo A', 'conheci'], ['Cliente exemplo B', 'conversei'], ['Cliente exemplo C', 'proposta'], ['Cliente exemplo D', 'fechou'],
  ]
  clientes.forEach(([name, stage]) => out.clients.push({ id: id('c'), name, stage, notes: 'Anotação de exemplo', createdAt: diaAtras(5) }))
  out.networkingContacts.push({
    id: id('n'), name: 'Contato exemplo', eventName: 'Evento de exemplo', metAt: diaAtras(1), notes: 'Conversa de exemplo', followUpDone: false,
  })
  out.appointments.push(
    { id: id('a'), title: 'Reunião de exemplo', date: hoje, time: '15:00', location: 'Online', type: 'compromisso' },
    { id: id('a'), title: 'Evento de networking (exemplo)', date: diaFrente(3), time: '19:00', location: 'A definir', type: 'networking' },
  )
  return out
}
