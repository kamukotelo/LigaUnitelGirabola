// 6.ª jornada · GD Interclube–Sagrada Esperança
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-6-5',
  round: 6,
  homeTeamId: 'interclube',
  awayTeamId: 'sagrada',
  schedule: { date: '2026-10-10T15:00:00+01:00', stadium: 'Estádio 22 de Junho', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa final da 6.ª jornada (28/09/2026)' },
  // Resultado recebido a 10/10/2026: golos aos 11' (Sagrada, 0-1) e 15' (Interclube,
  // 1-1); marcadores por confirmar no relatório do árbitro.
  result: { status: 'finished', homeScore: 1, awayScore: 1, halfTimeScore: '1-1', updatedAt: '2026-10-10T16:55:00+01:00' },
  // Marcadores em branco até à confirmação oficial (listados em PENDING_SCORERS).
  events: [
    { minute: 11, type: 'goal', team: 'away', player: '', detail: '0-1' },
    { minute: 15, type: 'goal', team: 'home', player: '', detail: '1-1' },
  ],
  // Nomeação de arbitragem recebida a 10/10/2026.
  officials: { referee: 'Bernardo Kenge Mário', assistants: ['João Manuel Fula António', 'António Domingos Miguel'], fourth: 'Alberto Henrique F. Bartolomeu' },
});
