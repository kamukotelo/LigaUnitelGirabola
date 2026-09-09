# Migração da base de dados

Porquê: a 9 de setembro de 2026 o projeto Supabase `jqnvpshfloypzgzvxxfp` ficou
restrito por `exceed_cached_egress_quota` — todos os pedidos (REST, Storage,
Realtime) passaram a devolver HTTP 402. O portal ficou sem base de dados.

O destino é **outro projeto Supabase**, numa conta Pro. Isso mantém em
funcionamento o `supabase-js`, o Auth, o Storage e o Realtime, por isso as 52
chamadas `.from()` do código não precisam de mudar.

## Antes de tudo: o que causou o bloqueio

A base de dados tem ~270 linhas. Não foi o volume de dados — foi o padrão de
acesso:

- `/api/portal-data` era `force-dynamic` e disparava 11 queries **por cada
  visita** ao portal;
- `/api/ancaf` e `/api/admin/overrides` idem, sem cache;
- o browser mantinha 3 canais Realtime abertos, um deles subscrito a 12
  tabelas, e cada evento remandava todas essas queries;
- emblemas e fotografias eram servidos do Supabase Storage a cada visualização.

**Isto já está corrigido no código** (ver `src/lib/portal-cache.ts`). Mudar de
projeto sem esta correção reproduzia o mesmo bloqueio na conta nova.

## Passos

### 1. Aplicar o esquema no projeto novo

Como o destino é Supabase, usar as migrações originais — trazem as policies de
RLS, que são indispensáveis quando o browser fala com a base de dados através
da chave anon:

```bash
supabase db push
```

Ou colar `supabase/migrations/*.sql`, por ordem de nome, no SQL Editor.

> `db/001_schema.sql` é uma variante **sem RLS**, preparada para um Postgres
> simples noutro fornecedor. **Não aplicar num projeto Supabase** — deixaria as
> tabelas todas abertas à chave anon.

### 2. Importar os dados

```bash
psql "$DATABASE_URL" -f db/002_seed.sql
```

São as 269 linhas do instantâneo de 1 de setembro
(`backups/supabase-production-2026-09-01T00-20-46-952Z.json`). Idempotente
(`on conflict do nothing`).

As edições feitas na consola entre 1 e 9 de setembro não estão neste
instantâneo — o projeto antigo bloqueou antes de ser possível exportar de novo.
Para as repor, ver a secção «Recuperar o que ficou no projeto antigo».

### 3. Repor jogos, escalações, eventos e estatísticas

`src/lib/data.ts` é a fonte canónica destes dados e está atualizado até à 5.ª
jornada:

```bash
npx tsx scripts/seed-db-match-data.mts
```

### 4. Recriar as contas de administração

`ancaf_profiles` liga-se a `auth.users`, que não vem no backup:

```bash
node scripts/create-ancaf-admins.mjs
```

### 5. Criar os buckets de Storage

- `team-logos` — **já não é necessário**: os emblemas passaram a ser servidos de
  `public/crests/` e estão fixados em `src/lib/team-crests.ts`.
- `players` — necessário para as fotografias dos jogadores
  (`getPlayerPhotoUrl` em `src/lib/supabase.ts`). Os ficheiros originais estão
  presos no projeto bloqueado.

### 6. Trocar as variáveis de ambiente

Local, em `.env.local` (o `.env` está no `.gitignore`, não versionar):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Em produção:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

Rever também `ANCAF_SYNC_TOKEN` e as restantes chaves do `.env.example`.

### 7. Verificar

```bash
node scripts/verify-supabase.mjs
```

## Recuperar o que ficou no projeto antigo

Três coisas continuam presas no projeto bloqueado e só saem de lá se o
**spend cap for retirado uma vez**:

1. **Emblemas dos clubes** — bucket `team-logos`;
   `scripts/restore-team-crests-from-storage.mjs` descarrega-os.
2. **Fotografias dos jogadores** — bucket `players`.
3. **Edições da consola de 1 a 9 de setembro** — reexportar as tabelas
   `ancaf_*` e refazer o `db/002_seed.sql`.

Feita a exportação, o limite pode voltar a ser aplicado e o projeto antigo
desligado.

## Ficheiros

| Ficheiro | Para quê |
|---|---|
| `db/001_schema.sql` | Esquema em Postgres simples, sem RLS. Só para um destino **não-Supabase**. |
| `db/002_seed.sql` | Dados do instantâneo de 1 de setembro, na ordem das chaves estrangeiras. |
| `supabase/migrations/*.sql` | Migrações originais, com RLS. **É o que se aplica num projeto Supabase.** |
| `scripts/restore-team-crests-from-storage.mjs` | Traz os emblemas do Storage para `public/crests/`. |
