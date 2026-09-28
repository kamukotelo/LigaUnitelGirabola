// Proteção do build: uma edição antiga do painel /adminancaf2026 nunca pode
// sobrepor a data, hora, estádio ou transmissão de um jogo com registo em
// src/data/jogos. O resultado lançado no painel continua a valer.
import assert from 'node:assert/strict';
import { applyMatchOverrideMap, getMatchRecord, getMatchesForSeason, UPCOMING_SEASON_ID } from '../src/lib/data.ts';

const id = 'm27-7-5';
const record = getMatchRecord(id);
assert.ok(record, `registo ${id} em falta`);
const base = getMatchesForSeason(UPCOMING_SEASON_ID).find((match) => match.id === id);
assert.ok(base, `jogo ${id} em falta no calendário`);

const [edited] = applyMatchOverrideMap([base], {
  [id]: {
    date: '2026-10-13T17:00:00+01:00',
    stadium: 'Estádio antigo',
    broadcaster: undefined,
    scheduleStatus: 'provisional',
    attendance: 1234,
  },
});

assert.equal(edited.date, record.schedule.date, 'a data do painel sobrepôs o registo');
assert.equal(edited.stadium, record.schedule.stadium, 'o estádio do painel sobrepôs o registo');
assert.equal(edited.broadcaster, record.schedule.broadcaster, 'a transmissão do painel sobrepôs o registo');
assert.equal(edited.scheduleStatus, record.schedule.scheduleStatus, 'o estado da agenda do painel sobrepôs o registo');
assert.equal(edited.attendance, 1234, 'campos fora da agenda deixaram de aceitar o painel');

console.log('✓ Agenda dos registos de jogo prevalece sobre edições antigas do painel.');
