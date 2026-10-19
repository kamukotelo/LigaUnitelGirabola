// 7.ª jornada · Bravos do Maquis–Desportivo da Lunda Sul
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-7-3',
  round: 7,
  homeTeamId: 'bravos',
  awayTeamId: 'lundasul',
  schedule: { date: '2026-10-17T15:00:00+01:00', stadium: 'Estádio Mundunduleno', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Resultado recebido a 17/10/2026 (aguarda o relatório do árbitro).
  result: { status: 'finished', homeScore: 0, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-10-17T18:30:00+01:00' },
  // Nomeação de arbitragem recebida a 16/10/2026 (nomes completos das fichas anteriores).
  officials: { referee: 'Miguel Tchissingui Augusto Américo', assistants: ['Bernardo Kunjuca Lúcio Serafim', 'Floriano Cawala'], fourth: 'Custódio Roque Lote' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (17/10/2026).
  // Ligações ao plantel onde fichas anteriores confirmam o jogador («Danilson», «Abraão»,
  // «Toni» e «Caluvili» são grafias das fichas anteriores). Nesta ficha Platini tem o n.º 5
  // e Fredy o n.º 6 (trocados em relação às fichas anteriores).
  coaches: { home: 'Sandro Mendes', away: 'Maurílio Silva' },
  lineups: {
    home: [
      { name: 'Nathan', number: 22, position: 'GK', isStarter: true, playerId: 'nathan-bravos' },
      { name: 'Manico', number: 26, position: 'DEF', isStarter: true, playerId: 'manico-bravos' },
      { name: 'Danilson', number: 2, position: 'DEF', isStarter: true, playerId: 'denilson-bravos' },
      { name: 'Caiser', number: 5, isStarter: true },
      { name: 'Abraão', number: 6, position: 'MID', isStarter: true, playerId: 'abrao-bravos' },
      { name: 'Jú Cabral', number: 8, position: 'MID', isStarter: true, playerId: 'ju-cabral-bravos' },
      { name: 'Higino', number: 10, position: 'MID', isStarter: true, playerId: 'higino-bravos' },
      { name: 'Tiago', number: 15, position: 'FWD', isStarter: true, playerId: 'tiago-bravos' },
      { name: 'Lopes', number: 18, isStarter: true },
      { name: 'André', number: 21, isStarter: true },
      { name: 'Lito', number: 23, position: 'FWD', isStarter: true, playerId: 'lito-bravos' },
      { name: 'Saidy', number: 12, position: 'GK', isStarter: false, playerId: 'saidi-bravos' },
      { name: 'Lizandro', number: 14, isStarter: false },
      { name: 'Osah', number: 16, isStarter: false, playerId: 'fifa-1mrrs47' },
      { name: 'Eduwine', number: 17, position: 'FWD', isStarter: false, playerId: 'eduwine-bravos' },
      { name: 'Jorginho', number: 19, position: 'FWD', isStarter: false, playerId: 'jorginho-bravos' },
      { name: 'Buchinho', number: 20, isStarter: false },
      { name: 'Toni', number: 25, position: 'MID', isStarter: false, playerId: 'tony-bravos' },
      { name: 'Dabanda', number: 27, position: 'DEF', isStarter: false, playerId: 'dabanda-bravos' },
      { name: 'Milson', number: 29, isStarter: false },
    ],
    away: [
      { name: 'Kacusso', number: 12, position: 'GK', isStarter: true, playerId: 'cacusso' },
      { name: 'Mussá', number: 20, position: 'FWD', isStarter: true, playerId: 'mussa-lunda-sul' },
      { name: 'Platini', number: 5, position: 'MID', isStarter: true, playerId: 'platini' },
      { name: 'Fredy', number: 6, position: 'DEF', isStarter: true, playerId: 'fred' },
      { name: 'Maranata', number: 10, position: 'MID', isStarter: true, playerId: 'maranata' },
      { name: 'Ximba', number: 16, position: 'MID', isStarter: true, playerId: 'ximba' },
      { name: 'Jepson', number: 17, position: 'FWD', isStarter: true, playerId: 'jepson' },
      { name: 'Manucho', number: 19, position: 'FWD', isStarter: true, playerId: 'manucho-lunda-sul' },
      { name: 'Dieu', number: 25, position: 'DEF', isStarter: true, playerId: 'dieu' },
      { name: 'Sozito', number: 26, position: 'DEF', isStarter: true, playerId: 'sozito' },
      { name: 'Joca', number: 27, position: 'FWD', isStarter: true, playerId: 'joca-lunda-sul' },
      { name: 'Gaspar', number: 1, position: 'GK', isStarter: false },
      { name: 'Nonó', number: 2, position: 'DEF', isStarter: false, playerId: 'nono' },
      { name: 'Vado', number: 8, position: 'MID', isStarter: false, playerId: 'vado-lunda-sul' },
      { name: 'Magrinho', number: 11, position: 'FWD', isStarter: false, playerId: 'magrinho' },
      { name: 'Banana', number: 14, isStarter: false },
      { name: 'Kibuata', number: 28, position: 'DEF', isStarter: false, playerId: 'kibuata' },
      { name: 'Jack', number: 32, isStarter: false },
      { name: 'Caluvili', number: 33, position: 'MID', isStarter: false, playerId: 'zonzo' },
      { name: 'Fuca', number: 35, position: 'FWD', isStarter: false, playerId: 'fuca' },
    ],
  },
});
