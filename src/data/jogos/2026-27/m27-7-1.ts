// 7.ª jornada · Sagrada Esperança–CR Caála
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-7-1',
  round: 7,
  homeTeamId: 'sagrada',
  awayTeamId: 'caala',
  schedule: { date: '2026-10-17T15:00:00+01:00', stadium: 'Estádio do Sagrada Esperança', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Resultado recebido a 17/10/2026 (aguarda o relatório do árbitro). «Ifony» não
  // consta do plantel do CR Caála.
  result: { status: 'finished', homeScore: 1, awayScore: 1, halfTimeScore: '1-0', updatedAt: '2026-10-17T18:30:00+01:00' },
  events: [
    { minute: 21, type: 'goal', team: 'home', player: 'M. Dala', playerId: 'melono-sagrada', detail: '1-0' },
    { minute: 85, type: 'goal', team: 'away', player: 'Ifony', detail: '1-1' },
  ],
  // Nomeação de arbitragem recebida a 16/10/2026 (nomes completos das fichas anteriores).
  officials: { referee: 'Paulo Sérgio Moreira', assistants: ['Segunda Chisseque Francisco', 'Lídio Chicomo Cuimbra'], fourth: 'Isaías Justino Camaxi' },
});
