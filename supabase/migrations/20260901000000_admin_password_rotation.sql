-- ═══════════════════════════════════════════════════════════════════════
-- ANCAF · ROTAÇÃO OBRIGATÓRIA DE SENHA NO PRIMEIRO ACESSO
-- Liga Unitel Girabola — plataforma digital
--
-- Acrescenta a `ancaf_profiles` a marca que obriga um administrador a
-- definir uma palavra-passe nova antes de usar a consola. As contas
-- criadas por `scripts/create-ancaf-admins.mjs` começam com
-- must_change_password = true.
--
-- Idempotente: pode ser executado várias vezes.
-- ═══════════════════════════════════════════════════════════════════════

alter table public.ancaf_profiles
  add column if not exists must_change_password boolean not null default false;

alter table public.ancaf_profiles
  add column if not exists password_changed_at timestamptz;
