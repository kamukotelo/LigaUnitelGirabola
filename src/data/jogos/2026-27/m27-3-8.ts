// 3.ª jornada · Académica do Lobito–Estrela 1.º de Maio
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-3-8',
  round: 3,
  homeTeamId: 'lobito',
  awayTeamId: 'primeiromaio',
  schedule: { date: '2026-09-05T15:30:00+01:00', stadium: 'Estádio do Buraco', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'finished', homeScore: 0, awayScore: 2, halfTimeScore: '0-1', updatedAt: '2026-09-05T18:15:00+01:00' },
  officials: { referee: 'Edson António Esoko', assistants: ['Estanislau Guedes Tavares Muluta Prata', 'João Manuel Fula António'], fourth: 'Nelson Joaquim Camunga', commissioner: 'Manuel Pires Nunda' },
  events: [
    { minute: 47, type: 'goal', team: 'away', player: 'Moisés', playerId: 'moises-primeiromaio', detail: "45'+2 · 0-1" },
    { minute: 81, type: 'goal', team: 'away', player: 'Kessie Messi', playerId: 'kessie-messi-primeiromaio', detail: '0-2' },
  ],
  stats: {
    home: { corners: 1, yellowCards: 6 },
    away: { corners: 0, yellowCards: 3 },
    keys: ['corners', 'yellowCards'],
  },
});
