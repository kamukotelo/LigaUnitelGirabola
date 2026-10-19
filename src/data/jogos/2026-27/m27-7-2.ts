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
  // Resultado recebido a 18/10/2026; cartões e expulsão do Relatório do Árbitro n.º 55
  // (19/10/2026, assistência 1000). «Zinho» não consta do plantel do Desportivo da
  // Huíla; «Gabriel» (n.º 21) e «Thiagos» (n.º 18) não constam do plantel do FC Luanda.
  result: { status: 'finished', homeScore: 0, awayScore: 2, halfTimeScore: '0-1', attendance: 1000, updatedAt: '2026-10-18T17:30:00+01:00' },
  events: [
    { minute: 18, type: 'yellow', team: 'away', player: 'Lucas Elias António Paulo', number: 13, playerId: 'lucas-elias-huila', detail: 'Rasteira que impediu um ataque prometedor' },
    { minute: 25, type: 'goal', team: 'away', player: 'Zinho', detail: '0-1' },
    { minute: 34, type: 'yellow', team: 'home', player: 'Gabriel dos Santos Silva Cavalcante', number: 21, detail: 'Rasteira ao adversário' },
    { minute: 43, type: 'yellow', team: 'away', player: 'Lucas Elias António Paulo', number: 13, playerId: 'lucas-elias-huila', detail: 'Retardar o recomeço do jogo' },
    { minute: 43, type: 'red', team: 'away', player: 'Lucas Elias António Paulo', number: 13, playerId: 'lucas-elias-huila', detail: 'Segundo amarelo' },
    { minute: 81, type: 'goal', team: 'away', player: 'Milagre Simba', playerId: 'milagre-simba-huila', detail: '0-2' },
    { minute: 82, type: 'yellow', team: 'home', player: 'Thiagos Santos Lima', number: 18, detail: 'Jogo perigoso sem contacto' },
  ],
  // Nomeação de arbitragem recebida a 16/10/2026 (nomes completos das fichas anteriores).
  officials: { referee: 'Donaciano Mulumba', assistants: ['Alzandre Diógenes Muiamba Capola', 'Manuel Dulo Cabaça'], fourth: 'Sanda Mateus Miguel Kitu' },
});
