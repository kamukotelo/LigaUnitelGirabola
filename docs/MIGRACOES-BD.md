# Migrações e scripts pendentes (a correr manualmente na BD)

Estas migrações estão no repositório mas **não são aplicadas automaticamente**.
Aplicar por ordem no Supabase Studio (SQL) ou com o CLI da Supabase.

## Fase 1 — Contas individuais

| Ficheiro | O que faz |
|---|---|
| `supabase/migrations/20260901000000_admin_password_rotation.sql` | `must_change_password` + `password_changed_at` em `ancaf_profiles` |

Depois: `node --env-file=.env scripts/create-ancaf-admins.mjs` (cria as 4 contas).

## Fase 2 — Ficha de jogo

| Ficheiro | O que faz |
|---|---|
| `supabase/migrations/20260901001000_match_lineups.sql` | tabela `ancaf_match_lineups` (onze + suplentes confirmados por jogo/equipa) |

Sem esta tabela, a secção **Ficha de Jogo** carrega os planteis mas não
consegue guardar os onzes nem gerar o PDF (erro "write_failed").

## Fase 4 — Migração de conteúdo para a BD

| Ficheiro | O que faz |
|---|---|
| `supabase/migrations/20260901002000_portal_data_tables.sql` | tabelas novas: `ancaf_team_staff`, `ancaf_team_profiles`, `ancaf_standings`, `ancaf_match_events`, `ancaf_match_stats`, `ancaf_player_season_stats`, `ancaf_videos` |
| `supabase/migrations/20260901003000_extend_core_tables.sql` | colunas em falta em `ancaf_teams`/`ancaf_players`/`ancaf_matches`/`ancaf_news` |

Depois das migrações, gerar e aplicar os seeds:

```bash
npm run db:seed:generate          # regenera supabase/seed/*.sql do código
# aplicar supabase/seed/01…11 por ordem (ver supabase/seed/README.md)
```

O levantamento completo está em `docs/DADOS-EM-CODIGO.md`.

### Vaga 1 da ligação dos getters (já em código)

`GET /api/portal-data` + `RUNTIME_DATA` em `data.ts` + `PortalDataProvider` fazem
o portal **preferir a BD** para: equipa técnica (`getTeamStaff`), perfis de clube
(`getTeamProfile`), classificações oficiais (`getStandingsForSeason`), vídeos
(`getVideoHighlights`) e, na ficha de jogo, escalações/eventos/estatísticas
(`getMatchDetail`). Sem as tabelas semeadas, tudo cai na constante — **sem
regressão**.

Para ativar a Vaga 1, aplicar (não têm FKs, podem ser corridos isolados):
`supabase/seed/03_team_profiles.sql`, `04_team_staff.sql`, `07_standings.sql`,
`10_videos.sql`, `11_match_artifacts.sql`.

Verificado localmente com dados mock: o `/ligatv` e a equipa técnica do clube
trocam da constante para a BD via Realtime, sem rebuild.

### Como usar a Ficha de Jogo (depois da migração)

1. Consola → **Competição → Ficha de Jogo**.
2. Escolher jornada e jogo.
3. Em cada equipa: marcar 11 titulares (**T**) e os suplentes (**S**),
   ajustar número e alcunha, marcar o capitão (coroa), confirmar o treinador.
4. **Confirmar onze** em cada lado (valida 11 titulares + 1 guarda-redes).
5. Com os dois confirmados, **Ficha PDF** descarrega o documento
   "Constituição das Equipas" — PDF preenchível (grelhas de golo/assistência/
   minuto/amarelo/2.º amarelo/vermelho por jogador + trio de arbitragem
   pré-preenchido) para enviar aos delegados. Só aparecem as alcunhas.
