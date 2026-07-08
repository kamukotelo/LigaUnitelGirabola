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

-- RLS — leitura pública, escrita reservada ao service_role (como as restantes).
alter table public.ancaf_referee_nominations enable row level security;
drop policy if exists "ancaf public read nominations" on public.ancaf_referee_nominations;
drop policy if exists "ancaf service write nominations" on public.ancaf_referee_nominations;
create policy "ancaf public read nominations"
    on public.ancaf_referee_nominations for select using (true);
create policy "ancaf service write nominations"
    on public.ancaf_referee_nominations for all to service_role using (true) with check (true);

-- ═══════════════════════════════════════════════════════════════════════
-- SEED — denominações oficiais e palmarés dos clubes históricos
-- (mesmos valores demonstrativos de TEAM_PROFILE_OVERRIDES em src/lib/data.ts)
-- ═══════════════════════════════════════════════════════════════════════
update public.ancaf_teams set
    official_name = 'Atlético Petróleos de Luanda — Futebol',
    president = 'Tomás Faria',
    palmares = '[{"title":"Liga Unitel Girabola","count":19,"seasons":["2025/26","2023/24","2022/23"]},{"title":"Taça de Angola","count":12},{"title":"Supertaça de Angola","count":8}]'::jsonb
where id = 'petro' and official_name is null;

update public.ancaf_teams set
    official_name = 'Clube Desportivo 1.º de Agosto — Futebol',
    president = 'Carlos Hendrick',
    palmares = '[{"title":"Liga Unitel Girabola","count":13,"seasons":["2018/19","2017/18","2016/17"]},{"title":"Taça de Angola","count":6},{"title":"Supertaça de Angola","count":7}]'::jsonb
where id = 'dago' and official_name is null;

update public.ancaf_teams set
    official_name = 'Clube Desportivo Sagrada Esperança — Futebol',
    palmares = '[{"title":"Liga Unitel Girabola","count":1,"seasons":["2004/05"]},{"title":"Taça de Angola","count":2}]'::jsonb
where id = 'sagrada' and official_name is null;

update public.ancaf_teams set
    official_name = 'Grupo Desportivo Interclube — Futebol',
    palmares = '[{"title":"Taça de Angola","count":3},{"title":"Supertaça de Angola","count":1}]'::jsonb
where id = 'interclube' and official_name is null;

update public.ancaf_teams set
    official_name = 'Clube Recreativo e Desportivo do Libolo — Futebol',
    palmares = '[{"title":"Liga Unitel Girabola","count":4,"seasons":["2015/16","2014/15","2012/13"]},{"title":"Taça de Angola","count":2}]'::jsonb
where id = 'libolo' and official_name is null;

update public.ancaf_teams set
    official_name = 'Wiliete Sport Clube de Benguela — Futebol',
    palmares = '[{"title":"Gira Bola B (2.ª Divisão)","count":1,"seasons":["2021/22"]}]'::jsonb
where id = 'wiliete' and official_name is null;

update public.ancaf_teams set
    official_name = 'Clube Desportivo Bravos do Maquis — Futebol',
    palmares = '[{"title":"Taça de Angola","count":1,"seasons":["2019/20"]}]'::jsonb
where id = 'bravos' and official_name is null;

-- FIM — paridade Liga Portugal aplicada.
