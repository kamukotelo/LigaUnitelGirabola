// 11.ª jornada · CR Caála–Estrela 1.º de Maio
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-11-1',
  round: 11,
  homeTeamId: 'caala',
  awayTeamId: 'primeiromaio',
  schedule: { date: '2026-11-22T15:30:00+01:00', stadium: 'Estádio Daniel Lutucuta', scheduleStatus: 'official', source: 'Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026' },
  // Nomeação de árbitros, jogo n.º 86 (mensagem enviada pelo utilizador, 19/11/2026); nomes completos dos registos anteriores.
  officials: { referee: 'Bernardo Hossi Nangolo', assistants: ['António Emiliano Livongue', 'Jeremias Sessenta Cafussa'], fourth: 'Ana Kuvundu Pumba' },
  // Resultado e marcadores: captura da Sofascore enviada pelo utilizador (22/11/2026, 17:31): 4-1, intervalo 3-0.
  // Ligados ao plantel: «Ejaita Ifoni» = Ifony (#28), «Benvindo Afonso» (#4), «D. L. F. Cuxixima» (#7).
  // Caio Pinho e Domingos dos Santos ainda sem página de jogador (não constam da inscrição nem das fichas).
  result: { status: 'finished', homeScore: 4, awayScore: 1, halfTimeScore: '3-0', updatedAt: '2026-11-22T17:31:00+01:00' },
  events: [
    { minute: 17, type: 'goal', team: 'home', player: 'Ifony', number: 28, playerId: 'ifony-caala', detail: '1-0' },
    { minute: 26, type: 'goal', team: 'home', player: 'Caio Pinho', detail: '2-0' },
    { minute: 28, type: 'goal', team: 'home', player: 'Benvindo', number: 4, playerId: 'fifa-1jz4pi8', detail: '3-0' },
    { minute: 63, type: 'goal', team: 'away', player: 'Domingos dos Santos', detail: '3-1' },
    { minute: 93, type: 'goal', team: 'home', player: 'Cuxixima', number: 7, playerId: 'cuxixima-caala', detail: "90'+3 · 4-1" },
  ],
});
