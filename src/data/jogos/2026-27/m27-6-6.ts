// 6.ª jornada · Desportivo da Huíla–São Salvador
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-6-6',
  round: 6,
  homeTeamId: 'desphuila',
  awayTeamId: 'saosalvador',
  schedule: { date: '2026-10-11T15:30:00+01:00', stadium: 'Estádio da Tundavala', scheduleStatus: 'official', source: 'DCE/ANCAF, 05/10/2026: domingo, 11/10, 15:30' },
  // Nomeação de arbitragem recebida a 11/10/2026.
  officials: { referee: 'Miguel Tchissingui Augusto Américo', assistants: ['Bernardo Kunjuca Lúcio Serafim', 'Floriano Cawala'], fourth: 'Bernardo Hossi Nangolo' },
});
