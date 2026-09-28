// 5.ª jornada · Desportivo da Huíla–Académica do Lobito
// 5.ª jornada · 20/09/2026 · Desportivo da Huíla 1-0 Académica do Lobito (resultado final; ficha oficial por confirmar)
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-5-4',
  round: 5,
  homeTeamId: 'desphuila',
  awayTeamId: 'lobito',
  schedule: { date: '2026-09-20T15:30:00+01:00', stadium: 'Estádio da Tundavala', scheduleStatus: 'official' },
  result: { status: 'finished', homeScore: 1, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-09-20T17:45:00+01:00' },
  events: [
    { minute: 90, type: 'goal', team: 'home', player: 'João Baptista Ferraz Samazanga Juny', number: 34, playerId: 'joao-samazanga-huila', detail: "90' (1-0)" },
  ],
});
