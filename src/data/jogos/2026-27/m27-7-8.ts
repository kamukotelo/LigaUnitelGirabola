// 7.ª jornada · Recreativo do Libolo–GD Interclube
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-7-8',
  round: 7,
  homeTeamId: 'libolo',
  awayTeamId: 'interclube',
  schedule: { date: '2026-10-17T15:30:00+01:00', stadium: 'Estádio Mário Pacheco', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Nomeação de arbitragem recebida a 16/10/2026 (nomes completos das fichas anteriores).
  officials: { referee: 'Nelson Agostinho da Silva', assistants: ['Lourenço Manuel João', 'Domingos Jacinto Francisco Ferreira'], fourth: 'Ernesto Magalhães' },
  // Estádio da lista oficial de estádios das equipas (28/09/2026).
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (17/10/2026).
  // Posições e ligações ao plantel só onde fichas anteriores confirmam o mesmo jogador
  // («Beny» n.º 27 do Interclube é o «Bey» das fichas anteriores).
  coaches: { home: 'Osvaldo Roque', away: 'Divaldo Alves' },
  lineups: {
    home: [
      { name: 'Valdez', number: 1, position: 'GK', isStarter: true },
      { name: 'Maninho', number: 5, position: 'DEF', isStarter: true, playerId: 'maninho-libolo' },
      { name: 'Toty', number: 4, position: 'DEF', isStarter: true, playerId: 'toti-libolo' },
      { name: 'Chimito', number: 6, position: 'MID', isStarter: true, playerId: 'chimito-libolo' },
      { name: 'Tchube', number: 8, position: 'DEF', isStarter: true, playerId: 'tchube-libolo' },
      { name: 'Andeloy', number: 10, position: 'MID', isStarter: true, playerId: 'andeloy-libolo' },
      { name: 'Nelo', number: 14, position: 'MID', isStarter: true, playerId: 'nelo-libolo' },
      { name: 'Amado', number: 18, isStarter: true, playerId: 'fifa-1qhqtd1' },
      { name: 'Cuxixima', number: 27, position: 'FWD', isStarter: true, playerId: 'cuxixima-libolo' },
      { name: 'Mayungo', number: 29, isStarter: true },
      { name: 'Tubarão', number: 30, position: 'FWD', isStarter: true, playerId: 'tubarao-libolo' },
      { name: 'Beny', number: 12, position: 'GK', isStarter: false, playerId: 'beny-libolo' },
      { name: 'Robson', number: 9, isStarter: false },
      { name: 'Gui', number: 11, isStarter: false },
      { name: 'Jorgito', number: 15, position: 'MID', isStarter: false, playerId: 'jorgito-libolo' },
      { name: 'Jamanta', number: 19, position: 'FWD', isStarter: false, playerId: 'jamanta-libolo' },
      { name: 'Quinho', number: 21, isStarter: false },
      { name: 'Zidane', number: 22, position: 'MID', isStarter: false, playerId: 'zidane-libolo' },
      { name: 'Catraio', number: 24, position: 'DEF', isStarter: false, playerId: 'catraio-libolo' },
      { name: 'Lara', number: 28, position: 'FWD', isStarter: false, playerId: 'lara-libolo' },
    ],
    away: [
      { name: 'Rui', number: 22, position: 'GK', isStarter: true, playerId: 'fifa-1jtvf71' },
      { name: 'Lionel', number: 2, isStarter: true },
      { name: 'Salomão', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1jtv4k9' },
      { name: 'Além', number: 6, position: 'MID', isStarter: true, playerId: 'fifa-1jtv3g3' },
      { name: 'Peter Lwasa', number: 11, isStarter: true },
      { name: 'Alcides', number: 14, position: 'MID', isStarter: true, playerId: 'fifa-1kz4cq5' },
      { name: 'Anderson', number: 17, isStarter: true },
      { name: 'Nandinho', number: 25, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrqx5' },
      { name: 'Moisés', number: 28, position: 'DEF', isStarter: true, playerId: 'fifa-1lzlzp0' },
      { name: 'Betinho', number: 29, position: 'FWD', isStarter: true, playerId: 'fifa-1k0sa99' },
      { name: 'Boiado', number: 30, position: 'FWD', isStarter: true, playerId: 'fifa-1jzyk44' },
      { name: 'Panzo', number: 12, position: 'GK', isStarter: false, playerId: 'fifa-1jz6pv1' },
      { name: 'Gaby', number: 8, position: 'MID', isStarter: false, playerId: 'fifa-1qfxvu3' },
      { name: 'Jamanta', number: 18, position: 'DEF', isStarter: false, playerId: 'fifa-1jtuys4' },
      { name: 'Jhonatan', number: 19, isStarter: false },
      { name: 'Altura', number: 23, position: 'DEF', isStarter: false, playerId: 'fifa-1m7hyz3' },
      { name: 'Toy', number: 26, position: 'DEF', isStarter: false, playerId: 'fifa-1t9mip7' },
      { name: 'Beny', number: 27, position: 'DEF', isStarter: false, playerId: 'fifa-1k1ket3' },
      { name: 'Caneta', number: 32, position: 'MID', isStarter: false, playerId: 'fifa-1k26vw6' },
      { name: 'Vata', number: 35, position: 'FWD', isStarter: false, playerId: 'fifa-1nw4p04' },
    ],
  },
});
