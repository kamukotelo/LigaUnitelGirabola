// 5.ª jornada · Kabuscorp SC–GD Interclube
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-5-7',
  round: 5,
  homeTeamId: 'kabuscorp',
  awayTeamId: 'interclube',
  schedule: { date: '2026-09-20T15:00:00+01:00', stadium: 'Estádio França Ndalu', scheduleStatus: 'official', broadcaster: 'Zsports' },
  // Relatório do Árbitro n.º 39 (20/09/2026). A ficha só traz a convocatória do
  // Kabuscorp; o GD Interclube ainda não tinha jogadores inscritos no relatório.
  officials: {
    referee: 'Miguel Julião Mateus',
    assistants: ['Ivanildo Meirelles de Oliveira Sanches Lopes', 'João Manuel Fula António'],
    fourth: 'Sabino Garcez de Sousa de Carvalho',
    commissioner: 'José Leopoldo Braga Mavunza',
  },
  coaches: { home: 'Leonardo Martins Neiva' },
  lineups: {
    home: [
      { name: 'Brudel Efonge Liyongo', number: 1, position: 'GK', isStarter: true },
      { name: 'Henock Mangindula', number: 16, position: 'DEF', isStarter: true, isCaptain: true, playerId: 'fifa-1mppsb5' },
      { name: 'Zamorano Lopes', number: 2, position: 'DEF', isStarter: true, playerId: 'fifa-1k4a836' },
      { name: 'Eliseu', number: 3, position: 'DEF', isStarter: true, playerId: 'fifa-1jyp8v8' },
      { name: 'Saombe Jorge', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1snb179' },
      { name: 'Abed Zito Mungomba', number: 6, isStarter: true },
      { name: 'Bayala Nsimba', number: 7, position: 'FWD', isStarter: true, playerId: 'fifa-1n3uhm6' },
      { name: 'José Vunge', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1k2pk58' },
      { name: 'Teodoro Correia', number: 11, position: 'DEF', isStarter: true, playerId: 'fifa-1lgpb81' },
      { name: 'Joaquim Paciencia', number: 19, position: 'FWD', isStarter: true, playerId: 'fifa-1jm8hd7' },
      { name: 'Diógenes João', number: 32, position: 'MID', isStarter: true, playerId: 'fifa-1jrtxh4' },
      { name: 'Adair Domingos', number: 4, position: 'DEF', isStarter: false, playerId: 'fifa-1lgpgy7' },
      { name: 'Mbali Sem', number: 8, position: 'MID', isStarter: false, playerId: 'fifa-1v363a9' },
      { name: 'João de Nascimento', number: 12, position: 'GK', isStarter: false, playerId: 'fifa-1jriue5' },
      { name: 'Artur Malungo', number: 14, position: 'DEF', isStarter: false, playerId: 'fifa-1k1sen7' },
      { name: 'Daniel Kilola', number: 15, position: 'MID', isStarter: false, playerId: 'fifa-1jm7zr2' },
      { name: 'Mankoka Afonso', number: 18, position: 'FWD', isStarter: false, playerId: 'fifa-1jrku39' },
      { name: 'Nathan Mutombo Beto', number: 23, isStarter: false },
      { name: 'Tresor Nona', number: 25, position: 'FWD', isStarter: false, playerId: 'fifa-1snez57' },
      { name: 'Jorge Pinto', number: 35, position: 'MID', isStarter: false, playerId: 'fifa-1tgwgg5' },
    ],
    away: [],
  },
});
