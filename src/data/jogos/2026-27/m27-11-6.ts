// 11.ª jornada · Kabuscorp SC–FC Luanda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-11-6',
  round: 11,
  homeTeamId: 'kabuscorp',
  awayTeamId: 'fcluanda',
  // Estádio 22 de Junho → Estádio França N’dalu, indicação no grupo DCE/ANCAF (05/11/2026, 15:35).
  // Data, hora e transmissão mantêm-se (domingo 22/11, 15:30, Zsports).
  schedule: { date: '2026-11-22T15:30:00+01:00', stadium: 'Estádio França N’dalu', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Grupo DCE/ANCAF (05/11/2026): Estádio França N’dalu; antes: Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026', stadiumException: 'Indicação DCE/ANCAF de 05/11/2026: jogo no Estádio França N’dalu, e não no Estádio 22 de Junho habitual do Kabuscorp' },
  // Nomeação de árbitros, jogo n.º 87 (mensagem enviada pelo utilizador, 19/11/2026); nomes completos dos registos anteriores.
  officials: { referee: 'Nelson João Milagre', assistants: ['Manuel Daniel Coelho', 'Hélder João Milagre'], fourth: 'Bernardo Francisco Moreira' },
  // Constituição das Equipas (PDF DCE/ANCAF, «Lineup Geral 11.ª J», recebido a 22/11/2026): 11 titulares e 9 suplentes
  // por equipa, treinadores e árbitros iguais à nomeação. A ficha não marca capitães. Ligação ao plantel pela camisola e
  // nome dos jogos anteriores; sem ligação (sem página ou camisola já de outro jogador): Miguel #31 (Kabuscorp); Viegas #2,
  // Kaba #11, Pedro Matendi #3, Yabala #20, D Paiza #24 e Edmilson #25 (FC Luanda).
  coaches: { home: 'Marcelo Vitor', away: 'Rui Santos' },
  lineups: {
    home: [
      { name: 'Efonge', number: 1, position: 'GK', isStarter: true, playerId: 'brudel-kabuscorp' },
      { name: 'Ady Boyo', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1snb179' },
      { name: 'Bayala', number: 7, position: 'FWD', isStarter: true, playerId: 'fifa-1n3uhm6' },
      { name: 'Cuca', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1k2pk58' },
      { name: 'Crespo', number: 14, position: 'DEF', isStarter: true, playerId: 'fifa-1k1sen7' },
      { name: 'Danilson', number: 15, position: 'MID', isStarter: true, playerId: 'fifa-1jm7zr2' },
      { name: 'Benarfa', number: 18, position: 'FWD', isStarter: true, playerId: 'fifa-1jrku39' },
      { name: 'Jó Paciência', number: 19, position: 'FWD', isStarter: true, playerId: 'fifa-1jm8hd7' },
      { name: 'Abidal', number: 28, position: 'DEF', isStarter: true, playerId: 'fifa-1qxnl72' },
      { name: 'Miguel', number: 31, position: 'FWD', isStarter: true },
      { name: 'Diógenes', number: 32, position: 'MID', isStarter: true, playerId: 'fifa-1jrtxh4' },
      { name: 'Mualucano', number: 22, position: 'GK', isStarter: false, playerId: 'fifa-1jrtva7' },
      { name: 'Zamorano', number: 2, position: 'DEF', isStarter: false, playerId: 'fifa-1k4a836' },
      { name: 'Eliseu', number: 3, position: 'DEF', isStarter: false, playerId: 'fifa-1jyp8v8' },
      { name: 'Aldair', number: 4, position: 'DEF', isStarter: false, playerId: 'fifa-1lgpgy7' },
      { name: 'Mbali Cem', number: 8, position: 'MID', isStarter: false, playerId: 'fifa-1v363a9' },
      { name: 'Joelson', number: 27, position: 'MID', isStarter: false, playerId: 'fifa-1pnr1r0' },
      { name: 'Vingumba', number: 29, position: 'FWD', isStarter: false, playerId: 'fifa-1js6m05' },
      { name: 'Jojo', number: 35, position: 'MID', isStarter: false, playerId: 'fifa-1tgwgg5' },
      { name: 'Mpiana', number: 39, position: 'FWD', isStarter: false, playerId: 'platini-kabuscorp' },
    ],
    away: [
      { name: 'Patrício', number: 12, position: 'GK', isStarter: true, playerId: 'fifa-1l7wk59' },
      { name: 'Filipe', number: 17, position: 'DEF', isStarter: true, playerId: 'fifa-1k2wth5' },
      { name: 'Viegas', number: 2, isStarter: true },
      { name: 'Motivado', number: 7, position: 'MID', isStarter: true, playerId: 'fifa-1liwnq8' },
      { name: 'Cabeto', number: 8, position: 'MID', isStarter: true, playerId: 'fifa-1ljudk2' },
      { name: 'Kaba', number: 11, isStarter: true },
      { name: 'Domingos', number: 14, position: 'MID', isStarter: true, playerId: 'fifa-1mall47' },
      { name: 'Gabriel', number: 21, isStarter: true, playerId: 'gabriel-cavalcante-fcluanda' },
      { name: 'Batista', number: 27, position: 'MID', isStarter: true, playerId: 'fifa-1v0ca42' },
      { name: 'Jaime', number: 30, position: 'MID', isStarter: true, playerId: 'fifa-1qw9vb1' },
      { name: 'Kano', number: 31, position: 'FWD', isStarter: true, playerId: 'fifa-1malhf8' },
      { name: 'João', number: 1, position: 'GK', isStarter: false, playerId: 'fifa-1t6azn3' },
      { name: 'Pedro Matendi', number: 3, isStarter: false },
      { name: 'Joel', number: 4, position: 'DEF', isStarter: false, playerId: 'fifa-1qhqn96' },
      { name: 'Chiquinho', number: 9, position: 'FWD', isStarter: false, playerId: 'fifa-1l11132' },
      { name: 'Arnaldo', number: 16, position: 'MID', isStarter: false, playerId: 'fifa-1m8xdu3' },
      { name: 'Yabala', number: 20, isStarter: false },
      { name: 'D Paiza', number: 24, isStarter: false },
      { name: 'Edmilson', number: 25, isStarter: false },
      { name: 'Pedro', number: 28, position: 'DEF', isStarter: false, playerId: 'fifa-1maldr2' },
    ],
  },
});
