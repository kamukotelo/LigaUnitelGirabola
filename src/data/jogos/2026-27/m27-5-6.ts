// 5.ª jornada · Wiliete de Benguela–Recreativo do Libolo
// 5.ª jornada · 20/09/2026 · Wiliete de Benguela 5-0 Recreativo do Libolo (resultado final)
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-5-6',
  round: 5,
  homeTeamId: 'wiliete',
  awayTeamId: 'libolo',
  schedule: { date: '2026-09-20T17:15:00+01:00', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'finished', homeScore: 5, awayScore: 0, halfTimeScore: '1-0', updatedAt: '2026-09-20T19:16:00+01:00' },
  // Relatório do Árbitro n.º 38 (20/09/2026).
  officials: {
    referee: 'Paulo Sérgio Moreira',
    assistants: ['Lídio Chicomo Cuimbra', 'Segunda Chisseque Francisco'],
    fourth: 'Nelson Joaquim Camunga',
    commissioner: 'António Caxala Muachihuissa',
  },
  // Onze e suplentes do Wiliete na folha de jogo da 5.ª jornada. O Libolo fica
  // por preencher até chegar a ficha oficial.
  lineups: {
    home: [
      { name: 'Nayan', number: 1, position: 'GK', isStarter: true, playerId: 'fifa-1pkwt84' },
      { name: 'Giovani', number: 17, position: 'DEF', isStarter: true, playerId: 'fifa-1jwu6z0' },
      { name: 'Wiwi', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrpl0' },
      { name: 'Júnior Goiano', number: 27, position: 'DEF', isStarter: true, playerId: 'fifa-1pnmj53' },
      { name: 'Karanga', number: 7, position: 'MID', isStarter: true, playerId: 'wiliete-player-3' },
      { name: 'Mule', number: 8, position: 'MID', isStarter: true, playerId: 'fifa-1k39nk6' },
      { name: 'Mindinho', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1jru7c5' },
      { name: 'Sidibé', number: 30, position: 'MID', isStarter: true, playerId: 'fifa-1qvfjm7' },
      { name: 'Bito', number: 28, position: 'MID', isStarter: true, playerId: 'fifa-1jrxs05' },
      { name: 'Gibelé', number: 11, position: 'FWD', isStarter: true, playerId: 'fifa-1jsj8t3' },
      { name: 'Mabululu', number: 9, position: 'FWD', isStarter: true, playerId: 'mabululu-wiliete' },
      { name: 'Elber', number: 31, position: 'GK', isStarter: false, playerId: 'fifa-1jm7y97' },
      { name: 'Célio', number: 32, position: 'MID', isStarter: false, playerId: 'fifa-1m95s64' },
      { name: 'Walter Monteiro', number: 35, position: 'MID', isStarter: false, playerId: 'valter-monteiro' },
      // Julinho não consta do plantel oficial do Wiliete; fica sem ligação ao registo.
      { name: 'Julinho', number: 29, isStarter: false },
      { name: 'Ning', number: 25, position: 'FWD', isStarter: false, playerId: 'fifa-1jwu0l8' },
      { name: 'Macaiabo', number: 16, position: 'MID', isStarter: false, playerId: 'fifa-1k1jsj8' },
      { name: 'Balsa', number: 15, position: 'DEF', isStarter: false, playerId: 'fifa-1jjfij0' },
      { name: 'Yano', number: 13, position: 'DEF', isStarter: false, playerId: 'fifa-1pvxht8' },
      { name: 'Janderson', number: 6, position: 'MID', isStarter: false, playerId: 'janderson-wiliete' },
    ],
    away: [],
  },
  events: [
    { minute: 1, type: 'goal', team: 'home', player: 'Bocar Sidibé', number: 30, playerId: 'fifa-1qvfjm7', detail: "1' (1-0)" },
    { minute: 49, type: 'goal', team: 'home', player: 'Mabululu', number: 9, playerId: 'mabululu-wiliete', detail: "49' (2-0)" },
    { minute: 63, type: 'goal', team: 'home', player: 'Mabululu', number: 9, playerId: 'mabululu-wiliete', detail: "63' (3-0)" },
    { minute: 82, type: 'goal', team: 'home', player: 'Rodino Dumbo José', number: 25, playerId: 'fifa-1jwu0l8', detail: "82' (4-0)" },
    { minute: 87, type: 'goal', team: 'home', player: 'Valter Monteiro', number: 35, playerId: 'valter-monteiro', detail: "87' (5-0)" },
  ],
});
