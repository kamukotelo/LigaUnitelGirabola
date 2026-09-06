import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const id = 'm27-3-4';
const dir = 'outputs/atualizacao-luanda-cabinda-2026-09-06';
const read = async q => { const r = await q; if (r.error) throw new Error(r.error.message); return r.data; };
const referee = 'Edilson Roberto Gomes André';
const assistants = ['Evanildo Gaspar dos Santos Martins', 'Pedro Domingos de Andrade Micolo'];
const fourth = 'Nelson Agostinho da Silva';
const officials = [referee, ...assistants, fourth, 'José Mateus de Carvalho Félix'].map((name, i) => ({name, role:['referee','first_assistant','second_assistant','fourth_official','match_commissioner'][i], category:['Árbitro da 1ª Categoria Internacional','Árbitro Assistente da 1ª Categoria Internacional','Árbitro Assistente da 1ª Categoria Internacional','Árbitro da 1ª Categoria Internacional','COMISSÁRIO NACIONAL'][i],country:'AGO',status:'Confirmed'}));
const keys = ['override_calendar', 'override_nominations', 'match_officials_m27-3-4'];
const before = {};
for (const t of ['ancaf_matches','liga_matches','ancaf_referee_nominations']) before[t] = await read(c.from(t).select('*').eq(t.endsWith('matches')?'id':'match_id',id));
before.configs = await read(c.from('ancaf_configs').select('*').in('key', keys));
assert.equal(before.ancaf_matches[0]?.home_team_id, 'fcluanda');
assert.equal(before.ancaf_matches[0]?.away_team_id, 'cabinda');
before.disciplinaryReference = await read(c.from('ancaf_configs').select('*').eq('key','disciplinary_reference_m27-3-4'));
fs.writeFileSync(`${dir}/backup-${Date.now()}.json`, JSON.stringify(before,null,2), {mode:0o600});
const patch = {};
await read(c.from('ancaf_matches').update({...patch,referee,assistant_referees:assistants,fourth_official:fourth}).eq('id',id));

await read(c.from('ancaf_referee_nominations').upsert({match_id:id,season_id:'2026-27',round:3,referee,assistants,fourth_official:fourth},{onConflict:'match_id'}));
for(const key of keys){
 const row = await read(c.from('ancaf_configs').select('*').eq('key',key).maybeSingle());
 const value = typeof row?.value === 'string' ? JSON.parse(row.value) : (row?.value ?? {});
 if(key==='override_calendar') value[id]={...value[id],referee};
 else if(key==='override_nominations') value[id]={...value[id],referee,assistants,fourth};
 else Object.assign(value,{matchId:id,officials,source:'Imagem e nomeações fornecidas pelo utilizador em 2026-09-06'});
 await read(c.from('ancaf_configs').upsert({key,value:JSON.stringify(value)},{onConflict:'key'}));
}
const match=await read(c.from('ancaf_matches').select('*').eq('id',id).single());
assert.equal(match.referee,referee);
const nominations=await read(c.from('ancaf_referee_nominations').select('*').eq('match_id',id).single());
assert.deepEqual(nominations.assistants,assistants); assert.equal(nominations.fourth_official,fourth);
for(const key of keys){const row=await read(c.from('ancaf_configs').select('value').eq('key',key).single());const v=typeof row.value==='string'?JSON.parse(row.value):row.value;if(key==='override_calendar')assert.equal(v[id].referee,referee);else if(key==='override_nominations')assert.equal(v[id].fourth,fourth);else assert.deepEqual(v.officials,officials);}
fs.writeFileSync(`${dir}/receipt.json`,JSON.stringify({match,nominations,officials,verifiedAt:new Date().toISOString()},null,2));
await read(c.from('ancaf_configs').delete().eq('key','disciplinary_reference_m27-3-4'));
assert.equal((await read(c.from('ancaf_configs').select('key').eq('key','disciplinary_reference_m27-3-4'))).length,0);
console.log('Verificado: quatro árbitros atualizados, comissário e categorias guardados; referência disciplinar incorreta retirada.');
