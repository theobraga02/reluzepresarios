export const APP_CONFIG = {
  nome: 'Visibilidade.AI',
  slogan: 'Veja o que a IA responde sobre o seu negócio',
  whatsappNumero: import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999',
  whatsappMensagemPadrao: 'Olá! Quero que vocês cuidem da visibilidade do meu negócio na IA.',
  emailContato: 'contato@visibilidade.ai',
  dataModo: (import.meta.env.VITE_DATA_MODE as 'mock' | 'live') || 'mock',
  modelosAtivos: ['Gemini 2.5 Flash'],
  avisoVariacao: 'As respostas de IA variam. Este resultado é um retrato do momento da análise.',
};
