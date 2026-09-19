// 5.ª jornada · CD 1.º de Agosto–FC Luanda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-5-2',
  round: 5,
  homeTeamId: 'dago',
  awayTeamId: 'fcluanda',
  schedule: { date: '2026-09-19T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'finished', homeScore: 3, awayScore: 2, halfTimeScore: '0-1', updatedAt: '2026-09-19T18:47:00+01:00' },
  officials: {
    referee: 'Ailton Jeovane Quissanga Carmelino',
    assistants: ['Evanildo Gaspar dos Santos Martins', 'Pedro Domingos de Andrade Micolo'],
    fourth: 'Alberto Henrique F. Bartolomeu',
  },
  events: [
    { minute: 35, type: 'goal', team: 'away', player: 'Gelson Cabeto', playerId: 'fifa-1ljudk2', detail: 'Grande penalidade · 0-1' },
    { minute: 52, type: 'goal', team: 'home', player: 'Dagó Tshibamba', playerId: 'dago-tshibamba', detail: '1-1' },
    { minute: 59, type: 'goal', team: 'home', player: 'Euclides dos Santos Ronaldo', ownGoal: true, detail: 'Autogolo · 2-1' },
    { minute: 89, type: 'goal', team: 'home', player: 'Autor por confirmar', playerId: 'm27-5-2-home-scorer-89', detail: 'Grande penalidade · 3-1' },
    { minute: 95, type: 'goal', team: 'away', player: 'Autor por confirmar', playerId: 'm27-5-2-away-scorer-95', detail: "90'+5 · 3-2" },
  ],
  stats: {
    home: { corners: 1, yellowCards: 1 },
    away: { corners: 0, yellowCards: 1 },
    keys: ['corners', 'yellowCards'],
  },
});
