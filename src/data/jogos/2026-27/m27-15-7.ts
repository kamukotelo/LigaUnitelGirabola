// 15.ª jornada · FC Luanda–Petro de Luanda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-15-7',
  round: 15,
  homeTeamId: 'fcluanda',
  awayTeamId: 'petro',
  // Terça 15/12 → quarta 16/12 (mesma hora e estádio), indicação do Diretor de Competições (Emanuel Valodia, 05/11/2026).
  schedule: { date: '2026-12-16T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Diretor de Competições DCE/ANCAF (Emanuel Valodia, 05/11/2026): dia 16/12; hora, estádio e Zsports: Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas, recebido em 29/10/2026' },
});
