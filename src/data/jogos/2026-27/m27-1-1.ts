// 1.ª jornada · FC Luanda–CR Caála
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-1-1',
  round: 1,
  homeTeamId: 'fcluanda',
  awayTeamId: 'caala',
  schedule: { date: '2026-08-23T15:00:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official' },
  result: { status: 'finished', homeScore: 0, awayScore: 0, halfTimeScore: '0-0', attendance: 1500, updatedAt: '2026-09-06T17:50:00+01:00' },
  officials: { referee: 'Gilberto Bernardino Kativa', assistants: ['Estanislau Guedes Tavares Muluta Prata', 'Jeremias Sessenta Cafussa'], fourth: 'Aldair Quissanga Rodrigues Carmelino' },
  events: [
    { minute: 5, type: 'sub', team: 'away', player: 'José Manuel Raul', playerOut: 'Manuel Zange Miguel' },
    { minute: 40, type: 'yellow', team: 'away', player: 'Lisneu Emanuel Neto Simao', playerId: 'lisneu-caala', detail: 'Rasteirou o adversário' },
    { minute: 63, type: 'sub', team: 'home', player: 'Estêvão Cahoko', playerOut: 'Miguel Nzau Manuel Matos' },
    { minute: 63, type: 'sub', team: 'home', player: 'Pedro Paulo', playerOut: 'Jaime Caetano' },
    { minute: 65, type: 'sub', team: 'away', player: 'Timóteo Sambissa', playerOut: 'Domingos Lourenço Cuxixima' },
    { minute: 65, type: 'sub', team: 'away', player: 'Benvindo Miguel André Afonso', playerOut: 'Arilson de Ceita Pereira Jorge' },
    { minute: 79, type: 'sub', team: 'away', player: 'Osvaldo José', playerOut: 'Benedito Antunes' },
    { minute: 79, type: 'sub', team: 'away', player: 'Gabriel Venâncio', playerOut: 'Hermenegildo Sandumbo' },
    { minute: 81, type: 'sub', team: 'home', player: 'Domingos André', playerOut: 'Arnaldo Dielo' },
    { minute: 81, type: 'sub', team: 'home', player: 'Batista João Kachama', playerOut: 'Domingos Bangula' },
    { minute: 87, type: 'sub', team: 'home', player: 'Francisco Chiquinho', playerOut: 'Denilson Makokisa' },
  ],
  stats: {
    home: { corners: 1, yellowCards: 0, redCards: 0 },
    away: { corners: 0, yellowCards: 1, redCards: 0 },
    keys: ['corners', 'yellowCards', 'redCards'],
  },
});
