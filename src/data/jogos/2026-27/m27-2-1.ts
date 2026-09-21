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
  events: [
    { minute: 32, type: 'goal', team: 'home', player: 'Valegol', playerId: 'valegol-caala', detail: 'Grande penalidade · 1-0' },
    { minute: 34, type: 'goal', team: 'away', player: 'Bello Lukman', playerId: 'bello-lukman-wiliete', detail: '1-1' },
    { minute: 44, type: 'red', team: 'home', player: 'Valegol', playerId: 'valegol-caala' },
    { minute: 49, type: 'goal', team: 'away', player: 'Ning', playerId: 'fifa-1jwu0l8', detail: '1-2' },
  ],
  stats: {
    home: { redCards: 1 },
    away: { redCards: 0 },
    keys: ['redCards'],
  },
});
