// 10.ª jornada · FC Luanda–São Salvador
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-10-5',
  round: 10,
  homeTeamId: 'fcluanda',
  awayTeamId: 'saosalvador',
  // Hora 15:00 → 15:30 a pedido do Diretor de Competições (02/11/2026, Emanuel Valodia).
  schedule: { date: '2026-11-08T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026); hora: pedido do Diretor de Competições (02/11/2026), 15:30' },
  // Equipa de arbitragem do «Lineup Geral» oficial (08/11/2026; nomes completos das fichas anteriores).
  // Arbitragem, golos e cartões do Relatório do Árbitro n.º 78 (recebido a 12/11/2026).
  officials: { referee: 'Edilson Roberto Gomes André', assistants: ['Manuel Luís Benguela', 'Joaquim Manuel Chiyo'], fourth: 'Sabino Garcez de Sousa de Carvalho', commissioner: 'Teresa Dukuivaluca Leitão' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (08/11/2026).
  // Público só a partir de 1 h antes do início (embargo de line ups).
  // Sem correspondência no plantel (como na 9.ª jornada): Viegas (n.º 2), Pedro Matendi (n.º 3), Kaba (n.º 11), D Paiza (n.º 24)
  // e Edmilson (n.º 25) do FC Luanda; Gui (n.º 4) e Mano (n.º 31) do São Salvador.
  // Resultado e marcador recebidos a 08/11/2026 (captura da app; relatório do árbitro n.º 78 recebido a 12/11/2026).
  result: { status: 'finished', homeScore: 1, awayScore: 0, halfTimeScore: '1-0', updatedAt: '2026-11-08T17:35:00+01:00' },
  events: [
    { minute: 12, type: 'goal', team: 'home', player: 'Gabriel', number: 21, playerId: 'gabriel-cavalcante-fcluanda', detail: '1-0' },
  ],
  coaches: { home: 'Rui Santos', away: 'Silva Kussanda' },
  lineups: {
    home: [
      { name: 'Patrício', number: 12, position: 'GK', isStarter: true, playerId: 'fifa-1l7wk59' },
      { name: 'Filipe', number: 17, position: 'DEF', isStarter: true, playerId: 'fifa-1k2wth5' },
      { name: 'Viegas', number: 2, isStarter: true },
      { name: 'Motivado', number: 7, position: 'MID', isStarter: true, playerId: 'fifa-1liwnq8' },
      { name: 'Cabeto', number: 8, position: 'MID', isStarter: true, playerId: 'fifa-1ljudk2' },
      { name: 'Kaba', number: 11, isStarter: true },
      { name: 'Domingos', number: 14, position: 'MID', isStarter: true, playerId: 'fifa-1mall47' },
      { name: 'Gabriel', number: 21, isStarter: true, playerId: 'gabriel-cavalcante-fcluanda' },
      { name: 'Batista', number: 27, position: 'MID', isStarter: true, playerId: 'fifa-1v0ca42' },
      { name: 'Jaime', number: 30, position: 'MID', isStarter: true, playerId: 'fifa-1qw9vb1' },
      { name: 'Kano', number: 31, position: 'FWD', isStarter: true, playerId: 'fifa-1malhf8' },
      { name: 'Deo', number: 22, position: 'GK', isStarter: false, playerId: 'fifa-1l7w9k9' },
      { name: 'Pedro Matendi', number: 3, isStarter: false },
      { name: 'Joel', number: 4, position: 'DEF', isStarter: false, playerId: 'fifa-1qhqn96' },
      { name: 'Denilson', number: 10, position: 'FWD', isStarter: false, playerId: 'fifa-1l7lph0' },
      { name: 'Arnaldo', number: 16, position: 'MID', isStarter: false, playerId: 'fifa-1m8xdu3' },
      { name: 'Tiago', number: 18, isStarter: false, playerId: 'thiagos-fcluanda' },
      { name: 'Miguel', number: 23, position: 'MID', isStarter: false, playerId: 'fifa-1l064e1' },
      { name: 'D Paiza', number: 24, isStarter: false },
      { name: 'Edmilson', number: 25, isStarter: false },
    ],
    away: [
      { name: 'Mano', number: 31, isStarter: true },
      { name: 'Gui', number: 4, isStarter: true },
      { name: 'José Garcia', number: 2, position: 'DEF', isStarter: true, playerId: 'fifa-1kz4h82' },
      { name: 'Benny Papel', number: 7, position: 'FWD', isStarter: true, playerId: 'fifa-1k1sev5' },
      { name: 'Ary Pirica', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1jrutw6' },
      { name: 'Ramilton', number: 13, position: 'DEF', isStarter: true, playerId: 'fifa-1lih5k4' },
      { name: 'Lukinhas', number: 17, position: 'FWD', isStarter: true, playerId: 'fifa-1lih3r9' },
      { name: 'Eduardo Moyo', number: 22, position: 'MID', isStarter: true, playerId: 'fifa-1k1sm82' },
      { name: 'Germano', number: 24, position: 'DEF', isStarter: true, playerId: 'germano-fumela-saosalvador' },
      { name: 'Anderson Mputa', number: 26, position: 'FWD', isStarter: true, playerId: 'fifa-1k2pyw6' },
      { name: 'Artur Firmino', number: 34, position: 'DEF', isStarter: true, playerId: 'fifa-1liwqf9' },
      { name: 'Francisco', number: 12, position: 'GK', isStarter: false, playerId: 'fifa-1jtv5a6' },
      { name: 'Bigo', number: 6, position: 'MID', isStarter: false, playerId: 'fifa-1lih506' },
      { name: 'João Vala', number: 8, position: 'MID', isStarter: false, playerId: 'fifa-1k39my6' },
      { name: 'Afonso', number: 9, position: 'FWD', isStarter: false, playerId: 'fifa-1pny3g2' },
      { name: 'Nginakanda', number: 20, position: 'DEF', isStarter: false, playerId: 'fifa-1ljvxk1' },
      { name: 'Samuel', number: 21, position: 'FWD', isStarter: false, playerId: 'fifa-1k2pdb8' },
      { name: 'Jonas Rodrigues', number: 23, position: 'DEF', isStarter: false, playerId: 'fifa-1nizqe4' },
      { name: 'Wilson Tenete', number: 25, position: 'DEF', isStarter: false, playerId: 'fifa-1sr5rk8' },
      { name: 'Lutonda', number: 33, position: 'FWD', isStarter: false, playerId: 'fifa-1lj6z32' },
    ],
  },
});
