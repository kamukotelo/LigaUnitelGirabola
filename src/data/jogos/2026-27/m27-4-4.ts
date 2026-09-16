// 4.ª jornada · Bravos do Maquis–Kabuscorp SC
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-4-4',
  round: 4,
  homeTeamId: 'bravos',
  awayTeamId: 'kabuscorp',
  schedule: { date: '2026-09-16T15:00:00+01:00', stadium: 'Estádio Mundunduleno', scheduleStatus: 'official' },
  result: { status: 'finished', homeScore: 1, awayScore: 0, updatedAt: '2026-09-16T17:30:00+01:00' },
  events: [
    { minute: 30, type: 'goal', team: 'home', player: 'Lito', number: 23, playerId: 'lito-bravos', detail: "30' (1-0)" },
  ],
});
