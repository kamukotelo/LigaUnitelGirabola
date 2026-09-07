# Auditoria: Plantel × Alcunhas

Plantel oficial: **514** jogadores. Folha de alcunhas: **536** linhas. Correspondências exatas por clube e nome: **493**.

## Resumo

| Gravidade | Quantidade |
|---|---:|
| high | 1 |
| medium | 69 |
| low | 0 |

## Tipos de inconsistência

| Tipo | Quantidade |
|---|---:|
| nickname_row_without_exact_official_match | 43 |
| official_player_without_exact_nickname_match | 21 |
| duplicate_nickname_team_Nome completo atual | 3 |
| duplicate_official_team_fullName | 2 |
| duplicate_nickname_team_Nº camisola | 1 |

Os casos completos, com linhas da folha e sugestões de correção, estão em `audit.json`.
