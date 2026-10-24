import type { Area } from './model'

export type Tipo = 'curso' | 'livro' | 'video'

export type Item = {
  id: string
  tipo: Tipo
  area: Area
  titulo: string
  meta: string
  /** true = sugestão ilustrativa, não aponta para um produto real. */
  exemplo?: boolean
}

// Livros: obras reais. Cursos e vídeos: sugestões de exemplo (sem link), marcadas como tal.
export const CONTEUDO: Item[] = [
  { id: 'c1', tipo: 'curso', area: 'foco', titulo: 'Produtividade na Prática', meta: '4h • Online', exemplo: true },
  { id: 'c2', tipo: 'curso', area: 'habitos', titulo: 'Inteligência Emocional', meta: '3h • Online', exemplo: true },
  { id: 'c3', tipo: 'curso', area: 'vendas', titulo: 'Vendas para Empreendedores', meta: '5h • Online', exemplo: true },
  { id: 'c4', tipo: 'curso', area: 'financas', titulo: 'Finanças do seu Negócio', meta: '6h • Online', exemplo: true },
  { id: 'c5', tipo: 'curso', area: 'treino', titulo: 'Treino em Casa em 20 min', meta: '2h • Online', exemplo: true },
  { id: 'c6', tipo: 'curso', area: 'sono', titulo: 'Rotina de Sono Saudável', meta: '1h30 • Online', exemplo: true },

  { id: 'l1', tipo: 'livro', area: 'habitos', titulo: 'Hábitos Atômicos', meta: 'James Clear' },
  { id: 'l2', tipo: 'livro', area: 'biblia', titulo: 'Bíblia Sagrada (Almeida)', meta: 'Diversos' },
  { id: 'l3', tipo: 'livro', area: 'foco', titulo: 'Trabalho Focado', meta: 'Cal Newport' },
  { id: 'l4', tipo: 'livro', area: 'foco', titulo: 'Essencialismo', meta: 'Greg McKeown' },
  { id: 'l5', tipo: 'livro', area: 'financas', titulo: 'O Homem Mais Rico da Babilônia', meta: 'George S. Clason' },
  { id: 'l6', tipo: 'livro', area: 'vendas', titulo: 'Como Fazer Amigos e Influenciar Pessoas', meta: 'Dale Carnegie' },
  { id: 'l7', tipo: 'livro', area: 'sono', titulo: 'Por Que Nós Dormimos', meta: 'Matthew Walker' },
  { id: 'l8', tipo: 'livro', area: 'habitos', titulo: 'O Poder do Hábito', meta: 'Charles Duhigg' },

  { id: 'v1', tipo: 'video', area: 'habitos', titulo: 'Como ter disciplina todos os dias', meta: '12 min • YouTube', exemplo: true },
  { id: 'v2', tipo: 'video', area: 'treino', titulo: 'Treino rápido para quem tem pouco tempo', meta: '20 min • YouTube', exemplo: true },
  { id: 'v3', tipo: 'video', area: 'financas', titulo: 'Fluxo de caixa em 10 minutos', meta: '10 min • YouTube', exemplo: true },
  { id: 'v4', tipo: 'video', area: 'vendas', titulo: 'Como abordar um cliente novo', meta: '15 min • YouTube', exemplo: true },
  { id: 'v5', tipo: 'video', area: 'foco', titulo: 'Foco profundo sem distrações', meta: '14 min • YouTube', exemplo: true },
]

export const TIPO_NOME: Record<Tipo, string> = { curso: 'Curso', livro: 'Livro', video: 'Vídeo' }
