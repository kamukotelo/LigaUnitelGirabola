// 9.ª jornada · Kabuscorp SC–CR Caála
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-9-1',
  round: 9,
  homeTeamId: 'kabuscorp',
  awayTeamId: 'caala',
  schedule: { date: '2026-11-01T15:00:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Cartaz oficial da 9.ª jornada (29/09/2026); hora: mapa corrigido da Zsports, jornadas 6 a 10 (13/10/2026), 15:00', stadiumException: 'Jogo marcado para o Estádio França N’dalu no cartaz oficial (29/09/2026)' },
  // Resultado recebido a 01/11/2026 (aguarda o relatório do árbitro): amarelos aos 16' (Caála),
  // 53' e 90'+3 (Kabuscorp), sem jogador identificado.
  result: { status: 'finished', homeScore: 0, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-11-01T19:28:00+01:00' },
  events: [
    { minute: 16, type: 'yellow', team: 'away', player: '' },
    { minute: 53, type: 'yellow', team: 'home', player: '' },
    { minute: 93, type: 'yellow', team: 'home', player: '', detail: "90'+3" },
  ],
  // Equipa de arbitragem do «Lineup Geral» oficial (01/11/2026; nomes completos das fichas anteriores).
  officials: { referee: 'Edilson Roberto Gomes André', assistants: ['Manuel Luís Benguela', 'Joaquim Manuel Chiyo'], fourth: 'Rafael Dala' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (01/11/2026).
  // Público só a partir de 1 h antes do início (embargo de line ups).
  // Miguel (n.º 31, Kabuscorp) e Nelinho (n.º 20, Caála) ainda não constam das listas de plantel recebidas.
  coaches: { home: 'Léo Neiva', away: 'Artur Correia' },
  lineups: {
    home: [
      { name: 'Mualucano', number: 22, position: 'GK', isStarter: true, playerId: 'fifa-1jrtva7' },
      { name: 'Henock', number: 16, position: 'DEF', isStarter: true, playerId: 'fifa-1mppsb5' },
      { name: 'Zamorano', number: 2, position: 'DEF', isStarter: true, playerId: 'fifa-1k4a836' },
      { name: 'Eliseu', number: 3, position: 'DEF', isStarter: true, playerId: 'fifa-1jyp8v8' },
      { name: 'Ady Boyo', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1snb179' },
      { name: 'Cuca', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1k2pk58' },
      { name: 'Danilson', number: 15, position: 'MID', isStarter: true, playerId: 'fifa-1jm7zr2' },
      { name: 'Benarfa', number: 18, position: 'FWD', isStarter: true, playerId: 'fifa-1jrku39' },
      { name: 'Tula', number: 20, position: 'MID', isStarter: true, playerId: 'fifa-1jwts88' },
      { name: 'Vingumba', number: 29, position: 'FWD', isStarter: true, playerId: 'fifa-1js6m05' },
      { name: 'Jojo', number: 35, position: 'MID', isStarter: true, playerId: 'fifa-1tgwgg5' },
      { name: 'Efonge', number: 1, position: 'GK', isStarter: false, playerId: 'brudel-kabuscorp' },
      { name: 'Aldair', number: 4, position: 'DEF', isStarter: false, playerId: 'fifa-1lgpgy7' },
      { name: 'Téo', number: 11, position: 'DEF', isStarter: false, playerId: 'fifa-1lgpb81' },
      { name: 'Crespo', number: 14, position: 'DEF', isStarter: false, playerId: 'fifa-1k1sen7' },
      { name: 'Mona', number: 17, position: 'FWD', isStarter: false, playerId: 'fifa-1jxicb5' },
      { name: 'Jó Paciência', number: 19, position: 'FWD', isStarter: false, playerId: 'fifa-1jm8hd7' },
      { name: 'Joelson', number: 27, position: 'MID', isStarter: false, playerId: 'fifa-1pnr1r0' },
      { name: 'Abidal', number: 28, position: 'DEF', isStarter: false, playerId: 'fifa-1qxnl72' },
      { name: 'Miguel', number: 31, isStarter: false },
    ],
    away: [
      { name: 'Fany', number: 30, position: 'GK', isStarter: true, playerId: 'fifa-1k0ag17' },
      { name: 'Vieira', number: 16, position: 'DEF', isStarter: true, playerId: 'fifa-1jzj8y2' },
      { name: 'Tchaba', number: 3, position: 'DEF', isStarter: true, playerId: 'fifa-1lb66s2' },
      { name: 'Benvindo', number: 4, position: 'MID', isStarter: true, playerId: 'fifa-1jz4pi8' },
      { name: 'Kuxixima', number: 7, position: 'FWD', isStarter: true, playerId: 'cuxixima-caala' },
      { name: 'Valegol', number: 9, position: 'FWD', isStarter: true, playerId: 'fifa-1k0r4w6' },
      { name: 'Jó Vidal', number: 15, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrqb0' },
      { name: 'Lamine Moro', number: 18, isStarter: true, playerId: 'lamine-moro-caala' },
      { name: 'Neidy Bicho', number: 23, position: 'MID', isStarter: true, playerId: 'lisneu-caala' },
      { name: 'Manucho', number: 27, position: 'FWD', isStarter: true, playerId: 'fifa-1r8lp51' },
      { name: 'Ifoni', number: 28, isStarter: true, playerId: 'ifony-caala' },
      { name: 'Landú', number: 22, position: 'GK', isStarter: false, playerId: 'fifa-1k002p8' },
      { name: 'Vale', number: 2, position: 'DEF', isStarter: false, playerId: 'fifa-1t647t5' },
      { name: 'Aisson', number: 10, position: 'MID', isStarter: false, playerId: 'fifa-1jwgzb2' },
      { name: 'Bito', number: 17, position: 'FWD', isStarter: false, playerId: 'fifa-1l96dj1' },
      { name: 'Be Ngueve', number: 19, position: 'MID', isStarter: false, playerId: 'fifa-1lda172' },
      { name: 'Nelinho', number: 20, isStarter: false },
      { name: 'Putchú', number: 21, position: 'DEF', isStarter: false, playerId: 'fifa-1jzhzh1' },
      { name: 'Kabila', number: 24, position: 'FWD', isStarter: false, playerId: 'fifa-1k2qwk8' },
      { name: 'Yano', number: 38, isStarter: false, playerId: 'adriano-nicolau-caala' },
    ],
  },
});
