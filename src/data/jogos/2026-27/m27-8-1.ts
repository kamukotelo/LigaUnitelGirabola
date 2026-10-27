// 8.ª jornada · CR Caála–CD 1.º de Agosto
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-8-1',
  round: 8,
  homeTeamId: 'caala',
  awayTeamId: 'dago',
  schedule: { date: '2026-10-27T17:15:00+01:00', stadium: 'Estádio Daniel Lutucuta', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa de jogos transmitidos pela Zsports, jornadas 6 a 10, versão corrigida (recebida a 13/10/2026): 17:15' },
  // Marcador ao vivo recebido a 27/10/2026 (65'); falta o resultado final.
  result: { status: 'live', homeScore: 1, awayScore: 0, halfTimeScore: '1-0', liveMinute: 65, updatedAt: '2026-10-27T18:35:00+01:00' },
  events: [
    { minute: 34, type: 'goal', team: 'home', player: 'Manucho', number: 27, playerId: 'fifa-1r8lp51', detail: '1-0' },
  ],
  // Equipa de arbitragem do «Lineup Geral» oficial (27/10/2026; nomes completos das fichas anteriores).
  officials: { referee: 'Edilson Roberto Gomes André', assistants: ['Manuel Luís Benguela', 'Joaquim Manuel Chiyo'], fourth: 'Ana Kuvundu Pumba' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (27/10/2026).
  // Público só a partir de 1 h antes do início (embargo de line ups).
  coaches: { home: 'Artur Correia', away: 'Filipe Nzanza' },
  lineups: {
    home: [
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
      { name: 'Bebo', number: 6, position: 'MID', isStarter: false, playerId: 'fifa-1kz4es4' },
      { name: 'Aisson', number: 10, position: 'MID', isStarter: false, playerId: 'fifa-1jwgzb2' },
      { name: 'Be Ngueve', number: 19, position: 'MID', isStarter: false, playerId: 'fifa-1lda172' },
      { name: 'Putchú', number: 21, position: 'DEF', isStarter: false, playerId: 'fifa-1jzhzh1' },
      { name: 'Kabila', number: 24, position: 'FWD', isStarter: false, playerId: 'fifa-1k2qwk8' },
      { name: 'Félix II', number: 33, position: 'FWD', isStarter: false, playerId: 'fifa-1uy6ar6' },
      { name: 'Yano', number: 38, isStarter: false, playerId: 'yano-caala' },
    ],
    away: [
      { name: 'Anselmo', number: 22, position: 'GK', isStarter: true, playerId: 'anselmo-dago' },
      { name: 'Bonifácio', number: 5, position: 'DEF', isStarter: true, playerId: 'bonifacio-dago' },
      { name: 'Axel', number: 8, position: 'MID', isStarter: true, playerId: 'axel-dago' },
      { name: 'Fernando', number: 11, position: 'FWD', isStarter: true, playerId: 'fernando-dago' },
      { name: 'Obed', number: 14, position: 'FWD', isStarter: true, playerId: 'obed-dago' },
      { name: 'Venâncio', number: 15, position: 'DEF', isStarter: true, playerId: 'venancio-dago' },
      { name: 'Macaia', number: 16, position: 'MID', isStarter: true, playerId: 'macaia-dago' },
      { name: 'Dago', number: 17, position: 'FWD', isStarter: true, playerId: 'dago-tshibamba' },
      { name: 'Paxe', number: 19, position: 'DEF', isStarter: true, playerId: 'fifa-1pxu511' },
      { name: 'Tombé', number: 20, position: 'FWD', isStarter: true, playerId: 'tombe-dago' },
      { name: 'Paulo', number: 21, position: 'DEF', isStarter: true, playerId: 'paulo-costa-dago' },
      { name: 'Diego', number: 12, position: 'GK', isStarter: false, playerId: 'diego-lopes-dago' },
      { name: 'Milton', number: 2, position: 'DEF', isStarter: false, playerId: 'milton-dago' },
      { name: 'Mabelé', number: 3, position: 'DEF', isStarter: false, playerId: 'simao-dianzenza' },
      { name: 'Mabilson', number: 7, position: 'FWD', isStarter: false, playerId: 'mabilson-dago' },
      { name: 'Rupson', number: 9, position: 'FWD', isStarter: false, playerId: 'rupson-dago' },
      { name: 'Calebi Yanda', number: 10, position: 'MID', isStarter: false, playerId: 'calebi-dago' },
      { name: 'Clíver', number: 18, position: 'FWD', isStarter: false, playerId: 'cliver-dago' },
      { name: 'Félix Bulaya', number: 28, position: 'FWD', isStarter: false, playerId: 'bulaya-dago' },
      { name: 'Benção', number: 36, position: 'DEF', isStarter: false, playerId: 'bencao-dago' },
    ],
  },
});
