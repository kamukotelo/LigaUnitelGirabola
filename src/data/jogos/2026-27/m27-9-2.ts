// 9.ª jornada · Wiliete de Benguela–FC Cabinda
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-9-2',
  round: 9,
  homeTeamId: 'wiliete',
  awayTeamId: 'cabinda',
  // Transmissão Zsports (ZAP) reconfirmada pela ANCAF com o line up (01/11/2026).
  schedule: { date: '2026-11-01T17:15:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official', broadcaster: 'Zsports', source: 'Mapa de jogos transmitidos pela Zsports, jornadas 6 a 10, versão corrigida (recebida a 13/10/2026): 17:15' },
  // Equipa de arbitragem do «Lineup Geral» oficial (01/11/2026; nomes completos das fichas anteriores).
  officials: { referee: 'Sabino Garcez de Sousa de Carvalho', assistants: ['João Manuel Fula António', 'Evandro Henrique Freitas da Rocha'], fourth: 'Avelino Tchivela' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (01/11/2026).
  // Público só a partir de 1 h antes do início (embargo de line ups).
  // Buba Jammeh (n.º 14, Wiliete) e Nelsinho (n.º 32, Cabinda) ainda não constam das listas de plantel recebidas.
  coaches: { home: 'Beto Bianchi', away: 'Luciano Capoco' },
  lineups: {
    home: [
      { name: 'Elber', number: 31, position: 'GK', isStarter: true, playerId: 'fifa-1jm7y97' },
      { name: 'Giovani', number: 17, position: 'DEF', isStarter: true, playerId: 'fifa-1jwu6z0' },
      { name: 'Wiwi', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrpl0' },
      { name: 'Janderson', number: 6, position: 'MID', isStarter: true, playerId: 'janderson-wiliete' },
      { name: 'Mabululu', number: 9, position: 'FWD', isStarter: true, playerId: 'mabululu-wiliete' },
      { name: 'Mindinho', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1jru7c5' },
      { name: 'Balsa', number: 15, position: 'DEF', isStarter: true, playerId: 'fifa-1jjfij0' },
      { name: 'Igui', number: 24, position: 'MID', isStarter: true, playerId: 'fifa-1uqnv32' },
      { name: 'Nelo', number: 26, position: 'DEF', isStarter: true, playerId: 'fifa-1jz4n21' },
      { name: 'Bito', number: 28, position: 'MID', isStarter: true, playerId: 'fifa-1jrxs05' },
      { name: 'Valter Monteiro', number: 35, position: 'MID', isStarter: true, playerId: 'valter-monteiro' },
      { name: 'Nayan', number: 1, position: 'GK', isStarter: false, playerId: 'fifa-1pkwt84' },
      { name: 'Mule', number: 8, position: 'MID', isStarter: false, playerId: 'fifa-1k39nk6' },
      { name: 'Yano', number: 13, position: 'DEF', isStarter: false, playerId: 'fifa-1pvxht8' },
      { name: 'Buba Jammeh', number: 14, isStarter: false },
      { name: 'Júnior Goiano', number: 27, position: 'DEF', isStarter: false, playerId: 'fifa-1pnmj53' },
      { name: 'Julinho', number: 29, isStarter: false, playerId: 'julinho-wiliete' },
      { name: 'Sidibé', number: 30, position: 'MID', isStarter: false, playerId: 'fifa-1qvfjm7' },
      { name: 'Célio Zua', number: 32, position: 'MID', isStarter: false, playerId: 'fifa-1m95s64' },
      { name: 'César Cangué', number: 34, position: 'FWD', isStarter: false, playerId: 'fifa-1k36hf0' },
    ],
    away: [
      { name: 'José Kidiaba', number: 1, position: 'GK', isStarter: true, playerId: 'cabinda-player-1' },
      { name: 'Lax', number: 2, position: 'DEF', isStarter: true, playerId: 'rodrigo-cabinda' },
      { name: 'Chiquinho', number: 4, position: 'DEF', isStarter: true, playerId: 'fifa-1qtzy92' },
      { name: 'M. Lando', number: 5, position: 'DEF', isStarter: true, playerId: 'marcos-cabinda' },
      { name: 'Luyeye', number: 13, position: 'MID', isStarter: true, playerId: 'luyeye-cabinda' },
      { name: 'Tchingani', number: 20, position: 'DEF', isStarter: true, playerId: 'frederico-cabinda' },
      { name: 'Mário da Silva', number: 24, position: 'MID', isStarter: true, playerId: 'fifa-1ljjyh4' },
      { name: 'Dadá', number: 30, position: 'FWD', isStarter: true, playerId: 'pedro-da-silva-cabinda' },
      { name: 'Kadima', number: 37, isStarter: true, playerId: 'kadima-cabinda' },
      { name: 'Ary Chato', number: 38, isStarter: true, playerId: 'ary-chato-cabinda' },
      { name: 'Pinó', number: 39, isStarter: true, playerId: 'pino-cabinda' },
      { name: 'Chicapa', number: 12, position: 'GK', isStarter: false, playerId: 'francisco-cabinda' },
      { name: 'Cristiano', number: 8, position: 'MID', isStarter: false, playerId: 'cristiano-cabinda' },
      { name: 'Morata Kapata', number: 9, position: 'FWD', isStarter: false, playerId: 'antonio-kapata-cabinda' },
      { name: 'Rodilson', number: 10, position: 'MID', isStarter: false, playerId: 'fifa-1thxac4' },
      { name: 'Júlio', number: 17, position: 'DEF', isStarter: false, playerId: 'julio-cabinda' },
      { name: 'Chico', number: 25, position: 'DEF', isStarter: false, playerId: 'joao-cambo-cabinda' },
      { name: 'Ary Lede', number: 29, position: 'FWD', isStarter: false, playerId: 'ariclenis-cabinda' },
      { name: 'Nelsinho', number: 32, isStarter: false },
      { name: 'Bilele', number: 35, isStarter: false, playerId: 'bilele-cabinda' },
    ],
  },
});
