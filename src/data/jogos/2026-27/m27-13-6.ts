// 13.ª jornada · Desportivo da Lunda Sul–CD 1.º de Agosto
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-13-6',
  round: 13,
  homeTeamId: 'lundasul',
  awayTeamId: 'dago',
  // Data quarta 02/12 → terça 08/12 a pedido do Diretor de Competições DCE/ANCAF (Emanuel Valodia, grupo DCE, 18/11/2026); hora, estádio e transmissão sem alteração.
  schedule: { date: '2026-12-08T15:30:00+01:00', stadium: 'Estádio do Sagrada Esperança', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Diretor de Competições DCE/ANCAF (Emanuel Valodia, grupo DCE, 18/11/2026); antes: Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026' },
});
