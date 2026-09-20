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
  officials: {
    referee: 'Nelson Agostinho da Silva',
    assistants: ['Domingos Jacinto Francisco Ferreira', 'Lourenço Manuel João'],
    fourth: 'Maria Tchimbumba Mumboke',
    commissioner: 'Manuel André António',
  },
});
