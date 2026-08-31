# Contas de administração ANCAF

A consola de administração (`/adminancaf2026`) usa **contas individuais** do
Supabase Authentication. Cada utilizador autorizado precisa de:

1. um registo em **Supabase Auth** (e-mail + palavra-passe);
2. uma linha em **`public.ancaf_profiles`** com `id` igual ao do Auth e
   `role = 'admin'`.

O login também aceita, por compatibilidade, os códigos partilhados
`ADMIN_WRITE_PASSCODE` / `CLUB_DIRECTION_PASSCODE` — mas o objetivo é migrar
todos para contas nominais.

## Contas oficiais

| E-mail | Nome |
|---|---|
| `emanuel.valodia@ancaf.co.ao` | Emanuel Valódia |
| `rivaldo.domingues@ancaf.co.ao` | Rivaldo Domingues |
| `derby.candido@ancaf.co.ao` | Derby Cândido |
| `kamukotelo@ancaf.co.ao` | Kamukotelo |

Palavra-passe provisória: **`jabulani2026`**. No primeiro acesso a consola
bloqueia num ecrã de "Definir palavra-passe" (mín. 10 caracteres, diferente da
provisória) — só depois disso o painel abre.

## Criar / repor as contas

Pré-requisitos no ambiente (ou no `.env` da raiz):
`NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.

```bash
# 1. Aplicar a migração que adiciona must_change_password ao perfil
#    (Supabase Studio → SQL, ou o CLI da Supabase):
#    supabase/migrations/20260901000000_admin_password_rotation.sql

# 2. Criar as contas + perfis (idempotente)
node --env-file=.env scripts/create-ancaf-admins.mjs

# Repor a senha provisória também em contas que já existiam:
node --env-file=.env scripts/create-ancaf-admins.mjs --reset
```

O script:
- cria a conta no Auth com `jabulani2026` se ainda não existir;
- faz `upsert` do perfil com `role = 'admin'` e `must_change_password = true`
  (contas novas ou `--reset`);
- **não** altera a senha de contas já existentes sem `--reset`.

## Rotação

- A troca no primeiro acesso é obrigatória (`must_change_password`).
- Para forçar nova rotação a um utilizador: `update public.ancaf_profiles set
  must_change_password = true where id = '<uuid>';`
- Para invalidar **todas** as sessões de uma vez, renove
  `ADMIN_SESSION_SECRET` no ambiente (os cookies assinados deixam de validar).
