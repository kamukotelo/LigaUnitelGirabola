// 10.ª jornada · Desportivo da Lunda Sul–Wiliete de Benguela
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-10-8',
  round: 10,
  homeTeamId: 'lundasul',
  awayTeamId: 'wiliete',
  schedule: { date: '2026-11-08T15:00:00+01:00', stadium: 'Estádio do Sagrada Esperança', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Resultado e marcadores recebidos a 08/11/2026 (captura da app; aguarda o relatório do árbitro).
  result: { status: 'finished', homeScore: 1, awayScore: 2, halfTimeScore: '1-1', updatedAt: '2026-11-08T17:06:00+01:00' },
  events: [
    { minute: 1, type: 'goal', team: 'home', player: 'Joca', number: 27, playerId: 'joca-lunda-sul', detail: '1-0' },
    { minute: 40, type: 'goal', team: 'away', player: 'Mabululu', number: 9, playerId: 'mabululu-wiliete', detail: '1-1' },
    { minute: 76, type: 'goal', team: 'away', player: 'Mindinho', number: 10, playerId: 'fifa-1jru7c5', detail: '1-2' },
  ],
});
