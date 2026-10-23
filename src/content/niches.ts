export interface NichoDef {
  nome: string;
  slug: string;
  itens: string[];
  atributos: string[];
  ocasioes: string[];
  perfis: string[];
}

export const NICHOS_INICIAIS: NichoDef[] = [
  {
    nome: 'Pizzaria',
    slug: 'pizzaria',
    itens: ['pizza de calabresa', 'pizza doce', 'rodízio de pizza'],
    atributos: ['delivery rápido', 'barata', 'forno a lenha', 'aberta no domingo'],
    ocasioes: ['aniversário', 'encontro', 'reunião de amigos'],
    perfis: ['família com crianças', 'grupo grande'],
  },
  {
    nome: 'Hamburgueria',
    slug: 'hamburgueria',
    itens: ['smash burger', 'burger artesanal', 'combo'],
    atributos: ['delivery', 'barato', 'vegetariano', 'aberta até tarde'],
    ocasioes: ['encontro', 'aniversário'],
    perfis: ['grupo de amigos'],
  },
  {
    nome: 'Clínica odontológica',
    slug: 'clinica-odontologica',
    itens: ['implante', 'clareamento', 'aparelho', 'limpeza'],
    atributos: ['urgência', 'plano odontológico', 'atendimento infantil', 'aceita cartão'],
    ocasioes: ['dor de dente', 'avaliação inicial'],
    perfis: ['crianças', 'idosos'],
  },
  {
    nome: 'Barbearia',
    slug: 'barbearia',
    itens: ['corte masculino', 'barba', 'degradê'],
    atributos: ['agendamento por WhatsApp', 'horário noturno', 'atende sem hora marcada'],
    ocasioes: ['casamento', 'formatura'],
    perfis: [],
  },
  {
    nome: 'Salão de beleza',
    slug: 'salao-beleza',
    itens: ['corte', 'coloração', 'escova', 'unhas'],
    atributos: ['agendamento online', 'aos sábados'],
    ocasioes: ['noiva', 'formatura', 'festa'],
    perfis: ['cabelo cacheado'],
  },
  {
    nome: 'Oficina mecânica',
    slug: 'oficina-mecanica',
    itens: ['revisão', 'troca de óleo', 'freios', 'alinhamento'],
    atributos: ['orçamento grátis', 'aberta aos sábados'],
    ocasioes: ['viagem', 'barulho no carro'],
    perfis: [],
  },
  {
    nome: 'Academia',
    slug: 'academia',
    itens: ['musculação', 'pilates', 'funcional'],
    atributos: ['aula experimental', '24 horas', 'perto de mim'],
    ocasioes: [],
    perfis: ['iniciantes', 'idosos'],
  },
  {
    nome: 'Pet shop / veterinário',
    slug: 'pet-shop',
    itens: ['banho e tosa', 'consulta', 'vacina'],
    atributos: ['leva e traz', 'emergência 24 horas'],
    ocasioes: [],
    perfis: [],
  },
  {
    nome: 'Escola ou loja de esporte',
    slug: 'esporte',
    itens: ['aula para iniciante', 'aluguel de equipamento'],
    atributos: ['aula em inglês', 'equipamento incluso'],
    ocasioes: ['turista', 'melhor época'],
    perfis: [],
  },
  {
    nome: 'Restaurante',
    slug: 'restaurante',
    itens: ['feijoada', 'frutos do mar'],
    atributos: ['almoço executivo', 'estacionamento', 'ar-condicionado'],
    ocasioes: ['aniversário', 'jantar romântico'],
    perfis: [],
  },
];
