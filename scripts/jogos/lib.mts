// Ferramentas partilhadas pelo comando `npm run jogos` e pelo teste dos registos
// de jogo (scripts/test-match-records.mts). Ver src/data/jogos/LEIA-ME.md.
import { spawnSync, type SpawnSyncOptions } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { MatchRecord, SeasonDerivedStats } from '../../src/data/jogos/tipos';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const SEASON_ID = '2026-27';
export const SEASON_DIR = path.join(ROOT, 'src/data/jogos', SEASON_ID);
export const INDEX_FILE = path.join(SEASON_DIR, 'index.ts');
export const DERIVED_FILE = path.join(SEASON_DIR, 'derivados.ts');
const RECORD_FILE = /^m27-(\d+)-(\d+)\.ts$/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Module = any;
const importFromRoot = (file: string): Promise<Module> => import(pathToFileURL(path.join(ROOT, file)).href);

/** Camada de dados do portal, carregada uma vez por processo. */
export const loadData = (): Promise<Module> => importFromRoot('src/lib/data.ts');

export async function loadRecords(): Promise<readonly MatchRecord[]> {
  return (await importFromRoot(`src/data/jogos/${SEASON_ID}/index.ts`)).MATCH_RECORDS_2026_27;
}

// ── Ficheiros gerados ─────────────────────────────────────────────────────

export function listRecordIds(): string[] {
  return readdirSync(SEASON_DIR)
    .map((file) => RECORD_FILE.exec(file))
    .filter((match): match is RegExpExecArray => match !== null)
    .sort((a, b) => Number(a[1]) - Number(b[1]) || Number(a[2]) - Number(b[2]))
    .map((match) => match[0].slice(0, -'.ts'.length));
}

export function renderIndex(ids: string[]): string {
  const name = (id: string) => id.replaceAll('-', '_');
  return [
    '// Gerado por `npm run jogos -- sincronizar` a partir dos ficheiros desta pasta. Não editar à mão.',
    "import type { MatchRecord } from '../tipos';",
    ...ids.map((id) => `import ${name(id)} from './${id}';`),
    '',
    'export const MATCH_RECORDS_2026_27: readonly MatchRecord[] = [',
    ...ids.map((id) => `  ${name(id)},`),
    '];',
    '',
  ].join('\n');
}

const quote = (value: string) => (value.includes("'") && !value.includes('"')
  ? `"${value}"`
  : `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`);

export function renderDerived(stats: SeasonDerivedStats): string {
  return [
    '// Gerado por `npm run jogos -- sincronizar` a partir dos registos de jogo. Não editar à mão.',
    '// Marcadores, cartões e autogolos calculados por computeSeasonDerivedStats (src/lib/data.ts).',
    "import type { SeasonDerivedStats } from '../tipos';",
    '',
    'export const SEASON_DERIVED_STATS_2026_27: SeasonDerivedStats = {',
    '  scorers: [',
    ...stats.scorers.map((s) => `    { id: ${quote(s.id)}, name: ${quote(s.name)}, club: ${quote(s.club)}, teamId: ${quote(s.teamId)}, position: ${quote(s.position)}, goals: ${s.goals}, appearances: ${s.appearances} },`),
    '  ],',
    '  cards: {',
    ...Object.entries(stats.cards).map(([id, card]) => `    ${quote(id)}: { yellow: ${card.yellow}, red: ${card.red} },`),
    '  },',
    `  ownGoals: ${stats.ownGoals},`,
    '};',
    '',
  ].join('\n');
}

/** Grava só quando o conteúdo muda; devolve true se o ficheiro foi alterado. */
export function writeIfChanged(file: string, content: string): boolean {
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return false;
  writeFileSync(file, content);
  return true;
}

// ── Processos ─────────────────────────────────────────────────────────────

export function run(command: string, args: string[], options: SpawnSyncOptions & { quiet?: boolean } = {}): string {
  const result = spawnSync(command, args, { cwd: ROOT, encoding: 'utf8', stdio: options.quiet ? 'pipe' : ['inherit', 'pipe', 'inherit'], ...options });
  const stdout = String(result.stdout ?? '');
  if (!options.quiet && stdout) process.stdout.write(stdout);
  if (result.status !== 0) {
    if (options.quiet) process.stderr.write(stdout + String(result.stderr ?? ''));
    throw new Error(`${command} ${args.join(' ')} terminou com o código ${result.status}.`);
  }
  return stdout;
}

export const runTsx = (args: string[], options: SpawnSyncOptions & { quiet?: boolean } = {}) => run('npx', ['tsx', ...args], options);

export const git = (args: string[]) => run('git', args, { quiet: true }).trim();

// ── Validação ─────────────────────────────────────────────────────────────

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const SCORE = /^(\d+)-(\d+)$/;

export interface ValidationReport {
  errors: string[];
  warnings: string[];
}

/**
 * Regras que um registo de jogo tem de cumprir. Erros bloqueiam a publicação
 * e o build; avisos assinalam dados incompletos que não impedem publicar.
 */
export async function validateRecords(): Promise<ValidationReport> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const d = await loadData();
  const { PUBLISHED_MATCHES_2026_27 } = await importFromRoot('src/lib/published-ancaf-calendar.ts');

  const ids = listRecordIds();
  const indexInSync = readFileSync(INDEX_FILE, 'utf8') === renderIndex(ids);
  if (!indexInSync) errors.push('O índice (src/data/jogos/2026-27/index.ts) não corresponde aos ficheiros da pasta. Corre `npm run jogos -- sincronizar`.');

  const records = await loadRecords();
  if (indexInSync) {
    records.forEach((record, position) => {
      if (record.id !== ids[position]) errors.push(`${ids[position]}.ts: declara o id "${record.id}".`);
    });
  }

  // Confrontos: os registos são exatamente os jogos do sorteio oficial ANCAF.
  const draw = new Map<string, { round: number; homeTeamId: string; awayTeamId: string }>(
    PUBLISHED_MATCHES_2026_27.map((match: MatchRecord) => [match.id, match]),
  );
  if (records.length !== draw.size) errors.push(`São esperados ${draw.size} jogos no sorteio; há ${records.length} registos.`);
  const teamsByRound = new Map<string, string>();
  for (const record of records) {
    const fixture = draw.get(record.id);
    if (!fixture) errors.push(`${record.id}: não existe no sorteio oficial.`);
    else if (fixture.round !== record.round || fixture.homeTeamId !== record.homeTeamId || fixture.awayTeamId !== record.awayTeamId) {
      errors.push(`${record.id}: jornada ou equipas diferentes do sorteio (${fixture.round}.ª jornada, ${fixture.homeTeamId}–${fixture.awayTeamId}).`);
    }
    for (const teamId of [record.homeTeamId, record.awayTeamId]) {
      const key = `${record.round}:${teamId}`;
      if (teamsByRound.has(key)) errors.push(`${record.id}: ${teamId} já joga na ${record.round}.ª jornada (${teamsByRound.get(key)}).`);
      teamsByRound.set(key, record.id);
    }
  }

  const unknownPlayerIds = new Set<string>();
  const knownPlayer = (id: string | undefined) => {
    if (id && !d.getPlayerById(id)) unknownPlayerIds.add(id);
  };

  for (const record of records) {
    const at = record.id;
    const { schedule, result, events = [], lineups, stats, officials } = record;

    if (!ISO_DATE.test(schedule.date) || Number.isNaN(Date.parse(schedule.date))) errors.push(`${at}: data inválida "${schedule.date}" (usar 2026-09-20T17:15:00+01:00).`);
    if (!schedule.stadium?.trim()) errors.push(`${at}: falta o estádio.`);
    if (schedule.scheduleStatus !== 'official' && schedule.scheduleStatus !== 'provisional') errors.push(`${at}: scheduleStatus tem de ser 'official' ou 'provisional'.`);
    if (schedule.broadcaster !== undefined) {
      if (!schedule.broadcaster.trim()) errors.push(`${at}: broadcaster vazio — remove o campo para anunciar a Rádio 5.`);
      else if (/r[áa]dio/i.test(schedule.broadcaster)) errors.push(`${at}: broadcaster "${schedule.broadcaster}" — a Rádio 5 é a transmissão por omissão; remove o campo (senão aparece "Em direto · Rádio 5").`);
    }

    if (!result) {
      if (events.length || lineups || stats) errors.push(`${at}: tem eventos, escalações ou estatísticas mas não tem resultado.`);
    } else {
      for (const side of ['homeScore', 'awayScore'] as const) {
        if (!Number.isInteger(result[side]) || result[side] < 0) errors.push(`${at}: ${side} tem de ser um inteiro ≥ 0.`);
      }
      if (result.halfTimeScore !== undefined) {
        const half = SCORE.exec(result.halfTimeScore);
        if (!half) errors.push(`${at}: halfTimeScore "${result.halfTimeScore}" tem de ser "h-a".`);
        else if (Number(half[1]) > result.homeScore || Number(half[2]) > result.awayScore) errors.push(`${at}: o resultado ao intervalo (${result.halfTimeScore}) excede o final.`);
      }
      if (!ISO_DATE.test(result.updatedAt ?? '')) errors.push(`${at}: result.updatedAt em falta ou inválido.`);
      if (result.status === 'finished' && Date.parse(schedule.date) > Date.now()) warnings.push(`${at}: terminado mas com data futura (${schedule.date}).`);

      if (result.status === 'finished') {
        const goals = { home: 0, away: 0 };
        for (const event of events) if (event.type === 'goal') goals[event.team] += 1;
        if (events.length && (goals.home !== result.homeScore || goals.away !== result.awayScore)) {
          errors.push(`${at}: os golos dos eventos (${goals.home}-${goals.away}) não batem com o resultado (${result.homeScore}-${result.awayScore}).`);
        }
        if (!events.length && result.homeScore + result.awayScore > 0) warnings.push(`${at}: terminado sem eventos — os golos ficam sem marcador.`);
        if (!officials?.referee) warnings.push(`${at}: terminado sem árbitro no registo.`);
      }
    }

    for (const event of events) {
      if (!['goal', 'yellow', 'red', 'warning', 'sub'].includes(event.type)) errors.push(`${at}: tipo de evento desconhecido "${event.type}".`);
      if (event.team !== 'home' && event.team !== 'away') errors.push(`${at}: evento com team "${event.team}" (usar 'home' ou 'away').`);
      if (event.minute !== undefined && (!Number.isInteger(event.minute) || event.minute < 0 || event.minute > 130)) errors.push(`${at}: minuto inválido ${event.minute}.`);
      if (event.type === 'sub' && !event.playerOut) errors.push(`${at}: substituição de ${event.player} sem playerOut.`);
      if (event.ownGoal && event.type !== 'goal') errors.push(`${at}: ownGoal só se aplica a golos.`);
      knownPlayer(event.playerId);
    }

    if (lineups) {
      for (const side of ['home', 'away'] as const) {
        const starters = lineups[side].filter((slot) => slot.isStarter).length;
        if (starters !== 11) warnings.push(`${at}: escalação ${side === 'home' ? 'da casa' : 'visitante'} com ${starters} titulares.`);
        const numbers = lineups[side].map((slot) => slot.number).filter((number) => number > 0);
        if (new Set(numbers).size !== numbers.length) warnings.push(`${at}: camisolas repetidas na escalação ${side === 'home' ? 'da casa' : 'visitante'}.`);
        lineups[side].forEach((slot) => knownPlayer(slot.playerId));
      }
    }

    if (stats) {
      for (const key of stats.keys) {
        if (stats.home[key] === undefined || stats.away[key] === undefined) errors.push(`${at}: a estatística "${key}" está em keys mas falta num dos lados.`);
      }
      if (events.length && stats.keys.includes('yellowCards')) {
        for (const side of ['home', 'away'] as const) {
          const yellows = events.filter((event) => event.type === 'yellow' && event.team === side).length;
          if (yellows !== stats[side].yellowCards) warnings.push(`${at}: ${stats[side].yellowCards} amarelos na estatística ${side === 'home' ? 'da casa' : 'visitante'}, ${yellows} nos eventos.`);
        }
      }
    }
  }

  if (unknownPlayerIds.size) warnings.push(`${unknownPlayerIds.size} IDs de jogador fora do registo: ${[...unknownPlayerIds].sort().join(', ')}.`);

  // Totais derivados e atribuições que ficam por fazer.
  const derived = d.computeSeasonDerivedStats() as SeasonDerivedStats;
  if (readFileSync(DERIVED_FILE, 'utf8') !== renderDerived(derived)) {
    errors.push('Marcadores/cartões desatualizados (src/data/jogos/2026-27/derivados.ts). Corre `npm run jogos -- sincronizar`.');
  }
  const visible = new Set<string>(d.getPlayers().map((player: { id: string }) => player.id));
  const hiddenCards = Object.keys(derived.cards).filter((id) => !visible.has(id));
  if (hiddenCards.length) warnings.push(`Cartões de jogadores fora do registo (não aparecem na disciplina): ${hiddenCards.join(', ')}.`);
  for (const match of d.getMatchesForSeason(SEASON_ID)) {
    if (match.status !== 'finished') continue;
    for (const event of d.getMatchDetail(match).events) {
      const unattributed = !event.playerId && ((event.type === 'goal' && !event.ownGoal && !/autogolo/i.test(event.detail ?? '')) || event.type === 'yellow' || event.type === 'red');
      if (unattributed) warnings.push(`${match.id}: ${event.type === 'goal' ? 'golo' : 'cartão'} de "${event.player}" (${event.minute ?? '?'}') sem jogador identificado.`);
    }
  }

  return { errors, warnings };
}

// ── Impacto ───────────────────────────────────────────────────────────────

type Snapshot = Record<string, unknown>;

export function takeSnapshot(root: string): Snapshot {
  const dir = mkdtempSync(path.join(tmpdir(), 'jogos-retrato-'));
  const output = path.join(dir, 'retrato.json');
  try {
    runTsx([path.join(ROOT, 'scripts/jogos/retrato.mts')], { cwd: root, env: { ...process.env, ROOT: root, OUT: output }, quiet: true });
    return JSON.parse(readFileSync(output, 'utf8'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Retrato do último commit, calculado numa cópia temporária do repositório. */
export function snapshotHead(): Snapshot {
  const dir = mkdtempSync(path.join(tmpdir(), 'jogos-head-'));
  git(['worktree', 'add', '--detach', dir, 'HEAD']);
  const modules = path.join(dir, 'node_modules');
  try {
    symlinkSync(path.join(ROOT, 'node_modules'), modules);
    return takeSnapshot(dir);
  } finally {
    if (existsSync(modules)) unlinkSync(modules);
    git(['worktree', 'remove', '--force', dir]);
  }
}

const stable = (value: unknown): string => JSON.stringify(value, (_, v) => (v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)))
  : v));

const luanda = (iso?: string) => (iso
  ? new Date(iso).toLocaleString('pt-PT', { timeZone: 'Africa/Luanda', weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '')
  : '—');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function broadcastLabel(match: any, broadcast: string): string {
  return match.broadcaster && !broadcast.toLowerCase().includes('diferido')
    ? `${match.status === 'finished' ? 'Transmitido' : 'Em direto'} · ${broadcast}`
    : broadcast;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;

/** Descreve, em português e por secção do portal, o que muda entre dois retratos. */
export function describeImpact(before: Snapshot, after: Snapshot): string[] {
  const lines: string[] = [];
  const changed = (key: string) => stable(before[key]) !== stable(after[key]);
  const section = (title: string, items: string[]) => {
    if (items.length) lines.push('', `${title} (${items.length})`, ...items.map((item) => `  • ${item}`));
  };

  const matchItems: string[] = [];
  for (const key of Object.keys(after).filter((k) => k.startsWith('match:m27-') && changed(k))) {
    const a: Row = before[key] ?? {};
    const b: Row = after[key];
    const ma = a.match ?? {};
    const mb = b.match;
    const parts: string[] = [];
    const field = (label: string, x: unknown, y: unknown) => {
      if (stable(x) !== stable(y)) parts.push(`${label} ${x ?? '—'} → ${y ?? '—'}`);
    };
    field('data/hora', luanda(ma.date), luanda(mb.date));
    field('estádio', ma.stadium, mb.stadium);
    field('transmissão', a.broadcast && broadcastLabel(ma, a.broadcast), broadcastLabel(mb, b.broadcast));
    field('agenda', ma.scheduleStatus, mb.scheduleStatus);
    field('estado', ma.status, mb.status);
    field('resultado', ma.status === 'scheduled' ? undefined : `${ma.homeScore}-${ma.awayScore}`, mb.status === 'scheduled' ? undefined : `${mb.homeScore}-${mb.awayScore}`);
    field('intervalo', ma.halfTimeScore, mb.halfTimeScore);
    field('assistência', ma.attendance, mb.attendance);
    field('tempo útil', ma.usefulTimeMinutes, mb.usefulTimeMinutes);
    field('arbitragem', a.officials && Object.values(a.officials).flat().filter(Boolean).join(' / '), Object.values(b.officials).flat().filter(Boolean).join(' / '));
    field('eventos', a.detail?.events?.length, b.detail.events.length);
    field('escalações', a.detail && `${a.detail.homeLineup.length}+${a.detail.awayLineup.length}`, `${b.detail.homeLineup.length}+${b.detail.awayLineup.length}`);
    if (!parts.length) parts.push('ficha de jogo (nomes, eventos ou estatísticas)');
    matchItems.push(`${mb.id} · ${mb.round}.ª J · ${mb.homeTeam}–${mb.awayTeam}: ${parts.join('; ')}`);
  }
  section('Jogos', matchItems);

  const byKey = (list: Row[] | undefined, key: string) => new Map<string, Row>((list ?? []).map((row) => [row[key], row]));
  const standings = (season: string) => {
    const items: string[] = [];
    const a = byKey(before[`season:${season}:standings`] as Row[], 'teamId');
    for (const row of (after[`season:${season}:standings`] as Row[]) ?? []) {
      const old = a.get(row.teamId);
      if (!old || stable(old) !== stable(row)) {
        items.push(`${row.teamName}: ${old ? `${old.position}.º ${old.points} pts (${old.played} J, DG ${old.goalDifference})` : '—'} → ${row.position}.º ${row.points} pts (${row.played} J, DG ${row.goalDifference})`);
      }
    }
    return items;
  };
  section('Classificação 2026/27', standings('2026-27'));

  const listDiff = (key: string, id: string, describe: (row: Row) => string) => {
    const a = byKey(before[key] as Row[], id);
    const b = byKey(after[key] as Row[], id);
    const items: string[] = [];
    for (const [rowId, row] of b) {
      const old = a.get(rowId);
      if (!old) items.push(`novo: ${describe(row)}`);
      else if (stable(old) !== stable(row)) items.push(`${describe(old)} → ${describe(row)}`);
    }
    for (const [rowId, row] of a) if (!b.has(rowId)) items.push(`removido: ${describe(row)}`);
    return items;
  };
  section('Marcadores', listDiff('const:CURRENT_SEASON_SCORERS', 'id', (s) => `${s.name} (${s.club}, ${s.position}) ${s.goals} golo(s) em ${s.appearances} jogo(s)`));
  section('Disciplina', listDiff('fn:getCurrentSeasonDiscipline', 'id', (p) => `${p.name} (${p.club}) ${p.yellowCards} amarelo(s), ${p.redCards} vermelho(s) em ${p.appearances} jogo(s)`));

  const reconciliation: string[] = [];
  for (const key of ['fn:getCurrentSeasonGoalReconciliation', 'fn:getCurrentSeasonCardReconciliation', 'season:2026-27:updatedAt']) {
    if (changed(key)) reconciliation.push(`${key.replace(/^(fn|season):/, '')}: ${stable(before[key])} → ${stable(after[key])}`);
  }
  section('Totais e datas de atualização', reconciliation);

  const covered = /^(match:m27-|season:2026-27:standings|const:CURRENT_SEASON_SCORERS|fn:getCurrentSeasonDiscipline|fn:getCurrentSeasonGoalReconciliation|fn:getCurrentSeasonCardReconciliation|season:2026-27:updatedAt)/;
  const rest = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((key) => !covered.test(key) && changed(key));
  const groups = new Map<string, string[]>();
  for (const key of rest) {
    const [kind, ...name] = key.split(':');
    groups.set(kind, [...(groups.get(kind) ?? []), name.join(':')]);
  }
  const labels: Record<string, string> = { player: 'páginas de jogador', team: 'páginas de clube', fn: 'estatísticas e listas', const: 'constantes', season: 'épocas', match: 'jogos de outras épocas' };
  section('Também muda', [...groups].map(([kind, names]) => `${labels[kind] ?? kind}: ${names.length} — ${names.slice(0, 12).join(', ')}${names.length > 12 ? '…' : ''}`));

  return lines.length ? lines : ['', 'Sem alterações no que o portal mostra.'];
}
