# Guia de Povoamento de Jogos e Análise de Seeds

Este documento analisa os ficheiros de **seeds SQL** da plataforma Liga Unitel Girabola e descreve o fluxo canónico para popular e atualizar jogos, garantindo que todo o sistema (frontend, APIs e base de dados) permanece perfeitamente sincronizado.

---

## 1. Análise dos Ficheiros Seeds (`supabase/seed/*.sql`)

Os ficheiros na pasta `supabase/seed/` são gerados de forma determinística e idempotente (`insert ... on conflict do update`) a partir da camada de dados canónica em TypeScript.

| Ficheiro Seed | Conteúdo | Origem dos Dados | Estado |
|---|---|---|---|
| `01_seasons.sql` | 5 épocas (2026/27 ativa + históricas) | `src/lib/data.ts` (`SEASONS`) | Completo |
| `02_teams.sql` | 16 clubes da liga + 10 históricos | `src/lib/data.ts` (`TEAMS`, `HISTORICAL_TEAMS`) | Completo |
| `03_team_profiles.sql` | Palmarés, equipamentos e órgãos sociais | `src/lib/data.ts` (`TEAM_PROFILE_OVERRIDES`) | Completo |
| `04_team_staff.sql` | 225 membros de equipas técnicas | `src/lib/data.ts` (`OFFICIAL_TEAM_STAFF_2026_27`) | Completo |
| `05_players.sql` | 534+ atletas registados | Plantéis oficiais FIFA/MA | Completo |
| `06_matches.sql` | **1140 jogos** (240 da época 2026/27 + históricos) | `src/data/jogos/2026-27/*.ts` e resultados históricos | **Completo e Sincronizado** |
| `07_standings.sql` | Tabelas classificativas | `getStandingsForSeason()` | Completo |
| `08_player_season_stats.sql` | Artilheiros, assistências e disciplina | `src/data/jogos/2026-27/derivados.ts` | **Completo e Sincronizado** |
| `09_news.sql` | Notícias e comunicados | `src/lib/data.ts` (`newsMock`) | Completo |
| `10_videos.sql` | Resumos e vídeos de jogos | `src/lib/data.ts` (`videoHighlightsMock`) | Completo |
| `11_match_artifacts.sql` | **Escalações, eventos detalhados e estatísticas** | `src/data/jogos/2026-27/*.ts` (`lineups`, `events`, `stats`) | **Completo e Sincronizado** |
| `12_historical_2025_26_stats.sql` | Estatísticas históricas consolidadas | Arquivo histórico | Completo |
| `12_referee_nominations.sql` | Nomeações oficiais de equipas de arbitragem | `officials` dos jogos | Completo |

---

## 2. O Processo de Atualização de Jogos Está Completo?

**Sim, o processo está 100% completo, automatizado e fechado.**

A arquitetura adota o princípio de **Registo Único por Jogo**:
1. Cada jogo tem exatamente **um ficheiro** em `src/data/jogos/2026-27/<id>.ts` (ex.: `m27-1-2.ts` para Bravos 3–0 Sagrada).
2. Não é necessário editar múltiplos ficheiros de calendário, marcadores, tabelas ou seeds manuais.
3. Ao executar `npm run jogos -- sincronizar`:
   - `src/data/jogos/2026-27/index.ts` é atualizado.
   - `src/data/jogos/2026-27/derivados.ts` recalcula a lista de melhores marcadores, autogolos e cartões disciplinares.
   - `scripts/generate-db-seed.mts` é invocado e regenera automaticamente:
     - `06_matches.sql` (resultados, golos, data, recinto, público, árbitro, estado).
     - `08_player_season_stats.sql` (totais de época dos jogadores).
     - `11_match_artifacts.sql` (tabelas `ancaf_match_lineups`, `ancaf_match_events` e `ancaf_match_stats`).
4. Os testes de integridade (`scripts/test-match-records.mts` e `scripts/test-portal-regressions.mjs`) validam automaticamente antes de qualquer build se os golos dos eventos coincidem com o placar final e se as equipas respeitam o sorteio oficial.

---

## 3. Como Popular Novos Jogos (Passo a Passo)

### Ficheiro Base / Template
Foi criado o modelo em [src/data/jogos/TEMPLATE-JOGO.ts](file:///Users/nsungukamukotelo/.gemini/antigravity/worktrees/LigaUnitelGiraBola/clean_admin_preserve_logos/src/data/jogos/TEMPLATE-JOGO.ts).

### Fluxo Operacional:
1. **Localizar o Jogo**:
   ```bash
   npm run jogos -- procurar wiliete libolo
   # ou procurar por jornada:
   npm run jogos -- procurar j5
   ```
2. **Consultar o Estado Atual**:
   ```bash
   npm run jogos -- ver m27-5-6
   ```
3. **Editar o Ficheiro do Jogo**:
   Abrir `src/data/jogos/2026-27/m27-5-6.ts` e preencher os dados com base no [TEMPLATE-JOGO.ts](file:///Users/nsungukamukotelo/.gemini/antigravity/worktrees/LigaUnitelGiraBola/clean_admin_preserve_logos/src/data/jogos/TEMPLATE-JOGO.ts).
4. **Sincronizar e Regenerar Seeds**:
   ```bash
   npm run jogos -- sincronizar
   ```
5. **Validar Conformidade**:
   ```bash
   npm run jogos -- validar
   ```
6. **Publicar e Fazer Deploy**:
   ```bash
   npm run jogos -- publicar
   ```
   *(O comando valida os impactos, gera os commits e publica as atualizações).*
