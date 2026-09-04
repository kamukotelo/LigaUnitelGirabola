/** Importa o lote revisto de fichas de árbitro para a BD do portal.
 *
 * Dry-run: node --import tsx scripts/import-referee-reports-to-db.mts
 * Gravar:  node --import tsx scripts/import-referee-reports-to-db.mts --apply
 *
 * A ficha 8 duplicada já foi deduplicada no ficheiro de preparação.
 */
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

const ROOT = new URL('../outputs/relatorios-arbitros-2026-09-03/', import.meta.url);
const BATCH = JSON.parse(await readFile(new URL('dados_para_insercao_COM_ALCUNHAS_REVISAR.json', ROOT), 'utf8'));
for (const line of (await readFile(new URL('../.env', import.meta.url), 'utf8')).split('\n')) {
  const found = line.match(/^([A-Z_]+)=(.*)$/);
  if (found && !process.env[found[1]]) process.env[found[1]] = found[2].replace(/^["']|["']$/g, '');
}
assert(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY, 'Credenciais Supabase ausentes.');
assert.equal(BATCH.matches.length, 11);
assert.equal(new Set(BATCH.matches.map((m: any) => m.candidateMatchId)).size, 11);
const APPLY = process.argv.includes('--apply');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false,autoRefreshToken:false}});
const data = async <T=any>(query: PromiseLike<{data:T;error:any}>) => { const r=await query; if(r.error) throw new Error(r.error.message); return r.data; };
const ids = BATCH.matches.map((m: any)=>m.candidateMatchId);
const currentMatches = await data<any[]>(db.from('ancaf_matches').select('*').in('id',ids));
assert.equal(currentMatches.length,11,'Os 11 jogos candidatos devem existir em ancaf_matches.');
const currentLegacy = await data<any[]>(db.from('liga_matches').select('*').in('id',ids));
const currentLineups = await data<any[]>(db.from('ancaf_match_lineups').select('*').in('match_id',ids));
const currentEvents = await data<any[]>(db.from('ancaf_match_events').select('*').in('match_id',ids));
const currentStats = await data<any[]>(db.from('ancaf_match_stats').select('*').in('match_id',ids));
const currentNominations = await data<any[]>(db.from('ancaf_referee_nominations').select('*').in('match_id',ids));
const configs = await data<any[]>(db.from('ancaf_configs').select('*').in('key',['override_calendar','override_nominations']));
const dbPlayers = await data<any[]>(db.from('ancaf_players').select('id,team_id,ma_id,name,full_name,position,jersey_number'));
const byIdentity = new Map(dbPlayers.filter(p=>p.ma_id).map(p=>[`${p.team_id}:${p.ma_id}`,p]));
const rolePosition = (value: string|null|undefined) => /guarda|goal|^gk$/i.test(value??'')?'GK':/def|lateral/i.test(value??'')?'DEF':/m[eé]dio|mid|trinco/i.test(value??'')?'MID':/avan|ponta|forward|fwd/i.test(value??'')?'FWD':null;
const KNOWN_OFFICIAL_BY_MA:Record<string,string>={'003977M84':'Sabino Garcez de Sousa de Carvalho'};
const personName = (p: any) => {
  if(KNOWN_OFFICIAL_BY_MA[p.maId]) return KNOWN_OFFICIAL_BY_MA[p.maId];
  const raw=(p.nameAsPrinted || p.sourceText.replace(/\s*\(\d{6}[MF]\d{2}\)\s*$/,'').trim());
  return raw.replace(/^(?:Árbitro|Árbitra|Ábitro)\s+(?:Assistente\s+)?(?:da\s+)?(?:(?:1ª|2ª)\s+Categoria\s+)?(?:Nacional|Internacional)\s+/i,'').trim();
};
const reportCoach = (m: any, side: 'home'|'away') => {
  const coach=m.staff[side].find((p:any)=>p.roleAsPrinted==='Head Coach');
  return coach ? personName(coach) : null;
};

const plan:any[]=[];
for(const m of BATCH.matches){
  const id=m.candidateMatchId;
  const old=currentMatches.find(x=>x.id===id); assert(old);
  assert.equal(old.season_id,'2026-27'); assert.equal(old.round,m.round);
  assert.equal(old.home_team_id,m.homeTeamId); assert.equal(old.away_team_id,m.awayTeamId);
  const officials=m.officials.map((p:any)=>personName(p));
  assert.equal(officials.length,5);
  const matchPatch:any={date:m.kickoff,status:'finished',schedule_status:'official',score:`${m.homeScore}-${m.awayScore}`,home_score:m.homeScore,away_score:m.awayScore,half_time_score:`${m.halfTimeHomeScore}-${m.halfTimeAwayScore}`,stadium:m.stadiumAsPrinted,referee:officials[0],assistant_referees:officials.slice(1,3),fourth_official:officials[3]};
  // Attendance 8 in report 11 is pending; missing attendance is not zero-filled.
  if(m.attendanceStatus==='recorded_in_source') matchPatch.attendance=m.attendance;
  const lineups=[];
  for(const side of ['home','away'] as const){
    const slots=m.lineups[side].map((p:any)=>{
      const player=byIdentity.get(`${m[side+'TeamId']}:${p.maId}`);
      assert(player,`Jogador ausente na BD: ${m[side+'TeamId']} ${p.maId} ${p.nameAsPrinted}`);
      assert.equal(player.id,p.playerId,`ID local divergente: ${p.maId}`);
      return {playerId:player.id,name:p.displayName,number:p.number??0,position:rolePosition(player.position),isStarter:p.isStarter,isCaptain:false};
    });
    assert.equal(slots.filter((p:any)=>p.isStarter).length,11);
    assert.equal(new Set(slots.map((p:any)=>p.playerId)).size,slots.length);
    const previous=currentLineups.find(x=>x.match_id===id&&x.team_id===m[side+'TeamId']);
    for(const slot of slots) slot.isCaptain=previous?.players?.find((p:any)=>p.playerId===slot.playerId)?.isCaptain===true;
    lineups.push({match_id:id,team_id:m[side+'TeamId'],side,players:slots,coach:reportCoach(m,side)??previous?.coach??null,confirmed_by:'Relatório de arbitragem oficial'});
  }
  const eventRows=m.events.filter((e:any)=>e.reviewStatus!=='pending_confirmation').map((e:any,sort:number)=>{
    const isOwn=e.type==='own_goal';
    const teamSide=isOwn?e.creditedTeamSide:e.teamSide;
    const scorer=e.playerDisplayName??e.player;
    const playerOut=e.playerOutDisplayName??e.playerOut??null;
    const added=e.addedTime?`+${e.addedTime}`:null;
    let detail=added?`${e.minute}+${e.addedTime}`:null;
    if(isOwn) detail=`Autogolo de ${scorer} (${m[e.playerTeamSide+'TeamName']})${added?` aos ${e.minute}+${e.addedTime}`:''}`;
    return {match_id:id,minute:e.minute,type:isOwn?'goal':e.type,team_side:teamSide,player:isOwn?`Autogolo — ${scorer}`:scorer,player_id:isOwn?null:e.playerId,assist:null,player_out:e.type==='sub'?playerOut:null,detail,sort};
  });
  const score={home:0,away:0};for(const e of eventRows)if(e.type==='goal')score[e.team_side as 'home'|'away']++;
  assert.deepEqual(score,{home:m.homeScore,away:m.awayScore},`Golos não conciliam ${id}`);
  const statRows=['home','away'].flatMap(side=>['yellowCards','redCards'].map(key=>({match_id:id,side,stat_key:key,value:eventRows.filter((e:any)=>e.team_side===side&&e.type===(key==='yellowCards'?'yellow':'red')).length,published:true})));
  plan.push({m,id,old,matchPatch,officials,lineups,eventRows,statRows,excludedEvents:m.events.filter((e:any)=>e.reviewStatus==='pending_confirmation')});
}
console.log(JSON.stringify(plan.map(p=>({id:p.id,report:p.m.reportNumber,score:p.matchPatch.score,lineups:p.lineups.reduce((n:number,x:any)=>n+x.players.length,0),events:p.eventRows.length,excludedPending:p.excludedEvents.length,attendance:Object.hasOwn(p.matchPatch,'attendance')?p.matchPatch.attendance:'preservar'})),null,2));
console.log(`Modo: ${APPLY?'GRAVAÇÃO':'simulação'}; jogos: ${plan.length}; eventos: ${plan.reduce((n,p)=>n+p.eventRows.length,0)}.`);
if(!APPLY) process.exit(0);

const stamp=new Date().toISOString();
const backup={createdAt:stamp,ids,ancaf_matches:currentMatches,liga_matches:currentLegacy,ancaf_match_lineups:currentLineups,ancaf_match_events:currentEvents,ancaf_match_stats:currentStats,ancaf_referee_nominations:currentNominations,ancaf_configs:configs};
const backupFile=new URL(`backup-antes-importacao-${stamp.replace(/[:.]/g,'-')}.json`,ROOT);
await writeFile(backupFile,JSON.stringify(backup,null,2),{mode:0o600});
console.log('Backup local criado.');
for(const p of plan){
  const matchPatch={...p.matchPatch,updated_at:stamp};
  await data(db.from('ancaf_matches').update(matchPatch).eq('id',p.id));
  if(currentLegacy.some(x=>x.id===p.id)){
    const {half_time_score,referee,assistant_referees,fourth_official,attendance,schedule_status,...legacy}=matchPatch;
    await data(db.from('liga_matches').update(legacy).eq('id',p.id));
  }
  // Insert first; remove only IDs captured in the backup after success.
  const inserted=await data<any[]>(db.from('ancaf_match_events').insert(p.eventRows.map((x:any)=>({...x,updated_at:stamp}))).select('id'));
  assert.equal(inserted.length,p.eventRows.length);
  const previousIds=currentEvents.filter(x=>x.match_id===p.id).map(x=>x.id);
  if(previousIds.length) await data(db.from('ancaf_match_events').delete().in('id',previousIds));
  await data(db.from('ancaf_match_lineups').upsert(p.lineups.map((x:any)=>({...x,confirmed_at:stamp,updated_at:stamp})),{onConflict:'match_id,team_id'}));
  const nomination={season_id:'2026-27',round:p.m.round,match_id:p.id,referee:p.officials[0],assistants:p.officials.slice(1,3),fourth_official:p.officials[3],published_at:stamp,updated_at:stamp};
  await data(db.from('ancaf_referee_nominations').upsert(nomination,{onConflict:'match_id'}));
  await data(db.from('ancaf_match_stats').upsert(p.statRows.map((x:any)=>({...x,updated_at:stamp})),{onConflict:'match_id,side,stat_key'}));
  console.log('Gravado',p.id);
}
// Keep the public/admin override mirrors aligned without replacing unrelated games.
for(const key of ['override_calendar','override_nominations']){
  const row=configs.find(x=>x.key===key);
  const value=typeof row?.value==='string'?JSON.parse(row.value):(row?.value??{});
  for(const p of plan){
    if(key==='override_calendar') value[p.id]={...value[p.id],date:p.matchPatch.date,status:'finished',scheduleStatus:'official',score:p.matchPatch.score,homeScore:p.m.homeScore,awayScore:p.m.awayScore,halfTimeScore:p.matchPatch.half_time_score,stadium:p.matchPatch.stadium,referee:p.officials[0],...(Object.hasOwn(p.matchPatch,'attendance')?{attendance:p.matchPatch.attendance}:{})};
    else value[p.id]={referee:p.officials[0],assistants:p.officials.slice(1,3),fourth:p.officials[3]};
  }
  await data(db.from('ancaf_configs').upsert({key,value:JSON.stringify(value)},{onConflict:'key'}));
}

// Recompute season-level player counters from every stored 2026/27 lineup/event.
const seasonMatches=await data<any[]>(db.from('ancaf_matches').select('id').eq('season_id','2026-27'));
const seasonIds=seasonMatches.map(x=>x.id);
const allLineups=await data<any[]>(db.from('ancaf_match_lineups').select('match_id,players').in('match_id',seasonIds));
const allEvents=await data<any[]>(db.from('ancaf_match_events').select('match_id,type,player_id').in('match_id',seasonIds));
const totals=new Map<string,{season_id:string,player_id:string,goals:number,assists:number,appearances:number,yellow_cards:number,red_cards:number,updated_at:string}>();
const counter=(id:string)=>{let x=totals.get(id);if(!x){x={season_id:'2026-27',player_id:id,goals:0,assists:0,appearances:0,yellow_cards:0,red_cards:0,updated_at:stamp};totals.set(id,x);}return x;};
for(const lineup of allLineups){for(const slot of lineup.players??[]){if(slot.playerId)counter(slot.playerId).appearances++;}}
for(const event of allEvents){if(!event.player_id)continue;const x=counter(event.player_id);if(event.type==='goal')x.goals++;if(event.type==='yellow')x.yellow_cards++;if(event.type==='red')x.red_cards++;}
if(totals.size) await data(db.from('ancaf_player_season_stats').upsert([...totals.values()],{onConflict:'season_id,player_id'}));

// Final read-after-write verification.
const verified:any[]=[];
for(const p of plan){
  const match=await data<any>(db.from('ancaf_matches').select('*').eq('id',p.id).single());
  const events=await data<any[]>(db.from('ancaf_match_events').select('*').eq('match_id',p.id));
  const lineups=await data<any[]>(db.from('ancaf_match_lineups').select('*').eq('match_id',p.id));
  const nomination=await data<any>(db.from('ancaf_referee_nominations').select('*').eq('match_id',p.id).single());
  assert.equal(match.score,p.matchPatch.score); assert.equal(match.half_time_score,p.matchPatch.half_time_score); assert.equal(match.status,'finished');
  assert.equal(events.length,p.eventRows.length); assert.equal(lineups.length,2); assert.equal(nomination.referee,p.officials[0]);
  for(const side of ['home','away']) assert.equal(lineups.find(x=>x.side===side).players.filter((x:any)=>x.isStarter).length,11);
  const goals={home:0,away:0};for(const e of events)if(e.type==='goal')goals[e.team_side as 'home'|'away']++;
  assert.deepEqual(goals,{home:p.m.homeScore,away:p.m.awayScore});
  verified.push({matchId:p.id,reportNumber:p.m.reportNumber,score:match.score,lineups:lineups.reduce((n,x)=>n+x.players.length,0),events:events.length,officials:5,pendingExcluded:p.excludedEvents.length});
}
const receipt={completedAt:stamp,source:'dados_para_insercao_COM_ALCUNHAS_REVISAR.json',backup:backupFile.pathname,distinctMatches:11,pdfFiles:12,verified,playerSeasonRowsRecomputed:totals.size,notes:['Ficha 8 duplicada inserida uma vez.','Assistência da ficha 11 não substituída: valor 8 pendente.','Substituição Afonso Baptista 90+2 não inserida: identidade da reentrada pendente.','Autogolos gravados como goal para a equipa beneficiada, player_id null e descrição explícita.','Notas integrais, comissário e staff completo permanecem no JSON de auditoria porque a BD do portal não possui campos específicos.']};
await writeFile(new URL('RECIBO_IMPORTACAO_BD.json',ROOT),JSON.stringify(receipt,null,2)+'\n');
console.log(`VERIFICADO: ${verified.length} jogos, ${verified.reduce((n,x)=>n+x.events,0)} eventos, ${verified.reduce((n,x)=>n+x.lineups,0)} entradas de convocados.`);
