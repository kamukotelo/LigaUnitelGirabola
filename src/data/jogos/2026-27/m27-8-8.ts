// 8.ª jornada · FC Cabinda–Kabuscorp SC
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-8-8',
  round: 8,
  homeTeamId: 'cabinda',
  awayTeamId: 'kabuscorp',
  // Comunicado Oficial 013-DCE/ANCAF/2026 (26/10/2026): adiado por força maior (regresso do
  // Kabuscorp da Taça CAF) e remarcado para 04/11, mesmo horário, em estádio a designar
  // pelo FC Cabinda. O comunicado refere o jogo como agendado para 27/10 (o portal tinha
  // 28/10 por pedido do Diretor de 21/10).
  // Data 04/11 → 15/11 a pedido do Diretor de Competições (03/11/2026, Emanuel Valodia); hora e estádio sem alteração.
  // Estádio a anunciar → Estádio do Tafe, novo estádio da casa do FC Cabinda (DCE/ANCAF, 05/11/2026).
  schedule: { date: '2026-11-15T15:00:00+01:00', stadium: 'Estádio do Tafe', scheduleStatus: 'official', source: 'Estádio do Tafe: Diretor de Competições DCE/ANCAF (Emanuel Valodia, 05/11/2026); Comunicado Oficial 013-DCE/ANCAF/2026 (26/10/2026): estádio a designar pelo FC Cabinda; data: pedido do Diretor de Competições (03/11/2026), 15/11, 15:00' },
  // Equipa de arbitragem e escalações da ficha do jogo no FCMS (Diretor de Competições DCE/ANCAF,
  // 15/11/2026): 11 titulares e 9 suplentes por equipa; árbitros todos «Confirmado».
  // Francisco Luemba (#4) aparece no 11 inicial com o aviso «Suspensão» do FCMS.
  officials: { referee: 'Donaciano Mulumba', assistants: ['Alzandre Diógenes Muiamba Capola', 'Manuel Dulo Cabaça'], fourth: 'António Domingos Miguel' },
  // Treinadores e constituição conferidos com a ficha «Constituição das Equipas» (PDF DCE/ANCAF, 15/11/2026).
  // Treinador do Kabuscorp: Marcelo Vitor, por indicação do utilizador (15/11/2026); a ficha PDF dizia Roque Sapiri.
  coaches: { home: 'Luciano Capoco', away: 'Marcelo Vitor' },
  lineups: {
    home: [
      { name: 'João Eduardo', number: 1, position: 'GK', isStarter: true, isCaptain: false, playerId: 'cabinda-player-1' },
      { name: 'Rodrigo dos Santos Ngimbi', number: 2, position: 'DEF', isStarter: true, isCaptain: true, playerId: 'rodrigo-cabinda' },
      { name: 'Francisco Luemba', number: 4, position: 'DEF', isStarter: true, isCaptain: false, playerId: 'fifa-1qtzy92' },
      { name: 'Marcos Lando', number: 5, position: 'DEF', isStarter: true, isCaptain: false, playerId: 'marcos-cabinda' },
      { name: 'Cristiano Malonda', number: 8, position: 'MID', isStarter: true, isCaptain: false, playerId: 'cristiano-cabinda' },
      { name: 'Júlio Mavungo André', number: 17, position: 'DEF', isStarter: true, isCaptain: false, playerId: 'julio-cabinda' },
      { name: 'Mário Chiwale Caluaco da Silva Mário', number: 24, position: 'MID', isStarter: true, isCaptain: false, playerId: 'fifa-1ljjyh4' },
      { name: 'Ariclenis Afonso Araújo Lede', number: 29, position: 'FWD', isStarter: true, isCaptain: false, playerId: 'ariclenis-cabinda' },
      { name: 'Pedro da Silva da Silva', number: 30, position: 'FWD', isStarter: true, isCaptain: false, playerId: 'pedro-da-silva-cabinda' },
      { name: 'Neves Paulo Osvaldo', number: 38, position: 'FWD', isStarter: true, isCaptain: false, playerId: 'ary-chato-cabinda' },
      { name: 'António Alberto Sumbo Luemba', number: 39, position: 'MID', isStarter: true, isCaptain: false, playerId: 'pino-cabinda' },
      { name: 'António Kapata', number: 9, position: 'FWD', isStarter: false, isCaptain: false, playerId: 'antonio-kapata-cabinda' },
      { name: 'Rodilson Sumbo da Costa', number: 10, position: 'MID', isStarter: false, isCaptain: false, playerId: 'fifa-1thxac4' },
      { name: 'Francisco Domingas Chicapa', number: 12, position: 'GK', isStarter: false, isCaptain: false, playerId: 'francisco-cabinda' },
      { name: 'Luyeye Tomás Tomás', number: 13, position: 'MID', isStarter: false, isCaptain: false, playerId: 'luyeye-cabinda' },
      { name: 'Simão Gomes', number: 14, position: 'FWD', isStarter: false, isCaptain: false, playerId: 'simao-gomes-cabinda' },
      { name: 'Cornelio Queba Lelo Baptista', number: 15, position: 'MID', isStarter: false, isCaptain: false, playerId: 'cornelio-cabinda' },
      { name: 'Frederico Zau', number: 20, position: 'DEF', isStarter: false, isCaptain: false, playerId: 'frederico-cabinda' },
      { name: 'João Cambo', number: 25, position: 'DEF', isStarter: false, isCaptain: false, playerId: 'joao-cambo-cabinda' },
      { name: 'Faustino Rafael Chimone Bacia', number: 35, position: 'FWD', isStarter: false, isCaptain: false, playerId: 'bilele-cabinda' },
    ],
    away: [
      { name: 'Brudel Efonge Liyongo', number: 1, position: 'GK', isStarter: true, isCaptain: false, playerId: 'brudel-kabuscorp' },
      { name: 'Zamorano Lopes', number: 2, position: 'DEF', isStarter: true, isCaptain: false, playerId: 'fifa-1k4a836' },
      { name: 'Adair Garcia Domingos', number: 4, position: 'DEF', isStarter: true, isCaptain: false, playerId: 'fifa-1lgpgy7' },
      { name: 'Saombe Sukuakueche Ângelo Jorge', number: 5, position: 'DEF', isStarter: true, isCaptain: true, playerId: 'fifa-1snb179' },
      { name: 'José Semedo Vunge', number: 10, position: 'MID', isStarter: true, isCaptain: false, playerId: 'fifa-1k2pk58' },
      { name: 'Daniel Kilola', number: 15, position: 'MID', isStarter: true, isCaptain: false, playerId: 'fifa-1jm7zr2' },
      { name: 'Celestino Luís Maleco', number: 17, position: 'FWD', isStarter: true, isCaptain: false, playerId: 'fifa-1jxicb5' },
      { name: 'Mvemba Matondo Kuanzambi', number: 28, position: 'DEF', isStarter: true, isCaptain: false, playerId: 'fifa-1qxnl72' },
      { name: 'Alberto Elizeu Xavier', number: 29, position: 'FWD', isStarter: true, isCaptain: false, playerId: 'fifa-1js6m05' },
      { name: 'Diógenes Capemba João', number: 32, position: 'MID', isStarter: true, isCaptain: false, playerId: 'fifa-1jrtxh4' },
      { name: 'Platini Mpiana Monzinzi', number: 39, position: 'FWD', isStarter: true, isCaptain: false, playerId: 'platini-kabuscorp' },
      { name: 'Mbali Mongbongo Sem', number: 8, position: 'MID', isStarter: false, isCaptain: false, playerId: 'fifa-1v363a9' },
      { name: 'Teodoro Fernandes Correia', number: 11, position: 'DEF', isStarter: false, isCaptain: false, playerId: 'fifa-1lgpb81' },
      { name: 'Artur Malungo', number: 14, position: 'DEF', isStarter: false, isCaptain: false, playerId: 'fifa-1k1sen7' },
      { name: 'Mankoka Hegene Afonso', number: 18, position: 'FWD', isStarter: false, isCaptain: false, playerId: 'fifa-1jrku39' },
      { name: 'Joaquim Paciência', number: 19, position: 'FWD', isStarter: false, isCaptain: false, playerId: 'fifa-1jm8hd7' },
      { name: 'Augusto Monteiro Mualucano', number: 22, position: 'GK', isStarter: false, isCaptain: false, playerId: 'fifa-1jrtva7' },
      { name: 'Aluízio Joel André Cacharamba', number: 27, position: 'MID', isStarter: false, isCaptain: false, playerId: 'fifa-1pnr1r0' },
      { name: 'Miguel Francisco Manuel Sebastião', number: 31, position: 'FWD', isStarter: false, isCaptain: false },
      { name: 'Jorge Manuel Pinto', number: 35, position: 'MID', isStarter: false, isCaptain: false, playerId: 'fifa-1tgwgg5' },
    ],
  },
});
