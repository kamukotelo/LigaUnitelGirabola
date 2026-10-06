// Assistências a partir dos vídeos dos golos (YouTube).
//
//   npm run jogos -- assistencias exportar [--saida assistencias.csv]
//   npm run jogos -- assistencias importar assistencias.csv [--gravar]
//
// `exportar` gera uma folha (CSV separado por ponto e vírgula, abre no Excel)
// com cada golo da época ainda sem assistência: jogo, minuto, marcador, uma
// pesquisa no YouTube e os colegas que estavam em campo. Quem vê os vídeos
// preenche a coluna `assistencia` (nome do jogador, ou "sem" quando o golo não
// teve assistência) e, se quiser, o link do vídeo.
//
// `importar` lê a folha preenchida e confere cada linha: o golo tem de existir
// com o mesmo minuto e marcador, e o assistente tem de ser da mesma equipa.
// Sem `--gravar` só mostra o que mudaria; com `--gravar` escreve `assist` nos
// registos em src/data/jogos/<época>/<id>.ts. Depois: `npm run jogos -- publicar`.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT, SEASON_DIR, SEASON_ID, loadData, loadRecords } from './lib.mts';

const NO_ASSIST = new Set(['sem', 'sem assistencia', 'nenhuma', 'nao', '-', '—']);
const COLUMNS = [
  'golo_id', 'jornada', 'data', 'jogo', 'resultado', 'minuto', 'equipa', 'marcador', 'detalhe',
  'pesquisa_youtube', 'video', 'assistencia', 'jogadores_em_campo',
] as const;

const fold = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

type GoalRow = Record<(typeof COLUMNS)[number], string>;
type Player = { id: string; name: string; fullName?: string; nickname?: string; teamId: string };

/** Golos da época com o seu identificador estável `<jogo>:g<n.º do golo no jogo>`. */
async function seasonGoals() {
  const [records, d] = await Promise.all([loadRecords(), loadData()]);
  const players: Player[] = d.getPlayers();
  const goals = [];
  for (const record of records) {
    if (record.result?.status !== 'finished') continue;
    const teamName = (side: 'home' | 'away') => d.getTeamById(side === 'home' ? record.homeTeamId : record.awayTeamId)?.name ?? side;
    let n = 0;
    for (const event of record.events ?? []) {
      if (event.type !== 'goal') continue;
      n += 1;
      const teamId = event.team === 'home' ? record.homeTeamId : record.awayTeamId;
      // Quem pode ter assistido: os colegas da escalação do jogo (titulares e
      // quem entrou) ou, sem escalação publicada, o plantel da equipa.
      const lineup = record.lineups?.[event.team] ?? [];
      const cameOn = new Set((record.events ?? []).filter((e) => e.type === 'sub' && e.team === event.team).map((e) => fold(e.player)));
      const onPitch = lineup.filter((slot) => slot.isStarter || cameOn.has(fold(slot.name)));
      const candidates = (onPitch.length ? onPitch.map((slot) => slot.name) : players.filter((p) => p.teamId === teamId).map((p) => p.name))
        .filter((name) => fold(name) !== fold(event.player));
      goals.push({ record, event, n, teamId, teamName: teamName(event.team), home: teamName('home'), away: teamName('away'), candidates });
    }
  }
  return { goals, players };
}

function csvCell(value: string): string {
  return /[;"\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const input = text.replace(/^﻿/, '');
  const separator = (input.split('\n')[0].match(/;/g)?.length ?? 0) >= (input.split('\n')[0].match(/,/g)?.length ?? 0) ? ';' : ',';
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') { cell += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === separator) { row.push(cell); cell = ''; }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[i + 1] === '\n') i += 1;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((value) => value.trim()));
}

export async function exportAssists(output = 'assistencias.csv') {
  const { goals } = await seasonGoals();
  const rows: GoalRow[] = goals
    .filter(({ event }) => !event.ownGoal && !event.assist)
    .map(({ record, event, n, teamName, home, away, candidates }) => ({
      golo_id: `${record.id}:g${n}`,
      jornada: String(record.round),
      data: record.schedule.date.slice(0, 10).split('-').reverse().join('/'),
      jogo: `${home} × ${away}`,
      resultado: `${record.result!.homeScore}-${record.result!.awayScore}`,
      minuto: event.minute === undefined ? '' : String(event.minute),
      equipa: teamName,
      marcador: event.player,
      detalhe: event.detail ?? '',
      pesquisa_youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${home} ${away} Girabola 2026 golos`)}`,
      video: '',
      assistencia: /penalidade|pen[aá]lti/i.test(event.detail ?? '') ? 'sem' : '',
      jogadores_em_campo: candidates.join(', '),
    }));
  const content = '﻿' + [COLUMNS.join(';'), ...rows.map((row) => COLUMNS.map((column) => csvCell(row[column])).join(';'))].join('\n') + '\n';
  const file = path.resolve(process.cwd(), output);
  writeFileSync(file, content);
  console.log(`✓ ${rows.length} golos sem assistência em ${path.relative(process.cwd(), file) || file}`);
  console.log('  Preencher a coluna "assistencia" (nome do jogador ou "sem") e, se possível, "video".');
}

export async function importAssists(input: string, write: boolean) {
  if (!input) throw new Error('Indica a folha, ex.: `npm run jogos -- assistencias importar assistencias.csv --gravar`.');
  const [header, ...lines] = parseCsv(readFileSync(path.resolve(process.cwd(), input), 'utf8'));
  const col = (name: string) => header.findIndex((value) => fold(value) === name);
  const [idCol, assistCol, minuteCol, scorerCol] = ['golo_id', 'assistencia', 'minuto', 'marcador'].map(col);
  if (idCol < 0 || assistCol < 0) throw new Error('A folha tem de ter as colunas "golo_id" e "assistencia" (use a folha gerada por `exportar`).');

  const { goals, players } = await seasonGoals();
  const byId = new Map(goals.map((goal) => [`${goal.record.id}:g${goal.n}`, goal]));
  const changes = new Map<string, { n: number; assist: string; label: string }[]>();
  const problems: string[] = [];
  let skipped = 0;

  for (const line of lines) {
    const id = line[idCol]?.trim();
    const wanted = line[assistCol]?.trim() ?? '';
    if (!id || !wanted) { skipped += 1; continue; }
    const goal = byId.get(id);
    if (!goal) { problems.push(`${id}: golo não encontrado.`); continue; }
    const { event, teamId, candidates } = goal;
    if (minuteCol >= 0 && line[minuteCol]?.trim() && Number(line[minuteCol]) !== event.minute) {
      problems.push(`${id}: o minuto da folha (${line[minuteCol]}) não bate com o registo (${event.minute}). Gere a folha de novo.`);
      continue;
    }
    if (scorerCol >= 0 && line[scorerCol]?.trim() && fold(line[scorerCol]) !== fold(event.player)) {
      problems.push(`${id}: o marcador da folha (${line[scorerCol]}) não bate com o registo (${event.player}). Gere a folha de novo.`);
      continue;
    }
    if (NO_ASSIST.has(fold(wanted))) { skipped += 1; continue; }
    if (event.ownGoal) { problems.push(`${id}: autogolo não tem assistência.`); continue; }
    // O nome tem de ser de um jogador da mesma equipa; grava-se o nome usado no
    // portal, que é o que o ranking de assistências procura.
    const target = fold(wanted);
    const matches = players.filter((p) => p.teamId === teamId
      && [p.name, p.fullName, p.nickname].some((name) => name && fold(name) === target));
    if (matches.length !== 1) {
      problems.push(`${id}: "${wanted}" ${matches.length ? 'corresponde a mais de um jogador' : 'não é jogador desta equipa'}. Em campo: ${candidates.join(', ') || '—'}.`);
      continue;
    }
    if (fold(matches[0].name) === fold(event.player)) { problems.push(`${id}: o assistente é o próprio marcador.`); continue; }
    const list = changes.get(goal.record.id) ?? [];
    list.push({ n: goal.n, assist: matches[0].name, label: `${id} · ${event.minute ?? '?'}' ${event.player} ← ${matches[0].name}` });
    changes.set(goal.record.id, list);
  }

  const total = [...changes.values()].reduce((sum, list) => sum + list.length, 0);
  console.log(`\nAssistências a gravar: ${total} · linhas sem assistência ou em branco: ${skipped}`);
  for (const list of changes.values()) for (const change of list) console.log(`  ✓ ${change.label}`);
  if (problems.length) {
    console.log(`\nLinhas recusadas (${problems.length}) — corrija na folha e importe de novo:`);
    for (const problem of problems) console.log(`  ✗ ${problem}`);
  }
  if (!write) {
    if (total) console.log('\nNada foi gravado. Repita com --gravar para escrever nos registos.');
    return;
  }

  for (const [matchId, list] of changes) {
    const file = path.join(SEASON_DIR, `${matchId}.ts`);
    const lines = readFileSync(file, 'utf8').split('\n');
    let n = 0;
    for (let i = 0; i < lines.length; i += 1) {
      if (!/type: 'goal'/.test(lines[i])) continue;
      n += 1;
      const change = list.find((item) => item.n === n);
      if (!change) continue;
      const quoted = `'${change.assist.replace(/'/g, "\\'")}'`;
      // `assist` fica logo a seguir ao marcador (player, number, playerId).
      lines[i] = /assist: /.test(lines[i])
        ? lines[i].replace(/assist: '(?:[^'\\]|\\.)*'/, `assist: ${quoted}`)
        : lines[i].replace(/player: '(?:[^'\\]|\\.)*'(?:, (?:number: \d+|playerId: '[^']*'))*/, (match) => `${match}, assist: ${quoted}`);
    }
    writeFileSync(file, lines.join('\n'));
  }
  console.log(`\n✓ ${total} assistências gravadas em ${path.relative(ROOT, SEASON_DIR)}/ (${SEASON_ID}). A seguir: npm run jogos -- publicar`);
}
