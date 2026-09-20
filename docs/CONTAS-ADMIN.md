# Contas de administração ANCAF

A consola de administração (`/adminancaf2026`) usa **contas individuais**
guardadas no PostgreSQL do **Neon**. Cada utilizador autorizado é uma linha em
**`public.ancaf_profiles`** com:

- `email` (em minúsculas) e `password_hash` (bcrypt, via `pgcrypto`);
- `role = 'admin'`;
- `must_change_password`, que obriga a definir uma senha nova no 1.º acesso.

A verificação da senha é feita no servidor pelo `crypt()` do PostgreSQL — a
senha em claro e o hash nunca chegam ao browser (ver `src/lib/admin-auth.ts`).
As sessões são cookies httpOnly assinados por HMAC com `ADMIN_SESSION_SECRET`.

> A autenticação já **não** passa pelo Supabase Auth. O login ainda aceita, por
> compatibilidade, os códigos partilhados `ADMIN_WRITE_PASSCODE` /
> `CLUB_DIRECTION_PASSCODE` — mas o objetivo é usar só contas nominais.

## Contas oficiais

| E-mail | Nome |
|---|---|
| `emanuel.valodia@ancaf.co.ao` | Emanuel Valódia |
| `rivaldo.domingues@ancaf.co.ao` | Rivaldo Domingues |
| `derby.candido@ancaf.co.ao` | Derby Cândido |
| `kamukotelo@ancaf.co.ao` | Kamukotelo |

Palavra-passe provisória: **`jabulani2026`**. No primeiro acesso a consola
bloqueia num ecrã de "Definir palavra-passe" (mín. 10 caracteres, diferente da
provisória e da atual) — só depois disso o painel abre.

## Criar / repor as contas

Pré-requisito no ambiente (ou no `.env` da raiz): `DATABASE_URL_UNPOOLED`
(recomendado) ou `DATABASE_URL`.

```bash
# Criar as contas em falta (idempotente; não toca nas senhas existentes)
npm run admins

# Repor a senha provisória em TODAS as contas oficiais
npm run admins:reset
```

O script `scripts/create-ancaf-admins.mjs`:
- insere a conta com a senha provisória e `must_change_password = true` se
  ainda não existir;
- com `--reset`, repõe o hash da provisória e volta a marcar
  `must_change_password = true`;
- **sem** `--reset`, não altera a senha de contas que já existem.

## Recuperação de palavra-passe (self-service)

No `/login`, o botão **"Recuperar palavra-passe"** abre o modo de recuperação:
pede o e-mail e envia um link para definir uma senha nova. O mesmo pedido pode
ser feito a partir do ecrã de senha provisória, pelo botão **"Não sei a
palavra-passe provisória"**.

Como funciona:

1. `POST /api/admin/forgot-password` cria um registo em
   `public.ancaf_password_resets` e envia o link por e-mail (Resend).
   Pedidos anteriores por usar são invalidados.
2. O token só existe em claro no e-mail — na base de dados fica o SHA-256.
   É válido **1 hora** e serve **uma única vez**.
3. `/reset-password?token=…` valida o link e, ao submeter,
   `POST /api/admin/reset-password` grava o novo hash e marca o token como
   usado na mesma instrução SQL (não é possível reutilizá-lo).

A resposta do pedido é sempre genérica, para não revelar se um e-mail está
registado. A única exceção é o serviço de e-mail não estar configurado, que
devolve 503 com uma mensagem clara — não diz nada sobre a conta.

Variáveis necessárias:

| Variável | Para quê |
|---|---|
| `RESEND_API_KEY` | envio do e-mail |
| `ADMIN_NOTIFICATION_FROM` | remetente (se vazio, usa `NEWS_NOTIFICATION_FROM`) |
| `NEXT_PUBLIC_SITE_URL` | origem do link (se vazio, usa a do pedido) |

Sem estas variáveis o botão continua visível, mas responde
"A recuperação por e-mail não está configurada" — nesse caso a reposição é
feita pelo `npm run admins:reset`.

A tabela é criada pela migração
`supabase/migrations/20260920000000_admin_password_resets.sql`
(registada no `npm run neon:setup` como `005_admin_password_resets`).

## Rotação

- A troca no primeiro acesso é obrigatória (`must_change_password`).
- Para forçar nova rotação a um utilizador:
  `update public.ancaf_profiles set must_change_password = true where email = '<email>';`
- Para repor a senha de um só utilizador:
  `update public.ancaf_profiles set password_hash = crypt('jabulani2026', gen_salt('bf', 12)), must_change_password = true where email = '<email>';`
- Para invalidar **todas** as sessões de uma vez, renove
  `ADMIN_SESSION_SECRET` no ambiente (os cookies assinados deixam de validar).
