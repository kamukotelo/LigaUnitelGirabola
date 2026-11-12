// 10.ª jornada · Desportivo da Lunda Sul–Wiliete de Benguela
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-10-8',
  round: 10,
  homeTeamId: 'lundasul',
  awayTeamId: 'wiliete',
  schedule: { date: '2026-11-08T15:00:00+01:00', stadium: 'Estádio do Sagrada Esperança', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Equipa de arbitragem enviada pelo gestor a 10/11/2026 (nomes completos das fichas anteriores; «Lídio Coimbra» = Lídio Chicomo Cuimbra).
  // Arbitragem, golos e cartões do Relatório do Árbitro n.º 77 (recebido a 12/11/2026).
  officials: { referee: 'Paulo Sérgio Moreira', assistants: ['Segunda Chisseque Francisco', 'Lídio Chicomo Cuimbra'], fourth: 'Isaías Justino Camaxi', commissioner: 'Rodrigues Aleixo César' },
  // Resultado e marcadores recebidos a 08/11/2026 (captura da app; relatório do árbitro n.º 77 recebido a 12/11/2026).
  result: { status: 'finished', homeScore: 1, awayScore: 2, halfTimeScore: '1-1', updatedAt: '2026-11-08T17:06:00+01:00' },
  events: [
    { minute: 27, type: 'goal', team: 'home', player: 'Joca', number: 27, playerId: 'joca-lunda-sul', detail: '1-0' },
    { minute: 36, type: 'yellow', team: 'home', player: 'Kacusso', number: 12, playerId: 'cacusso', detail: 'Comportamento antidesportivo' },
    { minute: 39, type: 'goal', team: 'away', player: 'Mabululu', number: 9, playerId: 'mabululu-wiliete', detail: '1-1' },
    { minute: 41, type: 'yellow', team: 'home', player: 'Joca', number: 27, playerId: 'joca-lunda-sul', detail: 'Comportamento antidesportivo' },
    { minute: 50, type: 'yellow', team: 'home', player: 'Banana', number: 14, playerId: 'nacavuza-lunda-sul', detail: "45'+5 · Comportamento antidesportivo" },
    { minute: 64, type: 'goal', team: 'away', player: 'Mindinho', number: 10, playerId: 'fifa-1jru7c5', detail: '1-2' },
    { minute: 65, type: 'yellow', team: 'home', player: 'Ricardo Alexandre de Paulo Vieira', detail: 'Oficial de equipa · Divergência por palavras ou atos' },
    { minute: 70, type: 'yellow', team: 'home', player: 'Fredy', number: 5, playerId: 'fred', detail: 'Comportamento antidesportivo' },
    { minute: 70, type: 'yellow', team: 'away', player: 'Wiwi', number: 5, playerId: 'fifa-1jsrpl0', detail: 'Comportamento antidesportivo' },
  ],
});
