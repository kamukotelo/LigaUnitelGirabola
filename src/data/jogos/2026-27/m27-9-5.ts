// 9.ª jornada · Recreativo do Libolo–Sagrada Esperança
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-9-5',
  round: 9,
  homeTeamId: 'libolo',
  awayTeamId: 'sagrada',
  schedule: { date: '2026-10-31T15:00:00+01:00', stadium: 'Estádio Mário Pacheco', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Resultado recebido a 31/10/2026 (relatório do árbitro n.º 66 recebido a 12/11/2026). A fonte atribui os golos
  // dos 25' e 34' a «Amado Salem»: ficam no Amado (n.º 18, avançado titular), não no
  // guarda-redes Valdez (Amado Salem Miguel). Golo do Sagrada aos 42' e expulsão no Libolo
  // aos 90'+7 sem jogador identificado.
  result: { status: 'finished', homeScore: 3, awayScore: 1, halfTimeScore: '2-1', updatedAt: '2026-10-31T17:30:00+01:00' },
  events: [
    { minute: 16, type: 'yellow', team: 'away', player: 'Dabanda', number: 7, playerId: 'dabanda-sagrada', detail: 'Falta tática' },
    { minute: 24, type: 'goal', team: 'home', player: 'Amado', number: 18, playerId: 'fifa-1qhqtd1', detail: '1-0' },
    { minute: 33, type: 'goal', team: 'home', player: 'Amado', number: 18, playerId: 'fifa-1qhqtd1', detail: '2-0' },
    { minute: 33, type: 'yellow', team: 'away', player: 'Leonardo', number: 13, playerId: 'leonardo-sagrada', detail: 'Desaprovar a decisão do árbitro' },
    { minute: 41, type: 'goal', team: 'away', player: 'Dabanda', number: 7, playerId: 'dabanda-sagrada', detail: '2-1' },
    { minute: 65, type: 'yellow', team: 'away', player: 'Luís Tati', number: 20, playerId: 'luis-tati-sagrada', detail: 'Falta tática' },
    { minute: 66, type: 'goal', team: 'home', player: 'Robson', number: 9, playerId: 'robson-libolo', detail: '3-1' },
    { minute: 82, type: 'yellow', team: 'home', player: 'Nelo', number: 14, playerId: 'nelo-libolo', detail: 'Retardar o reinício do jogo' },
    { minute: 96, type: 'red', team: 'home', player: 'Tubarão', number: 30, playerId: 'tubarao-libolo', detail: "90'+6 · Jogo brusco grave" },
  ],
  // Estádio da lista oficial de estádios das equipas (28/09/2026).
  // Constituição das equipas: Lineup Geral oficial da 9.ª jornada (31/10/2026), LIBOLO.
  // Escalações públicas a partir de 1 h antes do início (embargo existente).
  // Arbitragem, golos e cartões do Relatório do Árbitro n.º 66 (recebido a 12/11/2026).
  officials: { referee: 'António Caluassi Dungula', assistants: ['Victorino Nangolo Dungula', 'Zacarias Chivanja Calembe'], fourth: 'Augusto Sawambo Pedro', commissioner: 'João Amado Muanda Goma' },
  coaches: { home: 'Osvaldo Roque', away: 'Luís Quintas' },
  lineups: {
    home: [
      { name: 'Valdez', number: 1, position: 'GK', isStarter: true, playerId: 'valdez-libolo' },
      { name: 'Andeloy', number: 10, position: 'MID', isStarter: true, playerId: 'andeloy-libolo' },
      { name: 'Toty', number: 4, position: 'DEF', isStarter: true, playerId: 'toti-libolo' },
      { name: 'Chimito', number: 6, position: 'MID', isStarter: true, playerId: 'chimito-libolo' },
      { name: 'Gui', number: 11, isStarter: true, playerId: 'fifa-1mr7m11' },
      { name: 'Nelo', number: 14, position: 'MID', isStarter: true, playerId: 'nelo-libolo' },
      { name: 'Amado', number: 18, isStarter: true, playerId: 'fifa-1qhqtd1' },
      { name: 'Catraio', number: 24, position: 'DEF', isStarter: true, playerId: 'catraio-libolo' },
      { name: 'Cuxixima', number: 27, position: 'FWD', isStarter: true, playerId: 'cuxixima-libolo' },
      { name: 'Lara', number: 28, position: 'FWD', isStarter: true, playerId: 'lara-libolo' },
      { name: 'Tubarão', number: 30, position: 'FWD', isStarter: true, playerId: 'tubarao-libolo' },
      { name: 'Beny', number: 12, position: 'GK', isStarter: false, playerId: 'beny-libolo' },
      { name: 'Marcos', number: 3, position: 'DEF', isStarter: false, playerId: 'marcos-libolo' },
      { name: 'Tchube', number: 8, position: 'DEF', isStarter: false, playerId: 'tchube-libolo' },
      { name: 'Robson', number: 9, isStarter: false, playerId: 'robson-libolo' },
      { name: 'Jorgito', number: 15, position: 'MID', isStarter: false, playerId: 'jorgito-libolo' },
      { name: 'Jamanta', number: 19, position: 'FWD', isStarter: false, playerId: 'jamanta-libolo' },
      { name: 'Zidane', number: 22, position: 'MID', isStarter: false, playerId: 'zidane-libolo' },
      { name: 'Vandelson', number: 23, isStarter: false, playerId: 'fifa-1spwxv4' },
      { name: 'Mayungo', number: 29, isStarter: false, playerId: 'mayungo-libolo' },
    ],
    away: [
      { name: 'Leonardo', number: 13, position: 'GK', isStarter: true, playerId: 'leonardo-sagrada' },
      { name: 'Dabanda', number: 7, position: 'FWD', isStarter: true, playerId: 'dabanda-sagrada' },
      { name: 'Alexandre', number: 2, position: 'DEF', isStarter: true, playerId: 'fifa-1v1a1u9' },
      { name: 'Manú', number: 3, position: 'DEF', isStarter: true, playerId: 'manuel-sagrada' },
      { name: 'Celso Cabuço', number: 8, position: 'MID', isStarter: true, playerId: 'guilherme-sagrada' },
      { name: 'Melono Dala', number: 11, position: 'FWD', isStarter: true, playerId: 'melono-sagrada' },
      { name: 'Tobias', number: 14, position: 'DEF', isStarter: true, playerId: 'tobias-sagrada' },
      { name: 'Luís Tati', number: 20, position: 'DEF', isStarter: true, playerId: 'luis-tati-sagrada' },
      { name: 'Messias', number: 21, position: 'MID', isStarter: true, playerId: 'fifa-1v0z7l2' },
      { name: 'Cláudio', number: 33, isStarter: true, playerId: 'fifa-1l7vm13' },
      { name: 'Kulica', number: 39, position: 'MID', isStarter: true, playerId: 'fifa-1scqy89' },
      { name: 'Nsesani', number: 12, position: 'GK', isStarter: false, playerId: 'nsesani-sagrada' },
      { name: 'Miguel', number: 5, position: 'DEF', isStarter: false, playerId: 'miguel-sagrada' },
      { name: 'Jorge', number: 9, position: 'FWD', isStarter: false, playerId: 'jorge-sagrada' },
      { name: 'Gogoró', number: 17, position: 'DEF', isStarter: false, playerId: 'gogoro-sagrada' },
      { name: 'Wilfreid', number: 22, isStarter: false },
      { name: 'Pedro', number: 26, isStarter: false, playerId: 'pedro-soba-sagrada' },
      { name: 'Pipocas', number: 27, isStarter: false, playerId: 'pipocas-sagrada' },
      { name: 'Barreira', number: 28, position: 'DEF', isStarter: false, playerId: 'barreira-sagrada' },
      { name: 'Kandumba', number: 34, isStarter: false, playerId: 'fifa-1jrv034' },
    ],
  },
});
