// 7.ª jornada · São Salvador–Estrela 1.º de Maio
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-7-7',
  round: 7,
  homeTeamId: 'saosalvador',
  awayTeamId: 'primeiromaio',
  schedule: { date: '2026-10-18T15:00:00+01:00', stadium: 'Estádio Álvaro Buta', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Resultado recebido a 18/10/2026 (aguarda o relatório do árbitro). Golo dos 83'
  // sem marcador identificado; «Nixon» é o n.º 11 do 1.º de Maio, ainda sem ficha.
  result: { status: 'finished', homeScore: 2, awayScore: 1, halfTimeScore: '1-0', updatedAt: '2026-10-18T17:30:00+01:00' },
  events: [
    { minute: 45, type: 'goal', team: 'home', player: 'Eduardo Moyo', number: 22, playerId: 'fifa-1k1sm82', detail: '1-0' },
    { minute: 83, type: 'goal', team: 'home', player: '', detail: '2-0' },
    { minute: 90, type: 'goal', team: 'away', player: 'Nixon', number: 11, detail: '2-1' },
  ],
  // Nomeação de arbitragem recebida a 16/10/2026 (nomes completos das fichas anteriores).
  officials: { referee: 'Sabino Garcez de Sousa de Carvalho', assistants: ['Evandro Henrique Freitas da Rocha', 'João Manuel Fula António'], fourth: 'Garcia Luhamo Remos' },
  // O mapa final da ANCAF (28/09/2026) escreve «Domingo, 17/10», mas 17/10 é
  // sábado; a data confirmada é domingo, 18/10.
});
