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
  // Resultado conferido com o Relatório do Árbitro n.º 50 (19/10/2026).
  result: { status: 'finished', homeScore: 0, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-10-19T21:00:00+01:00' },
  // Nomeação de arbitragem recebida a 16/10/2026 (nomes completos das fichas anteriores).
  officials: { referee: 'Nelson João Milagre', assistants: ['Manuel Daniel Coelho', 'Hélder João Milagre'], fourth: 'Alberto Henrique F. Bartolomeu', commissioner: 'José Soyamba' },
  events: [
    // Golos, cartões e substituições do Relatório do Árbitro n.º 50 (ANCAF), conferido a 19/10/2026.
    { minute: 42, type: 'sub', team: 'away', player: 'Luizinho Panda', number: 31, playerId: 'fifa-1l60xh8', playerOut: 'Gui' },
    { minute: 43, type: 'yellow', team: 'home', player: 'Chiquinho', number: 4, playerId: 'fifa-1qtzy92', detail: 'Parar um ataque Prometedor.' },
    { minute: 45, type: 'sub', team: 'home', player: 'Chico', number: 25, playerId: 'joao-cambo-cabinda', playerOut: 'Chiquinho' },
    { minute: 47, type: 'yellow', team: 'away', player: 'Cachi', number: 7, playerId: 'januario-lobito', detail: "45'+2 · Retardar o reinício do jogo." },
    { minute: 56, type: 'sub', team: 'home', player: 'Ary Lede', number: 29, playerId: 'ariclenis-cabinda', playerOut: 'Kadima' },
    { minute: 56, type: 'sub', team: 'away', player: 'Sistema', number: 22, playerId: 'leonel-lobito', playerOut: 'Farrada' },
    { minute: 56, type: 'sub', team: 'away', player: 'Elieve', number: 9, playerOut: 'Bebucho' },
    { minute: 56, type: 'sub', team: 'away', player: 'Didi Craque', number: 32, playerId: 'fifa-1ndemr2', playerOut: 'Higino' },
    { minute: 62, type: 'sub', team: 'home', player: 'Bazonga', number: 21, playerId: 'fernando-cabinda', playerOut: 'Mário da Silva' },
    { minute: 62, type: 'sub', team: 'home', player: 'Cazadí', number: 3, playerId: 'gedeon-cabinda', playerOut: 'Ary Chato' },
    { minute: 70, type: 'sub', team: 'away', player: 'Júnior', number: 37, playerOut: 'Cachi' },
    { minute: 85, type: 'sub', team: 'home', player: 'Bilele', number: 35, playerOut: 'Dadá' },
  ],
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (17/10/2026).
  // Ligações ao plantel só onde fichas anteriores confirmam o mesmo jogador («Gui Muango»
  // n.º 12 é o Muhango; «Luizinho Panda» n.º 31 é o Luís Panda das fichas anteriores).
  coaches: { home: 'Luciano Capoco', away: 'Silvestre Pelé' },
  // Conferidas com o Relatório do Árbitro n.º 50 (19/10/2026).
  lineups: {
    home: [
      { name: 'José Kidiaba', number: 1, position: 'GK', isStarter: true, playerId: 'cabinda-player-1' },
      { name: 'Lax', number: 2, position: 'DEF', isStarter: true, playerId: 'rodrigo-cabinda' },
      { name: 'Chiquinho', number: 4, position: 'DEF', isStarter: true, playerId: 'fifa-1qtzy92' },
      { name: 'M. Lando', number: 5, position: 'DEF', isStarter: true, playerId: 'marcos-cabinda' },
      { name: 'Luyeye', number: 13, position: 'MID', isStarter: true, playerId: 'luyeye-cabinda' },
      { name: 'Zau', number: 20, position: 'DEF', isStarter: true, playerId: 'frederico-cabinda' },
      { name: 'Mário da Silva', number: 24, position: 'MID', isStarter: true, playerId: 'fifa-1ljjyh4' },
      { name: 'Dadá', number: 30, position: 'FWD', isStarter: true, playerId: 'pedro-da-silva-cabinda' },
      { name: 'Kadima', number: 37, isStarter: true },
      { name: 'Ary Chato', number: 38, isStarter: true },
      { name: 'Pinó', number: 39, isStarter: true },
      { name: 'Cazadí', number: 3, position: 'FWD', isStarter: false, playerId: 'gedeon-cabinda' },
      { name: 'Rodilson', number: 10, position: 'MID', isStarter: false, playerId: 'fifa-1thxac4' },
      { name: 'Chicapa', number: 12, position: 'GK', isStarter: false, playerId: 'francisco-cabinda' },
      { name: 'Júlio', number: 17, position: 'DEF', isStarter: false, playerId: 'julio-cabinda' },
      { name: 'Manteiga', number: 18, position: 'FWD', isStarter: false, playerId: 'jose-cabinda' },
      { name: 'Bazonga', number: 21, position: 'MID', isStarter: false, playerId: 'fernando-cabinda' },
      { name: 'Chico', number: 25, position: 'DEF', isStarter: false, playerId: 'joao-cambo-cabinda' },
      { name: 'Ary Lede', number: 29, position: 'FWD', isStarter: false, playerId: 'ariclenis-cabinda' },
      { name: 'Bilele', number: 35, isStarter: false },
    ],
    away: [
      { name: 'Caxito', number: 30, isStarter: true },
      { name: 'Higino', number: 10, position: 'MID', isStarter: true, playerId: 'ezequiel-lobito' },
      { name: 'Manú', number: 3, position: 'DEF', isStarter: true, playerId: 'nanga-lobito' },
      { name: 'Lourenço', number: 5, position: 'DEF', isStarter: true, playerId: 'lourenco-lobito' },
      { name: 'Cachi', number: 7, position: 'MID', isStarter: true, playerId: 'januario-lobito' },
      { name: 'Mutu', number: 8, isStarter: true },
      { name: 'Muenho', number: 13, position: 'DEF', isStarter: true, playerId: 'fifa-1jrj1l5' },
      { name: 'Guilherme', number: 18, position: 'DEF', isStarter: true, playerId: 'fifa-1pu18x2' },
      { name: 'Bebucho', number: 19, position: 'FWD', isStarter: true, playerId: 'antonio-lobito' },
      { name: 'Farrada', number: 26, position: 'DEF', isStarter: true, playerId: 'fifa-1nc8yh3' },
      { name: 'Gui', number: 29, isStarter: true },
      { name: 'Elieve', number: 9, isStarter: false },
      { name: 'Gui Muango', number: 12, position: 'GK', isStarter: false, playerId: 'guilherme-lobito' },
      { name: 'Chico Papel', number: 16, position: 'MID', isStarter: false, playerId: 'joaquim-lobito' },
      { name: 'Isaac Vidal', number: 20, isStarter: false },
      { name: 'Sistema', number: 22, position: 'DEF', isStarter: false, playerId: 'leonel-lobito' },
      { name: 'Jó', number: 28, position: 'DEF', isStarter: false, playerId: 'jorge-28-lobito' },
      { name: 'Luizinho Panda', number: 31, position: 'MID', isStarter: false, playerId: 'fifa-1l60xh8' },
      { name: 'Didi Craque', number: 32, position: 'MID', isStarter: false, playerId: 'fifa-1ndemr2' },
      { name: 'Júnior', number: 37, isStarter: false },
    ],
  },
});
