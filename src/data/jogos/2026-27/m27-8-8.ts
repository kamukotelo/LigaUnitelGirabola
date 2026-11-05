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
  // Data 04/11 → 15/11 a pedido do Diretor de Competições (03/11/2026, Emanuel Valodia); hora e estádio sem alteração.
  // Estádio a anunciar → Estádio do Tafe, novo estádio da casa do FC Cabinda (DCE/ANCAF, 05/11/2026).
  schedule: { date: '2026-11-15T15:00:00+01:00', stadium: 'Estádio do Tafe', scheduleStatus: 'official', source: 'Estádio do Tafe: Diretor de Competições DCE/ANCAF (Emanuel Valodia, 05/11/2026); Comunicado Oficial 013-DCE/ANCAF/2026 (26/10/2026): estádio a designar pelo FC Cabinda; data: pedido do Diretor de Competições (03/11/2026), 15/11, 15:00' },
});
