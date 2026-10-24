# AGENTS.md — Regras e Diretrizes do Projeto: Reluz Empresário

## 1. Identidade e Propósito
- **Nome:** Reluz Empresário (extensão da Reluz)
- **Promessa:** "O lugar onde você mostra para você mesmo que é capaz"
- **Tom:** Acolhedor, sem culpa, realista, pragmático. "Um dia imperfeito também conta."
- **Público:** Empreendedores que buscam integrar foco, hábitos, finanças, vendas, saúde, leitura e fé.

## 2. Regras Rígidas de Conteúdo & Compliance Legal
1. **Sem promessas irreais:** Nunca prometer cura médica ou retorno financeiro garantido.
2. **Saúde Mental & Apoio:** Em temas sensíveis e ansiedade, sempre disponibilizar e destacar o canal de apoio **CVV 188** e recomendar ajuda profissional de psicologia/psiquiatria.
3. **Educação Financeira:** Todo conteúdo de investimentos é meramente educativo ("Não é recomendação de compra ou venda - Sem caráter de consultoria CVM").
4. **Sem dados falsos:** Não criar depoimentos inventados nem números apresentados como se fossem pesquisas reais. Todo exemplo fictício deve ser expressamente marcado como **(exemplo)**.
5. **Transparência Legal:** Termos de Uso e Política de Privacidade devem avisar com clareza: *"Documento em fase de validação jurídica pré-lançamento"*.
6. **Bíblia:** Textos bíblicos em tradução de domínio público (João Ferreira de Almeida Revista e Corrigida/Atualizada histórica), sempre exibindo a referência exata e tradução.
7. **Privacidade e LGPD:** Todos os dados do usuário ficam no dispositivo (armazenamento local / offline-first), com opções fáceis de exportar (JSON) e apagar tudo definitivamente.

## 3. Identidade Visual (Preto / Grafite / Branco)
- **Marca:** EMPRESÁRIO (logo "E" + wordmark com espaçamento largo). Lema: "Disciplina. Foco. Resultados."
- **Fundo base:** `#09090a`; tela do app `#0d0d0e`; cards `#161617` com borda `#262628`
- **Texto:** principal `#f4f4f5`; secundário `#9a9aa0`; terciário `#6b6b70`
- **Acentos funcionais (só em estados):** ok `#7ddc9a`, atenção `#f3a24b`
- **Botão principal:** pílula branca (`#f4f4f5`) com texto escuro; secundário: contorno/fantasma
- **Faixa de vitrine da landing:** fundo claro `#f1f0ee` com telas escuras
- **Tipografia:** Inter (300 nos títulos grandes, 400/500/600 na interface); assinatura em Caveat
- **Ícones:** lucide-react, traço fino (1.3–1.8)
- **Formas & acessibilidade:** cards 12–14px, botões em pílula, alvo de toque mínimo 44px nas ações principais; animações respeitam `prefers-reduced-motion`
- **Imagens:** apenas ilustrações vetoriais próprias (SVG); nada de fotos/capas de terceiros

## 4. Fases de Desenvolvimento
- **Fase 1 (feita):** landing + telas Hoje, Painel, Registrar, Aprender e IA Coach, navegação inferior, persistência local.
- **Fase 2:** "Registrar" (cronômetro de foco, caixa R$, treino, vendas, etc.) e persistência local com exportação/reset LGPD.
- **Fase 3:** "Painel" de métricas (heatmap 12 semanas, revisão da semana, média, linha de receita/caixa).
- **Fase 4:** "Aprender" com trilhas de habilidades e curadoria de vídeos conferidos com disclaimers.
