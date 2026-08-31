# Levantamento — dados de domínio ainda em código

Estado do que hoje vive em `src/lib/*.ts` e para onde vai na base de dados.
Gerado a partir da exploração de 31/08/2026.

Legenda do estado:
- **seed** — já coberto por `scripts/generate-db-seed.mts` → `supabase/seed/`
- **tabela nova** — migração criada, ainda por ligar aos getters (`data.ts`)
- **fica em código** — lógica/constante; não migra

---

## `src/lib/data.ts` (4242 linhas)

| Conjunto | Local | Nº | Destino | Estado |
|---|---|---|---|---|
| `TEAMS` | `data.ts:489` | 16 | `ancaf_teams` (+ colunas novas) | **seed** `02_teams.sql` |
| `HISTORICAL_TEAMS` | `data.ts:885` | 10 | `ancaf_teams` (`is_historical`) | **seed** `02_teams.sql` |
| `TEAM_PROFILE_OVERRIDES` / `getTeamProfile` | `data.ts:3943` | 16 | `ancaf_team_profiles` (nova) | **seed** `03_team_profiles.sql` |
| `OFFICIAL_TEAM_STAFF_2026_27` | `data.ts:2212` | 225 | `ancaf_team_staff` (nova) | **seed** `04_team_staff.sql` |
| `PLAYERS_RAW` + 10 × `*_SQUAD_2026_27` + `ADDITIONAL_CONFIRMED_PLAYERS` + `OFFICIAL_SQUADS_2026_27.players` | `data.ts:912+`, `official-squads-2026-27.ts` | 534 (computados) | `ancaf_players` (+ colunas novas) | **seed** `05_players.sql` |
| `PUBLISHED_MATCHES_2026_27` + `OFFICIAL_MATCH_SCHEDULE` + `PLATFORM_CONFIRMED_RESULTS` | `published-ancaf-calendar.ts`, `data.ts:74`, `data.ts:123` | 240 | `ancaf_matches` (+ colunas novas) | **seed** `06_matches.sql` |
| `HISTORICAL_MATCHES` (2024-25, 2023-24, 2022-23) + `historical-results-2025-26.ts` | `historical-results*.ts` | 900 | `ancaf_matches` | **seed** `06_matches.sql` |
| `OFFICIAL_STANDINGS_2025_26` | `data.ts:797` | 16 | `ancaf_standings` (nova) | **seed** `07_standings.sql` |
| `CURRENT_SEASON_SCORERS` + `CURRENT_CONFIRMED_CARDS` | `data.ts:322`, `data.ts:353` | 51 | `ancaf_player_season_stats` (nova) | **seed** `08_player_season_stats.sql` |
| `newsMock` | `data.ts:2303` | 17 | `ancaf_news` (+ colunas novas) | **seed** `09_news.sql` |
| `videoHighlightsMock` | `data.ts:4201` | 4 | `ancaf_videos` (nova) | **seed** `10_videos.sql` |
| `getPublished*Lineups` (5 jogos) | `data.ts:3153-3438` | 5 | `ancaf_match_lineups` (Fase 2) | **seed** `11_match_artifacts.sql` |
| `getPublishedMatchEvents` (17 jogos) | `data.ts:3441` | ~120 eventos | `ancaf_match_events` (nova) | **seed** `11_match_artifacts.sql` |
| `PUBLISHED_MATCH_STATS` (13 jogos) | `data.ts:3629` | ~90 | `ancaf_match_stats` (nova) | **seed** `11_match_artifacts.sql` |
| `publishedByMatch` (trios) | `data.ts:3832` | 5 | `ancaf_referee_nominations` (existe) | por fazer |
| `SEASONS` | `data.ts:847` | 2 (+3 históricas) | `ancaf_seasons` | **seed** `01_seasons.sql` |
| `DEFAULT_SITE_SETTINGS` | `data.ts:2591` | — | `ancaf_configs` `override_site` | já editável |
| `SEED_STANDINGS`, `generateAllMatches`, `enrichPlayer`, `buildLineup`, `computeStandings`, `mulberry32`… | vários | — | — | **fica em código** |
| `STANDINGS_ORDER_2026_27`, `ROUND_DATES`, `KICKOFFS`, tabelas de labels (`OFFICIAL_POSITION_LABELS`, `NATIONALITY_FLAGS`…) | vários | — | `ancaf_configs` (k/v) se editáveis | por decidir |

## Outros ficheiros

| Ficheiro | Conteúdo | Destino |
|---|---|---|
| `official-squads-2026-27.ts` | 739 jogadores + 225 técnicos (fonte FIFA/MA) | `ancaf_players` + `ancaf_team_staff` (via seed) |
| `published-ancaf-calendar.ts` | 240 jogos oficiais | `ancaf_matches` (seed) |
| `historical-results.ts` / `historical-results-2025-26.ts` | 900 jogos históricos | `ancaf_matches` (seed) |
| `ancaf-engine.ts` | `DRAW_ROSTER`, `ROUND_DATES`, gerador do sorteio | `ancaf_configs` / **fica em código** |

## Ainda 100% em código, sem via de override nem seed (por fazer numa fase seguinte)

- Ligar os getters à BD: `getTeamStaff`, `getTeamProfile`, `getStandingsForSeason`,
  `getMatchDetail` (escalações/eventos/stats), `getTopScorers`, `getVideoHighlights`,
  `getRefereeNominations`. Cada um passa a **preferir a BD e cair na constante** como fallback.
- `getPlayerFifaRecords` (simulado a partir de atributos) — manter simulado.

---

## Como aplicar

Ver `docs/MIGRACOES-BD.md`. Ordem: migrações `20260901002000` e `20260901003000`
→ `npx tsx scripts/generate-db-seed.mts` → aplicar `supabase/seed/01…11` por ordem.
