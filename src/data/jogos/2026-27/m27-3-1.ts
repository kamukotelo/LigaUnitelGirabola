// 3.ª jornada · Desportivo da Lunda Sul–CR Caála
// Ficha oficial da arbitragem (Match No. 20 · 05/09/2026 · Estádio Sagrada Esperança, Dundo).
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-3-1',
  round: 3,
  homeTeamId: 'lundasul',
  awayTeamId: 'caala',
  schedule: { date: '2026-09-05T15:00:00+01:00', stadium: 'Estádio do Sagrada Esperança', scheduleStatus: 'official' },
  result: { status: 'finished', homeScore: 1, awayScore: 2, halfTimeScore: '1-0', attendance: 200, updatedAt: '2026-09-06T09:00:00+01:00' },
  officials: { referee: 'Aldair Quissanga Rodrigues Carmelino', assistants: ['Nery Domingos Pereira Amador da Silva', 'Januário Simões Francisco'], fourth: 'Fábio Ricardo dos Santos Macano', commissioner: 'João Amado Muanda Goma' },
  events: [
    { minute: 1, type: 'yellow', team: 'home', player: 'Cachindele', playerId: 'fifa-1jz48i2' },
    { minute: 15, type: 'goal', team: 'home', player: 'Mariano da Costa Vidal', playerId: 'fifa-1jsrqb0', ownGoal: true, detail: 'Autogolo · 1-0' },
    { minute: 44, type: 'yellow', team: 'home', player: 'Platiny', playerId: 'platini' },
    { minute: 45, type: 'sub', team: 'home', player: 'João Bivoba Zau', playerId: 'fifa-1kzthb4', playerOut: 'Joaquim Teixeira' },
    { minute: 52, type: 'goal', team: 'away', player: 'Benvindo Miguel André Afonso', playerId: 'fifa-1jz4pi8', detail: '1-1' },
    { minute: 57, type: 'sub', team: 'home', player: 'Bernardo Raimundo Nacavuza', playerOut: 'Félix Honjo' },
    { minute: 57, type: 'sub', team: 'home', player: 'António Ngola Ngulu', playerId: 'fifa-1jwt8s6', playerOut: 'João Baptista Cassicote' },
    { minute: 61, type: 'sub', team: 'away', player: 'Benedito Antunes', playerId: 'fifa-1lda172', playerOut: 'Benvindo Miguel André Afonso' },
    { minute: 61, type: 'sub', team: 'away', player: 'Ernesto Vieira', playerId: 'fifa-1qvfe29', playerOut: 'Gabriel Venâncio' },
    { minute: 64, type: 'yellow', team: 'away', player: 'Arilson de Ceita Pereira Jorge', playerId: 'fifa-1jwgzb2' },
    { minute: 68, type: 'sub', team: 'away', player: 'José Manuel Raul', playerId: 'fifa-1r8lp51', playerOut: 'Timóteo Sambissa' },
    { minute: 72, type: 'yellow', team: 'home', player: 'Singongo', playerId: 'fifa-1k2pgl3' },
    { minute: 75, type: 'sub', team: 'home', player: 'João Silvano Caluvili', playerId: 'fifa-1kf4fa8', playerOut: 'Platiny' },
    { minute: 82, type: 'sub', team: 'away', player: 'Tiago Jamba Adelino', playerId: 'fifa-1uy6ar6', playerOut: 'Cuxixima' },
    { minute: 82, type: 'sub', team: 'away', player: 'Osvaldo José', playerId: 'fifa-1kz4es4', playerOut: 'Arilson de Ceita Pereira Jorge' },
    { minute: 83, type: 'yellow', team: 'away', player: 'Ernesto Vieira', playerId: 'fifa-1qvfe29' },
    { minute: 90, type: 'sub', team: 'home', player: 'Mário Bernardo Keta', playerId: 'fifa-1jzmgd3', playerOut: 'Kibuata' },
    { minute: 90, type: 'goal', team: 'away', player: 'Tiago Jamba Adelino', playerId: 'fifa-1uy6ar6', detail: "90'+4' · 1-2" },
    { minute: 90, type: 'yellow', team: 'away', player: 'Tiago Jamba Adelino', playerId: 'fifa-1uy6ar6', detail: "90'+5' · celebração excessiva" },
  ],
  stats: {
    home: { yellowCards: 3, redCards: 0 },
    away: { yellowCards: 3, redCards: 0 },
    keys: ['yellowCards', 'redCards'],
  },
});
