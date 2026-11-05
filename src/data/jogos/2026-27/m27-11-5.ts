// 11.ª jornada · FC Cabinda–Bravos do Maquis
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-11-5',
  round: 11,
  homeTeamId: 'cabinda',
  awayTeamId: 'bravos',
  // Domingo 22/11 15:00 → sábado 21/11 15:00, indicação do Diretor de Competições (Emanuel Valodia, 05/11/2026).
  // Estádio França N’dalu → Estádio do Tafe, novo estádio da casa do FC Cabinda (DCE/ANCAF, 05/11/2026).
  schedule: { date: '2026-11-21T15:00:00+01:00', stadium: 'Estádio do Tafe', scheduleStatus: 'official', source: 'Diretor de Competições DCE/ANCAF (Emanuel Valodia, 05/11/2026): sábado 21/11, 15:00; Estádio do Tafe: DCE/ANCAF, 05/11/2026; antes: Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas, recebido em 29/10/2026' },
});
