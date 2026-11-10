// 7.ª jornada · CD 1.º de Agosto–Wiliete de Benguela
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-7-4',
  round: 7,
  homeTeamId: 'dago',
  awayTeamId: 'wiliete',
  schedule: { date: '2026-11-04T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Comunicado Oficial 011-DCE/ANCAF/2026 (07/10/2026): adiado para 04/11, mesmo estádio e horário' },
  // Resultado final da Liga Unitel Girabola recebido a 04/11/2026 (aguarda o relatório do árbitro);
  // sem resultado ao intervalo.
  result: { status: 'finished', homeScore: 0, awayScore: 0, updatedAt: '2026-11-04T19:21:00+01:00' },
  // Substituições e amarelos do 1.º de Agosto recebidos a 10/11/2026 (Futebol Total; aguardam o relatório do árbitro).
  // Sem escalação publicada: jogadores ligados ao plantel pelo nome e camisola dos jogos anteriores.
  events: [
    { minute: 65, type: 'yellow', team: 'home', player: 'Paxe', number: 19, playerId: 'fifa-1pxu511' },
    { minute: 71, type: 'sub', team: 'home', player: 'Mabelé', number: 3, playerId: 'simao-dianzenza', playerOut: 'Paxe' },
    { minute: 71, type: 'sub', team: 'home', player: 'Félix Bulaya', number: 28, playerId: 'bulaya-dago', playerOut: 'Aspirina' },
    { minute: 71, type: 'sub', team: 'home', player: 'Rupson', number: 9, playerId: 'rupson-dago', playerOut: 'Axel' },
    { minute: 75, type: 'yellow', team: 'home', player: 'Mabelé', number: 3, playerId: 'simao-dianzenza' },
    { minute: 78, type: 'sub', team: 'home', player: 'Tombé', number: 20, playerId: 'tombe-dago', playerOut: 'Fernando' },
    { minute: 80, type: 'yellow', team: 'home', player: 'Dago', number: 17, playerId: 'dago-tshibamba' },
    { minute: 86, type: 'yellow', team: 'home', player: 'Tombé', number: 20, playerId: 'tombe-dago' },
  ],
});
