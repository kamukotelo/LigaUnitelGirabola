// Data layer for Girabola 2025/2026 Football Portal
import { PROMOTED_2026_27_TEAMS } from './ancaf-engine';
import { PUBLISHED_ANCAF_CALENDAR_SOURCE, PUBLISHED_MATCHES_2026_27 } from './published-ancaf-calendar';

export interface Team {
  id: string;
  name: string;          // nome comum do clube, usado em jogos, tabela e listas
  shortName: string;     // sigla de 3 letras (ex.: PET)
  logoUrl?: string;
  city: string;
  stadium: string;
  stadiumCapacity: number;
  founded: number;
  colors: string;
  coach: string;
  colorsHex?: string[]; // E.g. ["#D21515", "#F9C304"] for custom page designs
  officialName?: string; // denominação oficial completa (estilo Liga Angola)
  president?: string;
  website?: string;
  palmares?: TrophyEntry[]; // títulos (editável no admin/BD)
  kits?: KitEntry[];        // equipamentos
  board?: BoardMember[];    // órgãos sociais / direção
}

export interface StandingEntry {
  position: number;
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  score?: string; // e.g. "2-1" or undefined if scheduled
  date: string;
  stadium: string;
  status: 'scheduled' | 'live' | 'finished';
  round: number;
  referee?: string;      // preenchido pela BD (ancaf_matches); senão derivado via getMatchOfficials
  broadcaster?: string;  // transmissão TV; senão derivado via getMatchBroadcast
  attendance?: number;   // assistência oficial; senão derivada em getMatchDetail
}

export interface PlayerStats {
  id: string;
  name: string;
  club: string;
  position: string;
  goals: number;
  assists: number;
  appearances: number;
  photoUrl?: string;
}

export interface Player extends PlayerStats {
  teamId: string; // References Team.id
  jerseyNumber: number;
  age: number;
  nationality: string;
  height: string;
  weight?: string;
  // ── Ficha de identidade ──
  fullName?: string;          // nome completo
  birthDate?: string;         // 'DD/MM/AAAA'
  birthplace?: string;        // naturalidade
  preferredFoot?: 'Direito' | 'Esquerdo' | 'Ambidextro';
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
  bio?: string;
  // Percurso por época — colunas alargadas (competição, assistências, minutos, cartões)
  careerHistory?: {
    season: string;
    club: string;
    competition?: string;
    apps: number;
    goals: number;
    assists?: number;
    minutes?: number;
    yellow?: number;
    red?: number;
  }[];
  technicalRating?: number;
  formRating?: number;
  fifaConnectId?: string;
  fifaConnectStatus?: 'active' | 'pending' | 'rejected' | 'unregistered';
  fifaConnectRegDate?: string;
  detailedStats?: {
    passingAccuracy: number;
    longPassesAccuracy: number;
    aerialDuelsWon: number;
    groundDuelsWon: number;
    tacklesPerMatch: number;
    keyPassesPerMatch: number;
    minutesPlayed: number;
    yellowCards: number;
    redCards: number;
    shotsOnTargetPerMatch?: number;
    successfulDribbles?: number;
    ratingTrend: number[];
  };
}


// ── Estatísticas externas e validação (dados simulados / demonstração) ──
export interface ExternalRatings {
  technical: number;       // 0.0 – 10.0 (simulado)
  form: number;            // 0.0 – 10.0 (simulado)
}

export interface DetailedMetrics {
  passAccuracy: number;    // %
  duelsWon: number;        // %
  shotsOnTarget: number;   // %
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
}

export type FifaCheckKey = 'identity' | 'contract' | 'itc' | 'insurance';
export interface FifaConnectStatus {
  status: 'pending' | 'validated';
  checks: Record<FifaCheckKey, boolean>;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content?: string;
}

// ── 1. EQUIPAS PARTICIPANTES ───────────────────────────────────────
export const TEAMS: Team[] = [
  { id: 'petro', name: 'Petro de Luanda', shortName: 'PET', city: 'Luanda', stadium: 'Estádio 11 de Novembro', stadiumCapacity: 50000, founded: 1980, colors: 'Amarelo, Azul e Vermelho', coach: 'Ricardo Chéu', colorsHex: ["#F9C304", "#00529B", "#D21515"] },
  { id: 'wiliete', name: 'Wiliete de Benguela', shortName: 'WILI', city: 'Benguela', stadium: 'Estádio Nacional de Ombaka', stadiumCapacity: 35000, founded: 2018, colors: 'Verde e Amarelo', coach: 'José Silvestre "Lito" Vidigal', colorsHex: ["#008751", "#F9C304"] },
  { id: 'dago', name: '1.º de Agosto', shortName: 'AGO', city: 'Luanda', stadium: 'Estádio França Ndalu', stadiumCapacity: 20000, founded: 1977, colors: 'Vermelho e Preto', coach: 'Filipe Nzanza', colorsHex: ["#D21515", "#000000"] },
  { id: 'desphuila', name: 'Desportivo da Huíla', shortName: 'CDH', city: 'Lubango', stadium: 'Estádio da Tundavala', stadiumCapacity: 20000, founded: 1998, colors: 'Vermelho e Branco', coach: 'Mário Soares', colorsHex: ["#D21515", "#FFFFFF"] },
  { id: 'bravos', name: 'Bravos do Maquis', shortName: 'BMQ', city: 'Luena', stadium: 'Estádio Mundunduleno', stadiumCapacity: 4300, founded: 1983, colors: 'Azul e Branco', coach: 'Zeca Amaral', colorsHex: ["#00529B", "#FFFFFF"] },
  { id: 'kabuscorp', name: 'Kabuscorp', shortName: 'KAB', city: 'Luanda', stadium: 'Estádio dos Coqueiros', stadiumCapacity: 12000, founded: 1994, colors: 'Vermelho e Branco', coach: 'Kito Ribeiro', colorsHex: ["#D21515", "#FFFFFF"] },
  { id: 'sagrada', name: 'Sagrada Esperança', shortName: 'SAG', city: 'Dundo', stadium: 'Estádio Sagrada Esperança', stadiumCapacity: 8000, founded: 1976, colors: 'Verde e Preto', coach: 'Francisco Moniz "Tusso"', colorsHex: ["#008751", "#000000"] },
  { id: 'interclube', name: 'Interclube', shortName: 'INT', city: 'Luanda', stadium: 'Estádio 22 de Junho', stadiumCapacity: 8000, founded: 1976, colors: 'Azul e Branco', coach: 'Luís Gonçalves', colorsHex: ["#00529B", "#FFFFFF"] },
  { id: 'lundasul', name: 'Desportivo da Lunda Sul', shortName: 'DLS', city: 'Saurimo', stadium: 'Estádio das Mangueiras', stadiumCapacity: 7000, founded: 2020, colors: 'Verde e Amarelo', coach: 'Maurício Marques', colorsHex: ["#008751", "#F9C304"] },
  { id: 'libolo', name: 'Recreativo do Libolo', shortName: 'CRL', city: 'Calulo', stadium: 'Estádio Municipal de Calulo', stadiumCapacity: 10000, founded: 1942, colors: 'Laranja e Azul', coach: 'Hélder Teixeira', colorsHex: ["#FF6600", "#00529B"] },
  { id: 'lobito', name: 'Académica do Lobito', shortName: 'ACA', city: 'Lobito', stadium: 'Estádio do Buraco', stadiumCapacity: 5000, founded: 1970, colors: 'Preto e Branco', coach: 'João Pintar', colorsHex: ["#000000", "#FFFFFF"] },
  { id: 'saosalvador', name: 'São Salvador do Kongo', shortName: 'SSK', city: 'Mbanza Kongo', stadium: 'Estádio Álvaro Buta', stadiumCapacity: 5000, founded: 1999, colors: 'Azul e Amarelo', coach: 'Findanga Finda', colorsHex: ["#00529B", "#F9C304"] },
  { id: 'cabinda', name: 'FC Cabinda', shortName: 'FCC', city: 'Cabinda', stadium: 'Estádio Nacional do Chiazi', stadiumCapacity: 25000, founded: 2005, colors: 'Verde e Branco', coach: 'Pedro Gonçalves', colorsHex: ["#008751", "#FFFFFF"] },
  { id: 'primeiromaio', name: '1.º de Maio', shortName: 'MAI', city: 'Benguela', stadium: 'Estádio de São Filipe', stadiumCapacity: 5000, founded: 1981, colors: 'Vermelho e Branco', coach: 'Agostinho Tramagal', colorsHex: ["#D21515", "#FFFFFF"] },
  { id: 'caala', name: 'CR Caála', shortName: 'CRC', city: 'Caála', stadium: 'Estádio dos Mártires da Canhala', stadiumCapacity: 5000, founded: 1980, colors: 'Azul e Branco', coach: 'Mateus Agostinho', colorsHex: ["#00529B", "#FFFFFF"] },
  { id: 'fcluanda', name: 'FC Luanda', shortName: 'FCL', city: 'Luanda', stadium: 'Campo da Cidadela', stadiumCapacity: 10000, founded: 2020, colors: 'Vermelho e Branco', coach: 'Guelson Manuel', colorsHex: ["#D21515", "#FFFFFF"] }
];

// ── 2. RANKING-SEMENTE ─────────────────────────────────────────────
// Força relativa pré-época usada apenas pelo gerador de resultados
// (getDeterministicScore) para enviesar os jogos. A CLASSIFICAÇÃO
// MOSTRADA é derivada dos jogos terminados (ver STANDINGS, mais abaixo).
const SEED_STANDINGS: StandingEntry[] = [
  { position: 1, teamId: 'petro', teamName: 'Petro de Luanda', played: 30, won: 21, drawn: 5, lost: 4, goalsFor: 58, goalsAgainst: 18, goalDifference: 40, points: 68, form: ['W', 'W', 'W', 'D', 'W'] },
  { position: 2, teamId: 'wiliete', teamName: 'Wiliete de Benguela', played: 30, won: 18, drawn: 7, lost: 5, goalsFor: 49, goalsAgainst: 22, goalDifference: 27, points: 61, form: ['W', 'D', 'W', 'W', 'L'] },
  { position: 3, teamId: 'dago', teamName: '1.º de Agosto', played: 30, won: 14, drawn: 9, lost: 7, goalsFor: 42, goalsAgainst: 25, goalDifference: 17, points: 51, form: ['W', 'W', 'D', 'D', 'W'] },
  { position: 4, teamId: 'desphuila', teamName: 'Desportivo da Huíla', played: 30, won: 11, drawn: 9, lost: 10, goalsFor: 28, goalsAgainst: 26, goalDifference: 2, points: 42, form: ['W', 'L', 'W', 'D', 'L'] },
  { position: 5, teamId: 'bravos', teamName: 'Bravos do Maquis', played: 30, won: 10, drawn: 11, lost: 9, goalsFor: 31, goalsAgainst: 29, goalDifference: 2, points: 41, form: ['L', 'W', 'D', 'W', 'D'] },
  { position: 6, teamId: 'kabuscorp', teamName: 'Kabuscorp', played: 30, won: 11, drawn: 8, lost: 11, goalsFor: 33, goalsAgainst: 32, goalDifference: 1, points: 41, form: ['L', 'L', 'W', 'D', 'W'] },
  { position: 7, teamId: 'sagrada', teamName: 'Sagrada Esperança', played: 30, won: 10, drawn: 10, lost: 10, goalsFor: 30, goalsAgainst: 28, goalDifference: 2, points: 40, form: ['D', 'W', 'L', 'L', 'D'] },
  { position: 8, teamId: 'interclube', teamName: 'Interclube', played: 30, won: 9, drawn: 12, lost: 9, goalsFor: 29, goalsAgainst: 27, goalDifference: 2, points: 39, form: ['W', 'D', 'D', 'W', 'L'] },
  { position: 9, teamId: 'lundasul', teamName: 'Desportivo da Lunda Sul', played: 30, won: 9, drawn: 11, lost: 10, goalsFor: 30, goalsAgainst: 33, goalDifference: -3, points: 38, form: ['L', 'W', 'D', 'L', 'W'] },
  { position: 10, teamId: 'libolo', teamName: 'Recreativo do Libolo', played: 30, won: 8, drawn: 11, lost: 11, goalsFor: 25, goalsAgainst: 30, goalDifference: -5, points: 35, form: ['D', 'L', 'W', 'D', 'D'] },
  { position: 11, teamId: 'lobito', teamName: 'Académica do Lobito', played: 30, won: 8, drawn: 10, lost: 12, goalsFor: 26, goalsAgainst: 34, goalDifference: -8, points: 34, form: ['D', 'D', 'L', 'W', 'L'] },
  { position: 12, teamId: 'saosalvador', teamName: 'São Salvador do Kongo', played: 30, won: 8, drawn: 8, lost: 14, goalsFor: 24, goalsAgainst: 38, goalDifference: -14, points: 32, form: ['W', 'L', 'L', 'D', 'W'] },
  { position: 13, teamId: 'cabinda', teamName: 'FC Cabinda', played: 30, won: 7, drawn: 8, lost: 15, goalsFor: 22, goalsAgainst: 39, goalDifference: -17, points: 29, form: ['L', 'W', 'L', 'L', 'D'] },
  { position: 14, teamId: 'primeiromaio', teamName: '1.º de Maio', played: 30, won: 6, drawn: 9, lost: 15, goalsFor: 24, goalsAgainst: 45, goalDifference: -21, points: 27, form: ['D', 'L', 'L', 'W', 'L'] },
  { position: 15, teamId: 'caala', teamName: 'CR Caála', played: 30, won: 5, drawn: 9, lost: 16, goalsFor: 21, goalsAgainst: 45, goalDifference: -24, points: 24, form: ['L', 'D', 'D', 'L', 'L'] },
  { position: 16, teamId: 'fcluanda', teamName: 'FC Luanda', played: 30, won: 4, drawn: 8, lost: 18, goalsFor: 18, goalsAgainst: 43, goalDifference: -25, points: 20, form: ['L', 'L', 'L', 'W', 'L'] }
];

// ── 3. CALENDÁRIO E JOGOS (GERADO AUTOMATICAMENTE E DETERMINISTICAMENTE) ──
function getDeterministicScore(homeId: string, awayId: string, round: number): { homeScore: number, awayScore: number, score: string } {
  let hash = 0;
  const str = `${homeId}-${awayId}-${round}`;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  
  let homeGoals = hash % 3; // 0, 1, 2
  let awayGoals = (hash >> 2) % 3; // 0, 1, 2
  
  const homeRank = SEED_STANDINGS.find(s => s.teamId === homeId)?.position || 8;
  const awayRank = SEED_STANDINGS.find(s => s.teamId === awayId)?.position || 8;
  
  if (homeRank < awayRank - 3) {
    homeGoals += 1;
  } else if (awayRank < homeRank - 3) {
    awayGoals += 1;
  }
  
  return {
    homeScore: homeGoals,
    awayScore: awayGoals,
    score: `${homeGoals}-${awayGoals}`
  };
}

function generateAllMatches(): Match[] {
  const teamIds = TEAMS.map(t => t.id);
  const n = teamIds.length;
  const list = [...teamIds];
  const generated: Match[] = [];
  let matchIdCounter = 1;

  // Primeira Volta (Jornadas 1 a 15)
  for (let round = 1; round <= 15; round++) {
    for (let i = 0; i < n / 2; i++) {
      const home = list[i];
      const away = list[n - 1 - i];
      
      const homeId = round % 2 === 0 ? home : away;
      const awayId = round % 2 === 0 ? away : home;
      
      const homeTeamObj = TEAMS.find(t => t.id === homeId)!;
      const awayTeamObj = TEAMS.find(t => t.id === awayId)!;

      const status: 'finished' | 'scheduled' = 'finished';
      const { homeScore, awayScore, score } = getDeterministicScore(homeId, awayId, round);

      const startDate = new Date('2025-10-11T16:00:00+01:00');
      const matchDate = new Date(startDate.getTime());
      matchDate.setDate(startDate.getDate() + (round - 1) * 7);
      
      const offsetHash = (round + homeId.charCodeAt(0) + awayId.charCodeAt(0)) % 4;
      if (offsetHash === 1) {
        matchDate.setDate(matchDate.getDate() + 1);
      } else if (offsetHash === 2) {
        matchDate.setDate(matchDate.getDate() + 1);
        matchDate.setHours(15, 30);
      } else if (offsetHash === 3) {
        matchDate.setHours(15, 30);
      }

      generated.push({
        id: `m-${round}-${matchIdCounter++}`,
        homeTeamId: homeId,
        awayTeamId: awayId,
        homeTeam: homeTeamObj.name,
        awayTeam: awayTeamObj.name,
        homeScore: status === 'finished' ? homeScore : 0,
        awayScore: status === 'finished' ? awayScore : 0,
        score: status === 'finished' ? score : undefined,
        date: matchDate.toISOString(),
        stadium: homeTeamObj.stadium,
        status,
        round
      });
    }

    list.splice(1, 0, list.pop()!);
  }

  // Segunda Volta (Jornadas 16 a 30)
  const firstLegMatches = [...generated];
  for (let round = 16; round <= 30; round++) {
    const correspondingFirstLegRound = round - 15;
    const roundMatches = firstLegMatches.filter(m => m.round === correspondingFirstLegRound);
    
    for (let j = 0; j < roundMatches.length; j++) {
      const firstLegMatch = roundMatches[j];
      const homeId = firstLegMatch.awayTeamId;
      const awayId = firstLegMatch.homeTeamId;
      
      const homeTeamObj = TEAMS.find(t => t.id === homeId)!;
      const awayTeamObj = TEAMS.find(t => t.id === awayId)!;

      // Definir todas as 30 jornadas como concluídas (feitas) para alinhar com a tabela STANDINGS.
      const status = 'finished';

      const { homeScore, awayScore, score } = getDeterministicScore(homeId, awayId, round);

      const startDate = new Date('2025-10-11T16:00:00+01:00');
      const matchDate = new Date(startDate.getTime());
      matchDate.setDate(startDate.getDate() + (round - 1) * 7);
      
      const offsetHash = (round + homeId.charCodeAt(0) + awayId.charCodeAt(0)) % 4;
      if (offsetHash === 1) {
        matchDate.setDate(matchDate.getDate() + 1);
      } else if (offsetHash === 2) {
        matchDate.setDate(matchDate.getDate() + 1);
        matchDate.setHours(15, 30);
      } else if (offsetHash === 3) {
        matchDate.setHours(15, 30);
      }

      generated.push({
        id: `m-${round}-${matchIdCounter++}`,
        homeTeamId: homeId,
        awayTeamId: awayId,
        homeTeam: homeTeamObj.name,
        awayTeam: awayTeamObj.name,
        homeScore: status === 'finished' ? homeScore : 0,
        awayScore: status === 'finished' ? awayScore : 0,
        score: status === 'finished' ? score : undefined,
        date: matchDate.toISOString(),
        stadium: homeTeamObj.stadium,
        status,
        round
      });
    }
  }

  // Substituir as jornadas 29 e 30 pelos resultados mockados originais e conhecidos
  const originalRound29 = [
    { id: 'm-2901', round: 29, homeTeamId: 'petro', awayTeamId: 'lundasul', homeTeam: 'Petro de Luanda', awayTeam: 'Desportivo da Lunda Sul', homeScore: 3, awayScore: 0, score: '3-0', date: '2026-05-02T16:00:00+01:00', stadium: 'Estádio 11 de Novembro', status: 'finished' as const },
    { id: 'm-2902', round: 29, homeTeamId: 'dago', awayTeamId: 'kabuscorp', homeTeam: '1.º de Agosto', awayTeam: 'Kabuscorp', homeScore: 2, awayScore: 0, score: '2-0', date: '2026-05-02T15:30:00+01:00', stadium: 'Estádio França Ndalu', status: 'finished' as const },
    { id: 'm-2903', round: 29, homeTeamId: 'wiliete', awayTeamId: 'interclube', homeTeam: 'Wiliete de Benguela', awayTeam: 'Interclube', homeScore: 2, awayScore: 1, score: '2-1', date: '2026-05-03T16:00:00+01:00', stadium: 'Estádio Nacional de Ombaka', status: 'finished' as const },
    { id: 'm-2904', round: 29, homeTeamId: 'sagrada', awayTeamId: 'bravos', homeTeam: 'Sagrada Esperança', awayTeam: 'Bravos do Maquis', homeScore: 1, awayScore: 1, score: '1-1', date: '2026-05-03T15:00:00+01:00', stadium: 'Estádio Sagrada Esperança', status: 'finished' as const },
    { id: 'm-2905', round: 29, homeTeamId: 'libolo', awayTeamId: 'lobito', homeTeam: 'Recreativo do Libolo', awayTeam: 'Académica do Lobito', homeScore: 1, awayScore: 1, score: '1-1', date: '2026-05-03T15:00:00+01:00', stadium: 'Estádio Municipal de Calulo', status: 'finished' as const },
    { id: 'm-2906', round: 29, homeTeamId: 'saosalvador', awayTeamId: 'cabinda', homeTeam: 'São Salvador do Kongo', awayTeam: 'FC Cabinda', homeScore: 1, awayScore: 0, score: '1-0', date: '2026-05-03T15:00:00+01:00', stadium: 'Estádio Álvaro Buta', status: 'finished' as const },
    { id: 'm-2907', round: 29, homeTeamId: 'primeiromaio', awayTeamId: 'caala', homeTeam: '1.º de Maio', awayTeam: 'CR Caála', homeScore: 2, awayScore: 2, score: '2-2', date: '2026-05-02T15:30:00+01:00', stadium: 'Estádio de São Filipe', status: 'finished' as const },
    { id: 'm-2908', round: 29, homeTeamId: 'fcluanda', awayTeamId: 'desphuila', homeTeam: 'FC Luanda', awayTeam: 'Desportivo da Huíla', homeScore: 0, awayScore: 2, score: '0-2', date: '2026-05-03T15:00:00+01:00', stadium: 'Estádio dos Coqueiros', status: 'finished' as const },
  ];

  const originalRound30 = [
    { id: 'm-3001', round: 30, homeTeamId: 'lundasul', awayTeamId: 'dago', homeTeam: 'Desportivo da Lunda Sul', awayTeam: '1.º de Agosto', homeScore: 1, awayScore: 2, score: '1-2', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio das Mangueiras', status: 'finished' as const },
    { id: 'm-3002', round: 30, homeTeamId: 'kabuscorp', awayTeamId: 'petro', homeTeam: 'Kabuscorp', awayTeam: 'Petro de Luanda', homeScore: 1, awayScore: 2, score: '1-2', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio dos Coqueiros', status: 'finished' as const },
    { id: 'm-3003', round: 30, homeTeamId: 'interclube', awayTeamId: 'wiliete', homeTeam: 'Interclube', awayTeam: 'Wiliete de Benguela', homeScore: 0, awayScore: 2, score: '0-2', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio 22 de Junho', status: 'finished' as const },
    { id: 'm-3004', round: 30, homeTeamId: 'bravos', awayTeamId: 'sagrada', homeTeam: 'Bravos do Maquis', awayTeam: 'Sagrada Esperança', homeScore: 2, awayScore: 0, score: '2-0', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio Mundunduleno', status: 'finished' as const },
    { id: 'm-3005', round: 30, homeTeamId: 'lobito', awayTeamId: 'libolo', homeTeam: 'Académica do Lobito', awayTeam: 'Recreativo do Libolo', homeScore: 0, awayScore: 1, score: '0-1', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio do Buraco', status: 'finished' as const },
    { id: 'm-3006', round: 30, homeTeamId: 'cabinda', awayTeamId: 'saosalvador', homeTeam: 'FC Cabinda', awayTeam: 'São Salvador do Kongo', homeScore: 0, awayScore: 0, score: '0-0', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio Nacional do Chiazi', status: 'finished' as const },
    { id: 'm-3007', round: 30, homeTeamId: 'caala', awayTeamId: 'primeiromaio', homeTeam: 'CR Caála', awayTeam: '1.º de Maio', homeScore: 0, awayScore: 1, score: '0-1', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio dos Mártires da Canhala', status: 'finished' as const },
    { id: 'm-3008', round: 30, homeTeamId: 'desphuila', awayTeamId: 'fcluanda', homeTeam: 'Desportivo da Huíla', awayTeam: 'FC Luanda', homeScore: 3, awayScore: 0, score: '3-0', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio da Tundavala', status: 'finished' as const },
  ];

  const filtered = generated.filter(m => m.round !== 29 && m.round !== 30);
  return [...filtered, ...originalRound29, ...originalRound30].sort((a, b) => {
    if (a.round !== b.round) return a.round - b.round;
    return a.id.localeCompare(b.id);
  });
}

export const MATCHES: Match[] = generateAllMatches();

// ── 2b. CLASSIFICAÇÃO DERIVADA DOS JOGOS ───────────────────────────
// A tabela mostrada no site é calculada a partir dos jogos terminados,
// garantindo que classificação e resultados coincidem sempre.
export function computeStandings(matches: Match[]): StandingEntry[] {
  const acc = new Map<string, Omit<StandingEntry, 'position' | 'goalDifference' | 'form'> & { _matches: Match[] }>();
  for (const t of TEAMS) {
    acc.set(t.id, {
      teamId: t.id, teamName: t.name, played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, points: 0, _matches: [],
    });
  }

  const finished = matches
    .filter(m => m.status === 'finished')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const m of finished) {
    const home = acc.get(m.homeTeamId);
    const away = acc.get(m.awayTeamId);
    if (!home || !away) continue;
    home.played++; away.played++;
    home.goalsFor += m.homeScore; home.goalsAgainst += m.awayScore;
    away.goalsFor += m.awayScore; away.goalsAgainst += m.homeScore;
    home._matches.push(m); away._matches.push(m);
    if (m.homeScore > m.awayScore) { home.won++; home.points += 3; away.lost++; }
    else if (m.homeScore < m.awayScore) { away.won++; away.points += 3; home.lost++; }
    else { home.drawn++; away.drawn++; home.points++; away.points++; }
  }

  const formFor = (teamId: string, ms: Match[]): ('W' | 'D' | 'L')[] =>
    ms.slice(-5).map((m) => {
      const isHome = m.homeTeamId === teamId;
      const gf = isHome ? m.homeScore : m.awayScore;
      const ga = isHome ? m.awayScore : m.homeScore;
      return gf > ga ? 'W' : gf < ga ? 'L' : 'D';
    });

  return [...acc.values()]
    .map((e) => ({
      teamId: e.teamId, teamName: e.teamName, played: e.played, won: e.won,
      drawn: e.drawn, lost: e.lost, goalsFor: e.goalsFor, goalsAgainst: e.goalsAgainst,
      goalDifference: e.goalsFor - e.goalsAgainst, points: e.points,
      form: formFor(e.teamId, e._matches),
    }))
    .sort((a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.teamName.localeCompare(b.teamName))
    .map((e, i) => ({ ...e, position: i + 1 }));
}

// Classificação da época em curso (2025/2026), derivada dos jogos.
export const STANDINGS: StandingEntry[] = computeStandings(MATCHES);

// ── 3b. ÉPOCAS / TEMPORADAS ────────────────────────────────────────
export interface Season {
  id: string;        // identificador estável, ex.: '2026-27'
  label: string;     // rótulo de apresentação, ex.: '2026/2027'
  status: 'completed' | 'active' | 'upcoming';
}

// Época atualmente disputada (resultados consolidados) e próxima época já calendarizada.
export const SEASONS: Season[] = [
  { id: '2026-27', label: '2026/2027', status: 'upcoming' },
  { id: '2025-26', label: '2025/2026', status: 'completed' },
];
export const CURRENT_SEASON_ID = '2025-26';
export const UPCOMING_SEASON_ID = '2026-27';

// Proveniência do calendário 2026/2027 — datas oficiais da Proposta ANCAF
// 2026-27 e sorteio oficial publicado pelo gestor ANCAF.
export const ANCAF_CALENDAR_SOURCE = {
  system: 'ANCAF_CALENDAR',
  accessCode: PUBLISHED_ANCAF_CALENDAR_SOURCE.accessCode,
  season: '2026/2027',
  generatedAt: PUBLISHED_ANCAF_CALENDAR_SOURCE.generatedAt,
  rounds: 30,
  matches: 240,
} as const;

// ── 3c. CALENDÁRIO 2026/2027 (sorteio oficial ANCAF) ─────────────────
// Calendário oficial a duas voltas (30 jornadas, 16 equipas, 240 jogos),
// publicado pelo gestor ANCAF como fonte pública do portal.
// As 16 equipas (incl. promovidos FC Cabinda, CR Caála, FC Luanda e
// 1.º de Maio) são as mesmas definidas em TEAMS.
export interface SeasonRound {
  round: number;
  dates: string[];        // datas ISO (yyyy-mm-dd) da jornada
  note?: string;          // observação oficial (ex.: semana CAF, clássico)
  fixtures: [string, string][]; // pares [idCasa, idFora]
}

// Jogos do Girabola 2026/2027 publicados pelo gestor ANCAF como fonte oficial
// consumida pelo site e pelo endpoint público /api/ancaf.
export const MATCHES_2026_27: Match[] = PUBLISHED_MATCHES_2026_27;

// Vista por jornada (confrontos + datas), derivada dos jogos gerados.
// Mantém a forma SeasonRound consumida pelo endpoint /api/ancaf.
export const CALENDAR_2026_27: SeasonRound[] = Array.from(
  MATCHES_2026_27.reduce((map, m) => {
    const r = map.get(m.round) ?? { round: m.round, dates: [], fixtures: [] };
    const day = m.date.split('T')[0];
    if (!r.dates.includes(day)) r.dates.push(day);
    r.fixtures.push([m.homeTeamId, m.awayTeamId]);
    map.set(m.round, r);
    return map;
  }, new Map<number, SeasonRound>()).values(),
).sort((a, b) => a.round - b.round);

// ── 4. LISTA COMPLETA DE JOGADORES ──────────────────────────────────
const PLAYERS_RAW: Player[] = [
  // Avançados
  {
    id: 'dago-tshibamba',
    name: 'Dagó Tshibamba',
    club: '1.º de Agosto',
    teamId: 'dago',
    position: 'Avançado',
    goals: 18,
    assists: 4,
    appearances: 28,
    jerseyNumber: 9,
    age: 28,
    nationality: 'RD Congo',
    height: '1.85m',
    weight: '84kg',
    fullName: 'Dagó Tshibamba Mwanza',
    birthDate: '14/03/1997',
    birthplace: 'Kinshasa, RD Congo',
    preferredFoot: 'Direito',
    attributes: { pace: 87, shooting: 91, passing: 74, dribbling: 82, defending: 35, physical: 84 },
    bio: 'Ponta de lança forte, explosivo e extremamente clínico na área. Consagrado melhor marcador do Liga Unitel Girabola 2025/2026, foi o pilar ofensivo do 1.º de Agosto na luta pelas competições africanas.',
    careerHistory: [
      { season: '2025/26', club: '1.º de Agosto', competition: 'Liga Unitel Girabola', apps: 28, goals: 18, assists: 4, minutes: 2415, yellow: 5, red: 0 },
      { season: '2024/25', club: '1.º de Agosto', competition: 'Liga Unitel Girabola', apps: 26, goals: 12, assists: 6, minutes: 2190, yellow: 4, red: 1 },
      { season: '2023/24', club: 'Daring Club Motema Pembe', competition: 'Linafoot (RDC)', apps: 22, goals: 15, assists: 3, minutes: 1880, yellow: 3, red: 0 }
    ]
  },
  {
    id: 'tiago-azulao',
    name: 'Tiago Azulão',
    club: 'Petro de Luanda',
    teamId: 'petro',
    position: 'Avançado',
    goals: 13,
    assists: 4,
    appearances: 24,
    jerseyNumber: 9,
    age: 35,
    nationality: 'Brasil',
    height: '1.79m',
    weight: '76kg',
    fullName: 'Tiago Manuel Dias Correia',
    birthDate: '09/05/1990',
    birthplace: 'Salvador, Brasil',
    preferredFoot: 'Direito',
    attributes: { pace: 72, shooting: 89, passing: 78, dribbling: 80, defending: 40, physical: 76 },
    bio: 'Uma lenda viva do futebol angolano. O veterano brasileiro Tiago Azulão continua a exibir faro de golo inigualável e liderança estelar, guiando o Petro de Luanda a mais um título nacional.',
    careerHistory: [
      { season: '2025/26', club: 'Petro de Luanda', competition: 'Liga Unitel Girabola', apps: 24, goals: 13, assists: 4, minutes: 2050, yellow: 2, red: 0 },
      { season: '2024/25', club: 'Petro de Luanda', competition: 'Liga Unitel Girabola', apps: 28, goals: 19, assists: 5, minutes: 2480, yellow: 3, red: 0 },
      { season: '2023/24', club: 'Petro de Luanda', competition: 'Liga Unitel Girabola', apps: 27, goals: 21, assists: 6, minutes: 2390, yellow: 1, red: 0 }
    ]
  },
  {
    id: 'gibele',
    name: 'Gilberto (Gibelé)',
    club: 'Petro de Luanda',
    teamId: 'petro',
    position: 'Avançado',
    goals: 8,
    assists: 7,
    appearances: 12,
    jerseyNumber: 7,
    age: 23,
    nationality: 'Angola',
    height: '1.71m',
    weight: '68kg',
    attributes: { pace: 92, shooting: 82, passing: 80, dribbling: 89, defending: 38, physical: 70 },
    bio: 'Extremo veloz e virtuoso, conhecido pela sua facilidade no drible de desequilíbrio e cruzamentos precisos que desestabilizam as defesas adversárias.',
    careerHistory: [
      { season: '2025/26', club: 'Petro de Luanda', apps: 12, goals: 8 }
    ]
  },
  {
    id: 'mano-mano',
    name: 'Mano Mano',
    club: 'Wiliete de Benguela',
    teamId: 'wiliete',
    position: 'Médio / Extremo',
    goals: 12,
    assists: 8,
    appearances: 27,
    jerseyNumber: 10,
    age: 24,
    nationality: 'Angola',
    height: '1.74m',
    weight: '70kg',
    attributes: { pace: 93, shooting: 81, passing: 86, dribbling: 90, defending: 52, physical: 70 },
    bio: 'Um dos maiores talentos jovens da liga. Mano Mano destaca-se pela sua incrível aceleração e capacidade de criar oportunidades a partir de qualquer flanco, sendo a grande figura da histórica época do Wiliete.',
    careerHistory: [
      { season: '2025/26', club: 'Wiliete de Benguela', apps: 27, goals: 12 },
      { season: '2024/25', club: 'Wiliete de Benguela', apps: 25, goals: 8 },
      { season: '2023/24', club: 'Académica do Lobito', apps: 20, goals: 4 }
    ]
  },
  {
    id: 'kaporal',
    name: 'Kaporal',
    club: 'Académica do Lobito',
    teamId: 'lobito',
    position: 'Avançado',
    goals: 11,
    assists: 1,
    appearances: 25,
    jerseyNumber: 11,
    age: 29,
    nationality: 'Angola',
    height: '1.88m',
    weight: '86kg',
    attributes: { pace: 84, shooting: 83, passing: 68, dribbling: 77, defending: 30, physical: 86 },
    bio: 'Avançado centro de grande porte físico, temível no jogo aéreo e especialista em segurar a bola de costas para a baliza. Um herói local na província de Benguela.',
    careerHistory: [
      { season: '2025/26', club: 'Académica do Lobito', apps: 25, goals: 11 },
      { season: '2024/25', club: 'Académica do Lobito', apps: 22, goals: 9 }
    ]
  },
  {
    id: 'julinho',
    name: 'Julinho',
    club: 'Interclube',
    teamId: 'interclube',
    position: 'Avançado',
    goals: 9,
    assists: 2,
    appearances: 28,
    jerseyNumber: 7,
    age: 26,
    nationality: 'Angola',
    height: '1.78m',
    weight: '73kg',
    attributes: { pace: 86, shooting: 80, passing: 72, dribbling: 81, defending: 44, physical: 73 },
    bio: 'Veloz e oportuno, Julinho é a referência ofensiva do Interclube na ala esquerda, sempre pronto para cortar para dentro e finalizar de pé direito.',
    careerHistory: [
      { season: '2025/26', club: 'Interclube', apps: 28, goals: 9 },
      { season: '2024/25', club: 'Interclube', apps: 24, goals: 6 }
    ]
  },
  // Médios
  {
    id: 'keliano',
    name: 'Manuel Keliano',
    club: '1.º de Agosto',
    teamId: 'dago',
    position: 'Médio',
    nationality: 'Angola',
    jerseyNumber: 8,
    goals: 3,
    assists: 9,
    appearances: 12,
    age: 21,
    height: '1.78m',
    weight: '72kg',
    attributes: { pace: 80, shooting: 74, passing: 87, dribbling: 82, defending: 78, physical: 79 },
    bio: 'Médio completo com grande visão de jogo e precisão de passe, sendo o organizador central do miolo do Primeiro de Agosto.',
    careerHistory: [
      { season: '2025/26', club: '1.º de Agosto', apps: 12, goals: 3 }
    ]
  },
  {
    id: 'jaredi',
    name: 'Jaredi',
    club: 'Petro de Luanda',
    teamId: 'petro',
    position: 'Extremo',
    goals: 8,
    assists: 11,
    appearances: 26,
    jerseyNumber: 11,
    age: 25,
    nationality: 'Angola',
    height: '1.72m',
    weight: '68kg',
    attributes: { pace: 91, shooting: 78, passing: 88, dribbling: 89, defending: 48, physical: 68 },
    bio: 'O rei das assistências do Liga Unitel Girabola. Jaredi exibe excelente criatividade, controlo em espaços curtos e passes cruzados milimétricos que serviram de munição constante para Tiago Azulão.',
    careerHistory: [
      { season: '2025/26', club: 'Petro de Luanda', apps: 26, goals: 8 },
      { season: '2024/25', club: 'Interclube', apps: 25, goals: 7 }
    ]
  },
  {
    id: 'lepua',
    name: 'Lépua',
    club: 'Sagrada Esperança',
    teamId: 'sagrada',
    position: 'Médio Ofensivo',
    goals: 7,
    assists: 7,
    appearances: 23,
    jerseyNumber: 8,
    age: 26,
    nationality: 'Angola',
    height: '1.76m',
    weight: '72kg',
    attributes: { pace: 80, shooting: 79, passing: 85, dribbling: 84, defending: 55, physical: 72 },
    bio: 'Maestro criativo do meio campo diamantífero do Sagrada Esperança. Excelente visão de jogo e precisão em lances de bola parada.',
    careerHistory: [
      { season: '2025/26', club: 'Sagrada Esperança', apps: 23, goals: 7 },
      { season: '2024/25', club: 'Sagrada Esperança', apps: 26, goals: 5 }
    ]
  },
  {
    id: 'macusa',
    name: 'Macusa',
    club: 'Bravos do Maquis',
    teamId: 'bravos',
    position: 'Médio',
    goals: 4,
    assists: 6,
    appearances: 25,
    jerseyNumber: 14,
    age: 27,
    nationality: 'Angola',
    height: '1.80m',
    weight: '77kg',
    attributes: { pace: 78, shooting: 72, passing: 81, dribbling: 79, defending: 70, physical: 77 },
    bio: 'Médio box-to-box versátil, Macusa dita o ritmo dos Bravos do Maquis com compostura na posse de bola e forte capacidade de desarme no miolo.',
    careerHistory: [
      { season: '2025/26', club: 'Bravos do Maquis', apps: 25, goals: 4 }
    ]
  },
  // Defesas
  {
    id: 'to-carneiro',
    name: 'Tó Carneiro',
    club: 'Petro de Luanda',
    teamId: 'petro',
    position: 'Defesa Esquerdo',
    goals: 2,
    assists: 5,
    appearances: 28,
    jerseyNumber: 2,
    age: 30,
    nationality: 'Angola',
    height: '1.78m',
    weight: '78kg',
    attributes: { pace: 82, shooting: 65, passing: 80, dribbling: 76, defending: 81, physical: 78 },
    bio: 'Consistente e infatigável. Tó Carneiro é o dono incontestável da ala esquerda do campeão nacional, garantindo solidez defensiva e excelente apoio no corredor ofensivo.',
    careerHistory: [
      { season: '2025/26', club: 'Petro de Luanda', apps: 28, goals: 2 },
      { season: '2024/25', club: 'Petro de Luanda', apps: 26, goals: 1 }
    ]
  },
  {
    id: 'bobo',
    name: 'Bobo Ungenda',
    club: '1.º de Agosto',
    teamId: 'dago',
    position: 'Defesa',
    goals: 1,
    assists: 1,
    appearances: 12,
    jerseyNumber: 4,
    age: 33,
    nationality: 'RDC',
    height: '1.87m',
    weight: '82kg',
    attributes: { pace: 68, shooting: 50, passing: 65, dribbling: 58, defending: 88, physical: 90 },
    bio: 'Uma autêntica muralha no centro da defesa. Bobo Ungenda destaca-se pela sua superioridade física nos duelos individuais e excelente leitura de jogo.',
    careerHistory: [
      { season: '2025/26', club: '1.º de Agosto', apps: 12, goals: 1 }
    ]
  },
  // Guarda-redes
  {
    id: 'hugo-marques',
    name: 'Hugo Marques',
    club: 'Petro de Luanda',
    teamId: 'petro',
    position: 'Guarda-redes',
    goals: 0,
    assists: 0,
    appearances: 26,
    jerseyNumber: 1,
    age: 37,
    nationality: 'Angola',
    height: '1.91m',
    weight: '88kg',
    attributes: { pace: 50, shooting: 45, passing: 68, dribbling: 55, defending: 86, physical: 74 },
    bio: 'Guarda-redes experiente, internacional pela seleção angolana. Foi o menos batido da liga, mostrando agilidade de elite debaixo das traves.',
    careerHistory: [
      { season: '2025/26', club: 'Petro de Luanda', apps: 26, goals: 0 },
      { season: '2024/25', club: 'Petro de Luanda', apps: 27, goals: 0 }
    ]
  },
  {
    id: 'neblu',
    name: 'Neblú',
    club: '1.º de Agosto',
    teamId: 'dago',
    position: 'Guarda-redes',
    goals: 0,
    assists: 0,
    appearances: 27,
    jerseyNumber: 22,
    age: 32,
    nationality: 'Angola',
    height: '1.88m',
    weight: '78kg',
    attributes: { pace: 52, shooting: 48, passing: 60, dribbling: 50, defending: 85, physical: 78 },
    bio: 'Titular indiscutível da seleção nacional angolana (Palancas Negras) e do 1.º de Agosto, Neblú é reconhecido pela sua excelente envergadura e liderança em campo.',
    careerHistory: [
      { season: '2025/26', club: '1.º de Agosto', apps: 27, goals: 0 }
    ]
  },
  {
    id: 'titi',
    name: 'Titi',
    club: 'Wiliete de Benguela',
    teamId: 'wiliete',
    position: 'Guarda-redes',
    goals: 0,
    assists: 0,
    appearances: 24,
    jerseyNumber: 12,
    age: 27,
    nationality: 'Angola',
    height: '1.85m',
    weight: '72kg',
    attributes: { pace: 55, shooting: 40, passing: 62, dribbling: 52, defending: 80, physical: 72 },
    bio: 'Guarda-redes dinâmico e elástico do Wiliete de Benguela. Peça fundamental no sistema defensivo de Lito Vidigal.',
    careerHistory: [
      { season: '2025/26', club: 'Wiliete de Benguela', apps: 24, goals: 0 }
    ]
  },
  {
    id: 'kabuscorp-player-1', name: 'Mário Costa', club: 'Kabuscorp', teamId: 'kabuscorp', position: 'Avançado',
    goals: 5, assists: 2, appearances: 20, jerseyNumber: 10, age: 26, nationality: 'Angola', height: '1.80m', weight: '75kg',
    attributes: { pace: 80, shooting: 75, passing: 70, dribbling: 78, defending: 40, physical: 72 },
    bio: 'Principal referência ofensiva do Kabuscorp nesta temporada.'
  },
  {
    id: 'kabuscorp-player-2', name: 'Lami Muanza', club: 'Kabuscorp', teamId: 'kabuscorp', position: 'Defesa',
    goals: 1, assists: 1, appearances: 18, jerseyNumber: 4, age: 28, nationality: 'Angola', height: '1.85m', weight: '80kg',
    attributes: { pace: 70, shooting: 48, passing: 65, dribbling: 60, defending: 78, physical: 82 },
    bio: 'Defesa central seguro e muito forte no posicionamento defensivo.'
  },
  {
    id: 'kabuscorp-player-3', name: 'Trésor Mputu Jr', club: 'Kabuscorp', teamId: 'kabuscorp', position: 'Médio',
    goals: 3, assists: 4, appearances: 22, jerseyNumber: 8, age: 24, nationality: 'RD Congo', height: '1.74m', weight: '69kg',
    attributes: { pace: 78, shooting: 70, passing: 81, dribbling: 83, defending: 50, physical: 70 },
    bio: 'Médio criativo dotado de excelente visão de jogo e passe curto.'
  },
  {
    id: 'desphuila-player-1', name: 'João Vítor', club: 'Desportivo da Huíla', teamId: 'desphuila', position: 'Médio',
    goals: 3, assists: 5, appearances: 28, jerseyNumber: 8, age: 24, nationality: 'Angola', height: '1.75m', weight: '70kg',
    attributes: { pace: 75, shooting: 68, passing: 82, dribbling: 76, defending: 65, physical: 68 },
    bio: 'Médio criativo e motor da equipa da Huíla.'
  },
  {
    id: 'desphuila-player-2', name: 'Emanuel Tchite', club: 'Desportivo da Huíla', teamId: 'desphuila', position: 'Avançado',
    goals: 6, assists: 1, appearances: 24, jerseyNumber: 9, age: 25, nationality: 'Angola', height: '1.82m', weight: '76kg',
    attributes: { pace: 83, shooting: 77, passing: 64, dribbling: 72, defending: 32, physical: 75 },
    bio: 'Avançado de mobilidade rápida, letal em transições ofensivas.'
  },
  {
    id: 'desphuila-player-3', name: 'Nani Santos', club: 'Desportivo da Huíla', teamId: 'desphuila', position: 'Defesa',
    goals: 0, assists: 1, appearances: 26, jerseyNumber: 3, age: 27, nationality: 'Angola', height: '1.80m', weight: '74kg',
    attributes: { pace: 74, shooting: 52, passing: 68, dribbling: 64, defending: 79, physical: 77 },
    bio: 'Lateral esquerdo muito equilibrado no apoio e na marcação.'
  },
  {
    id: 'lundasul-player-1', name: 'Paulo Silva', club: 'Desportivo da Lunda Sul', teamId: 'lundasul', position: 'Defesa',
    goals: 1, assists: 1, appearances: 25, jerseyNumber: 4, age: 29, nationality: 'Angola', height: '1.88m', weight: '82kg',
    attributes: { pace: 65, shooting: 50, passing: 60, dribbling: 55, defending: 80, physical: 85 },
    bio: 'Defesa central robusto e capitão de equipa.'
  },
  {
    id: 'lundasul-player-2', name: 'Mussa Kabamba', club: 'Desportivo da Lunda Sul', teamId: 'lundasul', position: 'Avançado',
    goals: 7, assists: 2, appearances: 26, jerseyNumber: 11, age: 27, nationality: 'RD Congo', height: '1.80m', weight: '77kg',
    attributes: { pace: 84, shooting: 79, passing: 65, dribbling: 75, defending: 30, physical: 79 },
    bio: 'Ponta de lança de referência, especialista em golos na pequena área.'
  },
  {
    id: 'lundasul-player-3', name: 'Tchabalala', club: 'Desportivo da Lunda Sul', teamId: 'lundasul', position: 'Médio',
    goals: 2, assists: 3, appearances: 28, jerseyNumber: 6, age: 26, nationality: 'Angola', height: '1.76m', weight: '72kg',
    attributes: { pace: 75, shooting: 60, passing: 78, dribbling: 72, defending: 76, physical: 78 },
    bio: 'Médio defensivo incansável na recuperação e distribuição de jogo.'
  },
  {
    id: 'libolo-player-1', name: 'Rui Carlos', club: 'Recreativo do Libolo', teamId: 'libolo', position: 'Avançado',
    goals: 6, assists: 3, appearances: 22, jerseyNumber: 9, age: 27, nationality: 'Angola', height: '1.82m', weight: '78kg',
    attributes: { pace: 82, shooting: 78, passing: 65, dribbling: 74, defending: 35, physical: 76 },
    bio: 'Ponta de lança forte no jogo aéreo.'
  },
  {
    id: 'libolo-player-2', name: 'Dany Traoré', club: 'Recreativo do Libolo', teamId: 'libolo', position: 'Médio',
    goals: 1, assists: 4, appearances: 20, jerseyNumber: 10, age: 26, nationality: 'Mali', height: '1.78m', weight: '71kg',
    attributes: { pace: 78, shooting: 72, passing: 83, dribbling: 80, defending: 62, physical: 70 },
    bio: 'Organizador de jogo inteligente com boa qualidade técnica no meio campo.'
  },
  {
    id: 'libolo-player-3', name: 'Chico Banza', club: 'Recreativo do Libolo', teamId: 'libolo', position: 'Defesa',
    goals: 0, assists: 0, appearances: 21, jerseyNumber: 2, age: 24, nationality: 'Angola', height: '1.83m', weight: '75kg',
    attributes: { pace: 80, shooting: 45, passing: 70, dribbling: 68, defending: 75, physical: 78 },
    bio: 'Lateral direito de velocidade constante e excelente atitude defensiva.'
  },
  {
    id: 'saosalvador-player-1', name: 'António Ndongala', club: 'São Salvador do Kongo', teamId: 'saosalvador', position: 'Médio',
    goals: 2, assists: 4, appearances: 26, jerseyNumber: 20, age: 22, nationality: 'Angola', height: '1.72m', weight: '68kg',
    attributes: { pace: 85, shooting: 65, passing: 78, dribbling: 80, defending: 50, physical: 65 },
    bio: 'Jovem promessa com grande velocidade e técnica.'
  },
  {
    id: 'saosalvador-player-2', name: 'Pedro Mbemba', club: 'São Salvador do Kongo', teamId: 'saosalvador', position: 'Defesa',
    goals: 0, assists: 1, appearances: 28, jerseyNumber: 4, age: 28, nationality: 'Angola', height: '1.84m', weight: '81kg',
    attributes: { pace: 70, shooting: 48, passing: 62, dribbling: 58, defending: 78, physical: 80 },
    bio: 'Muralha defensiva central, temível nos desarmes de recurso.'
  },
  {
    id: 'saosalvador-player-3', name: 'Kikas Varela', club: 'São Salvador do Kongo', teamId: 'saosalvador', position: 'Avançado',
    goals: 5, assists: 2, appearances: 24, jerseyNumber: 7, age: 25, nationality: 'Angola', height: '1.79m', weight: '73kg',
    attributes: { pace: 88, shooting: 74, passing: 66, dribbling: 78, defending: 38, physical: 71 },
    bio: 'Extremo ágil de drible imprevisível no um contra um.'
  },
  {
    id: 'cabinda-player-1', name: 'Carlos Manuel', club: 'FC Cabinda', teamId: 'cabinda', position: 'Guarda-redes',
    goals: 0, assists: 0, appearances: 30, jerseyNumber: 1, age: 31, nationality: 'Angola', height: '1.90m', weight: '85kg',
    attributes: { pace: 50, shooting: 40, passing: 60, dribbling: 45, defending: 82, physical: 80 },
    bio: 'Guarda-redes experiente que tem salvo o FC Cabinda em vários jogos.'
  },
  {
    id: 'cabinda-player-2', name: 'Zito Luvumbo', club: 'FC Cabinda', teamId: 'cabinda', position: 'Avançado',
    goals: 8, assists: 3, appearances: 28, jerseyNumber: 11, age: 23, nationality: 'Angola', height: '1.72m', weight: '67kg',
    attributes: { pace: 93, shooting: 78, passing: 72, dribbling: 87, defending: 35, physical: 68 },
    bio: 'Avançado criativo com enorme velocidade, uma grande referência do clube.'
  },
  {
    id: 'cabinda-player-3', name: 'Pacheco Ndulo', club: 'FC Cabinda', teamId: 'cabinda', position: 'Defesa',
    goals: 1, assists: 0, appearances: 25, jerseyNumber: 3, age: 26, nationality: 'Angola', height: '1.86m', weight: '81kg',
    attributes: { pace: 72, shooting: 54, passing: 64, dribbling: 60, defending: 79, physical: 83 },
    bio: 'Defesa central fisicamente forte e muito eficiente no jogo aéreo.'
  },
  {
    id: 'primeiromaio-player-1', name: 'Edgar Santos', club: '1.º de Maio', teamId: 'primeiromaio', position: 'Extremo',
    goals: 4, assists: 6, appearances: 24, jerseyNumber: 11, age: 25, nationality: 'Angola', height: '1.76m', weight: '71kg',
    attributes: { pace: 88, shooting: 72, passing: 75, dribbling: 82, defending: 45, physical: 70 },
    bio: 'Extremo rápido e especialista em cruzamentos.'
  },
  {
    id: 'primeiromaio-player-2', name: 'Beto Benguela', club: '1.º de Maio', teamId: 'primeiromaio', position: 'Defesa',
    goals: 0, assists: 1, appearances: 27, jerseyNumber: 4, age: 29, nationality: 'Angola', height: '1.84m', weight: '79kg',
    attributes: { pace: 68, shooting: 50, passing: 65, dribbling: 58, defending: 77, physical: 81 },
    bio: 'Experiente lateral direito que oferece excelente rigor defensivo.'
  },
  {
    id: 'primeiromaio-player-3', name: 'Vado Dias', club: '1.º de Maio', teamId: 'primeiromaio', position: 'Médio',
    goals: 1, assists: 3, appearances: 25, jerseyNumber: 8, age: 24, nationality: 'Angola', height: '1.75m', weight: '70kg',
    attributes: { pace: 74, shooting: 66, passing: 78, dribbling: 75, defending: 68, physical: 72 },
    bio: 'Médio versátil de transição e excelente ética de trabalho no meio.'
  },
  {
    id: 'caala-player-1', name: 'Vítor Hugo', club: 'CR Caála', teamId: 'caala', position: 'Médio Ofensivo',
    goals: 5, assists: 2, appearances: 21, jerseyNumber: 10, age: 28, nationality: 'Angola', height: '1.78m', weight: '74kg',
    attributes: { pace: 76, shooting: 75, passing: 80, dribbling: 78, defending: 55, physical: 72 },
    bio: 'O número 10 clássico, responsável pelas bolas paradas da equipa.'
  },
  {
    id: 'caala-player-2', name: 'Luís Silva', club: 'CR Caála', teamId: 'caala', position: 'Avançado',
    goals: 6, assists: 1, appearances: 22, jerseyNumber: 9, age: 26, nationality: 'Angola', height: '1.82m', weight: '78kg',
    attributes: { pace: 80, shooting: 78, passing: 62, dribbling: 73, defending: 30, physical: 79 },
    bio: 'Ponta de lança letal dentro de área com óptimo sentido de posicionamento.'
  },
  {
    id: 'caala-player-3', name: 'Nelito', club: 'CR Caála', teamId: 'caala', position: 'Defesa',
    goals: 0, assists: 0, appearances: 24, jerseyNumber: 3, age: 27, nationality: 'Angola', height: '1.85m', weight: '82kg',
    attributes: { pace: 72, shooting: 48, passing: 65, dribbling: 60, defending: 79, physical: 83 },
    bio: 'Defesa central implacável na marcação directa ao adversário.'
  },
  {
    id: 'fcluanda-player-1', name: 'Bruno Fernando', club: 'FC Luanda', teamId: 'fcluanda', position: 'Defesa',
    goals: 0, assists: 1, appearances: 27, jerseyNumber: 3, age: 23, nationality: 'Angola', height: '1.83m', weight: '77kg',
    attributes: { pace: 78, shooting: 55, passing: 68, dribbling: 65, defending: 75, physical: 78 },
    bio: 'Lateral esquerdo muito ofensivo e incansável.'
  },
  {
    id: 'fcluanda-player-2', name: 'Miguel Costa', club: 'FC Luanda', teamId: 'fcluanda', position: 'Avançado',
    goals: 4, assists: 2, appearances: 22, jerseyNumber: 9, age: 25, nationality: 'Angola', height: '1.80m', weight: '76kg',
    attributes: { pace: 84, shooting: 75, passing: 64, dribbling: 76, defending: 35, physical: 73 },
    bio: 'Ponta de lança com boa movimentação ofensiva e cabeceamento.'
  },
  {
    id: 'fcluanda-player-3', name: 'Gelson Dala Jr', club: 'FC Luanda', teamId: 'fcluanda', position: 'Médio',
    goals: 2, assists: 4, appearances: 25, jerseyNumber: 10, age: 22, nationality: 'Angola', height: '1.73m', weight: '68kg',
    attributes: { pace: 86, shooting: 70, passing: 79, dribbling: 82, defending: 48, physical: 65 },
    bio: 'Jovem médio ofensivo caracterizado pela sua criatividade e ritmo rápido.'
  },
  {
    id: 'wiliete-player-3', name: 'Karanga', club: 'Wiliete de Benguela', teamId: 'wiliete', position: 'Médio',
    goals: 5, assists: 4, appearances: 26, jerseyNumber: 7, age: 25, nationality: 'Angola', height: '1.76m', weight: '72kg',
    attributes: { pace: 85, shooting: 73, passing: 78, dribbling: 81, defending: 60, physical: 74 },
    bio: 'Médio polivalente e dinâmico, autor de golos cruciais na campanha do clube.'
  },
  {
    id: 'lobito-player-2', name: 'Gerson Lourenço', club: 'Académica do Lobito', teamId: 'lobito', position: 'Médio',
    goals: 1, assists: 3, appearances: 24, jerseyNumber: 6, age: 24, nationality: 'Angola', height: '1.78m', weight: '73kg',
    attributes: { pace: 75, shooting: 62, passing: 76, dribbling: 72, defending: 70, physical: 75 },
    bio: 'Médio combativo que assegura equilíbrio na transição defensiva.'
  },
  {
    id: 'lobito-player-3', name: 'Ruben Fernandes', club: 'Académica do Lobito', teamId: 'lobito', position: 'Defesa',
    goals: 0, assists: 0, appearances: 23, jerseyNumber: 4, age: 27, nationality: 'Angola', height: '1.83m', weight: '80kg',
    attributes: { pace: 70, shooting: 45, passing: 60, dribbling: 55, defending: 78, physical: 82 },
    bio: 'Defesa central de forte compleição física e excelente desarme por baixo.'
  },
  {
    id: 'interclube-player-2', name: 'Beni Mukendi', club: 'Interclube', teamId: 'interclube', position: 'Médio',
    goals: 2, assists: 5, appearances: 26, jerseyNumber: 8, age: 23, nationality: 'Angola', height: '1.77m', weight: '71kg',
    attributes: { pace: 80, shooting: 68, passing: 82, dribbling: 79, defending: 70, physical: 74 },
    bio: 'Jovem distribuidor dotado de grande qualidade no passe a longa distância.'
  },
  {
    id: 'interclube-player-3', name: 'Carlitos Lemos', club: 'Interclube', teamId: 'interclube', position: 'Defesa',
    goals: 1, assists: 1, appearances: 27, jerseyNumber: 5, age: 29, nationality: 'Angola', height: '1.86m', weight: '81kg',
    attributes: { pace: 72, shooting: 50, passing: 70, dribbling: 64, defending: 81, physical: 80 },
    bio: 'Defesa central experiente e líder da linha recuada do clube.'
  },
  {
    id: 'sagrada-player-2', name: 'Depú Ramos', club: 'Sagrada Esperança', teamId: 'sagrada', position: 'Avançado',
    goals: 7, assists: 1, appearances: 22, jerseyNumber: 9, age: 26, nationality: 'Angola', height: '1.82m', weight: '78kg',
    attributes: { pace: 85, shooting: 82, passing: 60, dribbling: 72, defending: 35, physical: 78 },
    bio: 'Avançado centro oportunista com grande presença física e cabeceamento forte.'
  },
  {
    id: 'sagrada-player-3', name: 'Victoriano Victor', club: 'Sagrada Esperança', teamId: 'sagrada', position: 'Defesa',
    goals: 0, assists: 0, appearances: 25, jerseyNumber: 3, age: 27, nationality: 'Angola', height: '1.84m', weight: '80kg',
    attributes: { pace: 74, shooting: 48, passing: 65, dribbling: 60, defending: 82, physical: 82 },
    bio: 'Defesa esquerdo muito focado no trabalho tático e cobertura.'
  },
  {
    id: 'bravos-player-2', name: 'Dino Macolo', club: 'Bravos do Maquis', teamId: 'bravos', position: 'Avançado',
    goals: 5, assists: 3, appearances: 23, jerseyNumber: 7, age: 24, nationality: 'Angola', height: '1.76m', weight: '70kg',
    attributes: { pace: 89, shooting: 73, passing: 68, dribbling: 81, defending: 32, physical: 68 },
    bio: 'Extremo veloz com boa qualidade de drible e cruzamentos.'
  },
  {
    id: 'bravos-player-3', name: 'Sérgio Ndala', club: 'Bravos do Maquis', teamId: 'bravos', position: 'Guarda-redes',
    goals: 0, assists: 0, appearances: 25, jerseyNumber: 12, age: 28, nationality: 'Angola', height: '1.87m', weight: '80kg',
    attributes: { pace: 52, shooting: 40, passing: 58, dribbling: 50, defending: 79, physical: 76 },
    bio: 'Guarda-redes de bons reflexos e eficiente no controlo da profundidade.'
  }
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function enrichPlayer(p: Player): Player {
  const hash = simpleHash(p.name);
  const positionLower = p.position.toLowerCase();

  // Deterministic ratings
  const technicalRating = parseFloat((7.1 + (hash % 13) * 0.1).toFixed(2));
  const formRating = parseFloat((technicalRating - 0.2 - (hash % 3) * 0.1).toFixed(2));

  // FIFA Connect
  const isPending = p.name.includes('Keliano') || p.name.includes('Jaredi') || p.name.includes('Lepua');
  const fifaConnectStatus = isPending ? 'pending' : 'active';
  const fifaConnectId = `FIFA-AO-${100000 + (hash % 900000)}`;
  const fifaConnectRegDate = `2025-08-${10 + (hash % 18)}`;

  // Detailed stats
  let passingAccuracy = 75 + (hash % 15);
  let longPassesAccuracy = 55 + (hash % 20);
  let aerialDuelsWon = 45 + (hash % 35);
  let groundDuelsWon = 50 + (hash % 25);
  let tacklesPerMatch = parseFloat((0.8 + (hash % 10) * 0.3).toFixed(1));
  let keyPassesPerMatch = parseFloat((0.4 + (hash % 12) * 0.2).toFixed(1));
  let shotsOnTargetPerMatch = parseFloat((0.2 + (hash % 15) * 0.2).toFixed(1));
  let successfulDribbles = 50 + (hash % 30);

  if (positionLower.includes('avançado') || positionLower.includes('avancado')) {
    passingAccuracy = 72 + (hash % 12);
    longPassesAccuracy = 50 + (hash % 15);
    aerialDuelsWon = 58 + (hash % 25);
    groundDuelsWon = 48 + (hash % 20);
    tacklesPerMatch = parseFloat((0.2 + (hash % 5) * 0.1).toFixed(1));
    keyPassesPerMatch = parseFloat((0.8 + (hash % 10) * 0.2).toFixed(1));
    shotsOnTargetPerMatch = parseFloat((1.2 + (hash % 10) * 0.3).toFixed(1));
    successfulDribbles = 60 + (hash % 25);
  } else if (positionLower.includes('médio') || positionLower.includes('medio')) {
    passingAccuracy = 84 + (hash % 10);
    longPassesAccuracy = 65 + (hash % 20);
    aerialDuelsWon = 42 + (hash % 20);
    groundDuelsWon = 52 + (hash % 18);
    tacklesPerMatch = parseFloat((1.5 + (hash % 8) * 0.3).toFixed(1));
    keyPassesPerMatch = parseFloat((1.4 + (hash % 8) * 0.2).toFixed(1));
    shotsOnTargetPerMatch = parseFloat((0.4 + (hash % 8) * 0.2).toFixed(1));
    successfulDribbles = 58 + (hash % 20);
  } else if (positionLower.includes('defesa')) {
    passingAccuracy = 78 + (hash % 10);
    longPassesAccuracy = 58 + (hash % 22);
    aerialDuelsWon = 64 + (hash % 20);
    groundDuelsWon = 56 + (hash % 15);
    tacklesPerMatch = parseFloat((2.0 + (hash % 6) * 0.4).toFixed(1));
    keyPassesPerMatch = parseFloat((0.2 + (hash % 5) * 0.1).toFixed(1));
    shotsOnTargetPerMatch = parseFloat((0.1 + (hash % 4) * 0.1).toFixed(1));
    successfulDribbles = 38 + (hash % 15);
  } else if (positionLower.includes('guarda-redes') || positionLower.includes('guarda redes') || positionLower.includes('goleiro')) {
    passingAccuracy = 65 + (hash % 15);
    longPassesAccuracy = 42 + (hash % 28);
    aerialDuelsWon = 82 + (hash % 15);
    groundDuelsWon = 38 + (hash % 20);
    tacklesPerMatch = 0.1;
    keyPassesPerMatch = 0.0;
    shotsOnTargetPerMatch = 0.0;
    successfulDribbles = 5 + (hash % 10);
  }

  // ratingTrend
  const ratingTrend = [
    parseFloat((technicalRating - 0.3 + (hash % 4) * 0.2).toFixed(2)),
    parseFloat((technicalRating - 0.1 + ((hash + 1) % 4) * 0.2).toFixed(2)),
    parseFloat((technicalRating - 0.4 + ((hash + 2) % 5) * 0.2).toFixed(2)),
    parseFloat((technicalRating + 0.2 - ((hash + 3) % 4) * 0.15).toFixed(2)),
    technicalRating
  ];

  return {
    ...p,
    technicalRating,
    formRating,
    fifaConnectId,
    fifaConnectStatus,
    fifaConnectRegDate,
    detailedStats: {
      passingAccuracy,
      longPassesAccuracy,
      aerialDuelsWon,
      groundDuelsWon,
      tacklesPerMatch,
      keyPassesPerMatch,
      minutesPlayed: p.appearances * 90 - (hash % 5) * 15,
      yellowCards: hash % 6,
      redCards: hash % 15 === 0 ? 1 : 0,
      shotsOnTargetPerMatch,
      successfulDribbles,
      ratingTrend
    }
  };
}

export const PLAYERS: Player[] = PLAYERS_RAW.map(enrichPlayer);

// ── 5. ESTATÍSTICAS DE LÍDERES ──────────────────────────────────────
export const TOP_SCORERS: PlayerStats[] = PLAYERS
  .filter(p => p.goals > 0)
  .sort((a, b) => b.goals - a.goals)
  .slice(0, 7)
  .map(p => ({
    id: p.id,
    name: p.name,
    club: p.club,
    position: p.position,
    goals: p.goals,
    assists: p.assists,
    appearances: p.appearances
  }));

export const TOP_ASSISTS: PlayerStats[] = PLAYERS
  .filter(p => p.assists > 0)
  .sort((a, b) => b.assists - a.assists)
  .slice(0, 5)
  .map(p => ({
    id: p.id,
    name: p.name,
    club: p.club,
    position: p.position,
    goals: p.goals,
    assists: p.assists,
    appearances: p.appearances
  }));

// ── 6. NOTÍCIAS COMPLETA MOCKS ─────────────────────────────────────
export const newsMock: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Petro de Luanda vence o clássico no 11 de Novembro contra 1.º de Agosto',
    category: 'Liga Unitel Girabola',
    date: '13 Jun 2026',
    summary: 'Com golo solitário de Tiago Azulão aos 88 minutos, os tricolores asseguraram a liderança da tabela.',
    content: 'O clássico dos clássicos do futebol angolano terminou com a vitória tangencial do Petro de Luanda sobre o rival Primeiro de Agosto. Num jogo tenso e disputado taticamente, o avançado brasileiro Tiago Azulão voltou a ser decisivo, finalizando de cabeça um cruzamento milimétrico de Jaredi aos 88 minutos, despoletando a loucura no Estádio 11 de Novembro. Esta vitória consolida a liderança isolada dos tricolores na presente campanha de preparação da liga.'
  },
  {
    id: 'n2',
    title: 'Manuel Keliano destaca subida de rendimento no meio-campo',
    category: 'Entrevista',
    date: '12 Jun 2026',
    summary: 'O internacional angolano analisou a fase positiva da equipa e o próximo jogo contra o Kabuscorp.',
    content: 'Em conferência de imprensa após os treinos do Primeiro de Agosto no complexo França Ndalu, o jovem virtuoso Manuel Keliano analisou a rápida transição da equipa para novos esquemas táticos. Keliano expressou que a intensidade imposta nos treinos começa a traduzir-se em exibições de classe, sublinhando que o grupo está altamente focado em garantir a vitória no próximo desafio contra o Kabuscorp do Palanca.'
  },
  {
    id: 'n3',
    title: 'Wiliete de Benguela garante histórico 2º lugar e vaga nas competições africanas',
    category: 'Competição',
    date: '09 Mai 2026',
    summary: 'A formação de Benguela venceu o Interclube por 2-0 e garantiu uma participação histórica na Liga dos Campeões da CAF para a próxima época.',
    content: 'Benguela está em festa. O Wiliete de Benguela bateu o Interclube por duas bolas a zero no Estádio Nacional de Ombaka e carimbou a sua vaga oficial na Liga dos Campeões da CAF da próxima época. Com golos de Mano Mano e Karanga, a formação dirigida por Lito Vidigal coroou uma campanha fenomenal no Liga Unitel Girabola, consagrando-se como a grande surpresa do futebol nacional angolano.'
  },
  {
    id: 'n4',
    title: 'Dagó Tshibamba conquista Troféu de Melhor Marcador do Liga Unitel Girabola',
    category: 'Individual',
    date: '10 Mai 2026',
    summary: 'O avançado congolês do 1.º de Agosto finalizou a temporada com 18 golos marcados, consagrando-se o principal goleador do futebol nacional angolano.',
    content: 'O troféu de artilheiro do futebol angolano tem novo dono. O avançado congolês Dagó Tshibamba fechou a época de ouro do 1.º de Agosto com 18 golos apontados na prova. Tshibamba demonstrou regularidade notável, sendo coroado oficialmente como o melhor marcador e grande estrela ofensiva do Liga Unitel Girabola.'
  },
  {
    id: 'n5',
    title: 'Requalificação do Estádio França Ndalu recebe luz verde da FAF',
    category: 'Infraestrutura',
    date: '24 Jun 2026',
    summary: 'A comissão técnica vistoriou as obras e aprovou o relvado para as competições nacionais e internacionais da próxima época.',
    content: 'O Estádio França Ndalu, casa do 1.º de Agosto, recebeu luz verde da federação para acolher jogos de alto nível na próxima temporada. Após profundas obras de requalificação no relvado e nos balneários, a vistoria técnica da FAF confirmou que o recinto reúne todos os requisitos regulamentares, trazendo grande alento aos adeptos militares que poderão apoiar a equipa no seu reduto principal.'
  },
  {
    id: 'n6',
    title: 'FAF anuncia sorteio do calendário oficial para o Liga Unitel Girabola 2026/2027',
    category: 'Federação',
    date: '20 Jun 2026',
    summary: 'O sorteio oficial definiu as 30 jornadas da nova época desportiva, sob o novo código de verificação unificado.',
    content: 'A Federação Angolana de Futebol (FAF) realizou o sorteio da nova edição do campeonato nacional no edifício-sede em Luanda. O sorteio estabeleceu um calendário emocionante a duas voltas para as 16 equipas concorrentes. Os jogos terão início a 12 de Setembro de 2026, com o Petro de Luanda a iniciar a defesa do título em casa contra o Desportivo da Lunda Sul.'
  }
];

// ── 7. FUNÇÕES AUXILIARES DE BUSCA ─────────────────────────────────
export function getTeams(): Team[] {
  return TEAMS;
}

// Inclui os clubes promovidos de 2026/2027 (motor ANCAF) para que páginas de
// clube e detalhes de jogo da nova época resolvam corretamente.
export const ALL_TEAMS: Team[] = [...TEAMS, ...PROMOTED_2026_27_TEAMS];

export function getTeamById(id: string): Team | undefined {
  return ALL_TEAMS.find(t => t.id === id);
}

export function getStandings(): StandingEntry[] {
  return STANDINGS;
}

export function getStandingByTeamId(teamId: string): StandingEntry | undefined {
  return STANDINGS.find(s => s.teamId === teamId);
}

export function getMatches(): Match[] {
  return MATCHES;
}

// Calendário por época — 2026/2027 corresponde ao ficheiro do ANCAF_CALENDAR.
export function getMatchesForSeason(seasonId: string): Match[] {
  return seasonId === UPCOMING_SEASON_ID ? MATCHES_2026_27 : MATCHES;
}

export function getMatchesByTeam(teamId: string): Match[] {
  return MATCHES.filter(m => m.homeTeamId === teamId || m.awayTeamId === teamId);
}

export function getPlayers(): Player[] {
  return PLAYERS;
}

export function getPlayersByTeam(teamId: string): Player[] {
  return PLAYERS.filter(p => p.teamId === teamId);
}

export function getPlayerById(id: string): Player | undefined {
  return PLAYERS.find(p => p.id === id);
}

// Bandeira (emoji) por nacionalidade — para a ficha de identidade.
const NATIONALITY_FLAGS: Record<string, string> = {
  'Angola': '🇦🇴',
  'RD Congo': '🇨🇩',
  'RDC': '🇨🇩',
  'Congo': '🇨🇬',
  'Brasil': '🇧🇷',
  'Portugal': '🇵🇹',
  'Nigéria': '🇳🇬',
  'Camarões': '🇨🇲',
  'Gana': '🇬🇭',
  'Costa do Marfim': '🇨🇮',
  'Guiné-Bissau': '🇬🇼',
  'Cabo Verde': '🇨🇻',
  'São Tomé e Príncipe': '🇸🇹',
  'Moçambique': '🇲🇿',
  'França': '🇫🇷',
  'Argentina': '🇦🇷',
};

export function getNationalityFlag(nationality: string): string {
  return NATIONALITY_FLAGS[nationality] ?? '🏳️';
}

// Ficha de identidade consolidada, com fallbacks sensatos
// quando um campo opcional não está preenchido.
export interface PlayerFicha {
  fullName: string;
  position: string;
  nationality: string;
  flag: string;
  age: number;
  birthDate?: string;
  birthplace?: string;
  height: string;
  weight?: string;
  preferredFoot?: string;
  jerseyNumber: number;
  club: string;
}

export function getPlayerFicha(player: Player): PlayerFicha {
  return {
    fullName: player.fullName ?? player.name,
    position: player.position,
    nationality: player.nationality,
    flag: getNationalityFlag(player.nationality),
    age: player.age,
    birthDate: player.birthDate,
    birthplace: player.birthplace,
    height: player.height,
    weight: player.weight,
    preferredFoot: player.preferredFoot,
    jerseyNumber: player.jerseyNumber,
    club: player.club,
  };
}

export function getMatchById(id: string): Match | undefined {
  return MATCHES.find(m => m.id === id) ?? MATCHES_2026_27.find(m => m.id === id);
}

export function getTopScorers(): PlayerStats[] {
  return TOP_SCORERS;
}

export function getTopAssists(): PlayerStats[] {
  return TOP_ASSISTS;
}

export function getNewsArticles(): NewsArticle[] {
  return newsMock;
}

export function getNewsArticleById(id: string): NewsArticle | undefined {
  return newsMock.find(n => n.id === id);
}

// ── ESTATÍSTICAS EXTERNAS & FIFA CONNECT (DERIVADAS DETERMINISTICAMENTE) ──
// NOTA: Todos os valores abaixo são SIMULADOS para fins de demonstração.
// Derivam dos atributos do jogador para serem estáveis e consistentes entre
// recarregamentos. Não provêm de scraping nem de APIs oficiais.

const hashString = simpleHash;

function avgAttributes(p: Player): number {
  const a = p.attributes;
  return (a.pace + a.shooting + a.passing + a.dribbling + a.defending + a.physical) / 6;
}

// Rating base 0–10 derivado da média de atributos e do impacto ofensivo.
function baseRating(p: Player): number {
  const attrScore = avgAttributes(p) / 99; // 0–1
  const impact = (p.goals + p.assists) / Math.max(p.appearances, 1); // golos+assists por jogo
  const raw = 6.0 + attrScore * 2.6 + Math.min(impact, 1.2) * 1.0;
  return Math.min(Math.max(raw, 5.5), 9.8);
}

export function getPlayerRatings(p: Player): ExternalRatings {
  const base = baseRating(p);
  const jitter = (hashString(p.id) % 30) / 100; // 0.00–0.29
  const technical = Math.min(Math.round((base + jitter) * 10) / 10, 10);
  const form = Math.min(Math.round((base - 0.15 + jitter / 2) * 10) / 10, 10);
  return {
    technical,
    form,
  };
}

// Tendência dos últimos 5 jogos (do mais antigo para o mais recente).
export function getRecentRatings(p: Player): { match: string; rating: number }[] {
  const base = baseRating(p);
  const seed = hashString(p.id);
  return Array.from({ length: 5 }, (_, i) => {
    const delta = (((seed >> (i * 2)) % 13) - 6) / 10; // -0.6 a +0.6
    const rating = Math.min(Math.max(Math.round((base + delta) * 10) / 10, 5.0), 9.9);
    return { match: `J${i + 1}`, rating };
  });
}

export function getDetailedMetrics(p: Player): DetailedMetrics {
  const a = p.attributes;
  const seed = hashString(p.id);
  return {
    passAccuracy: Math.min(60 + Math.round(a.passing * 0.35) + (seed % 5), 99),
    duelsWon: Math.min(35 + Math.round(a.physical * 0.4) + (seed % 7), 90),
    shotsOnTarget: Math.min(30 + Math.round(a.shooting * 0.4) + (seed % 6), 85),
    yellowCards: seed % 6,
    redCards: seed % 11 === 0 ? 1 : 0,
    minutesPlayed: p.appearances * 90 - (seed % p.appearances || 0) * 12,
  };
}

export function getFifaConnectStatus(p: Player): FifaConnectStatus {
  // Estado inicial determinístico: a maioria com pendências para o simulador.
  const seed = hashString(p.id);
  return {
    status: 'pending',
    checks: {
      identity: true,
      contract: seed % 2 === 0,
      itc: seed % 3 === 0,
      insurance: seed % 5 !== 0,
    },
  };
}

// ── FIFA CONNECT — METADADOS E REGISTOS (ÁREA ADMINISTRATIVA) ──────────
// Etiquetas centralizadas dos requisitos de conformidade FIFA Connect.
export const FIFA_CHECK_META: { key: FifaCheckKey; label: string }[] = [
  { key: 'identity', label: 'Verificação de Identidade' },
  { key: 'contract', label: 'Contrato Registado' },
  { key: 'itc', label: 'Certificado ITC' },
  { key: 'insurance', label: 'Seguro Desportivo' },
];

export interface FifaConnectRecord {
  player: Player;
  status: FifaConnectStatus;
  eligible: boolean; // todos os requisitos cumpridos
}

// Lista completa de jogadores com o respetivo estado FIFA Connect (uso administrativo).
export function getPlayerFifaRecords(): FifaConnectRecord[] {
  return PLAYERS.map((player) => {
    const status = getFifaConnectStatus(player);
    const eligible = FIFA_CHECK_META.every((c) => status.checks[c.key]);
    return { player, status, eligible };
  });
}

// ── DETALHE DE JOGO (ESTATÍSTICAS, ESCALAÇÕES E EVENTOS — DERIVADOS) ──
// NOTA: Todos os dados de detalhe de jogo são SIMULADOS, gerados de forma
// determinística a partir do id e do resultado do jogo. Escalações combinam
// jogadores reais do plantel (com link) e jogadores gerados para completar 11.

export type PitchPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface MatchTeamStats {
  possession: number;       // %
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
  offsides: number;
  yellowCards: number;
  redCards: number;
  passes: number;
  passAccuracy: number;     // %
  saves: number;
}

export interface LineupPlayer {
  name: string;
  playerId?: string;        // presente apenas se for jogador real
  number: number;
  position: PitchPosition;
  rating: number;           // 0–10
  isStarter: boolean;
}

export interface MatchEventDetail {
  minute: number;
  type: 'goal' | 'yellow' | 'red' | 'sub';
  team: 'home' | 'away';
  player: string;
  playerId?: string;
  assist?: string;
  playerOut?: string;       // para substituições
  detail?: string;          // ex.: 'Grande penalidade'
}

export interface MatchDetail {
  match: Match;
  homeStats: MatchTeamStats;
  awayStats: MatchTeamStats;
  homeLineup: LineupPlayer[];
  awayLineup: LineupPlayer[];
  formationHome: string;
  formationAway: string;
  events: MatchEventDetail[];
  attendance: number;
  referee: string;
  manOfTheMatch: { name: string; playerId?: string; rating: number; team: 'home' | 'away' };
}

const SQUAD_FIRST = ['Manuel', 'João', 'Pedro', 'Alberto', 'Geraldo', 'Mateus', 'Domingos', 'Carlos', 'Bruno', 'Hélder', 'Nuno', 'Ivo', 'Cláudio', 'Wilson', 'Fredy', 'Gilberto', 'Yuri', 'Dani', 'Zito', 'Job', 'Edmilson', 'Buatu', 'Picas', 'Bastos'];
const SQUAD_LAST = ['Cabungula', 'Capita', 'Buá', 'Catraio', 'Mavinga', 'Manucho', 'Bero', 'Lamá', 'Quinito', 'Bokila', 'Kialonda', 'Afonso', 'Nzola', 'Caboco', 'Wilá', 'Fabrício', 'Massunguna', 'Ginga', 'Depú', 'Isaac', 'Gelson', 'Tó Carneiro', 'Macaia', 'Bambi'];
const REFEREES = ['Hélder Malembe', 'António Caetano', 'José Ndala', 'Olímpio Capassassa', 'Bruno Quissanga', 'Edgar Sousa', 'Telmo Domingos'];
const ASSISTANT_REFEREES = ['Jerson Emiliano', 'Marcos dos Santos', 'Ivo Manuel', 'Paulino Kassoma', 'Délcio Cahanda', 'Fernando Muhongo', 'Adolfo Simão', 'Nelson Ephemba'];
export const BROADCASTERS = ['TPA 1', 'TPA 2', 'ZAP Viva', 'DStv LigaTV', 'Rádio Nacional de Angola'];

function seededInt(seed: number, salt: number, min: number, max: number): number {
  const x = Math.abs(Math.sin(seed * 374761 + salt * 99991) * 43758.5453);
  return min + Math.floor((x - Math.floor(x)) * (max - min + 1));
}

function mapPitchPosition(p: string): PitchPosition {
  const s = p.toLowerCase();
  if (s.includes('guarda')) return 'GK';
  if (s.includes('defesa') || s.includes('lateral') || s.includes('central')) return 'DEF';
  if (s.includes('médio') || s.includes('medio')) return 'MID';
  return 'FWD';
}

// Estrutura 4-3-3: titulares + suplentes (1 GK, 2 DEF, 2 MID, 2 FWD)
const STARTER_SLOTS: PitchPosition[] = ['GK', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'FWD', 'FWD', 'FWD'];
const SUB_SLOTS: PitchPosition[] = ['GK', 'DEF', 'DEF', 'MID', 'MID', 'FWD', 'FWD'];

function buildLineup(teamId: string, seed: number): LineupPlayer[] {
  const real = getPlayersByTeam(teamId);
  const realByPos: Record<PitchPosition, Player[]> = { GK: [], DEF: [], MID: [], FWD: [] };
  real.forEach(p => realByPos[mapPitchPosition(p.position)].push(p));

  const usedNumbers = new Set<number>();
  const lineup: LineupPlayer[] = [];
  const slots = [...STARTER_SLOTS.map(s => ({ pos: s, starter: true })), ...SUB_SLOTS.map(s => ({ pos: s, starter: false }))];

  slots.forEach((slot, idx) => {
    const realPick = realByPos[slot.pos].shift();
    if (realPick) {
      let num = realPick.jerseyNumber;
      while (usedNumbers.has(num)) num++;
      usedNumbers.add(num);
      const r = baseRating(realPick) + (seededInt(seed, idx + 50, -4, 6) / 10);
      lineup.push({
        name: realPick.name,
        playerId: realPick.id,
        number: num,
        position: slot.pos,
        rating: Math.min(Math.max(Math.round(r * 10) / 10, 5.5), 9.5),
        isStarter: slot.starter,
      });
    } else {
      const fn = SQUAD_FIRST[seededInt(seed, idx * 7 + 1, 0, SQUAD_FIRST.length - 1)];
      const ln = SQUAD_LAST[seededInt(seed, idx * 13 + 3, 0, SQUAD_LAST.length - 1)];
      let num = seededInt(seed, idx * 3 + 2, 1, 30);
      while (usedNumbers.has(num)) num = (num % 30) + 1;
      usedNumbers.add(num);
      const base = slot.starter ? 6.2 : 5.9;
      lineup.push({
        name: `${fn} ${ln}`,
        number: num,
        position: slot.pos,
        rating: Math.round((base + seededInt(seed, idx + 200, 0, 14) / 10) * 10) / 10,
        isStarter: slot.starter,
      });
    }
  });

  return lineup;
}

function buildTeamStats(seed: number, goalsFor: number, goalsAgainst: number, possession: number): MatchTeamStats {
  const shotsOnTarget = Math.max(goalsFor, goalsFor + seededInt(seed, 11, 1, 4));
  const shots = shotsOnTarget + seededInt(seed, 12, 3, 9);
  return {
    possession,
    shots,
    shotsOnTarget,
    corners: seededInt(seed, 13, 2, 9),
    fouls: seededInt(seed, 14, 7, 17),
    offsides: seededInt(seed, 15, 0, 5),
    yellowCards: seededInt(seed, 16, 1, 4),
    redCards: seededInt(seed, 17, 0, 12) === 0 ? 1 : 0,
    passes: 280 + Math.round(possession * seededInt(seed, 18, 4, 7)),
    passAccuracy: seededInt(seed, 19, 70, 90),
    saves: Math.max(0, seededInt(seed, 20, 1, 5)),
  };
}

function pickScorers(lineup: LineupPlayer[], count: number, seed: number, salt: number): LineupPlayer[] {
  if (count <= 0) return [];
  const candidates = lineup.filter(p => p.isStarter && p.position !== 'GK')
    .sort((a, b) => {
      const wa = a.position === 'FWD' ? 3 : a.position === 'MID' ? 2 : 1;
      const wb = b.position === 'FWD' ? 3 : b.position === 'MID' ? 2 : 1;
      return wb - wa;
    });
  const out: LineupPlayer[] = [];
  for (let i = 0; i < count; i++) {
    const idx = seededInt(seed, salt + i, 0, Math.min(candidates.length - 1, 4));
    out.push(candidates[idx] || candidates[0]);
  }
  return out;
}

export function getMatchDetail(match: Match): MatchDetail {
  const seed = hashString(match.id);
  const homeLineup = buildLineup(match.homeTeamId, seed);
  const awayLineup = buildLineup(match.awayTeamId, seed + 7);

  const possessionHome = seededInt(seed, 1, 40, 62);
  const homeStats = buildTeamStats(seed, match.homeScore, match.awayScore, possessionHome);
  const awayStats = buildTeamStats(seed + 31, match.awayScore, match.homeScore, 100 - possessionHome);
  // Coerência das defesas: defesas do GR = remates à baliza do adversário - golos sofridos
  homeStats.saves = Math.max(0, awayStats.shotsOnTarget - match.awayScore);
  awayStats.saves = Math.max(0, homeStats.shotsOnTarget - match.homeScore);

  const events: MatchEventDetail[] = [];

  if (match.status === 'finished') {
    // Golos
    const homeScorers = pickScorers(homeLineup, match.homeScore, seed, 100);
    const awayScorers = pickScorers(awayLineup, match.awayScore, seed, 200);
    homeScorers.forEach((s, i) => {
      const isPen = seededInt(seed, 300 + i, 0, 6) === 0;
      events.push({
        minute: seededInt(seed, 310 + i, 3, 89),
        type: 'goal', team: 'home', player: s.name, playerId: s.playerId,
        detail: isPen ? 'Grande penalidade' : undefined,
      });
      s.rating = Math.min(s.rating + 0.6, 9.9);
    });
    awayScorers.forEach((s, i) => {
      const isPen = seededInt(seed, 400 + i, 0, 6) === 0;
      events.push({
        minute: seededInt(seed, 410 + i, 3, 89),
        type: 'goal', team: 'away', player: s.name, playerId: s.playerId,
        detail: isPen ? 'Grande penalidade' : undefined,
      });
      s.rating = Math.min(s.rating + 0.6, 9.9);
    });

    // Cartões amarelos (mostra até 2 por equipa)
    const homeYellow = pickScorers(homeLineup, Math.min(homeStats.yellowCards, 2), seed, 500);
    homeYellow.forEach((p, i) => events.push({ minute: seededInt(seed, 510 + i, 20, 88), type: 'yellow', team: 'home', player: p.name, playerId: p.playerId }));
    const awayYellow = pickScorers(awayLineup, Math.min(awayStats.yellowCards, 2), seed, 600);
    awayYellow.forEach((p, i) => events.push({ minute: seededInt(seed, 610 + i, 20, 88), type: 'yellow', team: 'away', player: p.name, playerId: p.playerId }));

    // Substituições (2 por equipa)
    const homeSubsIn = homeLineup.filter(p => !p.isStarter).slice(0, 2);
    const homeSubsOut = homeLineup.filter(p => p.isStarter && p.position !== 'GK').slice(-2);
    homeSubsIn.forEach((p, i) => events.push({ minute: seededInt(seed, 710 + i, 55, 85), type: 'sub', team: 'home', player: p.name, playerId: p.playerId, playerOut: homeSubsOut[i]?.name }));
    const awaySubsIn = awayLineup.filter(p => !p.isStarter).slice(0, 2);
    const awaySubsOut = awayLineup.filter(p => p.isStarter && p.position !== 'GK').slice(-2);
    awaySubsIn.forEach((p, i) => events.push({ minute: seededInt(seed, 810 + i, 55, 85), type: 'sub', team: 'away', player: p.name, playerId: p.playerId, playerOut: awaySubsOut[i]?.name }));
  }

  events.sort((a, b) => a.minute - b.minute);

  const allStarters = [...homeLineup.filter(p => p.isStarter).map(p => ({ ...p, team: 'home' as const })), ...awayLineup.filter(p => p.isStarter).map(p => ({ ...p, team: 'away' as const }))];
  const motmSrc = allStarters.sort((a, b) => b.rating - a.rating)[0];
  const manOfTheMatch = { name: motmSrc.name, playerId: motmSrc.playerId, rating: motmSrc.rating, team: motmSrc.team };

  const capacity = TEAMS.find(t => t.id === match.homeTeamId)?.stadiumCapacity ?? 10000;

  return {
    match,
    homeStats,
    awayStats,
    homeLineup,
    awayLineup,
    formationHome: '4-3-3',
    formationAway: '4-3-3',
    events,
    attendance: match.attendance ?? (match.status === 'finished' ? Math.round(capacity * (seededInt(seed, 2, 55, 95) / 100)) : 0),
    referee: match.referee ?? getMatchOfficials(match).referee,
    manOfTheMatch,
  };
}

// ── FICHA DE JOGO: ARBITRAGEM, TRANSMISSÃO E TEMPO ÚTIL (DERIVADOS) ──
// Helpers partilhados entre cartões de jogo, ficha de jogo e abas do hub de
// competição, para que os mesmos dados apareçam de forma consistente em todo
// o site. Valores da BD (Match.referee/broadcaster) têm sempre prioridade.

export interface MatchOfficials {
  referee: string;
  assistants: [string, string];
  fourth: string;
}

export function getMatchOfficials(match: Match): MatchOfficials {
  const seed = hashString(match.id);
  // salt 3 mantém compatibilidade com o árbitro histórico de getMatchDetail
  const referee = match.referee ?? REFEREES[seededInt(seed, 3, 0, REFEREES.length - 1)];
  const a1 = ASSISTANT_REFEREES[seededInt(seed, 31, 0, ASSISTANT_REFEREES.length - 1)];
  let a2Idx = seededInt(seed, 32, 0, ASSISTANT_REFEREES.length - 1);
  if (ASSISTANT_REFEREES[a2Idx] === a1) a2Idx = (a2Idx + 1) % ASSISTANT_REFEREES.length;
  const fourth = REFEREES[(seededInt(seed, 33, 0, REFEREES.length - 1) + 1) % REFEREES.length];
  return { referee, assistants: [a1, ASSISTANT_REFEREES[a2Idx]], fourth };
}

export function getMatchBroadcast(match: Match): string {
  if (match.broadcaster) return match.broadcaster;
  const seed = hashString(match.id);
  return BROADCASTERS[seededInt(seed, 41, 0, BROADCASTERS.length - 1)];
}

// Tempo útil (tempo efetivo de jogo, em minutos) — métrica-assinatura da
// Liga Angola adaptada ao Girabola. Derivado do jogo: mais golos tendem a
// significar mais tempo de bola corrida; jogos faltosos reduzem o valor.
export function getMatchTempoUtil(match: Match): number | null {
  if (match.status !== 'finished') return null;
  const seed = hashString(match.id);
  const base = seededInt(seed, 42, 46, 58);
  const goalBonus = Math.min(match.homeScore + match.awayScore, 5);
  const foulPenalty = seededInt(seed, 43, 0, 4);
  return Math.min(Math.max(base + goalBonus - foulPenalty, 41), 66);
}

// ── NOMEAÇÕES DE ÁRBITROS POR JORNADA (estilo Liga Angola) ─────────
export interface RefereeNomination {
  matchId: string;
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  officials: MatchOfficials;
}

export function getRefereeNominations(seasonId: string): RefereeNomination[] {
  return getMatchesForSeason(seasonId).map((m) => ({
    matchId: m.id,
    round: m.round,
    homeTeamId: m.homeTeamId,
    awayTeamId: m.awayTeamId,
    homeTeam: m.homeTeam,
    awayTeam: m.awayTeam,
    date: m.date,
    officials: getMatchOfficials(m),
  }));
}

// ── PERFIL INSTITUCIONAL DO CLUBE (estilo Liga Angola) ─────────────
// Dados de apresentação do clube: denominação oficial, palmarés,
// equipamentos e órgãos sociais. Valores demonstrativos, editáveis na
// área administrativa (ancaf_teams) quando persistidos na BD.

export interface TrophyEntry {
  title: string;
  count: number;
  seasons?: string[]; // épocas de destaque (mais recentes primeiro)
}

export interface KitEntry {
  label: string;      // Principal, Alternativo…
  colors: string[];   // cores hex do equipamento
}

export interface BoardMember {
  role: string;       // ex.: Presidente, Vice-presidente, Diretor Desportivo
  name: string;
}

export interface TeamProfile {
  officialName: string;
  president?: string;
  palmares: TrophyEntry[];
  kits: KitEntry[];
  board: BoardMember[]; // órgãos sociais / direção
  socials: { facebook?: string; instagram?: string; youtube?: string };
  website?: string;
  mapUrl: string; // link Google Maps do estádio
}

const TEAM_PROFILE_OVERRIDES: Record<string, Partial<TeamProfile>> = {
  petro: {
    officialName: 'Atlético Petróleos de Luanda — Futebol',
    president: 'Tomás Faria',
    website: 'https://petroatletico.co.ao/',
    socials: {
      facebook: 'https://www.facebook.com/atleticopetroleosluanda',
      instagram: 'https://www.instagram.com/petro_de_luanda_oficial/',
      youtube: 'https://www.youtube.com/@petrodeluandaoficial',
    },
    palmares: [
      { title: 'Liga Unitel Girabola', count: 19, seasons: ['2025/26', '2023/24', '2022/23'] },
      { title: 'Taça de Angola', count: 12 },
      { title: 'Supertaça de Angola', count: 8 },
    ],
    board: [
      { role: 'Presidente', name: 'Tomás Faria' },
      { role: 'Vice-presidente', name: 'Nuno Saraiva' },
      { role: 'Diretor Desportivo', name: 'Love Kabungula' },
    ],
  },
  dago: {
    officialName: 'Clube Desportivo 1.º de Agosto — Futebol',
    president: 'Carlos Hendrick',
    website: 'https://www.1agosto.com/',
    socials: {
      facebook: 'https://www.facebook.com/clube1deagosto/',
      instagram: 'https://www.instagram.com/clube1deagosto/',
    },
    palmares: [
      { title: 'Liga Unitel Girabola', count: 13, seasons: ['2018/19', '2017/18', '2016/17'] },
      { title: 'Taça de Angola', count: 6 },
      { title: 'Supertaça de Angola', count: 7 },
    ],
    board: [
      { role: 'Presidente', name: 'Carlos Hendrick' },
      { role: 'Vice-presidente', name: 'Adilson Kiala' },
      { role: 'Diretor Desportivo', name: 'Beto Almeida' },
    ],
  },
  sagrada: {
    officialName: 'Clube Desportivo Sagrada Esperança — Futebol',
    website: 'https://gdse.ao/',
    socials: {
      facebook: 'https://www.facebook.com/sagradaesperancaln/',
      instagram: 'https://www.instagram.com/cdsagradaesperanca/',
    },
    palmares: [
      { title: 'Liga Unitel Girabola', count: 1, seasons: ['2004/05'] },
      { title: 'Taça de Angola', count: 2 },
    ],
  },
  interclube: {
    officialName: 'Grupo Desportivo Interclube — Futebol',
    website: 'http://interclube.co.ao/',
    socials: {
      facebook: 'https://www.facebook.com/InterclubeAngolaGDI/',
      instagram: 'https://www.instagram.com/interclube_angola/',
    },
    palmares: [
      { title: 'Taça de Angola', count: 3 },
      { title: 'Supertaça de Angola', count: 1 },
    ],
  },
  libolo: {
    officialName: 'Clube Recreativo e Desportivo do Libolo — Futebol',
    socials: {
      facebook: 'https://www.facebook.com/recreativo.libolo/',
      instagram: 'https://www.instagram.com/recreativo.libolo/',
    },
    palmares: [
      { title: 'Liga Unitel Girabola', count: 4, seasons: ['2015/16', '2014/15', '2012/13'] },
      { title: 'Taça de Angola', count: 2 },
    ],
  },
  wiliete: {
    officialName: 'Wiliete Sport Clube de Benguela — Futebol',
    website: 'https://wilietesc.ao/',
    socials: {
      facebook: 'https://www.facebook.com/wscbenguela/',
      instagram: 'https://www.instagram.com/wilietesportclubeoficial/',
    },
    palmares: [
      { title: 'Gira Bola B (2.ª Divisão)', count: 1, seasons: ['2021/22'] },
    ],
  },
  bravos: {
    officialName: 'Clube Desportivo Bravos do Maquis — Futebol',
    website: 'https://bravosdomaquis.co.ao/',
    socials: {
      facebook: 'https://www.facebook.com/p/Bravos-do-Maquis-do-Moxico-100095414350444/',
      instagram: 'https://www.instagram.com/bravosdomaquis/',
    },
    palmares: [
      { title: 'Taça de Angola', count: 1, seasons: ['2019/20'] },
    ],
  },
  desphuila: {
    officialName: 'Clube Desportivo da Huíla — Futebol',
    socials: {
      facebook: 'https://www.facebook.com/CDhuila/',
      instagram: 'https://www.instagram.com/clubedesportivodahuila_/',
    },
  },
  kabuscorp: {
    officialName: 'Kabuscorp Sport Clube do Palanca — Futebol',
    socials: {
      facebook: 'https://www.facebook.com/kabuscorpscp',
      instagram: 'https://www.instagram.com/kabuscorp_sport_clube/',
    },
  },
  lundasul: {
    officialName: 'Clube Desportivo da Lunda Sul — Futebol',
    socials: {
      facebook: 'https://www.facebook.com/p/Clube-Desportivo-Da-Lunda-Sul-100077348542835/',
      instagram: 'https://www.instagram.com/clubedesportivodalundasul/',
    },
  },
  lobito: {
    officialName: 'Académica Petróleos Clube do Lobito — Futebol',
    socials: {
      facebook: 'https://www.facebook.com/academicadolobito/',
      instagram: 'https://www.instagram.com/academicadolobito/',
    },
  },
  saosalvador: {
    officialName: 'São Salvador do Kongo Futebol Clube — Futebol',
    socials: {
      facebook: 'https://www.facebook.com/saosalvadordokongo',
      instagram: 'https://www.instagram.com/cdsaosalvador/',
    },
  },
  caala: {
    officialName: 'Clube Recreativo da Caála — Futebol',
    socials: {
      facebook: 'https://www.facebook.com/ClubeRecreativodaCaala',
    },
  },
  cabinda: {
    officialName: 'Futebol Clube de Cabinda — Futebol',
    website: 'https://fccabinda.com/',
    socials: {
      facebook: 'https://www.facebook.com/fccabinda',
      instagram: 'https://www.instagram.com/fccabinda',
    },
  },
  primeiromaio: {
    officialName: 'Estrela Clube Primeiro de Maio — Futebol',
    socials: {
      facebook: 'https://www.facebook.com/EstrelaClub1oDeMaioDeBenguela',
    },
  },
  fcluanda: {
    officialName: 'Futebol Clube de Luanda — Futebol',
    socials: {
      facebook: 'https://www.facebook.com/923669860835536',
      instagram: 'https://www.instagram.com/fcluanda_oficial/',
    },
  },
};

export function getTeamProfile(teamId: string): TeamProfile | undefined {
  const team = getTeamById(teamId);
  if (!team) return undefined;
  const kitColors = team.colorsHex && team.colorsHex.length > 0 ? team.colorsHex : ['#5C0F8B', '#E6540F'];
  const defaults: TeamProfile = {
    officialName: team.officialName ?? team.name,
    president: team.president,
    palmares: [],
    kits: [
      { label: 'Principal', colors: kitColors },
      { label: 'Alternativo', colors: [...kitColors].reverse() },
    ],
    board: team.president ? [{ role: 'Presidente', name: team.president }] : [],
    socials: {},
    website: team.website,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${team.stadium}, ${team.city}, Angola`)}`,
  };
  const override = TEAM_PROFILE_OVERRIDES[teamId];
  const profile = override
    ? { ...defaults, ...override, kits: override.kits ?? defaults.kits, board: override.board ?? defaults.board, socials: { ...defaults.socials, ...override.socials } }
    : defaults;
  // Campos editados no admin/BD (guardados no próprio Team) têm prioridade
  // sobre os valores curados em TEAM_PROFILE_OVERRIDES.
  if (team.officialName) profile.officialName = team.officialName;
  if (team.president) {
    profile.president = team.president;
    // Mantém o presidente da direção sincronizado com o valor editado.
    const hasPresident = profile.board.some((m) => m.role === 'Presidente');
    profile.board = hasPresident
      ? profile.board.map((m) => (m.role === 'Presidente' ? { ...m, name: team.president! } : m))
      : [{ role: 'Presidente', name: team.president }, ...profile.board];
  }
  if (team.website) profile.website = team.website;
  if (team.palmares) profile.palmares = team.palmares;
  if (team.kits && team.kits.length > 0) profile.kits = team.kits;
  if (team.board) profile.board = team.board;
  return profile;
}

export interface VideoHighlight {
  id: string;
  title: string;
  duration: string;
  views: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  isLive?: boolean;
}

export const videoHighlightsMock: VideoHighlight[] = [
  {
    id: 'live-1',
    title: 'LIGA UNITEL GIRABOLA 2025/26: Petro de Luanda vs 1º de Agosto [DIRECTO]',
    duration: 'LIVE',
    views: '12.4K a assistir',
    category: 'Transmissão Oficial',
    thumbnail: '/fields/hud-view.jpg',
    videoUrl: 'https://www.youtube.com/embed/59J6pB1Q1Fk?autoplay=1',
    isLive: true,
  },
  {
    id: 'v1',
    title: 'Resumo: Kabuscorp vs Sagrada Esperança (2-0)',
    duration: '08:24',
    views: '4.2K visualizações',
    category: 'Resumos',
    thumbnail: '/thumbs/resumo1.jpg',
    videoUrl: 'https://www.youtube.com/embed/p17iPqNlM1w?autoplay=1'
  },
  {
    id: 'v2',
    title: 'Entrevista: Tiago Azulão analisa o hat-trick histórico',
    duration: '05:12',
    views: '2.8K visualizações',
    category: 'Entrevistas',
    thumbnail: '/thumbs/entrevista1.jpg',
    videoUrl: 'https://www.youtube.com/embed/xSdtVv0m4eQ?autoplay=1'
  },
  {
    id: 'v3',
    title: 'Melhores Momentos da 11ª Jornada - Golos do Mês',
    duration: '12:40',
    views: '9.1K visualizações',
    category: 'Compilações',
    thumbnail: '/thumbs/golos.jpg',
    videoUrl: 'https://www.youtube.com/embed/a7Sg-x3gB6o?autoplay=1'
  },
];

export function getVideoHighlights(): VideoHighlight[] {
  return videoHighlightsMock;
}
