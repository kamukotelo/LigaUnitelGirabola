// Proteção do build para os registos de jogo (src/data/jogos): cada registo tem
// de ser válido e os ficheiros gerados — índice, marcadores/cartões — têm de
// corresponder aos registos. Um jogo editado sem `npm run jogos -- sincronizar`
// bloqueia o deploy em vez de publicar totais desatualizados.
import assert from 'node:assert/strict';
import { loadData, validateRecords } from './jogos/lib.mts';

const { errors, warnings } = await validateRecords();
if (errors.length) {
  console.error(`✗ ${errors.length} erro(s) nos registos de jogo:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
  process.exit(1);
}

const d = await loadData();
const match = (id: string) => {
  const found = d.getMatchesForSeason('2026-27').find((item: { id: string }) => item.id === id);
  assert.ok(found, `O jogo ${id} tem de existir no calendário.`);
  return found;
};

// 5.ª jornada (14/09/2026): a hora e as transmissões publicadas não podem voltar atrás.
assert.equal(match('m27-5-6').date, '2026-09-20T17:15:00+01:00');
assert.equal(match('m27-5-6').broadcaster, 'Zsports');
assert.equal(match('m27-5-2').broadcaster, 'Zsports');
// A Rádio 5 é a transmissão por omissão: com broadcaster preenchido, o cartão
// mostraria "Em direto · Rádio 5" como se fosse televisão.
assert.equal(match('m27-5-3').broadcaster, undefined);
assert.equal(d.getMatchBroadcast(match('m27-5-3')), 'Rádio 5');

// O CR Caála recebe esta época no Estádio Daniel Lutucuta, no Huambo. O
// calendário do FAF atribui-lhe o Estádio dos Mártires da Canhala em todos os
// jogos em casa, e é o calendário que está errado — como já acontecia com o
// Estrela 1.º de Maio e o Campo Municipal de Benguela.
for (const caalaHome of d.getMatchesForSeason('2026-27').filter((m: { homeTeamId: string }) => m.homeTeamId === 'caala')) {
  assert.equal(caalaHome.stadium, 'Estádio Daniel Lutucuta', `${caalaHome.id}: o Caála joga em casa no Estádio Daniel Lutucuta.`);
}

// Relatório do Árbitro n.º 29 (CR Caála 1-2 Desportivo da Huíla).
const caalaHuila = match('m27-4-1');
assert.equal(caalaHuila.stadium, 'Estádio Daniel Lutucuta');
assert.equal(caalaHuila.attendance, 1200);
// O commissioner existe nos registos internos (ficheiros de jogo / FCMS),
// mas getMatchOfficials() não o expõe publicamente por design — ver data.ts.
assert.equal(d.getMatchRecord('m27-4-1')?.officials?.commissioner, 'Manuel André António');
const scorers = new Map<string, { goals: number }>(d.CURRENT_SEASON_SCORERS.map((scorer: { id: string; goals: number }) => [scorer.id, scorer]));
assert.equal(scorers.get('fifa-1jz4pi8')?.goals, 2, 'Benvindo marcou aos 12\' no Relatório 29.');
assert.equal(scorers.has('cuxixima-caala'), false, 'Cuxixima não marcou no Relatório 29.');

// Todos os golos dos resultados têm marcador ou são autogolos assinalados.
// Exceção única: golos cujo marcador não tem página de jogador no portal têm de
// estar listados aqui. Desde 19/10/2026 todos os marcadores dos Relatórios do
// Árbitro n.º 1–55 estão identificados e ligados ao plantel (lista vazia).
const PENDING_SCORERS: string[] = ["m27-8-6 94'", "m27-9-2 78'", "m27-9-3 25'", "m27-9-5 42'", "m27-9-6 64'", "m27-9-6 66'", "m27-9-7 82'"];
const pending = d.getMatchesForSeason(d.UPCOMING_SEASON_ID)
  .filter((m: { status: string }) => m.status === 'finished')
  .flatMap((m: { id: string }) => d.getMatchDetail(m).events
    .filter((e: { type: string; playerId?: string; ownGoal?: boolean; detail?: string }) => e.type === 'goal' && !e.playerId && !e.ownGoal && !/autogolo/i.test(e.detail ?? ''))
    .map((e: { minute?: number }) => `${m.id} ${e.minute}'`));
assert.deepEqual(pending.sort(), [...PENDING_SCORERS].sort(), 'Golos sem marcador fora da lista de pendentes.');
// Jogos cujo resultado chegou sem minutos nem marcadores: ficam sem eventos até
// ao relatório do árbitro e todos os golos contam como por identificar.
const PENDING_MATCHES_WITHOUT_EVENTS: Record<string, number> = {};
for (const [id, count] of Object.entries(PENDING_MATCHES_WITHOUT_EVENTS)) {
  const record = d.getMatchRecord(id);
  assert.equal(record?.events?.length ?? 0, 0, `${id} já tem eventos: tirar da lista de jogos sem eventos.`);
  assert.equal((record?.result?.homeScore ?? 0) + (record?.result?.awayScore ?? 0), count, `${id}: total de golos não bate com a lista.`);
}
const pendingWithoutEvents = Object.values(PENDING_MATCHES_WITHOUT_EVENTS).reduce((sum, n) => sum + n, 0);
const goals = d.getCurrentSeasonGoalReconciliation();
assert.equal(goals.goalsUnattributed, PENDING_SCORERS.length + pendingWithoutEvents, `Há ${goals.goalsUnattributed} golo(s) sem marcador nos registos.`);

// Jornada ativa: um jogo antecipado de uma jornada futura não arrasta o site
// para essa jornada (05/11/2026: o Petro–Huíla da J14, jogado a 03/11, abria o
// site na J14 em vez da J10).
{
  const fake = (round: number, n: number, status: string) => ({ id: `t-${round}-${n}`, round, status, date: `2026-11-${String(round).padStart(2, '0')}T15:00:00+01:00` });
  const roundOf = (r: number, statuses: string[]) => statuses.map((status, i) => fake(r, i, status));
  const done = Array(8).fill('finished');
  const todo = Array(8).fill('scheduled');
  const base = [...roundOf(9, done), ...roundOf(10, todo), ...roundOf(11, todo)];
  assert.equal(d.getActiveSeasonRound(base), 10, 'Com a J9 encerrada, a jornada ativa é a J10.');
  const anticipated = [...roundOf(9, done), ...roundOf(10, todo), ...roundOf(11, ['finished', ...todo.slice(1)])];
  assert.equal(d.getActiveSeasonRound(anticipated), 10, 'Um jogo antecipado da J11 não muda a jornada ativa.');
  const underway = [...roundOf(9, done), ...roundOf(10, ['finished', 'finished', 'finished', 'finished', 'live', 'scheduled', 'scheduled', 'scheduled']), ...roundOf(11, todo)];
  assert.equal(d.getActiveSeasonRound(underway), 10, 'Uma jornada a meio continua ativa.');
}

console.log(`✓ Registos de jogo válidos e sincronizados (${warnings.length} avisos: \`npm run jogos -- validar\`).`);
