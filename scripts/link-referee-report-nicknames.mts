/** Enrich the reviewed staging export; never writes to the portal or database.
 * Run: node --import tsx scripts/link-referee-report-nicknames.mts
 */
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { PLAYERS } from '../src/lib/data';
import { OFFICIAL_SQUADS_2026_27 } from '../src/lib/official-squads-2026-27';

const root = new URL('../outputs/relatorios-arbitros-2026-09-03/', import.meta.url);
const input = new URL('dados_para_insercao_REVISAR.json', root);
const originalText = await readFile(input, 'utf8');
const original = JSON.parse(originalText);
const result = structuredClone(original);
const hash = (text: string) => createHash('sha256').update(text).digest('hex');
const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const sourceFiles = await Promise.all(['src/lib/data.ts', 'src/lib/official-squads-2026-27.ts'].map(async path => ({
  path, sha256: hash(await readFile(new URL('../' + path, import.meta.url), 'utf8')),
})));

// Names supplied by the user for the actual Wiliete–Lobito match (report 8).
// Bind by club + match + shirt, check against MA, then reuse only by club + MA.
// Do not turn these shirt numbers into global keys across clubs or seasons.
const userAliases: Record<string, Record<number, string>> = {
  wiliete: {1:'Nayan',17:'Giovani',4:'Guilherme',5:'Wiwi',7:'Karanga',8:'Mule',10:'Mindinho',32:'Célio Zua',11:'Gibelé',35:'Valter Monteiro',9:'Mabululu',12:'Benny',18:'Bello',19:'Artur Kaká',21:'Filó',24:'Igui',26:'Nelo',30:'Sidibé',33:'Quare'},
  lobito: {12:'Guilherme',3:'Nanga',4:'Rosário',26:'Jorge',22:'Leonel',5:'Lourenço',6:'Manuel',7:'Januário',16:'Joaquim',10:'Ezequiel',19:'António',40:'Marcos',38:'Leonel',36:'Fernando',29:'Valério',24:'Miguel',15:'Serafim',11:'Florentino',21:'Geraldo',2:'Joel'},
};
const aliasByIdentity = new Map<string, {alias: string; source: string; reportNumber: number; shirt: number}>();
const reference = original.matches.find((m: any) => m.reportNumber === 8);
assert(reference);
for (const side of ['home', 'away']) {
  const teamId = reference[side + 'TeamId'];
  for (const [shirt, alias] of Object.entries(userAliases[teamId])) {
    const roster = reference.lineups[side].filter((p: any) => p.number === Number(shirt));
    assert.equal(roster.length, 1, `Ambiguous user alias shirt ${teamId} ${shirt}`);
    const p = roster[0];
    const portal = PLAYERS.filter(x => x.teamId === teamId && x.jerseyNumber === Number(shirt) && x.maId === p.maId);
    assert.equal(portal.length, 1, `User alias identity not confirmed ${teamId} ${shirt}`);
    aliasByIdentity.set(`${teamId}:${p.maId}`, {alias, source:'user_supplied_Wiliete_Lobito_lineup_in_this_conversation', reportNumber:8, shirt:Number(shirt)});
  }
}

type Link = {
  reportNumber: number; teamId: string; teamName: string; shirt: number | null;
  officialName: string; maId: string; playerId: string | null;
  displayName: string; nickname: string | null; portalDisplayName: string | null;
  registeredNickname: string | null;
  method: string; status: string; displayNameSource: string;
  aliasEvidence: unknown; candidates: unknown[]; warnings: string[];
};
const rows: Link[] = [];
const counts: Record<string, number> = {};
for (const m of result.matches) {
  for (const side of ['home', 'away']) {
    const teamId = m[side + 'TeamId'];
    const team = PLAYERS.filter(p => p.teamId === teamId);
    for (const p of m.lineups[side]) {
      const byShirt = team.filter(x => p.number !== null && p.number > 0 && x.jerseyNumber === p.number);
      const byMA = team.filter(x => p.maId && x.maId === p.maId);
      const guarded = byShirt.filter(x => x.maId === p.maId);
      let player: typeof PLAYERS[number] | undefined;
      let method = 'unresolved';
      let status = 'pending_confirmation';
      const warnings: string[] = [];
      if (guarded.length === 1) {
        player = guarded[0]; method = 'club_shirt_confirmed_by_ma'; status = 'linked';
        if (byShirt.length > 1) warnings.push('Camisola com vários candidatos; licença MA usada para desambiguar.');
      } else if (byMA.length === 1 && p.number === null) {
        player = byMA[0]; method = 'club_ma_no_shirt_in_report'; status = 'linked';
        warnings.push('A ficha não indica camisola. Ligação pela licença MA; número não preenchido.');
      } else if (byMA.length === 1) {
        // Retain a candidate without silently accepting a conflicting shirt.
        method = 'shirt_conflicts_with_ma';
        warnings.push('Camisola e licença não confirmam a mesma correspondência; revisão obrigatória.');
      }
      const registrations = OFFICIAL_SQUADS_2026_27.filter(s => s.teamId === teamId).flatMap(s => s.players).filter(x => x.maId === p.maId);
      const popularName = registrations.length === 1 ? registrations[0].popularName.trim() : '';
      const userAlias = aliasByIdentity.get(`${teamId}:${p.maId}`);
      let nickname: string | null = player ? (userAlias?.alias || popularName || null) : null;
      let displayName = player ? (nickname || player.name) : p.name;
      let displayNameSource = player ? (userAlias ? 'user_match_lineup' : popularName ? 'official_registration_popularName' : 'portal_local_display_name') : 'original_report';
      let aliasEvidence: unknown = userAlias ?? (popularName ? {popularName, source:'src/lib/official-squads-2026-27.ts'} : null);
      // The user's list says Bito #28, but their substitution/card notes say
      // Camilo and the report/registration identify Camilo Mbule Ngongue.
      if (teamId === 'wiliete' && p.maId === '000417M01') {
        nickname = null;
        displayName = player?.name || p.name;
        displayNameSource = player ? 'portal_local_display_name' : 'original_report';
        aliasEvidence = {candidates:['Bito','Camilo'], source:'user_lineup_vs_user_events_in_this_conversation', status:'pending_confirmation'};
        warnings.push('Alcunha do Wiliete #28 pendente: convocatória enviada diz Bito; ocorrências enviadas dizem Camilo. Identidade Camilo Mbule Ngongue confirmada; mantido o nome de exibição local.');
      }
      if (userAlias && popularName && norm(userAlias.alias) !== norm(popularName)) {
        warnings.push(`Nome da convocatória do utilizador (${userAlias.alias}) difere do nome popular da inscrição (${popularName}); ambas as fontes preservadas.`);
        aliasEvidence = {userAlias, officialPopularName:popularName};
      }
      const link: Link = {reportNumber:m.reportNumber,teamId,teamName:m[side+'TeamName'],shirt:p.number,officialName:p.name,maId:p.maId,playerId:player?.id ?? null,displayName,nickname,registeredNickname:player ? popularName || null : null,portalDisplayName:player?.name ?? null,method,status,displayNameSource,aliasEvidence,candidates:status==='linked'?[]:[...new Set([...byShirt,...byMA])].map(x=>({id:x.id,name:x.name,maId:x.maId,shirt:x.jerseyNumber})),warnings};
      p.nameAsPrinted = p.name;
      p.displayName = displayName;
      p.nickname = nickname;
      p.registeredNickname = link.registeredNickname;
      p.playerId = link.playerId;
      p.nameLink = link;
      rows.push(link);
      counts[method] = (counts[method] ?? 0) + 1;
    }
    const byMA = new Map(m.lineups[side].map((p: any) => [p.maId, p]));
    for (const e of m.events.filter((e: any) => e.teamSide === side)) {
      const player = byMA.get(e.playerMaId) as any;
      assert(player, 'Event must link to its own team roster');
      e.playerNameAsPrinted = e.player;
      e.playerDisplayName = player.displayName;
      e.playerNickname = player.nickname;
      e.playerId = player.playerId;
      e.playerNameLinkStatus = player.nameLink.status;
      if (e.type === 'sub') {
        const outgoing = byMA.get(e.playerOutMaId) as any;
        assert(outgoing);
        e.playerOutNameAsPrinted = e.playerOut;
        e.playerOutDisplayName = outgoing.displayName;
        e.playerOutNickname = outgoing.nickname;
        e.playerOutId = outgoing.playerId;
      }
    }
  }
}

// Entity links and original facts must remain stable across this enrichment.
assert.equal(rows.length, original.summary.rosterEntries);
const unique = new Map<string, Link>();
for (const row of rows) {
  const key = `${row.teamId}:${row.maId}`;
  if (unique.has(key)) {
    const prev = unique.get(key)!;
    assert.equal(prev.playerId,row.playerId);
    assert.equal(prev.displayName,row.displayName);
  } else unique.set(key,row);
}
const playerIds = [...unique.values()].filter(x=>x.playerId).map(x=>`${x.teamId}:${x.playerId}`);
assert.equal(playerIds.length, new Set(playerIds).size, 'No two MA identities may collapse to one portal player');
for (const m of result.matches) {
  const before = original.matches.find((x: any)=>x.reportNumber===m.reportNumber);
  assert.equal(m.events.length,before.events.length);
  for (const side of ['home','away']) {
    assert.equal(m[side+'Score'],before[side+'Score']);
    for (let i=0;i<m.lineups[side].length;i++) for (const field of Object.keys(before.lineups[side][i])) {
      assert.deepEqual(m.lineups[side][i][field],before.lineups[side][i][field]);
    }
  }
  for (let i=0;i<m.events.length;i++) for (const field of Object.keys(before.events[i])) assert.deepEqual(m.events[i][field],before.events[i][field]);
}
const summary = {rosterEntries:rows.length,uniqueClubPlayerIdentities:unique.size,matchingMethods:counts,unresolvedIdentities:rows.filter(x=>x.status!=='linked').length,nicknameEntries:rows.filter(x=>x.nickname).length,portalDisplayNameOnlyEntries:rows.filter(x=>x.displayNameSource==='portal_local_display_name').length};
result.nameLinking = {
  scope:'Local staging only. No production database consulted or modified.',
  input:{file:input.pathname,sha256:hash(originalText)},sources:sourceFiles,
  rules:['Clube + camisola da ficha, confirmado pela licença MA.','Se a camisola não consta, só ligar por clube + licença MA única; manter camisola null.','Alcunhas enviadas pelo utilizador para a ficha 8 ligadas nesse jogo e propagadas apenas por clube + MA.','Nome curto no portal não prova uma alcunha; nickname fica null quando só existe nome de exibição.','Nomes e ocorrências originais permanecem intactos. Para apresentação usar displayName/playerDisplayName/playerOutDisplayName.','Distinguir ligação de identidade de aprovação da ocorrência: a reentrada de Afonso continua pendente.'],summary,
};
result.schemaVersion = 'referee-report-staging/1.1';
result.purpose = 'Levantamento enriquecido com nomes de exibição/alcunhas e ligações a jogadores locais; revisão e conversão ainda necessárias antes de importar.';
await writeFile(new URL('dados_para_insercao_COM_ALCUNHAS_REVISAR.json',root),JSON.stringify(result,null,2)+'\n');
await writeFile(new URL('correspondencias_nomes_alcunhas.json',root),JSON.stringify({summary,sources:result.nameLinking,rows},null,2)+'\n');

const lines = ['# Nomes oficiais, alcunhas e camisolas','',
  'Dados ligados no ficheiro de preparação; não publicados na base de dados. O âmbito é a época 2026/2027 e os 11 jogos levantados.', '',
  'O número só é usado dentro do clube, com confirmação pela licença MA. Nos dois registos sem camisola, a ligação foi feita pela licença; o número permanece vazio.', '',
  'Alcunha confirmada na inscrição ou fornecida pelo utilizador fica em `nickname`. Quando só existe um nome de exibição local, esse nome é mantido em `displayName`, sem o apresentar como alcunha oficial.', '',
  `Ligados ${rows.filter(x=>x.status==='linked').length}/${rows.length} registos; ${unique.size} identidades distintas por clube.`, '',
  '## Atenção','',
  '- Wiliete #28: Bito na convocatória enviada, mas Camilo nas ocorrências. A identidade é Camilo Mbule Ngongue; a alcunha fica pendente.',
  '- Ligar Afonso Baptista à sua ficha não valida a reentrada aos 90+2: essa ocorrência continua pendente.',
  '- Quando a inscrição contém outra alcunha (por exemplo Joaquim / CHICO PAPEL), ambas ficam disponíveis; não são tratadas como jogadores diferentes.',
  '- Mantidas todas as pendências anteriores, autogolos, resultados, números e nomes originais.',
  '- O ficheiro enriquecido continua a exigir conversão para o formato suportado pelo importador do portal.', '',
  '## Correspondências','',
  '| Clube | Camisola na ficha | Nome oficial | Alcunha / nome de exibição | Origem | Fichas |',
  '|---|---|---|---|---|---|'];
for (const row of [...unique.values()].sort((a,b)=>a.teamName.localeCompare(b.teamName,'pt') || (a.shirt??999)-(b.shirt??999))) {
  const occurrences=rows.filter(x=>x.teamId===row.teamId&&x.maId===row.maId);
  const shirts=[...new Set(occurrences.map(x=>x.shirt??'não indicada'))].join(', ');
  const refs=occurrences.map(x=>x.reportNumber).join(', ');
  const origin={user_match_lineup:'Convocatória do utilizador',official_registration_popularName:'Nome popular da inscrição',portal_local_display_name:'Nome de exibição local',original_report:'Sem ligação'}[row.displayNameSource];
  const shownName = row.registeredNickname && norm(row.registeredNickname) !== norm(row.displayName)
    ? `${row.displayName} / ${row.registeredNickname} (inscrição)` : row.displayName;
  lines.push(`| ${row.teamName} | ${shirts} | ${row.officialName} | ${shownName} | ${origin} | ${refs} |`);
}
lines.push('', '## Fontes e verificação','',
  '- Fichas: nomes e números de `dados_para_insercao_REVISAR.json`; caminhos dos PDFs e páginas preservados no novo JSON.',
  '- Identidades/nomes locais: `src/lib/data.ts` e `src/lib/official-squads-2026-27.ts`, com resumos SHA-256 no JSON. Não foi consultada a BD em produção.',
  '- Alcunhas do Wiliete e Académica: convocatória fornecida pelo utilizador nesta conversa, ligada à ficha 8 por clube/camisola/licença.',
  '- Reproduzir: `node --import tsx scripts/link-referee-report-nicknames.mts`.',
  '- Verificações: cardinalidade inalterada; identidade única; nome uniforme entre jogos; nenhuma fusão de jogadores diferentes; eventos/resultados originais intactos. Caderno de verificação: `verificar_ligacoes.ipynb`.', '');
await writeFile(new URL('NOMES_E_ALCUNHAS.md',root),lines.join('\n'));

// Small inspectable notebook: no pandas/runtime-specific dependency required.
const notebook = {nbformat:4,nbformat_minor:5,metadata:{kernelspec:{display_name:'Python 3',language:'python',name:'python3'}},cells:[
  {cell_type:'markdown',metadata:{},id:'scope',source:['# Verificação das ligações de nomes\n','Executar nesta pasta. Não escreve na BD. A fonte original e o ficheiro enriquecido são comparados sem alterar resultados ou identidades.']},
  {cell_type:'code',metadata:{},id:'validation',execution_count:null,outputs:[],source:[
    'import json\n','from pathlib import Path\n',
    'base = json.loads(Path("dados_para_insercao_REVISAR.json").read_text())\n',
    'linked = json.loads(Path("dados_para_insercao_COM_ALCUNHAS_REVISAR.json").read_text())\n',
    'rows = json.loads(Path("correspondencias_nomes_alcunhas.json").read_text())["rows"]\n',
    'assert len(rows) == base["summary"]["rosterEntries"]\n',
    'assert len({(r["reportNumber"], r["teamId"], r["maId"]) for r in rows}) == len(rows)\n',
    'for old, new in zip(base["matches"], linked["matches"]):\n',
    '    assert old["reportNumber"] == new["reportNumber"]\n',
    '    assert len(old["events"]) == len(new["events"])\n',
    '    for old_event, new_event in zip(old["events"], new["events"]):\n',
    '        assert all(new_event[k] == v for k, v in old_event.items())\n',
    '    for side in ("home", "away"):\n',
    '        assert old[side+"Score"] == new[side+"Score"]\n',
    '        assert len(old["lineups"][side]) == len(new["lineups"][side])\n',
    '        for old_player, new_player in zip(old["lineups"][side], new["lineups"][side]):\n',
    '            assert all(new_player[k] == v for k, v in old_player.items())\n',
    'print(linked["nameLinking"]["summary"])\n',
  ]},
]};
await writeFile(new URL('verificar_ligacoes.ipynb',root),JSON.stringify(notebook,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
