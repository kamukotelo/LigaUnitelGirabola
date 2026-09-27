// Proteção do build para a jornada ativa (página inicial, Calendário e
// Competição). Um jogo em atraso — adiado, remarcado para depois da jornada
// seguinte, ou sem resultado lançado — nunca pode prender o site numa jornada
// que já passou. Caso real: Sagrada × Petro (J5) remarcado para 4/11 deixou o
// site na Jornada 5 quando a direção já esperava a Jornada 6.
import assert from 'node:assert/strict';
import { loadData } from './jogos/lib.mts';

const d = await loadData();
const active = d.getActiveSeasonRound as (matches: unknown[], now?: number) => number;

const at = (iso: string) => new Date(iso).getTime();
type Status = 'scheduled' | 'live' | 'finished';
let seq = 0;
const m = (round: number, date: string, status: Status, extra: Record<string, unknown> = {}) => ({
  id: `t-${round}-${++seq}`, round, date, status, homeTeamId: `h${seq}`, awayTeamId: `a${seq}`, ...extra,
});

const J5_DONE = [
  m(5, '2026-09-19T15:30:00+01:00', 'finished'),
  m(5, '2026-09-20T15:00:00+01:00', 'finished'),
  m(5, '2026-09-21T15:30:00+01:00', 'finished'),
];
const J6 = [
  m(6, '2026-10-09T15:00:00+01:00', 'scheduled'),
  m(6, '2026-10-11T15:00:00+01:00', 'scheduled'),
];
const NOW = at('2026-09-27T16:00:00+01:00');

// 1. Jogo da J5 remarcado para depois do arranque da J6 → J6.
assert.equal(active([...J5_DONE, m(5, '2026-11-04T15:30:00+01:00', 'scheduled'), ...J6], NOW), 6,
  'Jogo remarcado para depois da jornada seguinte não pode prender a jornada.');

// 2. Jogo marcado como adiado (sem nova data), mesmo com a data original futura → J6.
assert.equal(active([...J5_DONE, m(5, '2026-09-28T15:30:00+01:00', 'scheduled', { postponed: true }), ...J6], NOW), 6,
  'Jogo adiado não pode prender a jornada.');

// 3. Hora já passou há mais de 12 h sem resultado lançado → J6.
assert.equal(active([...J5_DONE, m(5, '2026-09-21T15:30:00+01:00', 'scheduled'), ...J6], NOW), 6,
  'Jogo antigo sem resultado não pode prender a jornada.');

// 4. Jornada a meio: jogo ainda por disputar antes da J6 → continua na J5.
assert.equal(active([...J5_DONE, m(5, '2026-09-28T15:30:00+01:00', 'scheduled'), ...J6], NOW), 5,
  'Jornada em curso deve manter-se enquanto houver jogos por disputar.');

// 5. Jogo acabou de começar e ainda não tem resultado (dentro da margem) → J5.
assert.equal(active([...J5_DONE, m(5, '2026-09-27T15:30:00+01:00', 'scheduled'), ...J6], NOW), 5,
  'Jogo do próprio dia sem resultado ainda mantém a jornada.');

// 6. Jogo em direto → J5, independentemente da data.
assert.equal(active([...J5_DONE, m(5, '2026-11-04T15:30:00+01:00', 'live'), ...J6], NOW), 5,
  'Jogo em direto mantém sempre a jornada.');

// 7. Jornada toda terminada → avança; última jornada terminada → mantém-se.
assert.equal(active([...J5_DONE, ...J6], NOW), 6);
assert.equal(active(J5_DONE, NOW), 5);

// 8. Época por começar → primeira jornada.
assert.equal(active(J6, NOW), 6);

// 9. Jogo em atraso de uma jornada antiga não puxa o site para trás.
assert.equal(active([
  m(4, '2026-11-05T15:00:00+01:00', 'scheduled'),
  ...J5_DONE,
  ...J6,
], NOW), 6, 'Jogo em atraso de jornada anterior não pode puxar o site para trás.');

// 10. Dados reais: J5 de 2026/27 (com o Sagrada × Petro em atraso) seguida da
// J6 por disputar abre na J6. A J6 é forçada a 'scheduled' para que o teste
// não dependa de resultados lançados mais tarde.
const real = (d.getMatchesForSeason('2026-27') as Array<{ round: number; status: Status }>)
  .filter((x) => x.round === 5 || x.round === 6)
  .map((x) => (x.round === 6 ? { ...x, status: 'scheduled' as Status } : x));
assert.equal(active(real, NOW), 6,
  'Com a J5 real de 2026/27 terminada (salvo o jogo em atraso) a jornada ativa tem de ser a 6.');

console.log('✓ Jornada ativa: jogos em atraso, adiados ou sem resultado não prendem o site.');
