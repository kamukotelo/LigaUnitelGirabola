// 3.ª jornada · Bravos do Maquis–São Salvador
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-3-5',
  round: 3,
  homeTeamId: 'bravos',
  awayTeamId: 'saosalvador',
  schedule: { date: '2026-09-06T15:00:00+01:00', stadium: 'Estádio Mundunduleno', scheduleStatus: 'official' },
  result: { status: 'finished', homeScore: 0, awayScore: 1, halfTimeScore: '0-1', updatedAt: '2026-09-06T17:50:00+01:00' },
  officials: { referee: 'Sabino Garcez de Sousa de Carvalho', assistants: ['Evandro Henrique Freitas da Rocha', 'Flávio Luís Cadete Dias'], fourth: 'João Chipombe', commissioner: 'Rodrigues Aleixo César' },
  events: [
    { minute: 27, type: 'goal', team: 'away', player: 'Beni Papel', playerId: 'beni-papel-saosalvador', detail: '0-1' },
  ],
});
