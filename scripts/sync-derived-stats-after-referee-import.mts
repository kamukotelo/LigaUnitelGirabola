/** Recalcula, a partir dos jogos/eventos/escalações já armazenados, os resumos da época. */
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
const ROOT=new URL('../outputs/relatorios-arbitros-2026-09-03/',import.meta.url);
for(const line of (await readFile(new URL('../.env',import.meta.url),'utf8')).split('\n')){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');}
assert(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY);
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const data=async<T=any>(q:PromiseLike<{data:T;error:any}>)=>{const r=await q;if(r.error)throw new Error(r.error.message);return r.data;};
const season='2026-27',stamp=new Date().toISOString();
const matches=await data<any[]>(db.from('ancaf_matches').select('*').eq('season_id',season));
const ids=matches.map(m=>m.id);
const lineups=await data<any[]>(db.from('ancaf_match_lineups').select('match_id,players').in('match_id',ids));
const events=await data<any[]>(db.from('ancaf_match_events').select('match_id,type,player_id').in('match_id',ids));

const totals=new Map<string,any>();
const total=(id:string)=>{let x=totals.get(id);if(!x){x={season_id:season,player_id:id,goals:0,assists:0,appearances:0,yellow_cards:0,red_cards:0,updated_at:stamp};totals.set(id,x);}return x;};
for(const row of lineups)for(const p of row.players??[])if(p.playerId)total(p.playerId).appearances++;
for(const e of events){if(!e.player_id)continue;const x=total(e.player_id);if(e.type==='goal')x.goals++;if(e.type==='yellow')x.yellow_cards++;if(e.type==='red')x.red_cards++;}
const playerTotals=[...totals.values()];
if(playerTotals.length)await data(db.from('ancaf_player_season_stats').upsert(playerTotals,{onConflict:'season_id,player_id'}));
const grouped=new Map<string,string[]>();
for(const x of playerTotals){const k=`${x.goals}:${x.assists}:${x.appearances}`;(grouped.get(k)??grouped.set(k,[]).get(k)!).push(x.player_id);}
for(const [key,playerIds] of grouped){const [goals,assists,appearances]=key.split(':').map(Number);for(let i=0;i<playerIds.length;i+=100)await data(db.from('ancaf_players').update({goals,assists,appearances,updated_at:stamp}).in('id',playerIds.slice(i,i+100)));}

const teams=await data<any[]>(db.from('ancaf_teams').select('id,name').eq('is_historical',false));
const table=new Map(teams.map(t=>[t.id,{season_id:season,team_id:t.id,name:t.name,position:0,played:0,won:0,drawn:0,lost:0,goals_for:0,goals_against:0,points:0,goals_verified:true,form_verified:false,updated_at:stamp}]));
const finished=matches.filter(m=>m.status==='finished'&&Number.isInteger(m.home_score)&&Number.isInteger(m.away_score)).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
for(const m of finished){const h=table.get(m.home_team_id),a=table.get(m.away_team_id);if(!h||!a)continue;h.played++;a.played++;h.goals_for+=m.home_score;h.goals_against+=m.away_score;a.goals_for+=m.away_score;a.goals_against+=m.home_score;if(m.home_score>m.away_score){h.won++;h.points+=3;a.lost++;}else if(m.home_score<m.away_score){a.won++;a.points+=3;h.lost++;}else{h.drawn++;a.drawn++;h.points++;a.points++;}}
const standings=[...table.values()].sort((a,b)=>b.points-a.points||(b.goals_for-b.goals_against)-(a.goals_for-a.goals_against)||b.goals_for-a.goals_for||a.name.localeCompare(b.name,'pt')).map((x,i)=>({...x,position:i+1}));
assert.equal(standings.length,16,'Classificação deve conter 16 clubes.');
assert.equal(standings.reduce((n,x)=>n+x.played,0),finished.length*2);
await data(db.from('ancaf_standings').upsert(standings.map(({name,...x})=>x),{onConflict:'season_id,team_id'}));

const saved=await data<any[]>(db.from('ancaf_standings').select('*').eq('season_id',season));
assert.equal(saved.length,16);
for(const expected of standings){const actual=saved.find(x=>x.team_id===expected.team_id);assert(actual);for(const key of ['position','played','won','drawn','lost','goals_for','goals_against','points'])assert.equal(Number(actual[key]),expected[key],`${expected.team_id}.${key}`);}
const receipt={completedAt:stamp,season,finishedMatches:finished.length,storedLineups:lineups.length,storedEvents:events.length,playerSummaryRows:playerTotals.length,standings:standings.map(({updated_at,name,...x})=>({...x,team_name:name,goal_difference:x.goals_for-x.goals_against}))};
await writeFile(new URL('RECIBO_ESTATISTICAS_DERIVADAS.json',ROOT),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({finishedMatches:finished.length,playerSummaryRows:playerTotals.length,standingsRows:standings.length,leader:standings[0].name},null,2));
