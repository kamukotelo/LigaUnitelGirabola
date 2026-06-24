# Plano de Implementação (v2): Detalhe de Jogadores — Sofascore, ZeroZero & FIFA Connect

> Versão revista após análise do código real. Substitui a v1.

## Contexto verificado no código
- `PLAYERS` tem **51 jogadores** ([src/lib/data.ts:302](src/lib/data.ts)) — não 15.
- O projeto já usa **geração determinística** (`getDeterministicScore`, src/lib/data.ts:132). Reutilizamos esse padrão.
- `PlayerDetailClient.tsx` é hoje uma **página única rica** (StatRing, HeatmapField, resultados recentes, carreira) — sem abas. Refatoramos incrementalmente, não reescrevemos.
- Stack: recharts `3.8.1`, framer-motion `12`, Next `16`, React `19`. `'use client'` já presente.

## Decisões aprovadas
1. **Dados derivados automaticamente** dos `attributes` existentes (cobre os 51 jogadores, consistente, sem dados manuais por jogador). Links externos são deep-links de pesquisa reais; os ratings exibidos são simulados.
2. **Badge de demonstração visível** ("Ambiente de demonstração — dados não oficiais") nas secções Sofascore/ZeroZero e FIFA Connect, por transparência com o utente.

## Parte 1 — `src/lib/data.ts`
- Estender interface `Player` com campos **opcionais** (não quebra os 51 registos existentes):
  - `externalRatings?`, `recentRatings?: number[]`, `detailedMetrics?`, `fifaConnect?`.
- Adicionar **helpers determinísticos** (puros, derivados de `player.attributes` e nome):
  - `getPlayerRatings(player)` → rating Sofascore/ZeroZero + URLs de pesquisa.
  - `getRecentRatings(player)` → últimos 5 ratings.
  - `getDetailedMetrics(player)` → precisão de passe, duelos ganhos, cartões.
  - `getFifaConnectStatus(player)` → checklist (Identidade, Contrato, ITC, Seguro).

## Parte 2 — `src/components/PlayerDetailClient.tsx`
- `useState` para 3 abas com `AnimatePresence` (framer-motion).
- **Aba 1 — Perfil:** mover conteúdo existente (reaproveitar, não reescrever).
- **Aba 2 — Estatísticas:** widget Sofascore/ZeroZero + `LineChart` Recharts (últimos 5, estilo neon/HUD) + grelha de métricas + links externos (`target="_blank" rel="noopener noreferrer"`) + badge de demonstração.
- **Aba 3 — FIFA Connect:** checklist de conformidade + simulador (Pendente → A processar → Validado) + badge de demonstração.

## Parte 3 — Verificação
- `npm run build` + lint (Next 16 / React 19).
- Testar posições distintas (Avançado, Guarda-redes) — derivados dependem de `attributes`.
- Confirmar abas/animação, responsividade do gráfico, e links externos corretos.
- Confirmar visibilidade dos badges de demonstração.
