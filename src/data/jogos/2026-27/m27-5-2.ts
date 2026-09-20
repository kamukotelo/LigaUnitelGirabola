// 5.ª jornada · CD 1.º de Agosto–FC Luanda
// 5.ª jornada · 19/09/2026 · CD 1.º de Agosto 3-2 FC Luanda (resultado final; ficha oficial por confirmar)
// «Gelson Cabeto» na fonte: único Gelson inscrito pelo FC Luanda (nº 8, Gelson dos Santos André).
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-5-2',
  round: 5,
  homeTeamId: 'dago',
  awayTeamId: 'fcluanda',
  schedule: { date: '2026-09-19T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'finished', homeScore: 3, awayScore: 2, halfTimeScore: '0-1', updatedAt: '2026-09-20T17:55:00+01:00' },
  events: [
    { minute: 35, type: 'goal', team: 'away', player: 'Gelson André', number: 8, playerId: 'fifa-1ljudk2', detail: "35' · Grande penalidade (0-1)" },
    { minute: 52, type: 'goal', team: 'home', player: 'Dagó Tshibamba', number: 17, playerId: 'dago-tshibamba', detail: "52' (1-1)" },
    { minute: 59, type: 'goal', team: 'home', player: 'Euclides dos Santos', number: 5, playerId: 'fifa-1mtndt1', ownGoal: true, detail: "59' · Autogolo (2-1)" },
    { minute: 89, type: 'goal', team: 'home', player: 'Dagó Tshibamba', number: 17, playerId: 'dago-tshibamba', detail: "89' · Grande penalidade (3-1)" },
    { minute: 95, type: 'goal', team: 'away', player: 'Motivado', playerId: 'motivado-fcluanda', detail: "90'+5' (3-2)" },
  ],
});
