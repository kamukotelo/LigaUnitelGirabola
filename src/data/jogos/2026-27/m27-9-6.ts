// 9.ª jornada · Estrela 1.º de Maio–FC Luanda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-9-6',
  round: 9,
  homeTeamId: 'primeiromaio',
  awayTeamId: 'fcluanda',
  schedule: { date: '2026-11-01T15:30:00+01:00', stadium: 'Estádio Municipal de Benguela', scheduleStatus: 'official', source: 'DCE/ANCAF, 05/10/2026: sem transmissão televisiva (Rádio 5)' },
  // Resultado recebido a 01/11/2026 (aguarda o relatório do árbitro). Os golos dos 64' («Domingos dos
  // Santos») e 66' («Francisco Armando») ficam sem jogador: os nomes não constam dos plantéis inscritos.
  result: { status: 'finished', homeScore: 2, awayScore: 1, halfTimeScore: '1-0', updatedAt: '2026-11-01T19:28:00+01:00' },
  events: [
    { minute: 9, type: 'goal', team: 'home', player: 'Odenir', number: 14, playerId: 'fifa-1mqvbd5', detail: '1-0' },
    { minute: 64, type: 'goal', team: 'home', player: '', detail: '2-0' },
    { minute: 66, type: 'goal', team: 'away', player: '', detail: '2-1' },
  ],
  // Estádio da lista oficial de estádios das equipas (28/09/2026).
});
