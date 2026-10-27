// 8.ª jornada · Bravos do Maquis–Petro de Luanda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-8-2',
  round: 8,
  homeTeamId: 'bravos',
  awayTeamId: 'petro',
  schedule: { date: '2026-10-27T15:00:00+01:00', stadium: 'Estádio Mundunduleno', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa final das jornadas 7 a 10 (28/09/2026)' },
  // Arbitragem do «Lineup Geral» oficial do jogo (27/10/2026); nomes completos das fichas anteriores.
  officials: { referee: 'Nelson João Milagre', assistants: ['Manuel Daniel Coelho', 'Hélder João Milagre'], fourth: 'Paulo Sérgio Moreira' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (27/10/2026).
  // Ligações ao plantel pelas fichas anteriores das duas equipas (todas as camisolas conferem;
  // «Dos Santos» é o n.º 32, Santos Kiaku). Público só 1 h antes do início (lineup-embargo.ts).
  coaches: { home: 'Sandro Mendes', away: 'Alexandre Santos' },
  lineups: {
    home: [
      { name: 'Nathan', number: 22, position: 'GK', isStarter: true, playerId: 'nathan-bravos' },
      { name: 'Manico', number: 26, position: 'DEF', isStarter: true, playerId: 'manico-bravos' },
      { name: 'Danilson', number: 2, position: 'DEF', isStarter: true, playerId: 'denilson-bravos' },
      { name: 'Caiser', number: 5, isStarter: true, playerId: 'caiser-bravos' },
      { name: 'Abraão', number: 6, position: 'MID', isStarter: true, playerId: 'abrao-bravos' },
      { name: 'Jú Cabral', number: 8, position: 'MID', isStarter: true, playerId: 'ju-cabral-bravos' },
      { name: 'Higino', number: 10, position: 'MID', isStarter: true, playerId: 'higino-bravos' },
      { name: 'Tiago', number: 15, position: 'FWD', isStarter: true, playerId: 'tiago-bravos' },
      { name: 'Eduwine', number: 17, position: 'FWD', isStarter: true, playerId: 'eduwine-bravos' },
      { name: 'Lopes', number: 18, isStarter: true, playerId: 'antonio-lopes-bravos' },
      { name: 'Lito', number: 23, position: 'FWD', isStarter: true, playerId: 'lito-bravos' },
      { name: 'Saidy', number: 12, position: 'GK', isStarter: false, playerId: 'saidi-bravos' },
      { name: 'Bruno', number: 4, isStarter: false, playerId: 'fifa-1k0rpz2' },
      { name: 'Lizandro', number: 14, position: 'MID', isStarter: false, playerId: 'macusa' },
      { name: 'Osah', number: 16, isStarter: false, playerId: 'fifa-1mrrs47' },
      { name: 'Jorginho', number: 19, position: 'FWD', isStarter: false, playerId: 'jorginho-bravos' },
      { name: 'Toni', number: 25, position: 'MID', isStarter: false, playerId: 'fifa-1v0f2v0' },
      { name: 'Dabanda', number: 27, position: 'DEF', isStarter: false, playerId: 'dabanda-bravos' },
      { name: 'Milson', number: 29, isStarter: false, playerId: 'fifa-1m8y3d4' },
      { name: 'Dos Santos', number: 32, isStarter: false, playerId: 'fifa-1jrtyh2' },
    ],
    away: [
      { name: 'Hugo Marques', number: 1, position: 'GK', isStarter: true, playerId: 'hugo-marques' },
      { name: 'Eddie Afonso', number: 25, position: 'DEF', isStarter: true, playerId: 'eddie-afonso' },
      { name: 'Rúben', number: 4, position: 'DEF', isStarter: true, playerId: 'ruben-aderito' },
      { name: 'Mário Balbúrdia', number: 6, position: 'MID', isStarter: true, playerId: 'mario-balburdia' },
      { name: 'Aparício', number: 10, position: 'MID', isStarter: true, playerId: 'pedro-aparicio' },
      { name: 'Deybi Flores', number: 12, position: 'MID', isStarter: true, playerId: 'deybi-flores' },
      { name: 'Tiago Reis', number: 23, position: 'FWD', isStarter: true, playerId: 'tiago-reis' },
      { name: 'Kinito', number: 24, position: 'DEF', isStarter: true, playerId: 'kinito' },
      { name: 'Hossi', number: 27, position: 'DEF', isStarter: true, playerId: 'antonio-hossi' },
      { name: 'Depú', number: 29, position: 'FWD', isStarter: true, playerId: 'depu' },
      { name: 'Ilídio Panda', number: 33, position: 'FWD', isStarter: true, playerId: 'ilidio-panda' },
      { name: 'Neblú', number: 22, position: 'GK', isStarter: false, playerId: 'neblu' },
      { name: 'Léo Bolgado', number: 5, position: 'DEF', isStarter: false, playerId: 'leo-bolgado' },
      { name: 'Toro', number: 8, position: 'MID', isStarter: false, playerId: 'jonathan-toro' },
      { name: 'Lucas João', number: 9, position: 'FWD', isStarter: false, playerId: 'lucas-joao' },
      { name: 'Hélder Costa', number: 11, position: 'FWD', isStarter: false, playerId: 'helder-costa' },
      { name: 'Berna', number: 13, position: 'DEF', isStarter: false, playerId: 'berna' },
      { name: 'Vanilson', number: 17, position: 'MID', isStarter: false, playerId: 'vanilson' },
      { name: 'Jorge Pereira', number: 20, position: 'MID', isStarter: false, playerId: 'jorge-pereira' },
      { name: 'Tiago Azulão', number: 26, position: 'FWD', isStarter: false, playerId: 'tiago-azulao' },
    ],
  },
});
