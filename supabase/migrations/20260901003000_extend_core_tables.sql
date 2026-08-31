-- ═══════════════════════════════════════════════════════════════════════
-- ANCAF · COLUNAS EM FALTA NAS TABELAS BASE
-- Liga Unitel Girabola — plataforma digital
--
-- Alinha ancaf_teams / ancaf_players / ancaf_matches / ancaf_news com os
-- campos que o portal usa hoje (src/lib/data.ts), para que
-- scripts/generate-db-seed.ts possa semear tudo. Todas as colunas são
-- nullable e add-if-not-exists — não afeta dados existentes.
-- ═══════════════════════════════════════════════════════════════════════

-- ── ancaf_teams ──────────────────────────────────────────────────────
alter table public.ancaf_teams add column if not exists official_name    text;
alter table public.ancaf_teams add column if not exists president        text;
alter table public.ancaf_teams add column if not exists website          text;
alter table public.ancaf_teams add column if not exists kits             jsonb not null default '[]'::jsonb;
alter table public.ancaf_teams add column if not exists data_status      text;
alter table public.ancaf_teams add column if not exists data_updated_at  date;
alter table public.ancaf_teams add column if not exists is_historical    boolean not null default false;

-- ── ancaf_players ────────────────────────────────────────────────────
alter table public.ancaf_players add column if not exists full_name        text;
alter table public.ancaf_players add column if not exists club             text;
alter table public.ancaf_players add column if not exists birth_date       text;
alter table public.ancaf_players add column if not exists ma_id            text;
alter table public.ancaf_players add column if not exists gender           text;
alter table public.ancaf_players add column if not exists fifa_connect_id  text;
alter table public.ancaf_players add column if not exists preferred_foot   text;
alter table public.ancaf_players add column if not exists registered_squad boolean not null default true;

-- ── ancaf_matches ───────────────────────────────────────────────────
alter table public.ancaf_matches add column if not exists half_time_score     text;
alter table public.ancaf_matches add column if not exists referee             text;
alter table public.ancaf_matches add column if not exists broadcaster         text;
alter table public.ancaf_matches add column if not exists attendance          integer;
alter table public.ancaf_matches add column if not exists useful_time_minutes integer;
alter table public.ancaf_matches add column if not exists schedule_status     text;

-- ── ancaf_news ──────────────────────────────────────────────────────
alter table public.ancaf_news add column if not exists iso_date        text;
alter table public.ancaf_news add column if not exists status          text not null default 'published';
alter table public.ancaf_news add column if not exists author          text;
alter table public.ancaf_news add column if not exists source_name     text;
alter table public.ancaf_news add column if not exists source_url      text;
alter table public.ancaf_news add column if not exists published_at     text;
alter table public.ancaf_news add column if not exists document_images  jsonb not null default '[]'::jsonb;
alter table public.ancaf_news add column if not exists document_url     text;
alter table public.ancaf_news add column if not exists ai_assisted      boolean not null default false;
