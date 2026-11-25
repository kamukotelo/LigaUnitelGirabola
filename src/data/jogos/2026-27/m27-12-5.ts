// 12.ª jornada · CD 1.º de Agosto–Kabuscorp SC
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-12-5',
  round: 12,
  homeTeamId: 'dago',
  awayTeamId: 'kabuscorp',
  schedule: { date: '2026-11-25T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026' },
  // Nomeação enviada pelo utilizador em 24/11/2026. Nomes completos dos registos anteriores.
  officials: {
    referee: 'Edson António Esoko',
    assistants: ['Jerson Emiliano dos Santos', 'Carlos Pereira Gabriel'],
    fourth: 'Sabino Garcez de Sousa de Carvalho',
  },
  // Onze inicial e suplentes do FCMS, enviados pelo utilizador em 25/11/2026.
  // A ficha assinala Bonifácio e Henock como capitães.
  lineups: {
    home: [
      { name: 'Milton Antonio Candido', number: 2, position: 'DEF', isStarter: true, playerId: 'milton-dago' },
      { name: 'Bonifácio Francisco Caetano', number: 5, position: 'DEF', isStarter: true, isCaptain: true, playerId: 'bonifacio-dago' },
      { name: 'António Francisco Domingos', number: 7, position: 'FWD', isStarter: true, playerId: 'mabilson-dago' },
      { name: 'Axel Gaudêncio Mabaqui de Sousa', number: 8, position: 'MID', isStarter: true, playerId: 'axel-dago' },
      { name: 'Florindo Machado', number: 9, position: 'FWD', isStarter: true, playerId: 'rupson-dago' },
      { name: 'Fernando Inácio Costa', number: 11, position: 'FWD', isStarter: true, playerId: 'fernando-dago' },
      { name: 'Venancio Landu Kukula', number: 15, position: 'DEF', isStarter: true, playerId: 'venancio-dago' },
      { name: 'José Macaia Ganga', number: 16, position: 'MID', isStarter: true, playerId: 'macaia-dago' },
      { name: 'Samu Tshibamba Dago', number: 17, position: 'FWD', isStarter: true, playerId: 'dago-tshibamba' },
      { name: 'Afonso dos Santos Paxe', number: 19, position: 'DEF', isStarter: true, playerId: 'fifa-1pxu511' },
      { name: 'Anselmo Mweni', number: 22, position: 'GK', isStarter: true, playerId: 'anselmo-dago' },
      { name: 'Fernando Lopes de Almeida', number: 1, position: 'GK', isStarter: false, playerId: 'nuno-dago' },
      { name: 'Simão Dianzanza', number: 3, position: 'DEF', isStarter: false, playerId: 'simao-dianzenza' },
      { name: 'Bruno de Jesus Manuel', number: 6, position: 'MID', isStarter: false, playerId: 'bruno-dago' },
      { name: 'Calebi Yanda', number: 10, position: 'MID', isStarter: false, playerId: 'calebi-dago' },
      { name: 'Obed Mayamb Mukokiani', number: 14, position: 'FWD', isStarter: false, playerId: 'obed-dago' },
      { name: 'Francisco Carlos Chilumbo', number: 20, position: 'MID', isStarter: false, playerId: 'tombe-dago' },
      { name: 'Paulo de Sousa Lopes da Costa', number: 21, position: 'DEF', isStarter: false, playerId: 'paulo-costa-dago' },
      { name: 'Enoque José Kabesa', number: 23, isStarter: false },
      { name: 'Josué Mungwengi', number: 34, isStarter: false, playerId: 'josue-mungwengi-dago' },
    ],
    away: [
      { name: 'Brudel Efonge Liyongo', number: 1, position: 'GK', isStarter: true, playerId: 'brudel-kabuscorp' },
      { name: 'Zamorano Lopes', number: 2, position: 'DEF', isStarter: true, playerId: 'fifa-1k4a836' },
      { name: 'Saombe Sukuakueche Ângelo Jorge', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1snb179' },
      { name: 'Bayala Nsimba', number: 7, position: 'FWD', isStarter: true, playerId: 'fifa-1n3uhm6' },
      { name: 'José Semedo Vunge', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1k2pk58' },
      { name: 'Artur Malungo', number: 14, position: 'DEF', isStarter: true, playerId: 'fifa-1k1sen7' },
      { name: 'Henock Mangindula', number: 16, position: 'DEF', isStarter: true, isCaptain: true, playerId: 'fifa-1mppsb5' },
      { name: 'Mankoka Hegene Afonso', number: 18, position: 'FWD', isStarter: true, playerId: 'fifa-1jrku39' },
      { name: 'Joaquim Paciência', number: 19, position: 'FWD', isStarter: true, playerId: 'fifa-1jm8hd7' },
      { name: 'Mvemba Matondo Kuanzambi', number: 28, position: 'DEF', isStarter: true, playerId: 'fifa-1qxnl72' },
      { name: 'Miguel Francisco Manuel Sebastião', number: 31, isStarter: true },
      { name: 'Mbali Mongbongo Sem', number: 8, position: 'MID', isStarter: false, playerId: 'fifa-1v363a9' },
      { name: 'Teodoro Fernandes Correia', number: 11, position: 'DEF', isStarter: false, playerId: 'fifa-1lgpb81' },
      { name: 'João Baptista Missenga de Nascimento', number: 12, isStarter: false },
      { name: 'Daniel Kilola', number: 15, position: 'MID', isStarter: false, playerId: 'fifa-1jm7zr2' },
      { name: 'Celestino Luís Maleco', number: 17, position: 'FWD', isStarter: false, playerId: 'fifa-1jxicb5' },
      { name: 'Enoque Benjamin Tula', number: 20, isStarter: false },
      { name: 'Aluízio Joel André Cacharamba', number: 27, position: 'MID', isStarter: false, playerId: 'fifa-1pnr1r0' },
      { name: 'Alberto Elizeu Xavier', number: 29, position: 'FWD', isStarter: false, playerId: 'fifa-1js6m05' },
      { name: 'Platini Mpiana Monzinzi', number: 39, position: 'FWD', isStarter: false, playerId: 'platini-kabuscorp' },
    ],
  },
  // Resultado e goleadores: SofaScore, enviado pelo utilizador em 25/11/2026.
  result: { status: 'finished', homeScore: 1, awayScore: 2, updatedAt: '2026-11-25T21:52:00+01:00' },
  events: [
    { minute: 76, type: 'goal', team: 'away', player: 'Jó Paciência', number: 19, playerId: 'fifa-1jm8hd7', detail: '0-1' },
    { minute: 86, type: 'goal', team: 'home', player: 'Paxe', number: 19, playerId: 'fifa-1pxu511', detail: '1-1' },
    { minute: 100, type: 'goal', team: 'away', player: 'Jó Paciência', number: 19, playerId: 'fifa-1jm8hd7', detail: "90'+10 · 1-2" },
  ],
});
