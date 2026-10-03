// Recordes da Liga Unitel Girabola (Globais · Equipas · Jogadores ·
// Árbitros · Treinadores). Tudo é derivado dos jogos terminados e das fichas
// publicadas (eventos, escalações, arbitragem e treinadores): nenhum número é
// introduzido à mão. Sem ficha publicada, o jogo conta apenas para os
// indicadores que dependem do resultado.

import {
  getCurrentSeasonAssists,
  getCurrentSeasonCleanSheets,
  getCurrentSeasonMinutesPlayed,
  getMatchDetail,
  getMatchOfficials,
  getMatchesForSeason,
  getPlayers,
  getTeamById,
  getTeamStaff,
  hasPublishedMatchEvents,
  UPCOMING_SEASON_ID,
  type Match,
  type MatchDetail,
  type MatchEventDetail,
} from './data';

export type RecordEntity = 'team' | 'player' | 'referee' | 'coach';

export interface RecordRow {
  id: string;
  name: string;
  /** Clube do jogador/treinador, ou o próprio clube numa linha de equipa. */
  teamId?: string;
  /** Só jogadores com ficha no portal recebem ligação. */
  href?: string;
  value: number;
}

export interface RecordItem {
  key: string;
  label: string;
  /** Unidade no singular e no plural (ex.: Golo / Golos). */
  unit: [string, string];
  /** Casas decimais do valor (médias). */
  decimals?: number;
  entity: RecordEntity;
  /** Ranking completo, já ordenado — o primeiro é o recordista. */
  rows: RecordRow[];
}

export interface RecordGlobals {
  matches: number;
  goals: number;
  average: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  underThree: number;
  threeOrMore: number;
  typicalResult?: { score: string; count: number };
}

export interface RecordSection {
  key: 'equipas' | 'jogadores' | 'arbitros' | 'treinadores';
  label: string;
  items: RecordItem[];
}

export interface CompetitionRecords {
  globals: RecordGlobals;
  sections: RecordSection[];
  /** Jogos terminados com eventos publicados (base dos recordes individuais). */
  matchesWithEvents: number;
}

const UNDEFINED_OFFICIAL = 'A definir';
const PENALTY = /grande penalidade|pen[aá]lt/i;
const OWN_GOAL = /autogolo/i;
const SECOND_YELLOW = /segundo amarelo|duplo amarelo|2\.?º amarelo/i;

function isOwnGoal(event: MatchEventDetail) {
  return event.type === 'goal' && (event.ownGoal === true || OWN_GOAL.test(event.detail ?? ''));
}

function sideTeam(match: Match, side: 'home' | 'away') {
  return side === 'home' ? match.homeTeamId : match.awayTeamId;
}

function teamName(teamId: string) {
  return getTeamById(teamId)?.name ?? teamId;
}

/** Ordena mantendo apenas quem tem valor; `asc` serve os recordes "Menos …". */
function ranked(rows: RecordRow[], order: 'desc' | 'asc' = 'desc', keepZero = false): RecordRow[] {
  return rows
    .filter((row) => keepZero || row.value > 0)
    .sort((a, b) => (order === 'desc' ? b.value - a.value : a.value - b.value) || a.name.localeCompare(b.name, 'pt'));
}

class Counter {
  private rows = new Map<string, RecordRow>();
  add(id: string, base: Omit<RecordRow, 'id' | 'value'>, amount = 1) {
    const row = this.rows.get(id) ?? { id, ...base, value: 0 };
    row.value += amount;
    // O clube mais recente prevalece (treinadores e jogadores transferidos).
    if (base.teamId) row.teamId = base.teamId;
    this.rows.set(id, row);
  }
  get(id: string) {
    return this.rows.get(id)?.value ?? 0;
  }
  list() {
    return [...this.rows.values()].map((row) => ({ ...row }));
  }
}

interface TeamTally {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  routs: number;
  yellow: number;
  red: number;
  ownGoalsFor: number;
  unbeatenRun: number;
  bestUnbeatenRun: number;
}

const emptyTally = (): TeamTally => ({
  played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0,
  routs: 0, yellow: 0, red: 0, ownGoalsFor: 0, unbeatenRun: 0, bestUnbeatenRun: 0,
});

function tallyResult(tally: TeamTally, goalsFor: number, goalsAgainst: number) {
  tally.played += 1;
  tally.goalsFor += goalsFor;
  tally.goalsAgainst += goalsAgainst;
  if (goalsFor > goalsAgainst) tally.wins += 1;
  else if (goalsFor === goalsAgainst) tally.draws += 1;
  else tally.losses += 1;
  if (goalsFor - goalsAgainst >= 3) tally.routs += 1;
  tally.unbeatenRun = goalsFor >= goalsAgainst ? tally.unbeatenRun + 1 : 0;
  tally.bestUnbeatenRun = Math.max(tally.bestUnbeatenRun, tally.unbeatenRun);
}

/** Cartões de uma equipa num jogo: eventos publicados ou, na falta deles, a estatística oficial. */
function teamCards(detail: MatchDetail, side: 'home' | 'away', hasEvents: boolean) {
  if (hasEvents) {
    const events = detail.events.filter((event) => event.team === side);
    return {
      yellow: events.filter((event) => event.type === 'yellow').length,
      red: events.filter((event) => event.type === 'red').length,
    };
  }
  const stats = side === 'home' ? detail.homeStats : detail.awayStats;
  const published = detail.officialStatKeys;
  return {
    yellow: published.includes('yellowCards') ? stats.yellowCards : 0,
    red: published.includes('redCards') ? stats.redCards : 0,
  };
}

function headCoach(teamId: string) {
  return getTeamStaff(teamId).find((member) => member.role === 'Treinador principal')?.name;
}

/**
 * Treinador de cada clube em cada jogo. A ficha manda; um jogo sem treinador
 * publicado herda o nome da ficha mais próxima desse clube (a anterior e, na
 * falta dela, a seguinte), para o mesmo técnico não aparecer com o nome da
 * ficha num jogo e com o nome completo do plantel noutro. O plantel oficial só
 * serve de último recurso, e apenas na época a que pertence.
 */
function resolveCoaches(matches: Match[], details: Map<string, MatchDetail>, useStaff: boolean) {
  const byTeam = new Map<string, { matchId: string; side: 'home' | 'away'; coach?: string }[]>();
  for (const match of matches) {
    const detail = details.get(match.id)!;
    for (const side of ['home', 'away'] as const) {
      const teamId = sideTeam(match, side);
      const coach = (side === 'home' ? detail.homeCoach : detail.awayCoach)?.trim() || undefined;
      const list = byTeam.get(teamId) ?? [];
      list.push({ matchId: match.id, side, coach });
      byTeam.set(teamId, list);
    }
  }

  const resolved = new Map<string, string | undefined>();
  for (const [teamId, list] of byTeam) {
    const fallback = useStaff ? headCoach(teamId) : undefined;
    list.forEach((entry, index) => {
      const previous = list.slice(0, index).reverse().find((item) => item.coach)?.coach;
      const next = list.slice(index + 1).find((item) => item.coach)?.coach;
      resolved.set(`${entry.matchId}:${entry.side}`, entry.coach ?? previous ?? next ?? fallback);
    });

    // As fichas grafam o mesmo técnico de formas diferentes ("Léo Neiva" /
    // "Leonardo Martins Neiva", "Filipe Nanza" / "Filipe Nzanza"). Dentro do
    // mesmo clube, nomes que partilham um nome próprio ou apelido são a mesma
    // pessoa e ficam com a grafia mais usada.
    const keys = list.map((entry) => `${entry.matchId}:${entry.side}`);
    const uses = new Map<string, number>();
    for (const key of keys) {
      const name = resolved.get(key);
      if (name) uses.set(name, (uses.get(name) ?? 0) + 1);
    }
    const names = [...uses.keys()].sort((a, b) => uses.get(b)! - uses.get(a)!);
    const canonical = new Map<string, string>();
    for (const name of names) {
      const match = [...new Set(canonical.values())].find((kept) => sharesNameToken(kept, name));
      canonical.set(name, match ?? name);
    }
    for (const key of keys) {
      const name = resolved.get(key);
      if (name) resolved.set(key, canonical.get(name) ?? name);
    }
  }
  return resolved;
}

const NAME_PARTICLES = new Set(['da', 'de', 'do', 'das', 'dos', 'e']);

function nameTokens(name: string) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !NAME_PARTICLES.has(token));
}

function sharesNameToken(a: string, b: string) {
  const tokens = new Set(nameTokens(a));
  return nameTokens(b).some((token) => tokens.has(token));
}

/**
 * Golo decisivo de uma vitória: o golo n.º (golos do vencido + 1) do vencedor.
 * Só é apurado quando todos os golos do jogo têm minuto e batem com o resultado.
 */
function winningGoal(match: Match, events: MatchEventDetail[]): MatchEventDetail | undefined {
  if (match.homeScore === match.awayScore) return undefined;
  const goals = events.filter((event) => event.type === 'goal');
  if (goals.length !== match.homeScore + match.awayScore || goals.some((goal) => goal.minute === undefined)) return undefined;
  const homeGoals = goals.filter((goal) => goal.team === 'home').length;
  if (homeGoals !== match.homeScore) return undefined;
  const winner = match.homeScore > match.awayScore ? 'home' : 'away';
  const loserScore = Math.min(match.homeScore, match.awayScore);
  return goals.filter((goal) => goal.team === winner)[loserScore];
}

export function computeCompetitionRecords(seasonId: string): CompetitionRecords {
  const finished = getMatchesForSeason(seasonId)
    .filter((match) => match.status === 'finished')
    .sort((a, b) => a.date.localeCompare(b.date) || a.round - b.round);
  const isCurrentSeason = seasonId === UPCOMING_SEASON_ID;
  const knownPlayers = new Map(getPlayers().map((player) => [player.id, player]));
  const details = new Map(finished.map((match) => [match.id, getMatchDetail(match)]));
  const coachBySide = resolveCoaches(finished, details, isCurrentSeason);

  const playerBase = (id: string, fallbackName: string, teamId: string) => {
    const known = isCurrentSeason ? knownPlayers.get(id) : undefined;
    return { name: known?.name ?? fallbackName, teamId, href: known ? `/players/${id}` : undefined };
  };

  // ── Globais ────────────────────────────────────────────────────────────
  const scoreCount = new Map<string, number>();
  const globals: RecordGlobals = {
    matches: finished.length, goals: 0, average: 0, homeWins: 0, awayWins: 0, draws: 0, underThree: 0, threeOrMore: 0,
  };

  // ── Acumuladores ──────────────────────────────────────────────────────
  const teams = new Map<string, TeamTally>();
  const coaches = new Map<string, TeamTally & { teamId: string }>();
  const refereeGames = new Counter();
  const refereeYellow = new Counter();
  const refereeRed = new Counter();

  const goals = new Counter();
  const penaltyGoals = new Counter();
  const subGoals = new Counter();
  const winningGoals = new Counter();
  const braces = new Counter();
  const hatTricks = new Counter();
  const yellows = new Counter();
  const doubleYellows = new Counter();
  const reds = new Counter();
  const subAppearances = new Counter();
  const appearances = new Map<string, Set<string>>();
  let matchesWithEvents = 0;

  const appear = (playerId: string | undefined, matchId: string) => {
    if (!playerId) return;
    const set = appearances.get(playerId) ?? new Set<string>();
    set.add(matchId);
    appearances.set(playerId, set);
  };

  for (const match of finished) {
    const total = match.homeScore + match.awayScore;
    globals.goals += total;
    if (match.homeScore > match.awayScore) globals.homeWins += 1;
    else if (match.homeScore < match.awayScore) globals.awayWins += 1;
    else globals.draws += 1;
    if (total >= 3) globals.threeOrMore += 1;
    else globals.underThree += 1;
    const score = `${match.homeScore}-${match.awayScore}`;
    scoreCount.set(score, (scoreCount.get(score) ?? 0) + 1);

    const detail = details.get(match.id)!;
    const hasEvents = hasPublishedMatchEvents(match);
    if (hasEvents) matchesWithEvents += 1;

    // Equipas e treinadores
    for (const side of ['home', 'away'] as const) {
      const teamId = sideTeam(match, side);
      const goalsFor = side === 'home' ? match.homeScore : match.awayScore;
      const goalsAgainst = side === 'home' ? match.awayScore : match.homeScore;
      const cards = teamCards(detail, side, hasEvents);
      const ownGoalsFor = detail.events.filter((event) => event.team === side && isOwnGoal(event)).length;

      const tally = teams.get(teamId) ?? emptyTally();
      tallyResult(tally, goalsFor, goalsAgainst);
      tally.yellow += cards.yellow;
      tally.red += cards.red;
      tally.ownGoalsFor += ownGoalsFor;
      teams.set(teamId, tally);

      const coach = coachBySide.get(`${match.id}:${side}`);
      if (coach) {
        const coachTally = coaches.get(coach) ?? { ...emptyTally(), teamId };
        coachTally.teamId = teamId;
        tallyResult(coachTally, goalsFor, goalsAgainst);
        coachTally.yellow += cards.yellow;
        coachTally.red += cards.red;
        coachTally.ownGoalsFor += detail.events.filter((event) => event.team !== side && isOwnGoal(event)).length;
        coaches.set(coach, coachTally);
      }
    }

    // Árbitros
    const referee = getMatchOfficials(match).referee;
    if (referee && referee !== UNDEFINED_OFFICIAL) {
      const home = teamCards(detail, 'home', hasEvents);
      const away = teamCards(detail, 'away', hasEvents);
      refereeGames.add(referee, { name: referee });
      refereeYellow.add(referee, { name: referee }, home.yellow + away.yellow);
      refereeRed.add(referee, { name: referee }, home.red + away.red);
    }

    if (!hasEvents) continue;

    // Jogadores
    const starters = {
      home: new Set(detail.homeLineup.filter((slot) => slot.isStarter && slot.playerId).map((slot) => slot.playerId!)),
      away: new Set(detail.awayLineup.filter((slot) => slot.isStarter && slot.playerId).map((slot) => slot.playerId!)),
    };
    for (const id of [...starters.home, ...starters.away]) appear(id, match.id);

    const decisive = winningGoal(match, detail.events);
    const goalsInMatch = new Counter();
    const yellowsInMatch = new Counter();

    for (const event of detail.events) {
      if (!event.playerId) continue;
      const teamId = sideTeam(match, event.team);
      const base = playerBase(event.playerId, event.player, teamId);

      if (event.type === 'sub') {
        subAppearances.add(event.playerId, base);
        appear(event.playerId, match.id);
        continue;
      }
      appear(event.playerId, match.id);

      if (event.type === 'goal') {
        if (isOwnGoal(event)) continue;
        goals.add(event.playerId, base);
        goalsInMatch.add(event.playerId, base);
        if (PENALTY.test(event.detail ?? '')) penaltyGoals.add(event.playerId, base);
        if (starters[event.team].size > 0 && !starters[event.team].has(event.playerId)) subGoals.add(event.playerId, base);
        if (event === decisive) winningGoals.add(event.playerId, base);
      } else if (event.type === 'yellow') {
        yellows.add(event.playerId, base);
        yellowsInMatch.add(event.playerId, base);
      } else if (event.type === 'red') {
        reds.add(event.playerId, base);
        if (SECOND_YELLOW.test(event.detail ?? '')) doubleYellows.add(event.playerId, base);
      }
    }

    for (const row of goalsInMatch.list()) {
      if (row.value === 2) braces.add(row.id, row);
      if (row.value >= 3) hatTricks.add(row.id, row);
    }
    for (const row of yellowsInMatch.list()) {
      // Dois amarelos no mesmo jogo, mesmo que a ficha não registe o vermelho.
      if (row.value >= 2 && doubleYellows.get(row.id) === 0) doubleYellows.add(row.id, row);
    }
  }

  globals.average = globals.matches ? globals.goals / globals.matches : 0;
  const typical = [...scoreCount].sort((a, b) => b[1] - a[1])[0];
  if (typical) globals.typicalResult = { score: typical[0], count: typical[1] };

  // ── Equipas ───────────────────────────────────────────────────────────
  const teamRows = (pick: (tally: TeamTally) => number) => [...teams].map(([teamId, tally]) => ({
    id: teamId, name: teamName(teamId), teamId, value: pick(tally),
  }));

  const teamItems: RecordItem[] = [
    { key: 'best-attack', label: 'Melhor Ataque', unit: ['Golo', 'Golos'], entity: 'team', rows: ranked(teamRows((t) => t.goalsFor), 'desc', true) },
    { key: 'worst-attack', label: 'Pior Ataque', unit: ['Golo', 'Golos'], entity: 'team', rows: ranked(teamRows((t) => t.goalsFor), 'asc', true) },
    { key: 'best-defence', label: 'Melhor Defesa', unit: ['Golo sofrido', 'Golos sofridos'], entity: 'team', rows: ranked(teamRows((t) => t.goalsAgainst), 'asc', true) },
    { key: 'worst-defence', label: 'Pior Defesa', unit: ['Golo sofrido', 'Golos sofridos'], entity: 'team', rows: ranked(teamRows((t) => t.goalsAgainst), 'desc', true) },
    { key: 'routs', label: 'Mais Goleadas', unit: ['Goleada', 'Goleadas'], entity: 'team', rows: ranked(teamRows((t) => t.routs)) },
    { key: 'most-wins', label: 'Mais Vitórias', unit: ['Vitória', 'Vitórias'], entity: 'team', rows: ranked(teamRows((t) => t.wins)) },
    { key: 'fewest-wins', label: 'Menos Vitórias', unit: ['Vitória', 'Vitórias'], entity: 'team', rows: ranked(teamRows((t) => t.wins), 'asc', true) },
    { key: 'most-draws', label: 'Mais Empates', unit: ['Empate', 'Empates'], entity: 'team', rows: ranked(teamRows((t) => t.draws)) },
    { key: 'fewest-draws', label: 'Menos Empates', unit: ['Empate', 'Empates'], entity: 'team', rows: ranked(teamRows((t) => t.draws), 'asc', true) },
    { key: 'most-losses', label: 'Mais Derrotas', unit: ['Derrota', 'Derrotas'], entity: 'team', rows: ranked(teamRows((t) => t.losses)) },
    { key: 'fewest-losses', label: 'Menos Derrotas', unit: ['Derrota', 'Derrotas'], entity: 'team', rows: ranked(teamRows((t) => t.losses), 'asc', true) },
    { key: 'unbeaten', label: 'Máx. Jogos sem Perder', unit: ['Jogo', 'Jogos'], entity: 'team', rows: ranked(teamRows((t) => t.bestUnbeatenRun)) },
    { key: 'team-yellow', label: 'Mais Amarelos', unit: ['Amarelo', 'Amarelos'], entity: 'team', rows: ranked(teamRows((t) => t.yellow)) },
    { key: 'team-red', label: 'Mais Vermelhos', unit: ['Vermelho', 'Vermelhos'], entity: 'team', rows: ranked(teamRows((t) => t.red)) },
    { key: 'own-goals-for', label: 'Mais Autogolos a Favor', unit: ['Golo', 'Golos'], entity: 'team', rows: ranked(teamRows((t) => t.ownGoalsFor)) },
  ];

  // ── Jogadores ─────────────────────────────────────────────────────────
  const assists = new Counter();
  if (isCurrentSeason) {
    for (const row of getCurrentSeasonAssists()) {
      assists.add(row.id, { name: row.name, teamId: row.teamId, href: `/players/${row.id}` }, row.assists);
    }
  }

  const participation = new Counter();
  for (const row of goals.list()) participation.add(row.id, row, row.value);
  for (const row of assists.list()) participation.add(row.id, row, row.value);

  const roundsPlayed = new Set(finished.map((match) => match.round)).size;
  const minGames = Math.max(1, Math.ceil(roundsPlayed / 3));
  const goalsPerGame = goals.list()
    .map((row) => {
      const games = appearances.get(row.id)?.size ?? 0;
      return games >= minGames ? { ...row, value: Math.round((row.value / games) * 100) / 100 } : undefined;
    })
    .filter((row): row is RecordRow => row !== undefined);

  const minutes = isCurrentSeason
    ? getCurrentSeasonMinutesPlayed().map((row) => ({
      id: row.id, name: row.name, teamId: row.teamId, href: knownPlayers.has(row.id) ? `/players/${row.id}` : undefined, value: row.minutesPlayed,
    }))
    : [];
  const goalkeepers = isCurrentSeason ? getCurrentSeasonCleanSheets() : [];
  const keeperRow = (row: (typeof goalkeepers)[number], value: number): RecordRow => ({
    id: row.id, name: row.name, teamId: row.teamId, href: knownPlayers.has(row.id) ? `/players/${row.id}` : undefined, value,
  });

  const playerItems: RecordItem[] = [
    { key: 'top-scorer', label: 'Melhor Marcador', unit: ['Golo', 'Golos'], entity: 'player', rows: ranked(goals.list()) },
    { key: 'assists', label: 'Mais Assistências', unit: ['Assistência', 'Assistências'], entity: 'player', rows: ranked(assists.list()) },
    { key: 'participation', label: 'Participação em Golos', unit: ['Golo/Assistência', 'Golos/Assistências'], entity: 'player', rows: ranked(participation.list()) },
    { key: 'goals-per-game', label: 'Média de Golos/Jogo', unit: ['Golo/Jogo', 'Golos/Jogo'], decimals: 2, entity: 'player', rows: ranked(goalsPerGame) },
    { key: 'penalties', label: 'Mais Golos de Penálti', unit: ['Golo', 'Golos'], entity: 'player', rows: ranked(penaltyGoals.list()) },
    { key: 'sub-goals', label: 'Mais Golos como Suplente', unit: ['Golo', 'Golos'], entity: 'player', rows: ranked(subGoals.list()) },
    { key: 'winning-goals', label: 'Golos de Vitória', unit: ['Golo', 'Golos'], entity: 'player', rows: ranked(winningGoals.list()) },
    { key: 'braces', label: 'Mais Bis', unit: ['Bis', 'Bis'], entity: 'player', rows: ranked(braces.list()) },
    { key: 'hat-tricks', label: 'Mais Hat-tricks', unit: ['Hat-trick', 'Hat-tricks'], entity: 'player', rows: ranked(hatTricks.list()) },
    { key: 'player-yellow', label: 'Mais Amarelos', unit: ['Amarelo', 'Amarelos'], entity: 'player', rows: ranked(yellows.list()) },
    { key: 'double-yellow', label: 'Mais Duplos Amarelos', unit: ['Duplo Amarelo', 'Duplos Amarelos'], entity: 'player', rows: ranked(doubleYellows.list()) },
    { key: 'player-red', label: 'Mais Vermelhos', unit: ['Vermelho', 'Vermelhos'], entity: 'player', rows: ranked(reds.list()) },
    { key: 'minutes', label: 'Mais Minutos', unit: ['Minuto', 'Minutos'], entity: 'player', rows: ranked(minutes) },
    { key: 'twelfth-man', label: '12.º Jogador', unit: ['Jogo como suplente utilizado', 'Jogos como suplente utilizado'], entity: 'player', rows: ranked(subAppearances.list()) },
    { key: 'clean-sheets', label: 'Mais Balizas Invioladas', unit: ['Jogo', 'Jogos'], entity: 'player', rows: ranked(goalkeepers.map((row) => keeperRow(row, row.cleanSheets))) },
    { key: 'goals-conceded', label: 'Mais Golos Sofridos', unit: ['Golo sofrido', 'Golos sofridos'], entity: 'player', rows: ranked(goalkeepers.map((row) => keeperRow(row, row.goalsConceded ?? 0))) },
  ];

  // ── Árbitros ──────────────────────────────────────────────────────────
  const refereeAverage = refereeGames.list()
    .filter((row) => row.value >= 2)
    .map((row) => ({ ...row, value: Math.round((refereeYellow.get(row.id) / row.value) * 100) / 100 }));

  const refereeItems: RecordItem[] = [
    { key: 'ref-games', label: 'Mais Jogos', unit: ['Jogo', 'Jogos'], entity: 'referee', rows: ranked(refereeGames.list()) },
    { key: 'ref-yellow', label: 'Mais Amarelos', unit: ['Amarelo', 'Amarelos'], entity: 'referee', rows: ranked(refereeYellow.list()) },
    { key: 'ref-yellow-avg', label: 'Média de Amarelos/Jogo', unit: ['Amarelo/Jogo', 'Amarelos/Jogo'], decimals: 2, entity: 'referee', rows: ranked(refereeAverage) },
    { key: 'ref-red', label: 'Mais Vermelhos', unit: ['Vermelho', 'Vermelhos'], entity: 'referee', rows: ranked(refereeRed.list()) },
  ];

  // ── Treinadores ───────────────────────────────────────────────────────
  const coachRows = (pick: (tally: TeamTally) => number) => [...coaches].map(([name, tally]) => ({
    id: name, name, teamId: tally.teamId, value: pick(tally),
  }));

  const coachItems: RecordItem[] = [
    { key: 'coach-best-attack', label: 'Melhor Ataque', unit: ['Golo', 'Golos'], entity: 'coach', rows: ranked(coachRows((t) => t.goalsFor), 'desc', true) },
    { key: 'coach-worst-attack', label: 'Pior Ataque', unit: ['Golo', 'Golos'], entity: 'coach', rows: ranked(coachRows((t) => t.goalsFor), 'asc', true) },
    { key: 'coach-best-defence', label: 'Melhor Defesa', unit: ['Golo sofrido', 'Golos sofridos'], entity: 'coach', rows: ranked(coachRows((t) => t.goalsAgainst), 'asc', true) },
    { key: 'coach-worst-defence', label: 'Pior Defesa', unit: ['Golo sofrido', 'Golos sofridos'], entity: 'coach', rows: ranked(coachRows((t) => t.goalsAgainst), 'desc', true) },
    { key: 'coach-routs', label: 'Mais Goleadas', unit: ['Goleada', 'Goleadas'], entity: 'coach', rows: ranked(coachRows((t) => t.routs)) },
    { key: 'coach-most-wins', label: 'Mais Vitórias', unit: ['Vitória', 'Vitórias'], entity: 'coach', rows: ranked(coachRows((t) => t.wins)) },
    { key: 'coach-fewest-wins', label: 'Menos Vitórias', unit: ['Vitória', 'Vitórias'], entity: 'coach', rows: ranked(coachRows((t) => t.wins), 'asc', true) },
    { key: 'coach-most-draws', label: 'Mais Empates', unit: ['Empate', 'Empates'], entity: 'coach', rows: ranked(coachRows((t) => t.draws)) },
    { key: 'coach-fewest-draws', label: 'Menos Empates', unit: ['Empate', 'Empates'], entity: 'coach', rows: ranked(coachRows((t) => t.draws), 'asc', true) },
    { key: 'coach-most-losses', label: 'Mais Derrotas', unit: ['Derrota', 'Derrotas'], entity: 'coach', rows: ranked(coachRows((t) => t.losses)) },
    { key: 'coach-fewest-losses', label: 'Menos Derrotas', unit: ['Derrota', 'Derrotas'], entity: 'coach', rows: ranked(coachRows((t) => t.losses), 'asc', true) },
    { key: 'coach-unbeaten', label: 'Máx. Jogos sem Perder', unit: ['Jogo', 'Jogos'], entity: 'coach', rows: ranked(coachRows((t) => t.bestUnbeatenRun)) },
    { key: 'coach-yellow', label: 'Mais Amarelos', unit: ['Amarelo', 'Amarelos'], entity: 'coach', rows: ranked(coachRows((t) => t.yellow)) },
    { key: 'coach-red', label: 'Mais Vermelhos', unit: ['Vermelho', 'Vermelhos'], entity: 'coach', rows: ranked(coachRows((t) => t.red)) },
    { key: 'coach-own-goals', label: 'Mais Autogolos', unit: ['Golo', 'Golos'], entity: 'coach', rows: ranked(coachRows((t) => t.ownGoalsFor)) },
  ];

  return {
    globals,
    matchesWithEvents,
    sections: [
      { key: 'equipas', label: 'Equipas', items: teamItems },
      { key: 'jogadores', label: 'Jogadores', items: playerItems },
      { key: 'arbitros', label: 'Árbitros', items: refereeItems },
      { key: 'treinadores', label: 'Treinadores', items: coachItems },
    ],
  };
}
