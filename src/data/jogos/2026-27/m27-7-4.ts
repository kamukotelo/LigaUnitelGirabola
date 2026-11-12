// 7.ª jornada · CD 1.º de Agosto–Wiliete de Benguela
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-7-4',
  round: 7,
  homeTeamId: 'dago',
  awayTeamId: 'wiliete',
  schedule: { date: '2026-11-04T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Comunicado Oficial 011-DCE/ANCAF/2026 (07/10/2026): adiado para 04/11, mesmo estádio e horário' },
  // Resultado final da Liga Unitel Girabola recebido a 04/11/2026 (relatório do árbitro n.º 56 recebido a 12/11/2026);
  // sem resultado ao intervalo.
  result: { status: 'finished', homeScore: 0, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-11-04T19:21:00+01:00' },
  // Substituições, amarelos e vermelho (Macaia, 80') do 1.º de Agosto recebidos a 10/11/2026 (Futebol Total; relatório do árbitro n.º 56 recebido a 12/11/2026).
  events: [
    { minute: 57, type: 'yellow', team: 'away', player: 'Sidibé', number: 30, playerId: 'fifa-1qvfjm7' },
    { minute: 65, type: 'yellow', team: 'home', player: 'Paxe', number: 19, playerId: 'fifa-1pxu511' },
    { minute: 71, type: 'sub', team: 'home', player: 'Mabelé', number: 3, playerId: 'simao-dianzenza', playerOut: 'Paxe' },
    { minute: 71, type: 'sub', team: 'home', player: 'Félix Bulaya', number: 28, playerId: 'bulaya-dago', playerOut: 'Aspirina' },
    { minute: 71, type: 'sub', team: 'home', player: 'Rupson', number: 9, playerId: 'rupson-dago', playerOut: 'Axel' },
    { minute: 75, type: 'yellow', team: 'home', player: 'Mabelé', number: 3, playerId: 'simao-dianzenza' },
    { minute: 78, type: 'sub', team: 'home', player: 'Tombé', number: 20, playerId: 'tombe-dago', playerOut: 'Fernando' },
    { minute: 80, type: 'yellow', team: 'home', player: 'Dago', number: 17, playerId: 'dago-tshibamba' },
    { minute: 80, type: 'yellow', team: 'home', player: 'Filipe Nanza', detail: 'Treinador' },
    { minute: 80, type: 'red', team: 'home', player: 'Macaia', number: 16, playerId: 'macaia-dago' },
    { minute: 86, type: 'yellow', team: 'home', player: 'Tombé', number: 20, playerId: 'tombe-dago' },
    { minute: 87, type: 'yellow', team: 'away', player: 'Júnior Goiano', number: 27, playerId: 'fifa-1pnmj53' },
  ],
  // Equipa de arbitragem, onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (04/11/2026; nomes completos dos árbitros das fichas anteriores).
  // Buba Jammeh (n.º 14, Wiliete) ainda não consta das listas de plantel recebidas.
  // Arbitragem, golos e cartões do Relatório do Árbitro n.º 56 (recebido a 12/11/2026).
  officials: { referee: 'Ailton Jeovane Quissanga Carmelino', assistants: ['Evanildo Gaspar dos Santos Martins', 'Estanislau Guedes Tavares Muluta Prata'], fourth: 'António Domingos Miguel', commissioner: 'José Leopoldo Braga Mavunza' },
  coaches: { home: 'Filipe Nzanza', away: 'Beto Bianchi' },
  lineups: {
    home: [
      { name: 'Anselmo', number: 22, position: 'GK', isStarter: true, playerId: 'anselmo-dago' },
      { name: 'Bonifácio', number: 5, position: 'DEF', isStarter: true, playerId: 'bonifacio-dago' },
      { name: 'Milton', number: 2, position: 'DEF', isStarter: true, playerId: 'milton-dago' },
      { name: 'Mabilson', number: 7, position: 'FWD', isStarter: true, playerId: 'mabilson-dago' },
      { name: 'Axel', number: 8, position: 'MID', isStarter: true, playerId: 'axel-dago' },
      { name: 'Fernando', number: 11, position: 'FWD', isStarter: true, playerId: 'fernando-dago' },
      { name: 'Macaia', number: 16, position: 'MID', isStarter: true, playerId: 'macaia-dago' },
      { name: 'Dago', number: 17, position: 'FWD', isStarter: true, playerId: 'dago-tshibamba' },
      { name: 'Paxe', number: 19, position: 'DEF', isStarter: true, playerId: 'fifa-1pxu511' },
      { name: 'Aspirina', number: 23, position: 'MID', isStarter: true, playerId: 'fifa-1pwaay2' },
      { name: 'Josué', number: 34, isStarter: true, playerId: 'josue-mungwengi-dago' },
      { name: 'Diego', number: 12, position: 'GK', isStarter: false, playerId: 'diego-lopes-dago' },
      { name: 'Mabelé', number: 3, position: 'DEF', isStarter: false, playerId: 'simao-dianzenza' },
      { name: 'Bruno', number: 6, position: 'FWD', isStarter: false, playerId: 'bruno-dago' },
      { name: 'Rupson', number: 9, position: 'FWD', isStarter: false, playerId: 'rupson-dago' },
      { name: 'Obed', number: 14, position: 'FWD', isStarter: false, playerId: 'obed-dago' },
      { name: 'Venâncio', number: 15, position: 'DEF', isStarter: false, playerId: 'venancio-dago' },
      { name: 'Tombé', number: 20, position: 'FWD', isStarter: false, playerId: 'tombe-dago' },
      { name: 'Paulo', number: 21, position: 'DEF', isStarter: false, playerId: 'paulo-costa-dago' },
      { name: 'Félix Bulaya', number: 28, position: 'FWD', isStarter: false, playerId: 'bulaya-dago' },
    ],
    away: [
      { name: 'Elber', number: 31, position: 'GK', isStarter: true, playerId: 'fifa-1jm7y97' },
      { name: 'Giovani', number: 17, position: 'DEF', isStarter: true, playerId: 'fifa-1jwu6z0' },
      { name: 'Wiwi', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrpl0' },
      { name: 'Karanga', number: 7, position: 'MID', isStarter: true, playerId: 'fifa-1jsjbh0' },
      { name: 'Mule', number: 8, position: 'MID', isStarter: true, playerId: 'fifa-1k39nk6' },
      { name: 'Mabululu', number: 9, position: 'FWD', isStarter: true, playerId: 'mabululu-wiliete' },
      { name: 'Mindinho', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1jru7c5' },
      { name: 'Buba Jammeh', number: 14, isStarter: true },
      { name: 'Júnior Goiano', number: 27, position: 'DEF', isStarter: true, playerId: 'fifa-1pnmj53' },
      { name: 'Sidibé', number: 30, position: 'MID', isStarter: true, playerId: 'fifa-1qvfjm7' },
      { name: 'Valter Monteiro', number: 35, position: 'MID', isStarter: true, playerId: 'valter-monteiro' },
      { name: 'Nayan', number: 1, position: 'GK', isStarter: false, playerId: 'fifa-1pkwt84' },
      { name: 'Janderson', number: 6, position: 'MID', isStarter: false, playerId: 'janderson-wiliete' },
      { name: 'Gibelé', number: 11, position: 'FWD', isStarter: false, playerId: 'fifa-1jsj8t3' },
      { name: 'Balsa', number: 15, position: 'DEF', isStarter: false, playerId: 'fifa-1jjfij0' },
      { name: 'Ning', number: 25, position: 'FWD', isStarter: false, playerId: 'fifa-1jwu0l8' },
      { name: 'Nelo', number: 26, position: 'DEF', isStarter: false, playerId: 'fifa-1jz4n21' },
      { name: 'Julinho', number: 29, isStarter: false, playerId: 'julinho-wiliete' },
      { name: 'Célio Zua', number: 32, position: 'MID', isStarter: false, playerId: 'fifa-1m95s64' },
      { name: 'César Cangué', number: 34, position: 'FWD', isStarter: false, playerId: 'fifa-1k36hf0' },
    ],
  },
});
