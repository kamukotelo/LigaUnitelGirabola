// 11.ª jornada · Académica do Lobito–Recreativo do Libolo
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-11-2',
  round: 11,
  homeTeamId: 'lobito',
  awayTeamId: 'libolo',
  schedule: { date: '2026-11-21T15:30:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official', source: 'Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026' },
  // A Académica recebe no Estádio Nacional de Ombaka (indicação de 28/09/2026).
  // Nomeação de árbitros, jogo n.º 83 (mensagem enviada pelo utilizador, 19/11/2026); nomes completos dos registos anteriores.
  // A nomeação diz «Acad. Lobito vs CR Caala»; o Diretor de Competições (Emanuel Valodia, 19/11/2026, 12:23)
  // confirmou com o cartaz que o n.º 83 é Académica do Lobito–Recreativo do Libolo.
  officials: { referee: 'Edson António Esoko', assistants: ['Jerson Emiliano dos Santos', 'Estanislau Guedes Tavares Muluta Prata'], fourth: 'António Caluassi Dungula' },
});
