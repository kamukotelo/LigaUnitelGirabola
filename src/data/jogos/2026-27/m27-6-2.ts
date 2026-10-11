// 6.ª jornada · Académica do Lobito–CD 1.º de Agosto
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-6-2',
  round: 6,
  homeTeamId: 'lobito',
  awayTeamId: 'dago',
  schedule: { date: '2026-10-11T15:00:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa final da 6.ª jornada (28/09/2026)' },
  // A Académica recebe no Estádio Nacional de Ombaka (indicação de 28/09/2026).
  // Nomeação de arbitragem recebida a 11/10/2026.
  officials: { referee: 'Gilberto Bernardino Kativa', assistants: ['Estanislau Guedes Tavares Muluta Prata', 'Jeremias Sessenta Cafussa'], fourth: 'Flamel Victorino Matos' },
  // Resultado recebido a 11/10/2026 (aguarda o relatório do árbitro).
  result: { status: 'finished', homeScore: 1, awayScore: 1, halfTimeScore: '1-0', updatedAt: '2026-10-11T17:00:00+01:00' },
  events: [
    { minute: 7, type: 'goal', team: 'home', player: 'António', number: 19, playerId: 'antonio-lobito', detail: '1-0' },
    { minute: 81, type: 'goal', team: 'away', player: 'Obed', number: 14, playerId: 'obed-dago', detail: '1-1' },
  ],
  // Constituição das equipas (folha oficial da DCE/ANCAF, 11/10/2026).
  coaches: { home: 'Silvestre Pelé', away: 'Filipe Nzanza' },
  lineups: {
    home: [
      { name: 'Muhango', number: 12, position: 'GK', isStarter: true, playerId: 'guilherme-lobito' },
      { name: 'Ezequiel', number: 10, position: 'MID', isStarter: true, playerId: 'ezequiel-lobito' },
      { name: 'Nanga', number: 3, position: 'DEF', isStarter: true, playerId: 'nanga-lobito' },
      { name: 'Lourenço', number: 5, position: 'MID', isStarter: true, playerId: 'lourenco-lobito' },
      { name: 'Januário', number: 7, position: 'MID', isStarter: true, playerId: 'januario-lobito' },
      { name: 'Quiteque', number: 8, position: 'MID', isStarter: true, playerId: 'quiteque-lobito' },
      { name: 'Calela', number: 13, position: 'DEF', isStarter: true, playerId: 'fifa-1jrj1l5' },
      { name: 'Guilherme', number: 18, isStarter: true },
      { name: 'António', number: 19, position: 'FWD', isStarter: true, playerId: 'antonio-lobito' },
      { name: 'Farrada', number: 26, position: 'DEF', isStarter: true, playerId: 'fifa-1nc8yh3' },
      { name: 'Valério', number: 29, position: 'MID', isStarter: true, playerId: 'valerio-lobito' },
      { name: 'Sebastião', number: 30, isStarter: false },
      { name: 'Joel', number: 2, position: 'DEF', isStarter: false, playerId: 'joel-lobito' },
      { name: 'Elieve', number: 9, isStarter: false },
      { name: 'Florentino', number: 11, position: 'FWD', isStarter: false, playerId: 'kaporal' },
      { name: 'Vidal', number: 20, isStarter: false },
      { name: 'Jorge', number: 28, position: 'DEF', isStarter: false, playerId: 'jorge-28-lobito' },
      { name: 'Luís Panda', number: 31, position: 'MID', isStarter: false, playerId: 'fifa-1l60xh8' },
      { name: 'Didi Craque', number: 32, isStarter: false },
      { name: 'João Chimema', number: 37, isStarter: false },
    ],
    away: [
      { name: 'Nuno', number: 1, position: 'GK', isStarter: true, playerId: 'nuno-dago' },
      { name: 'Bonifácio', number: 5, position: 'DEF', isStarter: true, playerId: 'bonifacio-dago' },
      { name: 'Milton', number: 2, position: 'DEF', isStarter: true, playerId: 'milton-dago' },
      { name: 'Mabelé', number: 3, position: 'DEF', isStarter: true, playerId: 'simao-dianzenza' },
      { name: 'Axel', number: 8, position: 'FWD', isStarter: true, playerId: 'axel-dago' },
      { name: 'Calebi Yanda', number: 10, position: 'MID', isStarter: true, playerId: 'calebi-dago' },
      { name: 'Fernando', number: 11, position: 'FWD', isStarter: true, playerId: 'fernando-dago' },
      { name: 'Venâncio', number: 15, position: 'MID', isStarter: true, playerId: 'venancio-dago' },
      { name: 'Macaia', number: 16, position: 'DEF', isStarter: true, playerId: 'macaia-dago' },
      { name: 'Dagó', number: 17, position: 'FWD', isStarter: true, playerId: 'dago-tshibamba' },
      { name: 'Félix Bulaya', number: 28, position: 'DEF', isStarter: true, playerId: 'bulaya-dago' },
      { name: 'Anselmo', number: 22, position: 'GK', isStarter: false, playerId: 'anselmo-dago' },
      { name: 'Bruno', number: 6, position: 'FWD', isStarter: false, playerId: 'bruno-dago' },
      { name: 'Mabilson', number: 7, position: 'MID', isStarter: false, playerId: 'mabilson-dago' },
      { name: 'Obed', number: 14, position: 'FWD', isStarter: false, playerId: 'obed-dago' },
      { name: 'Clíver', number: 18, position: 'MID', isStarter: false, playerId: 'cliver-dago' },
      { name: 'Paxe', number: 19, isStarter: false, playerId: 'fifa-1pxu511' },
      { name: 'Tombé', number: 20, position: 'MID', isStarter: false, playerId: 'tombe-dago' },
      { name: 'Paulo', number: 21, isStarter: false },
      { name: 'Luciano', number: 25, isStarter: false, playerId: 'fifa-1v12ek6' },
    ],
  },
});
