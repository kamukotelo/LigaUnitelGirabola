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
// Exceção única: golos cujo autor a fonte oficial ainda não identificou ficam
// em branco no site (nunca com "por confirmar") e têm de estar listados aqui.
// m27-5-5 55': a fonte assina o golo a «Cláudio», alcunha que não consta do
// plantel oficial do 1.º de Maio; sem camisola não há como ligar ao plantel.
const PENDING_SCORERS = ["m27-5-2 95'", "m27-5-5 55'"];
const pending = d.getMatchesForSeason(d.UPCOMING_SEASON_ID)
  .filter((m: { status: string }) => m.status === 'finished')
  .flatMap((m: { id: string }) => d.getMatchDetail(m).events
    .filter((e: { type: string; playerId?: string; ownGoal?: boolean; detail?: string }) => e.type === 'goal' && !e.playerId && !e.ownGoal && !/autogolo/i.test(e.detail ?? ''))
    .map((e: { minute?: number }) => `${m.id} ${e.minute}'`));
assert.deepEqual(pending.sort(), [...PENDING_SCORERS].sort(), 'Golos sem marcador fora da lista de pendentes.');
const goals = d.getCurrentSeasonGoalReconciliation();
assert.equal(goals.goalsUnattributed, PENDING_SCORERS.length, `Há ${goals.goalsUnattributed} golo(s) sem marcador nos registos.`);

console.log(`✓ Registos de jogo válidos e sincronizados (${warnings.length} avisos: \`npm run jogos -- validar\`).`);
