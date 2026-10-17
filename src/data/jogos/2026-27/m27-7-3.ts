// 7.ª jornada · Bravos do Maquis–Desportivo da Lunda Sul
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-7-3',
  round: 7,
  homeTeamId: 'bravos',
  awayTeamId: 'lundasul',
  schedule: { date: '2026-10-17T15:00:00+01:00', stadium: 'Estádio Mundunduleno', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Resultado recebido a 17/10/2026 (aguarda o relatório do árbitro).
  result: { status: 'finished', homeScore: 0, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-10-17T18:30:00+01:00' },
  // Nomeação de arbitragem recebida a 16/10/2026 (nomes completos das fichas anteriores).
  officials: { referee: 'Miguel Tchissingui Augusto Américo', assistants: ['Bernardo Kunjuca Lúcio Serafim', 'Floriano Cawala'], fourth: 'Custódio Roque Lote' },
});
