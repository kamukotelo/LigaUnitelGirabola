// 2.ª jornada · CR Caála–Wiliete de Benguela
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-2-1',
  round: 2,
  homeTeamId: 'caala',
  awayTeamId: 'wiliete',
  schedule: { date: '2026-08-27T16:00:00+01:00', stadium: 'Estádio dos Mártires da Canhala', scheduleStatus: 'official' },
  result: { status: 'finished', homeScore: 1, awayScore: 2, halfTimeScore: '1-1', updatedAt: '2026-09-06T17:50:00+01:00' },
  officials: { referee: 'Miguel Tchissingui Augusto Américo', assistants: ['Bernardo Kunjuca Lúcio Serafim', 'Floriano Cawala'], fourth: 'Ana Kuvundu Pumba' },
  coaches: { home: 'Divaldo Alves', away: 'Beto Bianchi' },
  // Onze inicial e suplentes publicados pelo Wiliete. O capitão não vem
  // identificado e o CR Caála não consta da comunicação.
  lineups: {
    home: [],
    away: [
      { name: 'Nayan', number: 1, position: 'GK', isStarter: true, playerId: 'fifa-1pkwt84' },
      { name: 'Giovani', number: 17, position: 'DEF', isStarter: true, playerId: 'fifa-1jwu6z0' },
      { name: 'Wiwi', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrpl0' },
      { name: 'Júnior Goiano', number: 27, position: 'DEF', isStarter: true, playerId: 'fifa-1pnmj53' },
      { name: 'Karanga', number: 7, position: 'MID', isStarter: true, playerId: 'fifa-1jsjbh0' },
      { name: 'Mule', number: 8, position: 'MID', isStarter: true, playerId: 'fifa-1k39nk6' },
      { name: 'Mindinho', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1jru7c5' },
      { name: 'Sidibé', number: 30, position: 'MID', isStarter: true, playerId: 'fifa-1qvfjm7' },
      { name: 'Bito', number: 28, position: 'MID', isStarter: true, playerId: 'fifa-1jrxs05' },
      { name: 'Gibelé', number: 11, position: 'FWD', isStarter: true, playerId: 'fifa-1jsj8t3' },
      { name: 'Bello Lukman', number: 18, position: 'FWD', isStarter: true, playerId: 'bello-lukman-wiliete' },
      { name: 'Didi Craque', number: 2, position: 'MID', isStarter: false, playerId: 'fifa-1ndemr2' },
      { name: 'Silva', number: 3, position: 'DEF', isStarter: false, playerId: 'fifa-1ljz6e0' },
      { name: 'Mabululu', number: 9, position: 'FWD', isStarter: false, playerId: 'mabululu-wiliete' },
      { name: 'Benny', number: 12, position: 'GK', isStarter: false, playerId: 'fifa-1jrtue9' },
      { name: 'Artur Kaká', number: 19, position: 'MID', isStarter: false, playerId: 'fifa-1l05v38' },
      { name: 'Ning', number: 25, position: 'FWD', isStarter: false, playerId: 'fifa-1jwu0l8' },
      { name: 'Nelo', number: 26, position: 'DEF', isStarter: false, playerId: 'fifa-1jz4n21' },
      { name: 'Célio', number: 32, position: 'MID', isStarter: false, playerId: 'fifa-1m95s64' },
      { name: 'Quare', number: 33, position: 'FWD', isStarter: false, playerId: 'fifa-1kzr1v5' },
    ],
  },
  events: [
    { minute: 32, type: 'goal', team: 'home', player: 'Valegol', playerId: 'valegol-caala', detail: 'Grande penalidade · 1-0' },
    { minute: 34, type: 'goal', team: 'away', player: 'Bello Lukman', playerId: 'bello-lukman-wiliete', detail: '1-1' },
    { minute: 44, type: 'red', team: 'home', player: 'Valegol', playerId: 'valegol-caala' },
    // «Ning» é o nº 25 Rodino Dumbo José, como o Wiliete o identifica na sua
    // própria escalação publicada da 5.ª jornada.
    { minute: 45, type: 'sub', team: 'away', player: 'Ning', number: 25, playerId: 'fifa-1jwu0l8', playerOut: 'Sidibé' },
    { minute: 49, type: 'goal', team: 'away', player: 'Ning', number: 25, playerId: 'fifa-1jwu0l8', detail: '1-2' },
    { minute: 65, type: 'sub', team: 'away', player: 'Artur Kaká', number: 19, playerId: 'fifa-1l05v38', playerOut: 'Bito' },
    { minute: 78, type: 'sub', team: 'away', player: 'Mabululu', number: 9, playerId: 'mabululu-wiliete', playerOut: 'Mule' },
    { minute: 78, type: 'sub', team: 'away', player: 'Célio', number: 32, playerId: 'fifa-1m95s64', playerOut: 'Bello Lukman' },
    { minute: 90, type: 'sub', team: 'away', player: 'Didi Craque', number: 2, playerId: 'fifa-1ndemr2', playerOut: 'Gibelé' },
  ],
  stats: {
    home: { redCards: 1 },
    away: { redCards: 0 },
    keys: ['redCards'],
  },
});
