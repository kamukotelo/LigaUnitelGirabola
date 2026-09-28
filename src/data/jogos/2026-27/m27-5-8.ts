// 5.ª jornada · São Salvador–FC Cabinda
// 5.ª jornada · 20/09/2026 · São Salvador 0-0 FC Cabinda (resultado final)
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-5-8',
  round: 5,
  homeTeamId: 'saosalvador',
  awayTeamId: 'cabinda',
  schedule: { date: '2026-09-20T15:00:00+01:00', stadium: 'Estádio Álvaro Buta', scheduleStatus: 'official' },
  result: { status: 'finished', homeScore: 0, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-09-20T18:05:00+01:00' },
  // Relatório do Árbitro n.º 36 (20/09/2026). A ficha só traz a convocatória do
  // FC Cabinda; o São Salvador ainda não tinha jogadores inscritos no relatório.
  officials: {
    referee: 'Sanda Mateus Miguel Kitu',
    assistants: ['António Domingos Miguel', 'Natarino António Soares'],
    fourth: 'Bernardo Kenge Mário',
    commissioner: 'João Amado Muanda Goma',
  },
  lineups: {
    home: [],
    away: [
      { name: 'João Eduardo', number: 1, position: 'GK', isStarter: true, playerId: 'cabinda-player-1' },
      { name: 'Rodrigo', number: 2, position: 'DEF', isStarter: true, isCaptain: true, playerId: 'rodrigo-cabinda' },
      { name: 'Francisco Luemba', number: 4, position: 'DEF', isStarter: true, playerId: 'fifa-1qtzy92' },
      { name: 'Marcos', number: 5, position: 'DEF', isStarter: true, playerId: 'marcos-cabinda' },
      { name: 'Luyeye Tomás', number: 13, position: 'MID', isStarter: true, playerId: 'luyeye-cabinda' },
      { name: 'Cornélio', number: 15, position: 'MID', isStarter: true, playerId: 'cornelio-cabinda' },
      { name: 'Júlio Mavungo André', number: 17, position: 'DEF', isStarter: true, playerId: 'julio-cabinda' },
      { name: 'Fernando', number: 21, position: 'MID', isStarter: true, playerId: 'fernando-cabinda' },
      { name: 'Mário da Silva', number: 24, position: 'MID', isStarter: true, playerId: 'fifa-1ljjyh4' },
      { name: 'Ariclenis Afonso Araújo Lede', number: 29, position: 'FWD', isStarter: true, playerId: 'ariclenis-cabinda' },
      { name: 'Pedro da Silva', number: 30, position: 'FWD', isStarter: true, playerId: 'pedro-da-silva-cabinda' },
      { name: 'Gedeon', number: 3, position: 'FWD', isStarter: false, playerId: 'gedeon-cabinda' },
      { name: 'Cristiano Malonda', number: 8, position: 'MID', isStarter: false, playerId: 'cristiano-cabinda' },
      { name: 'Francisco', number: 12, position: 'GK', isStarter: false, playerId: 'francisco-cabinda' },
      { name: 'João Cambo', number: 25, position: 'DEF', isStarter: false, playerId: 'joao-cambo-cabinda' },
      { name: 'Jaime', number: 26, position: 'MID', isStarter: false, playerId: 'jaime-cabinda' },
      { name: 'Efraim Rosário Sabi Kadima', number: 37, isStarter: false },
      { name: 'Neves Paulo Osvaldo', number: 38, isStarter: false },
      { name: 'António Alberto Sumbo Luemba', number: 39, isStarter: false },
    ],
  },
});
