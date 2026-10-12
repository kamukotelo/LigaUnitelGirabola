// 6.ª jornada · Desportivo da Lunda Sul–FC Cabinda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-6-7',
  round: 6,
  homeTeamId: 'lundasul',
  awayTeamId: 'cabinda',
  schedule: { date: '2026-10-11T15:00:00+01:00', stadium: 'Estádio do Sagrada Esperança', scheduleStatus: 'official', source: 'Comunicado Oficial 012-DCE/ANCAF/2026 (09/10/2026): adiado por força maior para domingo, 11/10, 15:00' },
  // Resultado recebido a 12/10/2026 (aguarda o relatório do árbitro).
  result: { status: 'finished', homeScore: 0, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-10-11T17:00:00+01:00' },
  // Nomeação de arbitragem recebida a 11/10/2026.
  officials: { referee: 'Sanda Mateus Miguel Kitu', assistants: ['Natarino António Soares', 'Nélson Lutumba Quiala'], fourth: 'Donaciano Mulumba' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (11/10/2026).
  // Posições e ligações ao plantel só onde fichas anteriores confirmam o mesmo jogador.
  coaches: { home: 'Maurílio Silva', away: 'Luciano Capoco' },
  lineups: {
    home: [
      { name: 'Kacusso', number: 12, position: 'GK', isStarter: true, playerId: 'cacusso' },
      { name: 'Platiny', number: 6, position: 'MID', isStarter: true, playerId: 'platini' },
      { name: 'Fredy', number: 5, position: 'DEF', isStarter: true, playerId: 'fred' },
      { name: 'Vado', number: 8, position: 'MID', isStarter: true, playerId: 'vado-lunda-sul' },
      { name: 'Magrinho', number: 11, position: 'FWD', isStarter: true, playerId: 'magrinho' },
      { name: 'Banana', number: 14, isStarter: true },
      { name: 'Jepson', number: 17, position: 'FWD', isStarter: true, playerId: 'jepson' },
      { name: 'Manucho', number: 19, position: 'FWD', isStarter: true, playerId: 'manucho-lunda-sul' },
      { name: 'Dieu', number: 25, position: 'DEF', isStarter: true, playerId: 'dieu' },
      { name: 'Sozito', number: 26, position: 'DEF', isStarter: true, playerId: 'sozito' },
      { name: 'Joca', number: 27, position: 'FWD', isStarter: true, playerId: 'joca-lunda-sul' },
      { name: 'Angola', number: 41, position: 'GK', isStarter: false, playerId: 'angola-gr' },
      { name: 'Hanilton', number: 3, position: 'DEF', isStarter: false, playerId: 'fifa-1k1k2v2' },
      { name: 'Neymar', number: 7, position: 'FWD', isStarter: false, playerId: 'neymar-lunda-sul' },
      { name: 'Maranata', number: 10, position: 'MID', isStarter: false, playerId: 'maranata' },
      { name: 'Ximba', number: 16, position: 'MID', isStarter: false, playerId: 'ximba' },
      { name: 'Mussá', number: 20, position: 'FWD', isStarter: false, playerId: 'mussa-lunda-sul' },
      { name: 'Mongadié', number: 23, position: 'DEF', isStarter: false, playerId: 'mongadie' },
      { name: 'Jack', number: 32, isStarter: false },
      { name: 'Fuca', number: 35, position: 'FWD', isStarter: false, playerId: 'fuca' },
    ],
    away: [
      { name: 'José Kidiaba', number: 1, position: 'GK', isStarter: true },
      { name: 'Lax', number: 2, isStarter: true },
      { name: 'Chiquinho', number: 4, isStarter: true },
      { name: 'Marcos Lando', number: 5, position: 'DEF', isStarter: true, playerId: 'marcos-cabinda' },
      { name: 'Luyeye', number: 13, position: 'MID', isStarter: true, playerId: 'luyeye-cabinda' },
      { name: 'Júlio', number: 17, position: 'DEF', isStarter: true, playerId: 'julio-cabinda' },
      { name: 'Bazonga', number: 21, position: 'MID', isStarter: true, playerId: 'fernando-cabinda' },
      { name: 'Mário da Silva', number: 24, position: 'MID', isStarter: true, playerId: 'fifa-1ljjyh4' },
      { name: 'Ary Lede', number: 29, position: 'FWD', isStarter: true, playerId: 'ariclenis-cabinda' },
      { name: 'Dadá', number: 30, isStarter: true },
      { name: 'Ary Chato', number: 38, isStarter: true },
      { name: 'Chicapa', number: 12, position: 'GK', isStarter: false, playerId: 'francisco-cabinda' },
      { name: 'Cazadí', number: 3, isStarter: false },
      { name: 'Rodilson', number: 10, isStarter: false },
      { name: 'Manteiga', number: 18, isStarter: false },
      { name: 'Zau', number: 20, position: 'DEF', isStarter: false, playerId: 'frederico-cabinda' },
      { name: 'Chico', number: 25, isStarter: false },
      { name: 'Kadima', number: 37, isStarter: false },
      { name: 'Pinó', number: 39, isStarter: false },
    ],
  },
});
