import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
import {PLAYERS} from '../src/lib/data.ts';
const root='outputs/atualizacao-jornada1-2026-09-03';
const reports=JSON.parse(fs.readFileSync(`${root}/validated.json`));
const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const read=async q=>{const r=await q;if(r.error)throw Error(r.error.message);return r.data;};
const config=await read(client.from('ancaf_configs').select('*').eq('key','override_players').maybeSingle());
const value=typeof config?.value==='string'?JSON.parse(config.value):(config?.value??{});
const isStore=['overrides','added','removed'].some(k=>Object.hasOwn(value,k));
const store=isStore?value:{overrides:value,added:[],removed:[]};
store.overrides??={};
const links=new Map();
for(const r of reports)for(const side of ['home','away'])for(const s of r.lineups[side]){
 const candidates=PLAYERS.filter(p=>p.teamId===r[side]&&p.maId===s.maId);
 assert.equal(candidates.length,1,`Identidade ambígua: ${s.name}`);
 const p=candidates[0];assert(!store.removed?.includes(p.id),`Jogador removido: ${p.id}`);
 const previous=store.overrides[p.id]??{};
 const entry={playerId:p.id,teamId:p.teamId,maId:s.maId,fullName:s.name,name:previous.name||p.name};
 if(links.has(p.id))assert.equal(links.get(p.id).maId,s.maId);
 links.set(p.id,entry);
 store.overrides[p.id]={...previous,name:entry.name,fullName:entry.fullName,maId:entry.maId};
}
const ids=reports.map(r=>r.matchId);
const lineups=await read(client.from('ancaf_match_lineups').select('*').in('match_id',ids));
const events=await read(client.from('ancaf_match_events').select('*').in('match_id',ids));
for(const e of events)assert(links.has(e.player_id),`Evento não associado: ${e.id}`);
console.log(JSON.stringify({playersLinked:links.size,lineups:lineups.length,events:events.length,examples:[...links.values()].filter(p=>['nuno-dago','depu','ju-cabral-bravos','mabilson-dago'].includes(p.playerId))},null,2));
if(!process.argv.includes('--apply'))process.exit(0);
fs.writeFileSync(`${root}/names-backup-${Date.now()}.json`,JSON.stringify({config,lineups,events},null,2),{mode:0o600});
// Compare-and-set the shared override record: abort if another editor changed it.
if(config){
 const changed=await read(client.from('ancaf_configs').update({value:JSON.stringify(store)}).eq('key','override_players').eq('value',config.value).select('key'));
 assert.equal(changed.length,1,'Outra edição alterou os jogadores; volte a validar.');
}else await read(client.from('ancaf_configs').insert({key:'override_players',value:JSON.stringify(store)}));
for(const row of lineups){
 const players=row.players.map(p=>{const link=links.get(p.playerId);return link?{...p,name:link.name,fullName:link.fullName,maId:link.maId}:p;});
 if(JSON.stringify(players)!==JSON.stringify(row.players))await read(client.from('ancaf_match_lineups').update({players}).eq('id',row.id));
}
for(const e of events){
 const link=links.get(e.player_id);const patch={player:link.name};
 if(e.type==='sub'){
  const r=reports.find(r=>r.matchId===e.match_id);
  const source=r.events.find(s=>s.type==='sub'&&s.team_side===e.team_side&&s.minute===e.minute&&s.maId===link.maId);
  assert(source,`Substituição sem fonte: ${e.id}`);
  const out=[...links.values()].find(p=>p.teamId===r[e.team_side]&&p.maId===source.outMaId);assert(out);
  patch.player_out=out.name;
 }
 if(Object.entries(patch).some(([k,v])=>e[k]!==v))await read(client.from('ancaf_match_events').update(patch).eq('id',e.id));
}
const saved=await read(client.from('ancaf_configs').select('value').eq('key','override_players').single());
const ov=JSON.parse(saved.value).overrides;
for(const p of links.values()){assert.equal(ov[p.playerId].fullName,p.fullName);assert.equal(ov[p.playerId].name,p.name);assert.equal(ov[p.playerId].maId,p.maId);}
fs.writeFileSync(`${root}/nomes-e-alcunhas.json`,JSON.stringify([...links.values()],null,2));
console.log('VERIFICADO: nomes completos e alcunhas associados sem alterar resultados nem titulares.');
