// 15.ª jornada · FC Luanda–Petro de Luanda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-15-7',
  round: 15,
  homeTeamId: 'fcluanda',
  awayTeamId: 'petro',
  // Terça 15/12 → quarta 16/12 (mesma hora e estádio), indicação do Diretor de Competições (Emanuel Valodia, 05/11/2026).
  // Quarta 16/12 → terça 15/12 (grupo DCE, 13:23) → segunda 14/12 (mensagem do Diretor, 16:04), mesma hora, estádio e Zsports: Diretor de Competições DCE/ANCAF (Emanuel Valodia, 18/11/2026).
  schedule: { date: '2026-12-14T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Diretor de Competições DCE/ANCAF (Emanuel Valodia, 18/11/2026, 16:04): dia 14/12 (antes 15/12, grupo DCE 18/11/2026; 16/12, indicação de 05/11/2026); hora, estádio e Zsports: Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas, recebido em 29/10/2026' },
});
