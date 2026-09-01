// Gera o seed SQL dos plantéis oficiais 2026/2027 (FIFA Connect / MA ID) para
// três tabelas dedicadas com o prefixo `girabola_`, independentes das tabelas
// `ancaf_` que servem o site:
//
//   public.girabola_clubs    — 16 clubes
//   public.girabola_players  — 514 jogadores (club_id -> girabola_clubs)
//   public.girabola_staff    — 230 membros de equipa técnica (club_id -> girabola_clubs)
//
// Chave primária = MA ID (único e presente em 100% dos registos).
//
//   node scripts/generate-squad-sql.mjs > supabase/seed_official_squads_2026_27.sql

import { readFile } from 'node:fs/promises';

const SOURCE = new URL('../src/lib/official-squads-2026-27.ts', import.meta.url);

// Metadados dos clubes (de src/lib/data.ts, TEAMS).
const CLUB_META = {
  primeiromaio: { officialName: 'Estrela Clube Primeiro de Maio', shortName: 'MAI', city: 'Benguela', stadium: 'Estádio Municipal', founded: 1981, nickname: 'Proletários' },
  wiliete: { officialName: 'Wiliete Sport Clube de Benguela', shortName: 'WIL', city: 'Benguela', stadium: 'Estádio Nacional de Ombaka', founded: 2018, nickname: 'Wilietes' },
  desphuila: { officialName: 'Clube Desportivo da Huíla', shortName: 'CDH', city: 'Lubango', stadium: 'Estádio da Tundavala', founded: 1998, nickname: 'Huilanos' },
  dago: { officialName: 'Clube Desportivo 1.º de Agosto', shortName: '1AG', city: 'Luanda', stadium: 'Estádio França Ndalu', founded: 1977, nickname: "D' Agosto" },
  kabuscorp: { officialName: 'Kabuscorp Sport Clube do Palanca', shortName: 'KAB', city: 'Luanda', stadium: 'Estádio 22 de Junho', founded: 1994, nickname: 'Palanquinos' },
  lobito: { officialName: 'Académica Petróleos Clube do Lobito', shortName: 'ACA', city: 'Lobito', stadium: 'Estádio da Tundavala', founded: 1970, nickname: 'Estudantes' },
  fcluanda: { officialName: 'Futebol Clube de Luanda', shortName: 'FCL', city: 'Luanda', stadium: 'Estádio França Ndalu', founded: 2020, nickname: 'Luandenses' },
  libolo: { officialName: 'Clube Recreativo e Desportivo do Libolo', shortName: 'CRL', city: 'Calulo', stadium: 'Estádio Municipal de Calulo', founded: 1942, nickname: 'Libolenses' },
  caala: { officialName: 'Clube Recreativo da Caála', shortName: 'CRC', city: 'Huambo', stadium: 'Estádio Daniel Cassoma Lutucuta', founded: 1944, nickname: 'Caalenses' },
  interclube: { officialName: 'Grupo Desportivo Interclube', shortName: 'INT', city: 'Luanda', stadium: 'Estádio 22 de Junho', founded: 1976, nickname: 'Polícias' },
  bravos: { officialName: 'Futebol Clube Bravos do Maquis', shortName: 'BMQ', city: 'Luena', stadium: 'Estádio Mundunduleno', founded: 1983, nickname: 'Maquisardes' },
  sagrada: { officialName: 'Clube Desportivo Sagrada Esperança', shortName: 'SAG', city: 'Dundo', stadium: 'Estádio Sagrada Esperança', founded: 1976, nickname: 'Lundas' },
  lundasul: { officialName: 'Clube Desportivo da Lunda-Sul', shortName: 'DLS', city: 'Saurimo', stadium: 'Estádio Sagrada Esperança', founded: 2020, nickname: 'Tchianda' },
  saosalvador: { officialName: 'São Salvador do Kongo Futebol Clube', shortName: 'SSK', city: 'Mbanza Kongo', stadium: 'Estádio Álvaro Buta', founded: 1999, nickname: 'Kongos' },
  petro: { officialName: 'Atlético Petróleos de Luanda', shortName: 'APL', city: 'Luanda', stadium: 'Estádio 11 de Novembro', founded: 1980, nickname: 'Tricolores' },
  cabinda: { officialName: 'Futebol Clube de Cabinda', shortName: 'FCC', city: 'Cabinda', stadium: 'Estádio Vici António', founded: 2005, nickname: 'Gorilas do Norte' },
};

const raw = await readFile(SOURCE, 'utf8');
const squads = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf('] as const;') + 1));

const q = (value) => (value === null || value === undefined || value === ''
  ? 'null'
  : `'${String(value).replace(/'/g, "''")}'`);

const int = (value) => (/^-?\d+$/.test(String(value ?? '').trim()) ? String(value).trim() : 'null');

function birthDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value ?? '').trim());
  return match ? `'${match[3]}-${match[2]}-${match[1]}'` : 'null';
}

const lines = [];
lines.push('-- Plantéis oficiais da Liga Unitel Girabola 2026/2027 (FIFA Connect / MA ID).');
lines.push('-- Gerado por scripts/generate-squad-sql.mjs a partir de official-squads-2026-27.ts.');
lines.push('-- Tabelas dedicadas girabola_*, independentes das tabelas ancaf_* do site.');
lines.push('');
lines.push('begin;');
lines.push('');

lines.push(`create table if not exists public.girabola_clubs (
  id            text primary key,
  name          text not null,
  official_name text,
  short_name    text,
  city          text,
  stadium       text,
  founded       integer,
  nickname      text,
  created_at    timestamptz not null default timezone('utc', now()),
  updated_at    timestamptz not null default timezone('utc', now())
);`);
lines.push('');
lines.push(`create table if not exists public.girabola_players (
  id            text primary key,            -- MA ID
  club_id       text not null references public.girabola_clubs(id) on delete cascade,
  name          text not null,
  full_name     text,
  popular_name  text,
  ma_id         text not null,
  fifa_id       text,
  gender        text,
  birth_date    date,
  nationality   text,
  position      text,                        -- GK / DF / MF / FWD (código FIFA) ou null
  jersey_number integer,
  created_at    timestamptz not null default timezone('utc', now()),
  updated_at    timestamptz not null default timezone('utc', now())
);
create index if not exists girabola_players_club_idx on public.girabola_players(club_id);`);
lines.push('');
lines.push(`create table if not exists public.girabola_staff (
  id            text primary key,            -- MA ID
  club_id       text not null references public.girabola_clubs(id) on delete cascade,
  name          text not null,
  full_name     text,
  popular_name  text,
  ma_id         text not null,
  fifa_id       text,
  gender        text,
  role          text,                        -- TMGR / ASCH / GKCH / PHYS / TMED / HDCH / ...
  nationality   text,
  created_at    timestamptz not null default timezone('utc', now()),
  updated_at    timestamptz not null default timezone('utc', now())
);
create index if not exists girabola_staff_club_idx on public.girabola_staff(club_id);`);
lines.push('');

// ── girabola_clubs ────────────────────────────────────────────────────────
lines.push('-- Clubes');
lines.push('insert into public.girabola_clubs (id, name, official_name, short_name, city, stadium, founded, nickname)');
lines.push('values');
lines.push(squads.map((s) => {
  const meta = CLUB_META[s.teamId] ?? {};
  return `  (${q(s.teamId)}, ${q(s.club)}, ${q(meta.officialName)}, ${q(meta.shortName)}, `
    + `${q(meta.city)}, ${q(meta.stadium)}, ${int(meta.founded)}, ${q(meta.nickname)})`;
}).join(',\n'));
lines.push(`on conflict (id) do update set
  name = excluded.name, official_name = excluded.official_name, short_name = excluded.short_name,
  city = excluded.city, stadium = excluded.stadium, founded = excluded.founded,
  nickname = excluded.nickname, updated_at = timezone('utc', now());`);
lines.push('');

// ── girabola_players ──────────────────────────────────────────────────────
let totalPlayers = 0;
for (const squad of squads) {
  lines.push(`-- ${squad.club} — ${squad.players.length} jogadores`);
  lines.push('insert into public.girabola_players');
  lines.push('  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)');
  lines.push('values');
  lines.push(squad.players.map((p) => {
    totalPlayers += 1;
    return `  (${q(p.maId)}, ${q(squad.teamId)}, ${q(p.name)}, ${q(p.fullName)}, ${q(p.popularName)}, `
      + `${q(p.maId)}, ${q(p.fifaId)}, ${q(p.gender)}, ${birthDate(p.birthDate)}, ${q(p.nationality)}, `
      + `${q(p.position)}, ${int(p.jerseyNumber)})`;
  }).join(',\n'));
  lines.push(`on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());`);
  lines.push('');
}

// ── girabola_staff ───────────────────────────────────────────────────────
let totalStaff = 0;
for (const squad of squads) {
  if (!squad.staff?.length) continue;
  lines.push(`-- ${squad.club} — ${squad.staff.length} equipa técnica`);
  lines.push('insert into public.girabola_staff');
  lines.push('  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)');
  lines.push('values');
  lines.push(squad.staff.map((m) => {
    totalStaff += 1;
    return `  (${q(m.maId)}, ${q(squad.teamId)}, ${q(m.name)}, ${q(m.fullName)}, ${q(m.popularName)}, `
      + `${q(m.maId)}, ${q(m.fifaId)}, ${q(m.gender)}, ${q(m.role)}, ${q(m.nationality)})`;
  }).join(',\n'));
  lines.push(`on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());`);
  lines.push('');
}

lines.push('commit;');
lines.push(`-- Total: ${squads.length} clubes, ${totalPlayers} jogadores, ${totalStaff} equipa técnica.`);

process.stdout.write(lines.join('\n') + '\n');
