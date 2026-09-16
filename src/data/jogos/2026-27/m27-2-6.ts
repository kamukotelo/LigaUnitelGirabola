// 2.ª jornada · Recreativo do Libolo–Bravos do Maquis
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-2-6',
  round: 2,
  homeTeamId: 'libolo',
  awayTeamId: 'bravos',
  schedule: { date: '2026-08-31T15:00:00+01:00', stadium: 'Estádio Municipal de Calulo', scheduleStatus: 'official', broadcaster: 'ZSPORT 1' },
  result: { status: 'finished', homeScore: 0, awayScore: 1, halfTimeScore: '0-0', updatedAt: '2026-08-31T18:40:00+01:00' },
  officials: { referee: 'António Caluassi Dungula', assistants: ['Zacarias Chivanja Calembe', 'Victorino Nangolo Dungula'], fourth: 'Jacinto Isidro Lucas', commissioner: 'Rodrigues Aleixo César' },
  coaches: { home: 'Osvaldo Roque', away: 'Sandro Mendes' },
  events: [
    { minute: 85, type: 'goal', team: 'away', player: 'Higino Kaptingo Epalanga', playerId: 'higino-bravos', detail: '0-1' },
  ],
});
