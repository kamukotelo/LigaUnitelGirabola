// 3.ª jornada · Sagrada Esperança–Kabuscorp SC
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-3-3',
  round: 3,
  homeTeamId: 'sagrada',
  awayTeamId: 'kabuscorp',
  schedule: { date: '2026-10-07T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', source: 'Cartaz oficial do jogo adiado da 3.ª jornada, recebido a 29/09/2026', stadiumException: 'Jogo adiado da 3.ª jornada remarcado para Luanda, Estádio França N’dalu (29/09/2026)', fieldInversionNote: true },
  // Resultado recebido a 07/10/2026 (aguarda o relatório do árbitro).
  result: { status: 'finished', homeScore: 1, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-10-07T17:47:00+01:00' },
  // Nomeação de arbitragem recebida a 06/10/2026.
  officials: { referee: 'Edilson André', assistants: ['Joaquim Chiyo', 'Domingos Francisco'], fourth: 'Sabino de Carvalho' },
  events: [
    { minute: 77, type: 'goal', team: 'home', player: 'M. Dala', playerId: 'melono-sagrada', detail: '1-0' },
  ],
});
