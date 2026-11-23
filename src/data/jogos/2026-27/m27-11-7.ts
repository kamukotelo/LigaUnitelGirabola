// 11.ª jornada · Wiliete de Benguela–Sagrada Esperança
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-11-7',
  round: 11,
  homeTeamId: 'wiliete',
  awayTeamId: 'sagrada',
  schedule: { date: '2026-11-22T17:30:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026; horário corrigido para 17:30 por indicação de Nsungu Kamukotelo em 16/11/2026' },
  // Nomeação de árbitros, jogo n.º 88 (mensagem enviada pelo utilizador, 19/11/2026); nomes completos dos registos anteriores.
  officials: { referee: 'Sanda Mateus Miguel Kitu', assistants: ['Natarino António Soares', 'Nelson Lutumba Quiala'], fourth: 'Edilson Roberto Gomes André' },
  // Resultado e marcadores: Sofascore, enviado pelo utilizador a 23/11/2026 (01:58): 3-2, intervalo 2-1.
  // Substitui a captura anterior (22/11, 19:36: 3-1, penálti atribuído ao Dabanda). «João Diogo» = Julinho (#29).
  // Buba Jammeh (#14) continua sem página de jogador. Aguarda o relatório do árbitro.
  result: { status: 'finished', homeScore: 3, awayScore: 2, halfTimeScore: '2-1', updatedAt: '2026-11-23T01:58:00+01:00' },
  events: [
    { minute: 22, type: 'goal', team: 'away', player: 'Melono Dala', number: 11, playerId: 'melono-sagrada', detail: 'Grande penalidade · 0-1' },
    { minute: 24, type: 'goal', team: 'home', player: 'Júnior Goiano', number: 27, playerId: 'fifa-1pnmj53', detail: '1-1' },
    { minute: 44, type: 'goal', team: 'home', player: 'Julinho', number: 29, playerId: 'julinho-wiliete', detail: '2-1' },
    { minute: 47, type: 'goal', team: 'home', player: 'Buba Jammeh', number: 14, detail: '3-1' },
    { minute: 69, type: 'goal', team: 'away', player: 'Dabanda', number: 7, playerId: 'dabanda-sagrada', detail: '3-2' },
  ],
});
