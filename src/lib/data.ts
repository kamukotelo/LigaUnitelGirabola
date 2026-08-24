// Data layer for Girabola 2025/2026 Football Portal
import { PROMOTED_2026_27_TEAMS } from './ancaf-engine';
import { PUBLISHED_ANCAF_CALENDAR_SOURCE, PUBLISHED_MATCHES_2026_27 } from './published-ancaf-calendar';
import { HISTORICAL_MATCHES } from './historical-results';

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
  nickname?: string;     // apelido/alcunha da equipa (ex.: 'MAQUISARDES')
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
  goalsVerified?: boolean; // false quando a fonte oficial não publicou GM/GS
  formVerified?: boolean;  // false quando a fonte oficial não publicou a sequência
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
  /** Só datas oficiais podem ser apresentadas ao público como confirmadas. */
  scheduleStatus?: 'official' | 'provisional';
  stadium: string;
  status: 'scheduled' | 'live' | 'finished';
  liveMinute?: number;     // minuto observado na última atualização de um jogo em direto
  updatedAt?: string;      // instante editorial da última confirmação deste jogo
  round: number;
  referee?: string;      // preenchido pela BD/admin; fica por definir até à nomeação oficial
  broadcaster?: string;  // transmissão TV; senão derivado via getMatchBroadcast
  attendance?: number;   // assistência oficial; senão derivada em getMatchDetail
}

// Programação oficial confirmada das cinco primeiras jornadas. Mantida na
// camada de dados para que calendário, início, hub, API e ficha de jogo sirvam
// a mesma verdade publicada nos mapas oficiais atualizados em 23/08/2026.
export const OFFICIAL_MATCH_SCHEDULE = [
  { round: 1, homeTeamId: 'fcluanda', awayTeamId: 'caala', homeTeam: 'FC Luanda', awayTeam: 'CR Caála', date: '2026-08-23T15:00:00+01:00', stadium: 'Estádio França N’dalu' },
  { round: 1, homeTeamId: 'bravos', awayTeamId: 'sagrada', homeTeam: 'Bravos do Maquis', awayTeam: 'Sagrada Esperança', date: '2026-08-22T15:00:00+01:00', stadium: 'Estádio Mundunduleno' },
  { round: 1, homeTeamId: 'dago', awayTeamId: 'desphuila', homeTeam: 'CD 1.º de Agosto', awayTeam: 'Desportivo da Huíla', date: '2026-08-22T15:00:00+01:00', stadium: 'Estádio França N’dalu', broadcaster: 'Zsports' },
  { round: 1, homeTeamId: 'lundasul', awayTeamId: 'petro', homeTeam: 'Desportivo da Lunda Sul', awayTeam: 'Petro de Luanda', date: '2026-08-21T15:00:00+01:00', stadium: 'Estádio do Sagrada Esperança', broadcaster: 'Zsports' },
  { round: 1, homeTeamId: 'wiliete', awayTeamId: 'lobito', homeTeam: 'Wiliete de Benguela', awayTeam: 'Académica do Lobito', date: '2026-08-23T17:30:00+01:00', stadium: 'Estádio Nacional de Ombaka', broadcaster: 'Zsports' },
  { round: 1, homeTeamId: 'primeiromaio', awayTeamId: 'kabuscorp', homeTeam: 'Estrela 1.º de Maio', awayTeam: 'Kabuscorp SC', date: '2026-08-23T15:00:00+01:00', stadium: 'Estádio de São Filipe' },
  { round: 1, homeTeamId: 'cabinda', awayTeamId: 'libolo', homeTeam: 'FC Cabinda', awayTeam: 'Recreativo do Libolo', date: '2026-08-22T15:00:00+01:00', stadium: 'Estádio Vici António' },
  { round: 1, homeTeamId: 'saosalvador', awayTeamId: 'interclube', homeTeam: 'São Salvador', awayTeam: 'GD Interclube', date: '2026-08-23T15:00:00+01:00', stadium: 'Estádio Álvaro Buta' },
  { round: 2, homeTeamId: 'caala', awayTeamId: 'wiliete', date: '2026-08-27T16:00:00+01:00' },
  { round: 2, homeTeamId: 'kabuscorp', awayTeamId: 'lundasul', date: '2026-08-28T15:30:00+01:00', broadcaster: 'Zsports' },
  { round: 2, homeTeamId: 'cabinda', awayTeamId: 'desphuila', date: '2026-08-26T15:00:00+01:00' },
  { round: 2, homeTeamId: 'sagrada', awayTeamId: 'saosalvador', date: '2026-08-29T15:00:00+01:00' },
  { round: 2, homeTeamId: 'interclube', awayTeamId: 'fcluanda', date: '2026-08-29T15:30:00+01:00', broadcaster: 'Zsports' },
  { round: 2, homeTeamId: 'libolo', awayTeamId: 'bravos', date: '2026-08-30T15:00:00+01:00' },
  { round: 2, homeTeamId: 'primeiromaio', awayTeamId: 'dago', date: '2026-08-27T15:30:00+01:00', broadcaster: 'Zsports' },
  { round: 2, homeTeamId: 'lobito', awayTeamId: 'petro', date: '2026-08-30T15:30:00+01:00', broadcaster: 'Zsports' },
  { round: 3, homeTeamId: 'lundasul', awayTeamId: 'caala', date: '2026-09-05T15:00:00+01:00' },
  { round: 3, homeTeamId: 'desphuila', awayTeamId: 'wiliete', date: '2026-08-31T15:00:00+01:00' },
  { round: 3, homeTeamId: 'sagrada', awayTeamId: 'kabuscorp', date: '2026-09-23T15:00:00+01:00' },
  { round: 3, homeTeamId: 'fcluanda', awayTeamId: 'cabinda', date: '2026-09-06T15:00:00+01:00' },
  { round: 3, homeTeamId: 'bravos', awayTeamId: 'saosalvador', date: '2026-09-06T15:00:00+01:00' },
  { round: 3, homeTeamId: 'dago', awayTeamId: 'interclube', date: '2026-09-01T15:30:00+01:00', broadcaster: 'Zsports' },
  { round: 3, homeTeamId: 'petro', awayTeamId: 'libolo', date: '2026-08-26T16:30:00+01:00', broadcaster: 'Zsports' },
  { round: 3, homeTeamId: 'lobito', awayTeamId: 'primeiromaio', date: '2026-09-05T15:30:00+01:00', broadcaster: 'Zsports' },
  { round: 4, homeTeamId: 'caala', awayTeamId: 'desphuila', date: '2026-09-13T15:00:00+01:00' },
  { round: 4, homeTeamId: 'lundasul', awayTeamId: 'sagrada', date: '2026-09-13T15:00:00+01:00' },
  { round: 4, homeTeamId: 'wiliete', awayTeamId: 'fcluanda', date: '2026-09-13T15:00:00+01:00' },
  { round: 4, homeTeamId: 'bravos', awayTeamId: 'kabuscorp', date: '2026-09-16T15:00:00+01:00' },
  { round: 4, homeTeamId: 'cabinda', awayTeamId: 'dago', date: '2026-09-09T15:00:00+01:00', broadcaster: 'Zsports' },
  { round: 4, homeTeamId: 'saosalvador', awayTeamId: 'petro', date: '2026-09-16T15:30:00+01:00', broadcaster: 'Zsports' },
  { round: 4, homeTeamId: 'interclube', awayTeamId: 'lobito', date: '2026-09-10T15:30:00+01:00', broadcaster: 'Zsports' },
  { round: 4, homeTeamId: 'libolo', awayTeamId: 'primeiromaio', date: '2026-09-12T15:00:00+01:00' },
  { round: 5, homeTeamId: 'caala', awayTeamId: 'bravos', date: '2026-09-20T15:00:00+01:00' },
  { round: 5, homeTeamId: 'dago', awayTeamId: 'fcluanda', date: '2026-09-19T15:30:00+01:00' },
  { round: 5, homeTeamId: 'sagrada', awayTeamId: 'petro', date: '2026-09-20T15:30:00+01:00', broadcaster: 'Zsports' },
  { round: 5, homeTeamId: 'desphuila', awayTeamId: 'lobito', date: '2026-09-19T15:00:00+01:00' },
  { round: 5, homeTeamId: 'primeiromaio', awayTeamId: 'lundasul', date: '2026-09-20T15:00:00+01:00' },
  { round: 5, homeTeamId: 'wiliete', awayTeamId: 'libolo', date: '2026-09-20T15:00:00+01:00' },
  { round: 5, homeTeamId: 'kabuscorp', awayTeamId: 'interclube', date: '2026-09-19T15:30:00+01:00', broadcaster: 'Zsports' },
  { round: 5, homeTeamId: 'saosalvador', awayTeamId: 'cabinda', date: '2026-09-20T15:00:00+01:00' },
] as const;

// Resultados confirmados editorialmente pela plataforma. Esta camada é
// aplicada depois da agenda oficial, para que a confirmação de datas não
// volte a transformar um jogo já realizado em "agendado". As edições
// publicadas pelo administrador continuam a ter a última palavra.
export const PLATFORM_MATCH_UPDATED_AT = '2026-08-24T17:52:00+01:00';

export const PLATFORM_CONFIRMED_RESULTS: Readonly<Record<string, Partial<Match>>> = {
  'm27-1-1': {
    homeScore: 0,
    awayScore: 0,
    score: '0-0',
    status: 'finished',
    updatedAt: PLATFORM_MATCH_UPDATED_AT,
  },
  'm27-1-2': {
    homeScore: 3,
    awayScore: 0,
    score: '3-0',
    status: 'finished',
    updatedAt: PLATFORM_MATCH_UPDATED_AT,
  },
  'm27-1-3': {
    homeScore: 1,
    awayScore: 0,
    score: '1-0',
    status: 'finished',
    updatedAt: PLATFORM_MATCH_UPDATED_AT,
  },
  'm27-1-4': {
    homeScore: 0,
    awayScore: 0,
    score: '0-0',
    status: 'finished',
    updatedAt: PLATFORM_MATCH_UPDATED_AT,
  },
  'm27-1-5': {
    homeScore: 2,
    awayScore: 0,
    score: '2-0',
    status: 'finished',
    updatedAt: PLATFORM_MATCH_UPDATED_AT,
  },
  'm27-1-6': {
    homeScore: 1,
    awayScore: 1,
    score: '1-1',
    status: 'finished',
    updatedAt: PLATFORM_MATCH_UPDATED_AT,
  },
  'm27-1-7': {
    homeScore: 0,
    awayScore: 3,
    score: '0-3',
    status: 'finished',
    updatedAt: PLATFORM_MATCH_UPDATED_AT,
  },
  'm27-1-8': {
    homeScore: 0,
    awayScore: 1,
    score: '0-1',
    status: 'finished',
    updatedAt: PLATFORM_MATCH_UPDATED_AT,
  },
};

/** Recintos oficiais usados como casa durante toda a época 2026/2027. */
export const HOME_STADIUMS_2026_27: Readonly<Record<string, string>> = {
  cabinda: 'Estádio Vici António',
  lundasul: 'Estádio do Sagrada Esperança',
  fcluanda: 'Estádio França N’dalu',
  dago: 'Estádio França N’dalu',
  sagrada: 'Estádio do Sagrada Esperança',
};

export function applySeasonHomeStadiums(matches: Match[]): Match[] {
  return matches.map((match) => ({
    ...match,
    stadium: HOME_STADIUMS_2026_27[match.homeTeamId] ?? match.stadium,
  }));
}

/** Ordem editorial comum: jornada, data/hora e, em caso de empate, ID. */
export function sortOfficialMatches(matches: Match[]): Match[] {
  return [...matches].sort((a, b) =>
    a.round - b.round
    || Number(!isMatchDateOfficial(a)) - Number(!isMatchDateOfficial(b))
    || new Date(a.date).getTime() - new Date(b.date).getTime()
    || a.id.localeCompare(b.id),
  );
}

export function applyOfficialMatchSchedule(matches: Match[]): Match[] {
  const scheduleByFixture = new Map(
    OFFICIAL_MATCH_SCHEDULE.map((fixture) => [
      `${fixture.round}:${fixture.homeTeamId}:${fixture.awayTeamId}`,
      fixture,
    ]),
  );

  return sortOfficialMatches(matches.map((match) => {
    const fixture = scheduleByFixture.get(`${match.round}:${match.homeTeamId}:${match.awayTeamId}`);
    const scheduledMatch: Match = !fixture ? {
      ...match,
      scheduleStatus: match.status === 'finished' ? 'official' as const : 'provisional' as const,
    } : {
      ...match,
      ...fixture,
      homeScore: 0,
      awayScore: 0,
      score: undefined,
      status: 'scheduled' as const,
      scheduleStatus: 'official' as const,
    };

    return normalizeMatchOverride(scheduledMatch, PLATFORM_CONFIRMED_RESULTS[match.id] ?? {});
  }));
}

/** Datas técnicas da API só são públicas depois de confirmação editorial. */
export function isMatchDateOfficial(match: Match): boolean {
  return match.status === 'finished' || match.scheduleStatus !== 'provisional';
}

export function isMatchDateProvisional(match: Match): boolean {
  return !isMatchDateOfficial(match);
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

/** Goleadores confirmados da época em curso, derivados das fichas encerradas. */
export const CURRENT_SEASON_SCORERS = [
  { id: 'cuxixima-libolo', name: 'Cuxixima', club: 'Recreativo do Libolo', teamId: 'libolo', position: 'Avançado', goals: 1, appearances: 1 },
  { id: 'pedro-libolo', name: 'Pedro', club: 'Recreativo do Libolo', teamId: 'libolo', position: 'Avançado', goals: 1, appearances: 1 },
  { id: 'andeloy-libolo', name: 'Andeloy', club: 'Recreativo do Libolo', teamId: 'libolo', position: 'Avançado', goals: 1, appearances: 1 },
  { id: 'ju-cabral-bravos', name: 'Ju Cabral', club: 'Bravos do Maquis', teamId: 'bravos', position: 'Avançado', goals: 1, appearances: 1 },
  { id: 'lito-bravos', name: 'Lito', club: 'Bravos do Maquis', teamId: 'bravos', position: 'Avançado', goals: 1, appearances: 1 },
  { id: 'gladilson-bravos', name: 'Gladilson', club: 'Bravos do Maquis', teamId: 'bravos', position: 'Avançado', goals: 1, appearances: 1 },
  { id: 'dago-tshibamba', name: 'Dagó Tshibamba', club: '1.º de Agosto', teamId: 'dago', position: 'Avançado', goals: 1, appearances: 1 },
] as const;

const CURRENT_CONFIRMED_CARDS: Readonly<Record<string, { yellow: number; red: number }>> = {
  'ju-cabral-bravos': { yellow: 1, red: 0 },
  'dabanda-bravos': { yellow: 1, red: 0 },
  'cahilo-sagrada': { yellow: 1, red: 0 },
  'miguel-sagrada': { yellow: 1, red: 0 },
  'pimpao-sagrada': { yellow: 1, red: 0 },
  'marcos-cabinda': { yellow: 1, red: 0 },
  'antonio-cabinda': { yellow: 1, red: 0 },
  'deybi-flores': { yellow: 1, red: 0 },
  'antonio-hossi': { yellow: 1, red: 0 },
  'berna': { yellow: 1, red: 0 },
};

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
  date: string;      // rótulo de apresentação, ex.: '13 Jun 2026'
  isoDate: string;   // data ISO (yyyy-mm-dd) usada para ordenação cronológica
  summary: string;
  content?: string;
  /** Fluxo editorial. Apenas conteúdos explicitamente publicados são públicos. */
  status?: 'draft' | 'pending_review' | 'published' | 'rejected';
  author?: string;
  sourceName?: string;
  sourceUrl?: string;
  verifiedBy?: string;
  reviewedAt?: string;
  publishedAt?: string;
  aiAssisted?: boolean;
  /** Páginas digitalizadas de um comunicado ou documento oficial. */
  documentImages?: string[];
  /** Ficheiro PDF original disponibilizado para consulta e descarga. */
  documentUrl?: string;
}

// ── 1. EQUIPAS PARTICIPANTES ───────────────────────────────────────
export const TEAMS: Team[] = [
  { id: 'petro', name: 'Petro de Luanda', officialName: 'Atlético Petróleos de Luanda', shortName: 'APL', city: 'Luanda', stadium: 'Estádio 11 de Novembro', stadiumCapacity: 50000, founded: 1980, colors: 'Amarelo, Azul e Vermelho', coach: 'João de Sousa', president: 'Tomás Faria', nickname: 'Tricolores', website: 'https://www.petroatletico.co.ao', colorsHex: ['#F9C304', '#00529B', '#D21515'], kits: [{ label: 'Principal', colors: ['#F9C304', '#00529B'] }, { label: 'Secundário', colors: ['#000000'] }] },
  { id: 'wiliete', name: 'Wiliete de Benguela', officialName: 'Wiliete Sport Clube de Benguela', shortName: 'WIL', city: 'Benguela', stadium: 'Estádio Nacional de Ombaka', stadiumCapacity: 35000, founded: 2018, colors: 'Verde e Amarelo', coach: 'Beto Bianchi', president: 'Wilson Faria', nickname: 'Wilietes', website: 'https://www.wilietesc.ao', colorsHex: ['#008751', '#F9C304'], kits: [{ label: 'Principal', colors: ['#008751', '#F9C304'] }, { label: 'Secundário', colors: ['#FFFFFF', '#008751'] }] },
  { id: 'dago', name: 'CD 1.º de Agosto', officialName: 'Clube Desportivo 1º de Agosto', shortName: '1AG', city: 'Luanda', stadium: 'Estádio França N’dalu', stadiumCapacity: 20000, founded: 1977, colors: 'Vermelho e Preto', coach: 'Filipe Nzanza', president: 'Gouveia de Sá Miranda', nickname: 'Militares', colorsHex: ['#D21515', '#000000'], kits: [{ label: 'Principal', colors: ['#D21515', '#000000'] }, { label: 'Secundário', colors: ['#FFFFFF'] }] },
  { id: 'desphuila', name: 'Desportivo da Huíla', officialName: 'Clube Desportivo da Huíla', shortName: 'CDH', city: 'Lubango', stadium: 'Estádio da Tundavala', stadiumCapacity: 20000, founded: 1998, colors: 'Vermelho', coach: 'Paulo Torres', president: 'Lucas Ndjongo', nickname: 'Huilanos', colorsHex: ['#D21515'], kits: [{ label: 'Principal', colors: ['#D21515'] }, { label: 'Secundário', colors: ['#FFFFFF', '#D21515'] }] },
  { id: 'bravos', name: 'Bravos do Maquis', officialName: 'Futebol Clube Bravos do Maquis', shortName: 'BMQ', city: 'Luena', stadium: 'Estádio Mundunduleno', stadiumCapacity: 4300, founded: 1983, colors: 'Azul e Branco', coach: 'Sandro Mendes', president: 'Agrione Manuel', nickname: 'MAQUISARDES', website: 'https://www.bravosdomaquis.co.ao', colorsHex: ['#00529B', '#FFFFFF'], kits: [{ label: 'Principal', colors: ['#00529B', '#FFFFFF'] }, { label: 'Secundário', colors: ['#F9C304', '#000000'] }] },
  { id: 'kabuscorp', name: 'Kabuscorp SC', officialName: 'Kabuscorp Sport Clube do Palanca', shortName: 'KAB', city: 'Luanda', stadium: 'Estádio dos Coqueiros', stadiumCapacity: 12000, founded: 1994, colors: 'Vermelho e Branco', coach: 'Leo Neiva', president: 'Bento Kangamba', nickname: 'Palanquinos', colorsHex: ['#D21515', '#FFFFFF'], kits: [{ label: 'Principal', colors: ['#D21515', '#FFFFFF'] }, { label: 'Secundário', colors: ['#FFFFFF', '#D21515'] }] },
  { id: 'sagrada', name: 'Sagrada Esperança', officialName: 'Clube Desportivo Sagrada Esperança', shortName: 'GDS', city: 'Dundo', stadium: 'Estádio do Sagrada Esperança', stadiumCapacity: 8000, founded: 1976, colors: 'Verde e Branco', coach: 'Francisco Moniz', president: 'José Muacábalo', nickname: 'Diamantíferos', colorsHex: ['#008751', '#FFFFFF'], kits: [{ label: 'Principal', colors: ['#008751', '#FFFFFF'] }, { label: 'Secundário', colors: ['#000000', '#008751'] }] },
  { id: 'interclube', name: 'GD Interclube', officialName: 'Grupo Desportivo Interclube', shortName: 'INT', city: 'Luanda', stadium: 'Estádio 22 de Junho', stadiumCapacity: 8000, founded: 1976, colors: 'Azul e Branco', coach: 'Divaldo Alves', president: 'José Canelas', nickname: 'Polícias', website: 'https://www.interclube.co.ao', colorsHex: ['#00529B', '#FFFFFF'], kits: [{ label: 'Principal', colors: ['#00529B', '#FFFFFF'] }, { label: 'Secundário', colors: ['#FFFFFF', '#00529B'] }] },
  { id: 'lundasul', name: 'Desportivo da Lunda Sul', officialName: 'Clube Desportivo da Lunda-Sul', shortName: 'DLS', city: 'Saurimo', stadium: 'Estádio do Sagrada Esperança', stadiumCapacity: 8000, founded: 2020, colors: 'Azul e Branco', coach: 'Maurílio Silva', president: 'Miguel da Silva', nickname: 'Tchianda', colorsHex: ['#00529B', '#FFFFFF'], kits: [{ label: 'Principal', colors: ['#00529B', '#FFFFFF'] }, { label: 'Secundário', colors: ['#FFFFFF', '#00529B'] }] },
  { id: 'libolo', name: 'Recreativo do Libolo', officialName: 'Clube Recreativo e Desportivo do Libolo', shortName: 'CRL', city: 'Calulo', stadium: 'Estádio Municipal de Calulo', stadiumCapacity: 10000, founded: 1942, colors: 'Laranja e Azul', coach: 'Osvaldo Roque', president: 'João Pereira', nickname: 'Libolenses', colorsHex: ['#FF6600', '#00529B'], kits: [{ label: 'Principal', colors: ['#FF6600', '#00529B'] }, { label: 'Secundário', colors: ['#00529B', '#FF6600'] }] },
  { id: 'lobito', name: 'Académica do Lobito', officialName: 'Académica Petróleos Clube do Lobito', shortName: 'ACA', city: 'Lobito', stadium: 'Estádio do Buraco', stadiumCapacity: 5000, founded: 1970, colors: 'Amarelo', coach: 'Silvestre Pelé', president: 'Luís Borges', nickname: 'Estudantes', colorsHex: ['#F9C304'], kits: [{ label: 'Principal', colors: ['#F9C304'] }, { label: 'Secundário', colors: ['#000000'] }] },
  { id: 'saosalvador', name: 'São Salvador', officialName: 'São Salvador do Kongo Futebol Clube', shortName: 'SSK', city: 'Mbanza Kongo', stadium: 'Estádio Álvaro Buta', stadiumCapacity: 5000, founded: 1999, colors: 'Vermelho e Branco', coach: 'Silva Kussanda', president: 'Moniz Manuel', nickname: 'Kongos', colorsHex: ['#D21515', '#FFFFFF'], kits: [{ label: 'Principal', colors: ['#D21515', '#FFFFFF'] }, { label: 'Secundário', colors: ['#808080'] }] },
  { id: 'cabinda', name: 'FC Cabinda', officialName: 'Futebol Clube de Cabinda', shortName: 'FCC', city: 'Cabinda', stadium: 'Estádio Vici António', stadiumCapacity: 25000, founded: 2005, colors: 'Azul e Branco', coach: 'Nzola Seca', nickname: 'Gorilas do Norte', colorsHex: ['#00529B', '#FFFFFF'], kits: [{ label: 'Principal', colors: ['#00529B', '#FFFFFF'] }, { label: 'Secundário', colors: ['#FFFFFF', '#00529B'] }] },
  { id: 'primeiromaio', name: 'Estrela 1.º de Maio', officialName: 'Estrela Clube 1º de Maio de Benguela', shortName: 'MAI', city: 'Benguela', stadium: 'Estádio de São Filipe', stadiumCapacity: 6000, founded: 1981, colors: 'Vermelho e Branco', coach: 'Águas da Silva', president: 'Tony Santos', nickname: 'Proletários', colorsHex: ['#D21515', '#FFFFFF'], kits: [{ label: 'Principal', colors: ['#D21515', '#FFFFFF'] }, { label: 'Secundário', colors: ['#FFFFFF', '#D21515'] }] },
  { id: 'caala', name: 'CR Caála', officialName: 'Clube Recreativo da Caála', shortName: 'CRC', city: 'Caála', stadium: 'Estádio dos Mártires da Canhala', stadiumCapacity: 12000, founded: 1944, colors: 'Azul e Branco', coach: 'Artur Correia', president: 'António Mosquito', nickname: 'Caalenses', colorsHex: ['#00529B', '#FFFFFF'], kits: [{ label: 'Principal', colors: ['#00529B', '#FFFFFF'] }, { label: 'Secundário', colors: ['#FFFFFF', '#00529B'] }] },
  { id: 'fcluanda', name: 'FC Luanda', officialName: 'Futebol Clube de Luanda', shortName: 'FCL', city: 'Luanda', stadium: 'Estádio França N’dalu', stadiumCapacity: 20000, founded: 2020, colors: 'Azul e Branco', coach: 'Rui Santos', nickname: 'Luandenses', colorsHex: ['#00529B', '#FFFFFF'], kits: [{ label: 'Principal', colors: ['#00529B', '#FFFFFF'] }, { label: 'Secundário', colors: ['#FFFFFF', '#00529B'] }] }
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
  // `>>` converte o hash para um inteiro de 32 bits com sinal e podia gerar
  // golos negativos. O deslocamento sem sinal mantém o intervalo esperado.
  let awayGoals = (hash >>> 2) % 3; // 0, 1, 2
  
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
export const STANDINGS_ORDER_2026_27 = [
  'libolo',
  'bravos',
  'dago',
  'interclube',
  'wiliete',
  'primeiromaio',
  'kabuscorp',
  'petro',
  'lundasul',
  'caala',
  'fcluanda',
  'lobito',
  'saosalvador',
  'desphuila',
  'cabinda',
  'sagrada',
] as const;

const STANDINGS_ORDER_INDEX = new Map<string, number>(
  STANDINGS_ORDER_2026_27.map((teamId, index) => [teamId, index]),
);

export type StandingsVenue = 'all' | 'home' | 'away';

export function computeStandings(matches: Match[], venue: StandingsVenue = 'all'): StandingEntry[] {
  const acc = new Map<string, Omit<StandingEntry, 'position' | 'goalDifference' | 'form'> & { _matches: Match[] }>();
  const participants = new Map<string, string>();
  for (const match of matches) {
    participants.set(match.homeTeamId, getTeamFullName(match.homeTeamId, match.homeTeam));
    participants.set(match.awayTeamId, getTeamFullName(match.awayTeamId, match.awayTeam));
  }
  for (const [teamId, teamName] of participants) {
    acc.set(teamId, {
      teamId, teamName, played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, points: 0, _matches: [],
    });
  }

  // Inclui os jogos em curso para acompanhar a classificação ao vivo.
  const finished = matches
    .filter(m => m.status === 'finished' || m.status === 'live')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const m of finished) {
    const home = acc.get(m.homeTeamId);
    const away = acc.get(m.awayTeamId);
    if (!home || !away) continue;
    if (venue !== 'away') {
      home.played++;
      home.goalsFor += m.homeScore;
      home.goalsAgainst += m.awayScore;
      home._matches.push(m);
      if (m.homeScore > m.awayScore) { home.won++; home.points += 3; }
      else if (m.homeScore < m.awayScore) home.lost++;
      else { home.drawn++; home.points++; }
    }
    if (venue !== 'home') {
      away.played++;
      away.goalsFor += m.awayScore;
      away.goalsAgainst += m.homeScore;
      away._matches.push(m);
      if (m.awayScore > m.homeScore) { away.won++; away.points += 3; }
      else if (m.awayScore < m.homeScore) away.lost++;
      else { away.drawn++; away.points++; }
    }
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
      (STANDINGS_ORDER_INDEX.get(a.teamId) ?? Number.MAX_SAFE_INTEGER) -
        (STANDINGS_ORDER_INDEX.get(b.teamId) ?? Number.MAX_SAFE_INTEGER) ||
      a.teamName.localeCompare(b.teamName))
    .map((e, i) => ({ ...e, position: i + 1 }));
}

// Classificação final do Girabola 2025/2026 após a 30.ª jornada.
// Fonte de atualização: tabela total do Flashscore indicada pelo gestor,
// conferida com as tabelas finais reproduzidas por BeSoccer e RSSSF.
const OFFICIAL_STANDINGS_2025_26: StandingEntry[] = [
  ['petro', 'Petro de Luanda', 22, 6, 2, 63, 15, 72],
  ['wiliete', 'Wiliete Sport Clube', 18, 8, 4, 49, 29, 62],
  ['dago', 'Clube Desportivo 1.º de Agosto', 15, 12, 3, 47, 22, 57],
  ['desphuila', 'Clube Desportivo da Huíla', 12, 10, 8, 35, 26, 46],
  ['kabuscorp', 'Kabuscorp Sport Clube do Palanca', 10, 12, 8, 26, 22, 42],
  ['bravos', 'Futebol Clube Bravos do Maquis', 12, 6, 12, 33, 30, 42],
  ['interclube', 'Grupo Desportivo Interclube', 9, 13, 8, 35, 28, 40],
  ['lundasul', 'Clube Desportivo da Lunda-Sul', 9, 11, 10, 27, 29, 38],
  ['primeiromaio', 'Estrela Clube Primeiro de Maio', 10, 7, 13, 29, 33, 37],
  ['sagrada', 'Clube Desportivo Sagrada Esperança', 8, 12, 10, 34, 40, 36],
  ['saosalvador', 'São Salvador do Kongo Futebol Clube', 9, 8, 13, 27, 33, 35],
  ['lobito', 'Académica Petróleos Clube do Lobito', 8, 11, 11, 25, 30, 35],
  ['libolo', 'Clube Recreativo e Desportivo do Libolo', 9, 7, 14, 26, 37, 34],
  ['luanda-city', 'Luanda City Football Club', 9, 6, 15, 21, 45, 33],
  ['redonda', 'Redonda Futebol Clube', 5, 6, 19, 15, 47, 21],
  ['guelson', 'Recreativo Social Desportivo Guelson Futebol Clube', 6, 3, 21, 24, 50, 21],
].map(([teamId, teamName, won, drawn, lost, goalsFor, goalsAgainst, points], index) => ({
  position: index + 1,
  teamId: String(teamId),
  teamName: String(teamName),
  played: 30,
  won: Number(won),
  drawn: Number(drawn),
  lost: Number(lost),
  goalsFor: Number(goalsFor),
  goalsAgainst: Number(goalsAgainst),
  goalDifference: Number(goalsFor) - Number(goalsAgainst),
  points: Number(points),
  form: [],
  goalsVerified: true,
  formVerified: false,
}));

export const OFFICIAL_STANDINGS: Record<string, StandingEntry[]> = {
  '2025-26': OFFICIAL_STANDINGS_2025_26,
};

// Classificação da época de referência do portal.
export const STANDINGS: StandingEntry[] = OFFICIAL_STANDINGS_2025_26;

// ── 3b. ÉPOCAS / TEMPORADAS ────────────────────────────────────────
export interface Season {
  id: string;        // identificador estável, ex.: '2026-27'
  label: string;     // rótulo de apresentação, ex.: '2026/2027'
  status: 'completed' | 'active' | 'upcoming';
}

// A temporada 2026/2027 é o foco atual do portal. A edição anterior permanece
// disponível no seletor de épocas para consulta do arquivo histórico.
export const SEASONS: Season[] = [
  { id: '2026-27', label: '2026/2027', status: 'active' },
  { id: '2025-26', label: '2025/2026', status: 'completed' },
];
export const CURRENT_SEASON_ID = '2026-27';
export const PREVIOUS_SEASON_ID = '2025-26';
// Alias mantido para os módulos que tratam o calendário oficial de 2026/2027.
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

// Clubes presentes nas três épocas históricas importadas que já não fazem
// parte da lista principal. Mantêm IDs estáveis para emblemas e páginas.
export const HISTORICAL_TEAMS: Team[] = [
  { id: 'isaac-benguela', name: 'Isaac de Benguela', shortName: 'ISA', city: 'Benguela', stadium: 'Estádio Nacional de Ombaka', stadiumCapacity: 35000, founded: 2018, colors: 'Azul e Branco', coach: '—' },
  { id: 'santa-rita', name: 'Santa Rita de Cássia', shortName: 'SRC', city: 'Uíge', stadium: 'Estádio 4 de Janeiro', stadiumCapacity: 12000, founded: 2015, colors: 'Verde e Branco', coach: '—' },
  { id: 'carmona', name: 'Carmona Sport Clube', shortName: 'CSC', city: 'Uíge', stadium: 'Estádio 4 de Janeiro', stadiumCapacity: 12000, founded: 2022, colors: 'Azul e Branco', coach: '—' },
  { id: 'sporting-cabinda', name: 'Sporting de Cabinda', shortName: 'SCA', city: 'Cabinda', stadium: 'Estádio do Tafe', stadiumCapacity: 9000, founded: 1975, colors: 'Verde e Branco', coach: '—' },
  { id: 'uniao-malanje', name: 'União de Malanje', shortName: 'USM', city: 'Malanje', stadium: 'Estádio 1.º de Maio', stadiumCapacity: 6000, founded: 2019, colors: 'Vermelho e Branco', coach: '—' },
  { id: 'ask-dragao', name: 'ASK Dragão', shortName: 'ASK', city: 'Uíge', stadium: 'Estádio 4 de Janeiro', stadiumCapacity: 12000, founded: 2017, colors: 'Azul e Branco', coach: '—' },
  { id: 'sporting-benguela', name: 'Sporting de Benguela', shortName: 'SBE', city: 'Benguela', stadium: 'Estádio de São Filipe', stadiumCapacity: 5000, founded: 1915, colors: 'Verde e Branco', coach: '—' },
  { id: 'redonda', name: 'Redonda FC', officialName: 'Redonda Futebol Clube', shortName: 'RED', city: 'Luanda', stadium: 'A confirmar', stadiumCapacity: 0, founded: 0, colors: 'Vermelho e Amarelo', coach: '—' },
  { id: 'guelson', name: 'Guelson FC', officialName: 'Recreativo Social Desportivo Guelson Futebol Clube', shortName: 'GFC', city: 'Luanda', stadium: 'A confirmar', stadiumCapacity: 0, founded: 0, colors: 'Laranja e Preto', coach: '—' },
  { id: 'luanda-city', name: 'Luanda City', officialName: 'Luanda City Football Club', shortName: 'LCF', city: 'Luanda', stadium: 'A confirmar', stadiumCapacity: 0, founded: 0, colors: 'A confirmar', coach: '—' },
];

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
    goals: 17,
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
      { season: '2025/26', club: '1.º de Agosto', competition: 'Liga Unitel Girabola', apps: 28, goals: 17, assists: 4, minutes: 2415, yellow: 5, red: 0 },
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
    id: 'tiago-reis',
    name: 'Tiago Reis',
    club: 'Petro de Luanda',
    teamId: 'petro',
    position: 'Avançado',
    goals: 16,
    assists: 0,
    appearances: 0,
    jerseyNumber: 0,
    age: 0,
    nationality: 'A confirmar',
    height: 'A confirmar',
    attributes: { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 },
    bio: 'Segundo melhor marcador da Liga Unitel Girabola 2025/2026, com 16 golos ao serviço do Petro de Luanda.',
    careerHistory: [
      { season: '2025/26', club: 'Petro de Luanda', competition: 'Liga Unitel Girabola', apps: 0, goals: 16 },
    ],
  },
  {
    id: 'melono-dala',
    name: 'Melono Dala',
    club: 'Sagrada Esperança',
    teamId: 'sagrada',
    position: 'Avançado',
    goals: 15,
    assists: 0,
    appearances: 0,
    jerseyNumber: 0,
    age: 0,
    nationality: 'A confirmar',
    height: 'A confirmar',
    attributes: { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 },
    bio: 'Terceiro melhor marcador da Liga Unitel Girabola 2025/2026, com 15 golos ao serviço do Sagrada Esperança.',
    careerHistory: [
      { season: '2025/26', club: 'Sagrada Esperança', competition: 'Liga Unitel Girabola', apps: 0, goals: 15 },
    ],
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
  const confirmedCards = CURRENT_CONFIRMED_CARDS[p.id] ?? { yellow: 0, red: 0 };

  // A época ativa começa sem estatísticas herdadas. Enquanto o atleta ainda
  // não tiver uma presença registada, todos os indicadores competitivos
  // permanecem realmente a zero (sem estimativas ou valores demonstrativos).
  if (p.appearances === 0) {
    return {
      ...p,
      technicalRating: 0,
      formRating: 0,
      detailedStats: {
        passingAccuracy: 0,
        longPassesAccuracy: 0,
        aerialDuelsWon: 0,
        groundDuelsWon: 0,
        tacklesPerMatch: 0,
        keyPassesPerMatch: 0,
        minutesPlayed: 0,
        yellowCards: confirmedCards.yellow,
        redCards: confirmedCards.red,
        shotsOnTargetPerMatch: 0,
        successfulDribbles: 0,
        ratingTrend: [],
      },
    };
  }

  // Perfis recém-publicados sem métricas técnicas não recebem estimativas.
  // Mantêm apenas partidas, golos e disciplina confirmados editorialmente.
  if (Object.values(p.attributes).every((value) => value === 0)) {
    return {
      ...p,
      technicalRating: 0,
      formRating: 0,
      detailedStats: {
        passingAccuracy: 0,
        longPassesAccuracy: 0,
        aerialDuelsWon: 0,
        groundDuelsWon: 0,
        tacklesPerMatch: 0,
        keyPassesPerMatch: 0,
        minutesPlayed: 0,
        yellowCards: confirmedCards.yellow,
        redCards: confirmedCards.red,
        shotsOnTargetPerMatch: 0,
        successfulDribbles: 0,
        ratingTrend: [],
      },
    };
  }

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

// Plantel principal do Petro de Luanda para 2026/2027, consultado no
// ZeroZero em 21/08/2026. Os dados desportivos que a fonte não publica para
// a nova época começam a zero, evitando apresentar estatísticas inventadas.
const PETRO_SQUAD_2026_27: Player[] = [
  ['hugo-marques', 'Hugo Marques', 'Guarda-redes', 1, 40, 'Angola'],
  ['neblu', 'Neblú', 'Guarda-redes', 22, 32, 'Angola'],
  ['agostinho-calunga', 'Agostinho Calunga', 'Guarda-redes', 30, 28, 'Angola'],
  ['areola', 'Areola', 'Guarda-redes', 38, 20, 'Angola'],
  ['eddie-afonso', 'Eddie Afonso', 'Defesa', 25, 32, 'Angola'],
  ['antonio-hossi', 'António Hossi', 'Defesa', 27, 25, 'Angola'],
  ['ruben-aderito', 'Rúben Adérito', 'Defesa', 4, 23, 'Angola'],
  ['leo-bolgado', 'Léo Bolgado', 'Defesa', 5, 28, 'Brasil'],
  ['vidinho', 'Vidinho', 'Defesa', 18, 28, 'Angola'],
  ['kinito', 'Kinito', 'Defesa', 24, 28, 'Angola'],
  ['lourenco-didissa', 'Lourenço Didissa', 'Defesa', 31, 18, 'Angola'],
  ['nurio-fortuna', 'Núrio Fortuna', 'Defesa', 2, 31, 'Angola'],
  ['berna', 'Berna', 'Defesa', 13, 22, 'Angola'],
  ['deybi-flores', 'Deybi Flores', 'Médio', 12, 30, 'Honduras'],
  ['jorge-pereira', 'Jorge Pereira', 'Médio', 20, 28, 'Portugal'],
  ['gabriel', 'Gabriel', 'Médio', 39, 17, 'Angola'],
  ['mario-balburdia', 'Mário Balbúrdia', 'Médio', 6, 29, 'Angola'],
  ['jonathan-toro', 'Jonathan Toro', 'Médio', 8, 29, 'Honduras'],
  ['pedro-aparicio', 'Pedro Aparício', 'Médio', 10, 30, 'Portugal'],
  ['jairo-muanha', 'Jairo Muanha', 'Médio', 34, 17, 'Angola'],
  ['helder-costa', 'Hélder Costa', 'Avançado', 11, 32, 'Angola'],
  ['lucas-joao', 'Lucas João', 'Avançado', 9, 32, 'Angola'],
  ['tiago-reis', 'Tiago Reis', 'Avançado', 23, 27, 'Brasil'],
  ['tiago-azulao', 'Tiago Azulão', 'Avançado', 26, 38, 'Brasil'],
  ['depu', 'Depú', 'Avançado', 29, 26, 'Angola'],
  ['ivan-cavaleiro', 'Ivan Cavaleiro', 'Avançado', 7, 32, 'Portugal'],
  ['vanilson', 'Vanilson', 'Avançado', 17, 27, 'Angola'],
  ['ilidio-panda', 'Ilídio Panda', 'Avançado', 33, 18, 'Angola'],
].map(([id, name, position, jerseyNumber, age, nationality]) => ({
  id: String(id),
  name: String(name),
  club: 'Petro de Luanda',
  teamId: 'petro',
  position: String(position),
  goals: 0,
  assists: 0,
  appearances: 0,
  jerseyNumber: Number(jerseyNumber),
  age: Number(age),
  nationality: String(nationality),
  height: 'A confirmar',
  attributes: { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 },
  careerHistory: [],
}));

// Convocados do Desportivo da Lunda Sul para a 1.ª jornada frente ao Petro,
// conforme a convocatória oficial publicada pelo clube em 21/08/2026.
const LUNDA_SUL_SQUAD_2026_27: Player[] = [
  ['nono', 'Nonó', 'Defesa', 2],
  ['yuri', 'Yuri', 'Defesa', 4],
  ['fred', 'Fredy', 'Defesa', 5],
  ['platini', 'Platiny', 'Médio', 6],
  ['neymar-lunda-sul', 'Neymar', 'Avançado', 7],
  ['vado-lunda-sul', 'Vado', 'Médio', 8],
  ['maranata', 'Maranata', 'Médio', 10],
  ['magrinho', 'Magrinho', 'Avançado', 11],
  ['cacusso', 'Kacusso', 'Guarda-redes', 12],
  ['ximba', 'Ximba', 'Médio', 16],
  ['jepson', 'Jepson', 'Avançado', 17],
  ['fuca', 'Fuca', 'Avançado', 35],
  ['manucho-lunda-sul', 'Manucho', 'Avançado', 19],
  ['mussa-lunda-sul', 'Mussá', 'Avançado', 20],
  ['mongadie', 'Mongadié', 'Defesa', 23],
  ['dieu', 'Dieu', 'Defesa', 25],
  ['sozito', 'Sozito', 'Defesa', 26],
  ['joca-lunda-sul', 'Joca', 'Avançado', 27],
  ['kibuata', 'Kibuata', 'Defesa', 28],
  ['zonzo', 'Zonzo', 'Médio', 33],
  ['nicon', 'Nicon', 'Médio', 34],
  ['angola-gr', 'Angola', 'Guarda-redes', 41],
].map(([id, name, position, jerseyNumber]) => ({
  id: String(id),
  name: String(name),
  club: 'Desportivo da Lunda Sul',
  teamId: 'lundasul',
  position: String(position),
  goals: 0,
  assists: 0,
  appearances: 0,
  jerseyNumber: Number(jerseyNumber),
  age: 0,
  nationality: 'Angola',
  height: 'A confirmar',
  attributes: { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 },
  careerHistory: [],
}));

// Convocados do Bravos do Maquis para a 1.ª jornada frente ao Sagrada
// Esperança, conforme a ficha oficial enviada pelo clube em 24/08/2026.
const BRAVOS_SQUAD_2026_27: Player[] = [
  ['nathan-bravos', 'Nathan', 'Guarda-redes', 22, 1, 0],
  ['manico-bravos', 'Manico', 'Defesa', 26, 1, 0],
  ['denilson-bravos', 'Denilson', 'Defesa', 2, 1, 0],
  ['caprego-bravos', 'Caprego', 'Defesa', 24, 1, 0],
  ['dabanda-bravos', 'Dabanda', 'Defesa', 27, 1, 0],
  ['abrao-bravos', 'Abrão', 'Médio', 6, 1, 0],
  ['cueta-bravos', 'Cueta', 'Médio', 7, 1, 0],
  ['ju-cabral-bravos', 'Ju Cabral', 'Médio', 8, 1, 1],
  ['jorginho-bravos', 'Jorginho', 'Avançado', 19, 1, 0],
  ['lito-bravos', 'Lito', 'Avançado', 23, 1, 1],
  ['bani-bravos', 'Bani', 'Avançado', 20, 1, 0],
  ['agnaldo-bravos', 'Agnaldo', 'Defesa', 3, 0, 0],
  ['higino-bravos', 'Higino', 'Médio', 10, 1, 0],
  ['tiago-bravos', 'Tiago', 'Avançado', 15, 1, 0],
  ['eduwine-bravos', 'Eduwine', 'Avançado', 17, 1, 0],
  ['gladilson-bravos', 'Gladilson', 'Avançado', 28, 1, 1],
  ['tony-bravos', 'Tony', 'Médio', 0, 1, 0],
  ['saidi-bravos', 'Saidi', 'Guarda-redes', 0, 0, 0],
  ['bruno-bravos', 'Bruno', 'Defesa', 0, 0, 0],
].map(([id, name, position, jerseyNumber, appearances, goals]) => ({
  id: String(id),
  name: String(name),
  club: 'Bravos do Maquis',
  teamId: 'bravos',
  position: String(position),
  goals: Number(goals),
  assists: 0,
  appearances: Number(appearances),
  jerseyNumber: Number(jerseyNumber),
  age: 0,
  nationality: 'Angola',
  height: 'A confirmar',
  attributes: { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 },
  careerHistory: [],
}));

const SAGRADA_SQUAD_2026_27: Player[] = [
  ['leonardo-sagrada', 'Leonardo', 'Guarda-redes', 13, 1],
  ['miguel-sagrada', 'Miguel', 'Defesa', 5, 1],
  ['tobias-sagrada', 'Tobias', 'Defesa', 14, 1],
  ['gogoro-sagrada', 'Gogoró', 'Defesa', 17, 1],
  ['luis-tati-sagrada', 'Luís Tati', 'Defesa', 20, 1],
  ['cahilo-sagrada', 'Cahilo', 'Médio', 32, 1],
  ['afonso-sagrada', 'Afonso', 'Médio', 24, 1],
  ['lepua-sagrada', 'Lépua', 'Médio', 10, 1],
  ['pimpao-sagrada', 'Pimpão', 'Avançado', 16, 1],
  ['dabanda-sagrada', 'Dabanda', 'Avançado', 7, 1],
  ['jorge-sagrada', 'Jorge', 'Avançado', 9, 1],
  ['nsesani-sagrada', 'Nsesani', 'Guarda-redes', 12, 0],
  ['silvano-sagrada', 'Silvano', 'Avançado', 18, 1],
  ['barreira-sagrada', 'Barreira', 'Defesa', 28, 0],
  ['sapalo-sagrada', 'Sapalo', 'Médio', 31, 0],
  ['melono-sagrada', 'Melono', 'Avançado', 11, 1],
  ['guilherme-sagrada', 'Guilherme', 'Médio', 8, 1],
  ['evaristo-sagrada', 'Evaristo', 'Defesa', 4, 0],
  ['manuel-sagrada', 'Manuel', 'Defesa', 3, 0],
].map(([id, name, position, jerseyNumber, appearances]) => ({
  id: String(id), name: String(name), club: 'Sagrada Esperança', teamId: 'sagrada', position: String(position),
  goals: 0, assists: 0, appearances: Number(appearances), jerseyNumber: Number(jerseyNumber), age: 0,
  nationality: 'Angola', height: 'A confirmar',
  attributes: { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 }, careerHistory: [],
}));

const CABINDA_SQUAD_2026_27: Player[] = [
  ['francisco-cabinda', 'Francisco', 'Guarda-redes', 12, 1],
  ['rodrigo-cabinda', 'Rodrigo', 'Defesa', 2, 1],
  ['frederico-cabinda', 'Frederico', 'Defesa', 20, 1],
  ['marcos-cabinda', 'Marcos', 'Defesa', 5, 1],
  ['antonio-cabinda', 'António', 'Defesa', 16, 1],
  ['julio-cabinda', 'Júlio', 'Médio', 17, 1],
  ['cristiano-cabinda', 'Cristiano', 'Médio', 8, 1],
  ['fernando-cabinda', 'Fernando', 'Médio', 21, 1],
  ['gedeon-cabinda', 'Gedeon', 'Avançado', 3, 1],
  ['jose-cabinda', 'José', 'Avançado', 18, 1],
  ['ariclenis-cabinda', 'Ariclenis', 'Avançado', 29, 1],
  ['bras-cabinda', 'Brás', 'Avançado', 0, 1],
  ['cornelio-cabinda', 'Cornélio', 'Avançado', 0, 1],
  ['costa-cabinda', 'Costa', 'Médio', 0, 1],
].map(([id, name, position, jerseyNumber, appearances]) => ({
  id: String(id), name: String(name), club: 'FC Cabinda', teamId: 'cabinda', position: String(position),
  goals: 0, assists: 0, appearances: Number(appearances), jerseyNumber: Number(jerseyNumber), age: 0,
  nationality: 'Angola', height: 'A confirmar',
  attributes: { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 }, careerHistory: [],
}));

const LIBOLO_SQUAD_2026_27: Player[] = [
  ['beny-libolo', 'Beny', 'Guarda-redes', 12, 1, 0],
  ['marcos-libolo', 'Marcos', 'Defesa', 3, 1, 0],
  ['toti-libolo', 'Toti', 'Defesa', 4, 1, 0],
  ['maninho-libolo', 'Maninho', 'Defesa', 5, 1, 0],
  ['tchube-libolo', 'Tchube', 'Defesa', 8, 1, 0],
  ['chimito-libolo', 'Chimito', 'Médio', 6, 1, 0],
  ['andeloy-libolo', 'Andeloy', 'Médio', 10, 1, 1],
  ['nelo-libolo', 'Nelo', 'Médio', 14, 1, 0],
  ['pedro-libolo', 'Pedro', 'Avançado', 17, 1, 1],
  ['tubarao-libolo', 'Tubarão', 'Avançado', 30, 1, 0],
  ['cuxixima-libolo', 'Cuxixima', 'Avançado', 27, 1, 1],
  ['mario-libolo', 'Mário', 'Guarda-redes', 20, 0, 0],
  ['jamanta-libolo', 'Jamanta', 'Avançado', 19, 1, 0],
  ['jorgito-libolo', 'Jorgito', 'Médio', 15, 0, 0],
  ['zidane-libolo', 'Zidane', 'Médio', 22, 1, 0],
  ['catraio-libolo', 'Catraio', 'Defesa', 24, 1, 0],
  ['miro-libolo', 'Miro', 'Defesa', 25, 1, 0],
  ['lara-libolo', 'Lara', 'Avançado', 28, 0, 0],
].map(([id, name, position, jerseyNumber, appearances, goals]) => ({
  id: String(id), name: String(name), club: 'Recreativo do Libolo', teamId: 'libolo', position: String(position),
  goals: Number(goals), assists: 0, appearances: Number(appearances), jerseyNumber: Number(jerseyNumber), age: 0,
  nationality: 'Angola', height: 'A confirmar',
  attributes: { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 }, careerHistory: [],
}));

const CURRENT_PLAYERS_RAW: Player[] = [
  ...PLAYERS_RAW.filter((player) => !['petro', 'lundasul', 'bravos', 'sagrada', 'cabinda', 'libolo'].includes(player.teamId)),
  ...PETRO_SQUAD_2026_27,
  ...LUNDA_SUL_SQUAD_2026_27,
  ...BRAVOS_SQUAD_2026_27,
  ...SAGRADA_SQUAD_2026_27,
  ...CABINDA_SQUAD_2026_27,
  ...LIBOLO_SQUAD_2026_27,
].map((player) => ({
  ...player,
  goals: ['bravos', 'libolo'].includes(player.teamId) ? player.goals : 0,
  assists: ['bravos', 'libolo'].includes(player.teamId) ? player.assists : 0,
  appearances: ['bravos', 'sagrada', 'cabinda', 'libolo'].includes(player.teamId) ? player.appearances : 0,
}));

export const PLAYERS: Player[] = CURRENT_PLAYERS_RAW.map(enrichPlayer);

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
    id: 'comunicado-oficial-003-dce-ancaf-2026',
    title: 'Minuto de silêncio em homenagem a Augusto Kitadica "Docas"',
    category: 'Comunicado Oficial',
    date: '18 ago. 2026',
    isoDate: '2026-08-18',
    summary: 'A ANCAF determina o cumprimento de um minuto de silêncio em todos os jogos da primeira jornada da Liga Unitel Girabola 2026/2027.',
    content: 'O Comunicado Oficial n.º 003-DCE/ANCAF/2026 determina o cumprimento de um minuto de silêncio em homenagem a Augusto Kitadica "Docas" em todos os jogos da primeira jornada da Liga Unitel Girabola 2026/2027.\n\nO comunicado é dirigido aos 16 clubes participantes, foi emitido em Luanda, a 18 de agosto de 2026, pela Direção de Competições da Associação Nacional dos Clubes Angolanos de Futebol, e assinado pelo Presidente da ANCAF, João Lusevi Kueno.',
    status: 'published',
    author: 'Direção de Competições da ANCAF',
    sourceName: 'ANCAF — Associação Nacional dos Clubes Angolanos de Futebol',
    sourceUrl: 'https://ancaf.co.ao',
    publishedAt: '2026-08-18T00:00:00+01:00',
    documentImages: [
      '/comunicados/comunicado-003-2026/pagina-1.png',
    ],
    documentUrl: '/comunicados/comunicado-003-2026/comunicado-003-dce-ancaf-2026.pdf',
  },
  {
    id: 'comunicado-oficial-004-dce-ancaf-2026',
    title: 'ANCAF esclarece o modelo de calendarização e programação do Girabola 2026/2027',
    category: 'Comunicado Oficial',
    date: '15 ago. 2026',
    isoDate: '2026-08-15',
    summary: 'A Direção de Competições esclarece aos 16 clubes os critérios de calendarização, transmissão televisiva e programação dos jogos da Liga Unitel Girabola.',
    content: 'O Comunicado Oficial n.º 004-DCE/ANCAF/2026 esclarece que a calendarização e a programação dos jogos passam a ser uma responsabilidade exclusiva da liga organizadora, em resposta às exigências comerciais, televisivas e regulamentares da competição. Segundo a ANCAF, a distribuição dos encontros ao longo de cada jornada permitirá a transmissão de dois a cinco jogos e apoiará a monetização do campeonato.\n\nAs jornadas serão disputadas à sexta-feira, sábado, domingo e segunda-feira. Também poderá haver antecipação de jogos para terça, quarta ou quinta-feira devido à participação das equipas angolanas nas competições da CAF.\n\nA programação poderá ainda considerar datas FIFA, jogos da seleção nacional, competições da CAF, questões políticas ou religiosas, segurança pública, condições climáticas e grandes clássicos internacionais que possam afetar a audiência da Liga Unitel Girabola.\n\nNa mensagem final, a ANCAF defende um campeonato moderno, sustentável e respeitado, apelando à disciplina, cooperação e adaptação dos clubes ao novo modelo. O documento é assinado pelo Director de Competições, Valódia dos Santos, e pelo Presidente da ANCAF, João Lusevi Kueno.',
    status: 'published',
    author: 'Direção de Competições da ANCAF',
    sourceName: 'ANCAF — Associação Nacional dos Clubes Angolanos de Futebol',
    sourceUrl: 'https://ancaf.co.ao',
    publishedAt: '2026-08-19T14:35:09+01:00',
    documentImages: [
      '/comunicados/comunicado-004-2026/pagina-1.png',
      '/comunicados/comunicado-004-2026/pagina-2.png',
    ],
    documentUrl: '/comunicados/comunicado-004-2026/comunicado-004-dce-ancaf-2026.pdf',
  },
  {
    id: 'mensagem-presidente-ancaf-liga-unitel-girabola-2026-27',
    title: 'Mensagem do Presidente da ANCAF sobre a Liga Unitel Girabola 2026/2027',
    category: 'Comunicado Oficial',
    date: '19 ago. 2026',
    isoDate: '2026-08-19',
    summary: 'O Presidente da ANCAF esclarece as razões e os benefícios do novo modelo centralizado de calendarização e programação dos jogos da Liga Unitel Girabola.',
    content: 'A mensagem dirigida aos presidentes dos clubes explica que a centralização das datas e dos horários procura proteger o interesse coletivo, aumentar a visibilidade da competição e criar melhores condições para a transmissão televisiva. A posição resulta de consulta interna da ANCAF e conta com o apoio e alinhamento da Federação Angolana de Futebol.\n\nO documento apresenta como benefícios o crescimento progressivo das receitas comerciais, a melhor preparação dos representantes angolanos nas competições da CAF, a valorização dos jogadores, o reforço da credibilidade perante investidores e a adoção de práticas utilizadas pelas principais ligas profissionais.\n\nAs jornadas poderão decorrer entre sexta-feira e segunda-feira. A programação continuará a considerar datas FIFA, competições da CAF, disponibilidade das infraestruturas, segurança pública, condições climáticas e eventos nacionais, políticos, religiosos ou culturais relevantes.\n\nA ANCAF apela à compreensão, colaboração e responsabilidade dos clubes, defendendo que um Girabola mais organizado, visível e sustentável criará oportunidades e benefícios para todos os participantes. A mensagem foi emitida em Luanda, a 19 de agosto de 2026, e assinada pelo Presidente da ANCAF, João Lusevi Kueno.',
    status: 'published',
    author: 'João Lusevi Kueno — Presidente da ANCAF',
    sourceName: 'ANCAF — Associação Nacional dos Clubes Angolanos de Futebol',
    sourceUrl: 'https://ancaf.co.ao',
    publishedAt: '2026-08-19T13:36:21+01:00',
    documentImages: [
      '/comunicados/mensagem-presidente-ancaf-2026/pagina-1.png',
      '/comunicados/mensagem-presidente-ancaf-2026/pagina-2.png',
      '/comunicados/mensagem-presidente-ancaf-2026/pagina-3.png',
      '/comunicados/mensagem-presidente-ancaf-2026/pagina-4.png',
    ],
    documentUrl: '/comunicados/mensagem-presidente-ancaf-2026/mensagem-presidente-ancaf-19-agosto-2026.pdf',
  },
  {
    id: 'comunicado-oficial-002-dce-ancaf-2026',
    title: 'Publicação da 1.ª à 5.ª jornada da Liga Unitel Girabola 2026/2027',
    category: 'Comunicado Oficial',
    date: '15 ago. 2026',
    isoDate: '2026-08-15',
    summary: 'A ANCAF publica a programação oficial das cinco primeiras jornadas da Liga Unitel Girabola na época 2026/2027.',
    content: 'O Comunicado Oficial n.º 002-DCE/ANCAF/2026 publica a programação da 1.ª à 5.ª jornada da Liga Unitel Girabola 2026/2027 para conhecimento dos 16 clubes participantes.\n\nO documento reúne, num único mapa oficial, os confrontos, as datas, os horários e os jogos com transmissão em direto pela Zsports. A programação nele apresentada passa a orientar os cartões de jogos, o calendário e os restantes módulos informativos do portal.\n\nSincronizado! Qualquer actualização por parte da Zap será comunicada atempadamente.\n\nO comunicado foi emitido em Luanda, a 15 de agosto de 2026, pela Direção de Competições da Associação Nacional dos Clubes Angolanos de Futebol.',
    status: 'published',
    author: 'Direção de Competições da ANCAF',
    sourceName: 'ANCAF — Associação Nacional dos Clubes Angolanos de Futebol',
    sourceUrl: 'https://ancaf.co.ao',
    publishedAt: '2026-08-15T00:00:00+01:00',
    documentImages: [
      '/comunicados/comunicado-002-2026/pagina-1.png',
    ],
    documentUrl: '/comunicados/comunicado-002-2026/comunicado-002-dce-ancaf-2026.pdf',
  },
  {
    id: 'comunicado-oficial-001-dce-ancaf-2026',
    title: 'Gestão Equitativa de Jogos, Transparência Financeira e Condições Operacionais na Época 2026/2027',
    category: 'Comunicado Oficial',
    date: '15 ago. 2026',
    isoDate: '2026-08-15',
    summary: 'A ANCAF estabelece diretrizes operacionais e financeiras para os 16 clubes participantes da Liga Unitel Girabola na época 2026/2027.',
    content: 'O Comunicado Oficial n.º 001-DCE/ANCAF/2026 estabelece orientações sobre a gestão operacional e a equidade dos jogos, a transparência financeira e a distribuição de dividendos, as condições operacionais e de colaboração, o licenciamento e as vistorias dos estádios, bem como recomendações administrativas finais.\n\nO documento determina o cumprimento integral do calendário oficial, reforça a aplicação igualitária dos regulamentos e a não discriminação, e define princípios de transparência para receitas comerciais, direitos televisivos e distribuição de dividendos.\n\nOs clubes devem colaborar com a empresa detentora dos direitos televisivos, assegurar condições para conferências de imprensa e para o trabalho dos delegados da Liga. O licenciamento compete à Federação Angolana de Futebol, e os jogos serão realizados apenas em estádios aprovados pela FAF.\n\nO comunicado foi emitido em Luanda, a 15 de agosto de 2026, pela Direção de Competições da ANCAF, e assinado pelo Director de Competições, Valódia dos Santos, e pelo Presidente, João Lusevi Kueno.',
    status: 'published',
    author: 'Direção de Competições da ANCAF',
    sourceName: 'ANCAF — Associação Nacional dos Clubes Angolanos de Futebol',
    sourceUrl: 'https://ancaf.co.ao',
    publishedAt: '2026-08-15T00:00:00+01:00',
    documentImages: [
      '/comunicados/comunicado-001-2026/pagina-1.png',
      '/comunicados/comunicado-001-2026/pagina-2.png',
      '/comunicados/comunicado-001-2026/pagina-3.png',
    ],
  },
  {
    id: 'draft-arranque-girabola-2026-27',
    title: 'ANCAF aponta 22 de agosto para o arranque do Girabola 2026/2027',
    category: 'Competição',
    date: '06 ago. 2026',
    isoDate: '2026-08-06',
    summary: 'A nova temporada do principal campeonato nacional tem início previsto para 22 de agosto, segundo informação divulgada pela Rádio Nacional de Angola.',
    content: 'A Liga Unitel Girabola 2026/2027 tem o arranque previsto para 22 de agosto. A informação foi divulgada pela Rádio Nacional de Angola, que atribui a definição do calendário à Associação Nacional dos Clubes Angolanos de Futebol.\n\nA data orienta a preparação dos clubes participantes e o planeamento das jornadas da nova época. A confirmação editorial final deverá considerar qualquer atualização posterior publicada pela organização da competição.',
    status: 'pending_review',
    author: 'Redação Liga Unitel Girabola',
    sourceName: 'Rádio Nacional de Angola',
    sourceUrl: 'https://rna.ao/rna.ao/2026/07/17/ancaf-define-data-de-arranque-da-liga-unitel-girabola-2026-2027/',
    aiAssisted: true,
  },
  {
    id: 'draft-deybi-flores-petro',
    title: 'Deybi Flores reforça o meio-campo do Petro de Luanda',
    category: 'Mercado',
    date: '06 ago. 2026',
    isoDate: '2026-08-06',
    summary: 'O médio internacional hondurenho surge como reforço do campeão nacional para a preparação da temporada 2026/2027.',
    content: 'O Petro de Luanda reforçou o meio-campo com o internacional hondurenho Deybi Flores, segundo informação publicada pelo Jornal de Angola. A contratação integra a preparação do plantel tricolor para os desafios da temporada 2026/2027.\n\nAntes da publicação definitiva, a redação deverá confirmar os dados contratuais e a apresentação do atleta nos canais oficiais do clube.',
    status: 'pending_review',
    author: 'Redação Liga Unitel Girabola',
    sourceName: 'Jornal de Angola',
    sourceUrl: 'https://jornaldeangola.ao/noticias/6/desporto/678493/deybi-flores-refor%C3%A7a-petro-de-luanda',
    aiAssisted: true,
  },
  {
    id: 'draft-fc-luanda-promocao',
    title: 'FC Luanda alcança apuramento inédito ao Girabola',
    category: 'Clubes',
    date: '06 ago. 2026',
    isoDate: '2026-08-06',
    summary: 'O clube da capital garantiu presença na edição 2026/2027 e prepara a primeira participação no principal campeonato nacional.',
    content: 'O FC Luanda garantiu o apuramento para a Liga Unitel Girabola 2026/2027, num marco descrito como inédito na história do clube. A promoção coloca a formação de Luanda entre os participantes da próxima edição do principal campeonato nacional.\n\nA equipa deverá agora concluir o processo de preparação desportiva e administrativa para a estreia entre a elite do futebol angolano.',
    status: 'pending_review',
    author: 'Redação Liga Unitel Girabola',
    sourceName: 'Jornal O País',
    sourceUrl: 'https://www.opais.ao/desporto/inedito-fc-luanda-garante-apuramento-ao-girabola-2026-2027/',
    aiAssisted: true,
  },
  {
    id: 'draft-huila-plantel-renovado',
    title: 'Desportivo da Huíla abre temporada com plantel renovado',
    category: 'Pré-época',
    date: '06 ago. 2026',
    isoDate: '2026-08-06',
    summary: 'A formação huilana inicia a preparação para a nova época com uma renovação próxima de metade do plantel.',
    content: 'O Desportivo da Huíla iniciou a temporada com uma renovação significativa do plantel. Segundo a ANGOP, cerca de 47 por cento do grupo foi renovado para a preparação da Liga Unitel Girabola 2026/2027.\n\nA reformulação procura dar novas opções à equipa técnica e criar condições para uma campanha competitiva no campeonato nacional.',
    status: 'pending_review',
    author: 'Redação Liga Unitel Girabola',
    sourceName: 'ANGOP',
    sourceUrl: 'https://angop.ao/noticias/desporto/desportivo-da-huila-abre-temporada-com-quase-metade-do-plantel-renovado/',
    aiAssisted: true,
  },
  {
    id: 'draft-academica-lobito-financiamento',
    title: 'Académica do Lobito procura apoios para disputar a nova época',
    category: 'Clubes',
    date: '06 ago. 2026',
    isoDate: '2026-08-06',
    summary: 'A direção da Briosa alerta para necessidades financeiras antes da participação no Girabola 2026/2027.',
    content: 'A Académica do Lobito procura mobilizar apoios financeiros para assegurar a participação na Liga Unitel Girabola 2026/2027. De acordo com o Jornal de Angola, o clube indicou uma necessidade de 300 milhões de kwanzas no quadro da preparação para a competição.\n\nPor se tratar de informação financeira sensível, o conteúdo deverá receber confirmação direta da direção do clube antes da publicação definitiva.',
    status: 'pending_review',
    author: 'Redação Liga Unitel Girabola',
    sourceName: 'Jornal de Angola',
    sourceUrl: 'https://jornaldeangola.ao/noticias/6/desporto/680778/acad%C3%A9mica-do-lobito-precisa-de-300-milh%C3%B5es',
    aiAssisted: true,
  },
  {
    id: 'n1',
    title: 'Petro de Luanda vence o clássico no 11 de Novembro contra 1.º de Agosto',
    category: 'Liga Unitel Girabola',
    date: '13 Jun 2026',
    isoDate: '2026-06-13',
    summary: 'Com golo solitário de Tiago Azulão aos 88 minutos, os tricolores asseguraram a liderança da tabela.',
    content: 'O clássico dos clássicos do futebol angolano terminou com a vitória tangencial do Petro de Luanda sobre o rival Primeiro de Agosto. Num jogo tenso e disputado taticamente, o avançado brasileiro Tiago Azulão voltou a ser decisivo, finalizando de cabeça um cruzamento milimétrico de Jaredi aos 88 minutos, despoletando a loucura no Estádio 11 de Novembro. Esta vitória consolida a liderança isolada dos tricolores na presente campanha de preparação da liga.'
  },
  {
    id: 'n2',
    title: 'Manuel Keliano destaca subida de rendimento no meio-campo',
    category: 'Entrevista',
    date: '12 Jun 2026',
    isoDate: '2026-06-12',
    summary: 'O internacional angolano analisou a fase positiva da equipa e o próximo jogo contra o Kabuscorp.',
    content: 'Em conferência de imprensa após os treinos do Primeiro de Agosto no complexo França Ndalu, o jovem virtuoso Manuel Keliano analisou a rápida transição da equipa para novos esquemas táticos. Keliano expressou que a intensidade imposta nos treinos começa a traduzir-se em exibições de classe, sublinhando que o grupo está altamente focado em garantir a vitória no próximo desafio contra o Kabuscorp do Palanca.'
  },
  {
    id: 'n3',
    title: 'Wiliete de Benguela garante histórico 2º lugar e vaga nas competições africanas',
    category: 'Competição',
    date: '09 Mai 2026',
    isoDate: '2026-05-09',
    summary: 'A formação de Benguela venceu o Interclube por 2-0 e garantiu uma participação histórica na Liga dos Campeões da CAF para a próxima época.',
    content: 'Benguela está em festa. O Wiliete de Benguela bateu o Interclube por duas bolas a zero no Estádio Nacional de Ombaka e carimbou a sua vaga oficial na Liga dos Campeões da CAF da próxima época. Com golos de Mano Mano e Karanga, a formação dirigida por Lito Vidigal coroou uma campanha fenomenal no Liga Unitel Girabola, consagrando-se como a grande surpresa do futebol nacional angolano.'
  },
  {
    id: 'n4',
    title: 'Dagó Tshibamba conquista Troféu de Melhor Marcador do Liga Unitel Girabola',
    category: 'Individual',
    date: '10 Mai 2026',
    isoDate: '2026-05-10',
    summary: 'O avançado congolês do 1.º de Agosto finalizou a temporada com 17 golos marcados, consagrando-se o principal goleador do futebol nacional angolano.',
    content: 'O troféu de artilheiro do futebol angolano tem novo dono. O avançado congolês Dagó Tshibamba fechou a época de ouro do 1.º de Agosto com 17 golos apontados na prova. Tshibamba demonstrou regularidade notável, sendo coroado oficialmente como o melhor marcador e grande estrela ofensiva do Liga Unitel Girabola.'
  },
  {
    id: 'n5',
    title: 'Requalificação do Estádio França Ndalu recebe luz verde da FAF',
    category: 'Infraestrutura',
    date: '24 Jun 2026',
    isoDate: '2026-06-24',
    summary: 'A comissão técnica vistoriou as obras e aprovou o relvado para as competições nacionais e internacionais da próxima época.',
    content: 'O Estádio França Ndalu, casa do 1.º de Agosto, recebeu luz verde da federação para acolher jogos de alto nível na próxima temporada. Após profundas obras de requalificação no relvado e nos balneários, a vistoria técnica da FAF confirmou que o recinto reúne todos os requisitos regulamentares, trazendo grande alento aos adeptos militares que poderão apoiar a equipa no seu reduto principal.'
  },
  {
    id: 'n6',
    title: 'FAF anuncia sorteio do calendário oficial para o Liga Unitel Girabola 2026/2027',
    category: 'Federação',
    date: '20 Jun 2026',
    isoDate: '2026-06-20',
    summary: 'O sorteio oficial definiu as 30 jornadas da nova época desportiva, sob o novo código de verificação unificado.',
    content: 'A Federação Angolana de Futebol (FAF) realizou o sorteio da nova edição do campeonato nacional no edifício-sede em Luanda. O sorteio estabeleceu um calendário emocionante a duas voltas para as 16 equipas concorrentes. Os jogos terão início a 12 de Setembro de 2026, com o Petro de Luanda a iniciar a defesa do título em casa contra o Desportivo da Lunda Sul.'
  }
];

// ── OVERRIDES DE CONTEÚDO EM RUNTIME (publicados no admin) ──────────
// A consola de administração publica as suas edições no Supabase
// (`ancaf_configs`, chaves `override_*`). No cliente, o PortalDataProvider lê
// esses blocos e chama setPortalOverrides(); os getters abaixo passam então a
// devolver os dados já com as edições aplicadas — sem alterar os consumidores.
export interface PortalOverrides {
  news?: { overrides?: Record<string, Partial<NewsArticle>>; added?: NewsArticle[]; deleted?: string[] };
  calendar?: Record<string, Partial<Match>>;                                   // por match.id
  players?: Record<string, Partial<Player>> | {
    overrides?: Record<string, Partial<Player>>;
    added?: Player[];
    removed?: string[];
  };
  nominations?: Record<string, Partial<MatchOfficials>>;                       // por match.id
  // Overrides de equipas: adds = novas equipas; removed = IDs removidos; overrides = edições
  teams?: { overrides?: Record<string, Partial<Team>>; added?: Team[]; removed?: string[] };
  site?: Partial<SiteSettings>;                                                // identidade global do portal
}

// ── IDENTIDADE GLOBAL DO PORTAL (editável no admin) ─────────────────
// Textos institucionais, contactos e paleta da marca. Publicados sob a chave
// `override_site` e aplicados em todo o portal pelo SiteSettingsProvider.
export interface SiteSettings {
  siteName: string;
  tagline: string;
  footerDescription: string;
  copyright: string;
  contactEmail: string;
  contactPhone: string;
  /** Telefone secundário (exibido no rodapé e página de contacto quando preenchido). */
  contactPhone2: string;
  contactAddress: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  /** URL do perfil no Twitter/X. */
  twitterUrl: string;
  /** Email de apoio técnico / TI (exibido na página de contacto). */
  supportEmail: string;
  /** Descrição SEO do portal (tag meta description). */
  metaDescription: string;
  /** Paleta da marca — aplicada como variáveis CSS (`--primary`, `--accent`). */
  primaryLight: string;
  accentLight: string;
  primaryDark: string;
  accentDark: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'Liga Unitel Girabola',
  tagline: 'Campeonato Nacional de Futebol de Angola',
  footerDescription:
    'Website oficial de resultados e estatísticas do Campeonato Nacional de Futebol de Angola, baseado no Futibool Engine.',
  copyright: 'Liga Unitel Girabola. Todos os direitos reservados.',
  contactEmail: 'geral@ancaf.co.ao',
  contactPhone: '+244 975 218 863',
  contactPhone2: '',
  contactAddress: 'Rua Comandante Eurico, nº 23, Ingombotas, Luanda, Angola',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  twitterUrl: '',
  supportEmail: 'it@ancaf.co.ao',
  metaDescription: 'Resultados ao vivo, classificação, calendário e estatísticas do Campeonato Nacional de Futebol de Angola — Liga Unitel Girabola.',
  primaryLight: '#5C0F8B',
  accentLight: '#E6540F',
  primaryDark: '#B368DB',
  accentDark: '#F07942',
};

let RUNTIME_OVERRIDES: PortalOverrides = {};

export function setPortalOverrides(next: PortalOverrides): void {
  RUNTIME_OVERRIDES = next ?? {};
}
export function getPortalOverrides(): PortalOverrides {
  return RUNTIME_OVERRIDES;
}

/** Identidade do portal já com as edições publicadas no admin aplicadas. */
export function getSiteSettings(): SiteSettings {
  return { ...DEFAULT_SITE_SETTINGS, ...(RUNTIME_OVERRIDES.site ?? {}) };
}

// Normaliza um jogo após aplicar um override: mantém `score` e os campos
// numéricos coerentes (o admin pode editar só o resultado ou só o marcador).
function normalizeMatchOverride(base: Match, patch: Partial<Match>): Match {
  const merged: Match = { ...base, ...patch };
  // Normaliza a grafia antiga que ainda pode existir em publicações guardadas
  // antes da correção oficial do recinto do FC Cabinda.
  if (
    merged.homeTeamId === 'cabinda'
    && ['Estádio Vicy António', 'Estádio Vicy António - Uige'].includes(merged.stadium)
  ) {
    merged.stadium = 'Estádio Vici António';
  }
  // Ao editar a data, o administrador publica-a como oficial, exceto quando
  // assinala explicitamente que continua por definir.
  if (patch.date !== undefined && patch.scheduleStatus === undefined) {
    merged.scheduleStatus = 'official';
  }
  const touchedScores = patch.homeScore !== undefined || patch.awayScore !== undefined;
  if (touchedScores && patch.score === undefined) {
    merged.score = `${merged.homeScore ?? 0}-${merged.awayScore ?? 0}`;
  } else if (patch.score !== undefined && !touchedScores) {
    const [h, a] = String(patch.score).split('-').map((n) => Number.parseInt(n, 10));
    if (Number.isFinite(h)) merged.homeScore = h;
    if (Number.isFinite(a)) merged.awayScore = a;
  }
  // Um resultado de futebol nunca pode ser negativo. Além de proteger dados
  // antigos, isto impede que um override inválido chegue aos vários placares.
  merged.homeScore = Math.max(0, Number.isFinite(merged.homeScore) ? Math.trunc(merged.homeScore) : 0);
  merged.awayScore = Math.max(0, Number.isFinite(merged.awayScore) ? Math.trunc(merged.awayScore) : 0);
  if (merged.status === 'finished') {
    merged.score = `${merged.homeScore}-${merged.awayScore}`;
  }
  return merged;
}

export function applyMatchOverrideMap(list: Match[], ov?: Record<string, Partial<Match>>): Match[] {
  return list.map((m) => {
    const named = {
      ...m,
      homeTeam: getTeamById(m.homeTeamId)?.name ?? m.homeTeam,
      awayTeam: getTeamById(m.awayTeamId)?.name ?? m.awayTeam,
    };
    return normalizeMatchOverride(named, ov?.[m.id] ?? {});
  });
}

export function applyRuntimeMatchOverrides(list: Match[]): Match[] {
  return applyMatchOverrideMap(list, RUNTIME_OVERRIDES.calendar);
}

// ── 7. FUNÇÕES AUXILIARES DE BUSCA ─────────────────────────────────
// Devolve a lista dinâmica de equipas respeitando os overrides do admin
// (equipas adicionadas/removidas/editadas pelo portal de administração).
export function getTeams(): Team[] {
  const ov = RUNTIME_OVERRIDES.teams;
  if (!ov) return TEAMS;

  // Começar com a lista base, aplicar overrides campo a campo, depois acrescentar novas
  const base = TEAMS
    .filter((t) => !ov.removed?.includes(t.id))
    .map((t) => ov.overrides?.[t.id] ? { ...t, ...ov.overrides[t.id] } : t);

  const extra = (ov.added ?? []).filter((a) => !base.some((b) => b.id === a.id));
  return [...base, ...extra];
}

// Inclui os clubes promovidos de 2026/2027 (motor ANCAF) e quaisquer equipas
// adicionadas dinamicamente no admin, para que páginas de clube e detalhes de
// jogo da nova época resolvam corretamente.
export function getAllTeams(): Team[] {
  const teams = getTeams();
  const removed = new Set(RUNTIME_OVERRIDES.teams?.removed ?? []);
  const promoted = PROMOTED_2026_27_TEAMS.filter((p) => !removed.has(p.id) && !teams.some((t) => t.id === p.id));
  return [
    ...teams,
    ...promoted,
    ...HISTORICAL_TEAMS.filter((h) => !removed.has(h.id) && !teams.some((t) => t.id === h.id)),
  ];
}

/** Alias estático para compatibilidade — prefer getAllTeams() or getTeams() at runtime. */
export const ALL_TEAMS: Team[] = [...TEAMS, ...PROMOTED_2026_27_TEAMS, ...HISTORICAL_TEAMS];

export function getTeamById(id: string): Team | undefined {
  return getAllTeams().find(t => t.id === id);
}

// Classificação recalculada a partir dos jogos já com overrides aplicados, para
// que uma edição de resultado no admin se reflita na tabela pública.
export function getStandings(): StandingEntry[] {
  return getStandingsForSeason(CURRENT_SEASON_ID);
}

/**
 * Classificação por época, priorizando tabelas finais publicadas oficialmente.
 *
 * A tabela final de 2025/2026 publica J/V/E/D, golos e pontos. A forma recente
 * é recuperada dos resultados existentes no portal quando esses jogos estão
 * disponíveis, sem alterar os números finais da classificação.
 */
export function getStandingsForSeason(seasonId: string): StandingEntry[] {
  const computed = computeStandings(getMatchesForSeason(seasonId));
  const official = OFFICIAL_STANDINGS[seasonId];

  if (!official) return computed;

  // Ao publicar uma correção de resultado no admin, a classificação passa a
  // ser recalculada a partir desses jogos. Sem edições, preserva-se a tabela
  // final oficial registada para a época histórica.
  const seasonMatchIds = new Set(getMatchesForSeason(seasonId).map((match) => match.id));
  const hasPublishedResultEdits = Object.keys(RUNTIME_OVERRIDES.calendar ?? {}).some((id) => seasonMatchIds.has(id));
  if (hasPublishedResultEdits) return computed;

  const computedByTeam = new Map(computed.map((row) => [row.teamId, row]));
  return official.map((row) => {
    const calculated = computedByTeam.get(row.teamId);
    if (!calculated?.form.length) return row;

    return {
      ...row,
      form: calculated.form,
      formVerified: true,
    };
  });
}

export function getStandingByTeamId(teamId: string): StandingEntry | undefined {
  return getStandings().find(s => s.teamId === teamId);
}

export function getMatches(): Match[] {
  return getMatchesForSeason(CURRENT_SEASON_ID);
}

// Calendário por época — 2026/2027 corresponde ao ficheiro do ANCAF_CALENDAR.
export function getMatchesForSeason(seasonId: string): Match[] {
  // A ordem é intencional: base da época → agenda oficial → edição publicada.
  // Assim, o administrador é sempre a última autoridade sobre cada jogo.
  if (seasonId === UPCOMING_SEASON_ID) {
    return applyRuntimeMatchOverrides(applyOfficialMatchSchedule(applySeasonHomeStadiums(MATCHES_2026_27)));
  }
  if (HISTORICAL_MATCHES[seasonId]) return applyRuntimeMatchOverrides(HISTORICAL_MATCHES[seasonId]);
  return applyRuntimeMatchOverrides(MATCHES);
}

export function getMatchesByTeam(teamId: string, seasonId = UPCOMING_SEASON_ID): Match[] {
  return getMatchesForSeason(seasonId).filter(m => m.homeTeamId === teamId || m.awayTeamId === teamId);
}

// Aplica os overrides de jogador (admin) sobre os dados brutos e reenriquece,
// para que golos/estatísticas editados sejam recalculados de forma coerente.
function computePlayers(): Player[] {
  const ov = RUNTIME_OVERRIDES.players;
  if (!ov) return PLAYERS;
  // Compatibilidade com o formato antigo, que era apenas um mapa id -> patch.
  const isStore = Object.prototype.hasOwnProperty.call(ov, 'overrides')
    || Object.prototype.hasOwnProperty.call(ov, 'added')
    || Object.prototype.hasOwnProperty.call(ov, 'removed');
  const store = ov as { overrides?: Record<string, Partial<Player>>; added?: Player[]; removed?: string[] };
  const overrides: Record<string, Partial<Player>> = isStore
    ? store.overrides ?? {}
    : ov as Record<string, Partial<Player>>;
  const removed = new Set<string>(isStore ? store.removed ?? [] : []);
  const base = CURRENT_PLAYERS_RAW
    .filter((p) => !removed.has(p.id))
    .map((p) => enrichPlayer({ ...p, ...overrides[p.id] }));
  const added = isStore ? (store.added ?? []).filter((p) => !removed.has(p.id)) : [];
  return [...added.map(enrichPlayer), ...base];
}

export function getPlayers(): Player[] {
  return computePlayers();
}

export function getCurrentSeasonDiscipline() {
  return getPlayers()
    .map((player) => ({
      id: player.id,
      name: player.name,
      club: player.club,
      teamId: player.teamId,
      position: player.position,
      appearances: player.appearances,
      yellowCards: player.detailedStats?.yellowCards ?? 0,
      redCards: player.detailedStats?.redCards ?? 0,
    }))
    .filter((player) => player.yellowCards > 0 || player.redCards > 0)
    .sort((a, b) => b.redCards - a.redCards || b.yellowCards - a.yellowCards || a.name.localeCompare(b.name));
}

export function getPlayersByTeam(teamId: string): Player[] {
  return computePlayers().filter(p => p.teamId === teamId);
}

export function getPlayerById(id: string): Player | undefined {
  return computePlayers().find(p => p.id === id);
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
  const match = (id.startsWith('m27-') ? getMatchesForSeason(UPCOMING_SEASON_ID).find(m => m.id === id) : undefined)
    ?? MATCHES.find(m => m.id === id)
    ?? Object.values(HISTORICAL_MATCHES).flat().find(m => m.id === id);
  return match ? applyRuntimeMatchOverrides([match])[0] : undefined;
}

export function getTopScorers(): PlayerStats[] {
  return TOP_SCORERS;
}

export function getTopAssists(): PlayerStats[] {
  return TOP_ASSISTS;
}

export function getNewsArticles(): NewsArticle[] {
  // Aplica os overrides publicados no admin (edições, novos artigos, remoções)
  // e ordena por data cronológica decrescente (mais recente primeiro).
  const ov = RUNTIME_OVERRIDES.news;
  const deleted = new Set(ov?.deleted ?? []);
  const merged = [...(ov?.added ?? []), ...newsMock]
    .filter((a) => !deleted.has(a.id))
    .map((a) => (ov?.overrides?.[a.id] ? { ...a, ...ov.overrides[a.id] } : a))
    // Política editorial fail-closed: conteúdos antigos, rascunhos ou peças
    // ainda em validação nunca aparecem no portal público.
    .filter((a) => a.status === 'published');
  return merged.sort((a, b) => (b.isoDate ?? '').localeCompare(a.isoDate ?? ''));
}

/** Identifica conteúdos editoriais reservados à comunicação institucional. */
export function isOfficialCommunication(article: NewsArticle): boolean {
  const category = article.category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  return category.includes('comunicado')
    || category.includes('oficial')
    || category === 'federacao';
}

export function getOfficialCommunications(): NewsArticle[] {
  return getNewsArticles().filter(isOfficialCommunication);
}

export function getNewsArticleById(id: string): NewsArticle | undefined {
  return getNewsArticles().find(n => n.id === id);
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
  minute?: number;            // ausente quando a fonte ainda não publicou o minuto
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
  manOfTheMatch?: { name: string; playerId?: string; rating: number; team: 'home' | 'away' };
}

const SQUAD_FIRST = ['Manuel', 'João', 'Pedro', 'Alberto', 'Geraldo', 'Mateus', 'Domingos', 'Carlos', 'Bruno', 'Hélder', 'Nuno', 'Ivo', 'Cláudio', 'Wilson', 'Fredy', 'Gilberto', 'Yuri', 'Dani', 'Zito', 'Job', 'Edmilson', 'Buatu', 'Picas', 'Bastos'];
const SQUAD_LAST = ['Cabungula', 'Capita', 'Buá', 'Catraio', 'Mavinga', 'Manucho', 'Bero', 'Lamá', 'Quinito', 'Bokila', 'Kialonda', 'Afonso', 'Nzola', 'Caboco', 'Wilá', 'Fabrício', 'Massunguna', 'Ginga', 'Depú', 'Isaac', 'Gelson', 'Tó Carneiro', 'Macaia', 'Bambi'];
export const BROADCASTERS = ['ZSports', 'Por confirmar'];

// Clubes angolanos nas Afro Taças. Nos jogos do Girabola entre duas destas
// equipas, a transmissão é sempre assegurada pela ZSports.

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

/** Escalações oficiais publicadas pelos clubes para o jogo inaugural. */
function getPublishedLundaSulPetroLineups(match: Match): { home: LineupPlayer[]; away: LineupPlayer[] } | undefined {
  if (match.round !== 1 || match.homeTeamId !== 'lundasul' || match.awayTeamId !== 'petro') return undefined;

  const player = (
    name: string,
    playerId: string,
    number: number,
    position: PitchPosition,
    isStarter: boolean,
  ): LineupPlayer => ({ name, playerId, number, position, isStarter, rating: 0 });

  return {
    home: [
      player('Kacusso', 'cacusso', 12, 'GK', true),
      player('Fredy', 'fred', 5, 'DEF', true),
      player('Dieu', 'dieu', 25, 'DEF', true),
      player('Kibuata', 'kibuata', 28, 'DEF', true),
      player('Platiny', 'platini', 6, 'MID', true),
      player('Vado', 'vado-lunda-sul', 8, 'MID', true),
      player('Maranata', 'maranata', 10, 'MID', true),
      player('Magrinho', 'magrinho', 11, 'FWD', true),
      player('Manucho', 'manucho-lunda-sul', 19, 'FWD', true),
      player('Mussá', 'mussa-lunda-sul', 20, 'FWD', true),
      player('Joca', 'joca-lunda-sul', 27, 'FWD', true),
      player('Nonó', 'nono', 2, 'DEF', false),
      player('Yuri', 'yuri', 4, 'DEF', false),
      player('Neymar', 'neymar-lunda-sul', 7, 'FWD', false),
      player('Ximba', 'ximba', 16, 'MID', false),
      player('Jepson', 'jepson', 17, 'FWD', false),
      player('Mongadié', 'mongadie', 23, 'DEF', false),
      player('Sozito', 'sozito', 26, 'DEF', false),
      player('Zonzo', 'zonzo', 33, 'MID', false),
      player('Nicon', 'nicon', 34, 'MID', false),
      player('Fuca', 'fuca', 35, 'FWD', false),
      player('Angola', 'angola-gr', 41, 'GK', false),
    ],
    away: [
      player('Neblú', 'neblu', 22, 'GK', true),
      player('Rúben Adérito', 'ruben-aderito', 4, 'DEF', true),
      player('Léo Bolgado', 'leo-bolgado', 5, 'DEF', true),
      player('Berna', 'berna', 13, 'DEF', true),
      player('Eddie Afonso', 'eddie-afonso', 25, 'DEF', true),
      player('Mário Balbúrdia', 'mario-balburdia', 6, 'MID', true),
      player('Jonathan Toro', 'jonathan-toro', 8, 'MID', true),
      player('Pedro Aparício', 'pedro-aparicio', 10, 'MID', true),
      player('Deybi Flores', 'deybi-flores', 12, 'MID', true),
      player('Ivan Cavaleiro', 'ivan-cavaleiro', 7, 'FWD', true),
      player('Tiago Azulão', 'tiago-azulao', 26, 'FWD', true),
      player('Hugo Marques', 'hugo-marques', 1, 'GK', false),
      player('Núrio Fortuna', 'nurio-fortuna', 2, 'DEF', false),
      player('Hélder Costa', 'helder-costa', 11, 'FWD', false),
      player('Vidinho', 'vidinho', 18, 'DEF', false),
      player('Jorge Pereira', 'jorge-pereira', 20, 'MID', false),
      player('Tiago Reis', 'tiago-reis', 23, 'FWD', false),
      player('António Hossi', 'antonio-hossi', 27, 'DEF', false),
      player('Depú', 'depu', 29, 'FWD', false),
      player('Ilídio Panda', 'ilidio-panda', 33, 'FWD', false),
    ],
  };
}

/** Convocatórias oficiais do 1.º de Agosto–Desportivo da Huíla (1.ª jornada). */
function getPublishedAgostoHuilaLineups(match: Match): { home: LineupPlayer[]; away: LineupPlayer[] } | undefined {
  if (match.id !== 'm27-1-3') return undefined;

  const player = (
    name: string,
    number: number,
    position: PitchPosition,
    isStarter: boolean,
    playerId?: string,
  ): LineupPlayer => ({ name, number, position, isStarter, playerId, rating: 0 });

  return {
    home: [
      player('Nuno', 1, 'GK', true),
      player('Bonifácio', 5, 'DEF', true),
      player('Mabelé', 3, 'DEF', true),
      player('Macaia', 16, 'DEF', true),
      player('Milton', 2, 'DEF', true),
      player('Calebi', 10, 'MID', true),
      player('Venâncio', 15, 'MID', true),
      player('Mabilson', 7, 'MID', true),
      player('Fernando', 11, 'FWD', true),
      player('Rupson', 9, 'FWD', true),
      player('Dagó', 17, 'FWD', true, 'dago-tshibamba'),
      player('Anselmo', 22, 'GK', false),
      player('Benção', 36, 'DEF', false),
      player('Bulaya', 28, 'DEF', false),
      player('Castro', 27, 'MID', false),
      player('Tombé', 20, 'MID', false),
      player('Clíver', 18, 'MID', false),
      player('Obed', 14, 'FWD', false),
      player('Axel', 8, 'FWD', false),
      player('Bruno', 6, 'FWD', false),
    ],
    away: [
      player('Ndulo', 1, 'GK', true),
      player('Ludy', 13, 'DEF', true),
      player('Dos Santos', 4, 'DEF', true),
      player('Katendi', 2, 'DEF', true),
      player('Jeremias', 26, 'DEF', true),
      player('Elias', 15, 'MID', true),
      player('Tchutchu', 21, 'MID', true),
      player('Constantino', 32, 'MID', true),
      player('Milton', 18, 'FWD', true),
      player('Milagre', 25, 'FWD', true),
      player('Mendes', 10, 'FWD', true),
      player('Passy', 12, 'GK', false),
      player('Jo', 6, 'DEF', false),
      player('Cabibi', 7, 'DEF', false),
      player('Jeizi', 8, 'MID', false),
      player('Toyzinho', 20, 'MID', false),
      player('António', 27, 'MID', false),
      player('Cagodo', 29, 'FWD', false),
      player('Jony', 34, 'FWD', false),
      player('Geovany', 35, 'FWD', false),
    ],
  };
}

/** Onze inicial e bancos oficiais de Bravos–Sagrada na 1.ª jornada. */
function getPublishedBravosSagradaLineups(match: Match): { home: LineupPlayer[]; away: LineupPlayer[] } | undefined {
  if (match.id !== 'm27-1-2') return undefined;

  const player = (
    name: string,
    playerId: string,
    number: number,
    position: PitchPosition,
    isStarter: boolean,
  ): LineupPlayer => ({ name, playerId, number, position, isStarter, rating: 0 });

  return {
    home: [
      player('Nathan', 'nathan-bravos', 22, 'GK', true),
      player('Manico', 'manico-bravos', 26, 'DEF', true),
      player('Denilson', 'denilson-bravos', 2, 'DEF', true),
      player('Caprego', 'caprego-bravos', 24, 'DEF', true),
      player('Dabanda', 'dabanda-bravos', 27, 'DEF', true),
      player('Abrão', 'abrao-bravos', 6, 'MID', true),
      player('Cueta', 'cueta-bravos', 7, 'MID', true),
      player('Ju Cabral', 'ju-cabral-bravos', 8, 'MID', true),
      player('Jorginho', 'jorginho-bravos', 19, 'FWD', true),
      player('Lito', 'lito-bravos', 23, 'FWD', true),
      player('Bani', 'bani-bravos', 20, 'FWD', true),
      player('Agnaldo', 'agnaldo-bravos', 3, 'DEF', false),
      player('Higino', 'higino-bravos', 10, 'MID', false),
      player('Tiago', 'tiago-bravos', 15, 'FWD', false),
      player('Eduwine', 'eduwine-bravos', 17, 'FWD', false),
      player('Gladilson', 'gladilson-bravos', 28, 'FWD', false),
      player('Tony', 'tony-bravos', 0, 'MID', false),
      player('Saidi', 'saidi-bravos', 0, 'GK', false),
      player('Bruno', 'bruno-bravos', 0, 'DEF', false),
    ],
    away: [
      player('Leonardo', 'leonardo-sagrada', 13, 'GK', true),
      player('Miguel', 'miguel-sagrada', 5, 'DEF', true),
      player('Tobias', 'tobias-sagrada', 14, 'DEF', true),
      player('Gogoró', 'gogoro-sagrada', 17, 'DEF', true),
      player('Luís Tati', 'luis-tati-sagrada', 20, 'DEF', true),
      player('Cahilo', 'cahilo-sagrada', 32, 'MID', true),
      player('Afonso', 'afonso-sagrada', 24, 'MID', true),
      player('Lépua', 'lepua-sagrada', 10, 'MID', true),
      player('Pimpão', 'pimpao-sagrada', 16, 'FWD', true),
      player('Dabanda', 'dabanda-sagrada', 7, 'FWD', true),
      player('Jorge', 'jorge-sagrada', 9, 'FWD', true),
      player('Nsesani', 'nsesani-sagrada', 12, 'GK', false),
      player('Silvano', 'silvano-sagrada', 18, 'FWD', false),
      player('Barreira', 'barreira-sagrada', 28, 'DEF', false),
      player('Sapalo', 'sapalo-sagrada', 31, 'MID', false),
      player('Melono', 'melono-sagrada', 11, 'FWD', false),
      player('Guilherme', 'guilherme-sagrada', 8, 'MID', false),
      player('Evaristo', 'evaristo-sagrada', 4, 'DEF', false),
      player('Manuel', 'manuel-sagrada', 3, 'DEF', false),
    ],
  };
}

/** Escalações confirmadas de FC Cabinda–Recreativo do Libolo. */
function getPublishedCabindaLiboloLineups(match: Match): { home: LineupPlayer[]; away: LineupPlayer[] } | undefined {
  if (match.id !== 'm27-1-7') return undefined;
  const player = (name: string, playerId: string, number: number, position: PitchPosition, isStarter: boolean): LineupPlayer =>
    ({ name, playerId, number, position, isStarter, rating: 0 });

  return {
    home: [
      player('Francisco', 'francisco-cabinda', 12, 'GK', true),
      player('Rodrigo', 'rodrigo-cabinda', 2, 'DEF', true),
      player('Frederico', 'frederico-cabinda', 20, 'DEF', true),
      player('Marcos', 'marcos-cabinda', 5, 'DEF', true),
      player('António', 'antonio-cabinda', 16, 'DEF', true),
      player('Júlio', 'julio-cabinda', 17, 'MID', true),
      player('Cristiano', 'cristiano-cabinda', 8, 'MID', true),
      player('Fernando', 'fernando-cabinda', 21, 'MID', true),
      player('Gedeon', 'gedeon-cabinda', 3, 'FWD', true),
      player('José', 'jose-cabinda', 18, 'FWD', true),
      player('Ariclenis', 'ariclenis-cabinda', 29, 'FWD', true),
      player('Brás', 'bras-cabinda', 0, 'FWD', false),
      player('Cornélio', 'cornelio-cabinda', 0, 'FWD', false),
      player('Costa', 'costa-cabinda', 0, 'MID', false),
    ],
    away: [
      player('Beny', 'beny-libolo', 12, 'GK', true),
      player('Marcos', 'marcos-libolo', 3, 'DEF', true),
      player('Toti', 'toti-libolo', 4, 'DEF', true),
      player('Maninho', 'maninho-libolo', 5, 'DEF', true),
      player('Tchube', 'tchube-libolo', 8, 'DEF', true),
      player('Chimito', 'chimito-libolo', 6, 'MID', true),
      player('Andeloy', 'andeloy-libolo', 10, 'MID', true),
      player('Nelo', 'nelo-libolo', 14, 'MID', true),
      player('Pedro', 'pedro-libolo', 17, 'FWD', true),
      player('Tubarão', 'tubarao-libolo', 30, 'FWD', true),
      player('Cuxixima', 'cuxixima-libolo', 27, 'FWD', true),
      player('Mário', 'mario-libolo', 20, 'GK', false),
      player('Jamanta', 'jamanta-libolo', 19, 'FWD', false),
      player('Jorgito', 'jorgito-libolo', 15, 'MID', false),
      player('Zidane', 'zidane-libolo', 22, 'MID', false),
      player('Catraio', 'catraio-libolo', 24, 'DEF', false),
      player('Miro', 'miro-libolo', 25, 'DEF', false),
      player('Lara', 'lara-libolo', 28, 'FWD', false),
    ],
  };
}

/** Ocorrências confirmadas do jogo inaugural, sem dados demonstrativos. */
function getPublishedMatchEvents(match: Match): MatchEventDetail[] | undefined {
  if (match.id === 'm27-1-1') return [
    { minute: 14, type: 'red', team: 'away', player: 'Jogador do CR Caála por confirmar' },
  ];

  if (match.id === 'm27-1-2') return [
    { type: 'goal', team: 'home', player: 'Ju Cabral', playerId: 'ju-cabral-bravos', detail: 'Minuto por confirmar' },
    { type: 'goal', team: 'home', player: 'Lito', playerId: 'lito-bravos', detail: 'Minuto por confirmar' },
    { type: 'goal', team: 'home', player: 'Gladilson', playerId: 'gladilson-bravos', detail: 'Minuto por confirmar' },
    { minute: 6, type: 'yellow', team: 'away', player: 'Cahilo', playerId: 'cahilo-sagrada' },
    { minute: 45, type: 'sub', team: 'home', player: 'Higino', playerId: 'higino-bravos', playerOut: 'Cueta' },
    { minute: 45, type: 'sub', team: 'home', player: 'Tony', playerId: 'tony-bravos', playerOut: 'Bani' },
    { minute: 45, type: 'sub', team: 'away', player: 'Melono', playerId: 'melono-sagrada', playerOut: 'Dabanda' },
    { minute: 45, type: 'sub', team: 'away', player: 'Guilherme', playerId: 'guilherme-sagrada', playerOut: 'Cahilo' },
    { minute: 48, type: 'yellow', team: 'away', player: 'Miguel', playerId: 'miguel-sagrada' },
    { minute: 49, type: 'yellow', team: 'home', player: 'Ju Cabral', playerId: 'ju-cabral-bravos' },
    { minute: 51, type: 'yellow', team: 'away', player: 'Pimpão', playerId: 'pimpao-sagrada' },
    { minute: 60, type: 'sub', team: 'home', player: 'Gladilson', playerId: 'gladilson-bravos', playerOut: 'Lito' },
    { minute: 69, type: 'sub', team: 'away', player: 'Silvano', playerId: 'silvano-sagrada', playerOut: 'Pimpão' },
    { minute: 75, type: 'sub', team: 'home', player: 'Tiago', playerId: 'tiago-bravos', playerOut: 'Ju Cabral' },
    { minute: 86, type: 'yellow', team: 'home', player: 'Dabanda', playerId: 'dabanda-bravos' },
    { minute: 88, type: 'sub', team: 'home', player: 'Eduwine', playerId: 'eduwine-bravos', playerOut: 'Jorginho' },
  ];

  if (match.id === 'm27-1-3') return [
    { minute: 92, type: 'goal', team: 'home', player: 'Dagó Tshibamba', playerId: 'dago-tshibamba', detail: "90'+2" },
  ];

  if (match.id === 'm27-1-5') return [
    { minute: 11, type: 'goal', team: 'home', player: 'Kabelo Dlamini' },
    { minute: 47, type: 'goal', team: 'home', player: 'Valter Monteiro', detail: "45'+2" },
  ];

  if (match.id === 'm27-1-6') return [
    { minute: 23, type: 'goal', team: 'home', player: 'Marcador por confirmar' },
    { minute: 65, type: 'goal', team: 'away', player: 'Marcador por confirmar' },
  ];

  if (match.id === 'm27-1-7') return [
    { minute: 14, type: 'yellow', team: 'home', player: 'Marcos', playerId: 'marcos-cabinda' },
    { minute: 27, type: 'sub', team: 'home', player: 'Brás', playerId: 'bras-cabinda', playerOut: 'José' },
    { minute: 34, type: 'goal', team: 'away', player: 'Cuxixima', playerId: 'cuxixima-libolo' },
    { minute: 55, type: 'yellow', team: 'home', player: 'António', playerId: 'antonio-cabinda' },
    { minute: 56, type: 'sub', team: 'home', player: 'Cornélio', playerId: 'cornelio-cabinda', playerOut: 'Gedeon' },
    { minute: 66, type: 'sub', team: 'home', player: 'Costa', playerId: 'costa-cabinda', playerOut: 'Júlio' },
    { minute: 70, type: 'goal', team: 'away', player: 'Pedro', playerId: 'pedro-libolo' },
    { minute: 70, type: 'sub', team: 'away', player: 'Zidane', playerId: 'zidane-libolo', playerOut: 'Pedro' },
    { minute: 73, type: 'goal', team: 'away', player: 'Andeloy', playerId: 'andeloy-libolo' },
    { minute: 76, type: 'sub', team: 'away', player: 'Miro', playerId: 'miro-libolo', playerOut: 'Chimito' },
    { minute: 76, type: 'sub', team: 'away', player: 'Catraio', playerId: 'catraio-libolo', playerOut: 'Maninho' },
    { minute: 85, type: 'sub', team: 'away', player: 'Jamanta', playerId: 'jamanta-libolo', playerOut: 'Andeloy' },
  ];

  if (match.id === 'm27-1-8') return [
    { minute: 70, type: 'goal', team: 'away', player: 'Além' },
  ];

  if (match.id !== 'm27-1-4') return undefined;
  return [
    { minute: 45, type: 'sub', team: 'away', player: 'Ilídio Panda', playerId: 'ilidio-panda', playerOut: 'Ivan Cavaleiro' },
    { minute: 45, type: 'sub', team: 'home', player: 'Neymar', playerId: 'neymar-lunda-sul', playerOut: 'Maranata' },
    { minute: 53, type: 'yellow', team: 'away', player: 'Deybi Flores', playerId: 'deybi-flores' },
    { minute: 60, type: 'sub', team: 'away', player: 'António Hossi', playerId: 'antonio-hossi', playerOut: 'Eddie Afonso' },
    { minute: 60, type: 'sub', team: 'away', player: 'Hélder Costa', playerId: 'helder-costa', playerOut: 'Pedro Aparício' },
    { minute: 63, type: 'yellow', team: 'away', player: 'António Hossi', playerId: 'antonio-hossi' },
    { minute: 65, type: 'sub', team: 'home', player: 'Nicon', playerId: 'nicon', playerOut: 'Joca' },
    { minute: 65, type: 'sub', team: 'home', player: 'Jepson', playerId: 'jepson', playerOut: 'Mussá' },
    { minute: 73, type: 'sub', team: 'away', player: 'Depú', playerId: 'depu', playerOut: 'Tiago Azulão' },
    { minute: 73, type: 'sub', team: 'away', player: 'Tiago Reis', playerId: 'tiago-reis', playerOut: 'Jonathan Toro' },
    { minute: 73, type: 'sub', team: 'home', player: 'Zonzo', playerId: 'zonzo', playerOut: 'Magrinho' },
    { minute: 76, type: 'yellow', team: 'away', player: 'Berna', playerId: 'berna' },
  ];
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
  const publishedLineups = getPublishedBravosSagradaLineups(match)
    ?? getPublishedCabindaLiboloLineups(match)
    ?? getPublishedAgostoHuilaLineups(match)
    ?? getPublishedLundaSulPetroLineups(match);
  const homeLineup = publishedLineups?.home ?? buildLineup(match.homeTeamId, seed);
  const awayLineup = publishedLineups?.away ?? buildLineup(match.awayTeamId, seed + 7);

  const possessionHome = seededInt(seed, 1, 40, 62);
  const homeStats = buildTeamStats(seed, match.homeScore, match.awayScore, possessionHome);
  const awayStats = buildTeamStats(seed + 31, match.awayScore, match.homeScore, 100 - possessionHome);
  if (match.id === 'm27-1-1') {
    homeStats.corners = 1;
    awayStats.corners = 0;
    homeStats.yellowCards = 0;
    awayStats.yellowCards = 1;
    homeStats.redCards = 0;
    awayStats.redCards = 1;
  }
  if (match.id === 'm27-1-3') {
    homeStats.corners = 0;
    awayStats.corners = 1;
    homeStats.yellowCards = 3;
    awayStats.yellowCards = 1;
  }
  if (match.id === 'm27-1-2') {
    homeStats.yellowCards = 2;
    awayStats.yellowCards = 3;
    homeStats.redCards = 0;
    awayStats.redCards = 0;
  }
  if (match.id === 'm27-1-7') {
    homeStats.yellowCards = 2;
    homeStats.redCards = 0;
    awayStats.yellowCards = 0;
    awayStats.redCards = 0;
  }
  if (match.id === 'm27-1-5') {
    homeStats.corners = 0;
    awayStats.corners = 0;
    homeStats.yellowCards = 0;
    awayStats.yellowCards = 1;
  }
  if (match.id === 'm27-1-6') {
    homeStats.corners = 1;
    awayStats.corners = 0;
    homeStats.yellowCards = 2;
    awayStats.yellowCards = 4;
  }
  // Coerência das defesas: defesas do GR = remates à baliza do adversário - golos sofridos
  homeStats.saves = Math.max(0, awayStats.shotsOnTarget - match.awayScore);
  awayStats.saves = Math.max(0, homeStats.shotsOnTarget - match.homeScore);

  const events: MatchEventDetail[] = [];
  const publishedEvents = getPublishedMatchEvents(match);

  if (match.status === 'finished' || match.status === 'live') {
    if (publishedEvents) {
      events.push(...publishedEvents);
    } else {
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
  }

  // Eventos cujo minuto ainda não foi confirmado aparecem primeiro, com
  // indicação explícita, e nunca recebem um minuto inventado.
  events.sort((a, b) => (a.minute ?? -1) - (b.minute ?? -1));

  const allStarters = publishedEvents
    ? []
    : [...homeLineup.filter(p => p.isStarter && p.rating > 0).map(p => ({ ...p, team: 'home' as const })), ...awayLineup.filter(p => p.isStarter && p.rating > 0).map(p => ({ ...p, team: 'away' as const }))];
  const motmSrc = allStarters.sort((a, b) => b.rating - a.rating)[0];
  const manOfTheMatch = motmSrc
    ? { name: motmSrc.name, playerId: motmSrc.playerId, rating: motmSrc.rating, team: motmSrc.team }
    : undefined;

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

// ── FICHA DE JOGO: ARBITRAGEM, TRANSMISSÃO E TEMPO ÚTIL ──────────────
// Helpers partilhados entre cartões de jogo, ficha de jogo e abas do hub de
// competição, para que os mesmos dados apareçam de forma consistente em todo
// o site. Valores da BD (Match.referee/broadcaster) têm sempre prioridade.

export interface MatchOfficials {
  referee: string;
  assistants: [string, string];
  fourth: string;
  commissioner?: string;
}

export function getMatchOfficials(match: Match): MatchOfficials {
  const ov = RUNTIME_OVERRIDES.nominations?.[match.id];
  const defined = (value?: string) => value?.trim() || 'A definir';
  const publishedByMatch: Readonly<Record<string, MatchOfficials>> = {
    'm27-1-2': {
      referee: 'Sanda Mateus Miguel Kitu',
      assistants: ['Natarino António Soares', 'Nelson Lutumba Quiala'],
      fourth: 'Custódio Roque Lote',
      commissioner: 'Alfredo João',
    },
    'm27-1-3': {
      referee: 'Edilson Roberto Gomes André',
      assistants: ['Manuel Luís Benguela', 'Joaquim Manuel Chiyo'],
      fourth: 'Miguel Julião Mateus',
      commissioner: 'Vicente Domingos Napoleão Garcia',
    },
    'm27-1-4': {
      referee: 'Miguel Tchissingu Augusto Américo',
      assistants: ['João Manuel Fula António', 'Nery Domingos Pereira Amador da Silva'],
      fourth: 'Isaías Justino Camaxi',
      commissioner: 'Alberto Bumba Senda',
    },
    'm27-1-7': {
      referee: 'Nelson João Milagre',
      assistants: ['Manuel Daniel Coelho', 'Hélder João Milagre'],
      fourth: 'Laurindo Feliciano Aureleo',
      commissioner: 'Dinilson Gourgel Ferreira De Almeida',
    },
  };
  const published = publishedByMatch[match.id];

  return {
    referee: defined(ov?.referee ?? match.referee ?? published?.referee),
    assistants: [
      defined(ov?.assistants?.[0] ?? published?.assistants[0]),
      defined(ov?.assistants?.[1] ?? published?.assistants[1]),
    ],
    fourth: defined(ov?.fourth ?? published?.fourth),
    commissioner: published?.commissioner,
  };
}

export function getMatchBroadcast(match: Match): string {
  if (match.broadcaster) return match.broadcaster;

  // Petro e Wiliete são os representantes já identificados para as provas
  // africanas; a existência de transmissão é prevista, mas o canal ainda não.
  const hasAfricanRepresentative = ['petro', 'wiliete'].some(
    (teamId) => match.homeTeamId === teamId || match.awayTeamId === teamId,
  );

  return hasAfricanRepresentative ? 'Transmissão por confirmar' : 'Por confirmar';
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
  scheduleStatus?: Match['scheduleStatus'];
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
    scheduleStatus: m.scheduleStatus,
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
      { title: 'Liga Unitel Girabola', count: 20, seasons: ['2025/26', '2023/24', '2022/23'] },
      { title: 'Taça de Angola', count: 15 },
      { title: 'Supertaça de Angola', count: 10, seasons: ['2026/27', '2025/26', '2024/25', '2023/24'] },
    ],
    kits: [
      { label: 'Principal', colors: ['#F9C304', '#F9C304'] },
      { label: 'Secundário', colors: ['#000000', '#000000'] },
    ],
    board: [
      { role: 'Presidente', name: 'Tomás Faria' },
      { role: 'Vice-presidente', name: 'Nuno Saraiva' },
      { role: 'Diretor Desportivo', name: 'Love Kabungula' },
    ],
  },
  dago: {
    officialName: 'Clube Desportivo 1.º de Agosto — Futebol',
    president: 'Gouveia de Sá Miranda',
    socials: {
      facebook: 'https://www.facebook.com/clube1deagosto/',
      instagram: 'https://www.instagram.com/clube1deagosto/',
    },
    palmares: [
      { title: 'Liga Unitel Girabola', count: 13, seasons: ['2018/19', '2017/18', '2016/17'] },
      { title: 'Taça de Angola', count: 6 },
      { title: 'Supertaça de Angola', count: 10 },
    ],
    board: [
      { role: 'Presidente', name: 'Gouveia de Sá Miranda' },
      { role: 'Vice-presidente', name: 'Adilson Kiala' },
      { role: 'Diretor Desportivo', name: 'Beto Almeida' },
    ],
  },
  sagrada: {
    officialName: 'Clube Desportivo Sagrada Esperança — Futebol',
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
      { title: 'Taça de Angola', count: 1 },
      { title: 'Supertaça de Angola', count: 2 },
    ],
  },
  wiliete: {
    officialName: 'Wiliete Sport Clube de Benguela — Futebol',
    president: 'Wilson Faria',
    website: 'https://wilietesc.ao/',
    socials: {
      facebook: 'https://www.facebook.com/wscbenguela/',
      instagram: 'https://www.instagram.com/wilietesportclubeoficial/',
    },
    palmares: [
      { title: 'Taça de Angola', count: 1 },
      { title: 'Gira Bola B (2.ª Divisão)', count: 1, seasons: ['2021/22'] },
    ],
    kits: [
      { label: 'Principal', colors: ['#008751', '#F9C304'] },
      { label: 'Secundário', colors: ['#FFFFFF', '#008751'] },
    ],
    board: [
      { role: 'Presidente', name: 'Wilson Faria' },
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
    kits: [
      { label: 'Principal', colors: ['#00529B', '#FFFFFF'] },
      { label: 'Secundário', colors: ['#F9C304', '#000000'] },
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
    palmares: [
      { title: 'Liga Unitel Girabola', count: 1 },
      { title: 'Taça de Angola', count: 1 },
      { title: 'Supertaça de Angola', count: 1 },
    ],
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
    palmares: [
      { title: 'Liga Unitel Girabola', count: 2 },
      { title: 'Taça de Angola', count: 3 },
      { title: 'Supertaça de Angola', count: 1 },
      { title: 'Gira Bola B (2.ª Divisão)', count: 2 },
    ],
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

/** Nome institucional completo para tabelas e documentos oficiais. */
export function getTeamFullName(teamId: string, fallback?: string): string {
  const team = getTeamById(teamId);
  const name = getTeamProfile(teamId)?.officialName ?? team?.officialName ?? team?.name ?? fallback ?? teamId;
  // “Futebol” era uma etiqueta de modalidade anexada aos perfis, não parte
  // do nome do clube. Nas tabelas oficiais deve aparecer apenas a denominação.
  return name.replace(/\s*—\s*Futebol\s*$/i, '').trim();
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
