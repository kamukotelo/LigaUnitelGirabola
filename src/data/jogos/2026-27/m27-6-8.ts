// 6.ª jornada · Kabuscorp SC–Wiliete de Benguela
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-6-8',
  round: 6,
  homeTeamId: 'kabuscorp',
  awayTeamId: 'wiliete',
  schedule: { date: '2026-10-10T17:00:00+01:00', stadium: 'Estádio 11 de Novembro', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa final da 6.ª jornada (28/09/2026)', stadiumException: 'Mapa final da 6.ª jornada (28/09/2026) marca o jogo no Estádio 11 de Novembro' },
  // Mapa da 6.ª jornada enviado a 28/09/2026: este jogo realiza-se no Estádio 11 de Novembro, e não no
  // Estádio 22 de Junho habitual do Kabuscorp.
});
