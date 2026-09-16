// 1.ª jornada · Wiliete de Benguela–Académica do Lobito
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-1-5',
  round: 1,
  homeTeamId: 'wiliete',
  awayTeamId: 'lobito',
  schedule: { date: '2026-08-23T17:30:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'finished', homeScore: 2, awayScore: 0, updatedAt: '2026-09-06T17:50:00+01:00' },
  officials: { referee: 'Sabino Garcez de Sousa de Carvalho', assistants: ['Evandro Henrique Freitas da Rocha', 'Flávio Luís Cadete Dias'], fourth: 'Pedro Filomeno Jacinto Katchisosa', commissioner: 'Romualdo do Rosário Baltazar' },
  coaches: { home: 'Beto Bianchi', away: 'Silvestre Pelé' },
  events: [
    { minute: 11, type: 'goal', team: 'home', player: 'Kabelo Dlamini', playerId: 'kabelo-dlamini', detail: '1-0' },
    { minute: 16, type: 'yellow', team: 'away', player: 'Manuel Pereira Londaka', playerId: 'manuel-lobito', detail: 'Comportamento antidesportivo' },
    { minute: 47, type: 'goal', team: 'home', player: 'Valter Monteiro', playerId: 'valter-monteiro', detail: "45'+2 (2-0)" },
  ],
  stats: {
    home: { corners: 0, yellowCards: 0 },
    away: { corners: 0, yellowCards: 1 },
    keys: ['corners', 'yellowCards'],
  },
});
