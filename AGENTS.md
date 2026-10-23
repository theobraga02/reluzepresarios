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

## 3. Identidade Visual (Design Tokens - Dark Amber)
- **Fundo Base:** `#0A100D`
- **Superfície (Cards):** `#121C17`, borda `#22312A`
- **Superfície Elevada:** `#1A2822`
- **Texto Principal:** `#F3ECDD` (creme aconchegante)
- **Texto Secundário:** `#A9B7AD` (contraste acessível WCAG AA)
- **Acento Principal (Sol Âmbar):** `#F0AE45` (botões principais, anéis de progresso, estados ativos)
- **Texto sobre Âmbar:** `#0A100D`
- **Gradiente Destaque Floresta:** `#1C4635` até `#0E211A`
- **Cores Semânticas por Área:**
  - Corpo: `#4CC2B0`
  - Fé: `#F0AE45`
  - Foco: `#7BA4FF`
  - Finanças: `#F58A72`
  - Vendas: `#B79BFF`
  - Aprender: `#A5D65A`
  - Sono: `#93A5C2`
  - Networking: `#F592B4`
- **Tipografia:**
  - Títulos/Números de destaque: `Fraunces`, serifada expressiva (600)
  - Textos de interface, botões e formulários: `DM Sans` (400, 500, 700)
- **Formas & Acessibilidade:**
  - Cards arredondados (22-28px), botões em pílula (pill)
  - Alvo de toque mínimo: 44px
  - Animações respeitam `prefers-reduced-motion`

## 4. Fases de Desenvolvimento
- **Fase 1:** Sistema de design, tokens, navegação inferior, tela "Hoje" com anel 600ms, versículo conferido e checklist de hábitos com filtros.
- **Fase 2:** "Registrar" (cronômetro de foco, caixa R$, treino, vendas, etc.) e persistência local com exportação/reset LGPD.
- **Fase 3:** "Painel" de métricas (heatmap 12 semanas, revisão da semana, média, linha de receita/caixa).
- **Fase 4:** "Aprender" com trilhas de habilidades e curadoria de vídeos conferidos com disclaimers.
