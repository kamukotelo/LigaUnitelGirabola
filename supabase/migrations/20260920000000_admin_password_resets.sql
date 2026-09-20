-- ═══════════════════════════════════════════════════════════════════════
-- ANCAF · Recuperação de palavra-passe dos administradores
--
-- Guarda os pedidos de recuperação emitidos pelo /login. O token só existe
-- em claro no e-mail enviado ao administrador: aqui fica apenas o SHA-256,
-- para que uma leitura da base de dados não permita assumir uma conta.
--
-- Aplicar:  psql "$DATABASE_URL" -f supabase/migrations/20260920000000_admin_password_resets.sql
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

create table if not exists public.ancaf_password_resets (
    id          uuid primary key default gen_random_uuid(),
    email       text not null references public.ancaf_profiles(email) on delete cascade,
    token_hash  text not null unique,
    expires_at  timestamptz not null,
    used_at     timestamptz,
    created_at  timestamptz not null default timezone('utc', now())
);

create index if not exists ancaf_password_resets_email_idx
    on public.ancaf_password_resets (email);

-- Usado pela limpeza dos pedidos caducados.
create index if not exists ancaf_password_resets_expires_idx
    on public.ancaf_password_resets (expires_at)
    where used_at is null;
