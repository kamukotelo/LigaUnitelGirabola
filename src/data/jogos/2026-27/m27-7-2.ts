// 7.ª jornada · FC Luanda–Desportivo da Huíla
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-7-2',
  round: 7,
  homeTeamId: 'fcluanda',
  awayTeamId: 'desphuila',
  // Sem Zsports: fora da lista de jogos transmitidos pela Zsports da 6.ª à 10.ª jornada,
  // recebida a 12/10/2026 (o mapa de 28/09/2026 indicava Zsports). Fica na Rádio 5.
  schedule: { date: '2026-10-18T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Nomeação de arbitragem recebida a 16/10/2026 (nomes completos das fichas anteriores).
  officials: { referee: 'Donaciano Mulumba', assistants: ['Alzandre Diógenes Muiamba Capola', 'Manuel Dulo Cabaça'], fourth: 'Sanda Mateus Miguel Kitu' },
});
