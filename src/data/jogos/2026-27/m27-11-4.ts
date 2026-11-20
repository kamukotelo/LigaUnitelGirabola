// 11.ª jornada · São Salvador–CD 1.º de Agosto
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-11-4',
  round: 11,
  homeTeamId: 'saosalvador',
  awayTeamId: 'dago',
  schedule: { date: '2026-11-20T15:30:00+01:00', stadium: 'Estádio Álvaro Buta', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026' },
  // Nomeação de árbitros, jogo n.º 81 (mensagem enviada pelo utilizador, 19/11/2026); nomes completos dos registos anteriores.
  officials: { referee: 'Donaciano Mulumba', assistants: ['Alzandre Diógenes Muiamba Capola', 'Manuel Dulo Cabaça'], fourth: 'Garcia Luhamo Remos' },
  // Constituição das Equipas (PDF DCE/ANCAF, «Lineup Geral 11.ª J», recebido a 20/11/2026): 11 titulares e 9 suplentes
  // por equipa, treinadores e árbitros iguais à nomeação. A ficha não marca capitães. Ligação ao plantel pela camisola e
  // nome dos jogos anteriores; sem ligação quando a camisola já pertenceu a outro jogador (Gui #4, Zenilson #2,
  // Jeremias #9, Paquetá #36) ou nunca foi ligada (Mano #31, Okita #23).
  coaches: { home: 'Silva Kussanda', away: 'Filipe Nzanza' },
  lineups: {
    home: [
      { name: 'Mano', number: 31, position: 'GK', isStarter: true },
      { name: 'Kimuanga', number: 20, position: 'DEF', isStarter: true, playerId: 'fifa-1ljvxk1' },
      { name: 'Gui', number: 4, isStarter: true },
      { name: 'Benny Papel', number: 7, position: 'FWD', isStarter: true, playerId: 'fifa-1k1sev5' },
      { name: 'Ary Pirica', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1jrutw6' },
      { name: 'Ramilton', number: 13, position: 'DEF', isStarter: true, playerId: 'fifa-1lih5k4' },
      { name: 'Lukinhas', number: 17, position: 'FWD', isStarter: true, playerId: 'fifa-1lih3r9' },
      { name: 'Samuel', number: 21, position: 'FWD', isStarter: true, playerId: 'fifa-1k2pdb8' },
      { name: 'Eduardo Moyo', number: 22, position: 'MID', isStarter: true, playerId: 'fifa-1k1sm82' },
      { name: 'Germano', number: 24, position: 'DEF', isStarter: true, playerId: 'germano-fumela-saosalvador' },
      { name: 'Artur Firmino', number: 34, position: 'DEF', isStarter: true, playerId: 'fifa-1liwqf9' },
      { name: 'Gelson', number: 12, position: 'GK', isStarter: false, playerId: 'fifa-1jtv5a6' },
      { name: 'Zenilson', number: 2, isStarter: false },
      { name: 'Bigo', number: 6, position: 'MID', isStarter: false, playerId: 'fifa-1lih506' },
      { name: 'João Vala', number: 8, position: 'MID', isStarter: false, playerId: 'fifa-1k39my6' },
      { name: 'Jeremias', number: 9, isStarter: false },
      { name: 'Okita', number: 23, isStarter: false },
      { name: 'Wilson', number: 25, position: 'DEF', isStarter: false, playerId: 'fifa-1sr5rk8' },
      { name: 'Anderson Mputa', number: 26, position: 'FWD', isStarter: false, playerId: 'fifa-1k2pyw6' },
      { name: 'Paquetá', number: 36, isStarter: false },
    ],
    away: [
      { name: 'Anselmo', number: 22, position: 'GK', isStarter: true, playerId: 'anselmo-dago' },
      { name: 'Bonifácio', number: 5, position: 'DEF', isStarter: true, playerId: 'bonifacio-dago' },
      { name: 'Milton', number: 2, position: 'DEF', isStarter: true, playerId: 'milton-dago' },
      { name: 'Bruno', number: 6, position: 'FWD', isStarter: true, playerId: 'bruno-dago' },
      { name: 'Mabilson', number: 7, position: 'MID', isStarter: true, playerId: 'mabilson-dago' },
      { name: 'Axel', number: 8, position: 'MID', isStarter: true, playerId: 'axel-dago' },
      { name: 'Rupson', number: 9, position: 'FWD', isStarter: true, playerId: 'rupson-dago' },
      { name: 'Fernandinho', number: 11, position: 'FWD', isStarter: true, playerId: 'fernando-dago' },
      { name: 'Venâncio', number: 15, position: 'MID', isStarter: true, playerId: 'venancio-dago' },
      { name: 'Dagó', number: 17, position: 'FWD', isStarter: true, playerId: 'dago-tshibamba' },
      { name: 'Paxe', number: 19, position: 'MID', isStarter: true, playerId: 'fifa-1pxu511' },
      { name: 'Diego', number: 12, position: 'GK', isStarter: false, playerId: 'diego-lopes-dago' },
      { name: 'Mabelé', number: 3, position: 'DEF', isStarter: false, playerId: 'simao-dianzenza' },
      { name: 'Tombé', number: 20, position: 'MID', isStarter: false, playerId: 'tombe-dago' },
      { name: 'Paulo', number: 21, position: 'MID', isStarter: false, playerId: 'paulo-costa-dago' },
      { name: 'Aspirina', number: 23, position: 'MID', isStarter: false, playerId: 'fifa-1pwaay2' },
      { name: 'Luciano', number: 25, position: 'DEF', isStarter: false, playerId: 'fifa-1v12ek6' },
      { name: 'Félix Bulaya', number: 28, position: 'DEF', isStarter: false, playerId: 'bulaya-dago' },
      { name: 'Josué', number: 34, isStarter: false, playerId: 'josue-mungwengi-dago' },
      { name: 'Benção', number: 36, position: 'DEF', isStarter: false, playerId: 'bencao-dago' },
    ],
  },
});
