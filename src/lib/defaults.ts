import type { AppData, Habit, HabitArea, Area } from './types'

export const HABITOS_INICIAIS: Habit[] = [
  { id: 'h1', title: 'Bíblia e oração matinal', area: 'fe', icon: '📖', target: 1 },
  { id: 'h2', title: 'Treino físico funcional', area: 'corpo', icon: '💪', target: 1 },
  { id: 'h3', title: 'Bloco de foco profundo 25 min', area: 'foco', icon: '🎯', target: 25, unit: 'min' },
  { id: 'h4', title: 'Prospecção / ligar para 3 clientes', area: 'vendas', icon: '📞', target: 3, unit: 'clientes' },
  { id: 'h5', title: 'Leitura de negócios 10 min', area: 'aprender', icon: '📚', target: 10, unit: 'min' },
]

/** Cada área de hábito alimenta uma área de registro (como no app antigo). */
export const HABIT_TO_AREA: Record<HabitArea, Area | null> = {
  corpo: 'treino',
  fe: 'biblia',
  foco: 'foco',
  financas: 'financas',
  vendas: 'vendas',
  aprender: 'leitura',
  sono: 'sono',
  networking: null,
}

export const HABIT_AREAS: { id: HabitArea; label: string; icon: string }[] = [
  { id: 'fe', label: 'Fé', icon: '📖' },
  { id: 'corpo', label: 'Corpo', icon: '💪' },
  { id: 'foco', label: 'Foco', icon: '🎯' },
  { id: 'financas', label: 'Finanças', icon: '💰' },
  { id: 'vendas', label: 'Vendas', icon: '📞' },
  { id: 'aprender', label: 'Aprender', icon: '📚' },
  { id: 'sono', label: 'Sono', icon: '🌙' },
  { id: 'networking', label: 'Networking', icon: '🤝' },
]

export function getDefaultData(): AppData {
  return {
    v: 2,
    habits: HABITOS_INICIAIS,
    habitLog: {},
    appointments: [],
    incomeRecords: [],
    saleRecords: [],
    workoutRecords: [],
    bibleRecords: [],
    focusRecords: [],
    readingRecords: [],
    sleepRecords: [],
    businessProfile: { productName: '', area: '', price: '', targetClientTags: [], clientPain: '', city: '' },
    clients: [],
    networkingContacts: [],
    savedCourses: [],
    trilhas: {},
    leitor: { marcados: [] },
    settings: {
      metas: { vendasDia: 3, focoMin: 60, leituraPaginas: 10, sonoHoras: 8, treinosSemana: 4 },
      aiConsent: false,
      reminderEnabled: false,
      reminderTime: '08:00',
    },
    aiCourses: [],
    aiCoursesAt: '',
    aiEvents: [],
    aiEventsAt: '',
    exemplo: false,
  }
}
