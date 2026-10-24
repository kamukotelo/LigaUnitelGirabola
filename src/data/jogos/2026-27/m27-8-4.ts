// 8.ª jornada · Sagrada Esperança–Estrela 1.º de Maio
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-8-4',
  round: 8,
  homeTeamId: 'sagrada',
  awayTeamId: 'primeiromaio',
  schedule: { date: '2026-10-24T15:00:00+01:00', stadium: 'Estádio do Sagrada Esperança', scheduleStatus: 'official', source: 'DCE/ANCAF, 05/10/2026: sem transmissão televisiva (Rádio 5)' },
  // Nomeação de arbitragem da «Constituição das Equipas» oficial (24/10/2026).
  officials: { referee: 'Sanda Mateus Miguel Kitu', assistants: ['Evandro Henrique Freitas da Rocha', 'Natarino António Soares'], fourth: 'Sabino Garcez de Sousa de Carvalho' },
  // Onze inicial, suplentes e treinadores da «Constituição das Equipas» oficial
  // do jogo (24/10/2026). Só ficam públicos 1 h antes do início (lineup-embargo).
  coaches: { home: 'Luís Quintas', away: 'Mavi Lopes' },
  lineups: {
    home: [
      { name: 'Leonardo', number: 13, position: 'GK', isStarter: true, playerId: 'leonardo-sagrada' },
      { name: 'Dabanda', number: 7, position: 'FWD', isStarter: true, playerId: 'dabanda-sagrada' },
      { name: 'Alexandre', number: 2, position: 'DEF', isStarter: true, playerId: 'fifa-1v1a1u9' },
      { name: 'Manú', number: 3, position: 'DEF', isStarter: true, playerId: 'manuel-sagrada' },
      { name: 'Celso Cabuço', number: 8, position: 'MID', isStarter: true, playerId: 'guilherme-sagrada' },
      { name: 'Lépua', number: 10, position: 'MID', isStarter: true, playerId: 'lepua-sagrada' },
      { name: 'Melono Dala', number: 11, position: 'FWD', isStarter: true, playerId: 'melono-sagrada' },
      { name: 'Tobias', number: 14, position: 'DEF', isStarter: true, playerId: 'tobias-sagrada' },
      { name: 'Luís Tati', number: 20, position: 'DEF', isStarter: true, playerId: 'luis-tati-sagrada' },
      { name: 'Messias', number: 21, position: 'MID', isStarter: true, playerId: 'fifa-1v0z7l2' },
      { name: 'Mafuta', number: 24, position: 'MID', isStarter: true, playerId: 'afonso-sagrada' },
      { name: 'Adolfo', number: 30, isStarter: false, playerId: 'fifa-1l7lpp2' },
      { name: 'Miguel', number: 5, position: 'DEF', isStarter: false, playerId: 'miguel-sagrada' },
      { name: 'Pimpão', number: 16, position: 'FWD', isStarter: false, playerId: 'pimpao-sagrada' },
      { name: 'Gogoró', number: 17, position: 'DEF', isStarter: false, playerId: 'gogoro-sagrada' },
      { name: 'Pedro', number: 26, isStarter: false, playerId: 'pedro-soba-sagrada' },
      { name: 'Pipocas', number: 27, isStarter: false, playerId: 'pipocas-sagrada' },
      { name: 'Cláudio', number: 33, isStarter: false, playerId: 'fifa-1l7vm13' },
      { name: 'Kandumba', number: 34, isStarter: false, playerId: 'fifa-1jrv034' },
      { name: 'Kulica', number: 39, position: 'MID', isStarter: false, playerId: 'fifa-1scqy89' },
    ],
    away: [
      // Super (António Pascoal) joga com a 12; a 1 é do suplente Michel, sem ficha no plantel.
      { name: 'Super', number: 12, position: 'GK', isStarter: true, playerId: 'fifa-1k1sg53' },
      { name: 'Márcio', number: 7, position: 'DEF', isStarter: true, playerId: 'fifa-1jyn4k6' },
      { name: 'Damimi', number: 4, position: 'DEF', isStarter: true, playerId: 'fifa-1qf49d2' },
      { name: 'Bicho', number: 6, position: 'MID', isStarter: true, playerId: 'fifa-1jxhxl1' },
      { name: 'Nixon', number: 11, isStarter: true, playerId: 'nixon-primeiromaio' },
      { name: 'Deninho', number: 14, position: 'MID', isStarter: true, playerId: 'fifa-1mqvbd5' },
      { name: 'Luís Profi', number: 19, position: 'MID', isStarter: true, playerId: 'fifa-1kztk20' },
      { name: 'Tchutchu', number: 22, position: 'MID', isStarter: true, playerId: 'fifa-1nb4bp9' },
      { name: 'Balaka', number: 24, position: 'DEF', isStarter: true, playerId: 'fifa-1jz4j23' },
      { name: 'Ngala', number: 33, position: 'DEF', isStarter: true, playerId: 'fifa-1nb49x0' },
      { name: 'Messito', number: 34, position: 'MID', isStarter: true, playerId: 'fifa-1malez5' },
      { name: 'Michel', number: 1, isStarter: false },
      { name: 'Malamba', number: 8, position: 'MID', isStarter: false, playerId: 'fifa-1k176e0' },
      { name: 'Deco', number: 9, position: 'FWD', isStarter: false, playerId: 'fifa-1jsrcp9' },
      { name: 'Messi', number: 10, isStarter: false, playerId: 'kessie-messi-primeiromaio' },
      { name: 'Amor', number: 13, position: 'DEF', isStarter: false, playerId: 'fifa-1jxib83' },
      { name: 'Marcos', number: 17, isStarter: false, playerId: 'marquinhos-primeiromaio' },
      { name: 'Geúda', number: 18, position: 'MID', isStarter: false, playerId: 'fifa-1jzjeu2' },
      { name: 'Edú', number: 26, position: 'DEF', isStarter: false, playerId: 'fifa-1jz4fg4' },
      { name: 'Kanhi', number: 56, position: 'GK', isStarter: false, playerId: 'fifa-1nb4dq1' },
    ],
  },
});
