// 5.ª jornada · Wiliete de Benguela–Recreativo do Libolo
// 5.ª jornada · 20/09/2026 · Wiliete de Benguela 5-0 Recreativo do Libolo (resultado final)
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-5-6',
  round: 5,
  homeTeamId: 'wiliete',
  awayTeamId: 'libolo',
  schedule: { date: '2026-09-20T17:15:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'finished', homeScore: 5, awayScore: 0, halfTimeScore: '1-0', attendance: 2000, updatedAt: '2026-10-19T21:00:00+01:00' },
  // Relatório do Árbitro n.º 38 (20/09/2026).
  officials: { referee: 'Paulo Sérgio Moreira', assistants: ['Lídio Chicomo Cuimbra', 'Segunda Chisseque Francisco'], fourth: 'Nelson Joaquim Camunga', commissioner: 'António Caxala Muachihuissa' },
  coaches: { away: 'Osvaldo Roque' },
  // Onze inicial e suplentes da ficha oficial (Relatório do Árbitro n.º 38).
  // Os quatro sem ficha na inscrição — Mário (1), Quinho (21), Lino (26) e
  // Jacinto (29) — ficam com o nome que o clube publica.
  // Conferidas com o Relatório do Árbitro n.º 38 (19/10/2026).
  lineups: {
    home: [
      { name: 'Nayan Gomes', number: 1, position: 'GK', isStarter: true, playerId: 'fifa-1pkwt84' },
      { name: 'Giovani Chipopolo', number: 17, position: 'DEF', isStarter: true, isCaptain: true, playerId: 'fifa-1jwu6z0' },
      { name: 'Wiwi', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrpl0' },
      { name: 'Karanga', number: 7, position: 'MID', isStarter: true, playerId: 'fifa-1jsjbh0' },
      { name: 'Mule', number: 8, position: 'MID', isStarter: true, playerId: 'fifa-1k39nk6' },
      { name: 'Cristovão Paciência', number: 9, position: 'FWD', isStarter: true, playerId: 'mabululu-wiliete' },
      { name: 'Mindinho', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1jru7c5' },
      { name: 'Gibelé', number: 11, position: 'FWD', isStarter: true, playerId: 'fifa-1jsj8t3' },
      { name: 'Emanoel Júnior', number: 27, position: 'DEF', isStarter: true, playerId: 'fifa-1pnmj53' },
      { name: 'Bito', number: 28, position: 'MID', isStarter: true, playerId: 'fifa-1jrxs05' },
      { name: 'Bocar Sidibé', number: 30, position: 'MID', isStarter: true, playerId: 'fifa-1qvfjm7' },
      { name: 'Janderson', number: 6, position: 'MID', isStarter: false, playerId: 'janderson-wiliete' },
      { name: 'Yano', number: 13, position: 'DEF', isStarter: false, playerId: 'fifa-1pvxht8' },
      { name: 'Balsa', number: 15, position: 'DEF', isStarter: false, playerId: 'fifa-1jjfij0' },
      { name: 'Macaiabo', number: 16, position: 'MID', isStarter: false, playerId: 'fifa-1k1jsj8' },
      { name: 'Ning', number: 25, position: 'FWD', isStarter: false, playerId: 'fifa-1jwu0l8' },
      { name: 'Julinho', number: 29, isStarter: false, playerId: 'julinho-wiliete' },
      { name: 'Elber Delgado', number: 31, position: 'GK', isStarter: false, playerId: 'fifa-1jm7y97' },
      { name: 'Célio', number: 32, position: 'MID', isStarter: false, playerId: 'fifa-1m95s64' },
      { name: 'Walter Monteiro', number: 35, position: 'MID', isStarter: false, playerId: 'valter-monteiro' },
    ],
    away: [
      { name: 'Bernardo Lomanda Kamutcha Gunda', number: 12, position: 'GK', isStarter: true, playerId: 'beny-libolo' },
      { name: 'Adelino Wima Calunhi António', number: 5, position: 'DEF', isStarter: true, isCaptain: true, playerId: 'maninho-libolo' },
      { name: 'Marcos Benua', number: 3, position: 'DEF', isStarter: true, playerId: 'marcos-libolo' },
      { name: 'Aristotes Kingui Makani', number: 4, position: 'DEF', isStarter: true, playerId: 'toti-libolo' },
      { name: 'Gerson Francisco Chimbele da Costa', number: 6, position: 'MID', isStarter: true, playerId: 'chimito-libolo' },
      { name: 'Ilídio da Silva', number: 8, position: 'DEF', isStarter: true, playerId: 'tchube-libolo' },
      { name: 'André Alexandre', number: 10, position: 'MID', isStarter: true, playerId: 'andeloy-libolo' },
      { name: 'Manuel Manjolo', number: 14, position: 'MID', isStarter: true, playerId: 'nelo-libolo' },
      { name: 'Amado', number: 18, isStarter: true, playerId: 'fifa-1qhqtd1' },
      { name: 'Edmilson João Francisco Cuxixima', number: 27, position: 'FWD', isStarter: true, playerId: 'cuxixima-libolo' },
      { name: 'Joel Kaluvala Alexandre Lucamba', number: 30, position: 'FWD', isStarter: true, playerId: 'tubarao-libolo' },
      { name: 'Mário', number: 1, position: 'GK', isStarter: false, playerId: 'valdez-libolo' },
      { name: 'Gui', number: 11, isStarter: false, playerId: 'fifa-1mr7m11' },
      { name: 'Inglês', number: 16, isStarter: false, playerId: 'fifa-1pxu766' },
      { name: 'Quinho', number: 21, isStarter: false, playerId: 'quinho-libolo' },
      { name: 'Zinadine Zidane Moisés Catraio', number: 24, position: 'DEF', isStarter: false, playerId: 'catraio-libolo' },
      { name: 'Salomão Mukanda', number: 25, position: 'DEF', isStarter: false, playerId: 'miro-libolo' },
      { name: 'Lino', number: 26, isStarter: false, playerId: 'lino-libolo' },
      { name: 'Manuel Jacinto Domingos', number: 28, position: 'FWD', isStarter: false, playerId: 'lara-libolo' },
      { name: 'Jacinto', number: 29, isStarter: false, playerId: 'mayungo-libolo' },
    ],
  },
  events: [
    // Golos, cartões e substituições do Relatório do Árbitro n.º 38 (ANCAF), conferido a 19/10/2026.
    { minute: 1, type: 'goal', team: 'home', player: 'Bocar Sidibé', number: 30, playerId: 'fifa-1qvfjm7', detail: '1-0' },
    { minute: 27, type: 'sub', team: 'away', player: 'Zinadine Zidane Moisés Catraio', number: 24, playerId: 'catraio-libolo', playerOut: 'Edmilson João Francisco Cuxixima' },
    { minute: 38, type: 'yellow', team: 'away', player: 'André Alexandre', number: 10, playerId: 'andeloy-libolo', detail: 'Comportamento antidesportivo' },
    { minute: 46, type: 'sub', team: 'home', player: 'Ning', number: 25, playerId: 'fifa-1jwu0l8', playerOut: 'Bito' },
    { minute: 46, type: 'sub', team: 'home', player: 'Célio', number: 32, playerId: 'fifa-1m95s64', playerOut: 'Bocar Sidibé' },
    { minute: 46, type: 'sub', team: 'home', player: 'Janderson', number: 6, playerId: 'janderson-wiliete', playerOut: 'Mule' },
    { minute: 48, type: 'goal', team: 'home', player: 'Cristovão Paciência', number: 9, playerId: 'mabululu-wiliete', detail: '2-0' },
    { minute: 62, type: 'goal', team: 'home', player: 'Cristovão Paciência', number: 9, playerId: 'mabululu-wiliete', detail: '3-0' },
    { minute: 66, type: 'sub', team: 'away', player: 'Gui', number: 11, playerId: 'fifa-1mr7m11', playerOut: 'Ilídio da Silva' },
    { minute: 66, type: 'sub', team: 'away', player: 'Quinho', number: 21, playerId: 'quinho-libolo', playerOut: 'Adelino Wima Calunhi António' },
    { minute: 77, type: 'sub', team: 'home', player: 'Walter Monteiro', number: 35, playerId: 'valter-monteiro', playerOut: 'Gibelé' },
    { minute: 77, type: 'sub', team: 'away', player: 'Lino', number: 26, playerId: 'lino-libolo', playerOut: 'André Alexandre' },
    { minute: 80, type: 'goal', team: 'home', player: 'Ning', number: 25, playerId: 'fifa-1jwu0l8', detail: '4-0' },
    { minute: 84, type: 'sub', team: 'home', player: 'Macaiabo', number: 16, playerId: 'fifa-1k1jsj8', playerOut: 'Cristovão Paciência' },
    { minute: 84, type: 'sub', team: 'away', player: 'Inglês', number: 16, playerId: 'fifa-1pxu766', playerOut: 'Manuel Manjolo' },
    { minute: 85, type: 'goal', team: 'home', player: 'Walter Monteiro', number: 35, playerId: 'valter-monteiro', detail: '5-0' },
  ],
  stats: {
    home: { yellowCards: 0 },
    away: { yellowCards: 1 },
    keys: ['yellowCards'],
  },
});
