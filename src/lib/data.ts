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

// ── 3. CALENDÁRIO E JOGOS ──────────────────────────────────────────
export const MATCHES: Match[] = [
  // Jornada 29
  { id: 'm-2901', round: 29, homeTeamId: 'petro', awayTeamId: 'lundasul', homeTeam: 'Petro de Luanda', awayTeam: 'Desportivo da Lunda Sul', homeScore: 3, awayScore: 0, score: '3-0', date: '2026-05-02T16:00:00+01:00', stadium: 'Estádio 11 de Novembro', status: 'finished' },
  { id: 'm-2902', round: 29, homeTeamId: 'dago', awayTeamId: 'kabuscorp', homeTeam: '1.º de Agosto', awayTeam: 'Kabuscorp', homeScore: 2, awayScore: 0, score: '2-0', date: '2026-05-02T15:30:00+01:00', stadium: 'Estádio França Ndalu', status: 'finished' },
  { id: 'm-2903', round: 29, homeTeamId: 'wiliete', awayTeamId: 'interclube', homeTeam: 'Wiliete', awayTeam: 'Interclube', homeScore: 2, awayScore: 1, score: '2-1', date: '2026-05-03T16:00:00+01:00', stadium: 'Estádio Nacional de Ombaka', status: 'finished' },
  { id: 'm-2904', round: 29, homeTeamId: 'sagrada', awayTeamId: 'bravos', homeTeam: 'Sagrada Esperança', awayTeam: 'Bravos do Maquis', homeScore: 1, awayScore: 1, score: '1-1', date: '2026-05-03T15:00:00+01:00', stadium: 'Estádio Sagrada Esperança', status: 'finished' },
  { id: 'm-2905', round: 29, homeTeamId: 'libolo', awayTeamId: 'lobito', homeTeam: 'Recreativo do Libolo', awayTeam: 'Académica do Lobito', homeScore: 1, awayScore: 1, score: '1-1', date: '2026-05-03T15:00:00+01:00', stadium: 'Estádio Municipal de Calulo', status: 'finished' },
  { id: 'm-2906', round: 29, homeTeamId: 'saosalvador', awayTeamId: 'luandacity', homeTeam: 'São Salvador do Kongo', awayTeam: 'Luanda City', homeScore: 1, awayScore: 0, score: '1-0', date: '2026-05-03T15:00:00+01:00', stadium: 'Estádio Álvaro Buta', status: 'finished' },
  { id: 'm-2907', round: 29, homeTeamId: 'primeiromaio', awayTeamId: 'redonda', homeTeam: '1.º de Maio', awayTeam: 'Redonda FC', homeScore: 2, awayScore: 2, score: '2-2', date: '2026-05-02T15:30:00+01:00', stadium: 'Estádio Municipal do Lobito', status: 'finished' },
  { id: 'm-2908', round: 29, homeTeamId: 'guelson', awayTeamId: 'desphuila', homeTeam: 'Guelson FC', awayTeam: 'Desportivo da Huíla', homeScore: 0, awayScore: 2, score: '0-2', date: '2026-05-03T15:00:00+01:00', stadium: 'Estádio da Cidadela', status: 'finished' },

  // Jornada 30
  { id: 'm-3001', round: 30, homeTeamId: 'lundasul', awayTeamId: 'dago', homeTeam: 'Desportivo da Lunda Sul', awayTeam: '1.º de Agosto', homeScore: 1, awayScore: 2, score: '1-2', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio das Mangueiras', status: 'finished' },
  { id: 'm-3002', round: 30, homeTeamId: 'kabuscorp', awayTeamId: 'petro', homeTeam: 'Kabuscorp', awayTeam: 'Petro de Luanda', homeScore: 1, awayScore: 2, score: '1-2', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio dos Coqueiros', status: 'finished' },
  { id: 'm-3003', round: 30, homeTeamId: 'interclube', awayTeamId: 'wiliete', homeTeam: 'Interclube', awayTeam: 'Wiliete', homeScore: 0, awayScore: 2, score: '0-2', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio 22 de Junho', status: 'finished' },
  { id: 'm-3004', round: 30, homeTeamId: 'bravos', awayTeamId: 'sagrada', homeTeam: 'Bravos do Maquis', awayTeam: 'Sagrada Esperança', homeScore: 2, awayScore: 0, score: '2-0', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio Mundunduleno', status: 'finished' },
  { id: 'm-3005', round: 30, homeTeamId: 'lobito', awayTeamId: 'libolo', homeTeam: 'Académica do Lobito', awayTeam: 'Recreativo do Libolo', homeScore: 0, awayScore: 1, score: '0-1', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio do Buraco', status: 'finished' },
  { id: 'm-3006', round: 30, homeTeamId: 'luandacity', awayTeamId: 'saosalvador', homeTeam: 'Luanda City', awayTeam: 'São Salvador do Kongo', homeScore: 0, awayScore: 0, score: '0-0', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio dos Coqueiros', status: 'finished' },
  { id: 'm-3007', round: 30, homeTeam: 'Redonda FC', awayTeam: '1.º de Maio', homeTeamId: 'redonda', awayTeamId: 'primeiromaio', homeScore: 0, awayScore: 1, score: '0-1', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio da Cidadela', status: 'finished' },
  { id: 'm-3008', round: 30, homeTeam: 'Desportivo da Huíla', awayTeam: 'Guelson FC', homeTeamId: 'desphuila', awayTeamId: 'guelson', homeScore: 3, awayScore: 0, score: '3-0', date: '2026-05-09T15:30:00+01:00', stadium: 'Estádio da Tundavala', status: 'finished' },

  // Mocks Futuros
  { id: 'm-f001', round: 1, homeTeamId: 'petro', awayTeamId: 'wiliete', homeTeam: 'Petro de Luanda', awayTeam: 'Wiliete de Benguela', homeScore: 0, awayScore: 0, date: '2026-07-25T16:00:00+01:00', stadium: 'Estádio 11 de Novembro', status: 'scheduled' },
  { id: 'm-f002', round: 1, homeTeamId: 'dago', awayTeamId: 'sagrada', homeTeam: '1.º de Agosto', awayTeam: 'Sagrada Esperança', homeScore: 0, awayScore: 0, date: '2026-07-26T15:30:00+01:00', stadium: 'Estádio França Ndalu', status: 'scheduled' },
  { id: 'm-f003', round: 1, homeTeamId: 'interclube', awayTeamId: 'kabuscorp', homeTeam: 'Interclube', awayTeam: 'Kabuscorp', homeScore: 0, awayScore: 0, date: '2026-07-26T16:00:00+01:00', stadium: 'Estádio 22 de Junho', status: 'scheduled' },
  { id: 'm-f004', round: 1, homeTeamId: 'bravos', awayTeamId: 'desphuila', homeTeam: 'Bravos do Maquis', awayTeam: 'Desportivo da Huíla', homeScore: 0, awayScore: 0, date: '2026-07-26T15:00:00+01:00', stadium: 'Estádio Mundunduleno', status: 'scheduled' }
];

// ── 4. LISTA COMPLETA DE JOGADORES ──────────────────────────────────
export const PLAYERS: Player[] = [
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

export function getMatchesByTeam(teamShortName: string): Match[] {
  return MATCHES.filter(m => m.homeTeam === teamShortName || m.awayTeam === teamShortName);
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
