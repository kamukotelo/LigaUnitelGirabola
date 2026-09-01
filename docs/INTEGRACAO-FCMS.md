# Integração FIFA Connect FCMS

O portal recebe dados autorizados em `POST /api/fcms/sync`. A rota não tenta contornar o login do FCMS e não aceita credenciais pessoais. A origem pode ser a API oficial, o widget oficial ou um serviço autorizado que faça o envio.

## Preparação

1. Aplicar a migração `20260901005000_fcms_sync.sql`.
2. Criar um segredo forte e independente em `FCMS_SYNC_TOKEN` na Vercel.
3. Preencher `ancaf_fcms_team_mappings` com os IDs oficiais e internos.
4. Fazer primeiro um pedido com `dryRun: true`.

Exemplo de mapeamento:

```sql
insert into public.ancaf_fcms_team_mappings
  (provider, tenant, external_team_id, team_id)
values
  ('fcms-api', 'ang', 'ID_EXTERNO_PETRO', 'petro'),
  ('fcms-api', 'ang', 'ID_EXTERNO_1_AGOSTO', 'dago');
```

## Contrato mínimo

```json
{
  "provider": "fcms-api",
  "tenant": "ang",
  "competitionExternalId": "3934",
  "seasonId": "2026-27",
  "dryRun": true,
  "matches": [
    {
      "externalMatchId": "1150991",
      "round": 2,
      "kickoff": "2026-08-31T15:00:00+01:00",
      "homeExternalId": "ID_LIBOLO",
      "awayExternalId": "ID_BRAVOS",
      "homeScore": 0,
      "awayScore": 1,
      "halfTimeHomeScore": 0,
      "halfTimeAwayScore": 0,
      "status": "finished",
      "events": [
        {
          "minute": 85,
          "type": "goal",
          "teamExternalId": "ID_BRAVOS",
          "player": "Higino Kaptingo Epalanga"
        }
      ]
    }
  ]
}
```

Autorização: `Authorization: Bearer <FCMS_SYNC_TOKEN>`.

Se `events` for omitido, os eventos editoriais existentes são preservados. Se for fornecido, o conjunto publicado substitui os eventos anteriores daquela partida. IDs externos de jogadores não são tratados como IDs internos enquanto não existir um mapeamento específico.

Cada tentativa autenticada e validada gera uma linha em `ancaf_fcms_sync_runs`, sem guardar tokens ou o payload bruto. Reenvios são idempotentes: partidas são associadas pelo mapeamento FCMS ou, na primeira execução, por época, jornada, clubes e data.
# Importação provisória por relatório PDF

Enquanto não existir uma credencial máquina-a-máquina, um utilizador autorizado pode descarregar o **Match Report** no botão **GET REPORT** do FCMS e convertê-lo localmente:

```bash
python3 scripts/convert-fcms-match-report.py MATCH_REPORT.pdf -o fcms-payload.json
```

O ficheiro produzido vem com `dryRun: true` e deve ser validado por `POST /api/fcms/sync` antes de qualquer gravação. O conversor falha de forma fechada se o formato ou os eventos esperados não coincidirem. A credencial do utilizador e a sessão do navegador nunca são copiadas para o portal.
