// ════════════════════════════════════════════════════════════════════════
// TEMPLATE DE REGISTO DE JOGO — LIGA UNITEL GIRABOLA 2026/27
// ────────────────────────────────────────────────────────────────────────
// Use este modelo como base para preencher ou atualizar qualquer jogo.
//
// Fluxo após preencher o ficheiro:
//   1. Guardar em: src/data/jogos/2026-27/<id>.ts  (ex.: m27-5-6.ts)
//   2. Executar:   npm run jogos -- sincronizar
//   3. Validar:    npm run jogos -- validar
//   4. Publicar:   npm run jogos -- publicar
//
// NOTA IMPORTANTE:
// - broadcaster: Apenas transmissões de TV (ex.: 'Zsports', 'ZSPORT 1').
//   NUNCA preencher com 'Rádio 5' (jogos sem TV assumem Rádio 5 por defeito).
// - event.type: 'goal' | 'yellow' | 'red' | 'sub' | 'warning'
// - event.team: 'home' para a equipa da casa, 'away' para a equipa visitante.
// - Autogolo: usar type: 'goal', team: equipa beneficiada, ownGoal: true.
// ════════════════════════════════════════════════════════════════════════

import { defineMatch } from './tipos';

export default defineMatch({
  // Identificador canónico do jogo: m27-<jornada>-<número>
  id: 'm27-X-Y',
  round: 1, // Número da jornada (1 a 30)
  homeTeamId: 'bravos', // ID canónico do clube da casa (petro, bravos, sagrada, etc.)
  awayTeamId: 'sagrada', // ID canónico do clube visitante

  // Agenda e Local do Jogo
  schedule: {
    // Data/hora no fuso horário de Angola (+01:00)
    date: '2026-08-22T15:00:00+01:00',
    stadium: 'Estádio Mundunduleno',
    scheduleStatus: 'official', // 'official' (publicado em mapa oficial) ou 'provisional'
    broadcaster: 'Zsports', // Opcional: TV que transmite. Omitir se não houver transmissão TV
  },

  // Resultado (preencher quando o jogo começar / terminar)
  result: {
    status: 'finished', // 'live' durante o jogo ou 'finished' após o apito final
    homeScore: 3,
    awayScore: 0,
    halfTimeScore: '2-0', // Resultado ao intervalo
    attendance: 400, // Número de espetadores no estádio
    usefulTimeMinutes: 54, // Opcional: tempo útil de jogo em minutos
    updatedAt: '2026-09-06T17:50:00+01:00', // Momento da confirmação editorial
  },

  // Equipa de Arbitragem e Oficiais
  officials: {
    referee: 'Sanda Mateus Miguel Kitu',
    assistants: ['Natarino António Soares', 'Nelson Lutumba Quiala'],
    fourth: 'Custódio Roque Lote',
    commissioner: 'Manuel Gaspar', // Delegado do jogo (processado internamente)
  },

  // Treinadores principais presentes na ficha de jogo
  coaches: {
    home: 'Sandro Mendes',
    away: 'Francisco Moniz',
  },

  // Escalações (Titulares e Suplentes)
  lineups: {
    home: [
      // Titulares (isStarter: true)
      { name: 'Nathan', number: 22, position: 'GK', isStarter: true, playerId: 'nathan-bravos' },
      { name: 'Manico', number: 26, position: 'DEF', isStarter: true, playerId: 'manico-bravos' },
      { name: 'Denilson', number: 2, position: 'DEF', isStarter: true, playerId: 'denilson-bravos' },
      { name: 'Caprego', number: 24, position: 'DEF', isStarter: true, playerId: 'caprego-bravos' },
      { name: 'Dabanda', number: 27, position: 'DEF', isStarter: true, playerId: 'dabanda-bravos' },
      { name: 'Abrão', number: 6, position: 'MID', isStarter: true, playerId: 'abrao-bravos' },
      { name: 'Cueta', number: 7, position: 'MID', isStarter: true, playerId: 'cueta-bravos' },
      { name: 'Ju Cabral', number: 8, position: 'MID', isStarter: true, playerId: 'ju-cabral-bravos' },
      { name: 'Jorginho', number: 19, position: 'FWD', isStarter: true, playerId: 'jorginho-bravos' },
      { name: 'Lito', number: 23, position: 'FWD', isStarter: true, playerId: 'lito-bravos' },
      { name: 'Bani', number: 20, position: 'FWD', isStarter: true, playerId: 'bani-bravos' },
      // Suplentes (isStarter: false)
      { name: 'Agnaldo', number: 3, position: 'DEF', isStarter: false, playerId: 'agnaldo-bravos' },
      { name: 'Higino', number: 10, position: 'MID', isStarter: false, playerId: 'higino-bravos' },
      { name: 'Tiago', number: 15, position: 'FWD', isStarter: false, playerId: 'tiago-bravos' },
    ],
    away: [
      // Titulares (isStarter: true)
      { name: 'Leonardo', number: 13, position: 'GK', isStarter: true, playerId: 'leonardo-sagrada' },
      { name: 'Miguel', number: 5, position: 'DEF', isStarter: true, playerId: 'miguel-sagrada' },
      { name: 'Tobias', number: 14, position: 'DEF', isStarter: true, playerId: 'tobias-sagrada' },
      { name: 'Gogoró', number: 17, position: 'DEF', isStarter: true, playerId: 'gogoro-sagrada' },
      { name: 'Luís Tati', number: 20, position: 'DEF', isStarter: true, playerId: 'luis-tati-sagrada' },
      { name: 'Cahilo', number: 32, position: 'MID', isStarter: true, playerId: 'cahilo-sagrada' },
      { name: 'Afonso', number: 24, position: 'MID', isStarter: true, playerId: 'afonso-sagrada' },
      { name: 'Lépua', number: 10, position: 'MID', isStarter: true, playerId: 'lepua-sagrada' },
      { name: 'Pimpão', number: 16, position: 'FWD', isStarter: true, playerId: 'pimpao-sagrada' },
      { name: 'Dabanda', number: 7, position: 'FWD', isStarter: true, playerId: 'dabanda-sagrada' },
      { name: 'Jorge', number: 9, position: 'FWD', isStarter: true, playerId: 'jorginho-sagrada' },
      // Suplentes (isStarter: false)
      { name: 'Nsesani', number: 12, position: 'GK', isStarter: false, playerId: 'nsesani-sagrada' },
      { name: 'Silvano', number: 18, position: 'FWD', isStarter: false, playerId: 'silvano-sagrada' },
    ],
  },

  // Eventos cronológicos da partida
  // Tipos: 'goal', 'yellow', 'red', 'sub'
  events: [
    { minute: 23, type: 'goal', team: 'home', player: 'Ju Cabral', playerId: 'ju-cabral-bravos', detail: '1-0' },
    { minute: 33, type: 'goal', team: 'home', player: 'Lito', playerId: 'lito-bravos', detail: '2-0' },
    { minute: 45, type: 'sub', team: 'home', player: 'Higino', playerId: 'higino-bravos', playerOut: 'Cueta' },
    { minute: 48, type: 'yellow', team: 'away', player: 'Miguel Daniel', playerId: 'miguel-sagrada', detail: 'Protestos' },
    { minute: 78, type: 'goal', team: 'home', player: 'Gladilson', playerId: 'gladilson-bravos', detail: '3-0' },
  ],

  // Estatísticas oficiais (apenas as publicadas na ficha oficial)
  stats: {
    home: { yellowCards: 1, redCards: 0, corners: 5 },
    away: { yellowCards: 1, redCards: 0, corners: 3 },
    keys: ['yellowCards', 'redCards', 'corners'],
  },
});
