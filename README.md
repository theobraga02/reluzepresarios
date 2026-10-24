# Empresário

App web de hábitos, foco, treino, finanças, vendas, Bíblia, sono e aprendizado para empresários.
**Disciplina. Foco. Resultados.**

- **Landing:** `/`
- **App:** `/app` (Hoje · Painel · Registrar · Aprender · IA Coach · Dados e privacidade)
- Stack: Vite + React 19 + TypeScript + Tailwind v4 (reset) + Recharts + lucide-react
- Dados: ficam no `localStorage` do aparelho (exportar/apagar em *Dados e privacidade*). Sem servidor por enquanto.
- IA Coach: avaliação por regras locais (`src/lib/coach.ts`). Supabase / Edge Function `coach-diario` entram numa próxima etapa.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # tsc -b && vite build
```

## Deploy
Vercel (Vite). O `vercel.json` já faz o fallback das rotas para o `index.html`.

## Notas de conteúdo
- Livros em *Aprender* são obras reais; cursos e vídeos são sugestões de **exemplo**, sem link.
- Telas da landing usam dados de exemplo (marcado na página).
- Conteúdo financeiro é educativo; não é recomendação de investimento.
