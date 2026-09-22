// 4.ª jornada · Wiliete de Benguela–FC Luanda
// 4.ª jornada · 13/09/2026 · Estádio Nacional de Ombaka
// 4.ª jornada (13/09/2026 · Estádio Nacional de Ombaka, Benguela).
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-4-3',
  round: 4,
  homeTeamId: 'wiliete',
  awayTeamId: 'fcluanda',
  schedule: { date: '2026-09-13T16:00:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official' },
  result: { status: 'finished', homeScore: 2, awayScore: 0, halfTimeScore: '2-0', updatedAt: '2026-09-13T18:05:00+01:00' },
  officials: { referee: 'Gilberto Bernardino Kativa', assistants: ['António Emiliano Livongue', 'Carlos Pereira Gabriel'], fourth: 'Nuno Eduardo Sumbo' },
  coaches: { home: 'Beto Bianchi', away: 'Rui Santos' },
  // Onze inicial e suplentes publicados pelo Wiliete. O capitão não vem
  // identificado na comunicação e o FC Luanda não consta dela.
  lineups: {
    home: [
      { name: 'Nayan', number: 1, position: 'GK', isStarter: true, playerId: 'fifa-1pkwt84' },
      { name: 'Giovani', number: 17, position: 'DEF', isStarter: true, playerId: 'fifa-1jwu6z0' },
      { name: 'Wiwi', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrpl0' },
      { name: 'Júnior Goiano', number: 27, position: 'DEF', isStarter: true, playerId: 'fifa-1pnmj53' },
      { name: 'Karanga', number: 7, position: 'MID', isStarter: true, playerId: 'fifa-1jsjbh0' },
      { name: 'Mule', number: 8, position: 'MID', isStarter: true, playerId: 'fifa-1k39nk6' },
      { name: 'Mindinho', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1jru7c5' },
      { name: 'Sidibé', number: 30, position: 'MID', isStarter: true, playerId: 'fifa-1qvfjm7' },
      { name: 'Bito', number: 28, position: 'MID', isStarter: true, playerId: 'fifa-1jrxs05' },
      { name: 'Ning', number: 25, position: 'FWD', isStarter: true, playerId: 'fifa-1jwu0l8' },
      { name: 'Mabululu', number: 9, position: 'FWD', isStarter: true, playerId: 'mabululu-wiliete' },
      { name: 'Benny', number: 12, position: 'GK', isStarter: false, playerId: 'fifa-1jrtue9' },
      { name: 'Bello Lukman', number: 18, position: 'FWD', isStarter: false, playerId: 'bello-lukman-wiliete' },
      { name: 'Igui', number: 24, position: 'MID', isStarter: false, playerId: 'fifa-1uqnv32' },
      { name: 'Nelo', number: 26, position: 'DEF', isStarter: false, playerId: 'fifa-1jz4n21' },
      // Sem ficha na inscrição de 31/08: fica com o nome do clube, sem página de jogador.
      { name: 'Julinho', number: 29, isStarter: false },
      { name: 'Célio', number: 32, position: 'MID', isStarter: false, playerId: 'fifa-1m95s64' },
      { name: 'Quare', number: 33, position: 'FWD', isStarter: false, playerId: 'fifa-1kzr1v5' },
      { name: 'César Cangué', number: 34, position: 'FWD', isStarter: false, playerId: 'fifa-1k36hf0' },
      { name: 'Valter Monteiro', number: 35, position: 'MID', isStarter: false, playerId: 'valter-monteiro' },
    ],
    away: [],
  },
  events: [
    { minute: 31, type: 'goal', team: 'home', player: 'Mabululu', playerId: 'mabululu-wiliete', detail: '1-0' },
    { minute: 45, type: 'goal', team: 'home', player: 'Mabululu', playerId: 'mabululu-wiliete', detail: "45'+6 · 2-0" },
  ],
});
