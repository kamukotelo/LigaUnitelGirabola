// 10.ª jornada · Recreativo do Libolo–CD 1.º de Agosto
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-10-3',
  round: 10,
  homeTeamId: 'libolo',
  awayTeamId: 'dago',
  schedule: { date: '2026-11-08T15:00:00+01:00', stadium: 'Estádio Mário Pacheco', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa final das jornadas 7 a 10 (28/09/2026); correção para 08/11 confirmada pelo administrador em 29/10/2026' },
  // Estádio da lista oficial de estádios das equipas (28/09/2026).
  // Equipa de arbitragem do «Lineup Geral» oficial (08/11/2026; nomes completos das fichas anteriores).
  officials: { referee: 'Nelson Agostinho da Silva', assistants: ['Domingos Jacinto Francisco Ferreira', 'Lourenço Manuel João'], fourth: 'Ernesto Magalhães' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (08/11/2026).
  // Público só a partir de 1 h antes do início (embargo de line ups).
  // Márcio (n.º 13, Libolo) ainda não consta das listas de plantel recebidas.
  coaches: { home: 'Osvaldo Roque', away: 'Filipe Nzanza' },
  lineups: {
    home: [
      { name: 'Valdez', number: 1, position: 'GK', isStarter: true, playerId: 'valdez-libolo' },
      { name: 'Andeloy', number: 10, position: 'MID', isStarter: true, playerId: 'andeloy-libolo' },
      { name: 'Marcos', number: 3, position: 'DEF', isStarter: true, playerId: 'marcos-libolo' },
      { name: 'Toty', number: 4, position: 'DEF', isStarter: true, playerId: 'toti-libolo' },
      { name: 'Chimito', number: 6, position: 'MID', isStarter: true, playerId: 'chimito-libolo' },
      { name: 'Tchube', number: 8, position: 'DEF', isStarter: true, playerId: 'tchube-libolo' },
      { name: 'Nelo', number: 14, position: 'MID', isStarter: true, playerId: 'nelo-libolo' },
      { name: 'Amado', number: 18, position: 'FWD', isStarter: true, playerId: 'fifa-1qhqtd1' },
      { name: 'Catraio', number: 24, position: 'DEF', isStarter: true, playerId: 'catraio-libolo' },
      { name: 'Cuxixima', number: 27, position: 'FWD', isStarter: true, playerId: 'cuxixima-libolo' },
      { name: 'Lara', number: 28, position: 'FWD', isStarter: true, playerId: 'lara-libolo' },
      { name: 'Beny', number: 12, position: 'GK', isStarter: false, playerId: 'beny-libolo' },
      { name: 'Robson', number: 9, isStarter: false, playerId: 'robson-libolo' },
      { name: 'Gui', number: 11, isStarter: false, playerId: 'fifa-1mr7m11' },
      { name: 'Márcio', number: 13, isStarter: false },
      { name: 'Jorgito', number: 15, position: 'MID', isStarter: false, playerId: 'jorgito-libolo' },
      { name: 'Pedro', number: 17, position: 'FWD', isStarter: false, playerId: 'pedro-libolo' },
      { name: 'Jamanta', number: 19, position: 'FWD', isStarter: false, playerId: 'jamanta-libolo' },
      { name: 'Quinho', number: 21, isStarter: false, playerId: 'quinho-libolo' },
      { name: 'Zidane', number: 22, position: 'MID', isStarter: false, playerId: 'zidane-libolo' },
    ],
    away: [
      { name: 'Anselmo', number: 22, position: 'GK', isStarter: true, playerId: 'anselmo-dago' },
      { name: 'Bonifácio', number: 5, position: 'DEF', isStarter: true, playerId: 'bonifacio-dago' },
      { name: 'Milton', number: 2, position: 'DEF', isStarter: true, playerId: 'milton-dago' },
      { name: 'Bruno', number: 6, position: 'FWD', isStarter: true, playerId: 'bruno-dago' },
      { name: 'Mabilson', number: 7, position: 'FWD', isStarter: true, playerId: 'mabilson-dago' },
      { name: 'Axel', number: 8, position: 'MID', isStarter: true, playerId: 'axel-dago' },
      { name: 'Fernando', number: 11, position: 'FWD', isStarter: true, playerId: 'fernando-dago' },
      { name: 'Dago', number: 17, position: 'FWD', isStarter: true, playerId: 'dago-tshibamba' },
      { name: 'Paxe', number: 19, position: 'DEF', isStarter: true, playerId: 'fifa-1pxu511' },
      { name: 'Aspirina', number: 23, position: 'MID', isStarter: true, playerId: 'fifa-1pwaay2' },
      { name: 'Josué', number: 34, isStarter: true, playerId: 'josue-mungwengi-dago' },
      { name: 'Diego', number: 12, position: 'GK', isStarter: false, playerId: 'diego-lopes-dago' },
      { name: 'Mabelé', number: 3, position: 'DEF', isStarter: false, playerId: 'simao-dianzenza' },
      { name: 'Rupson', number: 9, position: 'FWD', isStarter: false, playerId: 'rupson-dago' },
      { name: 'Obed', number: 14, position: 'FWD', isStarter: false, playerId: 'obed-dago' },
      { name: 'Venâncio', number: 15, position: 'DEF', isStarter: false, playerId: 'venancio-dago' },
      { name: 'Clíver', number: 18, position: 'FWD', isStarter: false, playerId: 'cliver-dago' },
      { name: 'Tombé', number: 20, position: 'FWD', isStarter: false, playerId: 'tombe-dago' },
      { name: 'Paulo', number: 21, position: 'DEF', isStarter: false, playerId: 'paulo-costa-dago' },
      { name: 'Erique', number: 24, position: 'DEF', isStarter: false, playerId: 'fifa-1pxwmn6' },
    ],
  },
  // Resultado e marcadores recebidos a 08/11/2026 (captura da app; aguarda o relatório do árbitro).
  // Removido a 09/11/2026 o vermelho a Dagó (60') que veio da mesma captura: indicado como inexistente.
  result: { status: 'finished', homeScore: 2, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-11-08T17:06:00+01:00' },
  // Substituições e amarelos recebidos a 09/11/2026 (Futebol Total; aguardam o relatório do árbitro).
  // Pedro (n.º 17, Libolo) viu amarelo aos 87' sem constar das substituições: amarelo no banco ou substituição em falta.
  events: [
    { minute: 29, type: 'yellow', team: 'home', player: 'Andeloy', number: 10, playerId: 'andeloy-libolo' },
    { minute: 65, type: 'sub', team: 'away', player: 'Obed', number: 14, playerId: 'obed-dago', playerOut: 'Aspirina' },
    { minute: 67, type: 'sub', team: 'home', player: 'Gui', number: 11, playerId: 'fifa-1mr7m11', playerOut: 'Tchube' },
    { minute: 67, type: 'sub', team: 'home', player: 'Jorgito', number: 15, playerId: 'jorgito-libolo', playerOut: 'Catraio' },
    { minute: 75, type: 'goal', team: 'home', player: 'Amado', number: 18, playerId: 'fifa-1qhqtd1', detail: 'Grande penalidade · 1-0' },
    { minute: 76, type: 'sub', team: 'away', player: 'Clíver', number: 18, playerId: 'cliver-dago', playerOut: 'Mabilson' },
    { minute: 76, type: 'sub', team: 'away', player: 'Rupson', number: 9, playerId: 'rupson-dago', playerOut: 'Bruno' },
    { minute: 79, type: 'sub', team: 'home', player: 'Quinho', number: 21, playerId: 'quinho-libolo', playerOut: 'Amado' },
    { minute: 79, type: 'sub', team: 'home', player: 'Robson', number: 9, playerId: 'robson-libolo', playerOut: 'Cuxixima' },
    { minute: 84, type: 'goal', team: 'home', player: 'Robson', number: 9, playerId: 'robson-libolo', detail: '2-0' },
    { minute: 87, type: 'yellow', team: 'home', player: 'Pedro', number: 17, playerId: 'pedro-libolo' },
    { minute: 90, type: 'sub', team: 'home', player: 'Márcio', number: 13, playerOut: 'Toty' },
    { minute: 90, type: 'yellow', team: 'away', player: 'Fernando', number: 11, playerId: 'fernando-dago' },
  ],
});
