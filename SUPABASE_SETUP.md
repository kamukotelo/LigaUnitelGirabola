# Inicialização do Supabase — Liga Unitel Girabola

## 1. Criar o projeto

1. Criar um projeto em <https://supabase.com/dashboard> e guardar a password da base de dados.
2. Em **Project Settings → API**, copiar o Project URL, a chave `anon` e a chave `service_role`.
3. Gerar o token de sincronização com `openssl rand -hex 32`.

## 2. Inicializar o esquema

No **SQL Editor** do Supabase, abrir e executar integralmente:

`supabase/migrations/20260701000000_ancaf_init.sql`

O script é idempotente: pode ser executado novamente. Cria tabelas, índices,
triggers, RLS, políticas, Realtime e os dados base das 16 equipas.

Alternativa com Supabase CLI, depois de associar o projeto:

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

## 3. Configurar o portal localmente

Copiar `.env.example` para `.env.local` e preencher:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ANCAF_SYNC_TOKEN=...
```

`SUPABASE_SERVICE_ROLE_KEY` e `ANCAF_SYNC_TOKEN` são segredos de servidor. Nunca
devem receber o prefixo `NEXT_PUBLIC_`, ser enviados ao browser ou versionados.

## 4. Verificar a instalação

```bash
node --env-file=.env.local scripts/verify-supabase.mjs
npm run build
```

A verificação deve encontrar a configuração `active_calendar_seed`, 16 equipas,
duas épocas e acesso válido com `service_role`.

## 5. Configurar a Vercel

Adicionar as quatro variáveis em **Project Settings → Environment Variables**
para Production, Preview e Development. Depois, fazer um novo deployment.

## 6. Teste final da integração

```bash
curl -X POST 'https://liga-unitel-girabola.vercel.app/api/ancaf/update-seed' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_ANCAF_SYNC_TOKEN' \
  -d '{"seed":1357}'

curl 'https://liga-unitel-girabola.vercel.app/api/ancaf?format=matches'
```

O POST só devolve sucesso quando a seed for realmente persistida na base de
dados. O GET deve devolver `count: 240` e a mesma seed em `source.accessCode`.
