import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
const c=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
const id='m27-3-4', dir='outputs/atualizacao-luanda-cabinda-2026-09-06';
const read=async q=>{const r=await q;if(r.error)throw new Error(r.error.message);return r.data;};
const before={};
for(const t of ['ancaf_matches','liga_matches'])before[t]=await read(c.from(t).select('*').eq('id',id));
before.configs=await read(c.from('ancaf_configs').select('*').in('key',['override_calendar','disciplinary_reference_m27-3-4']));
assert.equal(before.ancaf_matches[0]?.home_team_id,'fcluanda');
assert.equal(before.ancaf_matches[0]?.away_team_id,'cabinda');
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(`${dir}/backup-${Date.now()}.json`,JSON.stringify(before,null,2),{mode:0o600});
const patch={home_score:2,away_score:1,score:'2-1',status:'finished'};
for(const t of ['ancaf_matches','liga_matches'])await read(c.from(t).update(patch).eq('id',id));
const row=await read(c.from('ancaf_configs').select('*').eq('key','override_calendar').maybeSingle());
const value=typeof row?.value==='string'?JSON.parse(row.value):(row?.value??{});
value[id]={...value[id],homeScore:2,awayScore:1,score:'2-1',status:'finished'};
await read(c.from('ancaf_configs').upsert({key:'override_calendar',value:JSON.stringify(value)},{onConflict:'key'}));
const reference={matchId:id,source:'Tabela fornecida pelo utilizador em 2026-09-06',note:'Regras de referência; não são ocorrências do jogo nem sanções aplicadas. Âmbito e sequência dos limiares de amarelos não especificados.',rules:[['Yellow',5,1],['Yellow',3,1],['Red (2nd yellow)',2,1],['Red (direct)',1,2]].map(([cardType,numberOfCards,matchesSuspended])=>({offenderType:'Player',cardType,numberOfCards,matchesSuspended,ruleReset:true,reviewRequired:true}))};
await read(c.from('ancaf_configs').upsert({key:'disciplinary_reference_m27-3-4',value:JSON.stringify(reference)},{onConflict:'key'}));
const after={};
for(const t of ['ancaf_matches','liga_matches']){after[t]=await read(c.from(t).select('*').eq('id',id).single());assert.equal(after[t].score,'2-1');assert.equal(after[t].status,'finished');assert.equal(after[t].home_score,2);assert.equal(after[t].away_score,1);}
for(const key of ['override_calendar','disciplinary_reference_m27-3-4']){const r=await read(c.from('ancaf_configs').select('value').eq('key',key).single());const v=typeof r.value==='string'?JSON.parse(r.value):r.value;if(key==='override_calendar')assert.equal(v[id].score,'2-1');else assert.deepEqual(v,reference);}
fs.writeFileSync(`${dir}/receipt.json`,JSON.stringify({verifiedAt:new Date().toISOString(),after,reference},null,2));
console.log('Verificado: FC Luanda 2–1 FC Cabinda; referência disciplinar guardada sem aplicar sanções.');
