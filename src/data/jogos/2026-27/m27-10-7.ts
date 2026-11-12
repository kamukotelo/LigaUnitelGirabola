// 10.ª jornada · Desportivo da Huíla–Kabuscorp SC
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-10-7',
  round: 10,
  homeTeamId: 'desphuila',
  awayTeamId: 'kabuscorp',
  // Sem transmissão Zsports (passa a Rádio 5), indicação do Diretor de Competições (Emanuel Valodia, 05/11/2026).
  // Domingo 08/11 15:00 → 15:30, indicação do Diretor de Competições (Emanuel Valodia, 05/11/2026, 15:51).
  schedule: { date: '2026-11-08T15:30:00+01:00', stadium: 'Estádio da Tundavala', scheduleStatus: 'official', source: 'Diretor de Competições DCE/ANCAF (Emanuel Valodia, 05/11/2026): 15:30; antes: DCE/ANCAF, 05/10/2026: domingo, 08/11, 15:00; sem Zsports: Diretor de Competições (Emanuel Valodia, 05/11/2026)' },
  // Resultado recebido a 08/11/2026; minuto do golo do Relatório do Árbitro n.º 76 (12/11/2026): 81' (a captura da app dizia 89').
  result: { status: 'finished', homeScore: 1, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-11-08T17:30:00+01:00' },
  // Equipa de arbitragem do Relatório do Árbitro n.º 76 (12/11/2026).
  officials: { referee: 'António Caluassi Dungula', assistants: ['Victorino Nangolo Dungula', 'Zacarias Chivanja Calembe'], fourth: 'Laurinda Tchiquele Caluvi', commissioner: 'Vicente Domingos Napoleão Garcia' },
  events: [
    { minute: 81, type: 'goal', team: 'home', player: 'Ado Pena', number: 27, playerId: 'ado-pena-huila', detail: '1-0' },
  ],
});
