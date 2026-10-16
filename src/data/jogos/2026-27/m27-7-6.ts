// 7.ª jornada · FC Cabinda–Académica do Lobito
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-7-6',
  round: 7,
  homeTeamId: 'cabinda',
  awayTeamId: 'lobito',
  // Estádio mudado do França N’dalu para o 22 de Junho a pedido recebido a 15/10/2026
  // (Emanuel Valodia, encaminhado pelo administrador do portal). Data e hora sem alteração.
  schedule: { date: '2026-10-17T15:00:00+01:00', stadium: 'Estádio 22 de Junho', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026); estádio: pedido de 15/10/2026', stadiumException: 'Jogo transferido para o Estádio 22 de Junho (pedido recebido a 15/10/2026)' },
});
