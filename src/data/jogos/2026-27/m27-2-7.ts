// 2.ª jornada · Estrela 1.º de Maio–CD 1.º de Agosto
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-2-7',
  round: 2,
  homeTeamId: 'primeiromaio',
  awayTeamId: 'dago',
  schedule: { date: '2026-08-27T15:30:00+01:00', stadium: 'Estádio de São Filipe', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'finished', homeScore: 1, awayScore: 2, halfTimeScore: '0-1', updatedAt: '2026-09-06T17:50:00+01:00' },
  officials: { referee: 'Chitano Domingos Francisco', assistants: ['Wilson Valdmiro Ntyamba', 'Andália Bimbi Francisco Jeremias'], fourth: 'Flamel Victorino Matos', commissioner: 'José Leopoldo Braga Mavunza' },
  coaches: { home: 'Águas da Silva', away: 'Filipe Nzanza' },
  events: [
    { minute: 24, type: 'goal', team: 'away', player: 'Axel', playerId: 'axel-dago', detail: '0-1' },
    { minute: 43, type: 'yellow', team: 'away', player: 'Axel', playerId: 'axel-dago', detail: 'Agarrou o adversário' },
    { minute: 44, type: 'yellow', team: 'home', player: 'Paulo Mutossi', playerId: 'fifa-1jz4j23' },
    { minute: 45, type: 'yellow', team: 'away', player: 'Milton', playerId: 'milton-dago', detail: 'Rasteirou o adversário' },
    { minute: 72, type: 'goal', team: 'home', player: 'Luís Profi', playerId: 'luis-profi-primeiromaio', detail: '1-1' },
    { minute: 75, type: 'goal', team: 'away', player: 'Dagó Tshibamba', playerId: 'dago-tshibamba', detail: '1-2' },
    { minute: 81, type: 'yellow', team: 'home', player: 'Moisés Domingos', playerId: 'fifa-1k1hkv2', detail: 'Agarrar o adversário' },
  ],
  stats: {
    home: { corners: 0, saves: 0, yellowCards: 2, redCards: 0 },
    away: { corners: 0, saves: 0, yellowCards: 2, redCards: 0 },
    keys: ['corners', 'saves', 'yellowCards', 'redCards'],
  },
});
