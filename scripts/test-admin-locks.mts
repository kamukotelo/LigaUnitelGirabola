// Proteção do build: bloqueios da área administrativa (/adminancaf2026).
// Jornada, equipas e agenda oficial não mudam a partir do painel; o resultado
// de um jogo encerrado só muda com motivo. Ver src/lib/admin-match-locks.ts.
import assert from 'node:assert/strict';
import { applyMatchOverrideMap, getMatchRecord, getMatchesForSeason, UPCOMING_SEASON_ID } from '../src/lib/data.ts';
import {
  isMatchClosed, screenCalendarOverrides, stripLockedCalendarFields, validCorrectionReason,
} from '../src/lib/admin-match-locks.ts';

const upcoming = 'm27-7-5';
const closed = getMatchesForSeason(UPCOMING_SEASON_ID).find((match) => getMatchRecord(match.id)?.result?.status === 'finished');
assert.ok(closed, 'nenhum jogo encerrado nos registos');
assert.equal(isMatchClosed(closed.id), true);
assert.equal(isMatchClosed(upcoming), false);

// Um pedido que muda equipas, jornada ou agenda é recusado.
const attempt = screenCalendarOverrides({
  [upcoming]: { homeTeamId: 'dago', round: 3, date: '2026-10-13T17:00:00+01:00', stadium: 'Estádio antigo', broadcaster: 'TPA', attendance: 500 },
});
for (const label of ['equipa da casa', 'jornada', 'data e hora', 'estádio', 'transmissão']) {
  assert.ok(attempt.blocked.some((entry) => entry === `${upcoming}: ${label}`), `o campo "${label}" passou o bloqueio`);
}
assert.deepEqual(attempt.value, { [upcoming]: { attendance: 500 } }, 'os campos editáveis têm de continuar a passar');

// Valores antigos já publicados (o painel reenvia o bloco inteiro) não contam
// como tentativa, mas são limpos antes de gravar.
const stale = { [upcoming]: { date: '2026-10-13T17:00:00+01:00', attendance: 500 } };
const repeat = screenCalendarOverrides(stale, stale);
assert.deepEqual(repeat.blocked, []);
assert.deepEqual(repeat.value, { [upcoming]: { attendance: 500 } });
assert.deepEqual(stripLockedCalendarFields({ [upcoming]: { stadium: 'X' } }), {});

// Resultado de jogo encerrado: só com motivo.
const correction = screenCalendarOverrides({ [closed.id]: { homeScore: closed.homeScore + 3 } });
assert.deepEqual(correction.closedResultChanges, [closed.id]);
assert.deepEqual(screenCalendarOverrides({ [upcoming]: { homeScore: 2, status: 'live' } }).closedResultChanges, []);
assert.equal(validCorrectionReason('curto'), null);
assert.equal(validCorrectionReason('  Relatório do árbitro corrigido  '), 'Relatório do árbitro corrigido');

// Mesmo gravado na base de dados, um override com equipas ou jornada nunca
// muda o confronto mostrado no site.
const base = getMatchesForSeason(UPCOMING_SEASON_ID).find((match) => match.id === upcoming);
assert.ok(base);
const [shown] = applyMatchOverrideMap([base], { [upcoming]: { homeTeamId: 'dago', homeTeam: 'Outro', round: 3 } });
assert.equal(shown.homeTeamId, base.homeTeamId, 'o painel mudou a equipa da casa');
assert.equal(shown.round, base.round, 'o painel mudou a jornada');

console.log('✓ Painel: jornada, equipas e agenda oficial bloqueadas; correções de jogos encerrados pedem motivo.');
