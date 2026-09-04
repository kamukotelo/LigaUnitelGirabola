import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { PLAYERS } from '../src/lib/data.ts';

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
const read = async (query) => {
  const result = await query;
  if (result.error) throw new Error(result.error.message);
  return result.data;
};

const source = await read(client.from('girabola_players').select('*'));
const existing = await read(client.from('ancaf_players').select('*'));
const localByIdentity = new Map(PLAYERS.map((player) => [`${player.teamId}:${player.maId}`, player]));

const rows = source.map((record) => {
  const local = localByIdentity.get(`${record.club_id}:${record.ma_id}`);
  assert(local, `Inscrição sem correspondência no portal: ${record.club_id}/${record.ma_id}`);
  return {
    id: local.id,
    team_id: record.club_id,
    club: local.club,
    // O nome curto/alcunha é o nome de apresentação do portal.
    name: local.name,
    // O relatório/FCMS é a autoridade para o nome civil completo.
    full_name: record.full_name || record.name,
    position: local.position,
    jersey_number: record.jersey_number ?? local.jerseyNumber ?? 0,
    age: local.age ?? 0,
    birth_date: local.birthDate ?? null,
    nationality: local.nationality || record.nationality || 'A confirmar',
    height: local.height || 'A confirmar',
    goals: local.goals ?? 0,
    assists: local.assists ?? 0,
    appearances: local.appearances ?? 0,
    photo_url: local.photoUrl ?? null,
    bio: local.bio ?? null,
    attributes: local.attributes ?? {},
    career_history: local.careerHistory ?? [],
    ma_id: record.ma_id,
    gender: record.gender ?? 'MALE',
    fifa_connect_id: record.fifa_id || null,
    fifa_connect_status: 'active',
    registered_squad: local.registeredSquad !== false,
  };
});

assert.equal(rows.length, source.length);
assert.equal(new Set(rows.map((row) => row.id)).size, rows.length, 'IDs internos duplicados');
assert.equal(new Set(rows.map((row) => `${row.team_id}:${row.ma_id}`)).size, rows.length, 'MA IDs duplicados');
assert.equal(new Set(rows.map((row) => row.team_id)).size, 16, 'Plantel não cobre os 16 clubes');

const linked = JSON.parse(fs.readFileSync('outputs/atualizacao-jornada1-2026-09-03/nomes-e-alcunhas.json'));
for (const relation of linked) {
  const row = rows.find((candidate) => candidate.team_id === relation.teamId && candidate.ma_id === relation.maId);
  assert(row, `Relação dos jogos ausente do plantel oficial: ${relation.maId}`);
  assert.equal(row.id, relation.playerId);
  assert.equal(row.name, relation.name);
  row.full_name = relation.fullName;
}

console.log(JSON.stringify({ source: source.length, existing: existing.length, destination: rows.length, clubs: 16, linkedFromReports: linked.length }, null, 2));
if (!process.argv.includes('--apply')) process.exit(0);

const backupPath = `outputs/atualizacao-jornada1-2026-09-03/ancaf-players-backup-${Date.now()}.json`;
fs.writeFileSync(backupPath, JSON.stringify(existing, null, 2), { mode: 0o600 });
for (let offset = 0; offset < rows.length; offset += 100) {
  await read(client.from('ancaf_players').upsert(rows.slice(offset, offset + 100), { onConflict: 'id' }));
}

const saved = await read(client.from('ancaf_players').select('id,team_id,name,full_name,ma_id,fifa_connect_id'));
assert.equal(saved.length, rows.length, 'Quantidade inesperada após migração');
for (const relation of linked) {
  const row = saved.find((candidate) => candidate.id === relation.playerId);
  assert(row);
  assert.equal(row.ma_id, relation.maId);
  assert.equal(row.name, relation.name);
  assert.equal(row.full_name, relation.fullName);
}

fs.writeFileSync(
  'outputs/atualizacao-jornada1-2026-09-03/player-migration-receipt.json',
  JSON.stringify({ completedAt: new Date().toISOString(), backupPath, players: saved.length, clubs: 16, linkedFromReports: linked.length }, null, 2),
);
console.log('VERIFICADO: plantéis completos e relações nome/alcunha gravados em ancaf_players.');
