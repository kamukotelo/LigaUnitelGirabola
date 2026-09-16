// 2.ª jornada · GD Interclube–FC Luanda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-2-5',
  round: 2,
  homeTeamId: 'interclube',
  awayTeamId: 'fcluanda',
  schedule: { date: '2026-08-28T15:30:00+01:00', stadium: 'Estádio 22 de Junho', scheduleStatus: 'official', broadcaster: 'Zsports' },
  result: { status: 'finished', homeScore: 2, awayScore: 1, halfTimeScore: '0-0', attendance: 3623, updatedAt: '2026-09-06T17:50:00+01:00' },
  officials: { referee: 'Miguel Julião Mateus', assistants: ['Pedro Domingos de Andrade Micolo', 'Domingos Monteiro Francisco'], fourth: 'Aldair Quissanga Rodrigues Carmelino' },
  events: [
    { minute: 10, type: 'yellow', team: 'away', player: 'Gelson dos Santos André', playerId: 'fifa-1ljudk2', detail: 'Rasteirou o adversário' },
    { minute: 36, type: 'yellow', team: 'home', player: 'Paulo Gaspar', playerId: 'fifa-1m92d85' },
    { minute: 45, type: 'sub', team: 'away', player: 'Francisco Chiquinho', playerOut: 'Domingos Bangula' },
    { minute: 45, type: 'sub', team: 'away', player: 'Pedro Paulo', playerOut: 'Miguel Nzau Manuel Matos' },
    { minute: 49, type: 'goal', team: 'home', player: 'Silvano da Cruz', playerId: 'silvano-da-cruz-interclube', detail: '1-0' },
    { minute: 52, type: 'goal', team: 'home', player: 'Alberto Alves', playerId: 'alberto-alves-interclube', detail: '2-0' },
    { minute: 58, type: 'sub', team: 'home', player: 'Afonso Baptista', playerOut: 'Edivaldo Quinanga' },
    { minute: 72, type: 'yellow', team: 'away', player: 'Sebastião Palavra Ngola', playerId: 'sebastiao-palavra', detail: 'Protestar as decisões do árbitro' },
    { minute: 72, type: 'yellow', team: 'away', player: 'Adriano Manuel Pedro', playerId: 'adriano-pedro', detail: 'Protestar as decisões do árbitro' },
    { minute: 79, type: 'sub', team: 'away', player: 'Ricardo Batista', playerId: 'ricardo-batista-fcluanda', playerOut: 'Gelson dos Santos André' },
    { minute: 79, type: 'sub', team: 'away', player: 'Domingos André', playerOut: 'Denilson Makokisa' },
    { minute: 80, type: 'sub', team: 'home', player: 'Alexandre Domingos Ngunza Caculo', playerOut: 'Pedro Ganga' },
    { minute: 82, type: 'yellow', team: 'away', player: 'Ricardo Batista', playerId: 'ricardo-batista-fcluanda', detail: 'Impediu uma jogada prometedora de golo' },
    { minute: 85, type: 'sub', team: 'away', player: 'Jonilson José Manuel', playerOut: 'Arnaldo Dielo' },
    { minute: 90, type: 'sub', team: 'home', player: 'Bartolomeu Taivando Anacleto Sachimala', playerOut: 'Felisberto Tchacuiva' },
    { minute: 91, type: 'goal', team: 'away', player: 'Ricardo Batista', playerId: 'ricardo-batista-fcluanda', detail: "90'+1 · 2-1" },
  ],
  stats: {
    home: { yellowCards: 1, redCards: 0 },
    away: { yellowCards: 4, redCards: 0 },
    keys: ['yellowCards', 'redCards'],
  },
});
