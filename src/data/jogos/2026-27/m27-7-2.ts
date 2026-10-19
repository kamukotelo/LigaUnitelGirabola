// 7.ª jornada · FC Luanda–Desportivo da Huíla
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-7-2',
  round: 7,
  homeTeamId: 'fcluanda',
  awayTeamId: 'desphuila',
  // Sem Zsports: fora da lista de jogos transmitidos pela Zsports da 6.ª à 10.ª jornada,
  // recebida a 12/10/2026 (o mapa de 28/09/2026 indicava Zsports). Fica na Rádio 5.
  // Hora de início 15:00 segundo o Relatório do Árbitro n.º 55 (19/10/2026); o mapa
  // indicava 15:30.
  schedule: { date: '2026-10-18T15:00:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026); hora: Relatório do Árbitro n.º 55 (19/10/2026)' },
  // Resultado conferido com o Relatório do Árbitro n.º 55 (19/10/2026).
  result: { status: 'finished', homeScore: 0, awayScore: 2, halfTimeScore: '0-1', attendance: 1000, updatedAt: '2026-10-19T21:00:00+01:00' },
  events: [
    // Golos, cartões e substituições do Relatório do Árbitro n.º 55 (ANCAF), conferido a 19/10/2026.
    { minute: 18, type: 'yellow', team: 'away', player: 'Ludy', number: 13, playerId: 'lucas-elias-huila', detail: 'impedir um ataque prometedor a equipa adversária, ao passar uma rasteira ao jogador adversário' },
    { minute: 24, type: 'goal', team: 'away', player: 'Katendi', number: 2, playerId: 'katendi-huila', detail: '0-1' },
    { minute: 34, type: 'yellow', team: 'home', player: 'Gabriel dos Santos Silva Calvacante Gabriel', number: 21, detail: 'Passar uma rasteira ao adversário' },
    { minute: 43, type: 'yellow', team: 'away', player: 'Ludy', number: 13, playerId: 'lucas-elias-huila', detail: 'Retardar o recomeço do jogo, ao movimentar constantemente a bola durante a execução de um pontapé livre directo a favor da sua equipa' },
    { minute: 43, type: 'red', team: 'away', player: 'Ludy', number: 13, playerId: 'lucas-elias-huila', detail: 'Segundo amarelo' },
    { minute: 45, type: 'sub', team: 'home', player: 'João José António', number: 11, playerOut: 'Pedro' },
    { minute: 45, type: 'sub', team: 'home', player: 'Domingos André', number: 14, playerId: 'fifa-1mall47', playerOut: 'Gabriel dos Santos Silva Calvacante Gabriel' },
    { minute: 45, type: 'sub', team: 'away', player: 'Jo', number: 6, playerId: 'joao-milagre-huila', playerOut: 'Cabibi' },
    { minute: 45, type: 'sub', team: 'away', player: 'Pequenino Castro (Cagodo)', number: 29, playerId: 'pequenino-castro-huila', playerOut: 'Tchicundico Cassoma Tchitunda (Constantino)' },
    { minute: 56, type: 'sub', team: 'away', player: 'Milagre Carlos Simba', number: 25, playerId: 'milagre-simba-huila', playerOut: 'Filó' },
    { minute: 62, type: 'sub', team: 'home', player: 'Domingos Bangula', number: 25, playerId: 'fifa-1l08hy2', playerOut: 'Arnaldo Dielo' },
    { minute: 68, type: 'sub', team: 'away', player: 'Ady', number: 3, playerId: 'desphuila-player-3', playerOut: 'Angelo Cangu (Tchutchu)' },
    { minute: 75, type: 'sub', team: 'home', player: 'Estevao Cahoko', number: 24, playerId: 'fifa-1k0rp19', playerOut: 'Hamilton' },
    { minute: 80, type: 'sub', team: 'home', player: 'Thiagos Santos Lima Thiagos', number: 18, playerOut: 'Celio Nimi' },
    { minute: 81, type: 'goal', team: 'away', player: 'Milagre Carlos Simba', number: 25, playerId: 'milagre-simba-huila', detail: '0-2' },
    { minute: 82, type: 'yellow', team: 'home', player: 'Thiagos Santos Lima Thiagos', number: 18, detail: 'prática de jogo perigoso sem contacto' },
  ],
  // Onze inicial e suplentes do Relatório do Árbitro n.º 55 (19/10/2026).
  lineups: {
    home: [
      { name: 'Ludiakueno', number: 12, position: 'GK', isStarter: true, playerId: 'fifa-1l7wk59' },
      { name: 'Filipe Malanda', number: 17, position: 'DEF', isStarter: true, playerId: 'fifa-1k2wth5' },
      { name: 'Hamilton', number: 2, position: 'MID', isStarter: true, playerId: 'fifa-1maldz0' },
      { name: 'Joel Diaku', number: 4, position: 'DEF', isStarter: true, playerId: 'fifa-1qhqn96' },
      { name: 'Pedro', number: 7, position: 'MID', isStarter: true, playerId: 'fifa-1liwnq8' },
      { name: 'Gelson André', number: 8, position: 'MID', isStarter: true, playerId: 'fifa-1ljudk2' },
      { name: 'Francisco', number: 9, position: 'FWD', isStarter: true, playerId: 'fifa-1l11132' },
      { name: 'Arnaldo Dielo', number: 16, position: 'MID', isStarter: true, playerId: 'fifa-1m8xdu3' },
      { name: 'Gabriel dos Santos Silva Calvacante Gabriel', number: 21, isStarter: true },
      { name: 'Celio Nimi', number: 26, position: 'MID', isStarter: true, playerId: 'fifa-1qw3z14' },
      { name: 'Jaime', number: 30, position: 'MID', isStarter: true, playerId: 'fifa-1qw9vb1' },
      { name: 'João José António', number: 11, isStarter: false },
      { name: 'Domingos André', number: 14, position: 'MID', isStarter: false, playerId: 'fifa-1mall47' },
      { name: 'Ruben Luwawa', number: 15, position: 'MID', isStarter: false, playerId: 'fifa-1t6b2z2' },
      { name: 'Thiagos Santos Lima Thiagos', number: 18, isStarter: false },
      { name: 'Deo', number: 22, position: 'GK', isStarter: false, playerId: 'fifa-1l7w9k9' },
      { name: 'Estevao Cahoko', number: 24, position: 'MID', isStarter: false, playerId: 'fifa-1k0rp19' },
      { name: 'Domingos Bangula', number: 25, position: 'MID', isStarter: false, playerId: 'fifa-1l08hy2' },
      { name: 'Batista Kachama', number: 27, position: 'MID', isStarter: false, playerId: 'fifa-1v0ca42' },
      { name: 'Kano', number: 31, position: 'FWD', isStarter: false, playerId: 'fifa-1malhf8' },
    ],
    away: [
      { name: 'Ndulo', number: 1, position: 'GK', isStarter: true, playerId: 'ndulo-huila' },
      { name: 'Elias', number: 15, position: 'MID', isStarter: true, playerId: 'elias-huila' },
      { name: 'Katendi', number: 2, position: 'DEF', isStarter: true, playerId: 'katendi-huila' },
      { name: 'Dos Santos', number: 4, position: 'DEF', isStarter: true, playerId: 'dos-santos-huila' },
      { name: 'Cabibi', number: 7, position: 'FWD', isStarter: true, playerId: 'leonardo-isola-huila' },
      { name: 'Mendes', number: 10, position: 'FWD', isStarter: true, playerId: 'mendes-huila' },
      { name: 'Ludy', number: 13, position: 'DEF', isStarter: true, playerId: 'lucas-elias-huila' },
      { name: 'Filó', number: 16, position: 'FWD', isStarter: true, playerId: 'fifa-1ni87h8' },
      { name: 'Angelo Cangu (Tchutchu)', number: 21, position: 'MID', isStarter: true, playerId: 'angelo-cangu-huila' },
      { name: 'Jeremias', number: 26, position: 'DEF', isStarter: true, playerId: 'jeremias-huila' },
      { name: 'Tchicundico Cassoma Tchitunda (Constantino)', number: 32, position: 'MID', isStarter: true, playerId: 'tchicundico-huila' },
      { name: 'Ady', number: 3, position: 'DEF', isStarter: false, playerId: 'desphuila-player-3' },
      { name: 'Jo', number: 6, position: 'DEF', isStarter: false, playerId: 'joao-milagre-huila' },
      { name: 'Passy', number: 12, position: 'GK', isStarter: false, playerId: 'passy-huila' },
      { name: 'Toyzinho', number: 20, position: 'MID', isStarter: false, playerId: 'toyzinho-huila' },
      { name: 'Florentino António', number: 23, position: 'DEF', isStarter: false, playerId: 'fifa-1k176v9' },
      { name: 'Milagre Carlos Simba', number: 25, position: 'FWD', isStarter: false, playerId: 'milagre-simba-huila' },
      { name: 'Ado Pena', number: 27, position: 'MID', isStarter: false, playerId: 'ado-pena-huila' },
      { name: 'Pequenino Castro (Cagodo)', number: 29, position: 'MID', isStarter: false, playerId: 'pequenino-castro-huila' },
      { name: 'Diloy Valerio', number: 31, position: 'FWD', isStarter: false, playerId: 'fifa-1mdngv9' },
    ],
  },
  // Nomeação de arbitragem recebida a 16/10/2026 (nomes completos das fichas anteriores).
  officials: { referee: 'Donaciano Mulumba', assistants: ['Alzandre Diógenes Muiamba Capola', 'Manuel Dulo Cabaça'], fourth: 'Sanda Mateus Miguel Kitu', commissioner: 'Henrique Domingos Bernardo da Rocha' },
});
