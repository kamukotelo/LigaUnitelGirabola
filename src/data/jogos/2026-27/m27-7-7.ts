// 7.ª jornada · São Salvador–Estrela 1.º de Maio
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-7-7',
  round: 7,
  homeTeamId: 'saosalvador',
  awayTeamId: 'primeiromaio',
  schedule: { date: '2026-10-18T15:00:00+01:00', stadium: 'Estádio Álvaro Buta', scheduleStatus: 'official' },
  // O mapa final da ANCAF (28/09/2026) escreve «Domingo, 17/10», mas 17/10 é
  // sábado; a data confirmada é domingo, 18/10.
});
