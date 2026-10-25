/* Modelo de dados — portado do app antigo "empresarios" e estendido. */

export type Area = 'habitos' | 'treino' | 'financas' | 'vendas' | 'biblia' | 'foco' | 'leitura' | 'sono'

/** Áreas de hábito do app antigo. */
export type HabitArea = 'corpo' | 'fe' | 'foco' | 'financas' | 'vendas' | 'aprender' | 'sono' | 'networking'

export interface Habit {
  id: string
  title: string
  area: HabitArea
  icon: string
  target?: number
  unit?: string
}

export interface Appointment {
  id: string
  title: string
  date: string
  time: string
  location?: string
  type: 'compromisso' | 'networking' | 'habito'
}

export interface IncomeRecord {
  id: string
  date: string
  amount: number
  category: string
  description: string
  type: 'entrada' | 'saida'
  status: 'recebido' | 'a_receber'
  isRecurring?: boolean
}

export interface SaleRecord {
  id: string
  date: string
  product: string
  quantity: number
  unitPrice: number
  total: number
  clientName?: string
  channel?: string
}

export interface WorkoutRecord {
  id: string
  date: string
  exercises: Array<{ name: string; sets: number; reps: number; load: number }>
  effort: number
  notes?: string
}

export interface BibleRecord {
  id: string
  date: string
  plan: string
  book: string
  chapter: number
  highlightVerse?: string
  learned?: string
  gratitude?: string
}

export interface FocusRecord {
  id: string
  date: string
  durationMinutes: number
}

export interface ReadingRecord {
  id: string
  date: string
  bookTitle: string
  pagesRead: number
  notes?: string
}

export interface SleepRecord {
  id: string
  date: string
  bedtime: string
  wakeTime: string
  quality: number
}

export interface BusinessProfile {
  productName: string
  area: string
  price: string
  targetClientTags: string[]
  clientPain: string
  city: string
}

export type Stage = 'conheci' | 'conversei' | 'proposta' | 'fechou'

export interface Client {
  id: string
  name: string
  stage: Stage
  notes?: string
  createdAt: string
  followUpAt?: string
}

export interface NetworkingContact {
  id: string
  name: string
  eventName: string
  metAt: string
  notes?: string
  followUpDone: boolean
}

export interface NetworkingEvent {
  id: string
  title: string
  date: string
  time: string
  isOnline: boolean
  priceType: 'gratuito' | 'pago'
  price?: string
  location: string
  city: string
  matchReason: string
  sourceName: string
  sourceUrl: string
  /** true = evento de exemplo (não é uma busca real). */
  isExample?: boolean
  /** Preenchido quando o link foi aberto com sucesso pelo servidor. */
  verifiedAt?: string
}

export interface ApproachScript {
  openingPhrase: string
  questions: string[]
  followUpRequest: string
  provider?: string
}

export interface Track {
  id: string
  title: string
  category: 'vendas' | 'habitos' | 'financas'
  totalWeeks: number
  practices: string[]
}

export type Tipo = 'curso' | 'livro' | 'video' | 'plataforma'

/** Conteúdo de aprendizado (curso, livro, vídeo ou plataforma gratuita). */
export interface Item {
  id: string
  tipo: Tipo
  area: Area
  titulo: string
  meta: string
  url?: string
  /** true = sugestão ilustrativa. */
  exemplo?: boolean
  fonte: 'curadoria' | 'ia'
  /** Data (YYYY-MM-DD) em que o servidor conseguiu abrir o link. */
  verificadoEm?: string
  motivo?: string
}

export interface CoachReport {
  mensagem: string
  fortes: string[]
  melhorar: string[]
  recomendacoes: string[]
  /** Áreas citadas pela IA, usadas para casar cursos do catálogo. */
  areas?: Area[]
  provider?: string
}

export interface Settings {
  metas: { vendasDia: number; focoMin: number; leituraPaginas: number; sonoHoras: number; treinosSemana: number }
  /** Permissão para enviar um resumo (sem textos livres) à IA. */
  aiConsent: boolean
  reminderEnabled: boolean
  reminderTime: string
}

export interface AppData {
  v: 2
  habits: Habit[]
  /** Hábitos concluídos por dia: { 'YYYY-MM-DD': [habitId, ...] } */
  habitLog: Record<string, string[]>
  appointments: Appointment[]
  incomeRecords: IncomeRecord[]
  saleRecords: SaleRecord[]
  workoutRecords: WorkoutRecord[]
  bibleRecords: BibleRecord[]
  focusRecords: FocusRecord[]
  readingRecords: ReadingRecord[]
  sleepRecords: SleepRecord[]
  businessProfile: BusinessProfile
  clients: Client[]
  networkingContacts: NetworkingContact[]
  savedCourses: string[]
  /** Semana atual de cada trilha (1 = primeira). */
  trilhas: Record<string, number>
  settings: Settings
  aiCourses: Item[]
  aiCoursesAt: string
  aiEvents: NetworkingEvent[]
  aiEventsAt: string
  coachCache?: { date: string; hash: string; report: CoachReport }
  /** true quando os registros vieram de "dados de exemplo". */
  exemplo: boolean
}
