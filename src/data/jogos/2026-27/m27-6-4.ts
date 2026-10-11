// 6.ª jornada · FC Luanda–Recreativo do Libolo
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-6-4',
  round: 6,
  homeTeamId: 'fcluanda',
  awayTeamId: 'libolo',
  schedule: { date: '2026-10-11T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', source: 'Mapa final da 6.ª jornada (28/09/2026)' },
  // Resultado recebido a 11/10/2026 (aguarda o relatório do árbitro). «Kaba» e
  // «Robson» não constam dos plantéis do FC Luanda e do Libolo.
  result: { status: 'finished', homeScore: 1, awayScore: 2, halfTimeScore: '0-1', updatedAt: '2026-10-11T17:30:00+01:00' },
  events: [
    { minute: 36, type: 'goal', team: 'away', player: 'Tubarão', number: 30, playerId: 'tubarao-libolo', detail: '0-1' },
    { minute: 80, type: 'goal', team: 'home', player: 'Kaba', detail: '1-1' },
    { minute: 97, type: 'goal', team: 'away', player: 'Robson', detail: "90'+7 · 1-2" },
  ],
  // Nomeação de arbitragem recebida a 11/10/2026.
  officials: { referee: 'Edilson Roberto Gomes André', assistants: ['Manuel Luís Benguela', 'Joaquim Manuel Chiyo'], fourth: 'Bernardo Francisco Moreira' },
});
