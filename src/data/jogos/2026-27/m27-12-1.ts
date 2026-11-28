// 12.ª jornada · Recreativo do Libolo–CR Caála
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-12-1',
  round: 12,
  homeTeamId: 'libolo',
  awayTeamId: 'caala',
  schedule: { date: '2026-11-28T15:00:00+01:00', stadium: 'Estádio Mário Pacheco', scheduleStatus: 'official', source: 'Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026' },
  // Estádio da lista oficial de estádios das equipas (28/09/2026).
  // Resultado: captura da Sofascore enviada pelo utilizador (28/11/2026, 20:31): 2-3, intervalo 1-1.
  // A captura só mostra 4 golos para um 2-3: Robson 12' (1-0), Valegol 42' (1-1), autogolo de Putchu 90'+2 a favor
  // do Libolo (2-1) e Aisson 90'+4 (2-2). Falta o 3.º golo do Caála: fica por identificar, sem minuto, até ao relatório.
  result: { status: 'finished', homeScore: 2, awayScore: 3, halfTimeScore: '1-1', updatedAt: '2026-11-28T20:31:00+01:00' },
  events: [
    { minute: 12, type: 'goal', team: 'home', player: 'Robson', number: 9, playerId: 'robson-libolo', detail: '1-0' },
    { minute: 42, type: 'goal', team: 'away', player: 'Valegol', number: 9, playerId: 'fifa-1k0r4w6', detail: '1-1' },
    { minute: 92, type: 'goal', team: 'home', player: 'Putchu', ownGoal: true, detail: "90'+2 · autogolo · 2-1" },
    { minute: 94, type: 'goal', team: 'away', player: 'Aisson', number: 10, playerId: 'fifa-1jwgzb2', detail: "90'+4 · 2-2" },
    { type: 'goal', team: 'away', player: 'Por identificar', detail: '3.º golo do Caála (não consta da captura) · 2-3' },
  ],
});
