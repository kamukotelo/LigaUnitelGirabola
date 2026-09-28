// 2.ª jornada · Sagrada Esperança–São Salvador
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-2-4',
  round: 2,
  homeTeamId: 'sagrada',
  awayTeamId: 'saosalvador',
  schedule: { date: '2026-08-29T15:00:00+01:00', stadium: 'Estádio do Sagrada Esperança', scheduleStatus: 'official' },
  result: { status: 'finished', homeScore: 3, awayScore: 1, halfTimeScore: '1-0', attendance: 1000, updatedAt: '2026-09-06T17:50:00+01:00' },
  officials: { referee: 'Paulo Sérgio Moreira', assistants: ['Lídio Chicomo Cuimbra', 'Segunda Chisseque Francisco'], fourth: 'Donaciano Mulumba' },
  coaches: { home: 'Francisco Moniz', away: 'Domingos Cussanda' },
  events: [
    { minute: 45, type: 'goal', team: 'home', player: 'Mafuta', playerId: 'mafuta-sagrada', detail: '1-0' },
    { minute: 49, type: 'goal', team: 'away', player: 'Anderson Mputa', playerId: 'anderson-mputa-saosalvador', detail: '1-1' },
    { minute: 64, type: 'goal', team: 'home', player: 'Augusto Fecayamale', ownGoal: true, detail: 'A confirmar · 2-1' },
    { minute: 92, type: 'goal', team: 'home', player: 'M. Dala', playerId: 'm-dala-sagrada', detail: "90'+2 · 3-1" },
    { minute: 25, type: 'sub', team: 'away', player: 'Anderson de Jesus Luís Mputa', playerOut: 'Samuel Chissapa Cachimbombo' },
    { minute: 36, type: 'yellow', team: 'home', player: 'Alexandre Abel Fernando', playerId: 'fifa-1v1a1u9', detail: 'Segurar a bola com as mãos, simulando falta' },
    { minute: 46, type: 'sub', team: 'home', player: 'Felisberto Dala Sebastião', playerOut: 'Barreira Paulo' },
    { minute: 46, type: 'sub', team: 'away', player: 'Justino Tchitepa César', playerOut: 'Lucas Filemon Cassule' },
    { minute: 60, type: 'sub', team: 'home', player: 'Guilherme Francisco Saiendo Cabuço', playerOut: 'Afonso Marques' },
    { minute: 71, type: 'yellow', team: 'away', player: 'Manuel de Matos', playerId: 'fifa-1jzirz7', detail: 'Protestar constantemente as decisões do árbitro' },
    { minute: 81, type: 'sub', team: 'away', player: 'Afonso Lukombo António', playerOut: 'Caetano Gomes' },
    { minute: 81, type: 'sub', team: 'away', player: 'João André Vemba', playerOut: 'Fernando Lizandro Firmino Camuege' },
    { minute: 89, type: 'sub', team: 'away', player: 'Wilson Gonçalves Tenete', playerOut: 'Batomene de Sousa' },
    { minute: 91, type: 'sub', team: 'home', player: 'Hahilo Sapalo Alberto', playerOut: 'Jorge Txando Francisco Lucussa' },
  ],
  stats: {
    home: { yellowCards: 1, redCards: 0 },
    away: { yellowCards: 1, redCards: 0 },
    keys: ['yellowCards', 'redCards'],
  },
});
