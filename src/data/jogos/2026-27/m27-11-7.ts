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
  // Resultado e marcadores: captura da Sofascore enviada pelo utilizador (22/11/2026, 19:36): 3-1, intervalo 2-1.
  // «J. Goiano» = Júnior Goiano (#27), «João Diogo» = Julinho (#29), Dabanda (#7, Sagrada, penálti). Buba Jammeh (#14)
  // continua sem página de jogador.
  result: { status: 'finished', homeScore: 3, awayScore: 1, halfTimeScore: '2-1', updatedAt: '2026-11-22T19:36:00+01:00' },
  events: [
    { minute: 24, type: 'goal', team: 'away', player: 'Dabanda', number: 7, playerId: 'dabanda-sagrada', detail: 'Grande penalidade · 0-1' },
    { minute: 25, type: 'goal', team: 'home', player: 'Júnior Goiano', number: 27, playerId: 'fifa-1pnmj53', detail: '1-1' },
    { minute: 44, type: 'goal', team: 'home', player: 'Julinho', number: 29, playerId: 'julinho-wiliete', detail: '2-1' },
    { minute: 48, type: 'goal', team: 'home', player: 'Buba Jammeh', number: 14, detail: '3-1' },
  ],
});
