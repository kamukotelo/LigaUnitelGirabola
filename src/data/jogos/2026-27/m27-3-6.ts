// 3.ª jornada · CD 1.º de Agosto–GD Interclube
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-3-6',
  round: 3,
  homeTeamId: 'dago',
  awayTeamId: 'interclube',
  schedule: { date: '2026-09-01T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'finished', homeScore: 2, awayScore: 1, halfTimeScore: '0-1', updatedAt: '2026-09-01T18:00:00+01:00' },
  officials: { referee: 'Edson António Esoko', assistants: ['Jerson Emiliano dos Santos', 'Estanislau Guedes Tavares Muluta Prata'], fourth: 'Sanda Mateus Miguel Kitu', commissioner: 'Venâncio Matos' },
  coaches: { home: 'Filipe Nzanza', away: 'Divaldo Alves' },
  events: [
    { minute: 34, type: 'yellow', team: 'home', player: 'Venâncio', playerId: 'venancio-dago', detail: 'Rasteirar o adversário' },
    { minute: 45, type: 'goal', team: 'away', player: 'Alexandre Fernando', playerId: 'alexandre-fernando-interclube', detail: "Grande penalidade · 45'+5 (0-1)" },
    { minute: 56, type: 'yellow', team: 'away', player: 'Edivaldo Quinanga', playerId: 'fifa-1jtuys4', detail: 'Rasteirar o adversário' },
    { minute: 77, type: 'yellow', team: 'home', player: 'Felix Bulaya', playerId: 'bulaya-dago', detail: 'Rasteirar o adversário' },
    { minute: 79, type: 'goal', team: 'home', player: 'Dagó Tshibamba', playerId: 'dago-tshibamba', detail: '1-1' },
    { minute: 90, type: 'goal', team: 'home', player: 'Calebi Yanda', playerId: 'fifa-1jm8058', detail: '2-1' },
  ],
  stats: {
    home: { corners: 4, yellowCards: 2, redCards: 0 },
    away: { corners: 4, yellowCards: 1, redCards: 0 },
    keys: ['corners', 'yellowCards', 'redCards'],
  },
});
