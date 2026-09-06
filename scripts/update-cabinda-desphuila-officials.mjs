// Nomeações oficiais do FC Cabinda 1-2 Desportivo da Huíla (2.ª jornada, m27-2-3).
// Guarda as categorias e o comissário de jogo em ancaf_configs, no mesmo formato
// já usado para m27-3-4, m27-3-5 e m27-3-8. As nomeações (árbitro, assistentes e
// quarto árbitro) vivem em src/lib/data.ts e chegam à BD via seed-db-match-data.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';

for (const line of fs.readFileSync('.env', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const read = async (q) => { const r = await q; if (r.error) throw new Error(r.error.message); return r.data; };

const id = 'm27-2-3';
const dir = 'outputs/atualizacao-cabinda-desphuila-2026-09-06';
const key = `match_officials_${id}`;

const officials = [
  ['Sanda Mateus Miguel Kitu', 'referee', 'ÁRBITRO DA 1ª CATEGORIA NACIONAL'],
  ['Natarino António Soares', 'first_assistant', 'ÁRBITRO ASSISTENTE NACIONAL'],
  ['Nelson Lutumba Quiala', 'second_assistant', 'ÁRBITRO ASSISTENTE NACIONAL'],
  ['Regina Vita Ngola Catati Bernardo', 'fourth_official', 'ÁRBITRA ASSISTENTE INTERNACIONAL'],
  ['Júlio Gonçalves da Silva Lemos', 'match_commissioner', 'Comissário da 1ª Divisão'],
].map(([name, role, category]) => ({ name, role, category, country: 'AGO', status: 'Confirmed' }));

// Salvaguarda do estado anterior antes de escrever.
const before = {
  match: await read(c.from('ancaf_matches').select('*').eq('id', id)),
  nominations: await read(c.from('ancaf_referee_nominations').select('*').eq('match_id', id)),
  config: await read(c.from('ancaf_configs').select('*').eq('key', key)),
};
assert.equal(before.match[0]?.home_team_id, 'cabinda');
assert.equal(before.match[0]?.away_team_id, 'desphuila');
fs.writeFileSync(`${dir}/backup-${Date.now()}.json`, JSON.stringify(before, null, 2), { mode: 0o600 });

await read(c.from('ancaf_configs').upsert({
  key,
  value: JSON.stringify({
    matchId: id,
    officials,
    source: 'Ficha oficial fornecida pelo utilizador em 2026-09-06',
  }),
}, { onConflict: 'key' }));

// Verificação: o que ficou gravado é exatamente o que foi enviado.
const row = await read(c.from('ancaf_configs').select('value').eq('key', key).single());
const saved = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
assert.deepEqual(saved.officials, officials);

const nominations = await read(c.from('ancaf_referee_nominations').select('*').eq('match_id', id).single());
assert.equal(nominations.referee, officials[0].name);
assert.deepEqual(nominations.assistants, [officials[1].name, officials[2].name]);
assert.equal(nominations.fourth_official, officials[3].name);

fs.writeFileSync(`${dir}/receipt.json`, JSON.stringify({ nominations, officials, verifiedAt: new Date().toISOString() }, null, 2));
console.log('Verificado: equipa de arbitragem, categorias e comissário do m27-2-3 gravados.');
