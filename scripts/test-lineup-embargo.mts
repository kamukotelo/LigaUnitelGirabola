// Proteção do build: o line up de um jogo só é público a partir de 1 h antes do
// início, mesmo que já esteja carregado (pedido da DCE, 13/10/2026, por causa
// do grafismo da Zsports). Jogos em direto ou terminados mostram-no sempre.
import assert from 'node:assert/strict';
import { isLineupPublic, lineupPublicFrom } from '../src/lib/lineup-embargo.ts';
import { getMatchDetail, getMatchRecord, getMatchesForSeason, UPCOMING_SEASON_ID } from '../src/lib/data.ts';

const kickoff = '2026-10-13T17:00:00+01:00';
const at = (iso: string) => Date.parse(iso);

assert.equal(lineupPublicFrom(kickoff), at('2026-10-13T16:00:00+01:00'));
assert.equal(isLineupPublic({ date: kickoff, status: 'scheduled' }, at('2026-10-13T15:59:59+01:00')), false, 'line up visível antes de 1 h do início');
assert.equal(isLineupPublic({ date: kickoff, status: 'scheduled' }, at('2026-10-13T16:00:00+01:00')), true, 'line up escondido a 1 h do início');
assert.equal(isLineupPublic({ date: kickoff, status: 'live' }, at('2026-10-13T12:00:00+01:00')), true, 'jogo em direto sem line up');
assert.equal(isLineupPublic({ date: kickoff, status: 'finished' }, at('2026-10-13T12:00:00+01:00')), true, 'jogo terminado sem line up');

// Um jogo por disputar com line up carregado não o mostra antes da hora.
const base = getMatchesForSeason(UPCOMING_SEASON_ID).find((match) => getMatchRecord(match.id)?.lineups?.home.length);
assert.ok(base, 'nenhum jogo com line up para testar o embargo');
const upcoming = { ...base, status: 'scheduled' as const, date: kickoff };
const realNow = Date.now;
try {
  Date.now = () => at('2026-10-13T15:00:00+01:00');
  const hidden = getMatchDetail(upcoming);
  assert.equal(hidden.homeLineup.length + hidden.awayLineup.length, 0, `${base.id}: line up visível antes de 1 h do início`);
  assert.equal(hidden.homeCoach ?? hidden.awayCoach, undefined, `${base.id}: treinadores do line up visíveis antes de 1 h do início`);
  assert.equal(hidden.lineupPublicFrom, at('2026-10-13T16:00:00+01:00'));

  // Blindagem do cliente: simulação de acesso no browser de visitante para jogo por disputar sob embargo
  (globalThis as any).window = {};
  const browserRecord = getMatchRecord('m27-8-4');
  assert.equal(browserRecord?.lineups, undefined, 'm27-8-4: escalação exposta no browser para jogo sob embargo');
  delete (globalThis as any).window;

  Date.now = () => at('2026-10-13T16:30:00+01:00');
  const shown = getMatchDetail(upcoming);
  assert.ok(shown.homeLineup.length > 0, `${base.id}: line up escondido a menos de 1 h do início`);
  assert.equal(shown.lineupPublicFrom, undefined);
} finally {
  Date.now = realNow;
}

console.log('✓ Line ups só públicos a partir de 1 h antes do início do jogo.');
