// 11.ª jornada · FC Cabinda–Bravos do Maquis
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-11-5',
  round: 11,
  homeTeamId: 'cabinda',
  awayTeamId: 'bravos',
  // Domingo 22/11 15:00 → sábado 21/11 15:00, indicação do Diretor de Competições (Emanuel Valodia, 05/11/2026).
  // Estádio França N’dalu → Estádio do Tafe, novo estádio da casa do FC Cabinda (DCE/ANCAF, 05/11/2026).
  schedule: { date: '2026-11-21T15:00:00+01:00', stadium: 'Estádio do Tafe', scheduleStatus: 'official', source: 'Diretor de Competições DCE/ANCAF (Emanuel Valodia, 05/11/2026): sábado 21/11, 15:00; Estádio do Tafe: DCE/ANCAF, 05/11/2026; antes: Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas, recebido em 29/10/2026' },
  // Nomeação de árbitros, jogo n.º 82 (mensagem enviada pelo utilizador, 19/11/2026); nomes completos dos registos anteriores (Luciano Sabala como veio na nomeação).
  officials: { referee: 'Bernardo Kenge Mário', assistants: ['João Manuel Fula António', 'António Miguel'], fourth: 'Luciano Sabala' },
  // Onze inicial, suplentes, treinadores e segundo assistente: Lineup Geral DCE/ANCAF, 21/11/2026, enviado pelo utilizador.
  // Malonda (26) e Fábio (41), do Cabinda, ficam sem ligação ao plantel: identidade por confirmar.
  coaches: { home: 'Luciano Capoco', away: 'Sandro Mendes' },
  lineups: {
    home: [
      { name: 'José Kidiaba', number: 1, position: 'GK', isStarter: true, playerId: 'cabinda-player-1' },
      { name: 'Lax', number: 2, position: 'DEF', isStarter: true, playerId: 'rodrigo-cabinda' },
      { name: 'Chiquinho', number: 4, position: 'DEF', isStarter: true, playerId: 'fifa-1qtzy92' },
      { name: 'M. Lando', number: 5, position: 'DEF', isStarter: true, playerId: 'marcos-cabinda' },
      { name: 'Rodilson', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1thxac4' },
      { name: 'Luyeye', number: 13, position: 'MID', isStarter: true, playerId: 'luyeye-cabinda' },
      { name: 'Cornélio', number: 15, position: 'MID', isStarter: true, playerId: 'cornelio-cabinda' },
      { name: 'Júlio', number: 17, position: 'DEF', isStarter: true, playerId: 'julio-cabinda' },
      { name: 'Ary Lede', number: 29, position: 'FWD', isStarter: true, playerId: 'ariclenis-cabinda' },
      { name: 'Dadá', number: 30, position: 'FWD', isStarter: true, playerId: 'pedro-da-silva-cabinda' },
      { name: 'Pinó', number: 39, isStarter: true, playerId: 'pino-cabinda' },
      { name: 'Chicapa', number: 12, position: 'GK', isStarter: false, playerId: 'francisco-cabinda' },
      { name: 'Morata Kapata', number: 9, position: 'FWD', isStarter: false, playerId: 'antonio-kapata-cabinda' },
      { name: 'Simão', number: 14, position: 'FWD', isStarter: false, playerId: 'simao-gomes-cabinda' },
      { name: 'Mário da Silva', number: 24, position: 'MID', isStarter: false, playerId: 'fifa-1ljjyh4' },
      { name: 'Chico', number: 25, position: 'DEF', isStarter: false, playerId: 'joao-cambo-cabinda' },
      { name: 'Malonda', number: 26, isStarter: false },
      { name: 'Bilele', number: 35, isStarter: false, playerId: 'bilele-cabinda' },
      { name: 'Ary Chato', number: 38, isStarter: false, playerId: 'ary-chato-cabinda' },
      { name: 'Fábio', number: 41, isStarter: false },
    ],
    away: [
      { name: 'Nathan', number: 22, position: 'GK', isStarter: true, playerId: 'nathan-bravos' },
      { name: 'Manico', number: 26, position: 'DEF', isStarter: true, playerId: 'manico-bravos' },
      { name: 'Danilson', number: 2, position: 'DEF', isStarter: true, playerId: 'denilson-bravos' },
      { name: 'Caiser', number: 5, isStarter: true, playerId: 'caiser-bravos' },
      { name: 'Abraão', number: 6, position: 'MID', isStarter: true, playerId: 'abrao-bravos' },
      { name: 'Jú Cabral', number: 8, position: 'MID', isStarter: true, playerId: 'ju-cabral-bravos' },
      { name: 'Higino', number: 10, position: 'MID', isStarter: true, playerId: 'higino-bravos' },
      { name: 'Tiago', number: 15, position: 'FWD', isStarter: true, playerId: 'tiago-bravos' },
      { name: 'Lopes', number: 18, isStarter: true, playerId: 'antonio-lopes-bravos' },
      { name: 'Lito', number: 23, position: 'FWD', isStarter: true, playerId: 'lito-bravos' },
      { name: 'Dabanda', number: 27, position: 'DEF', isStarter: true, playerId: 'dabanda-bravos' },
      { name: 'Saidy', number: 12, position: 'GK', isStarter: false, playerId: 'saidi-bravos' },
      { name: 'Bruno', number: 4, isStarter: false, playerId: 'fifa-1k0rpz2' },
      { name: 'Cueta', number: 7, position: 'MID', isStarter: false, playerId: 'cueta-bravos' },
      { name: 'Osah', number: 16, isStarter: false, playerId: 'fifa-1mrrs47' },
      { name: 'André', number: 21, isStarter: false, playerId: 'fifa-1mqv606' },
      { name: 'Toni', number: 25, position: 'MID', isStarter: false, playerId: 'fifa-1v0f2v0' },
      { name: 'Milson', number: 29, isStarter: false, playerId: 'fifa-1m8y3d4' },
    ],
  },
  // Resultado, intervalo e goleadores: captura SofaScore enviada pelo utilizador em 21/11/2026 (18:18–18:19, Luanda).
  // «C. Gomes» na captura corresponde a Caiser Sérgio Gomes, n.º 5 do Maquis no plantel.
  result: { status: 'finished', homeScore: 2, awayScore: 2, halfTimeScore: '0-0', updatedAt: '2026-11-21T18:19:00+01:00' },
  events: [
    { minute: 53, type: 'goal', team: 'home', player: 'Luyeye', number: 13, playerId: 'luyeye-cabinda', detail: '1-0 · Penálti' },
    { minute: 71, type: 'goal', team: 'away', player: 'Caiser', number: 5, playerId: 'caiser-bravos', detail: '1-1' },
    { minute: 75, type: 'goal', team: 'home', player: 'António Kapata', number: 9, playerId: 'antonio-kapata-cabinda', detail: '2-1' },
    { minute: 82, type: 'goal', team: 'away', player: 'Jú Cabral', number: 8, playerId: 'ju-cabral-bravos', detail: '2-2' },
  ],
});
