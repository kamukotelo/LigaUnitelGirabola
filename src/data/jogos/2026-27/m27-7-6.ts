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
  // Resultado recebido a 17/10/2026 (aguarda o relatório do árbitro).
  result: { status: 'finished', homeScore: 0, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-10-17T18:30:00+01:00' },
  // Nomeação de arbitragem recebida a 16/10/2026 (nomes completos das fichas anteriores).
  officials: { referee: 'Nelson João Milagre', assistants: ['Manuel Daniel Coelho', 'Hélder João Milagre'], fourth: 'Alberto Henrique F. Bartolomeu' },
});
