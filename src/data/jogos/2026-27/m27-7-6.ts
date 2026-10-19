// 7.ª jornada · FC Cabinda–Académica do Lobito
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-7-6',
  round: 7,
  homeTeamId: 'cabinda',
  awayTeamId: 'lobito',
  // Estádio mudado do França N’dalu para o 22 de Junho a pedido recebido a 15/10/2026
  // (Emanuel Valodia, encaminhado pelo administrador do portal). Data e hora sem alteração.
  schedule: { date: '2026-10-17T15:00:00+01:00', stadium: 'Estádio 22 de Junho', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026); estádio: pedido de 15/10/2026', stadiumException: 'Jogo transferido para o Estádio 22 de Junho (pedido recebido a 15/10/2026)' },
  // Resultado recebido a 17/10/2026 (aguarda o relatório do árbitro).
  result: { status: 'finished', homeScore: 0, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-10-17T18:30:00+01:00' },
  // Nomeação de arbitragem recebida a 16/10/2026 (nomes completos das fichas anteriores).
  officials: { referee: 'Nelson João Milagre', assistants: ['Manuel Daniel Coelho', 'Hélder João Milagre'], fourth: 'Alberto Henrique F. Bartolomeu' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (17/10/2026).
  // Ligações ao plantel só onde fichas anteriores confirmam o mesmo jogador («Gui Muango»
  // n.º 12 é o Muhango; «Luizinho Panda» n.º 31 é o Luís Panda das fichas anteriores).
  coaches: { home: 'Luciano Capoco', away: 'Silvestre Pelé' },
  lineups: {
    home: [
      { name: 'José Kidiaba', number: 1, position: 'GK', isStarter: true },
      { name: 'Lax', number: 2, isStarter: true },
      { name: 'Chiquinho', number: 4, isStarter: true },
      { name: 'M. Lando', number: 5, position: 'DEF', isStarter: true, playerId: 'marcos-cabinda' },
      { name: 'Luyeye', number: 13, position: 'MID', isStarter: true, playerId: 'luyeye-cabinda' },
      { name: 'Zau', number: 20, position: 'DEF', isStarter: true, playerId: 'frederico-cabinda' },
      { name: 'Mário da Silva', number: 24, position: 'MID', isStarter: true, playerId: 'fifa-1ljjyh4' },
      { name: 'Dadá', number: 30, isStarter: true },
      { name: 'Kadima', number: 37, isStarter: true },
      { name: 'Ary Chato', number: 38, isStarter: true },
      { name: 'Pinó', number: 39, isStarter: true },
      { name: 'Chicapa', number: 12, position: 'GK', isStarter: false, playerId: 'francisco-cabinda' },
      { name: 'Cazadí', number: 3, isStarter: false },
      { name: 'Rodilson', number: 10, isStarter: false },
      { name: 'Júlio', number: 17, position: 'DEF', isStarter: false, playerId: 'julio-cabinda' },
      { name: 'Manteiga', number: 18, isStarter: false },
      { name: 'Bazonga', number: 21, position: 'MID', isStarter: false, playerId: 'fernando-cabinda' },
      { name: 'Chico', number: 25, isStarter: false },
      { name: 'Ary Lede', number: 29, position: 'FWD', isStarter: false, playerId: 'ariclenis-cabinda' },
      { name: 'Bilele', number: 35, isStarter: false },
    ],
    away: [
      { name: 'Caxito', number: 30, isStarter: true },
      { name: 'Higino', number: 10, isStarter: true },
      { name: 'Manú', number: 3, isStarter: true },
      { name: 'Lourenço', number: 5, position: 'DEF', isStarter: true, playerId: 'lourenco-lobito' },
      { name: 'Cachi', number: 7, isStarter: true },
      { name: 'Mutu', number: 8, isStarter: true },
      { name: 'Muenho', number: 13, isStarter: true },
      { name: 'Guilherme', number: 18, isStarter: true },
      { name: 'Bebucho', number: 19, isStarter: true },
      { name: 'Farrada', number: 26, position: 'DEF', isStarter: true, playerId: 'fifa-1nc8yh3' },
      { name: 'Gui', number: 29, isStarter: true },
      { name: 'Gui Muango', number: 12, position: 'GK', isStarter: false, playerId: 'guilherme-lobito' },
      { name: 'Elieve', number: 9, isStarter: false },
      { name: 'Chico Papel', number: 16, isStarter: false },
      { name: 'Isaac Vidal', number: 20, isStarter: false },
      { name: 'Sistema', number: 22, isStarter: false },
      { name: 'Jó', number: 28, isStarter: false },
      { name: 'Luizinho Panda', number: 31, position: 'MID', isStarter: false, playerId: 'fifa-1l60xh8' },
      { name: 'Didi Craque', number: 32, isStarter: false },
      { name: 'Júnior', number: 37, isStarter: false },
    ],
  },
});
