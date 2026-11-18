// 12.ª jornada · Bravos do Maquis–Wiliete de Benguela
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-12-6',
  round: 12,
  homeTeamId: 'bravos',
  awayTeamId: 'wiliete',
  // Data 25/11 → 09/12 (quarta) e Estádio Mundunduleno → Estádio Nacional de Ombaka a pedido do Diretor de Competições DCE/ANCAF (Emanuel Valodia, grupo DCE, 18/11/2026); hora sem alteração.
  schedule: { date: '2026-12-09T15:00:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official', source: 'Diretor de Competições DCE/ANCAF (Emanuel Valodia, grupo DCE, 18/11/2026); antes: Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026', stadiumException: 'Jogo do Bravos do Maquis no Estádio Nacional de Ombaka (Benguela) em vez do Estádio Mundunduleno, a pedido do Diretor de Competições DCE/ANCAF (Emanuel Valodia, grupo DCE, 18/11/2026)' },
});
