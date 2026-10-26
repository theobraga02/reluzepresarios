import type { HabitArea } from './types'

/* Catálogo de hábitos: ideias comuns em guias de saúde (OMS, AASM) e em livros como "Hábitos Atômicos",
 * "Trabalho Focado" e "Essencialismo", adaptadas a quem empreende. São sugestões gerais, não orientação médica. */

export type CatId = 'fe' | 'corpo' | 'sono' | 'mente' | 'foco' | 'aprender' | 'financas' | 'vendas' | 'rede' | 'casa' | 'relacoes'

export const CATEGORIAS: { id: CatId; nome: string; icone: string; area: HabitArea }[] = [
  { id: 'fe', nome: 'Fé e propósito', icone: '📖', area: 'fe' },
  { id: 'corpo', nome: 'Corpo e saúde', icone: '💪', area: 'corpo' },
  { id: 'sono', nome: 'Sono e descanso', icone: '🌙', area: 'sono' },
  { id: 'mente', nome: 'Mente e emoções', icone: '🧠', area: 'foco' },
  { id: 'foco', nome: 'Foco e produtividade', icone: '🎯', area: 'foco' },
  { id: 'aprender', nome: 'Aprendizado', icone: '📚', area: 'aprender' },
  { id: 'financas', nome: 'Finanças', icone: '💰', area: 'financas' },
  { id: 'vendas', nome: 'Vendas e clientes', icone: '📞', area: 'vendas' },
  { id: 'rede', nome: 'Networking e marca', icone: '🤝', area: 'networking' },
  { id: 'casa', nome: 'Organização pessoal', icone: '🏠', area: 'foco' },
  { id: 'relacoes', nome: 'Família e relações', icone: '❤️', area: 'fe' },
]

export type HabitoCatalogo = {
  id: string
  titulo: string
  cat: CatId
  area: HabitArea
  icone: string
  meta?: number
  unidade?: string
  dica: string
  /** vem do painel de admin (nuvem) */
  extra?: boolean
}

// [categoria, ícone, título, meta, unidade, dica]
type T = [CatId, string, string, number | null, string | null, string]

const L: T[] = [
  // Fé e propósito
  ['fe', '📖', 'Ler a Bíblia', 1, 'capítulo', 'Comece pelo mesmo horário todo dia: café da manhã ou antes de dormir.'],
  ['fe', '🙏', 'Oração da manhã', 5, 'min', 'Agradeça por três coisas antes de abrir o celular.'],
  ['fe', '🌅', 'Oração antes de dormir', 3, 'min', 'Entregue as preocupações do dia e agradeça.'],
  ['fe', '✍️', 'Anotar um versículo e o que aprendi', 1, null, 'Uma frase basta; o importante é a constância.'],
  ['fe', '🎧', 'Ouvir uma pregação ou estudo', 20, 'min', 'Bom para o trajeto ou para tarefas manuais.'],
  ['fe', '🕊️', 'Momento de silêncio', 5, 'min', 'Sem tela, sem música; só respirar e ficar presente.'],
  ['fe', '🤲', 'Gratidão: 3 coisas do dia', 3, 'itens', 'Escreva ou diga em voz alta no fim do dia.'],
  ['fe', '⛪', 'Participar de culto ou encontro de fé', 1, 'vez/semana', 'Marque no calendário como compromisso fixo.'],
  ['fe', '🧭', 'Revisar meu propósito e metas', 10, 'min', 'Releia sua missão e escolha a prioridade da semana.'],
  ['fe', '🎁', 'Fazer um gesto de generosidade', 1, null, 'Ajudar alguém, doar ou dedicar tempo a uma causa.'],
  // Corpo
  ['corpo', '💪', 'Treino de força', 40, 'min', 'Três vezes por semana já muda o corpo. Comece leve.'],
  ['corpo', '🏃', 'Corrida ou caminhada rápida', 30, 'min', 'A OMS indica de 150 a 300 min de atividade moderada por semana para adultos.'],
  ['corpo', '🚶', 'Caminhar 8 mil passos', 8000, 'passos', 'Estacione mais longe e use escadas.'],
  ['corpo', '🧘', 'Alongamento', 10, 'min', 'Ótimo para quem passa o dia sentado.'],
  ['corpo', '🚴', 'Pedalar', 30, 'min', 'Pode ser trajeto de casa ao trabalho.'],
  ['corpo', '🏊', 'Natação ou esporte', 45, 'min', 'Escolha algo que você goste para manter.'],
  ['corpo', '💧', 'Beber água ao longo do dia', 8, 'copos', 'Deixe uma garrafa visível na mesa.'],
  ['corpo', '🥗', 'Comer uma fruta ou salada', 1, 'porção', 'Adicione antes de cortar: mais fácil começar somando.'],
  ['corpo', '🍳', 'Café da manhã com proteína', 1, null, 'Ovos, iogurte, queijo ou similares, conforme sua dieta.'],
  ['corpo', '🚫', 'Evitar açúcar e refrigerante', 1, null, 'Troque por água com gás ou chá sem açúcar.'],
  ['corpo', '🧍', 'Levantar a cada hora', 1, 'pausa/h', 'Programe um lembrete para esticar as pernas por 2 min.'],
  ['corpo', '☀️', 'Tomar sol pela manhã', 10, 'min', 'Luz natural cedo ajuda a organizar o relógio do corpo.'],
  ['corpo', '🪥', 'Cuidar da higiene bucal', 3, 'vezes', 'Escove depois das refeições e passe fio dental.'],
  ['corpo', '🩺', 'Exames e consultas em dia', 1, 'vez/ano', 'Agende check-up com seu médico.'],
  ['corpo', '🏋️', 'Fazer 20 flexões ou agachamentos', 20, 'reps', 'Treino mínimo para dias corridos.'],
  ['corpo', '🍽️', 'Comer devagar, sem tela', 1, 'refeição', 'Perceba a fome e a saciedade.'],
  // Sono
  ['sono', '🌙', 'Dormir no horário', 1, null, 'Horário fixo para deitar, inclusive no fim de semana.'],
  ['sono', '⏰', 'Dormir 7 a 9 horas', 8, 'h', 'A maioria dos adultos precisa de 7 horas ou mais por noite.'],
  ['sono', '📵', 'Sem celular 30 min antes de dormir', 30, 'min', 'Deixe o carregador fora da cama.'],
  ['sono', '☕', 'Sem cafeína após as 15h', 1, null, 'Cafeína tarde pode atrasar o sono.'],
  ['sono', '🛏️', 'Arrumar o quarto para dormir', 1, null, 'Escuro, silencioso e arejado.'],
  ['sono', '🌇', 'Rotina de desligar (banho, leitura leve)', 20, 'min', 'Um ritual repetido sinaliza ao corpo que é hora de descansar.'],
  ['sono', '😴', 'Pausa de descanso de 15 min', 15, 'min', 'Sem culpa: descansar também é trabalho.'],
  // Mente
  ['mente', '🧘‍♂️', 'Meditar', 10, 'min', 'Comece com 3 minutos prestando atenção na respiração.'],
  ['mente', '🌬️', 'Respiração profunda', 3, 'min', 'Inspire 4s, solte 6s. Bom antes de reuniões.'],
  ['mente', '📔', 'Escrever no diário', 10, 'min', 'Despeje a cabeça no papel: o que foi bom, o que posso melhorar.'],
  ['mente', '📵', 'Reduzir tempo de redes sociais', 30, 'min', 'Defina um limite diário no próprio celular.'],
  ['mente', '🌳', 'Passar tempo ao ar livre', 20, 'min', 'Caminhar numa praça já conta.'],
  ['mente', '💬', 'Conversar com alguém de confiança', 1, null, 'Falar do que pesa alivia e traz perspectiva.'],
  ['mente', '😊', 'Fazer algo só por prazer', 30, 'min', 'Hobby, música, jogo: lazer protege contra o esgotamento.'],
  ['mente', '🎯', 'Visualizar o dia ideal', 3, 'min', 'Imagine as etapas de uma tarefa difícil antes de começar.'],
  ['mente', '🧾', 'Revisão do dia (o que deu certo)', 5, 'min', 'Anote uma vitória, mesmo pequena.'],
  // Foco
  ['foco', '🎯', 'Bloco de foco profundo', 50, 'min', 'Celular em outro cômodo, uma única tarefa.'],
  ['foco', '🍅', 'Pomodoros (25 min + 5 de pausa)', 4, 'ciclos', 'Bom para tarefas que você vem adiando.'],
  ['foco', '📝', 'Definir as 3 prioridades do dia', 3, 'itens', 'Faça na noite anterior; de manhã comece pela mais difícil.'],
  ['foco', '🐸', 'Fazer a tarefa mais difícil primeiro', 1, null, 'A famosa técnica “engolir o sapo”.'],
  ['foco', '📥', 'Zerar a caixa de e-mail', 1, 'vez/dia', 'Defina horários fixos para e-mail, não o dia inteiro.'],
  ['foco', '🔕', 'Notificações desligadas durante o foco', 1, null, 'Só liga o que for urgente de verdade.'],
  ['foco', '🗓️', 'Planejar a semana', 20, 'min', 'Domingo ou segunda cedo: metas, compromissos, folgas.'],
  ['foco', '🔍', 'Revisão semanal', 20, 'min', 'O que funcionou? O que corto? O que repito?'],
  ['foco', '🧹', 'Organizar a mesa de trabalho', 5, 'min', 'Ambiente limpo reduz distrações.'],
  ['foco', '⏱️', 'Medir o tempo das tarefas', 1, null, 'Você aprende quanto realmente leva cada coisa.'],
  ['foco', '✂️', 'Dizer “não” a algo que não é prioridade', 1, null, 'Essencialismo: menos, porém melhor.'],
  ['foco', '🌅', 'Rotina da manhã sem celular', 30, 'min', 'Os primeiros 30 minutos são seus.'],
  // Aprendizado
  ['aprender', '📚', 'Ler livro de negócios', 10, 'páginas', '10 páginas por dia são cerca de 12 livros por ano.'],
  ['aprender', '🎧', 'Ouvir podcast ou audiolivro', 20, 'min', 'Use o tempo de deslocamento.'],
  ['aprender', '🎓', 'Fazer um curso online', 30, 'min', 'Escolha um curso gratuito na aba Aprender.'],
  ['aprender', '🗣️', 'Estudar um idioma', 15, 'min', 'Pouco todo dia vale mais que muito uma vez por semana.'],
  ['aprender', '🧩', 'Resumir o que aprendi', 5, 'min', 'Ensinar (ou escrever) fixa o conteúdo.'],
  ['aprender', '📰', 'Ler notícias do meu setor', 10, 'min', 'Escolha 2 ou 3 fontes e evite rolar sem fim.'],
  ['aprender', '🛠️', 'Praticar uma habilidade técnica', 30, 'min', 'Planilhas, design, vendas, código: escolha uma.'],
  ['aprender', '🎬', 'Assistir uma aula ou palestra', 20, 'min', 'Troque uma série por um conteúdo útil algumas vezes por semana.'],
  ['aprender', '🧑‍🏫', 'Pedir feedback a alguém', 1, 'vez/semana', 'Pergunte: o que eu poderia fazer melhor?'],
  // Finanças
  ['financas', '💰', 'Registrar entradas e saídas', 1, null, 'Dois minutos por dia evitam surpresas no fim do mês.'],
  ['financas', '🏦', 'Separar dinheiro da empresa e pessoal', 1, null, 'Contas separadas facilitam impostos e decisões.'],
  ['financas', '📊', 'Conferir o fluxo de caixa', 10, 'min', 'Semanal: o que entra, o que sai, o que vence.'],
  ['financas', '🐖', 'Guardar uma parte do que entrou', 1, null, 'Pague-se primeiro: transfira assim que receber.'],
  ['financas', '🧮', 'Revisar gastos fixos', 1, 'vez/mês', 'Cancele o que não usa.'],
  ['financas', '🧾', 'Emitir notas e guardar comprovantes', 1, null, 'Organizado desde o começo, menos dor de cabeça.'],
  ['financas', '📈', 'Estudar educação financeira', 15, 'min', 'Juros, reserva de emergência e investimento básico.'],
  ['financas', '⏳', 'Cobrar clientes em atraso', 1, null, 'Mande um lembrete educado e direto.'],
  ['financas', '🛑', 'Esperar 24 h antes de compras não planejadas', 1, null, 'Reduz compras por impulso.'],
  // Vendas
  ['vendas', '📞', 'Ligar para clientes ou leads', 3, 'contatos', 'Defina o número e faça antes do almoço.'],
  ['vendas', '💬', 'Responder todos os contatos em até 1 hora', 1, null, 'Velocidade de resposta costuma pesar na decisão do cliente.'],
  ['vendas', '📤', 'Enviar propostas pendentes', 1, null, 'Zere a fila de propostas por semana.'],
  ['vendas', '🔁', 'Fazer follow-up com quem não respondeu', 3, 'contatos', 'A maioria das vendas precisa de mais de um contato.'],
  ['vendas', '🤝', 'Pedir uma indicação a cliente satisfeito', 1, null, 'Pergunte: quem mais poderia se beneficiar disso?'],
  ['vendas', '📋', 'Atualizar o funil de clientes', 5, 'min', 'Registre em Meu negócio.'],
  ['vendas', '🧠', 'Estudar objeções e respostas', 10, 'min', 'Anote as objeções que ouviu e escreva respostas.'],
  ['vendas', '📱', 'Postar conteúdo sobre meu trabalho', 1, 'post', 'Mostre bastidores, resultados e dicas.'],
  ['vendas', '⭐', 'Pedir avaliação a um cliente', 1, null, 'Depoimento real ajuda quem ainda não te conhece.'],
  ['vendas', '🎤', 'Treinar meu pitch de 30 segundos', 5, 'min', 'Quem sou, para quem trabalho, qual problema resolvo.'],
  ['vendas', '📞', 'Ligar para ex-clientes', 2, 'contatos', 'Reativar quem já comprou costuma ser mais fácil.'],
  // Rede
  ['rede', '🤝', 'Falar com uma pessoa nova do meu mercado', 1, null, 'Uma mensagem sincera já abre portas.'],
  ['rede', '📇', 'Fazer follow-up de contatos em até 48 h', 1, null, 'Cite algo que vocês conversaram.'],
  ['rede', '🗓️', 'Ir a um evento de networking', 1, 'vez/mês', 'Veja eventos na tela Rede.'],
  ['rede', '💼', 'Atualizar LinkedIn ou perfil profissional', 10, 'min', 'Foto, resumo e últimos resultados.'],
  ['rede', '☕', 'Marcar um café ou chamada de 15 min', 1, 'vez/semana', 'Conexões profundas valem mais que muitas rasas.'],
  ['rede', '🎁', 'Ajudar alguém da rede sem pedir nada', 1, null, 'Apresente duas pessoas ou compartilhe uma ideia útil.'],
  ['rede', '✍️', 'Escrever um artigo ou post de autoridade', 1, 'vez/semana', 'Mostre o que você sabe.'],
  // Organização
  ['casa', '🛏️', 'Arrumar a cama', 1, null, 'Primeira vitória do dia.'],
  ['casa', '🧺', 'Organizar um cômodo ou gaveta', 15, 'min', 'Pouco por dia mantém a casa em ordem.'],
  ['casa', '🍱', 'Planejar as refeições da semana', 15, 'min', 'Economiza tempo e dinheiro.'],
  ['casa', '🧼', 'Limpar ao terminar de usar', 1, null, 'Regra dos 2 minutos: se leva menos, faça agora.'],
  ['casa', '👔', 'Separar a roupa na noite anterior', 1, null, 'Menos decisões de manhã.'],
  ['casa', '🗑️', 'Desapegar de um item por dia', 1, null, 'Mais espaço, menos distração.'],
  ['casa', '📲', 'Organizar o celular (apps e arquivos)', 10, 'min', 'Mova o que distrai para uma pasta distante.'],
  // Relações
  ['relacoes', '👨‍👩‍👧', 'Tempo de qualidade com a família', 30, 'min', 'Sem tela, de verdade presente.'],
  ['relacoes', '📞', 'Ligar para um parente ou amigo', 1, null, 'Cuide das relações que importam.'],
  ['relacoes', '💌', 'Elogiar ou agradecer alguém', 1, null, 'Específico e sincero.'],
  ['relacoes', '🍽️', 'Refeição em família sem celular', 1, null, 'Combine uma regra simples para todos.'],
  ['relacoes', '👂', 'Ouvir sem interromper', 1, null, 'Pergunte e escute antes de responder.'],
  ['relacoes', '🎲', 'Programa a dois ou com amigos', 1, 'vez/semana', 'Agenda marcada vira hábito.'],
]

const slug = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)

export const CATALOGO_HABITOS: HabitoCatalogo[] = L.map(([cat, icone, titulo, meta, unidade, dica]) => ({
  id: `c-${slug(titulo)}`,
  titulo, cat, icone, dica,
  area: CATEGORIAS.find((c) => c.id === cat)!.area,
  meta: meta ?? undefined,
  unidade: unidade ?? undefined,
}))
