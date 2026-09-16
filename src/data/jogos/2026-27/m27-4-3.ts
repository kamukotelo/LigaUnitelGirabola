// 4.ª jornada · Wiliete de Benguela–FC Luanda
// 4.ª jornada · 13/09/2026 · Estádio Nacional de Ombaka
// 4.ª jornada (13/09/2026 · Estádio Nacional de Ombaka, Benguela).
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-4-3',
  round: 4,
  homeTeamId: 'wiliete',
  awayTeamId: 'fcluanda',
  schedule: { date: '2026-09-13T16:00:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official' },
  result: { status: 'finished', homeScore: 2, awayScore: 0, halfTimeScore: '2-0', updatedAt: '2026-09-13T18:05:00+01:00' },
  officials: { referee: 'Gilberto Bernardino Kativa', assistants: ['António Emiliano Livongue', 'Carlos Pereira Gabriel'], fourth: 'Nuno Eduardo Sumbo' },
  coaches: { home: 'Beto Bianchi', away: 'Rui Santos' },
  events: [
    { minute: 31, type: 'goal', team: 'home', player: 'Mabululu', playerId: 'mabululu-wiliete', detail: '1-0' },
    { minute: 45, type: 'goal', team: 'home', player: 'Mabululu', playerId: 'mabululu-wiliete', detail: "45'+6 · 2-0" },
  ],
});
