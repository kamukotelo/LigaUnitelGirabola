// 5.ª jornada · Estrela 1.º de Maio–Desportivo da Lunda Sul
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-5-5',
  round: 5,
  homeTeamId: 'primeiromaio',
  awayTeamId: 'lundasul',
  schedule: { date: '2026-09-21T15:30:00+01:00', stadium: 'Campo Municipal (Benguela)', scheduleStatus: 'official' },
  // Relatório do Árbitro n.º 37 (20/09/2026): o jogo realiza-se no Campo
  // Municipal (Benguela) e não no Estádio de São Filipe do calendário.
  result: { status: 'finished', homeScore: 1, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-09-21T18:22:00+01:00' },
  officials: {
    referee: 'Nelson Agostinho da Silva',
    assistants: ['Domingos Jacinto Francisco Ferreira', 'Lourenço Manuel João'],
    fourth: 'Maria Tchimbumba Mumboke',
    commissioner: 'Manuel André António',
  },
  events: [
    // Fonte de resultados (21/09/2026, 18:22): expulsão na Lunda Sul aos 30' sem
    // jogador identificado, e o golo assinado por «Cláudio» — alcunha que não
    // consta do plantel oficial do 1.º de Maio. Confirmar ambos na ficha da FAF.
    { minute: 30, type: 'red', team: 'away', player: '' },
    { minute: 55, type: 'goal', team: 'home', player: 'Cláudio', detail: '1-0' },
  ],
  stats: {
    // A fonte publica ainda pontapés de baliza (3-6), métrica sem campo no registo.
    home: { corners: 5, redCards: 0 },
    away: { corners: 3, redCards: 1 },
    keys: ['corners', 'redCards'],
  },
});
