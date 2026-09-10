-- ═════════════════════════════════════════════════════════════════════
-- SEED INCREMENTAL · APENAS DADOS NOVOS / ATUALIZADOS (JORNADAS 4 E 5)
-- Liga Unitel Girabola 2026-27
-- Executável diretamente no SQL Editor do Supabase sem conflitos.
-- ═════════════════════════════════════════════════════════════════════

-- 1. Criação idempotente das tabelas (caso ainda não tenham sido criadas)
create table if not exists public.ancaf_referee_nominations (
    id              uuid primary key default gen_random_uuid(),
    season_id       text references public.ancaf_seasons(id) on delete cascade,
    round           integer not null,
    match_id        text references public.ancaf_matches(id) on delete cascade,
    referee         text not null,
    assistants      jsonb default '[]'::jsonb,
    fourth_official text,
    published_at    timestamptz not null default timezone('utc', now()),
    created_at      timestamptz not null default timezone('utc', now()),
    updated_at      timestamptz not null default timezone('utc', now()),
    unique (match_id)
);
create index if not exists ancaf_nominations_season_round_idx
    on public.ancaf_referee_nominations(season_id, round);
alter table public.ancaf_referee_nominations enable row level security;
drop policy if exists "ancaf public read nominations" on public.ancaf_referee_nominations;
create policy "ancaf public read nominations" on public.ancaf_referee_nominations for select using (true);

create table if not exists public.ancaf_match_lineups (
    id           uuid primary key default gen_random_uuid(),
    match_id     text references public.ancaf_matches(id) on delete cascade,
    team_id      text references public.ancaf_teams(id) on delete cascade,
    side         text check (side in ('home', 'away')),
    players      jsonb not null default '[]'::jsonb,
    coach        text,
    confirmed_by text default 'admin',
    confirmed_at timestamptz not null default timezone('utc', now()),
    created_at   timestamptz not null default timezone('utc', now()),
    updated_at   timestamptz not null default timezone('utc', now()),
    unique (match_id, team_id)
);
create index if not exists ancaf_lineups_match_idx on public.ancaf_match_lineups(match_id);
alter table public.ancaf_match_lineups enable row level security;
drop policy if exists "ancaf public read lineups" on public.ancaf_match_lineups;
create policy "ancaf public read lineups" on public.ancaf_match_lineups for select using (true);

create table if not exists public.ancaf_match_events (
    id           uuid primary key default gen_random_uuid(),
    match_id     text references public.ancaf_matches(id) on delete cascade,
    minute       integer not null,
    type         text not null,
    team         text not null,
    player       text not null,
    player_id    text,
    assist       text,
    player_out   text,
    detail       text,
    sort_order   integer not null default 0,
    created_at   timestamptz not null default timezone('utc', now())
);
create index if not exists ancaf_events_match_idx on public.ancaf_match_events(match_id);
alter table public.ancaf_match_events enable row level security;
drop policy if exists "ancaf public read events" on public.ancaf_match_events;
create policy "ancaf public read events" on public.ancaf_match_events for select using (true);

create table if not exists public.ancaf_match_stats (
    id         uuid primary key default gen_random_uuid(),
    match_id   text references public.ancaf_matches(id) on delete cascade,
    side       text check (side in ('home', 'away')),
    stat_key   text not null,
    value      numeric not null,
    official   boolean default false,
    updated_at timestamptz not null default timezone('utc', now()),
    unique (match_id, side, stat_key)
);
create index if not exists ancaf_stats_match_idx on public.ancaf_match_stats(match_id);
alter table public.ancaf_match_stats enable row level security;
drop policy if exists "ancaf public read stats" on public.ancaf_match_stats;
create policy "ancaf public read stats" on public.ancaf_match_stats for select using (true);

-- 2. Atletas novos confirmados nas fichas de jogo
insert into public.ancaf_players (id, team_id, club, name, full_name, position, jersey_number, age, birth_date, nationality, height, goals, assists, appearances, ma_id, gender, fifa_id, status, registered_squad, attributes, career_history, photo_url) values
  ('patrick-banza-interclube', 'interclube', 'GD Interclube', 'Patrick Banza', 'Patrick Banza', 'Avançado', 7, 0, null, 'Angola', 'A confirmar', 0, 0, 1, null, 'MALE', null, 'active', true, '{"pace":0,"shooting":0,"passing":0,"dribbling":0,"defending":0,"physical":0}'::jsonb, '[]'::jsonb, null),
  ('quiteque-lobito', 'lobito', 'Académica do Lobito', 'Quiteque', 'Quiteque', 'Médio', 8, 0, null, 'Angola', 'A confirmar', 0, 0, 1, null, 'MALE', null, 'active', true, '{"pace":0,"shooting":0,"passing":0,"dribbling":0,"defending":0,"physical":0}'::jsonb, '[]'::jsonb, null),
  ('pinto-lobito', 'lobito', 'Académica do Lobito', 'Pinto', 'Pinto', 'Avançado', 14, 0, null, 'Angola', 'A confirmar', 0, 0, 1, null, 'MALE', null, 'active', true, '{"pace":0,"shooting":0,"passing":0,"dribbling":0,"defending":0,"physical":0}'::jsonb, '[]'::jsonb, null),
  ('sabones-lobito', 'lobito', 'Académica do Lobito', 'Sabones', 'Sabones', 'Avançado', 17, 0, null, 'Angola', 'A confirmar', 0, 0, 1, null, 'MALE', null, 'active', true, '{"pace":0,"shooting":0,"passing":0,"dribbling":0,"defending":0,"physical":0}'::jsonb, '[]'::jsonb, null)
on conflict (id) do update set team_id = excluded.team_id, club = excluded.club, name = excluded.name, position = excluded.position, jersey_number = excluded.jersey_number;

-- 3. Atualização dos jogos das 4.ª e 5.ª jornadas
insert into public.ancaf_matches (id, season_id, round, home_team_id, away_team_id, home_team_name, away_team_name, home_score, away_score, score, half_time_score, kickoff_time, stadium, status, match_type, referee, broadcaster, attendance, possession_home) values
  ('m27-4-5', '2026-27', 4, 'cabinda', 'dago', 'FC Cabinda', 'CD 1.º de Agosto', 1, 1, '1-1', '1-0', '2026-09-09T14:00:00.000Z', 'Estádio França Ndalu', 'finished', 'official', 'António Caluassi Dungula', 'Zsports', null, null),
  ('m27-4-7', '2026-27', 4, 'interclube', 'lobito', 'GD Interclube', 'Académica do Lobito', 2, 0, '2-0', '2-0', '2026-09-10T14:30:00.000Z', 'Estádio 22 de Junho', 'live', 'official', 'Bernardo Kenge Mário', 'Zsports', null, null),
  ('m27-4-2', '2026-27', 4, 'lundasul', 'sagrada', 'Desportivo da Lunda Sul', 'Sagrada Esperança', 0, 0, null, null, '2026-09-12T14:00:00.000Z', 'Estádio do Sagrada Esperança', 'scheduled', 'official', null, null, null, null),
  ('m27-5-7', '2026-27', 5, 'kabuscorp', 'interclube', 'Kabuscorp SC', 'GD Interclube', 0, 0, null, null, '2026-09-20T14:00:00.000Z', 'Estádio França Ndalu', 'scheduled', 'official', null, 'Zsports', null, null)
on conflict (id) do update set
  home_score = excluded.home_score,
  away_score = excluded.away_score,
  score = excluded.score,
  half_time_score = excluded.half_time_score,
  kickoff_time = excluded.kickoff_time,
  stadium = excluded.stadium,
  status = excluded.status,
  referee = excluded.referee,
  broadcaster = excluded.broadcaster;

-- 4. Nomeações de arbitragem publicadas para a 4.ª jornada
insert into public.ancaf_referee_nominations (season_id, round, match_id, referee, assistants, fourth_official) values
  ('2026-27', 4, 'm27-4-5', 'António Caluassi Dungula', '["Victorino Nangolo Dungula","Zacarias Chivanja Calembe"]'::jsonb, 'Aldair Quissanga Rodrigues Carmelino'),
  ('2026-27', 4, 'm27-4-7', 'Bernardo Kenge Mário', '["Nery Domingos Pereira Amador da Silva","Josemar Ageu Domingos Francisco"]'::jsonb, 'Sabino Garcez de Sousa de Carvalho')
on conflict (match_id) do update set
  season_id = excluded.season_id,
  round = excluded.round,
  referee = excluded.referee,
  assistants = excluded.assistants,
  fourth_official = excluded.fourth_official;

-- 5. Escalações oficiais da 4.ª jornada (Cabinda–Agosto e Interclube–Lobito com novos apelidos)
insert into public.ancaf_match_lineups (match_id, team_id, side, players, coach, confirmed_by) values
  ('m27-4-5', 'cabinda', 'home', '[{"playerId":"cabinda-player-1","name":"João Eduardo","number":1,"position":"GK","isStarter":true,"isCaptain":false},{"playerId":"rodrigo-cabinda","name":"Rodrigo","number":2,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"fifa-1qtzy92","name":"Francisco Luemba","number":4,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"marcos-cabinda","name":"Marcos","number":5,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"luyeye-cabinda","name":"Luyeye Tomás","number":13,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"cornelio-cabinda","name":"Cornélio","number":15,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"julio-cabinda","name":"Júlio Mavungo André","number":17,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"fernando-cabinda","name":"Fernando","number":21,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"fifa-1ljjyh4","name":"Mário da Silva","number":24,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"ariclenis-cabinda","name":"Ariclenis Afonso Araújo Lede","number":29,"position":"FWD","isStarter":true,"isCaptain":false},{"playerId":"pedro-da-silva-cabinda","name":"Pedro da Silva","number":30,"position":"FWD","isStarter":true,"isCaptain":false},{"playerId":"francisco-cabinda","name":"Francisco","number":12,"position":"GK","isStarter":false,"isCaptain":false},{"playerId":"gedeon-cabinda","name":"Gedeon","number":3,"position":"DEF","isStarter":false,"isCaptain":false},{"playerId":"mario-cabinda","name":"Mário","number":6,"position":"DEF","isStarter":false,"isCaptain":false},{"playerId":"cristiano-cabinda","name":"Cristiano Malonda","number":8,"position":"MID","isStarter":false,"isCaptain":false},{"playerId":"simao-gomes-cabinda","name":"Simão Gomes","number":14,"position":"FWD","isStarter":false,"isCaptain":false},{"playerId":"domingos-paixao-cabinda","name":"Domingos Paixão Paulino Lourenço","number":19,"position":"MID","isStarter":false,"isCaptain":false},{"playerId":"frederico-cabinda","name":"Frederico Zau","number":20,"position":"DEF","isStarter":false,"isCaptain":false},{"playerId":"jaime-cabinda","name":"Jaime","number":26,"position":"MID","isStarter":false,"isCaptain":false},{"playerId":null,"name":"Crichano Diacango","number":28,"position":"FWD","isStarter":false,"isCaptain":false}]'::jsonb, 'Luciano Capoco', 'seed'),
  ('m27-4-5', 'dago', 'away', '[{"playerId":"nuno-dago","name":"Nuno","number":1,"position":"GK","isStarter":true,"isCaptain":false},{"playerId":"bruno-dago","name":"Bruno","number":6,"position":"FWD","isStarter":true,"isCaptain":false},{"playerId":"axel-dago","name":"Axel","number":8,"position":"FWD","isStarter":true,"isCaptain":false},{"playerId":"rupson-dago","name":"Rupson","number":9,"position":"FWD","isStarter":true,"isCaptain":false},{"playerId":"venancio-dago","name":"Venâncio","number":15,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"fifa-1pxu511","name":"Afonso Paxe","number":19,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":null,"name":"Paulo de Sousa Lopes Da Costa","number":21,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"fifa-1pxwmn6","name":"Erique de Jesus","number":24,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"fifa-1v12ek6","name":"Luciano dos Santos","number":25,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"castro-dago","name":"Castro","number":27,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"bencao-dago","name":"Benção","number":36,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"milton-dago","name":"Milton","number":2,"position":"DEF","isStarter":false,"isCaptain":false},{"playerId":"obed-dago","name":"Obed","number":14,"position":"FWD","isStarter":false,"isCaptain":false},{"playerId":"macaia-dago","name":"Macaia","number":16,"position":"DEF","isStarter":false,"isCaptain":false},{"playerId":"dago-tshibamba","name":"Dagó Tshibamba","number":17,"position":"FWD","isStarter":false,"isCaptain":false},{"playerId":"cliver-dago","name":"Clíver","number":18,"position":"MID","isStarter":false,"isCaptain":false},{"playerId":"tombe-dago","name":"Tombé","number":20,"position":"MID","isStarter":false,"isCaptain":false},{"playerId":"fifa-1pwaay2","name":"Enoque Kabesa","number":23,"position":"MID","isStarter":false,"isCaptain":false},{"playerId":"bulaya-dago","name":"Bulaya","number":28,"position":"DEF","isStarter":false,"isCaptain":false},{"playerId":null,"name":"Justo Pucusso","number":31,"position":"GK","isStarter":false,"isCaptain":false}]'::jsonb, 'Filipe Nanza', 'seed'),
  ('m27-4-7', 'interclube', 'home', '[{"playerId":"fifa-1jtvf71","name":"Ru","number":22,"position":"GK","isStarter":true,"isCaptain":false},{"playerId":"fifa-1jtv4k9","name":"Salomão","number":5,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"fifa-1jtv3g3","name":"Além","number":6,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"patrick-banza-interclube","name":"Patrick Banza","number":7,"position":"FWD","isStarter":true,"isCaptain":false},{"playerId":"fifa-1kz4cq5","name":"Alcides","number":14,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"fifa-1jtuys4","name":"Jamanta","number":18,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"fifa-1jsrqx5","name":"Nandinho","number":25,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"fifa-1lzlzp0","name":"Moisés","number":28,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"fifa-1k0sa99","name":"Betinho","number":29,"position":"FWD","isStarter":true,"isCaptain":false},{"playerId":"fifa-1k26vw6","name":"Caneta","number":32,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"fifa-1m92d85","name":"Paulo Gaspar","number":33,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"fifa-1jz6pv1","name":"Panzo","number":12,"position":"GK","isStarter":false,"isCaptain":false},{"playerId":"fifa-1qfxvu3","name":"Gaby","number":8,"position":"MID","isStarter":false,"isCaptain":false},{"playerId":"fifa-1uz41e0","name":"Walter","number":20,"position":"FWD","isStarter":false,"isCaptain":false},{"playerId":"fifa-1m7hyz3","name":"Altura","number":23,"position":"DEF","isStarter":false,"isCaptain":false},{"playerId":"fifa-1t9mip7","name":"Toy","number":26,"position":"DEF","isStarter":false,"isCaptain":false},{"playerId":"fifa-1k1ket3","name":"Bey","number":27,"position":"DEF","isStarter":false,"isCaptain":false},{"playerId":"fifa-1jzyk44","name":"Boiado","number":30,"position":"FWD","isStarter":false,"isCaptain":false},{"playerId":"fifa-1ni2dp9","name":"Afonso","number":36,"position":"FWD","isStarter":false,"isCaptain":false},{"playerId":"fifa-1jrkqx3","name":"Sandro","number":37,"position":"MID","isStarter":false,"isCaptain":false}]'::jsonb, 'Divaldo Alves', 'seed'),
  ('m27-4-7', 'lobito', 'away', '[{"playerId":"guilherme-lobito","name":"Muhango","number":12,"position":"GK","isStarter":true,"isCaptain":false},{"playerId":"januario-lobito","name":"Januário","number":7,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"rosario-lobito","name":"Rosário","number":4,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"lourenco-lobito","name":"Lourenço","number":5,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"quiteque-lobito","name":"Quiteque","number":8,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"ezequiel-lobito","name":"Ezequiel","number":10,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"fifa-1jrj1l5","name":"Calela","number":13,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"pinto-lobito","name":"Pinto","number":14,"position":"FWD","isStarter":true,"isCaptain":false},{"playerId":"fifa-1m79nl1","name":"Leonel","number":22,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"jorge-28-lobito","name":"Jorge","number":28,"position":"DEF","isStarter":true,"isCaptain":false},{"playerId":"valerio-lobito","name":"Valério","number":29,"position":"MID","isStarter":true,"isCaptain":false},{"playerId":"marcos-lobito","name":"Marcos","number":40,"position":"GK","isStarter":false,"isCaptain":false},{"playerId":"kaporal","name":"Florentino","number":11,"position":"FWD","isStarter":false,"isCaptain":false},{"playerId":"fifa-1l13q80","name":"Serafim","number":15,"position":"MID","isStarter":false,"isCaptain":false},{"playerId":"joaquim-lobito","name":"Joaquim","number":16,"position":"MID","isStarter":false,"isCaptain":false},{"playerId":"sabones-lobito","name":"Sabones","number":17,"position":"FWD","isStarter":false,"isCaptain":false},{"playerId":"antonio-lobito","name":"António","number":19,"position":"FWD","isStarter":false,"isCaptain":false},{"playerId":"miguel-lobito","name":"Miguel","number":24,"position":"MID","isStarter":false,"isCaptain":false},{"playerId":"wilson-david-lobito","name":"Wilson","number":25,"position":"DEF","isStarter":false,"isCaptain":false},{"playerId":"fifa-1nyjxj8","name":"Fernando","number":36,"position":"DEF","isStarter":false,"isCaptain":false}]'::jsonb, 'Silvestre Pelé', 'seed')
on conflict (match_id,team_id) do update set
  side = excluded.side,
  players = excluded.players,
  coach = excluded.coach,
  confirmed_by = excluded.confirmed_by;

-- 6. Eventos e estatísticas dos jogos da 4.ª jornada (m27-4-5 e m27-4-7)
delete from public.ancaf_match_events where match_id in ('m27-4-5', 'm27-4-7');
insert into public.ancaf_match_events (match_id, minute, type, team, player, player_id, assist, player_out, detail, sort_order) values
  ('m27-4-5', 25, 'goal', 'home', 'Luyeye Tomás', 'luyeye-cabinda', null, null, '25'' (1-0)', 0),
  ('m27-4-5', 45, 'sub', 'away', 'Dagó Tshibamba', 'dago-tshibamba', null, 'Castro', null, 1),
  ('m27-4-5', 45, 'sub', 'away', 'Bulaya', 'bulaya-dago', null, 'Erique de Jesus', null, 2),
  ('m27-4-5', 45, 'sub', 'away', 'Macaia', 'macaia-dago', null, 'Benção', null, 3),
  ('m27-4-5', 46, 'goal', 'away', 'Axel', 'axel-dago', null, null, '46'' (1-1)', 4),
  ('m27-4-5', 57, 'sub', 'home', 'Crichano Diacango', null, null, 'Ariclenis Afonso Araújo Lede', null, 5),
  ('m27-4-5', 57, 'sub', 'home', 'Domingos Paixão Paulino Lourenço', 'domingos-paixao-cabinda', null, 'Fernando', null, 6),
  ('m27-4-5', 57, 'sub', 'home', 'Gedeon', 'gedeon-cabinda', null, 'Cornélio', null, 7),
  ('m27-4-5', 64, 'sub', 'away', 'Clíver', 'cliver-dago', null, 'Luciano dos Santos', null, 8),
  ('m27-4-5', 66, 'sub', 'home', 'Cristiano Malonda', 'cristiano-cabinda', null, 'Mário da Silva', null, 9),
  ('m27-4-5', 66, 'yellow', 'home', 'Mário da Silva', 'fifa-1ljjyh4', null, null, 'Jogo perigoso', 10),
  ('m27-4-5', 71, 'sub', 'away', 'Tombé', 'tombe-dago', null, 'Rupson', null, 11),
  ('m27-4-5', 75, 'sub', 'home', 'Simão Gomes', 'simao-gomes-cabinda', null, 'Crichano Diacango', null, 12),
  ('m27-4-5', 75, 'yellow', 'home', 'Marcos', 'marcos-cabinda', null, null, 'Falta tática', 13),
  ('m27-4-5', 79, 'yellow', 'away', 'Bruno', 'bruno-dago', null, null, 'Falta tática', 14),
  ('m27-4-5', 86, 'yellow', 'home', 'João Eduardo', 'cabinda-player-1', null, null, 'Simulou lesão para retardar o jogo.', 15),
  ('m27-4-5', 93, 'yellow', 'home', 'Cristiano Malonda', 'cristiano-cabinda', null, null, 'Falta temerária', 16),
  ('m27-4-7', 26, 'goal', 'home', 'Patrick Banza', 'patrick-banza-interclube', null, null, '26'' (1-0)', 0),
  ('m27-4-7', 39, 'goal', 'home', 'Pedro Manuel', null, null, null, '39'' (2-0)', 1);

insert into public.ancaf_match_stats (match_id, side, stat_key, value, official) values
  ('m27-4-5', 'home', 'yellowCards', 4, true),
  ('m27-4-5', 'away', 'yellowCards', 1, true),
  ('m27-4-5', 'home', 'redCards', 0, true),
  ('m27-4-5', 'away', 'redCards', 0, true),
  ('m27-4-7', 'home', 'corners', 4, true),
  ('m27-4-7', 'away', 'corners', 4, true),
  ('m27-4-7', 'home', 'yellowCards', 2, true),
  ('m27-4-7', 'away', 'yellowCards', 1, true),
  ('m27-4-7', 'home', 'redCards', 0, true),
  ('m27-4-7', 'away', 'redCards', 0, true)
on conflict (match_id,side,stat_key) do update set value = excluded.value, official = excluded.official;
