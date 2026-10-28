// 8.ª jornada · Wiliete de Benguela–São Salvador
import { defineMatch } from '../tipos';

export default defineMatch({
  id: 'm27-8-7',
  round: 8,
  homeTeamId: 'wiliete',
  awayTeamId: 'saosalvador',
  // Adiamento de 24/10/2026 anulado a 25/10/2026: marcado por engano, sem comunicado da ANCAF.
  // Hora 15:00 → 16:00 a pedido do Diretor de Competições (26/10/2026, Emanuel Valodia).
  schedule: { date: '2026-10-28T16:00:00+01:00', stadium: 'Estádio Nacional de Ombaka', scheduleStatus: 'official', source: 'Mapa final das jornadas 7 a 10 (28/09/2026); hora: pedido do Diretor de Competições (26/10/2026), 16:00' },
  // Equipa de arbitragem do «Lineup Geral» oficial (28/10/2026; nomes completos das fichas anteriores).
  officials: { referee: 'Chitano Domingos Francisco', assistants: ['Wilson Valdmiro Ntyamba', 'Andália Bimbi Francisco Jeremias'], fourth: 'António Caluassi Dungula' },
  // Onze inicial, suplentes e treinadores do «Lineup Geral» oficial do jogo (28/10/2026).
  // Ligações ao plantel só onde o número e o nome batem com as fichas anteriores («Mano» n.º 31,
  // «Gui» n.º 4 e «Okita» n.º 23 do São Salvador e «Merdi» n.º 22 do Wiliete ficam por confirmar).
  coaches: { home: 'Beto Bianchi', away: 'Silva Kussanda' },
  lineups: {
    home: [
      { name: 'Elber', number: 31, position: 'GK', isStarter: true, playerId: 'fifa-1jm7y97' },
      { name: 'Giovani', number: 17, position: 'DEF', isStarter: true, playerId: 'fifa-1jwu6z0' },
      { name: 'Silva', number: 3, position: 'DEF', isStarter: true, playerId: 'fifa-1ljz6e0' },
      { name: 'Wiwi', number: 5, position: 'DEF', isStarter: true, playerId: 'fifa-1jsrpl0' },
      { name: 'Janderson', number: 6, position: 'MID', isStarter: true, playerId: 'janderson-wiliete' },
      { name: 'Mabululu', number: 9, position: 'FWD', isStarter: true, playerId: 'mabululu-wiliete' },
      { name: 'Mindinho', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1jru7c5' },
      { name: 'Gibelé', number: 11, position: 'FWD', isStarter: true, playerId: 'fifa-1jsj8t3' },
      { name: 'Balsa', number: 15, position: 'DEF', isStarter: true, playerId: 'fifa-1jjfij0' },
      { name: 'Bito', number: 28, position: 'MID', isStarter: true, playerId: 'fifa-1jrxs05' },
      { name: 'Sidibé', number: 30, position: 'MID', isStarter: true, playerId: 'fifa-1qvfjm7' },
      { name: 'Benny', number: 12, position: 'GK', isStarter: false, playerId: 'fifa-1jrtue9' },
      { name: 'Bello', number: 18, position: 'FWD', isStarter: false, playerId: 'bello-lukman-wiliete' },
      { name: 'Merdi', number: 22, isStarter: false },
      { name: 'Igui', number: 24, position: 'MID', isStarter: false, playerId: 'fifa-1uqnv32' },
      { name: 'Ning', number: 25, position: 'FWD', isStarter: false, playerId: 'fifa-1jwu0l8' },
      { name: 'Nelo', number: 26, position: 'DEF', isStarter: false, playerId: 'fifa-1jz4n21' },
      { name: 'Quare', number: 33, position: 'FWD', isStarter: false, playerId: 'fifa-1kzr1v5' },
      { name: 'César Cangué', number: 34, position: 'FWD', isStarter: false, playerId: 'fifa-1k36hf0' },
      { name: 'Valter Monteiro', number: 35, position: 'MID', isStarter: false, playerId: 'valter-monteiro' },
    ],
    away: [
      { name: 'Mano', number: 31, isStarter: true },
      { name: 'Gui', number: 4, isStarter: true },
      { name: 'José', number: 2, position: 'DEF', isStarter: true, playerId: 'fifa-1kz4h82' },
      { name: 'Beni Papel', number: 7, position: 'FWD', isStarter: true, playerId: 'fifa-1k1sev5' },
      { name: 'Ary', number: 10, position: 'MID', isStarter: true, playerId: 'fifa-1jrutw6' },
      { name: 'Ramilton', number: 13, position: 'DEF', isStarter: true, playerId: 'fifa-1lih5k4' },
      { name: 'Eduardo', number: 22, position: 'MID', isStarter: true, playerId: 'fifa-1k1sm82' },
      { name: 'Germano', number: 24, isStarter: true, playerId: 'germano-fumela-saosalvador' },
      { name: 'Wilson', number: 25, position: 'DEF', isStarter: true, playerId: 'fifa-1sr5rk8' },
      { name: 'Anderson Mputa', number: 26, position: 'FWD', isStarter: true, playerId: 'fifa-1k2pyw6' },
      { name: 'Artur', number: 34, position: 'DEF', isStarter: true, playerId: 'fifa-1liwqf9' },
      { name: 'Moyo', number: 35, position: 'GK', isStarter: false, playerId: 'fifa-1k2wue9' },
      { name: 'Bigo', number: 6, position: 'MID', isStarter: false, playerId: 'fifa-1lih506' },
      { name: 'João Vala', number: 8, position: 'MID', isStarter: false, playerId: 'fifa-1k39my6' },
      { name: 'Afonso', number: 9, position: 'FWD', isStarter: false, playerId: 'fifa-1pny3g2' },
      { name: 'Lando', number: 14, position: 'FWD', isStarter: false, playerId: 'fifa-1ng0f78' },
      { name: 'Luquinha', number: 17, position: 'FWD', isStarter: false, playerId: 'fifa-1lih3r9' },
      { name: 'Kimuanga', number: 20, position: 'DEF', isStarter: false, playerId: 'fifa-1ljvxk1' },
      { name: 'Samuel', number: 21, position: 'FWD', isStarter: false, playerId: 'fifa-1k2pdb8' },
      { name: 'Okita', number: 23, isStarter: false },
    ],
  },
});
