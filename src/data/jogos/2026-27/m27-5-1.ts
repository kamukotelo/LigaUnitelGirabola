// 5.ª jornada · CR Caála–Bravos do Maquis
// 5.ª jornada · 20/09/2026 · CR Caála 1-2 Bravos do Maquis (resultado final; ficha oficial por confirmar)
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-5-1',
  round: 5,
  homeTeamId: 'caala',
  awayTeamId: 'bravos',
  schedule: { date: '2026-09-20T15:00:00+01:00', stadium: 'Estádio Daniel Lutucuta', scheduleStatus: 'official' },
  result: { status: 'finished', homeScore: 1, awayScore: 2, halfTimeScore: '0-2', updatedAt: '2026-09-20T17:45:00+01:00' },
  events: [
    { minute: 14, type: 'goal', team: 'away', player: 'Lito', number: 23, playerId: 'lito-bravos', detail: "14' (0-1)" },
    { minute: 29, type: 'goal', team: 'away', player: 'Ju Cabral', number: 8, playerId: 'ju-cabral-bravos', detail: "29' (0-2)" },
    { minute: 83, type: 'goal', team: 'home', player: 'Valegol', number: 9, playerId: 'fifa-1k0r4w6', detail: "83' (1-2)" },
  ],
});
