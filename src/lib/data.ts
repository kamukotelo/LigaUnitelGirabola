// Data layer for Girabola 2025/2026 Football Portal

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  city: string;
  stadium: string;
  stadiumCapacity: number;
  founded: number;
  colors: string;
  coach: string;
  colorsHex?: string[]; // E.g. ["#D21515", "#F9C304"] for custom page designs
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
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
  bio?: string;
  careerHistory?: {
    season: string;
    club: string;
    apps: number;
    goals: number;
  }[];
  sofascoreId?: string;
  sofascoreUrl?: string;
  sofascoreRating?: number;
  zerozeroId?: string;
  zerozeroUrl?: string;
  zerozeroRating?: number;
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
  sofascore: number;       // 0.0 – 10.0 (simulado)
  zerozero: number;        // 0.0 – 10.0 (simulado)
  sofascoreUrl: string;    // deep-link de pesquisa real
  zerozeroUrl: string;     // deep-link de pesquisa real
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
  { id: 'petro', name: 'Atlético Petróleos de Luanda', shortName: 'PET', city: 'Luanda', stadium: 'Estádio 11 de Novembro', stadiumCapacity: 50000, founded: 1980, colors: 'Amarelo, Azul e Vermelho', coach: 'Ricardo Chéu', colorsHex: ["#F9C304", "#00529B", "#D21515"] },
  { id: 'wiliete', name: 'Wiliete de Benguela FC', shortName: 'WILI', city: 'Benguela', stadium: 'Estádio Nacional de Ombaka', stadiumCapacity: 35000, founded: 2018, colors: 'Verde e Amarelo', coach: 'José Silvestre "Lito" Vidigal', colorsHex: ["#008751", "#F9C304"] },
  { id: 'dago', name: 'Clube Desportivo Primeiro de Agosto', shortName: 'AGO', city: 'Luanda', stadium: 'Estádio França Ndalu', stadiumCapacity: 20000, founded: 1977, colors: 'Vermelho e Preto', coach: 'Filipe Nzanza', colorsHex: ["#D21515", "#000000"] },
  { id: 'desphuila', name: 'Clube Desportivo da Huíla', shortName: 'CDH', city: 'Lubango', stadium: 'Estádio da Tundavala', stadiumCapacity: 20000, founded: 1998, colors: 'Vermelho e Branco', coach: 'Mário Soares', colorsHex: ["#D21515", "#FFFFFF"] },
  { id: 'bravos', name: 'Futebol Clube Bravos do Maquis', shortName: 'BMQ', city: 'Luena', stadium: 'Estádio Mundunduleno', stadiumCapacity: 4300, founded: 1983, colors: 'Azul e Branco', coach: 'Zeca Amaral', colorsHex: ["#00529B", "#FFFFFF"] },
  { id: 'kabuscorp', name: 'Kabuscorp Sport Clube do Palanca', shortName: 'KAB', city: 'Luanda', stadium: 'Estádio dos Coqueiros', stadiumCapacity: 12000, founded: 1994, colors: 'Vermelho e Branco', coach: 'Zeca Amaral', colorsHex: ["#D21515", "#FFFFFF"] },
  { id: 'sagrada', name: 'Grupo Desportivo Sagrada Esperança', shortName: 'SAG', city: 'Dundo', stadium: 'Estádio Sagrada Esperança', stadiumCapacity: 8000, founded: 1976, colors: 'Verde e Preto', coach: 'Francisco Moniz "Tusso"', colorsHex: ["#008751", "#000000"] },
  { id: 'interclube', name: 'Grupo Desportivo Interclube', shortName: 'INT', city: 'Luanda', stadium: 'Estádio 22 de Junho', stadiumCapacity: 8000, founded: 1976, colors: 'Azul e Branco', coach: 'Luís Gonçalves', colorsHex: ["#00529B", "#FFFFFF"] },
  { id: 'lundasul', name: 'Clube Desportivo da Lunda Sul', shortName: 'DLS', city: 'Saurimo', stadium: 'Estádio das Mangueiras', stadiumCapacity: 7000, founded: 2020, colors: 'Verde e Amarelo', coach: 'Maurício Marques', colorsHex: ["#008751", "#F9C304"] },
  { id: 'libolo', name: 'Clube Recreativo do Libolo', shortName: 'CRL', city: 'Calulo', stadium: 'Estádio Municipal de Calulo', stadiumCapacity: 10000, founded: 1942, colors: 'Laranja e Azul', coach: 'Hélder Teixeira', colorsHex: ["#FF6600", "#00529B"] },
  { id: 'lobito', name: 'Associação Académica do Lobito', shortName: 'ACA', city: 'Lobito', stadium: 'Estádio do Buraco', stadiumCapacity: 5000, founded: 1970, colors: 'Preto e Branco', coach: 'João Pintar', colorsHex: ["#000000", "#FFFFFF"] },
  { id: 'saosalvador', name: 'Clube Desportivo São Salvador do Kongo', shortName: 'SSK', city: 'Mbanza Kongo', stadium: 'Estádio Álvaro Buta', stadiumCapacity: 5000, founded: 1999, colors: 'Azul e Amarelo', coach: 'Findanga Finda', colorsHex: ["#00529B", "#F9C304"] },
  { id: 'luandacity', name: 'Luanda City FC', shortName: 'LCT', city: 'Luanda', stadium: 'Estádio dos Coqueiros', stadiumCapacity: 12000, founded: 2021, colors: 'Preto e Dourado', coach: 'Pedro Gonçalves', colorsHex: ["#000000", "#F9C304"] },
  { id: 'primeiromaio', name: 'Estrela Clube 1.º de Maio de Benguela', shortName: 'MAI', city: 'Benguela', stadium: 'Estádio Municipal do Lobito', stadiumCapacity: 5000, founded: 1981, colors: 'Vermelho e Branco', coach: 'Agostinho Tramagal', colorsHex: ["#D21515", "#FFFFFF"] },
  { id: 'redonda', name: 'Redonda FC', shortName: 'RED', city: 'Luanda', stadium: 'Estádio da Cidadela', stadiumCapacity: 60000, founded: 2015, colors: 'Azul e Vermelho', coach: 'Mateus Agostinho', colorsHex: ["#00529B", "#D21515"] },
  { id: 'guelson', name: 'Guelson FC', shortName: 'GUE', city: 'Luanda', stadium: 'Estádio dos Coqueiros', stadiumCapacity: 12000, founded: 2016, colors: 'Laranja e Preto', coach: 'Guelson Manuel', colorsHex: ["#FF6600", "#000000"] }
];

// ── 2. CLASSIFICAÇÃO GERAL ─────────────────────────────────────────
export const STANDINGS: StandingEntry[] = [
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
  { position: 13, teamId: 'luandacity', teamName: 'Luanda City', played: 30, won: 7, drawn: 8, lost: 15, goalsFor: 22, goalsAgainst: 39, goalDifference: -17, points: 29, form: ['L', 'W', 'L', 'L', 'D'] },
  { position: 14, teamId: 'primeiromaio', teamName: '1.º de Maio', played: 30, won: 6, drawn: 9, lost: 15, goalsFor: 24, goalsAgainst: 45, goalDifference: -21, points: 27, form: ['D', 'L', 'L', 'W', 'L'] },
  { position: 15, teamId: 'redonda', teamName: 'Redonda FC', played: 30, won: 5, drawn: 9, lost: 16, goalsFor: 21, goalsAgainst: 45, goalDifference: -24, points: 24, form: ['L', 'D', 'D', 'L', 'L'] },
  { position: 16, teamId: 'guelson', teamName: 'Guelson FC', played: 30, won: 4, drawn: 8, lost: 18, goalsFor: 18, goalsAgainst: 43, goalDifference: -25, points: 20, form: ['L', 'L', 'L', 'W', 'L'] }
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
  
  const homeRank = STANDINGS.find(s => s.teamId === homeId)?.position || 8;
  const awayRank = STANDINGS.find(s => s.teamId === awayId)?.position || 8;
  
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

      const status: 'finished' | 'scheduled' = round <= 20 ? 'finished' : 'scheduled';
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

      // Definir jornadas 16 a 20 como terminadas (feitas).
      // 21 a 28 como agendadas (não feitas).
      // 29 e 30 como concluídas (feitas).
      let status: 'finished' | 'scheduled' = 'scheduled';
      if (round <= 20 || round === 29 || round === 30) {
        status = 'finished';
      }

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
    { id: 'm-2903', round: 29, homeTeamId: 'wiliete', awayTeamId: 'interclube', homeTeam: 'Wiliete', awayTeam: 'Interclube', homeScore: 2, awayScore: 1, score: '2-1', date: '2026-05-03T16:00:00+01:00', stadium: 'Estádio Nacional de Ombaka', status: 'finished' as const },
    { id: 'm-2904', round: 29, homeTeamId: 'sagrada', awayTeamId: 'bravos', homeTeam: 'Sagrada Esperança', awayTeam: 'Bravos do Maquis', homeScore: 1, awayScore: 1, score: '1-1', date: '2026-05-03T15:00:00+01:00', stadium: 'Estádio Sagrada Esperança', status: 'finished' as const },
    { id: 'm-2905', round: 29, homeTeamId: 'libolo', awayTeamId: 'lobito', homeTeam: 'Recreativo do Libolo', awayTeam: 'Académica do Lobito', homeScore: 1, awayScore: 1, score: '1-1', date: '2026-05-03T15:00:00+01:00', stadium: 'Estádio Municipal de Calulo', status: 'finished' as const },
    { id: 'm-2906', round: 29, homeTeamId: 'saosalvador', awayTeamId: 'luandacity', homeTeam: 'São Salvador do Kongo', awayTeam: 'Luanda City', homeScore: 1, awayScore: 0, score: '1-0', date: '2026-05-03T15:00:00+01:00', stadium: 'Estádio Álvaro Buta', status: 'finished' as const },
    { id: 'm-2907', round: 29, homeTeamId: 'primeiromaio', awayTeamId: 'redonda', homeTeam: '1.º de Maio', awayTeam: 'Redonda FC', homeScore: 2, awayScore: 2, score: '2-2', date: '2026-05-02T15:30:00+01:00', stadium: 'Estádio Municipal do Lobito', status: 'finished' as const },
    { id: 'm-2908', round: 29, homeTeamId: 'guelson', awayTeamId: 'desphuila', homeTeam: 'Guelson FC', awayTeam: 'Desportivo da Huíla', homeScore: 0, awayScore: 2, score: '0-2', date: '2026-05-03T15:00:00+01:00', stadium: 'Estádio da Cidadela', status: 'finished' as const },
  ];

  const originalRound30 = [
    { id: 'm-3001', round: 30, homeTeamId: 'lundasul', awayTeamId: 'dago', homeTeam: 'Desportivo da Lunda Sul', awayTeam: '1.º de Agosto', homeScore: 1, awayScore: 2, score: '1-2', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio das Mangueiras', status: 'finished' as const },
    { id: 'm-3002', round: 30, homeTeamId: 'kabuscorp', awayTeamId: 'petro', homeTeam: 'Kabuscorp', awayTeam: 'Petro de Luanda', homeScore: 1, awayScore: 2, score: '1-2', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio dos Coqueiros', status: 'finished' as const },
    { id: 'm-3003', round: 30, homeTeamId: 'interclube', awayTeamId: 'wiliete', homeTeam: 'Interclube', awayTeam: 'Wiliete', homeScore: 0, awayScore: 2, score: '0-2', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio 22 de Junho', status: 'finished' as const },
    { id: 'm-3004', round: 30, homeTeamId: 'bravos', awayTeamId: 'sagrada', homeTeam: 'Bravos do Maquis', awayTeam: 'Sagrada Esperança', homeScore: 2, awayScore: 0, score: '2-0', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio Mundunduleno', status: 'finished' as const },
    { id: 'm-3005', round: 30, homeTeamId: 'lobito', awayTeamId: 'libolo', homeTeam: 'Académica do Lobito', awayTeam: 'Recreativo do Libolo', homeScore: 0, awayScore: 1, score: '0-1', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio do Buraco', status: 'finished' as const },
    { id: 'm-3006', round: 30, homeTeamId: 'luandacity', awayTeamId: 'saosalvador', homeTeam: 'Luanda City', awayTeam: 'São Salvador do Kongo', homeScore: 0, awayScore: 0, score: '0-0', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio dos Coqueiros', status: 'finished' as const },
    { id: 'm-3007', round: 30, homeTeamId: 'redonda', awayTeamId: 'primeiromaio', homeTeam: 'Redonda FC', awayTeam: '1.º de Maio', homeScore: 0, awayScore: 1, score: '0-1', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio da Cidadela', status: 'finished' as const },
    { id: 'm-3008', round: 30, homeTeamId: 'desphuila', awayTeamId: 'guelson', homeTeam: 'Desportivo da Huíla', awayTeam: 'Guelson FC', homeScore: 3, awayScore: 0, score: '3-0', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio da Tundavala', status: 'finished' as const },
  ];

  const filtered = generated.filter(m => m.round !== 29 && m.round !== 30);
  return [...filtered, ...originalRound29, ...originalRound30].sort((a, b) => {
    if (a.round !== b.round) return a.round - b.round;
    return a.id.localeCompare(b.id);
  });
}

export const MATCHES: Match[] = generateAllMatches();

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
    attributes: { pace: 87, shooting: 91, passing: 74, dribbling: 82, defending: 35, physical: 84 },
    bio: 'Ponta de lança forte, explosivo e extremamente clínico na área. Consagrado melhor marcador do Girabola 2025/2026, foi o pilar ofensivo do 1.º de Agosto na luta pelas competições africanas.',
    careerHistory: [
      { season: '2025/26', club: '1.º de Agosto', apps: 28, goals: 18 },
      { season: '2024/25', club: '1.º de Agosto', apps: 26, goals: 12 },
      { season: '2023/24', club: 'Daring Club Motema Pembe', apps: 22, goals: 15 }
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
    attributes: { pace: 72, shooting: 89, passing: 78, dribbling: 80, defending: 40, physical: 76 },
    bio: 'Uma lenda viva do futebol angolano. O veterano brasileiro Tiago Azulão continua a exibir faro de golo inigualável e liderança estelar, guiando o Petro de Luanda a mais um título nacional.',
    careerHistory: [
      { season: '2025/26', club: 'Petro de Luanda', apps: 24, goals: 13 },
      { season: '2024/25', club: 'Petro de Luanda', apps: 28, goals: 19 },
      { season: '2023/24', club: 'Petro de Luanda', apps: 27, goals: 21 }
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
    bio: 'O rei das assistências do Girabola. Jaredi exibe excelente criatividade, controlo em espaços curtos e passes cruzados milimétricos que serviram de munição constante para Tiago Azulão.',
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
  const sofascoreRating = parseFloat((7.1 + (hash % 13) * 0.1).toFixed(2));
  const zerozeroRating = parseFloat((sofascoreRating - 0.2 - (hash % 3) * 0.1).toFixed(2));

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
    parseFloat((sofascoreRating - 0.3 + (hash % 4) * 0.2).toFixed(2)),
    parseFloat((sofascoreRating - 0.1 + ((hash + 1) % 4) * 0.2).toFixed(2)),
    parseFloat((sofascoreRating - 0.4 + ((hash + 2) % 5) * 0.2).toFixed(2)),
    parseFloat((sofascoreRating + 0.2 - ((hash + 3) % 4) * 0.15).toFixed(2)),
    sofascoreRating
  ];

  return {
    ...p,
    sofascoreId: `sofa_${p.id}`,
    sofascoreUrl: `https://www.sofascore.com/pt/jogador/${p.id}/${10000 + (hash % 90000)}`,
    sofascoreRating,
    zerozeroId: `zz_${p.id}`,
    zerozeroUrl: `https://www.zerozero.pt/jogador.php?id=${20000 + (hash % 80000)}`,
    zerozeroRating,
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
    category: 'Girabola',
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
    content: 'Benguela está em festa. O Wiliete de Benguela bateu o Interclube por duas bolas a zero no Estádio Nacional de Ombaka e carimbou a sua vaga oficial na Liga dos Campeões da CAF da próxima época. Com golos de Mano Mano e Karanga, a formação dirigida por Lito Vidigal coroou uma campanha fenomenal no Girabola, consagrando-se como a grande surpresa do futebol nacional angolano.'
  },
  {
    id: 'n4',
    title: 'Dagó Tshibamba conquista Troféu de Melhor Marcador do Girabola',
    category: 'Individual',
    date: '10 Mai 2026',
    summary: 'O avançado congolês do 1.º de Agosto finalizou a temporada com 18 golos marcados, consagrando-se o principal goleador do futebol nacional angolano.',
    content: 'O troféu de artilheiro do futebol angolano tem novo dono. O avançado congolês Dagó Tshibamba fechou a época de ouro do 1.º de Agosto com 18 golos apontados na prova. Tshibamba demonstrou regularidade notável, sendo coroado oficialmente como o melhor marcador e grande estrela ofensiva do Girabola.'
  }
];

// ── 7. FUNÇÕES AUXILIARES DE BUSCA ─────────────────────────────────
export function getTeams(): Team[] {
  return TEAMS;
}

export function getTeamById(id: string): Team | undefined {
  return TEAMS.find(t => t.id === id);
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

export function getMatchById(id: string): Match | undefined {
  return MATCHES.find(m => m.id === id);
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

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

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
  const sofascore = Math.min(Math.round((base + jitter) * 10) / 10, 10);
  const zerozero = Math.min(Math.round((base - 0.15 + jitter / 2) * 10) / 10, 10);
  const query = encodeURIComponent(p.name);
  return {
    sofascore,
    zerozero,
    sofascoreUrl: `https://www.sofascore.com/search?q=${query}`,
    zerozeroUrl: `https://www.zerozero.pt/pesquisa.php?search=${query}`,
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
    attendance: match.status === 'finished' ? Math.round(capacity * (seededInt(seed, 2, 55, 95) / 100)) : 0,
    referee: REFEREES[seededInt(seed, 3, 0, REFEREES.length - 1)],
    manOfTheMatch,
  };
}
