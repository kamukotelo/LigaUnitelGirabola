import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { normaliseFcmsMatches, parseFcmsSyncPayload } from '../src/lib/fcms-sync';

const valid = {
  provider: 'authorised-push', tenant: 'ang', competitionExternalId: '3934', seasonId: '2026-27', dryRun: true,
  matches: [{
    externalMatchId: '1150991', round: 2, kickoff: '2026-08-31T15:00:00+01:00',
    homeExternalId: 'libolo-ext', awayExternalId: 'bravos-ext', homeScore: 0, awayScore: 1,
    halfTimeHomeScore: 0, halfTimeAwayScore: 0, status: 'finished',
    events: [{ minute: 85, type: 'goal', teamExternalId: 'bravos-ext', player: 'H. Kapitungo' }],
  }],
};

const parsed = parseFcmsSyncPayload(valid);
const normalised = normaliseFcmsMatches(parsed, [
  { externalTeamId: 'libolo-ext', teamId: 'libolo' },
  { externalTeamId: 'bravos-ext', teamId: 'bravos' },
]);
assert.equal(normalised[0].score, '0-1');
assert.equal(normalised[0].halfTimeScore, '0-0');
assert.equal(normalised[0].events[0].teamSide, 'away');
assert.equal(normalised[0].eventsProvided, true);

const withoutEvents = parseFcmsSyncPayload({ ...valid, matches: [{ ...valid.matches[0], events: undefined }] });
assert.equal(normaliseFcmsMatches(withoutEvents, [
  { externalTeamId: 'libolo-ext', teamId: 'libolo' },
  { externalTeamId: 'bravos-ext', teamId: 'bravos' },
])[0].eventsProvided, false);

assert.throws(() => normaliseFcmsMatches(parsed, []), /Mapeamento FCMS em falta/);
assert.throws(() => parseFcmsSyncPayload({ ...valid, matches: [{ ...valid.matches[0], status: 'scheduled' }] }), /Apenas jogos terminados/);
assert.throws(() => parseFcmsSyncPayload({ ...valid, matches: [valid.matches[0], valid.matches[0]] }), /duplicado/);
assert.throws(() => normaliseFcmsMatches(parseFcmsSyncPayload({
  ...valid,
  matches: [{ ...valid.matches[0], events: [{ minute: 85, type: 'goal', teamExternalId: 'libolo-ext', player: 'Erro' }] }],
}), [
  { externalTeamId: 'libolo-ext', teamId: 'libolo' },
  { externalTeamId: 'bravos-ext', teamId: 'bravos' },
]), /não coincidem/);

console.log('✓ Contrato e validações FCMS confirmados.');

const reportPath = '/Users/nsungukamukotelo/Downloads/MATCH_REPORT-18-Clube Desportivo da Huila-vs-Wiliete Sport Clube de Benguela.pdf';
const bundledPython = '/Users/nsungukamukotelo/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
if (existsSync(reportPath) && existsSync(bundledPython)) {
  const reportPayload = JSON.parse(execFileSync(bundledPython, [
    'scripts/convert-fcms-match-report.py', reportPath,
  ], { encoding: 'utf8' }));
  const parsedReport = parseFcmsSyncPayload(reportPayload);
  assert.equal(parsedReport.matches[0].externalMatchId, 'fcms-match-18');
  assert.equal(parsedReport.matches[0].homeScore, 0);
  assert.equal(parsedReport.matches[0].awayScore, 1);
  assert.equal(parsedReport.matches[0].events?.filter((event) => event.type === 'goal').length, 1);
  assert.equal(parsedReport.matches[0].events?.filter((event) => event.type === 'sub').length, 10);
  console.log('✓ Match Report 18 convertido e validado.');
}
