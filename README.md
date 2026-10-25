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

## IA (Coach, cursos e eventos)

A função `api/ia.ts` (Vercel) usa uma cadeia de IAs gratuitas — Gemini → Groq → OpenRouter — e busca na web (Tavily ou Brave) para achar cursos e eventos. Todo link é aberto pelo servidor antes de aparecer no app.

Variáveis de ambiente (Vercel → Settings → Environment Variables):

| Variável | Para quê |
| --- | --- |
| `GEMINI_API_KEY` | IA principal (Google AI Studio, plano gratuito) |
| `GROQ_API_KEY` | reserva 1 |
| `OPENROUTER_API_KEY` | reserva 2 |
| `TAVILY_API_KEY` ou `BRAVE_API_KEY` | busca na web (cursos e eventos) |

Sem chaves o app funciona normalmente com o Coach local e o catálogo. Para testar a API localmente use `vercel dev`. O usuário precisa ativar a IA em **Mais**; só um resumo numérico é enviado.

Dados: salvos no aparelho (`localStorage`). Importa backups exportados pelo app antigo. Login/sincronização (Supabase) do app antigo não foi migrado.
