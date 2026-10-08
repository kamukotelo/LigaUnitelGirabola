// 3.ª jornada · Sagrada Esperança–Kabuscorp SC
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-3-3',
  round: 3,
  homeTeamId: 'sagrada',
  awayTeamId: 'kabuscorp',
  schedule: { date: '2026-10-07T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', source: 'Cartaz oficial do jogo adiado da 3.ª jornada, recebido a 29/09/2026', stadiumException: 'Jogo adiado da 3.ª jornada remarcado para Luanda, Estádio França N’dalu (29/09/2026)', fieldInversionNote: true },
  // Resultado recebido a 07/10/2026 (aguarda o relatório do árbitro).
  result: { status: 'finished', homeScore: 1, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-10-07T17:47:00+01:00' },
  // Nomeação de arbitragem recebida a 06/10/2026.
  officials: { referee: 'Edilson André', assistants: ['Joaquim Chiyo', 'Domingos Francisco'], fourth: 'Sabino de Carvalho' },
  events: [
    { minute: 77, type: 'goal', team: 'home', player: 'M. Dala', playerId: 'melono-sagrada', detail: '1-0' },
  ],
  // Escalações publicadas pela Liga (cartazes "XI", 07/10/2026).
  lineups: {
    home: [
      { name: 'Nsesani', number: 12, position: 'GK', isStarter: true, playerId: 'nsesani-sagrada' },
      { name: 'Alexandre', number: 2, position: 'DEF', isStarter: true, playerId: 'fifa-1v1a1u9' },
      { name: 'Manú', number: 3, position: 'DEF', isStarter: true, playerId: 'manuel-sagrada' },
      { name: 'Tobias', number: 14, position: 'DEF', isStarter: true, playerId: 'tobias-sagrada' },
      { name: 'Luís Tati', number: 20, position: 'DEF', isStarter: true, playerId: 'luis-tati-sagrada' },
      { name: 'Celso Cabuço', number: 8, position: 'MID', isStarter: true, playerId: 'guilherme-sagrada' },
      { name: 'Lépua', number: 10, position: 'MID', isStarter: true, playerId: 'lepua-sagrada' },
      { name: 'Messias', number: 21, isStarter: true, playerId: 'fifa-1v0z7l2' },
      { name: 'Mafuta', number: 24, isStarter: true, playerId: 'mafuta-sagrada' },
      { name: 'Dabanda', number: 7, position: 'FWD', isStarter: true, isCaptain: true, playerId: 'dabanda-sagrada' },
      { name: 'Melono Dala', number: 11, position: 'FWD', isStarter: true, playerId: 'melono-sagrada' },
      { name: 'Lita', number: 0, isStarter: false },
      { name: 'Jorge', number: 9, position: 'FWD', isStarter: false, playerId: 'jorge-sagrada' },
      { name: 'Gogoró', number: 17, position: 'DEF', isStarter: false, playerId: 'gogoro-sagrada' },
      { name: 'Léo Mutunda', number: 13, position: 'GK', isStarter: false, playerId: 'leonardo-sagrada' },
      { name: 'Manox', number: 0, isStarter: false },
      { name: 'Lulas', number: 0, isStarter: false },
      { name: 'Pipocas', number: 0, isStarter: false },
      { name: 'Barreira', number: 28, position: 'DEF', isStarter: false, playerId: 'barreira-sagrada' },
      { name: 'Kandumba', number: 34, isStarter: false, playerId: 'fifa-1jrv034' },
    ],
    away: [
      { name: 'JB', number: 12, position: 'GK', isStarter: true, playerId: 'fifa-1jriue5' },
      { name: 'Ady Boyo', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1snb179' },
      { name: 'Ndongala', number: 13, position: 'DEF', isStarter: true, playerId: 'fifa-1v363c3' },
      { name: 'Henock', number: 16, position: 'DEF', isStarter: true, isCaptain: true, playerId: 'fifa-1mppsb5' },
      { name: 'Zito', number: 6, isStarter: true },
      { name: 'Cuca', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1k2pk58' },
      { name: 'Diógenes', number: 32, position: 'MID', isStarter: true, playerId: 'fifa-1jrtxh4' },
      { name: 'Mpiana', number: 39, isStarter: true },
      { name: 'Bayala', number: 7, position: 'FWD', isStarter: true, playerId: 'fifa-1n3uhm6' },
      { name: 'Mona', number: 17, position: 'FWD', isStarter: true, playerId: 'fifa-1jxicb5' },
      { name: 'Jó', number: 19, position: 'FWD', isStarter: true, playerId: 'fifa-1jm8hd7' },
      { name: 'Zamorano', number: 2, position: 'DEF', isStarter: false, playerId: 'fifa-1k4a836' },
      { name: 'Mbali Sem', number: 8, position: 'MID', isStarter: false, playerId: 'fifa-1v363a9' },
      { name: 'Malungo', number: 14, position: 'DEF', isStarter: false, playerId: 'fifa-1k1sen7' },
      { name: 'Kilola', number: 15, position: 'MID', isStarter: false, playerId: 'fifa-1jm7zr2' },
      { name: 'Mualucano', number: 22, position: 'GK', isStarter: false, playerId: 'fifa-1jrtva7' },
      { name: 'Nathan', number: 0, isStarter: false },
      { name: 'Tresor', number: 25, position: 'FWD', isStarter: false, playerId: 'fifa-1snez57' },
      { name: 'Cacharamba', number: 27, position: 'MID', isStarter: false, playerId: 'fifa-1pnr1r0' },
      { name: 'Muemba', number: 28, position: 'DEF', isStarter: false, playerId: 'fifa-1qxnl72' },
    ],
  },
});
