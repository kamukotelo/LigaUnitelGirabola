// 10.ª jornada · Petro de Luanda–Estrela 1.º de Maio
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-10-2',
  round: 10,
  homeTeamId: 'petro',
  awayTeamId: 'primeiromaio',
  schedule: { date: '2026-11-08T17:15:00+01:00', stadium: 'Estádio 11 de Novembro', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa de jogos transmitidos pela Zsports, jornadas 6 a 10, versão corrigida (recebida a 13/10/2026): 17:15' },
  // Equipa de arbitragem do «Lineup Geral» oficial (08/11/2026; nomes completos das fichas anteriores).
  officials: { referee: 'Donaciano Mulumba', assistants: ['Alzandre Diógenes Muiamba Capola', 'Manuel Dulo Cabaça'], fourth: 'Sanda Mateus Miguel Kitu' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (08/11/2026).
  // Público só a partir de 1 h antes do início (embargo de line ups).
  // Michel (n.º 12, 1.º de Maio) ainda não consta das listas de plantel recebidas.
  // Resultado, marcador e expulsão recebidos a 08/11/2026 (captura da app; aguarda o relatório do árbitro).
  // A app não identifica o jogador expulso aos 70' (1.º de Maio).
  result: { status: 'finished', homeScore: 1, awayScore: 0, halfTimeScore: '0-0', updatedAt: '2026-11-08T21:27:00+01:00' },
  events: [
    { minute: 70, type: 'red', team: 'away', player: '' },
    { minute: 83, type: 'goal', team: 'home', player: 'Kinito', number: 24, playerId: 'kinito', detail: '1-0' },
  ],
  coaches: { home: 'Alexandre Santos', away: 'Mavi Lopes' },
  lineups: {
    home: [
      { name: 'Neblú', number: 22, position: 'GK', isStarter: true, playerId: 'neblu' },
      { name: 'Tiago Azulão', number: 26, position: 'FWD', isStarter: true, playerId: 'tiago-azulao' },
      { name: 'Léo Bolgado', number: 5, position: 'DEF', isStarter: true, playerId: 'leo-bolgado' },
      { name: 'Toro', number: 8, position: 'MID', isStarter: true, playerId: 'jonathan-toro' },
      { name: 'Aparício', number: 10, position: 'MID', isStarter: true, playerId: 'pedro-aparicio' },
      { name: 'Deybi Flores', number: 12, position: 'MID', isStarter: true, playerId: 'deybi-flores' },
      { name: 'Berna', number: 13, position: 'DEF', isStarter: true, playerId: 'berna' },
      { name: 'Vanilson', number: 17, position: 'FWD', isStarter: true, playerId: 'vanilson' },
      { name: 'Tiago Reis', number: 23, position: 'FWD', isStarter: true, playerId: 'tiago-reis' },
      { name: 'Kinito', number: 24, position: 'DEF', isStarter: true, playerId: 'kinito' },
      { name: 'Hossi', number: 27, position: 'DEF', isStarter: true, playerId: 'antonio-hossi' },
      { name: 'Hugo Marques', number: 1, position: 'GK', isStarter: false, playerId: 'hugo-marques' },
      { name: 'Rúben', number: 4, position: 'DEF', isStarter: false, playerId: 'ruben-aderito' },
      { name: 'Mário Balbúrdia', number: 6, position: 'MID', isStarter: false, playerId: 'mario-balburdia' },
      { name: 'Lucas João', number: 9, position: 'FWD', isStarter: false, playerId: 'lucas-joao' },
      { name: 'Hélder Costa', number: 11, position: 'FWD', isStarter: false, playerId: 'helder-costa' },
      { name: 'Jorge Pereira', number: 20, position: 'MID', isStarter: false, playerId: 'jorge-pereira' },
      { name: 'Eddie Afonso', number: 25, position: 'DEF', isStarter: false, playerId: 'eddie-afonso' },
      { name: 'Ilídio Panda', number: 33, position: 'FWD', isStarter: false, playerId: 'ilidio-panda' },
      { name: 'Jairo Muanha', number: 34, position: 'MID', isStarter: false, playerId: 'jairo-muanha' },
    ],
    away: [
      { name: 'Michel', number: 12, isStarter: true },
      { name: 'Márcio', number: 7, position: 'DEF', isStarter: true, playerId: 'fifa-1jyn4k6' },
      { name: 'Tadeu', number: 3, position: 'MID', isStarter: true, playerId: 'fifa-1navzj4' },
      { name: 'Moisés', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1k1hkv2' },
      { name: 'Nixon', number: 11, isStarter: true, playerId: 'nixon-primeiromaio' },
      { name: 'Deninho', number: 14, position: 'MID', isStarter: true, playerId: 'fifa-1mqvbd5' },
      { name: 'Luís Profi', number: 19, position: 'MID', isStarter: true, playerId: 'fifa-1kztk20' },
      { name: 'Tchutchu', number: 22, position: 'MID', isStarter: true, playerId: 'fifa-1nb4bp9' },
      { name: 'Balaka', number: 24, position: 'DEF', isStarter: true, playerId: 'fifa-1jz4j23' },
      { name: 'Dani', number: 28, position: 'DEF', isStarter: true, playerId: 'fifa-1lsutx8' },
      { name: 'Messito', number: 34, position: 'MID', isStarter: true, playerId: 'fifa-1malez5' },
      { name: 'Super', number: 1, position: 'GK', isStarter: false, playerId: 'fifa-1k1sg53' },
      { name: 'Malamba', number: 8, position: 'MID', isStarter: false, playerId: 'fifa-1k176e0' },
      { name: 'Deco', number: 9, position: 'FWD', isStarter: false, playerId: 'fifa-1jsrcp9' },
      { name: 'Issamá', number: 15, position: 'DEF', isStarter: false, playerId: 'fifa-1k0c7s4' },
      { name: 'Marcos', number: 17, isStarter: false, playerId: 'marquinhos-primeiromaio' },
      { name: 'Jesus Moloko', number: 21, isStarter: false, playerId: 'jesus-moloko-primeiromaio' },
      { name: 'Edú', number: 26, position: 'DEF', isStarter: false, playerId: 'fifa-1jz4fg4' },
      { name: 'Cláudio', number: 30, isStarter: false, playerId: 'claudio-primeiromaio' },
      { name: 'Kimich', number: 37, position: 'MID', isStarter: false, playerId: 'fifa-1kf4ix9' },
    ],
  },
});
