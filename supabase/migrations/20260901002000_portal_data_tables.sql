-- ═══════════════════════════════════════════════════════════════════════
-- ANCAF · TABELAS DE DADOS DO PORTAL (migração de conteúdo em código → BD)
-- Liga Unitel Girabola — plataforma digital
--
-- Cria as tabelas em falta para os conjuntos de dados que hoje só vivem em
-- src/lib/*.ts. Nesta fase as tabelas ficam prontas e são semeadas por
-- scripts/generate-db-seed.ts; a ligação dos getters (data.ts) é feita
-- incrementalmente numa fase seguinte, mantendo as constantes como fallback.
--
-- RLS: leitura pública, escrita reservada ao service_role (rotas de API).
-- Idempotente.
-- ═══════════════════════════════════════════════════════════════════════

-- ── Equipa técnica dos clubes ─────────────────────────────────────────
create table if not exists public.ancaf_team_staff (
  id           uuid primary key default gen_random_uuid(),
  team_id      text not null,
  name         text not null,
  role         text not null default 'Função por confirmar',
  nationality  text,
  ma_id        text,
  fifa_id      text,
  sort_rank    int not null default 100,
  updated_at   timestamptz not null default timezone('utc', now())
);
create index if not exists ancaf_team_staff_team_idx on public.ancaf_team_staff (team_id);

-- ── Perfil institucional do clube ────────────────────────────────────
create table if not exists public.ancaf_team_profiles (
  team_id        text primary key,
  official_name  text,
  president      text,
  website        text,
  socials        jsonb not null default '{}'::jsonb,
  palmares       jsonb not null default '[]'::jsonb,
  kits           jsonb not null default '[]'::jsonb,
  board          jsonb not null default '[]'::jsonb,
  updated_at     timestamptz not null default timezone('utc', now())
);

-- ── Classificações oficiais por época ────────────────────────────────
create table if not exists public.ancaf_standings (
  season_id       text not null,
  team_id         text not null,
  position        int,
  played          int not null default 0,
  won             int not null default 0,
  drawn           int not null default 0,
  lost            int not null default 0,
  goals_for       int not null default 0,
  goals_against   int not null default 0,
  points          int not null default 0,
  goals_verified  boolean not null default false,
  form_verified   boolean not null default false,
  updated_at      timestamptz not null default timezone('utc', now()),
  primary key (season_id, team_id)
);

-- ── Eventos de jogo (golos, cartões, substituições) ──────────────────
create table if not exists public.ancaf_match_events (
  id          uuid primary key default gen_random_uuid(),
  match_id    text not null,
  minute      int,
  type        text not null check (type in ('goal', 'yellow', 'red', 'warning', 'sub')),
  team_side   text not null check (team_side in ('home', 'away')),
  player      text not null,
  player_id   text,
  assist      text,
  player_out  text,
  detail      text,
  sort        int not null default 0,
  updated_at  timestamptz not null default timezone('utc', now())
);
create index if not exists ancaf_match_events_match_idx on public.ancaf_match_events (match_id);

-- ── Estatísticas de jogo publicadas ─────────────────────────────────
create table if not exists public.ancaf_match_stats (
  match_id    text not null,
  side        text not null check (side in ('home', 'away')),
  stat_key    text not null,
  value       numeric not null default 0,
  published   boolean not null default true,
  updated_at  timestamptz not null default timezone('utc', now()),
  primary key (match_id, side, stat_key)
);

-- ── Estatísticas por jogador e época ────────────────────────────────
create table if not exists public.ancaf_player_season_stats (
  season_id     text not null,
  player_id     text not null,
  goals         int not null default 0,
  assists       int not null default 0,
  appearances   int not null default 0,
  yellow_cards  int not null default 0,
  red_cards     int not null default 0,
  updated_at    timestamptz not null default timezone('utc', now()),
  primary key (season_id, player_id)
);

-- ── Vídeos / destaques ──────────────────────────────────────────────
create table if not exists public.ancaf_videos (
  id          text primary key,
  title       text not null,
  duration    text,
  views       text,
  category    text,
  thumbnail   text,
  video_url   text,
  is_live     boolean not null default false,
  sort        int not null default 100,
  updated_at  timestamptz not null default timezone('utc', now())
);

-- ── RLS: leitura pública, escrita service_role ──────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'ancaf_team_staff','ancaf_team_profiles','ancaf_standings',
    'ancaf_match_events','ancaf_match_stats','ancaf_player_season_stats','ancaf_videos'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I replica identity full', t);
    execute format('drop policy if exists "ancaf public read %1$s" on public.%1$I', t);
    execute format('drop policy if exists "ancaf service write %1$s" on public.%1$I', t);
    execute format('create policy "ancaf public read %1$s" on public.%1$I for select using (true)', t);
    execute format('create policy "ancaf service write %1$s" on public.%1$I for all to service_role using (true) with check (true)', t);
  end loop;
end $$;

-- ── Triggers updated_at ─────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'ancaf_team_staff','ancaf_team_profiles','ancaf_standings',
    'ancaf_match_events','ancaf_match_stats','ancaf_player_season_stats','ancaf_videos'
  ] loop
    execute format('drop trigger if exists %1$s_touch on public.%1$I', t);
    execute format('create trigger %1$s_touch before update on public.%1$I for each row execute function public.ancaf_touch_updated_at()', t);
  end loop;
end $$;
