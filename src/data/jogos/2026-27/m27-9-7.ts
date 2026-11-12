// 9.ª jornada · Académica do Lobito–Bravos do Maquis
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-9-7',
  round: 9,
  homeTeamId: 'lobito',
  awayTeamId: 'bravos',
  schedule: { date: '2026-10-31T15:30:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official', source: 'Pedido do Diretor (21/10/2026): 15:00 → 15:30; antes: Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Resultado recebido a 31/10/2026; expulso e marcador do Relatório do Árbitro n.º 67 (12/11/2026).
  result: { status: 'finished', homeScore: 0, awayScore: 1, halfTimeScore: '0-0', updatedAt: '2026-10-31T17:30:00+01:00' },
  // Equipa de arbitragem do Relatório do Árbitro n.º 67 (12/11/2026).
  officials: { referee: 'Aldair Quissanga Rodrigues Carmelino', assistants: ['Nery Domingos Pereira Amador da Silva', 'Januário Simões Francisco'], fourth: 'Nuno Eduardo Sumbo', commissioner: 'José Leopoldo Braga Mavunza' },
  events: [
    { minute: 74, type: 'red', team: 'home', player: 'Isaal Vidal', number: 20, playerId: 'isaal-vidal-lobito', detail: 'Agrediu o adversário com um soco' },
    { minute: 82, type: 'goal', team: 'away', player: 'Lito', number: 23, playerId: 'lito-bravos', detail: '0-1' },
  ],
  // A Académica recebe no Estádio Nacional de Ombaka (indicação de 28/09/2026).
});
