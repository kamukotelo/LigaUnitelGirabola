// 6.ª jornada · Estrela 1.º de Maio–Bravos do Maquis
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-6-3',
  round: 6,
  homeTeamId: 'primeiromaio',
  awayTeamId: 'bravos',
  schedule: { date: '2026-10-11T15:30:00+01:00', stadium: 'Estádio Municipal de Benguela', scheduleStatus: 'official', source: 'Mapa final da 6.ª jornada (28/09/2026)' },
  // Nomeação de arbitragem recebida a 11/10/2026.
  officials: { referee: 'Ailton Jeovane Quissanga Carmelino', assistants: ['Ivanildo Meireles de Oliveira Sanches Lopes', 'Nery Domingos Pereira Amador da Silva'], fourth: 'Nuno Eduardo Sumbo' },
  // Marcador ao vivo recebido a 11/10/2026 (84'); falta o resultado final.
  // «Cláudio Sozinho» não consta do plantel do 1.º de Maio (ver também m27-5-5 55').
  result: { status: 'live', homeScore: 1, awayScore: 2, halfTimeScore: '1-1', updatedAt: '2026-10-11T17:10:00+01:00' },
  events: [
    { minute: 13, type: 'goal', team: 'away', player: 'Ngala', number: 33, playerId: 'fifa-1nb49x0', ownGoal: true, detail: 'Autogolo · 0-1' },
    { minute: 22, type: 'goal', team: 'home', player: 'Cláudio Sozinho', detail: '1-1' },
    { minute: 57, type: 'goal', team: 'away', player: 'Fota', number: 15, playerId: 'tiago-bravos', detail: '1-2' },
  ],
  // Estádio da lista oficial de estádios das equipas (28/09/2026).
});
