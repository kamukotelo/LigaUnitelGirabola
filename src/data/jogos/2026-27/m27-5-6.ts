// 5.ª jornada · Wiliete de Benguela–Recreativo do Libolo
// 5.ª jornada · 20/09/2026 · Wiliete de Benguela 5-0 Recreativo do Libolo (resultado final)
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-5-6',
  round: 5,
  homeTeamId: 'wiliete',
  awayTeamId: 'libolo',
  schedule: { date: '2026-09-20T17:15:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'finished', homeScore: 5, awayScore: 0, halfTimeScore: '1-0', updatedAt: '2026-09-20T19:16:00+01:00' },
  // Relatório do Árbitro n.º 38 (20/09/2026).
  officials: {
    referee: 'Paulo Sérgio Moreira',
    assistants: ['Lídio Chicomo Cuimbra', 'Segunda Chisseque Francisco'],
    fourth: 'Nelson Joaquim Camunga',
    commissioner: 'António Caxala Muachihuissa',
  },
  // Onze inicial e suplentes da ficha oficial (Relatório do Árbitro n.º 38).
  lineups: {
    home: [
      { name: 'Nayan Gomes', number: 1, position: 'GK', isStarter: true, playerId: 'fifa-1pkwt84' },
      { name: 'Giovani Chipopolo', number: 17, position: 'DEF', isStarter: true, isCaptain: true, playerId: 'fifa-1jwu6z0' },
      { name: 'Arão Manuel Lologi', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrpl0' },
      { name: 'Jorge Mendes Corte Real Carneiro', number: 7, position: 'MID', isStarter: true, playerId: 'fifa-1jsjbh0' },
      { name: 'António Mule Chitongo', number: 8, position: 'MID', isStarter: true, playerId: 'fifa-1k39nk6' },
      { name: 'Cristovão Paciência', number: 9, position: 'FWD', isStarter: true, playerId: 'mabululu-wiliete' },
      { name: 'Armindo Gonçalves Canji', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1jru7c5' },
      { name: 'Deivi Miguel Vieira', number: 11, position: 'FWD', isStarter: true, playerId: 'fifa-1jsj8t3' },
      { name: 'Emanoel Júnior', number: 27, position: 'DEF', isStarter: true, playerId: 'fifa-1pnmj53' },
      { name: 'Camilo Mbule Ngongue', number: 28, position: 'MID', isStarter: true, playerId: 'fifa-1jrxs05' },
      { name: 'Bocar Sidibé', number: 30, position: 'MID', isStarter: true, playerId: 'fifa-1qvfjm7' },
      // Sem ficha na inscrição de 31/08: entram com o nome que o clube publica
      // (Jaderson de Oliveira Maia e João Diogo na súmula), sem página de jogador.
      { name: 'Janderson', number: 6, isStarter: false },
      { name: 'Adriano Watchilala Tchombe', number: 13, position: 'DEF', isStarter: false, playerId: 'fifa-1pvxht8' },
      { name: 'Augusto Manuel Balsa', number: 15, position: 'DEF', isStarter: false, playerId: 'fifa-1jjfij0' },
      { name: 'Francisco Cubuema Matoco', number: 16, position: 'MID', isStarter: false, playerId: 'fifa-1k1jsj8' },
      { name: 'Rodino Dumbo José', number: 25, position: 'FWD', isStarter: false, playerId: 'fifa-1jwu0l8' },
      { name: 'Julinho', number: 29, isStarter: false },
      { name: 'Elber Delgado', number: 31, isStarter: false, playerId: 'fifa-1jm7y97' },
      { name: 'Célio Alberto Junqueira Zua', number: 32, position: 'MID', isStarter: false, playerId: 'fifa-1m95s64' },
      { name: 'Valter Manuel Monteiro', number: 35, position: 'MID', isStarter: false, playerId: 'valter-monteiro' },
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
      { name: 'Amado Tiago Marques Haidara', number: 18, isStarter: true, playerId: 'fifa-1qhqtd1' },
      { name: 'Edmilson João Francisco Cuxixima', number: 27, position: 'FWD', isStarter: true, playerId: 'cuxixima-libolo' },
      { name: 'Joel Kaluvala Alexandre Lucamba', number: 30, position: 'FWD', isStarter: true, playerId: 'tubarao-libolo' },
      { name: 'Amado Salem Miguel', number: 1, position: 'GK', isStarter: false },
      { name: 'Diogo da Rocha Quiamesso', number: 11, isStarter: false, playerId: 'fifa-1mr7m11' },
      { name: 'Fernando José Paulino Lourenço', number: 16, isStarter: false, playerId: 'fifa-1pxu766' },
      { name: 'Samuel Kuyokoya Francisco', number: 21, isStarter: false },
      { name: 'Zinadine Zidane Moisés Catraio', number: 24, position: 'DEF', isStarter: false, playerId: 'catraio-libolo' },
      { name: 'Salomão Mukanda', number: 25, position: 'DEF', isStarter: false, playerId: 'miro-libolo' },
      { name: 'Zeferino Handa Monissa', number: 26, isStarter: false },
      { name: 'Manuel Jacinto Domingos', number: 28, position: 'FWD', isStarter: false, playerId: 'lara-libolo' },
      { name: 'Jacinto Bernardo Machado', number: 29, isStarter: false },
    ],
  },
  events: [
    { minute: 1, type: 'goal', team: 'home', player: 'Bocar Sidibé', number: 30, playerId: 'fifa-1qvfjm7', detail: "1' (1-0)" },
    { minute: 49, type: 'goal', team: 'home', player: 'Mabululu', number: 9, playerId: 'mabululu-wiliete', detail: "49' (2-0)" },
    { minute: 63, type: 'goal', team: 'home', player: 'Mabululu', number: 9, playerId: 'mabululu-wiliete', detail: "63' (3-0)" },
    { minute: 82, type: 'goal', team: 'home', player: 'Rodino Dumbo José', number: 25, playerId: 'fifa-1jwu0l8', detail: "82' (4-0)" },
    { minute: 87, type: 'goal', team: 'home', player: 'Valter Monteiro', number: 35, playerId: 'valter-monteiro', detail: "87' (5-0)" },
  ],
});
