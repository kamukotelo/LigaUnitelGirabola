// 4.ª jornada · Recreativo do Libolo–Estrela 1.º de Maio
// 4.ª jornada · 12/09/2026 · Estádio Municipal de Calulo
// 4.ª jornada · 12/09/2026 · Recreativo do Libolo 2-1 Estrela 1.º de Maio
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-4-8',
  round: 4,
  homeTeamId: 'libolo',
  awayTeamId: 'primeiromaio',
  schedule: { date: '2026-09-12T15:00:00+01:00', stadium: 'Estádio Municipal de Calulo', scheduleStatus: 'official' },
  result: { status: 'finished', homeScore: 2, awayScore: 1, halfTimeScore: '2-1', updatedAt: '2026-09-12T17:00:00+01:00' },
  coaches: { home: 'Osvaldo Roque', away: 'Águas da Silva' },
  events: [
    { minute: 7, type: 'goal', team: 'away', player: 'Tchutchu', number: 22, playerId: 'fifa-1nb4bp9', detail: "7' (0-1)" },
    { minute: 17, type: 'goal', team: 'home', player: 'Mestre Gui', playerId: 'mestre-gui-libolo', detail: "17' (1-1)" },
    { minute: 38, type: 'goal', team: 'home', player: 'Pedro Mendes', number: 17, playerId: 'pedro-libolo', detail: "38' (2-1)" },
  ],
});
