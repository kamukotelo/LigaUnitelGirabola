// 11.ª jornada · Kabuscorp SC–FC Luanda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-11-6',
  round: 11,
  homeTeamId: 'kabuscorp',
  awayTeamId: 'fcluanda',
  // Estádio 22 de Junho → Estádio França N’dalu, indicação no grupo DCE/ANCAF (05/11/2026, 15:35).
  // Data, hora e transmissão mantêm-se (domingo 22/11, 15:30, Zsports).
  schedule: { date: '2026-11-22T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Grupo DCE/ANCAF (05/11/2026): Estádio França N’dalu; antes: Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026', stadiumException: 'Indicação DCE/ANCAF de 05/11/2026: jogo no Estádio França N’dalu, e não no Estádio 22 de Junho habitual do Kabuscorp' },
});
