// 10.ª jornada · Sagrada Esperança–FC Cabinda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-10-6',
  round: 10,
  homeTeamId: 'sagrada',
  awayTeamId: 'cabinda',
  schedule: { date: '2026-11-07T15:00:00+01:00', stadium: 'Estádio do Sagrada Esperança', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Resultado e marcadores recebidos a 07/11/2026 (captura da app; aguarda o relatório do árbitro).
  result: { status: 'finished', homeScore: 2, awayScore: 0, halfTimeScore: '2-0', updatedAt: '2026-11-07T18:33:00+01:00' },
  events: [
    { minute: 10, type: 'goal', team: 'home', player: 'Dabanda', number: 7, playerId: 'dabanda-sagrada', detail: '1-0' },
    { minute: 35, type: 'goal', team: 'home', player: 'Mafuta', number: 24, playerId: 'afonso-sagrada', detail: '2-0' },
  ],
  // Equipa de arbitragem do «Lineup Geral» oficial (07/11/2026; nomes completos das fichas anteriores).
  officials: { referee: 'Miguel Tchissingui Augusto Américo', assistants: ['Bernardo Kunjuca Lúcio Serafim', 'Floriano Cawala'], fourth: 'Ayrton Micuta' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (07/11/2026).
  // Público só a partir de 1 h antes do início (embargo de line ups).
  // Kissito (n.º 22, Sagrada) e Nelsinho (n.º 32, Cabinda) ainda não constam das listas de plantel recebidas.
  coaches: { home: 'Baciro Candé', away: 'Luciano Capoco' },
  lineups: {
    home: [
      { name: 'Nsesani', number: 12, position: 'GK', isStarter: true, playerId: 'nsesani-sagrada' },
      { name: 'Alexandre', number: 2, position: 'DEF', isStarter: true, playerId: 'fifa-1v1a1u9' },
      { name: 'Manú', number: 3, position: 'DEF', isStarter: true, playerId: 'manuel-sagrada' },
      { name: 'Dabanda', number: 7, position: 'FWD', isStarter: true, playerId: 'dabanda-sagrada' },
      { name: 'Celso Cabuço', number: 8, position: 'MID', isStarter: true, playerId: 'guilherme-sagrada' },
      { name: 'Tobias', number: 14, position: 'DEF', isStarter: true, playerId: 'tobias-sagrada' },
      { name: 'Luís Tati', number: 20, position: 'DEF', isStarter: true, playerId: 'luis-tati-sagrada' },
      { name: 'Messias', number: 21, position: 'MID', isStarter: true, playerId: 'fifa-1v0z7l2' },
      { name: 'Kissito', number: 22, isStarter: true },
      { name: 'Mafuta', number: 24, position: 'MID', isStarter: true, playerId: 'afonso-sagrada' },
      { name: 'Kulica', number: 39, position: 'MID', isStarter: true, playerId: 'fifa-1scqy89' },
      { name: 'Adolfo', number: 30, isStarter: false, playerId: 'fifa-1l7lpp2' },
      { name: 'Miguel', number: 5, position: 'DEF', isStarter: false, playerId: 'miguel-sagrada' },
      { name: 'Jorge', number: 9, position: 'FWD', isStarter: false, playerId: 'jorge-sagrada' },
      { name: 'Gogoró', number: 17, position: 'DEF', isStarter: false, playerId: 'gogoro-sagrada' },
      { name: 'Pedro', number: 26, isStarter: false, playerId: 'pedro-soba-sagrada' },
      { name: 'Pipocas', number: 27, isStarter: false, playerId: 'pipocas-sagrada' },
      { name: 'Barreira', number: 28, position: 'DEF', isStarter: false, playerId: 'barreira-sagrada' },
      { name: 'Cláudio', number: 33, isStarter: false, playerId: 'fifa-1l7vm13' },
      { name: 'Kandumba', number: 34, isStarter: false, playerId: 'fifa-1jrv034' },
    ],
    away: [
      { name: 'José Kidiaba', number: 1, position: 'GK', isStarter: true, playerId: 'cabinda-player-1' },
      { name: 'Lax', number: 2, position: 'DEF', isStarter: true, playerId: 'rodrigo-cabinda' },
      { name: 'Chiquinho', number: 4, position: 'DEF', isStarter: true, playerId: 'fifa-1qtzy92' },
      { name: 'M. Lando', number: 5, position: 'DEF', isStarter: true, playerId: 'marcos-cabinda' },
      { name: 'Luyeye', number: 13, position: 'MID', isStarter: true, playerId: 'luyeye-cabinda' },
      { name: 'Queba', number: 15, position: 'MID', isStarter: true, playerId: 'cornelio-cabinda' },
      { name: 'Tchingani', number: 20, position: 'DEF', isStarter: true, playerId: 'frederico-cabinda' },
      { name: 'Mário da Silva', number: 24, position: 'MID', isStarter: true, playerId: 'fifa-1ljjyh4' },
      { name: 'Dadá', number: 30, position: 'FWD', isStarter: true, playerId: 'pedro-da-silva-cabinda' },
      { name: 'Bilele', number: 35, isStarter: true, playerId: 'bilele-cabinda' },
      { name: 'Pinó', number: 39, isStarter: true, playerId: 'pino-cabinda' },
      { name: 'Chicapa', number: 12, position: 'GK', isStarter: false, playerId: 'francisco-cabinda' },
      { name: 'Cristiano', number: 8, position: 'MID', isStarter: false, playerId: 'cristiano-cabinda' },
      { name: 'Morata Kapata', number: 9, position: 'FWD', isStarter: false, playerId: 'antonio-kapata-cabinda' },
      { name: 'Rodilson', number: 10, position: 'MID', isStarter: false, playerId: 'fifa-1thxac4' },
      { name: 'Júlio', number: 17, position: 'DEF', isStarter: false, playerId: 'julio-cabinda' },
      { name: 'Chico', number: 25, position: 'DEF', isStarter: false, playerId: 'joao-cambo-cabinda' },
      { name: 'Ary Lede', number: 29, position: 'FWD', isStarter: false, playerId: 'ariclenis-cabinda' },
      { name: 'Nelsinho', number: 32, isStarter: false },
      { name: 'Ary Chato', number: 38, isStarter: false, playerId: 'ary-chato-cabinda' },
    ],
  },
});
