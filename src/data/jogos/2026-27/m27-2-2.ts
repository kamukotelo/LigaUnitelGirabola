// 2.ª jornada · Kabuscorp SC–Desportivo da Lunda Sul
// Ficha oficial de arbitragem (Match No. 14 · 29/08/2026 · Estádio 22 de Junho, Luanda).
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-2-2',
  round: 2,
  homeTeamId: 'kabuscorp',
  awayTeamId: 'lundasul',
  schedule: { date: '2026-08-29T15:30:00+01:00', stadium: 'Estádio 22 de Junho', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'finished', homeScore: 1, awayScore: 1, halfTimeScore: '1-0', attendance: 1000, updatedAt: '2026-09-06T17:50:00+01:00' },
  officials: { referee: 'Edilson Roberto Gomes André', assistants: ['Manuel Luís Benguela', 'Joaquim Manuel Chiyo'], fourth: 'Sabino Garcez de Sousa de Carvalho' },
  coaches: { home: 'Léo Neiva', away: 'Pedro Barros' },
  events: [
    { minute: 11, type: 'sub', team: 'away', player: 'Domingos Ximba', playerId: 'ximba', playerOut: 'Felix Honjo' },
    { minute: 21, type: 'yellow', team: 'away', player: 'Joaquim Teixeira', playerId: 'mussa-lunda-sul' },
    { minute: 26, type: 'goal', team: 'home', player: 'Henock Mangindula', playerId: 'fifa-1mppsb5', detail: '1-0' },
    { minute: 45, type: 'sub', team: 'home', player: 'Mbali Mongbongo Sem', playerOut: 'Joaquim Paciência' },
    { minute: 45, type: 'sub', team: 'away', player: 'António Ngola Ngulu', playerOut: 'Osvaldo Miguel' },
    { minute: 46, type: 'yellow', team: 'home', player: 'Adair Garcia Domingos', playerId: 'fifa-1lgpgy7' },
    { minute: 46, type: 'yellow', team: 'away', player: 'Frederico Singongo', playerId: 'fred' },
    { minute: 57, type: 'goal', team: 'away', player: 'Dieu Maquissossila David', playerId: 'dieu', detail: '1-1' },
    { minute: 60, type: 'sub', team: 'home', player: 'Alberto Elizeu Xavier', playerOut: 'Celestino Luís Maleco' },
    { minute: 72, type: 'sub', team: 'home', player: 'Tresor Kuyu Nona', playerOut: 'Bayala Nsimba' },
    { minute: 74, type: 'yellow', team: 'away', player: 'Adalberto Wacamba', playerId: 'cacusso' },
    { minute: 84, type: 'yellow', team: 'home', player: 'Mbali Mongbongo Sem', playerId: 'fifa-1v363a9' },
    { minute: 86, type: 'sub', team: 'away', player: 'Mário Bernardo Keta', playerOut: 'João Baptista Cassicote' },
    { minute: 90, type: 'yellow', team: 'away', player: 'Dieu David', playerId: 'dieu' },
    { minute: 90, type: 'sub', team: 'home', player: 'Artur Malungo', playerOut: 'Zamorano Lopes' },
    { minute: 90, type: 'sub', team: 'home', player: 'Aluízio Joel André Cacharamba', playerOut: 'Mankoka Hegene Afonso' },
    { minute: 90, type: 'sub', team: 'away', player: 'João Bivoba Zau', playerOut: 'Joaquim Teixeira' },
  ],
  stats: {
    home: { yellowCards: 2, redCards: 0 },
    away: { yellowCards: 4, redCards: 0 },
    keys: ['yellowCards', 'redCards'],
  },
});
