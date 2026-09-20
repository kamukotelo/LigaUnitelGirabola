// 5.ª jornada · Kabuscorp SC–GD Interclube
// 5.ª jornada · 20/09/2026 · Kabuscorp SC 1-0 GD Interclube (resultado final; ficha oficial por confirmar)
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-5-7',
  round: 5,
  homeTeamId: 'kabuscorp',
  awayTeamId: 'interclube',
  schedule: { date: '2026-09-20T15:00:00+01:00', stadium: 'Estádio França Ndalu', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'finished', homeScore: 1, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-09-20T17:45:00+01:00' },
  events: [
    { minute: 101, type: 'goal', team: 'home', player: 'Joaquim Paciência', number: 19, playerId: 'fifa-1jm8hd7', detail: "90'+11' (1-0)" },
  ],
});
