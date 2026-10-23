import { APP_CONFIG } from './config';

export interface FaqItem {
  pergunta: string;
  resposta: string;
}

export const FAQS: FaqItem[] = [
  {
    pergunta: 'Vocês garantem que vou aparecer?',
    resposta:
      'Não. Nenhuma empresa controla o que a IA responde. O que entregamos é o diagnóstico, o plano e, no serviço completo, a execução das melhorias que aumentam suas chances.',
  },
  {
    pergunta: 'Por que a IA responde diferente a cada vez?',
    resposta:
      'Porque ela gera respostas novas a cada pergunta. Por isso fazemos várias buscas e mostramos uma faixa, não um número único.',
  },
  {
    pergunta: 'Quais IAs vocês consultam?',
    resposta: `Atualmente consultamos ativamente: ${APP_CONFIG.modelosAtivos.join(', ')}.`,
  },
  {
    pergunta: 'Preciso entender de tecnologia?',
    resposta: 'Não. Cada passo do plano vem com o texto pronto para copiar e colar.',
  },
  {
    pergunta: 'Como vocês tratam meus dados?',
    resposta:
      'Usamos o nome, o endereço e os contatos do seu negócio só para a análise. Você pode excluir tudo quando quiser. Veja a nossa Política de Privacidade.',
  },
  {
    pergunta: 'Minha empresa é pequena ou nova. Funciona?',
    resposta:
      'Funciona. Se ainda faltam as bases (como o Perfil no Google), o primeiro passo do plano é criá-las.',
  },
];
