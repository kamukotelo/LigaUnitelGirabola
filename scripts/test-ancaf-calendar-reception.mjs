import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const HOST = '127.0.0.1';
const PORT = Number(process.env.ANCAF_TEST_PORT ?? 4317);
const BASE_URL = process.env.ANCAF_TEST_BASE_URL ?? `http://${HOST}:${PORT}`;
const TEST_TOKEN = process.env.ANCAF_TEST_TOKEN ?? 'ancaf-integration-test-token';
let server;

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE_URL}/api/ancaf?format=matches&round=1`);
      if (response.ok) return;
    } catch {
      // O servidor ainda está a arrancar.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`O servidor de testes não ficou disponível em ${BASE_URL}`);
}

async function postCalendar(body, token = TEST_TOKEN) {
  return fetch(`${BASE_URL}/api/ancaf/update-seed`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token === null ? {} : { authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  });
}

async function officialPayload() {
  const response = await fetch(`${BASE_URL}/api/ancaf?format=matches`);
  assert.equal(response.status, 200, 'a API de leitura deve disponibilizar o calendário oficial');
  const data = await response.json();
  assert.equal(data.count, 240, 'a fonte oficial deve conter 240 jogos');

  return {
    calendarIndex: Number(data.source.accessCode),
    technicalSeed: Number(data.source.technicalSeed),
    seasonId: '2026-27',
    matches: data.matches.map((match) => ({
      round: match.round,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      date: match.date.slice(0, 10),
    })),
  };
}

async function run() {
  if (!process.env.ANCAF_TEST_BASE_URL) {
    server = spawn(
      process.execPath,
      ['node_modules/next/dist/bin/next', 'dev', '--hostname', HOST, '--port', String(PORT)],
      {
        cwd: process.cwd(),
        env: { ...process.env, ANCAF_SYNC_TOKEN: TEST_TOKEN },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    server.stdout.on('data', () => {});
    server.stderr.on('data', (chunk) => process.stderr.write(chunk));
  }

  await waitForServer();
  const payload = await officialPayload();

  const noToken = await postCalendar(payload, null);
  assert.equal(noToken.status, 401, 'um pedido sem token deve ser rejeitado');

  const wrongToken = await postCalendar(payload, 'token-incorreto');
  assert.equal(wrongToken.status, 401, 'um pedido com token incorreto deve ser rejeitado');

  const incomplete = await postCalendar({ ...payload, matches: payload.matches.slice(0, 239) });
  assert.equal(incomplete.status, 400, 'um calendário incompleto deve ser rejeitado');
  assert.match((await incomplete.json()).message, /240 jogos/);

  const duplicateClub = structuredClone(payload);
  duplicateClub.matches[1].homeTeamId = duplicateClub.matches[0].homeTeamId;
  const duplicated = await postCalendar(duplicateClub);
  assert.equal(duplicated.status, 400, 'um clube repetido na mesma jornada deve ser rejeitado');

  const classicOnCafRound = structuredClone(payload);
  for (const match of classicOnCafRound.matches) {
    if (match.round === 3) match.round = 6;
    else if (match.round === 6) match.round = 3;
  }
  const classicConflict = await postCalendar(classicOnCafRound);
  assert.equal(classicConflict.status, 400, 'o clássico numa jornada CAF deve ser rejeitado');
  assert.match((await classicConflict.json()).message, /clássico Petro/);

  const unbalancedHomeRun = structuredClone(payload);
  for (const round of [1, 2, 3]) {
    const match = unbalancedHomeRun.matches.find((item) => item.round === round &&
      [item.homeTeamId, item.awayTeamId].includes('petro'));
    if (match.homeTeamId !== 'petro') {
      const originalHome = match.homeTeamId;
      const originalAway = match.awayTeamId;
      const reverse = unbalancedHomeRun.matches.find((item) =>
        item !== match && item.homeTeamId === originalAway && item.awayTeamId === originalHome);
      [match.homeTeamId, match.awayTeamId] = [match.awayTeamId, match.homeTeamId];
      [reverse.homeTeamId, reverse.awayTeamId] = [reverse.awayTeamId, reverse.homeTeamId];
    }
  }
  const unbalanced = await postCalendar(unbalancedHomeRun);
  assert.equal(unbalanced.status, 400, 'três jogos seguidos em casa devem ser rejeitados');
  assert.match((await unbalanced.json()).message, /mais de 2 jogos seguidos/);

  const accepted = await postCalendar(payload);
  const result = await accepted.json();
  assert.equal(accepted.status, 200, `o calendário oficial sorteado deve ser recebido: ${result.message ?? result.error}`);
  assert.equal(result.status, 'ok');
  assert.equal(result.calendarIndex, String(payload.calendarIndex));
  assert.equal(result.technicalSeed, String(payload.technicalSeed));
  assert.equal(result.persisted.matches_count, 240);
  assert.equal(result.persisted.officialSource, true);

  const firstRound = await fetch(`${BASE_URL}/api/ancaf?format=matches&round=1`).then((res) => res.json());
  assert.equal(firstRound.count, 8, 'a Jornada 1 deve conter oito jogos');
  assert.equal(firstRound.matches.every((match) => match.round === 1), true);

  const classicRounds = payload.matches
    .filter((match) => [match.homeTeamId, match.awayTeamId].includes('petro') &&
      [match.homeTeamId, match.awayTeamId].includes('dago'))
    .map((match) => match.round);
  assert.deepEqual(classicRounds, [6, 22], 'o calendário oficial deve colocar o clássico nas jornadas 6 e 22');

  const forbiddenClassicRounds = new Set([1, 2, 3, 4, 5, 7, 8, 12, 13, 15, 16, 17, 18, 19, 20, 21, 25, 26, 29, 30]);
  assert.equal(classicRounds.some((round) => forbiddenClassicRounds.has(round)), false);

  for (const teamId of new Set(payload.matches.flatMap((match) => [match.homeTeamId, match.awayTeamId]))) {
    const sequence = payload.matches
      .filter((match) => [match.homeTeamId, match.awayTeamId].includes(teamId))
      .sort((a, b) => a.round - b.round)
      .map((match) => match.homeTeamId === teamId ? 'C' : 'F');
    assert.doesNotMatch(sequence.join(''), /CCC|FFF/, `${teamId} não pode ter três mandos iguais seguidos`);
  }

  console.log('PASS: receção ANCAF/FAF autenticada e calendário oficial de 240 jogos aceite.');
  console.log('PASS: calendários incompletos, clubes duplicados e tokens inválidos foram rejeitados.');
  console.log('PASS: leitura da Jornada 1 devolveu os oito jogos recebidos.');
  console.log('PASS: clássico Petro–1.º de Agosto confirmado nas jornadas 6 e 22 e rejeitado em jornada reservada.');
  console.log('PASS: equilíbrio de mando validado; três jogos seguidos em casa ou fora são rejeitados.');
}

try {
  await run();
} finally {
  if (server && !server.killed) server.kill('SIGTERM');
}
