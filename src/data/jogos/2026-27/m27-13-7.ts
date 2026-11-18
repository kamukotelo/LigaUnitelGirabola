// 13.ª jornada · Desportivo da Huíla–Bravos do Maquis
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-13-7',
  round: 13,
  homeTeamId: 'desphuila',
  awayTeamId: 'bravos',
  // Data domingo 06/12 → sábado 05/12 a pedido do Diretor de Competições DCE/ANCAF (Emanuel Valodia, grupo DCE, 18/11/2026); hora, estádio e transmissão sem alteração.
  schedule: { date: '2026-12-05T15:30:00+01:00', stadium: 'Estádio da Tundavala', scheduleStatus: 'official', source: 'Diretor de Competições DCE/ANCAF (Emanuel Valodia, grupo DCE, 18/11/2026); antes: Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026' },
});
