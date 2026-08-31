# supabase/seed/

Ficheiros SQL gerados por `scripts/generate-db-seed.mts` a partir de
`src/lib/*.ts`. **Não editar à mão** — regenerar com:

```bash
npx tsx scripts/generate-db-seed.mts
# ou
npm run db:seed:generate
```

## Ordem de aplicação

1. Migrações (uma vez): `supabase/migrations/20260901001000_match_lineups.sql`,
   `20260901002000_portal_data_tables.sql`, `20260901003000_extend_core_tables.sql`.
2. Seeds, por ordem numérica: `01_seasons` → `11_match_artifacts`.

Todos os `INSERT` são `ON CONFLICT DO UPDATE` (ou `DELETE`+`INSERT` para
listas), por isso podem ser reaplicados sem duplicar.

| Ficheiro | Tabela | Linhas |
|---|---|---|
| `01_seasons.sql` | `ancaf_seasons` | 5 |
| `02_teams.sql` | `ancaf_teams` | 26 |
| `03_team_profiles.sql` | `ancaf_team_profiles` | 26 |
| `04_team_staff.sql` | `ancaf_team_staff` | 225 |
| `05_players.sql` | `ancaf_players` | 534 |
| `06_matches.sql` | `ancaf_matches` | 1140 |
| `07_standings.sql` | `ancaf_standings` | 16 |
| `08_player_season_stats.sql` | `ancaf_player_season_stats` | 51 |
| `09_news.sql` | `ancaf_news` | 17 |
| `10_videos.sql` | `ancaf_videos` | 4 |
| `11_match_artifacts.sql` | `ancaf_match_lineups` / `ancaf_match_events` / `ancaf_match_stats` | ~180 |
