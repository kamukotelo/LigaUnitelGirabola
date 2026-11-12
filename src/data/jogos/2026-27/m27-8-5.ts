// 8.ª jornada · Desportivo da Huíla–Recreativo do Libolo
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-8-5',
  round: 8,
  homeTeamId: 'desphuila',
  awayTeamId: 'libolo',
  schedule: { date: '2026-10-25T15:30:00+01:00', stadium: 'Estádio da Tundavala', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Resultado recebido a 25/10/2026; minutos dos golos do Relatório do Árbitro n.º 60 (12/11/2026):
  // 48', 72' e 81' (o resultado recebido dizia 53', 76' e 86'). «Zinho» é o
  // Katendi (n.º 2), como no Relatório do Árbitro n.º 55 do FC Luanda–Huíla.
  result: { status: 'finished', homeScore: 2, awayScore: 1, halfTimeScore: '0-0', updatedAt: '2026-10-25T18:05:00+01:00' },
  // Equipa de arbitragem do Relatório do Árbitro n.º 60 (12/11/2026).
  officials: { referee: 'Chitano Domingos Francisco', assistants: ['Wilson Valdmiro Ntyamba', 'Andália Bimbi Francisco Jeremias'], fourth: 'Edson António Esoko', commissioner: 'Manuel Pires Nunda' },
  events: [
    { minute: 48, type: 'goal', team: 'home', player: 'Katendi', number: 2, playerId: 'katendi-huila', detail: '1-0' },
    { minute: 72, type: 'goal', team: 'home', player: 'Angelo Cangu', number: 21, playerId: 'angelo-cangu-huila', detail: '2-0' },
    { minute: 81, type: 'goal', team: 'away', player: 'Amado', number: 18, playerId: 'fifa-1qhqtd1', detail: '2-1' },
  ],
});
