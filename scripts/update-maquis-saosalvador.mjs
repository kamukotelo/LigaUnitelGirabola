import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const id = 'm27-3-5';
const dir = 'outputs/atualizacao-maquis-saosalvador-2026-09-06';
const read = async q => { const r = await q; if (r.error) throw new Error(r.error.message); return r.data; };
const referee = 'Sabino Garcez de Sousa de Carvalho';
const assistants = ['Evandro Henrique Freitas da Rocha', 'Flávio Luís Cadete Dias'];
const fourth = 'João Chipombe';
const officials = [referee, ...assistants, fourth, 'Rodrigues Aleixo César'].map((name, i) => ({name, role:['referee','first_assistant','second_assistant','fourth_official','match_commissioner'][i], category:['ÁRBITRO DA 1ª CATEGORIA NACIONAL','ÁRBITRO ASSISTENTE NACIONAL','ÁRBITRO ASSISTENTE NACIONAL','ÁRBITRO DA 2ª CATEGORIA NACIONAL','COMISSÁRIO NACIONAL'][i],country:'AGO',status:'Confirmed'}));
const keys = ['override_calendar', 'override_nominations', 'match_officials_m27-3-5'];
const before = {};
for (const t of ['ancaf_matches','liga_matches','ancaf_referee_nominations']) before[t] = await read(c.from(t).select('*').eq(t.endsWith('matches')?'id':'match_id',id));
before.configs = await read(c.from('ancaf_configs').select('*').in('key', keys));
assert.equal(before.ancaf_matches[0]?.home_team_id, 'bravos');
assert.equal(before.ancaf_matches[0]?.away_team_id, 'saosalvador');
fs.writeFileSync(`${dir}/backup-${Date.now()}.json`, JSON.stringify(before,null,2), {mode:0o600});
const patch = {home_score:0,away_score:1,score:'0-1',status:'finished'};
await read(c.from('ancaf_matches').update({...patch,half_time_score:'0-1',referee,assistant_referees:assistants,fourth_official:fourth}).eq('id',id));
await read(c.from('liga_matches').update(patch).eq('id',id));
await read(c.from('ancaf_referee_nominations').upsert({match_id:id,season_id:'2026-27',round:3,referee,assistants,fourth_official:fourth},{onConflict:'match_id'}));
for(const key of keys){
 const row = await read(c.from('ancaf_configs').select('*').eq('key',key).maybeSingle());
 const value = typeof row?.value === 'string' ? JSON.parse(row.value) : (row?.value ?? {});
 if(key==='override_calendar') value[id]={...value[id],homeScore:0,awayScore:1,score:'0-1',halfTimeScore:'0-1',status:'finished',referee};
 else if(key==='override_nominations') value[id]={...value[id],referee,assistants,fourth};
 else Object.assign(value,{matchId:id,officials,source:'Imagem e nomeações fornecidas pelo utilizador em 2026-09-06',secondHalfScore:'0-0'});
 await read(c.from('ancaf_configs').upsert({key,value:JSON.stringify(value)},{onConflict:'key'}));
}
const match=await read(c.from('ancaf_matches').select('*').eq('id',id).single());
assert.equal(match.score,'0-1'); assert.equal(match.half_time_score,'0-1'); assert.equal(match.referee,referee);
const nominations=await read(c.from('ancaf_referee_nominations').select('*').eq('match_id',id).single());
assert.deepEqual(nominations.assistants,assistants); assert.equal(nominations.fourth_official,fourth);
for(const key of keys){const row=await read(c.from('ancaf_configs').select('value').eq('key',key).single());const v=typeof row.value==='string'?JSON.parse(row.value):row.value;if(key==='override_calendar')assert.equal(v[id].score,'0-1');else if(key==='override_nominations')assert.equal(v[id].fourth,fourth);else assert.deepEqual(v.officials,officials);}
fs.writeFileSync(`${dir}/receipt.json`,JSON.stringify({match,nominations,officials,verifiedAt:new Date().toISOString()},null,2));
console.log('Verificado: resultado 0–1, intervalo 0–1, quatro árbitros e comissário guardados.');
