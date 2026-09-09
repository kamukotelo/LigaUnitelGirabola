-- ═══════════════════════════════════════════════════════════════════════
-- ESQUEMA PORTÁVEL — Liga Unitel Girabola
-- ───────────────────────────────────────────────────────────────────────
-- Postgres simples, sem dependências do Supabase. Gerado a partir de
-- supabase/migrations/*.sql, com estas diferenças deliberadas:
--
--   * Sem RLS nem policies (25 removidas). O controlo de acesso passa a ser
--     feito nas rotas de servidor, que já detêm a credencial e validam o
--     cookie de sessão do admin — o browser nunca fala com a BD.
--   * Sem policies de storage.objects/buckets: os ficheiros passam para
--     Vercel Blob e os emblemas para public/crests/ (ver team-crests.ts).
--   * Sem "alter publication supabase_realtime": as leituras passam a ser
--     servidas de cache e revalidadas quando o admin publica.
--   * "ancaf_profiles" deixa de referenciar auth.users e passa a guardar
--     email + password_hash (autenticação própria).
--
-- Aplicar:  psql "$DATABASE_URL" -f db/001_schema.sql
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ═══════════════════════════════════════════════════════════════════════
-- ANCAF · INICIALIZAÇÃO DA BASE DE DADOS (de raiz)
-- Liga Unitel Girabola — plataforma digital
--
-- CONVENÇÃO: todas as tabelas do domínio usam o prefixo  ancaf_
-- Idempotente: pode ser executado várias vezes (CREATE TABLE IF NOT EXISTS,
-- policies recriadas com DROP POLICY IF EXISTS, seeds com ON CONFLICT).
--
-- Como usar:
--   • Supabase → SQL Editor → colar este ficheiro → Run
--   • ou (CLI):  supabase db push
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;      -- gen_random_uuid()

-- Função utilitária: mantém updated_at atualizado.
create or replace function public.ancaf_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ───────────────────────────────────────────────────────────────────────
-- 1. ancaf_seasons — épocas do campeonato
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.ancaf_seasons (
    id          text primary key,                        -- ex.: '2026-27'
    label       text not null,                           -- ex.: '2026/2027'
    status      text not null default 'upcoming'
                check (status in ('completed', 'active', 'upcoming')),
    created_at  timestamptz not null default timezone('utc', now())
);

-- ───────────────────────────────────────────────────────────────────────
-- 2. ancaf_teams — clubes participantes
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.ancaf_teams (
    id                text primary key,                  -- ex.: 'petro'
    name              text not null,
    short_name        text,
    city              text,
    stadium           text,
    stadium_capacity  integer default 0,
    founded           integer,
    colors            text,
    coach             text,
    colors_hex        text[] default '{}',
    logo_url          text,
    created_at        timestamptz not null default timezone('utc', now()),
    updated_at        timestamptz not null default timezone('utc', now())
);

-- ───────────────────────────────────────────────────────────────────────
-- 3. ancaf_players — plantéis
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.ancaf_players (
    id              text primary key,                    -- ex.: 'dago-tshibamba'
    team_id         text references public.ancaf_teams(id) on delete set null,
    name            text not null,
    position        text,
    jersey_number   integer,
    age             integer,
    nationality     text,
    height          text,
    weight          text,
    goals           integer default 0,
    assists         integer default 0,
    appearances     integer default 0,
    photo_url       text,
    bio             text,
    attributes      jsonb default '{}'::jsonb,           -- pace/shooting/...
    career_history  jsonb default '[]'::jsonb,
    fifa_connect_status text default 'unregistered'
                    check (fifa_connect_status in ('active','pending','rejected','unregistered')),
    created_at      timestamptz not null default timezone('utc', now()),
    updated_at      timestamptz not null default timezone('utc', now())
);

create index if not exists ancaf_players_team_idx on public.ancaf_players(team_id);

-- ───────────────────────────────────────────────────────────────────────
-- 4. ancaf_matches — jogos / calendário
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.ancaf_matches (
    id            text primary key,                      -- ex.: 'm27-1-1'
    season_id     text references public.ancaf_seasons(id) on delete cascade,
    round         integer not null,
    home_team_id  text references public.ancaf_teams(id) on delete set null,
    away_team_id  text references public.ancaf_teams(id) on delete set null,
    home_team     text,
    away_team     text,
    home_score    integer default 0,
    away_score    integer default 0,
    score         text,
    date          timestamptz not null,
    stadium       text,
    status        text not null default 'scheduled'
                  check (status in ('scheduled','live','finished')),
    created_at    timestamptz not null default timezone('utc', now()),
    updated_at    timestamptz not null default timezone('utc', now())
);

create index if not exists ancaf_matches_season_round_idx on public.ancaf_matches(season_id, round);

-- ───────────────────────────────────────────────────────────────────────
-- 5. ancaf_news — notícias
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.ancaf_news (
    id           text primary key,
    title        text not null,
    category     text default 'Geral',
    date         timestamptz not null default timezone('utc', now()),
    summary      text,
    content      text,
    cover_url    text,
    created_at   timestamptz not null default timezone('utc', now()),
    updated_at   timestamptz not null default timezone('utc', now())
);

-- ───────────────────────────────────────────────────────────────────────
-- 6. ancaf_configs — configuração (ex.: semente ativa do calendário ANCAF)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.ancaf_configs (
    key         text primary key,
    value       text not null,
    updated_at  timestamptz not null default timezone('utc', now())
);

-- ───────────────────────────────────────────────────────────────────────
-- 7. ancaf_profiles — perfis / administradores (ligado ao Supabase Auth)
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.ancaf_profiles (
    -- Autenticacao propria: a senha vive aqui (hash argon2/bcrypt), ja nao no
    -- Supabase Auth. As sessoes continuam a ser cookies HMAC assinados pelo
    -- servidor (ver src/lib/admin-auth.ts).
    id                    uuid primary key default gen_random_uuid(),
    email                 text not null unique,
    password_hash         text not null,
    full_name             text,
    role                  text not null default 'user' check (role in ('admin','user')),
    avatar_url            text,
    must_change_password  boolean not null default false,
    password_changed_at   timestamptz,
    created_at            timestamptz not null default timezone('utc', now())
);

-- ── Triggers de updated_at ──────────────────────────────────────────────
drop trigger if exists ancaf_teams_touch   on public.ancaf_teams;

drop trigger if exists ancaf_players_touch on public.ancaf_players;

drop trigger if exists ancaf_matches_touch on public.ancaf_matches;

drop trigger if exists ancaf_news_touch    on public.ancaf_news;

drop trigger if exists ancaf_configs_touch on public.ancaf_configs;

create trigger ancaf_teams_touch   before update on public.ancaf_teams   for each row execute function public.ancaf_touch_updated_at();

create trigger ancaf_players_touch before update on public.ancaf_players for each row execute function public.ancaf_touch_updated_at();

create trigger ancaf_matches_touch before update on public.ancaf_matches for each row execute function public.ancaf_touch_updated_at();

create trigger ancaf_news_touch    before update on public.ancaf_news    for each row execute function public.ancaf_touch_updated_at();

create trigger ancaf_configs_touch before update on public.ancaf_configs for each row execute function public.ancaf_touch_updated_at();

-- Realtime: permite que as páginas abertas reajam imediatamente à publicação
-- de uma nova semente, sem recarregar o browser.
alter table public.ancaf_configs replica identity full;

-- FIM — base de dados ANCAF inicializada.
-- ═══════════════════════════════════════════════════════════════════════
-- ANCAF · PARIDADE COM O PORTAL DA LIGA PORTUGAL
-- Liga Unitel Girabola — plataforma digital
--
-- Enriquecimento do modelo de dados ao estilo ligaportugal.pt:
--   • ancaf_teams:   denominação oficial, presidente, palmarés, equipamentos,
--                    órgãos sociais, redes sociais, site e mapa do estádio
--   • ancaf_matches: árbitro, assistentes, transmissão TV e assistência
--                    (a hora do jogo continua no campo `date`, timestamptz)
--   • ancaf_referee_nominations: nomeações de arbitragem por jornada
--
-- Idempotente: pode ser executado várias vezes.
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────
-- 1. ancaf_teams — perfil institucional do clube
-- ───────────────────────────────────────────────────────────────────────
alter table public.ancaf_teams add column if not exists official_name text;

alter table public.ancaf_teams add column if not exists president     text;

alter table public.ancaf_teams add column if not exists palmares      jsonb default '[]'::jsonb; -- [{title, count, seasons[]}]

alter table public.ancaf_teams add column if not exists kits          jsonb default '[]'::jsonb; -- [{label, colors[]}]

alter table public.ancaf_teams add column if not exists board         jsonb default '[]'::jsonb; -- [{role, name}]

alter table public.ancaf_teams add column if not exists socials       jsonb default '{}'::jsonb; -- {facebook, instagram, youtube}

alter table public.ancaf_teams add column if not exists website       text;

alter table public.ancaf_teams add column if not exists map_url       text;

-- ───────────────────────────────────────────────────────────────────────
-- 2. ancaf_matches — ficha de jogo
-- ───────────────────────────────────────────────────────────────────────
alter table public.ancaf_matches add column if not exists referee             text;

alter table public.ancaf_matches add column if not exists assistant_referees  jsonb default '[]'::jsonb;

alter table public.ancaf_matches add column if not exists fourth_official     text;

alter table public.ancaf_matches add column if not exists broadcaster         text;

alter table public.ancaf_matches add column if not exists attendance          integer;

-- ───────────────────────────────────────────────────────────────────────
-- 3. ancaf_referee_nominations — nomeações de arbitragem por jornada
-- ───────────────────────────────────────────────────────────────────────
create table if not exists public.ancaf_referee_nominations (
    id             uuid primary key default gen_random_uuid(),
    season_id      text references public.ancaf_seasons(id) on delete cascade,
    round          integer not null,
    match_id       text references public.ancaf_matches(id) on delete cascade,
    referee        text not null,
    assistants     jsonb default '[]'::jsonb,
    fourth_official text,
    published_at   timestamptz not null default timezone('utc', now()),
    created_at     timestamptz not null default timezone('utc', now()),
    updated_at     timestamptz not null default timezone('utc', now()),
    unique (match_id)
);

create index if not exists ancaf_nominations_season_round_idx
    on public.ancaf_referee_nominations(season_id, round);

drop trigger if exists ancaf_nominations_touch on public.ancaf_referee_nominations;

create trigger ancaf_nominations_touch
    before update on public.ancaf_referee_nominations
    for each row execute function public.ancaf_touch_updated_at();

-- 3. Realtime: reflete imediatamente nas páginas abertas a troca de um emblema
--    (a coluna logo_url vive em ancaf_teams).
alter table public.ancaf_teams replica identity full;

-- FIM — armazenamento de logótipos pronto.
-- ═══════════════════════════════════════════════════════════════════════
-- ANCAF · APELIDO/ALCUNHA DA EQUIPA
-- Liga Unitel Girabola — plataforma digital
--
-- Adiciona a coluna `nickname` à tabela `ancaf_teams` para que cada clube
-- tenha o seu apelido/alcunha oficial (ex.: 'MAQUISARDES' para Bravos do Maquis).
-- Editável diretamente na consola de administração sem necessidade de alterar código.
--
-- Idempotente: pode ser executado várias vezes.
-- ═══════════════════════════════════════════════════════════════════════

alter table public.ancaf_teams add column if not exists nickname text;

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

-- ═══════════════════════════════════════════════════════════════════════
-- ANCAF · ESCALAÇÕES CONFIRMADAS POR JOGO
-- Liga Unitel Girabola — plataforma digital
--
-- Guarda o onze inicial + suplentes confirmados na consola para cada jogo
-- e equipa. É a fonte da ficha de jogo "Constituição das Equipas" (PDF
-- preenchível enviado aos delegados) e, mais tarde, das escalações
-- publicadas no portal.
--
-- players: jsonb array de
--   { playerId: string|null, name: string, number: number,
--     position: 'GK'|'DEF'|'MID'|'FWD'|null, isStarter: bool, isCaptain: bool }
--
-- Idempotente.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.ancaf_match_lineups (
  id            uuid primary key default gen_random_uuid(),
  match_id      text not null,
  team_id       text not null,
  side          text not null check (side in ('home', 'away')),
  players       jsonb not null default '[]'::jsonb,
  coach         text,
  confirmed_at  timestamptz,
  confirmed_by  text,
  updated_at    timestamptz not null default timezone('utc', now()),
  unique (match_id, team_id)
);

create index if not exists ancaf_match_lineups_match_idx on public.ancaf_match_lineups (match_id);

-- Realtime: o portal reage à confirmação de uma escalação sem recarregar.
alter table public.ancaf_match_lineups replica identity full;

drop trigger if exists ancaf_match_lineups_touch on public.ancaf_match_lineups;

create trigger ancaf_match_lineups_touch
  before update on public.ancaf_match_lineups
  for each row execute function public.ancaf_touch_updated_at();

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

-- Fonte operacional única para jogos e respetiva rastreabilidade.
create table if not exists public.ancaf_match_audit_log (
  id uuid primary key default gen_random_uuid(),
  match_id text not null references public.ancaf_matches(id) on delete cascade,
  actor_email text not null,
  action text not null check (action in ('create', 'update', 'publish')),
  before_data jsonb not null default '{}'::jsonb,
  after_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists ancaf_match_audit_match_idx on public.ancaf_match_audit_log (match_id, created_at desc);

-- Evita estados e placares incoerentes no registo operacional.
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'ancaf_matches_nonnegative_score') then
    alter table public.ancaf_matches
      add constraint ancaf_matches_nonnegative_score check (home_score >= 0 and away_score >= 0) not valid;
  end if;
end $$;

-- Integracao FIFA FCMS / Genius Sports
-- Estrutura aditiva: nao apaga nem substitui dados existentes.

create table if not exists public.ancaf_fcms_team_mappings (
  id bigint generated by default as identity primary key,
  provider text not null,
  tenant text not null,
  external_team_id text not null,
  team_id text not null references public.ancaf_teams(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (provider, tenant, external_team_id)
);

create index if not exists ancaf_fcms_team_mappings_team_idx
  on public.ancaf_fcms_team_mappings(team_id);

create table if not exists public.ancaf_fcms_match_mappings (
  id bigint generated by default as identity primary key,
  provider text not null,
  tenant text not null,
  external_match_id text not null,
  match_id text not null references public.ancaf_matches(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (provider, tenant, external_match_id)
);

create index if not exists ancaf_fcms_match_mappings_match_idx
  on public.ancaf_fcms_match_mappings(match_id);

create table if not exists public.ancaf_fcms_sync_runs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  tenant text not null,
  competition_external_id text not null,
  season_id text not null,
  request_fingerprint text not null,
  dry_run boolean not null default true,
  status text not null default 'running'
    check (status in ('running', 'validated', 'completed', 'failed')),
  matches_received integer not null default 0,
  matches_written integer not null default 0,
  events_written integer not null default 0,
  error_message text,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create index if not exists ancaf_fcms_sync_runs_created_idx
  on public.ancaf_fcms_sync_runs(created_at desc);
