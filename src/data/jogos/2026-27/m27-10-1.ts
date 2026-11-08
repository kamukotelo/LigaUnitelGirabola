// 10.ª jornada · CR Caála–Académica do Lobito
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-10-1',
  round: 10,
  homeTeamId: 'caala',
  awayTeamId: 'lobito',
  // Hora 15:00 → 15:30 a pedido do Diretor de Competições (02/11/2026, Emanuel Valodia).
  schedule: { date: '2026-11-08T15:30:00+01:00', stadium: 'Estádio Daniel Lutucuta', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026); hora: pedido do Diretor de Competições (02/11/2026), 15:30' },
  // Equipa de arbitragem do «Lineup Geral» oficial (08/11/2026; nomes completos das fichas anteriores).
  officials: { referee: 'Chitano Domingos Francisco', assistants: ['Wilson Valdmiro Ntyamba', 'Andália Bimbi Francisco Jeremias'], fourth: 'Alexandre Muhongo' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (08/11/2026).
  // Público só a partir de 1 h antes do início (embargo de line ups).
  // Caála: o Lineup traz «Landú» também no n.º 2 (o n.º 2 do plantel é Vale); ligado pela camisola.
  // Nelinho (n.º 20) e Caio (n.º 35, Caála); Afonso (n.º 1), João (n.º 23) e Hugo (n.º 34, Académica) ainda não constam das listas de plantel recebidas.
  coaches: { home: 'Artur Correia', away: 'Silvestre Pelé' },
  lineups: {
    home: [
      { name: 'Fany', number: 30, position: 'GK', isStarter: true, playerId: 'fifa-1k0ag17' },
      { name: 'Vieira', number: 16, position: 'DEF', isStarter: true, playerId: 'fifa-1jzj8y2' },
      { name: 'Tchaba', number: 3, position: 'DEF', isStarter: true, playerId: 'fifa-1lb66s2' },
      { name: 'Benvindo', number: 4, position: 'MID', isStarter: true, playerId: 'fifa-1jz4pi8' },
      { name: 'Kuxixima', number: 7, position: 'FWD', isStarter: true, playerId: 'cuxixima-caala' },
      { name: 'Jó Vidal', number: 15, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrqb0' },
      { name: 'Lamine Moro', number: 18, isStarter: true, playerId: 'lamine-moro-caala' },
      { name: 'Neidy Bicho', number: 23, position: 'MID', isStarter: true, playerId: 'lisneu-caala' },
      { name: 'Manucho', number: 27, position: 'FWD', isStarter: true, playerId: 'fifa-1r8lp51' },
      { name: 'Marega', number: 34, position: 'FWD', isStarter: true, playerId: 'fifa-1qvfe29' },
      { name: 'Yano', number: 38, isStarter: true, playerId: 'adriano-nicolau-caala' },
      { name: 'Landú', number: 22, position: 'GK', isStarter: false, playerId: 'fifa-1k002p8' },
      { name: 'Landú', number: 2, position: 'DEF', isStarter: false, playerId: 'fifa-1t647t5' },
      { name: 'Aisson', number: 10, position: 'MID', isStarter: false, playerId: 'fifa-1jwgzb2' },
      { name: 'Bito', number: 17, position: 'FWD', isStarter: false, playerId: 'fifa-1l96dj1' },
      { name: 'Be Ngueve', number: 19, position: 'MID', isStarter: false, playerId: 'fifa-1lda172' },
      { name: 'Nelinho', number: 20, isStarter: false },
      { name: 'Putchú', number: 21, position: 'DEF', isStarter: false, playerId: 'fifa-1jzhzh1' },
      { name: 'Kabila', number: 24, position: 'FWD', isStarter: false, playerId: 'fifa-1k2qwk8' },
      { name: 'Caio', number: 35, isStarter: false },
    ],
    away: [
      { name: 'Afonso', number: 1, isStarter: true },
      { name: 'Cachi', number: 7, position: 'MID', isStarter: true, playerId: 'januario-lobito' },
      { name: 'Manú', number: 3, position: 'DEF', isStarter: true, playerId: 'nanga-lobito' },
      { name: 'Lourenço', number: 5, position: 'MID', isStarter: true, playerId: 'lourenco-lobito' },
      { name: 'Muto', number: 8, position: 'MID', isStarter: true, playerId: 'quiteque-lobito' },
      { name: 'Muenho', number: 13, position: 'DEF', isStarter: true, playerId: 'fifa-1jrj1l5' },
      { name: 'Guilherme', number: 18, position: 'DEF', isStarter: true, playerId: 'fifa-1pu18x2' },
      { name: 'Bebucho', number: 19, position: 'FWD', isStarter: true, playerId: 'antonio-lobito' },
      { name: 'João', number: 23, isStarter: true },
      { name: 'Miguel', number: 24, position: 'MID', isStarter: true, playerId: 'miguel-lobito' },
      { name: 'Luizinho Panda', number: 31, position: 'MID', isStarter: true, playerId: 'fifa-1l60xh8' },
      { name: 'Caxito', number: 30, isStarter: false, playerId: 'caxito-lobito' },
      { name: 'Ezequiel', number: 10, position: 'MID', isStarter: false, playerId: 'ezequiel-lobito' },
      { name: 'Florentino', number: 11, position: 'FWD', isStarter: false, playerId: 'kaporal' },
      { name: 'Serafim', number: 15, position: 'MID', isStarter: false, playerId: 'fifa-1l13q80' },
      { name: 'Chico Papel', number: 16, position: 'MID', isStarter: false, playerId: 'joaquim-lobito' },
      { name: 'Sistema', number: 22, position: 'DEF', isStarter: false, playerId: 'leonel-lobito' },
      { name: 'Valério', number: 29, position: 'MID', isStarter: false, playerId: 'valerio-lobito' },
      { name: 'Didi Craque', number: 32, position: 'MID', isStarter: false, playerId: 'fifa-1ndemr2' },
      { name: 'Hugo', number: 34, isStarter: false },
    ],
  },
});
