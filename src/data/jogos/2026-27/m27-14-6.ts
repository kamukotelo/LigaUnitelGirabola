// 14.ª jornada · Petro de Luanda–Desportivo da Huíla
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-14-6',
  round: 14,
  homeTeamId: 'petro',
  awayTeamId: 'desphuila',
  schedule: { date: '2026-11-03T17:00:00+01:00', stadium: 'Estádio 11 de Novembro', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026' },
  result: { status: 'finished', homeScore: 4, awayScore: 0, halfTimeScore: '2-0', updatedAt: '2026-11-03T19:00:00+01:00' },
  // Equipa de arbitragem do «Lineup Geral» oficial (03/11/2026; nomes completos das fichas anteriores).
  officials: { referee: 'Bernardo Kenge Mário', assistants: ['Pedro Domingos de Andrade Micolo', 'João Manuel Fula António'], fourth: 'Sanda Mateus Miguel Kitu' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (03/11/2026).
  // Público só a partir de 1 h antes do início (embargo de line ups).
  // A primeira versão trazia o n.º 6 do Petro como «Toro»; a versão corrigida (03/11/2026) confirma Mário Balbúrdia.
  coaches: { home: 'Alexandre Santos', away: 'Paulo Torres' },
  lineups: {
    home: [
      { name: 'Hugo Marques', number: 1, position: 'GK', isStarter: true, playerId: 'hugo-marques' },
      { name: 'Tiago Azulão', number: 26, position: 'FWD', isStarter: true, playerId: 'tiago-azulao' },
      { name: 'Léo Bolgado', number: 5, position: 'DEF', isStarter: true, playerId: 'leo-bolgado' },
      { name: 'Toro', number: 8, position: 'MID', isStarter: true, playerId: 'jonathan-toro' },
      { name: 'Aparício', number: 10, position: 'MID', isStarter: true, playerId: 'pedro-aparicio' },
      { name: 'Berna', number: 13, position: 'DEF', isStarter: true, playerId: 'berna' },
      { name: 'Vanilson', number: 17, position: 'FWD', isStarter: true, playerId: 'vanilson' },
      { name: 'Jorge Pereira', number: 20, position: 'MID', isStarter: true, playerId: 'jorge-pereira' },
      { name: 'Tiago Reis', number: 23, position: 'FWD', isStarter: true, playerId: 'tiago-reis' },
      { name: 'Kinito', number: 24, position: 'DEF', isStarter: true, playerId: 'kinito' },
      { name: 'Eddie Afonso', number: 25, position: 'DEF', isStarter: true, playerId: 'eddie-afonso' },
      { name: 'Neblú', number: 22, position: 'GK', isStarter: false, playerId: 'neblu' },
      { name: 'Rúben', number: 4, position: 'DEF', isStarter: false, playerId: 'ruben-aderito' },
      { name: 'Mário Balbúrdia', number: 6, position: 'MID', isStarter: false, playerId: 'mario-balburdia' },
      { name: 'Lucas João', number: 9, position: 'FWD', isStarter: false, playerId: 'lucas-joao' },
      { name: 'Hélder Costa', number: 11, position: 'FWD', isStarter: false, playerId: 'helder-costa' },
      { name: 'Deybi Flores', number: 12, position: 'MID', isStarter: false, playerId: 'deybi-flores' },
      { name: 'Hossi', number: 27, position: 'DEF', isStarter: false, playerId: 'antonio-hossi' },
      { name: 'Depú', number: 29, position: 'FWD', isStarter: false, playerId: 'depu' },
      { name: 'Ilídio Panda', number: 33, position: 'FWD', isStarter: false, playerId: 'ilidio-panda' },
    ],
    away: [
      { name: 'Ndulo', number: 1, position: 'GK', isStarter: true, playerId: 'ndulo-huila' },
      { name: 'Elias', number: 15, position: 'MID', isStarter: true, playerId: 'elias-huila' },
      { name: 'Zinho', number: 2, position: 'DEF', isStarter: true, playerId: 'katendi-huila' },
      { name: 'Ady', number: 3, position: 'DEF', isStarter: true, playerId: 'desphuila-player-3' },
      { name: 'Dos Santos', number: 4, position: 'DEF', isStarter: true, playerId: 'dos-santos-huila' },
      { name: 'Mendes', number: 10, position: 'FWD', isStarter: true, playerId: 'mendes-huila' },
      { name: 'Ludy', number: 13, position: 'DEF', isStarter: true, playerId: 'lucas-elias-huila' },
      { name: 'Tchutchú', number: 21, position: 'MID', isStarter: true, playerId: 'angelo-cangu-huila' },
      { name: 'Mira', number: 25, position: 'FWD', isStarter: true, playerId: 'milagre-simba-huila' },
      { name: 'Adó Pena', number: 27, position: 'MID', isStarter: true, playerId: 'ado-pena-huila' },
      { name: 'Cagodó', number: 29, position: 'MID', isStarter: true, playerId: 'pequenino-castro-huila' },
      { name: 'Passy', number: 12, position: 'GK', isStarter: false, playerId: 'passy-huila' },
      { name: 'Jó', number: 6, position: 'DEF', isStarter: false, playerId: 'joao-milagre-huila' },
      { name: 'Cabibi', number: 7, position: 'FWD', isStarter: false, playerId: 'leonardo-isola-huila' },
      { name: 'Djeizy', number: 8, position: 'MID', isStarter: false, playerId: 'mauricio-pedro-huila' },
      { name: 'Filó', number: 16, position: 'FWD', isStarter: false, playerId: 'fifa-1ni87h8' },
      { name: 'Toyzinho', number: 20, position: 'MID', isStarter: false, playerId: 'toyzinho-huila' },
      { name: 'Dino', number: 23, position: 'DEF', isStarter: false, playerId: 'fifa-1k176v9' },
      { name: 'Jeremias', number: 26, position: 'DEF', isStarter: false, playerId: 'jeremias-huila' },
      { name: 'Costa', number: 32, position: 'MID', isStarter: false, playerId: 'tchicundico-huila' },
    ],
  },
  events: [
    { minute: 34, type: 'goal', team: 'home', player: 'Vanilson', number: 17, playerId: 'vanilson', detail: '1-0' },
    { minute: 41, type: 'goal', team: 'home', player: 'Tiago Reis', number: 23, playerId: 'tiago-reis', detail: '2-0' },
    { minute: 89, type: 'goal', team: 'home', player: 'Lucas João', number: 9, playerId: 'lucas-joao', detail: '3-0' },
    { minute: 91, type: 'goal', team: 'home', player: 'Hélder Costa', number: 11, playerId: 'helder-costa', detail: "90'+1 · 4-0" },
  ],
});
