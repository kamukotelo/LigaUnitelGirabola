import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
import {getPlayerFifaRecords} from '../src/lib/data.ts';
const root='outputs/atualizacao-jornada1-2026-09-03';
const reports=JSON.parse(fs.readFileSync(`${root}/validated.json`));
const ids=reports.map(r=>r.matchId);
assert.equal(new Set(ids).size,6);
const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const read=async(q)=>{const r=await q;if(r.error)throw new Error(r.error.message);return r.data;};
const tables=['ancaf_matches','liga_matches','ancaf_match_lineups','ancaf_match_events','ancaf_match_stats','ancaf_referee_nominations'];
const before={};
for(const t of tables)before[t]=await read(client.from(t).select('*').in(t.endsWith('matches')?'id':'match_id',ids));
before.ancaf_configs=await read(client.from('ancaf_configs').select('*').in('key',['override_calendar','override_nominations']));
const players=await read(client.from('ancaf_players').select('id,name,ma_id,position,team_id'));
const localPlayers=getPlayerFifaRecords().map(r=>r.player);
const byPlayer=(team,ma)=>!ma?undefined:players.find(p=>p.team_id===team&&p.ma_id===ma)??localPlayers.find(p=>p.teamId===team&&p.maId===ma);
const pos=v=>/guarda|goal|^GK$/i.test(v)?'GK':/def|lateral/i.test(v)?'DEF':/médio|medio|mid/i.test(v)?'MID':/avan|ponta|forward|FWD/i.test(v)?'FWD':null;
const plan=[];
const coaches={2:{away:'Francisco Moniz Hungo'},3:{away:'Osvaldo Roque Gonçalves da Cruz'},4:{home:'Filipe Nanza',away:'Paulo Torres'},5:{away:'Artur Benjamim Correia'},6:{home:'Águas da Silva'}};
for(const r of reports){
 const old=before.ancaf_matches.find(m=>m.id===r.matchId);assert(old);assert.equal(old.home_team_id,r.home);assert.equal(old.away_team_id,r.away);assert.equal(old.round,1);assert.equal(old.season_id,'2026-27');
 const patch={date:r.date,status:'finished',score:`${r.homeScore}-${r.awayScore}`,home_score:r.homeScore,away_score:r.awayScore,half_time_score:r.halfTimeScore,stadium:r.stadium,referee:r.officials[0],assistant_referees:r.officials.slice(1,3),fourth_official:r.officials[3],...(r.attendance===undefined?{}:{attendance:r.attendance})};
 const events=r.events.map((e,sort)=>{const p=byPlayer(r[e.team_side],e.maId),po=byPlayer(r[e.team_side],e.outMaId);return {match_id:r.matchId,minute:e.minute,type:e.type,team_side:e.team_side,player:p?.name||e.player,player_id:p?.id||null,player_out:po?.name||e.player_out||null,detail:e.detail,sort};});
 const lineups=[];
 for(const side of ['home','away']){
  const slots=r.lineups[side];if(slots.filter(p=>p.isStarter).length!==11){console.log('ONZE PRESERVADO (12 titulares):',r.matchId,side);continue;}
  const previous=before.ancaf_match_lineups.find(l=>l.match_id===r.matchId&&l.side===side);
  lineups.push({match_id:r.matchId,team_id:r[side],side,players:slots.map(s=>{const p=byPlayer(r[side],s.maId);assert(p,`Jogador sem correspondência: ${s.name}`);return {name:p.name,playerId:p.id,number:s.number,position:pos(p.position||''),isStarter:s.isStarter,isCaptain:previous?.players?.find(x=>x.playerId===p.id)?.isCaptain===true};}),coach:coaches[r.report]?.[side]??previous?.coach??null,confirmed_by:'Relatório do árbitro (atualização solicitada)'});
 }
 plan.push({report:r,patch,events,lineups});
}
console.log(JSON.stringify(plan.map(p=>({id:p.report.matchId,score:p.patch.score,events:p.events.length,lineups:p.lineups.length,unmapped:p.events.filter(e=>!e.player_id).length})),null,2));
if(!process.argv.includes('--apply'))process.exit(0);
const backup=`${root}/backup-${Date.now()}.json`;fs.writeFileSync(backup,JSON.stringify(before,null,2),{mode:0o600});console.log('Backup:',backup);
const stamp=new Date().toISOString();
for(const p of plan){
 const id=p.report.matchId;
 await read(client.from('ancaf_matches').update({...p.patch,updated_at:stamp}).eq('id',id));
 const {half_time_score,referee,assistant_referees,fourth_official,attendance,...legacy}=p.patch;
 await read(client.from('liga_matches').update({...legacy,updated_at:stamp}).eq('id',id));
 // Insert replacements before removing the exact superseded event IDs.
 const inserted=await read(client.from('ancaf_match_events').insert(p.events).select('id'));
 const oldIds=before.ancaf_match_events.filter(e=>e.match_id===id).map(e=>e.id);
 if(oldIds.length)await read(client.from('ancaf_match_events').delete().in('id',oldIds));
 assert.equal(inserted.length,p.events.length);
 if(p.lineups.length)await read(client.from('ancaf_match_lineups').upsert(p.lineups.map(l=>({...l,confirmed_at:stamp,updated_at:stamp})),{onConflict:'match_id,team_id'}));
 const oldNom=before.ancaf_referee_nominations.find(n=>n.match_id===id);
 const nom={referee,assistants:assistant_referees,fourth_official,updated_at:stamp};
 if(oldNom)await read(client.from('ancaf_referee_nominations').update(nom).eq('id',oldNom.id));
 else await read(client.from('ancaf_referee_nominations').insert({...nom,match_id:id,season_id:'2026-27',round:1,published_at:stamp}));
 const stats=['home','away'].flatMap(side=>['yellowCards','redCards'].map((key)=>({match_id:id,side,stat_key:key,value:p.events.filter(e=>e.team_side===side&&e.type===(key==='yellowCards'?'yellow':'red')).length,published:true,updated_at:stamp})));
 await read(client.from('ancaf_match_stats').upsert(stats,{onConflict:'match_id,side,stat_key'}));
 console.log('Gravado',id);
}
// Merge only these six matches into the public/admin override records.
for(const key of ['override_calendar','override_nominations']){
 const row=await read(client.from('ancaf_configs').select('*').eq('key',key).maybeSingle());
 const value=typeof row?.value==='string'?JSON.parse(row.value):(row?.value??{});
 for(const p of plan){const r=p.report;value[r.matchId]={...value[r.matchId],...(key==='override_calendar'?{date:r.date,status:'finished',score:p.patch.score,homeScore:r.homeScore,awayScore:r.awayScore,halfTimeScore:r.halfTimeScore,stadium:r.stadium,referee:r.officials[0],...(r.attendance===undefined?{}:{attendance:r.attendance})}:{referee:r.officials[0],assistants:r.officials.slice(1,3),fourth:r.officials[3]})};}
 await read(client.from('ancaf_configs').upsert({key,value:JSON.stringify(value)},{onConflict:'key'}));
}
for(const p of plan){
 const m=await read(client.from('ancaf_matches').select('*').eq('id',p.report.matchId).single());assert.equal(m.score,p.patch.score);assert.equal(m.status,'finished');
 const ev=await read(client.from('ancaf_match_events').select('*').eq('match_id',m.id));assert.equal(ev.length,p.events.length);
 for(const side of ['home','away'])assert.equal(ev.filter(e=>e.type==='goal'&&e.team_side===side).length,m[`${side}_score`]);
}
fs.writeFileSync(`${root}/receipt.json`,JSON.stringify({completedAt:stamp,backup,matches:plan.map(p=>({id:p.report.matchId,score:p.patch.score,events:p.events.length,lineups:p.lineups.length}))},null,2));
console.log('VERIFICADO: seis jogos, resultados e eventos correspondem aos relatórios.');
