// 9.ª jornada · Estrela 1.º de Maio–FC Luanda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-9-6',
  round: 9,
  homeTeamId: 'primeiromaio',
  awayTeamId: 'fcluanda',
  schedule: { date: '2026-11-01T15:30:00+01:00', stadium: 'Estádio Municipal de Benguela', scheduleStatus: 'official', source: 'DCE/ANCAF, 05/10/2026: sem transmissão televisiva (Rádio 5)' },
  // Resultado recebido a 01/11/2026 (aguarda o relatório do árbitro). Os golos dos 64' («Domingos dos
  // Santos») e 66' («Francisco Armando») ficam sem jogador: os nomes não constam dos plantéis inscritos.
  result: { status: 'finished', homeScore: 2, awayScore: 1, halfTimeScore: '1-0', updatedAt: '2026-11-01T19:28:00+01:00' },
  events: [
    { minute: 9, type: 'goal', team: 'home', player: 'Deninho', number: 14, playerId: 'fifa-1mqvbd5', detail: '1-0' },
    { minute: 64, type: 'goal', team: 'home', player: '', detail: '2-0' },
    { minute: 66, type: 'goal', team: 'away', player: '', detail: '2-1' },
  ],
  // Estádio da lista oficial de estádios das equipas (28/09/2026).
  // Equipa de arbitragem do «Lineup Geral» oficial (01/11/2026; nomes completos das fichas anteriores).
  officials: { referee: 'Gilberto Bernardino Kativa', assistants: ['Estanislau Guedes Tavares Muluta Prata', 'Jeremias Sessenta Cafussa'], fourth: 'Maria Tchimbumba Mumboke' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (01/11/2026).
  // Ligações a jogadores apenas quando o nome já está confirmado em fichas anteriores ou no plantel inscrito.
  coaches: { home: 'João Fortuna', away: 'Rui Santos' },
  lineups: {
    home: [
      { name: 'Michel', number: 12, position: 'GK', isStarter: true },
      { name: 'Márcio', number: 7, position: 'DEF', isStarter: true, playerId: 'fifa-1jyn4k6' },
      { name: 'Moisés', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1k1hkv2' },
      { name: 'Bicho', number: 6, position: 'MID', isStarter: true, playerId: 'fifa-1jxhxl1' },
      { name: 'Nixon', number: 11, isStarter: true, playerId: 'nixon-primeiromaio' },
      { name: 'Deninho', number: 14, position: 'MID', isStarter: true, playerId: 'fifa-1mqvbd5' },
      { name: 'Tchutchu', number: 22, position: 'MID', isStarter: true, playerId: 'fifa-1nb4bp9' },
      { name: 'Balaka', number: 24, position: 'DEF', isStarter: true, playerId: 'fifa-1jz4j23' },
      { name: 'Dani', number: 28, position: 'DEF', isStarter: true, playerId: 'fifa-1lsutx8' },
      { name: 'Maninho', number: 29, isStarter: true },
      { name: 'Messito', number: 34, position: 'MID', isStarter: true, playerId: 'fifa-1malez5' },
      { name: 'Super', number: 1, position: 'GK', isStarter: false, playerId: 'fifa-1k1sg53' },
      { name: 'Tadeu', number: 3, position: 'MID', isStarter: false, playerId: 'fifa-1navzj4' },
      { name: 'Deco', number: 9, position: 'FWD', isStarter: false, playerId: 'fifa-1jsrcp9' },
      { name: 'Marcos', number: 17, isStarter: false, playerId: 'marquinhos-primeiromaio' },
      { name: 'Luís Profi', number: 19, position: 'MID', isStarter: false, playerId: 'fifa-1kztk20' },
      { name: 'Jesus Moloko', number: 21, isStarter: false, playerId: 'jesus-moloko-primeiromaio' },
      { name: 'Edú', number: 26, position: 'DEF', isStarter: false, playerId: 'fifa-1jz4fg4' },
      { name: 'Ngala', number: 33, position: 'DEF', isStarter: false, playerId: 'fifa-1nb49x0' },
      { name: 'Kimich', number: 37, position: 'MID', isStarter: false, playerId: 'fifa-1kf4ix9' },
    ],
    away: [
      { name: 'Patrício', number: 12, position: 'GK', isStarter: true, playerId: 'fifa-1l7wk59' },
      { name: 'Filipe', number: 17, position: 'DEF', isStarter: true, playerId: 'fifa-1k2wth5' },
      { name: 'Viegas', number: 2, isStarter: true },
      { name: 'Motivado', number: 7, position: 'MID', isStarter: true, playerId: 'fifa-1liwnq8' },
      { name: 'Cabeto', number: 8, position: 'MID', isStarter: true, playerId: 'fifa-1ljudk2' },
      { name: 'Kaba', number: 11, isStarter: true },
      { name: 'Franck', number: 14, isStarter: true },
      { name: 'Gabriel', number: 21, isStarter: true, playerId: 'gabriel-cavalcante-fcluanda' },
      { name: 'Célio', number: 26, position: 'MID', isStarter: true, playerId: 'fifa-1qw3z14' },
      { name: 'Batista', number: 27, position: 'MID', isStarter: true, playerId: 'fifa-1v0ca42' },
      { name: 'Jaime', number: 30, position: 'MID', isStarter: true, playerId: 'fifa-1qw9vb1' },
      { name: 'Deo', number: 22, position: 'GK', isStarter: false, playerId: 'fifa-1l7w9k9' },
      { name: 'Francês', number: 3, isStarter: false },
      { name: 'Chiquinho', number: 9, position: 'FWD', isStarter: false, playerId: 'fifa-1l11132' },
      { name: 'Denilson', number: 10, position: 'FWD', isStarter: false, playerId: 'fifa-1l7lph0' },
      { name: 'Noé', number: 16, position: 'MID', isStarter: false, playerId: 'fifa-1m8xdu3' },
      { name: 'Dolimenga', number: 19, isStarter: false },
      { name: 'Miguel', number: 23, position: 'MID', isStarter: false, playerId: 'fifa-1l064e1' },
      { name: 'D Paiza', number: 24, isStarter: false },
      { name: 'Edmilson', number: 25, isStarter: false },
    ],
  },
});
