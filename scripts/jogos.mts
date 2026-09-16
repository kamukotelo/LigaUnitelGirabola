// Comando único para atualizar a informação dos jogos. Ver src/data/jogos/LEIA-ME.md.
//
//   npm run jogos -- procurar wiliete libolo
//   npm run jogos -- ver m27-5-6
//   npm run jogos -- sincronizar
//   npm run jogos -- validar [--detalhe]
//   npm run jogos -- impacto
//   npm run jogos -- publicar [--sim] [--coautor "Nome <email>"]
import { createInterface } from 'node:readline/promises';
import path from 'node:path';
import {
  DERIVED_FILE,
  INDEX_FILE,
  ROOT,
  SEASON_DIR,
  SEASON_ID,
  broadcastLabel,
  describeImpact,
  git,
  listRecordIds,
  loadData,
  renderDerived,
  renderIndex,
  run,
  runTsx,
  snapshotHead,
  takeSnapshot,
  validateRecords,
  writeIfChanged,
} from './jogos/lib.mts';

const [action = 'ajuda', ...args] = process.argv.slice(2);
const hasFlag = (name: string) => args.includes(`--${name}`);
const option = (name: string) => {
  const position = args.indexOf(`--${name}`);
  return position >= 0 ? args[position + 1] : undefined;
};
const VALUE_OPTIONS = new Set(['--coautor', '--destino']);
const positional = args.filter((arg, position) => !arg.startsWith('--') && !VALUE_OPTIONS.has(args[position - 1]));
const title = (text: string) => console.log(`\n━━ ${text}`);
const fold = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const luanda = (iso: string) => new Date(iso).toLocaleString('pt-PT', { timeZone: 'Africa/Luanda', weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '');

async function search() {
  if (!positional.length) throw new Error('Indica equipas ou a jornada, ex.: `npm run jogos -- procurar wiliete libolo` ou `procurar j5`.');
  const d = await loadData();
  const round = positional.map((term) => /^j(\d+)$/i.exec(term)).find(Boolean);
  const terms = positional.filter((term) => !/^j\d+$/i.test(term)).map(fold);
  const found = d.getMatchesForSeason(SEASON_ID).filter((match: { round: number; homeTeamId: string; awayTeamId: string; homeTeam: string; awayTeam: string }) =>
    (!round || match.round === Number(round[1]))
    && terms.every((term) => [match.homeTeamId, match.awayTeamId, match.homeTeam, match.awayTeam].some((value) => fold(value).includes(term))));
  if (!found.length) console.log('Nenhum jogo encontrado.');
  for (const match of found) {
    const score = match.status === 'scheduled' ? '' : ` ${match.homeScore}-${match.awayScore}`;
    console.log(`${match.id.padEnd(9)} ${String(match.round).padStart(2)}.ª  ${luanda(match.date)}  ${match.homeTeam}–${match.awayTeam}${score}  → src/data/jogos/${SEASON_ID}/${match.id}.ts`);
  }
}

async function show() {
  const id = positional[0];
  if (!id) throw new Error('Indica o jogo, ex.: `npm run jogos -- ver m27-5-6`.');
  const d = await loadData();
  const match = d.getMatchesForSeason(SEASON_ID).find((item: { id: string }) => item.id === id);
  if (!match) throw new Error(`Jogo ${id} não encontrado. Usa \`npm run jogos -- procurar\`.`);
  const detail = d.getMatchDetail(match);
  const officials = d.getMatchOfficials(match);
  title(`${match.id} · ${match.round}.ª jornada · ${match.homeTeam}–${match.awayTeam}`);
  console.log(`Ficheiro:      src/data/jogos/${SEASON_ID}/${match.id}.ts`);
  console.log(`Agenda:        ${luanda(match.date)} (hora de Luanda) · ${match.stadium} · ${match.scheduleStatus === 'official' ? 'oficial' : 'provisória'}`);
  console.log(`Transmissão:   ${broadcastLabel(match, d.getMatchBroadcast(match))}`);
  console.log(`Estado:        ${match.status}${match.status === 'scheduled' ? '' : ` · ${match.homeScore}-${match.awayScore}${match.halfTimeScore ? ` (intervalo ${match.halfTimeScore})` : ''}`}${match.attendance ? ` · ${match.attendance} espetadores` : ''}`);
  console.log(`Arbitragem:    ${officials.referee} · ${officials.assistants.join(' / ')} · 4.º ${officials.fourth}${officials.commissioner ? ` · delegado ${officials.commissioner}` : ''}`);
  if (detail.homeCoach || detail.awayCoach) console.log(`Treinadores:   ${detail.homeCoach ?? '—'} / ${detail.awayCoach ?? '—'}`);
  if (detail.homeLineup.length) console.log(`Escalações:    ${detail.homeLineup.length} + ${detail.awayLineup.length} jogadores`);
  if (detail.events.length) {
    console.log('Eventos:');
    for (const event of detail.events) {
      const label = { goal: event.ownGoal ? 'autogolo' : 'golo', yellow: 'amarelo', red: 'vermelho', warning: 'advertência', sub: 'entra' }[event.type as string];
      console.log(`  ${String(event.minute ?? '?').padStart(3)}'  ${label.padEnd(9)} ${event.team === 'home' ? 'casa' : 'fora'}  ${event.player}${event.playerOut ? ` (sai ${event.playerOut})` : ''}${event.playerId ? '' : '  ⚠ sem jogador identificado'}`);
    }
  }
  if (detail.officialStatKeys.length) console.log(`Estatísticas:  ${detail.officialStatKeys.map((key: string) => `${key} ${detail.homeStats[key]}-${detail.awayStats[key]}`).join(' · ')}`);
}

/** Regenera o índice, os totais derivados e os seeds SQL a partir dos registos. */
async function synchronize() {
  const changed: string[] = [];
  if (writeIfChanged(INDEX_FILE, renderIndex(listRecordIds()))) changed.push(path.relative(ROOT, INDEX_FILE));
  // Processos novos: cada passagem lê o índice e os totais acabados de gravar.
  const first = runTsx(['scripts/jogos.mts', '__derivados'], { quiet: true }).trim();
  const second = runTsx(['scripts/jogos.mts', '__derivados'], { quiet: true }).trim();
  if (second !== 'igual') throw new Error('Os totais derivados não estabilizam entre duas passagens; revê computeSeasonDerivedStats.');
  if (first === 'alterado') changed.push(path.relative(ROOT, DERIVED_FILE));
  const seedState = () => git(['diff', '--no-ext-diff', '--', 'supabase/seed']) + git(['status', '--porcelain', '--', 'supabase/seed']);
  const seedsBefore = seedState();
  runTsx(['scripts/generate-db-seed.mts'], { quiet: true });
  if (seedState() !== seedsBefore) changed.push('supabase/seed/*.sql');
  console.log(changed.length ? `Atualizado: ${changed.join(', ')}` : 'Tudo sincronizado.');
}

async function writeDerived() {
  const d = await loadData();
  console.log(writeIfChanged(DERIVED_FILE, renderDerived(d.computeSeasonDerivedStats())) ? 'alterado' : 'igual');
}

async function validate() {
  const { errors, warnings } = await validateRecords();
  const detailed = hasFlag('detalhe');
  if (warnings.length) {
    title(`Avisos (${warnings.length}) — não impedem publicar`);
    for (const warning of detailed ? warnings : warnings.slice(0, 15)) console.log(`  · ${warning}`);
    if (!detailed && warnings.length > 15) console.log(`  … mais ${warnings.length - 15} (usa --detalhe)`);
  }
  if (errors.length) {
    title(`Erros (${errors.length}) — corrige antes de publicar`);
    for (const error of errors) console.log(`  ✗ ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`\n✓ ${listRecordIds().length} registos de jogo válidos.`);
  }
}

function impact() {
  console.log('A calcular o portal no último commit e com as alterações atuais…');
  for (const line of describeImpact(snapshotHead(), takeSnapshot(ROOT))) console.log(line);
}

async function publish() {
  const target = option('destino') ?? 'main';
  title('1/6 · Sincronizar ficheiros gerados');
  await synchronize();
  title('2/6 · Validar registos');
  runTsx(['scripts/jogos.mts', 'validar']);
  title('3/6 · Testes de regressão');
  run('npm', ['run', '-s', 'test:regressions']);
  title('4/6 · Verificação de tipos');
  run('npx', ['tsc', '--noEmit', '-p', '.']);
  title('5/6 · Impacto no portal');
  impact();

  title(`6/6 · Publicar em ${target}`);
  const allowed = /^(src\/data\/jogos\/|supabase\/seed\/)/;
  const entries = git(['status', '--porcelain', '--untracked-files=all']).split('\n').filter(Boolean)
    .map((line) => line.slice(3).split(' -> ').pop()!.replace(/^"|"$/g, ''));
  const inScope = entries.filter((file) => allowed.test(file));
  const outOfScope = entries.filter((file) => !allowed.test(file));
  if (outOfScope.length) console.log(`Ficam de fora desta publicação (não são dados de jogos):\n${outOfScope.map((file) => `  - ${file}`).join('\n')}`);
  if (!inScope.length) {
    console.log('Nada a publicar: os registos de jogo já estão no último commit.');
    return;
  }

  git(['fetch', 'origin', target]);
  try {
    git(['merge-base', '--is-ancestor', `origin/${target}`, 'HEAD']);
  } catch {
    throw new Error(`A ${target} tem commits que esta branch não tem. Faz \`git pull --rebase origin ${target}\` e repete.`);
  }

  if (!hasFlag('sim')) {
    if (!process.stdin.isTTY) throw new Error('Sem terminal interativo: revê o impacto acima e repete com --sim para confirmar.');
    const prompt = createInterface({ input: process.stdin, output: process.stdout });
    const answer = await prompt.question(`\nPublicar ${inScope.length} ficheiro(s) em produção (${target})? [s/N] `);
    prompt.close();
    if (!/^s(im)?$/i.test(answer.trim())) {
      console.log('Publicação cancelada. As alterações continuam no teu computador.');
      return;
    }
  }

  const matchIds = inScope.map((file) => /\/(m27-\d+-\d+)\.ts$/.exec(file)?.[1]).filter(Boolean);
  const subject = matchIds.length
    ? `dados(jogos): atualizar ${matchIds.length > 6 ? `${matchIds.length} jogos` : matchIds.join(', ')}`
    : 'dados(jogos): sincronizar totais derivados e seeds';
  const coauthor = option('coautor');
  git(['add', '--', ...inScope]);
  git(['commit', '-m', subject, '-m', 'Publicado com `npm run jogos -- publicar`.', ...(coauthor ? ['-m', `Co-Authored-By: ${coauthor}`] : [])]);
  git(['push', 'origin', `HEAD:${target}`]);
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  if (branch !== target && branch !== 'HEAD') {
    try {
      git(['push', 'origin', `HEAD:${branch}`]);
    } catch {
      console.log(`(A branch ${branch} não foi enviada; a produção já está atualizada.)`);
    }
  }
  console.log(`\n✓ Publicado: ${git(['log', '-1', '--format=%h %s'])}\n  A Vercel está a construir o site; confirma em https://ligaunitelgirabola.com dentro de 1–2 minutos.`);
}

function help() {
  console.log(`Atualização de jogos — registo único por jogo em ${path.relative(ROOT, SEASON_DIR)}/<id>.ts

  procurar <equipas|jN>   encontra o id e o ficheiro de um jogo
  ver <id>                mostra o jogo tal como o portal o apresenta
  sincronizar             regenera índice, marcadores/cartões e seeds SQL
  validar [--detalhe]     verifica todos os registos (erros bloqueiam o build)
  impacto                 compara o portal do último commit com as alterações atuais
  publicar [--sim]        sincroniza, valida, testa, mostra o impacto e publica em produção

Guia completo: src/data/jogos/LEIA-ME.md`);
}

const actions: Record<string, () => unknown> = {
  procurar: search,
  ver: show,
  sincronizar: synchronize,
  validar: validate,
  impacto: impact,
  publicar: publish,
  __derivados: writeDerived,
  ajuda: help,
};

try {
  const handler = actions[action];
  if (!handler) {
    help();
    process.exitCode = 1;
  } else {
    await handler();
  }
} catch (error) {
  console.error(`\n✗ ${(error as Error).message}`);
  process.exitCode = 1;
}
