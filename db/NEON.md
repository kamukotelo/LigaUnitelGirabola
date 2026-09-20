# Migração para Neon

O portal está a migrar do Supabase bloqueado por quota para Neon Postgres. A
mudança será feita em paralelo: preparar, carregar, validar e só depois trocar
produção. O portal atual continua disponível durante esta fase.

## Arquitetura escolhida

- **Base de dados:** Neon Postgres, acedida exclusivamente no servidor.
- **Ligação do portal:** `@neondatabase/serverless` por HTTP, usando
  `DATABASE_URL` pooled.
- **Migrações:** ligação direta `DATABASE_URL_UNPOOLED`.
- **Autenticação:** Neon Auth, ativada no projeto Neon. Não transportar hashes
  ou sessões do Supabase bloqueado; recriar os quatro administradores.
- **Ficheiros:** emblemas e documentos permanecem em `public/`; fotografias de
  jogadores serão migradas para um serviço de objetos numa fase posterior.

## 1. Criar e ligar o projeto

Crie um projeto Neon na região mais próxima da execução da Vercel e copie as
duas ligações apresentadas no painel:

```env
DATABASE_URL=postgresql://...-pooler.../neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://.../neondb?sslmode=require
```

Não use `NEXT_PUBLIC_`: estas credenciais nunca podem chegar ao browser.

## 2. Instalar esquema e snapshot

```bash
npm run neon:setup
npm run neon:verify
```

O instalador é idempotente e regista cada etapa em
`public.ancaf_schema_migrations`.

## 3. Ativar Neon Auth

No painel Neon, abra **Auth**, ative autenticação por e-mail/senha e configure
`https://ligaunitelgirabola.com` como origem confiável. Guarde a variável
fornecida pelo Neon:

```env
NEON_AUTH_BASE_URL=https://.../auth
```

Depois serão recriadas as contas administrativas e trocado o login do portal.

## 4. Variáveis na Vercel

Adicionar `DATABASE_URL`, `DATABASE_URL_UNPOOLED` e `NEON_AUTH_BASE_URL` aos
ambientes Production e Preview. As variáveis Supabase só serão removidas após
o teste de leitura, escrita, autenticação e rollback.

## Critérios antes da troca

- 16 clubes e 240 jogos presentes;
- calendário, classificações, notícias e nomeações iguais ao portal atual;
- login e redefinição de senha dos administradores funcionais;
- importação FCMS testada numa branch Neon;
- backup e rollback documentados;
- nenhum segredo exposto ao browser.
