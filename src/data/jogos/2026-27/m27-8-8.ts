// 8.ª jornada · FC Cabinda–Kabuscorp SC
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-8-8',
  round: 8,
  homeTeamId: 'cabinda',
  awayTeamId: 'kabuscorp',
  // Comunicado Oficial 013-DCE/ANCAF/2026 (26/10/2026): adiado por força maior (regresso do
  // Kabuscorp da Taça CAF) e remarcado para 04/11, mesmo horário, em estádio a designar
  // pelo FC Cabinda. O comunicado refere o jogo como agendado para 27/10 (o portal tinha
  // 28/10 por pedido do Diretor de 21/10).
  schedule: { date: '2026-11-04T15:00:00+01:00', stadium: 'Estádio a anunciar', stadiumPending: true, scheduleStatus: 'official', source: 'Comunicado Oficial 013-DCE/ANCAF/2026 (26/10/2026): remarcado para 04/11, mesmo horário, estádio a designar pelo FC Cabinda' },
});
