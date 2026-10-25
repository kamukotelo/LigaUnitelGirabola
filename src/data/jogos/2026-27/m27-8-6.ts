// 8.ª jornada · Desportivo da Lunda Sul–GD Interclube
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-8-6',
  round: 8,
  homeTeamId: 'lundasul',
  awayTeamId: 'interclube',
  schedule: { date: '2026-10-25T15:00:00+01:00', stadium: 'Estádio do Sagrada Esperança', scheduleStatus: 'official', source: 'DCE/ANCAF, 05/10/2026: sem transmissão televisiva (Rádio 5)' },
  // Resultado recebido a 25/10/2026 (aguarda o relatório do árbitro). «Jack» (n.º 32)
  // ainda sem ficha no plantel da Lunda Sul.
  result: { status: 'finished', homeScore: 3, awayScore: 1, halfTimeScore: '0-1', updatedAt: '2026-10-25T18:05:00+01:00' },
  events: [
    { minute: 41, type: 'goal', team: 'away', player: 'Boiado', number: 30, playerId: 'fifa-1jzyk44', detail: '0-1' },
    { minute: 48, type: 'goal', team: 'home', player: 'Jepson', number: 17, playerId: 'jepson', detail: '1-1' },
    { minute: 51, type: 'goal', team: 'home', player: 'Mussá', number: 20, playerId: 'mussa-lunda-sul', detail: '2-1' },
    { minute: 94, type: 'goal', team: 'home', player: 'Jack', number: 32, detail: "90'+4 · 3-1" },
  ],
  // Equipa de arbitragem do «Lineup Geral» oficial (25/10/2026; nomes completos das fichas anteriores).
  officials: { referee: 'Sabino Garcez de Sousa de Carvalho', assistants: ['João Manuel Fula António', 'Evandro Henrique Freitas da Rocha'], fourth: 'Sanda Mateus Miguel Kitu' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (25/10/2026).
  coaches: { home: 'Maurílio Silva', away: 'Divaldo Alves' },
  lineups: {
    home: [
      { name: 'Kacusso', number: 12, position: 'GK', isStarter: true, playerId: 'cacusso' },
      { name: 'P. Agostinho', number: 30, isStarter: true, playerId: 'fifa-1k2wai2' },
      { name: 'Hanilton', number: 3, isStarter: true, playerId: 'fifa-1k1k2v2' },
      { name: 'Fredy', number: 5, position: 'DEF', isStarter: true, playerId: 'fred' },
      { name: 'Platini', number: 6, position: 'MID', isStarter: true, playerId: 'platini' },
      { name: 'Maranata', number: 10, position: 'MID', isStarter: true, playerId: 'maranata' },
      { name: 'Jepson', number: 17, position: 'FWD', isStarter: true, playerId: 'jepson' },
      { name: 'Manucho', number: 19, position: 'FWD', isStarter: true, playerId: 'manucho-lunda-sul' },
      { name: 'Mussá', number: 20, position: 'FWD', isStarter: true, playerId: 'mussa-lunda-sul' },
      { name: 'Sozito', number: 26, position: 'DEF', isStarter: true, playerId: 'sozito' },
      { name: 'Joca', number: 27, position: 'FWD', isStarter: true, playerId: 'joca-lunda-sul' },
      { name: 'Gaspar', number: 1, position: 'GK', isStarter: false },
      { name: 'Yuri', number: 4, position: 'DEF', isStarter: false, playerId: 'yuri' },
      { name: 'Neymar', number: 7, position: 'FWD', isStarter: false, playerId: 'neymar-lunda-sul' },
      { name: 'Magrinho', number: 11, position: 'FWD', isStarter: false, playerId: 'magrinho' },
      { name: 'Ximba', number: 16, position: 'MID', isStarter: false, playerId: 'ximba' },
      { name: 'Kibuata', number: 28, position: 'DEF', isStarter: false, playerId: 'kibuata' },
      { name: 'Jack', number: 32, isStarter: false },
      { name: 'Caluvili', number: 33, position: 'MID', isStarter: false, playerId: 'zonzo' },
      { name: 'Fuca', number: 35, position: 'FWD', isStarter: false, playerId: 'fuca' },
    ],
    away: [
      { name: 'Rui', number: 22, position: 'GK', isStarter: true, playerId: 'fifa-1jtvf71' },
      { name: 'Lionel', number: 2, position: 'DEF', isStarter: true, playerId: 'fifa-1pny691' },
      { name: 'Salomão', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1jtv4k9' },
      { name: 'Peter Lwasa', number: 11, isStarter: true, playerId: 'peter-lwasa-interclube' },
      { name: 'Alcides', number: 14, position: 'MID', isStarter: true, playerId: 'fifa-1kz4cq5' },
      { name: 'Jhonatan', number: 19, isStarter: true, playerId: 'jhonatan-interclube' },
      { name: 'Nandinho', number: 25, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrqx5' },
      { name: 'Toy', number: 26, position: 'DEF', isStarter: true, playerId: 'fifa-1t9mip7' },
      { name: 'Moisés', number: 28, position: 'DEF', isStarter: true, playerId: 'fifa-1lzlzp0' },
      { name: 'Betinho', number: 29, position: 'FWD', isStarter: true, playerId: 'fifa-1k0sa99' },
      { name: 'Boiado', number: 30, position: 'FWD', isStarter: true, playerId: 'fifa-1jzyk44' },
      { name: 'Panzo', number: 12, position: 'GK', isStarter: false, playerId: 'fifa-1jz6pv1' },
      { name: 'Anderson', number: 17, position: 'MID', isStarter: false, playerId: 'fifa-1muazf5' },
      { name: 'Jamanta', number: 18, position: 'DEF', isStarter: false, playerId: 'fifa-1jtuys4' },
      { name: 'Beny', number: 27, position: 'DEF', isStarter: false, playerId: 'fifa-1k1ket3' },
      { name: 'Caneta', number: 32, position: 'MID', isStarter: false, playerId: 'fifa-1k26vw6' },
      { name: 'Paulo Gaspar', number: 33, position: 'DEF', isStarter: false, playerId: 'fifa-1m92d85' },
      { name: 'Jonas', number: 35, position: 'FWD', isStarter: false, playerId: 'fifa-1nw4p04' },
      { name: 'Afonso', number: 36, position: 'FWD', isStarter: false, playerId: 'fifa-1ni2dp9' },
      { name: 'Sandro', number: 37, position: 'MID', isStarter: false, playerId: 'fifa-1jrkqx3' },
    ],
  },
});
