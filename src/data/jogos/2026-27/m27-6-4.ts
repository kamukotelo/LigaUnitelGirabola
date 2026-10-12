// 6.ª jornada · FC Luanda–Recreativo do Libolo
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-6-4',
  round: 6,
  homeTeamId: 'fcluanda',
  awayTeamId: 'libolo',
  schedule: { date: '2026-10-11T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', source: 'Mapa final da 6.ª jornada (28/09/2026)' },
  // Resultado recebido a 11/10/2026 (aguarda o relatório do árbitro). «Kaba» não
  // consta do plantel nem da convocatória do FC Luanda; «Robson» é o n.º 9 suplente
  // do Libolo na convocatória.
  result: { status: 'finished', homeScore: 1, awayScore: 2, halfTimeScore: '0-1', updatedAt: '2026-10-11T17:30:00+01:00' },
  events: [
    { minute: 36, type: 'goal', team: 'away', player: 'Tubarão', number: 30, playerId: 'tubarao-libolo', detail: '0-1' },
    { minute: 80, type: 'goal', team: 'home', player: 'Kaba', detail: '1-1' },
    { minute: 97, type: 'goal', team: 'away', player: 'Robson', number: 9, detail: "90'+7 · 1-2" },
  ],
  // Nomeação de arbitragem recebida a 11/10/2026.
  officials: { referee: 'Edilson Roberto Gomes André', assistants: ['Manuel Luís Benguela', 'Joaquim Manuel Chiyo'], fourth: 'Bernardo Francisco Moreira' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (11/10/2026).
  // Posições e ligações ao plantel só onde fichas anteriores confirmam o mesmo jogador.
  coaches: { home: 'Rui Santos', away: 'Jony' },
  lineups: {
    home: [
      { name: 'Patrício', number: 12, position: 'GK', isStarter: true, playerId: 'fifa-1l7wk59' },
      { name: 'Filipe', number: 17, position: 'DEF', isStarter: true, playerId: 'fifa-1k2wth5' },
      { name: 'Hamilton', number: 2, position: 'MID', isStarter: true, playerId: 'fifa-1maldz0' },
      { name: 'Chinês', number: 6, isStarter: true },
      { name: 'Motivado', number: 7, position: 'MID', isStarter: true, playerId: 'fifa-1liwnq8' },
      { name: 'Gelson', number: 8, position: 'MID', isStarter: true, playerId: 'fifa-1ljudk2' },
      { name: 'Francisco', number: 9, position: 'FWD', isStarter: true, playerId: 'fifa-1l11132' },
      { name: 'Gabriel', number: 21, isStarter: true },
      { name: 'Domingos', number: 25, position: 'MID', isStarter: true, playerId: 'fifa-1l08hy2' },
      { name: 'Pedro', number: 28, position: 'DEF', isStarter: true, playerId: 'fifa-1maldr2' },
      { name: 'Jaime', number: 30, position: 'MID', isStarter: true, playerId: 'fifa-1qw9vb1' },
      { name: 'Deo', number: 22, position: 'GK', isStarter: false, playerId: 'fifa-1l7w9k9' },
      { name: 'Joel', number: 4, position: 'DEF', isStarter: false, playerId: 'fifa-1qhqn96' },
      { name: 'Denilson', number: 10, position: 'FWD', isStarter: false, playerId: 'fifa-1l7lph0' },
      { name: 'João', number: 11, isStarter: false },
      { name: 'Domingos', number: 14, position: 'MID', isStarter: false, playerId: 'fifa-1mall47' },
      { name: 'Arnaldo', number: 16, position: 'MID', isStarter: false, playerId: 'fifa-1m8xdu3' },
      { name: 'Miguel', number: 23, position: 'MID', isStarter: false, playerId: 'fifa-1l064e1' },
      { name: 'Estevão', number: 24, position: 'MID', isStarter: false, playerId: 'fifa-1k0rp19' },
      { name: 'Batista', number: 27, position: 'MID', isStarter: false, playerId: 'fifa-1v0ca42' },
    ],
    away: [
      { name: 'Valdez', number: 1, position: 'GK', isStarter: true },
      { name: 'Maninho', number: 5, position: 'DEF', isStarter: true, playerId: 'maninho-libolo' },
      { name: 'Toti', number: 4, position: 'DEF', isStarter: true, playerId: 'toti-libolo' },
      { name: 'Chimito', number: 6, position: 'MID', isStarter: true, playerId: 'chimito-libolo' },
      { name: 'Tchube', number: 8, position: 'DEF', isStarter: true, playerId: 'tchube-libolo' },
      { name: 'Andeloy', number: 10, position: 'MID', isStarter: true, playerId: 'andeloy-libolo' },
      { name: 'Nelo', number: 14, position: 'MID', isStarter: true, playerId: 'nelo-libolo' },
      { name: 'Amado', number: 18, isStarter: true, playerId: 'fifa-1qhqtd1' },
      { name: 'Cuxixima', number: 27, position: 'FWD', isStarter: true, playerId: 'cuxixima-libolo' },
      { name: 'Mayungo', number: 29, isStarter: true },
      { name: 'Tubarão', number: 30, position: 'FWD', isStarter: true, playerId: 'tubarao-libolo' },
      { name: 'Mário', number: 20, position: 'GK', isStarter: false, playerId: 'mario-libolo' },
      { name: 'Robson', number: 9, isStarter: false },
      { name: 'Gui', number: 11, isStarter: false },
      { name: 'Jorgito', number: 15, position: 'MID', isStarter: false, playerId: 'jorgito-libolo' },
      { name: 'Inglês', number: 16, isStarter: false },
      { name: 'Quinho', number: 21, isStarter: false },
      { name: 'Zidane', number: 22, position: 'MID', isStarter: false, playerId: 'zidane-libolo' },
      { name: 'Catraio', number: 24, position: 'DEF', isStarter: false, playerId: 'catraio-libolo' },
      { name: 'Lara', number: 28, position: 'FWD', isStarter: false, playerId: 'lara-libolo' },
    ],
  },
});
