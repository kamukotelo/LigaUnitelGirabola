// 14.ª jornada · Petro de Luanda–Desportivo da Huíla
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-14-6',
  round: 14,
  homeTeamId: 'petro',
  awayTeamId: 'desphuila',
  // Antecipado da 14.ª jornada (12/12) a pedido do Diretor de Competições: 04/11 às 17:30
  // (26/10/2026) e depois terça, 03/11, às 17:00 (26/10/2026, Emanuel Valodia).
  schedule: {
    date: '2026-11-03T17:00:00+01:00',
    stadium: 'Estádio 11 de Novembro',
    scheduleStatus: 'official',
    source: 'Pedido do Diretor de Competições (26/10/2026): terça, 03/11, 17:00; publicação autorizada pelo administrador sem comunicado.',
  },
});
