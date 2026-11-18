// 14.ª jornada · FC Luanda–Bravos do Maquis
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-14-8',
  round: 14,
  homeTeamId: 'fcluanda',
  awayTeamId: 'bravos',
  // Data 13/12 → 11/12 (grupo DCE, 13:05) → sexta 18/12 (mensagem do Diretor, 16:30): Diretor de Competições DCE/ANCAF (Emanuel Valodia, 18/11/2026); hora e estádio sem alteração.
  schedule: { date: '2026-12-18T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', source: 'Diretor de Competições DCE/ANCAF (Emanuel Valodia, 18/11/2026, 16:30): sexta 18/12 (antes 11/12, grupo DCE 18/11/2026); antes: Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026' },
});
