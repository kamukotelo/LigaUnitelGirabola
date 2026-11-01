// 9.ª jornada · São Salvador–Desportivo da Lunda Sul
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-9-3',
  round: 9,
  homeTeamId: 'saosalvador',
  awayTeamId: 'lundasul',
  schedule: { date: '2026-11-01T15:00:00+01:00', stadium: 'Estádio Álvaro Buta', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Resultado recebido a 01/11/2026 (aguarda o relatório do árbitro): golo do São Salvador aos 25',
  // atribuído a «Norman Anderson», nome que não consta do plantel inscrito.
  result: { status: 'finished', homeScore: 1, awayScore: 0, halfTimeScore: '1-0', updatedAt: '2026-11-01T19:28:00+01:00' },
  events: [
    { minute: 25, type: 'goal', team: 'home', player: '', detail: '1-0' },
  ],
});
