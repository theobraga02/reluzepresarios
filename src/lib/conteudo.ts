import type { ApproachScript, BusinessProfile, Item, NetworkingEvent, Track } from './types'
import { addDays, keyOf } from './date'

/* ───────── Versículos ─────────
 * Texto: Almeida 1911 (domínio público), extraído do mesmo arquivo usado no leitor. A ortografia é a da edição original. */
import versiculosJson from './versiculos.json'

export const TRADUCAO = 'Almeida 1911'

export const VERSICULOS = (versiculosJson as { ref: string; tema: string; texto: string }[]).map((v) => ({
  referencia: v.ref,
  tema: v.tema,
  texto: /[.!?:;]$/.test(v.texto) ? v.texto : v.texto + '.',
}))

/* ───────── Dicas de networking (do app antigo) ───────── */
export const DICAS_NETWORKING = [
  'Chegue cedo aos eventos: os primeiros 15 minutos são os melhores para conversar com quem ainda está relaxado.',
  'Prepare uma frase curta sobre o que você faz e para quem. Menos de 15 palavras.',
  'Pergunte mais do que fale. Quem ouve bem é lembrado como interessante.',
  'Anote o nome e um detalhe de cada pessoa que conhecer. Ajuda no follow-up.',
  'Follow-up em 48h: uma mensagem curta e personalizada faz toda a diferença.',
  'Prefira conexões profundas a muitas superficiais. 3 conversas reais valem mais que 20 cartões trocados.',
  'Leve cartão ou QR code do seu contato. Facilita para a outra pessoa.',
]

/* ───────── Trilhas (do app antigo; as práticas semanais foram ampliadas) ───────── */
export const TRILHAS: Track[] = [
  {
    id: 'tr1', title: 'Vendas na Prática', category: 'vendas', totalWeeks: 8,
    practices: [
      'Escreva em uma frase o que você vende e para quem.',
      'Ligar para 3 clientes antigos esta semana.',
      'Liste 10 pessoas que poderiam precisar do seu produto e fale com 3.',
      'Registre toda objeção que ouvir e escreva uma resposta para cada.',
      'Envie 5 propostas claras, com preço e prazo.',
      'Faça follow-up com todas as propostas abertas.',
      'Peça uma indicação a cada cliente satisfeito.',
      'Revise seus números do mês: o que funcionou? Repita isso.',
    ],
  },
  {
    id: 'tr2', title: 'Hábitos do Empreendedor', category: 'habitos', totalWeeks: 6,
    practices: [
      'Acordar 30 min mais cedo e planejar o dia.',
      'Definir as 3 prioridades do dia na noite anterior.',
      'Fazer um bloco de foco profundo de 25 min sem celular.',
      'Fazer uma revisão de 10 min no fim do dia.',
      'Tirar um dia da semana para planejar a semana seguinte.',
      'Escolher 1 hábito para manter pelos próximos 30 dias.',
    ],
  },
  {
    id: 'tr3', title: 'Finanças do Pequeno Negócio', category: 'financas', totalWeeks: 4,
    practices: [
      'Anotar todas as entradas e saídas da semana.',
      'Separar o dinheiro da empresa do dinheiro pessoal.',
      'Listar custos fixos e variáveis do mês.',
      'Definir uma meta de reserva e um valor semanal para ela.',
    ],
  },
]

/* ───────── Catálogo de aprendizado ───────── */
const yt = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`

export const CATALOGO: Item[] = [
  // Plataformas gratuitas (links de portais; confira a oferta atual dentro de cada site)
  { id: 'p1', tipo: 'plataforma', area: 'vendas', titulo: 'Sebrae — cursos online', meta: 'Plataforma · gratuita', url: 'https://www.sebrae.com.br/sites/PortalSebrae/cursosonline', fonte: 'curadoria' },
  { id: 'p2', tipo: 'plataforma', area: 'vendas', titulo: 'Senac EAD', meta: 'Plataforma · cursos gratuitos', url: 'https://www.ead.senac.br', fonte: 'curadoria' },
  { id: 'p3', tipo: 'plataforma', area: 'habitos', titulo: 'Escola Virtual — Fundação Bradesco', meta: 'Plataforma · gratuita', url: 'https://www.ev.org.br', fonte: 'curadoria' },
  { id: 'p4', tipo: 'plataforma', area: 'foco', titulo: 'Microsoft Learn (português)', meta: 'Plataforma · gratuita', url: 'https://learn.microsoft.com/pt-br/training/', fonte: 'curadoria' },
  { id: 'p5', tipo: 'plataforma', area: 'vendas', titulo: 'Google Skillshop', meta: 'Plataforma · gratuita', url: 'https://skillshop.withgoogle.com', fonte: 'curadoria' },
  { id: 'p6', tipo: 'plataforma', area: 'financas', titulo: 'Khan Academy (português)', meta: 'Plataforma · gratuita', url: 'https://pt.khanacademy.org', fonte: 'curadoria' },
  { id: 'p7', tipo: 'plataforma', area: 'foco', titulo: 'edX — cursos para auditar', meta: 'Plataforma · gratuito sem certificado', url: 'https://www.edx.org', fonte: 'curadoria' },
  { id: 'p8', tipo: 'plataforma', area: 'foco', titulo: 'Coursera — modo ouvinte', meta: 'Plataforma · gratuito sem certificado', url: 'https://www.coursera.org', fonte: 'curadoria' },

  // Cursos do app antigo (títulos de exemplo: procure no portal indicado)
  { id: 'fc1', tipo: 'curso', area: 'vendas', titulo: 'Técnicas de Negociação e Vendas', meta: 'Sebrae · procure no portal', url: 'https://www.sebrae.com.br/sites/PortalSebrae/cursosonline', exemplo: true, fonte: 'curadoria' },
  { id: 'fc2', tipo: 'curso', area: 'financas', titulo: 'Gestão Financeira para Micro Empresas', meta: 'Sebrae · procure no portal', url: 'https://www.sebrae.com.br/sites/PortalSebrae/cursosonline', exemplo: true, fonte: 'curadoria' },
  { id: 'fc3', tipo: 'curso', area: 'vendas', titulo: 'Marketing Digital para Pequenos Negócios', meta: 'Senac EAD · procure no portal', url: 'https://www.ead.senac.br', exemplo: true, fonte: 'curadoria' },

  // Livros (obras reais)
  { id: 'l1', tipo: 'livro', area: 'habitos', titulo: 'Hábitos Atômicos', meta: 'James Clear', fonte: 'curadoria' },
  { id: 'l2', tipo: 'livro', area: 'biblia', titulo: 'Bíblia Sagrada (Almeida)', meta: 'Diversos', fonte: 'curadoria' },
  { id: 'l3', tipo: 'livro', area: 'foco', titulo: 'Trabalho Focado', meta: 'Cal Newport', fonte: 'curadoria' },
  { id: 'l4', tipo: 'livro', area: 'foco', titulo: 'Essencialismo', meta: 'Greg McKeown', fonte: 'curadoria' },
  { id: 'l5', tipo: 'livro', area: 'financas', titulo: 'O Homem Mais Rico da Babilônia', meta: 'George S. Clason', fonte: 'curadoria' },
  { id: 'l6', tipo: 'livro', area: 'vendas', titulo: 'Como Fazer Amigos e Influenciar Pessoas', meta: 'Dale Carnegie', fonte: 'curadoria' },
  { id: 'l7', tipo: 'livro', area: 'sono', titulo: 'Por Que Nós Dormimos', meta: 'Matthew Walker', fonte: 'curadoria' },
  { id: 'l8', tipo: 'livro', area: 'habitos', titulo: 'O Poder do Hábito', meta: 'Charles Duhigg', fonte: 'curadoria' },
  { id: 'l9', tipo: 'livro', area: 'leitura', titulo: 'A Estratégia do Oceano Azul', meta: 'W. Chan Kim e Renée Mauborgne', fonte: 'curadoria' },

  // Vídeos (abrem a busca do YouTube — os títulos são sugestões de tema; "ação de 5 min" é do app antigo)
  { id: 'v1', tipo: 'video', area: 'vendas', titulo: 'Como fazer prospecção ativa eficiente', meta: 'Thiago Concer · busca no YouTube', url: yt('prospecção ativa eficiente Thiago Concer'), motivo: 'Ação de 5 min: escreva 3 nomes de clientes potenciais para ligar amanhã.', exemplo: true, fonte: 'curadoria' },
  { id: 'v2', tipo: 'video', area: 'habitos', titulo: 'O poder dos hábitos pequenos para empreendedores', meta: 'Me Poupe! · busca no YouTube', url: yt('hábitos pequenos empreendedores Me Poupe'), motivo: 'Ação de 5 min: identifique um hábito pequeno que você quer criar esta semana.', exemplo: true, fonte: 'curadoria' },
  { id: 'v3', tipo: 'video', area: 'financas', titulo: 'Fluxo de caixa para pequenos negócios', meta: 'Sebrae · busca no YouTube', url: yt('fluxo de caixa pequenos negócios Sebrae'), motivo: 'Ação de 5 min: abra uma planilha e registre as entradas desta semana.', exemplo: true, fonte: 'curadoria' },
  { id: 'v4', tipo: 'video', area: 'foco', titulo: 'Foco profundo sem distrações', meta: 'busca no YouTube', url: yt('foco profundo sem distrações produtividade'), exemplo: true, fonte: 'curadoria' },
  { id: 'v5', tipo: 'video', area: 'treino', titulo: 'Treino rápido para quem tem pouco tempo', meta: 'busca no YouTube', url: yt('treino rápido 20 minutos em casa'), exemplo: true, fonte: 'curadoria' },
  { id: 'v6', tipo: 'video', area: 'sono', titulo: 'Como melhorar a qualidade do sono', meta: 'busca no YouTube', url: yt('como melhorar a qualidade do sono'), exemplo: true, fonte: 'curadoria' },
]

/** Itens fixos usados só nas vitrines da landing (nomes da imagem de referência; ilustrativos). */
export const CATALOGO_DEMO: Item[] = [
  { id: 'd1', tipo: 'curso', area: 'foco', titulo: 'Produtividade na Prática', meta: '4h • Online', exemplo: true, fonte: 'curadoria' },
  { id: 'd2', tipo: 'curso', area: 'habitos', titulo: 'Inteligência Emocional', meta: '3h • Online', exemplo: true, fonte: 'curadoria' },
  { id: 'd3', tipo: 'curso', area: 'vendas', titulo: 'Vendas para Empreendedores', meta: '5h • Online', exemplo: true, fonte: 'curadoria' },
  { id: 'd4', tipo: 'curso', area: 'financas', titulo: 'Finanças do seu Negócio', meta: '6h • Online', exemplo: true, fonte: 'curadoria' },
  { id: 'd5', tipo: 'curso', area: 'sono', titulo: 'Rotina de Sono Saudável', meta: '1h30 • Online', exemplo: true, fonte: 'curadoria' },
]

export const TIPO_NOME: Record<Item['tipo'], string> = { curso: 'Curso', livro: 'Livro', video: 'Vídeo', plataforma: 'Plataforma' }

/* ───────── Eventos de exemplo (do app antigo — NÃO são eventos reais) ───────── */
export function eventosExemplo(): NetworkingEvent[] {
  const d = (n: number) => keyOf(addDays(new Date(), n))
  return [
    {
      id: 'ev-1', title: 'Encontro de Empreendedores Locais e Parcerias', date: d(2), time: '19:00', isOnline: false, priceType: 'gratuito',
      location: 'Hub de Inovação & Coworking Central', city: 'São Paulo',
      matchReason: 'Reúne donos de pequenos negócios que buscam fornecedores e prestadores de serviços de confiança.',
      sourceName: 'Sympla', sourceUrl: 'https://www.sympla.com.br/eventos/sao-paulo-sp/empreendedorismo', isExample: true,
    },
    {
      id: 'ev-2', title: 'Rodada de Negócios e Vendas B2B', date: d(5), time: '14:00', isOnline: true, priceType: 'gratuito',
      location: 'Transmissão online', city: 'Online',
      matchReason: 'Oportunidade para apresentar soluções diretas para dores de empresas da região.',
      sourceName: 'Sebrae', sourceUrl: 'https://www.sebrae.com.br/sites/PortalSebrae/cursosonline', isExample: true,
    },
    {
      id: 'ev-3', title: 'Café & Conexões: Mulheres Empreendedoras', date: d(9), time: '08:30', isOnline: false, priceType: 'pago',
      price: 'valor de exemplo', location: 'Café (exemplo)', city: 'São Paulo',
      matchReason: 'Ambiente acolhedor para troca de indicações e parcerias de longo prazo.',
      sourceName: 'Eventbrite', sourceUrl: 'https://www.eventbrite.com.br/d/brazil/networking/', isExample: true,
    },
    {
      id: 'ev-4', title: 'Meetup: Gestão, Vendas e Finanças na Prática', date: d(14), time: '19:30', isOnline: true, priceType: 'gratuito',
      location: 'Plataforma online', city: 'Online',
      matchReason: 'Espaço aberto de perguntas e networking ativo em grupos de acompanhamento mútuo.',
      sourceName: 'Meetup', sourceUrl: 'https://www.meetup.com/find/?keywords=empreendedorismo', isExample: true,
    },
  ]
}

/** Roteiro de abordagem local (usado quando a IA não está disponível). */
export function roteiroLocal(event: NetworkingEvent, p: BusinessProfile): ApproachScript {
  const produto = p.productName || 'meu trabalho'
  const area = p.area || 'minha área'
  const publico = p.targetClientTags.length ? p.targetClientTags.join(', ') : 'pequenas empresas'
  const dor = p.clientPain || 'ganhar tempo e ter mais resultados'
  return {
    openingPhrase: `Olá! Prazer, sou [seu nome]${p.city ? `, aqui de ${p.city}` : ''}. O que te trouxe ao “${event.title}”? Vim conhecer quem está empreendendo na área!`,
    questions: [
      `Hoje, qual tem sido o maior desafio no seu negócio para ${dor}?`,
      `Você costuma atender ${publico}? Como tem sido o fluxo de indicações por aí?`,
      `Eu trabalho com ${produto} em ${area}. Se pudesse resolver um gargalo esta semana, qual seria?`,
    ],
    followUpRequest:
      'Gostei muito da nossa conversa! Posso te chamar no WhatsApp amanhã ou depois para te conectar com uma indicação ou tomarmos um café virtual de 15 minutos?',
  }
}
