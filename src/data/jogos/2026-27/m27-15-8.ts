// 15.ª jornada · Bravos do Maquis–CD 1.º de Agosto
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-15-8',
  round: 15,
  homeTeamId: 'bravos',
  awayTeamId: 'dago',
  // Estádio Mundunduleno → Estádio França N’dalu a pedido do Diretor de Competições DCE/ANCAF (Emanuel Valodia, grupo DCE, 18/11/2026, 16:36); data, hora e transmissão sem alteração.
  // Quadro «Inversão do campo» a pedido do Diretor de Competições DCE/ANCAF (Emanuel Valodia, grupo DCE, 18/11/2026, 16:38–16:43):
  // «os dois jogos serão em Estádios da equipa adversária».
  schedule: { date: '2026-12-15T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Diretor de Competições DCE/ANCAF (Emanuel Valodia, grupo DCE, 18/11/2026, 16:36): Estádio França N’dalu; data, hora e Zsports: Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026', stadiumException: 'Jogo do Bravos do Maquis no Estádio França N’dalu (Luanda) em vez do Estádio Mundunduleno, a pedido do Diretor de Competições DCE/ANCAF (Emanuel Valodia, grupo DCE, 18/11/2026, 16:36)', fieldInversionNote: true },
});
