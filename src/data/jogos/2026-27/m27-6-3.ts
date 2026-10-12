// 6.ª jornada · Estrela 1.º de Maio–Bravos do Maquis
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-6-3',
  round: 6,
  homeTeamId: 'primeiromaio',
  awayTeamId: 'bravos',
  schedule: { date: '2026-10-11T15:30:00+01:00', stadium: 'Estádio Municipal de Benguela', scheduleStatus: 'official', source: 'Mapa final da 6.ª jornada (28/09/2026)' },
  // Nomeação de arbitragem recebida a 11/10/2026.
  officials: { referee: 'Ailton Jeovane Quissanga Carmelino', assistants: ['Ivanildo Meireles de Oliveira Sanches Lopes', 'Nery Domingos Pereira Amador da Silva'], fourth: 'Nuno Eduardo Sumbo' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (11/10/2026).
  // Posições e ligações ao plantel só onde fichas anteriores as confirmam.
  coaches: { home: 'Mavi Lopes', away: 'Sandro Mendes' },
  lineups: {
    home: [
      { name: 'Super', number: 1, position: 'GK', isStarter: true },
      { name: 'Márcio', number: 7, position: 'DEF', isStarter: true, playerId: 'fifa-1jyn4k6' },
      { name: 'Moisés', number: 5, position: 'DEF', isStarter: true, playerId: 'moises-primeiromaio' },
      { name: 'Bicho', number: 6, position: 'MID', isStarter: true },
      { name: 'Messi', number: 10, isStarter: true },
      { name: 'Deninho', number: 14, position: 'MID', isStarter: true, playerId: 'deninho-maio' },
      { name: 'Dalton', number: 23, isStarter: true },
      { name: 'Edú', number: 26, isStarter: true },
      { name: 'Cláudio', number: 30, isStarter: true },
      { name: 'Ngala', number: 33, position: 'DEF', isStarter: true, playerId: 'fifa-1nb49x0' },
      { name: 'Messito', number: 34, position: 'MID', isStarter: true },
      { name: 'Kanhi', number: 56, position: 'GK', isStarter: false, playerId: 'fifa-1nb4dq1' },
      { name: 'Damimi', number: 4, isStarter: false },
      { name: 'Deco', number: 9, position: 'FWD', isStarter: false, playerId: 'fifa-1jsrcp9' },
      { name: 'Nixon', number: 11, isStarter: false },
      { name: 'Amor', number: 13, isStarter: false },
      { name: 'Muila', number: 16, position: 'MID', isStarter: false, playerId: 'fifa-1k2pey7' },
      { name: 'Marquinhos', number: 17, isStarter: false },
      { name: 'Tchutchu', number: 22, position: 'MID', isStarter: false },
      { name: 'Kimmich', number: 37, isStarter: false },
    ],
    away: [
      { name: 'Nathan', number: 22, position: 'GK', isStarter: true, playerId: 'nathan-bravos' },
      { name: 'Higino', number: 10, position: 'MID', isStarter: true, playerId: 'higino-bravos' },
      { name: 'Denilson', number: 2, position: 'DEF', isStarter: true, playerId: 'denilson-bravos' },
      { name: 'Abrão', number: 6, position: 'MID', isStarter: true, playerId: 'abrao-bravos' },
      { name: 'Ju Cabral', number: 8, position: 'MID', isStarter: true, playerId: 'ju-cabral-bravos' },
      { name: 'Tiago', number: 15, position: 'FWD', isStarter: true, playerId: 'tiago-bravos' },
      { name: 'Lopes', number: 18, isStarter: true },
      { name: 'André', number: 21, isStarter: true },
      { name: 'Lito', number: 23, position: 'FWD', isStarter: true, playerId: 'lito-bravos' },
      { name: 'Caprego', number: 24, position: 'DEF', isStarter: true, playerId: 'caprego-bravos' },
      { name: 'Tony', number: 25, position: 'MID', isStarter: true, playerId: 'tony-bravos' },
      { name: 'Saidy', number: 12, position: 'GK', isStarter: false, playerId: 'saidi-bravos' },
      { name: 'Caiser', number: 5, isStarter: false },
      { name: 'Lizandro', number: 14, isStarter: false },
      { name: 'Osah', number: 16, isStarter: false, playerId: 'fifa-1mrrs47' },
      { name: 'Manico', number: 26, position: 'DEF', isStarter: false, playerId: 'manico-bravos' },
      { name: 'Dabanda', number: 27, position: 'DEF', isStarter: false, playerId: 'dabanda-bravos' },
      { name: 'Gladilson', number: 28, position: 'FWD', isStarter: false, playerId: 'gladilson-bravos' },
      { name: 'Milson', number: 29, isStarter: false },
      { name: 'Bani', number: 31, position: 'FWD', isStarter: false, playerId: 'bani-bravos' },
    ],
  },
  // Resultado recebido a 11/10/2026 (aguarda o relatório do árbitro). O golo dos 22'
  // é do n.º 30 «Cláudio» do onze inicial; «Jesus Cristo» não consta da convocatória
  // nem do plantel do 1.º de Maio (ver também m27-5-5 55').
  result: { status: 'finished', homeScore: 2, awayScore: 2, halfTimeScore: '1-1', updatedAt: '2026-10-11T17:25:00+01:00' },
  events: [
    { minute: 13, type: 'goal', team: 'away', player: 'Ngala', number: 33, playerId: 'fifa-1nb49x0', ownGoal: true, detail: 'Autogolo · 0-1' },
    { minute: 22, type: 'goal', team: 'home', player: 'Cláudio Sozinho', number: 30, detail: '1-1' },
    { minute: 57, type: 'goal', team: 'away', player: 'Fota', number: 15, playerId: 'tiago-bravos', detail: '1-2' },
    { minute: 94, type: 'goal', team: 'home', player: 'Jesus Cristo', detail: "90'+4 · 2-2" },
  ],
  // Estádio da lista oficial de estádios das equipas (28/09/2026).
});
