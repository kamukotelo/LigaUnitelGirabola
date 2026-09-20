// 5.ª jornada · Wiliete de Benguela–Recreativo do Libolo
// 5.ª jornada · 20/09/2026 · Wiliete 5-0 Libolo aos 90'+6 (jogo a decorrer)
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-5-6',
  round: 5,
  homeTeamId: 'wiliete',
  awayTeamId: 'libolo',
  schedule: { date: '2026-09-20T17:15:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'live', homeScore: 5, awayScore: 0, halfTimeScore: '1-0', liveMinute: 96, updatedAt: '2026-09-20T18:25:00+01:00' },
  // Relatório do Árbitro n.º 38 (20/09/2026).
  officials: {
    referee: 'Paulo Sérgio Moreira',
    assistants: ['Lídio Chicomo Cuimbra', 'Segunda Chisseque Francisco'],
    fourth: 'Nelson Joaquim Camunga',
    commissioner: 'António Caxala Muachihuissa',
  },
  events: [
    { minute: 1, type: 'goal', team: 'home', player: 'Bocar Sidibé', number: 30, playerId: 'fifa-1qvfjm7', detail: "1' (1-0)" },
    { minute: 49, type: 'goal', team: 'home', player: 'Mabululu', number: 9, playerId: 'mabululu-wiliete', detail: "49' (2-0)" },
    { minute: 63, type: 'goal', team: 'home', player: 'Mabululu', number: 9, playerId: 'mabululu-wiliete', detail: "63' (3-0)" },
    { minute: 82, type: 'goal', team: 'home', player: 'Rodino Dumbo José', number: 25, playerId: 'fifa-1jwu0l8', detail: "82' (4-0)" },
    { minute: 87, type: 'goal', team: 'home', player: 'Valter Monteiro', number: 35, playerId: 'valter-monteiro', detail: "87' (5-0)" },
  ],
});
