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
    id          uuid primary key references auth.users on delete cascade,
    full_name   text,
    role        text not null default 'user' check (role in ('admin','user')),
    avatar_url  text,
    created_at  timestamptz not null default timezone('utc', now())
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

-- ═══════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY — leitura pública, escrita protegida pela API
-- ═══════════════════════════════════════════════════════════════════════
alter table public.ancaf_seasons  enable row level security;
alter table public.ancaf_teams    enable row level security;
alter table public.ancaf_players  enable row level security;
alter table public.ancaf_matches  enable row level security;
alter table public.ancaf_news     enable row level security;
alter table public.ancaf_configs  enable row level security;
alter table public.ancaf_profiles enable row level security;

-- Leitura pública (o site é público).
drop policy if exists "ancaf public read seasons"  on public.ancaf_seasons;
drop policy if exists "ancaf public read teams"    on public.ancaf_teams;
drop policy if exists "ancaf public read players"  on public.ancaf_players;
drop policy if exists "ancaf public read matches"  on public.ancaf_matches;
drop policy if exists "ancaf public read news"     on public.ancaf_news;
drop policy if exists "ancaf public read configs"  on public.ancaf_configs;
create policy "ancaf public read seasons"  on public.ancaf_seasons  for select using (true);
create policy "ancaf public read teams"    on public.ancaf_teams    for select using (true);
create policy "ancaf public read players"  on public.ancaf_players  for select using (true);
create policy "ancaf public read matches"  on public.ancaf_matches  for select using (true);
create policy "ancaf public read news"     on public.ancaf_news     for select using (true);
create policy "ancaf public read configs" on public.ancaf_configs for select to anon, authenticated
  using (
    key like 'active_calendar_%'
    or key like 'override_%'
    or key in ('logo_vertical', 'logo_horizontal', 'logo_horizontal_white', 'logo_ancaf')
  );

-- Escrita: reservada ao service_role (usado pelas rotas de API do servidor).
-- A anon key NÃO tem escrita — a segurança fica na API (token de sync).
drop policy if exists "ancaf service write seasons"  on public.ancaf_seasons;
drop policy if exists "ancaf service write teams"    on public.ancaf_teams;
drop policy if exists "ancaf service write players"  on public.ancaf_players;
drop policy if exists "ancaf service write matches"  on public.ancaf_matches;
drop policy if exists "ancaf service write news"     on public.ancaf_news;
drop policy if exists "ancaf service write configs"  on public.ancaf_configs;
create policy "ancaf service write seasons"  on public.ancaf_seasons  for all to service_role using (true) with check (true);
create policy "ancaf service write teams"    on public.ancaf_teams    for all to service_role using (true) with check (true);
create policy "ancaf service write players"  on public.ancaf_players  for all to service_role using (true) with check (true);
create policy "ancaf service write matches"  on public.ancaf_matches  for all to service_role using (true) with check (true);
create policy "ancaf service write news"     on public.ancaf_news     for all to service_role using (true) with check (true);
create policy "ancaf service write configs"  on public.ancaf_configs  for all to service_role using (true) with check (true);

-- Perfis: cada utilizador lê/edita o seu próprio registo.
drop policy if exists "ancaf own profile read"  on public.ancaf_profiles;
drop policy if exists "ancaf own profile write" on public.ancaf_profiles;
create policy "ancaf own profile read"  on public.ancaf_profiles for select using (auth.uid() = id);
create policy "ancaf own profile write" on public.ancaf_profiles for all    using (auth.uid() = id) with check (auth.uid() = id);

-- Realtime: permite que as páginas abertas reajam imediatamente à publicação
-- de uma nova semente, sem recarregar o browser.
alter table public.ancaf_configs replica identity full;
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'ancaf_configs'
     ) then
    alter publication supabase_realtime add table public.ancaf_configs;
  end if;
end
$$;

-- ═══════════════════════════════════════════════════════════════════════
-- SEED — dados de referência estáveis (épocas, semente e as 16 equipas)
-- Estádios já com as correções: França Ndalu, Mártires da Canhala e
-- Edelfride Palhares da Costa.
-- ═══════════════════════════════════════════════════════════════════════
insert into public.ancaf_configs (key, value) values
    ('active_calendar_index', '1357'),
    ('active_calendar_seed', '2877')
on conflict (key) do nothing;

insert into public.ancaf_seasons (id, label, status) values
    ('2026-27', '2026/2027', 'upcoming'),
    ('2025-26', '2025/2026', 'completed')
on conflict (id) do update set label = excluded.label, status = excluded.status;

insert into public.ancaf_teams
    (id, name, short_name, city, stadium, stadium_capacity, founded, colors, coach, colors_hex) values
    ('petro',        'Petro de Luanda',         'PET',  'Luanda',       'Estádio 11 de Novembro',                       50000, 1980, 'Amarelo, Azul e Vermelho', 'Ricardo Chéu',                     array['#F9C304','#00529B','#D21515']),
    ('wiliete',      'Wiliete de Benguela',     'WILI', 'Benguela',     'Estádio Nacional de Ombaka',                   35000, 2018, 'Verde e Amarelo',          'José Silvestre "Lito" Vidigal',    array['#008751','#F9C304']),
    ('dago',         '1.º de Agosto',           'AGO',  'Luanda',       'Estádio França Ndalu',                         20000, 1977, 'Vermelho e Preto',         'Filipe Nzanza',                    array['#D21515','#000000']),
    ('desphuila',    'Desportivo da Huíla',     'CDH',  'Lubango',      'Estádio da Tundavala',                         20000, 1998, 'Vermelho e Branco',        'Mário Soares',                     array['#D21515','#FFFFFF']),
    ('bravos',       'Bravos do Maquis',        'BMQ',  'Luena',        'Estádio Mundunduleno',                          4300, 1983, 'Azul e Branco',            'Zeca Amaral',                      array['#00529B','#FFFFFF']),
    ('kabuscorp',    'Kabuscorp',               'KAB',  'Luanda',       'Estádio dos Coqueiros',                        12000, 1994, 'Vermelho e Branco',        'Kito Ribeiro',                     array['#D21515','#FFFFFF']),
    ('sagrada',      'Sagrada Esperança',       'SAG',  'Dundo',        'Estádio Sagrada Esperança',                     8000, 1976, 'Verde e Preto',            'Francisco Moniz "Tusso"',          array['#008751','#000000']),
    ('interclube',   'Interclube',              'INT',  'Luanda',       'Estádio 22 de Junho',                           8000, 1976, 'Azul e Branco',            'Luís Gonçalves',                   array['#00529B','#FFFFFF']),
    ('lundasul',     'Desportivo da Lunda Sul', 'DLS',  'Saurimo',      'Estádio das Mangueiras',                        7000, 2020, 'Verde e Amarelo',          'Maurício Marques',                 array['#008751','#F9C304']),
    ('libolo',       'Recreativo do Libolo',    'CRL',  'Calulo',       'Estádio Municipal de Calulo',                  10000, 1942, 'Laranja e Azul',           'Hélder Teixeira',                  array['#FF6600','#00529B']),
    ('lobito',       'Académica do Lobito',     'ACA',  'Lobito',       'Estádio do Buraco',                             5000, 1970, 'Preto e Branco',           'João Pintar',                      array['#000000','#FFFFFF']),
    ('saosalvador',  'São Salvador do Kongo',   'SSK',  'Mbanza Kongo', 'Estádio Álvaro Buta',                           5000, 1999, 'Azul e Amarelo',           'Findanga Finda',                   array['#00529B','#F9C304']),
    ('cabinda',      'FC Cabinda',              'FCC',  'Cabinda',      'Estádio Nacional do Chiazi',                   25000, 2005, 'Verde e Branco',           'Pedro Gonçalves',                  array['#008751','#FFFFFF']),
    ('primeiromaio', '1.º de Maio',             'MAI',  'Benguela',     'Estádio de São Filipe',                         5000, 1981, 'Vermelho e Branco',        'Agostinho Tramagal',               array['#D21515','#FFFFFF']),
    ('caala',        'CR Caála',                'CRC',  'Caála',        'Estádio dos Mártires da Canhala',               5000, 1980, 'Azul e Branco',            'Mateus Agostinho',                 array['#00529B','#FFFFFF']),
    ('fcluanda',     'FC Luanda',               'FCL',  'Luanda',       'Campo da Cidadela',                            10000, 2020, 'Vermelho e Branco',        'Guelson Manuel',                   array['#D21515','#FFFFFF'])
on conflict (id) do update set
    name = excluded.name, short_name = excluded.short_name, city = excluded.city,
    stadium = excluded.stadium, stadium_capacity = excluded.stadium_capacity,
    founded = excluded.founded, colors = excluded.colors, coach = excluded.coach,
    colors_hex = excluded.colors_hex;

-- FIM — base de dados ANCAF inicializada.
