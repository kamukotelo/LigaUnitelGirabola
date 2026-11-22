// 11.ª jornada · Desportivo da Lunda Sul–Desportivo da Huíla
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-11-8',
  round: 11,
  homeTeamId: 'lundasul',
  awayTeamId: 'desphuila',
  schedule: { date: '2026-11-22T15:00:00+01:00', stadium: 'Estádio do Sagrada Esperança', scheduleStatus: 'official', source: 'Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026' },
  // Nomeação de árbitros, jogo n.º 85 (mensagem enviada pelo utilizador, 19/11/2026); nomes completos dos registos anteriores.
  officials: { referee: 'Nelson Agostinho da Silva', assistants: ['Domingos Jacinto Francisco Ferreira', 'Lourenço Manuel João'], fourth: 'Isaías Justino Camaxi' },
  // Resultado e marcador: captura da Sofascore enviada pelo utilizador (22/11/2026, 17:20): 1-0, intervalo 0-0,
  // Kibuata 61' (#28 do Lunda Sul nas fichas anteriores). A captura mostra vermelhos (Ndulo 31', Huíla; outro aos 90'),
  // mas cartões de capturas não entram: aguardar o Relatório do Árbitro (FCMS).
  result: { status: 'finished', homeScore: 1, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-11-22T17:20:00+01:00' },
  events: [
    { minute: 61, type: 'goal', team: 'home', player: 'Kibuata', number: 28, playerId: 'kibuata', detail: '1-0' },
  ],
});
