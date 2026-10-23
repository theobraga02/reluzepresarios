export interface PlanoItem {
  id: string;
  nome: string;
  descricao: string;
  precoMensal: number | null; // se null, exibe 'Sob consulta' ou 'Valores em breve'
  destaqueTexto: string;
  recursos: string[];
  ctaTexto: string;
  ctaTipo: 'analise' | 'cadastro' | 'whatsapp';
}

export const PLANOS: PlanoItem[] = [
  {
    id: 'previa',
    nome: 'Prévia grátis',
    descricao: '3 buscas rápidas, resultado parcial e sem necessidade de cadastro inicial.',
    precoMensal: 0,
    destaqueTexto: 'Grátis',
    recursos: [
      '3 buscas reais de clientes',
      'Diagnóstico parcial de visibilidade',
      'Identificação de 1 concorrente citado',
      'Sem necessidade de cartão de crédito',
    ],
    ctaTexto: 'Analisar meu negócio',
    ctaTipo: 'analise',
  },
  {
    id: 'completo',
    nome: 'Diagnóstico completo e acompanhamento',
    descricao: 'Dezenas de buscas, concorrentes, fontes, plano de ação e evolução mês a mês.',
    precoMensal: null, // Valores em breve conforme especificado
    destaqueTexto: 'Valores em breve',
    recursos: [
      '48 a 60 buscas simuladas na sua cidade',
      'Auditoria de concorrentes e fontes locais',
      'Plano de ação com textos prontos para copiar',
      'Acompanhamento e evolução da visibilidade',
    ],
    ctaTexto: 'Criar conta grátis',
    ctaTipo: 'cadastro',
  },
  {
    id: 'faca-por-mim',
    nome: 'Faça por mim',
    descricao: 'Setup profissional e manutenção contínua executados diretamente por nossa equipe especializada.',
    precoMensal: null,
    destaqueTexto: 'Sob consulta',
    recursos: [
      'Configuração completa do Perfil da Empresa no Google',
      'Otimização do site e dados estruturados',
      'Criação de FAQ e descrições otimizadas',
      'Gestão ativa de avaliações e relatórios mensais',
    ],
    ctaTexto: 'Falar no WhatsApp',
    ctaTipo: 'whatsapp',
  },
];
