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
