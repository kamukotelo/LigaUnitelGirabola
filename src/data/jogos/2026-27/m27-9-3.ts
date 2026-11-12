// 9.ª jornada · São Salvador–Desportivo da Lunda Sul
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-9-3',
  round: 9,
  homeTeamId: 'saosalvador',
  awayTeamId: 'lundasul',
  schedule: { date: '2026-11-01T15:00:00+01:00', stadium: 'Estádio Álvaro Buta', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Resultado recebido a 01/11/2026. Marcador e minuto do Relatório do Árbitro n.º 69 (12/11/2026):
  // Anderson de Jesus Luís Mputa (n.º 26) aos 20' (o resultado recebido dizia «Norman Anderson», 25').
  result: { status: 'finished', homeScore: 1, awayScore: 0, halfTimeScore: '1-0', updatedAt: '2026-11-01T19:28:00+01:00' },
  // Equipa de arbitragem do Relatório do Árbitro n.º 69 (12/11/2026).
  officials: { referee: 'Ailton Jeovane Quissanga Carmelino', assistants: ['Evanildo Gaspar dos Santos Martins', 'Pedro Domingos de Andrade Micolo'], fourth: 'Garcia Luhamo Remos', commissioner: 'Ernesto Tati' },
  events: [
    { minute: 20, type: 'goal', team: 'home', player: 'Anderson Mputa', number: 26, playerId: 'fifa-1k2pyw6', detail: '1-0' },
  ],
});
