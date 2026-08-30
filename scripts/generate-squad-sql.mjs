// Gera INSERT/upsert SQL para public.ancaf_players a partir dos plantéis
// oficiais consolidados (src/lib/official-squads-2026-27.ts).
//
//   node scripts/generate-squad-sql.mjs > supabase/seed_official_squads_2026_27.sql
//
// Cada clube é substituído na íntegra (DELETE ... WHERE team_id = ... seguido
// de INSERT ... ON CONFLICT (id) DO UPDATE), tal como as migrações existentes.

import { readFile } from 'node:fs/promises';

const SOURCE = new URL('../src/lib/official-squads-2026-27.ts', import.meta.url);
const SEASON_REFERENCE = new Date('2026-08-31T00:00:00Z'); // início da época 2026/27

const POSITION_PT = { GK: 'Guarda-redes', DF: 'Defesa', MF: 'Médio', FWD: 'Avançado' };
const NATIONALITY_PT = {
  Brazil: 'Brasil', Nigeria: 'Nigéria', Mozambique: 'Moçambique',
  'Cape Verde': 'Cabo Verde', Spain: 'Espanha', 'DR Congo': 'RD Congo',
};

const raw = await readFile(SOURCE, 'utf8');
const squads = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf('] as const;') + 1));

const q = (value) => (value === null || value === undefined || value === ''
  ? 'null'
  : `'${String(value).replace(/'/g, "''")}'`);

function ageFromBirthDate(birthDate) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(birthDate ?? '').trim());
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const born = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
  if (Number.isNaN(born.getTime())) return null;
  let age = SEASON_REFERENCE.getUTCFullYear() - born.getUTCFullYear();
  const monthDiff = SEASON_REFERENCE.getUTCMonth() - born.getUTCMonth()
    || SEASON_REFERENCE.getUTCDate() - born.getUTCDate();
  if (monthDiff < 0) age -= 1;
  return age >= 12 && age <= 55 ? age : null;
}

const slug = (text) => String(text)
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const lines = [];
lines.push('-- Plantéis oficiais 2026/2027 (FIFA Connect / MA ID) — 16 clubes.');
lines.push('-- Gerado por scripts/generate-squad-sql.mjs a partir de official-squads-2026-27.ts.');
lines.push('-- Substitui integralmente o plantel de cada clube em public.ancaf_players.');
lines.push('');
lines.push('begin;');

let totalPlayers = 0;
for (const squad of squads) {
  const usedIds = new Set();
  lines.push('');
  lines.push(`-- ${squad.club} (${squad.teamId}) — ${squad.players.length} jogadores`);
  lines.push(`delete from public.ancaf_players where team_id = ${q(squad.teamId)};`);
  lines.push('insert into public.ancaf_players');
  lines.push('  (id, team_id, name, position, jersey_number, age, nationality,');
  lines.push('   goals, assists, appearances, attributes, career_history, fifa_connect_status)');
  lines.push('values');

  const rows = squad.players.map((player) => {
    let id = `${squad.teamId}-${slug(player.fullName || player.name) || 'jogador'}`;
    let n = 2;
    while (usedIds.has(id)) id = `${squad.teamId}-${slug(player.fullName || player.name)}-${n++}`;
    usedIds.add(id);
    totalPlayers += 1;

    const position = POSITION_PT[player.position] ?? 'null-literal';
    const nationality = NATIONALITY_PT[player.nationality] ?? player.nationality;
    const jersey = /^\d+$/.test(player.jerseyNumber) ? player.jerseyNumber : 'null';
    const age = ageFromBirthDate(player.birthDate);
    const status = player.fifaId ? 'active' : 'unregistered';

    return `  (${q(id)}, ${q(squad.teamId)}, ${q(player.name)}, `
      + `${position === 'null-literal' ? 'null' : q(position)}, `
      + `${jersey}, ${age ?? 'null'}, ${q(nationality)}, `
      + `0, 0, 0, '{}'::jsonb, '[]'::jsonb, ${q(status)})`;
  });
  lines.push(rows.join(',\n') + '');
  lines.push('on conflict (id) do update set');
  lines.push('  team_id = excluded.team_id,');
  lines.push('  name = excluded.name,');
  lines.push('  position = excluded.position,');
  lines.push('  jersey_number = excluded.jersey_number,');
  lines.push('  age = excluded.age,');
  lines.push('  nationality = excluded.nationality,');
  lines.push('  fifa_connect_status = excluded.fifa_connect_status;');
}

lines.push('');
lines.push('commit;');
lines.push(`-- Total: ${totalPlayers} jogadores em ${squads.length} clubes.`);

process.stdout.write(lines.join('\n') + '\n');
