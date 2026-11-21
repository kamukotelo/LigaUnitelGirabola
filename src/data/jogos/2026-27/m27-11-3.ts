// 11.ª jornada · GD Interclube–Petro de Luanda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-11-3',
  round: 11,
  homeTeamId: 'interclube',
  awayTeamId: 'petro',
  schedule: { date: '2026-11-21T16:00:00+01:00', stadium: 'Estádio 22 de Junho', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa oficial DCE/ANCAF — 11.ª a 15.ª jornadas (Eng. Valódia), recebido em 29/10/2026' },
  // Nomeação de árbitros, jogo n.º 84 (mensagem enviada pelo utilizador, 19/11/2026); nomes completos dos registos anteriores.
  officials: { referee: 'Miguel Tchissingui Augusto Américo', assistants: ['Bernardo Kunjuca Lúcio Serafim', 'Floriano Cawala'], fourth: 'Sabino Garcez de Sousa de Carvalho' },
  // Constituição das Equipas (PDF DCE/ANCAF, «Lineup Geral 11.ª J», recebido a 21/11/2026): 11 titulares e 9 suplentes
  // por equipa, treinadores e árbitros iguais à nomeação. A ficha não marca capitães. Ligação ao plantel pela camisola e
  // nome dos jogos anteriores; sem ligação: Sucuya (#10, Interclube) e Agostinho (#30, Petro), sem registo anterior.
  coaches: { home: 'Divaldo Alves', away: 'Alexandre Santos' },
  lineups: {
    home: [
      { name: 'Rui', number: 22, position: 'GK', isStarter: true, playerId: 'fifa-1jtvf71' },
      { name: 'Lionel', number: 2, position: 'DEF', isStarter: true, playerId: 'fifa-1pny691' },
      { name: 'Salomão', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1jtv4k9' },
      { name: 'Além', number: 6, position: 'MID', isStarter: true, playerId: 'fifa-1jtv3g3' },
      { name: 'Alcides', number: 14, position: 'MID', isStarter: true, playerId: 'fifa-1kz4cq5' },
      { name: 'Nandinho', number: 25, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrqx5' },
      { name: 'Moisés', number: 28, position: 'DEF', isStarter: true, playerId: 'fifa-1lzlzp0' },
      { name: 'Betinho', number: 29, position: 'FWD', isStarter: true, playerId: 'fifa-1k0sa99' },
      { name: 'Boiado', number: 30, position: 'FWD', isStarter: true, playerId: 'fifa-1jzyk44' },
      { name: 'Caneta', number: 32, position: 'MID', isStarter: true, playerId: 'fifa-1k26vw6' },
      { name: 'Afonso', number: 36, position: 'FWD', isStarter: true, playerId: 'fifa-1ni2dp9' },
      { name: 'Panzo', number: 12, position: 'GK', isStarter: false, playerId: 'fifa-1jz6pv1' },
      { name: 'Banza', number: 7, position: 'FWD', isStarter: false, playerId: 'patrick-banza-interclube' },
      { name: 'Sucuya', number: 10, isStarter: false },
      { name: 'Peter Lwasa', number: 11, isStarter: false, playerId: 'peter-lwasa-interclube' },
      { name: 'Jamanta', number: 18, position: 'DEF', isStarter: false, playerId: 'fifa-1jtuys4' },
      { name: 'Toy', number: 26, position: 'DEF', isStarter: false, playerId: 'fifa-1t9mip7' },
      { name: 'Beny', number: 27, position: 'DEF', isStarter: false, playerId: 'fifa-1k1ket3' },
      { name: 'Paulo Gaspar', number: 33, position: 'DEF', isStarter: false, playerId: 'fifa-1m92d85' },
      { name: 'Vata', number: 35, position: 'FWD', isStarter: false, playerId: 'fifa-1nw4p04' },
    ],
    away: [
      { name: 'Hugo Marques', number: 1, position: 'GK', isStarter: true, playerId: 'hugo-marques' },
      { name: 'Tiago Azulão', number: 26, position: 'FWD', isStarter: true, playerId: 'tiago-azulao' },
      { name: 'Léo Bolgado', number: 5, position: 'DEF', isStarter: true, playerId: 'leo-bolgado' },
      { name: 'Toro', number: 8, position: 'MID', isStarter: true, playerId: 'jonathan-toro' },
      { name: 'Aparício', number: 10, position: 'MID', isStarter: true, playerId: 'pedro-aparicio' },
      { name: 'Vanilson', number: 17, position: 'FWD', isStarter: true, playerId: 'vanilson' },
      { name: 'Jorge Pereira', number: 20, position: 'MID', isStarter: true, playerId: 'jorge-pereira' },
      { name: 'Tiago Reis', number: 23, position: 'FWD', isStarter: true, playerId: 'tiago-reis' },
      { name: 'Kinito', number: 24, position: 'DEF', isStarter: true, playerId: 'kinito' },
      { name: 'Eddie Afonso', number: 25, position: 'DEF', isStarter: true, playerId: 'eddie-afonso' },
      { name: 'Hossi', number: 27, position: 'DEF', isStarter: true, playerId: 'antonio-hossi' },
      { name: 'Neblú', number: 22, position: 'GK', isStarter: false, playerId: 'neblu' },
      { name: 'Rúben', number: 4, position: 'DEF', isStarter: false, playerId: 'ruben-aderito' },
      { name: 'Lucas João', number: 9, position: 'FWD', isStarter: false, playerId: 'lucas-joao' },
      { name: 'Hélder Costa', number: 11, position: 'FWD', isStarter: false, playerId: 'helder-costa' },
      { name: 'Berna', number: 13, position: 'DEF', isStarter: false, playerId: 'berna' },
      { name: 'Depú', number: 29, position: 'FWD', isStarter: false, playerId: 'depu' },
      { name: 'Agostinho', number: 30, isStarter: false },
      { name: 'Ilídio Panda', number: 33, position: 'FWD', isStarter: false, playerId: 'ilidio-panda' },
      { name: 'Jairo Muanha', number: 34, position: 'MID', isStarter: false, playerId: 'jairo-muanha' },
    ],
  },
});
