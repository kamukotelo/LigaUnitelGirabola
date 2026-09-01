import { createHash } from 'node:crypto';

export type FcmsEventType = 'goal' | 'yellow' | 'red' | 'sub';

export interface FcmsTeamMapping {
  externalTeamId: string;
  teamId: string;
}

export interface FcmsSyncEvent {
  minute: number | null;
  type: FcmsEventType;
  teamExternalId: string;
  player: string;
  playerExternalId?: string | null;
  playerOut?: string | null;
  detail?: string | null;
}

export interface FcmsSyncMatch {
  externalMatchId: string;
  round: number;
  kickoff: string;
  homeExternalId: string;
  awayExternalId: string;
  homeScore: number;
  awayScore: number;
  halfTimeHomeScore?: number | null;
  halfTimeAwayScore?: number | null;
  status: 'finished';
  stadium?: string | null;
  broadcaster?: string | null;
  events?: FcmsSyncEvent[];
}

export interface FcmsSyncPayload {
  provider: 'fcms-api' | 'genius-widget' | 'authorised-push';
  tenant: string;
  competitionExternalId: string;
  seasonId: string;
  dryRun?: boolean;
  matches: FcmsSyncMatch[];
}

export interface NormalisedFcmsMatch extends FcmsSyncMatch {
  homeTeamId: string;
  awayTeamId: string;
  score: string;
  halfTimeScore: string | null;
  events: Array<FcmsSyncEvent & { teamSide: 'home' | 'away' }>;
  eventsProvided: boolean;
}

const allowedProviders = new Set<FcmsSyncPayload['provider']>(['fcms-api', 'genius-widget', 'authorised-push']);
const allowedEventTypes = new Set<FcmsEventType>(['goal', 'yellow', 'red', 'sub']);

function requiredText(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim() || value.length > 200) {
    throw new Error(`${field} inválido`);
  }
  return value.trim();
}

function score(value: unknown, field: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0 || parsed > 99) throw new Error(`${field} inválido`);
  return parsed;
}

export function parseFcmsSyncPayload(raw: unknown): FcmsSyncPayload {
  if (!raw || typeof raw !== 'object') throw new Error('Payload FCMS inválido');
  const input = raw as Record<string, unknown>;
  const provider = requiredText(input.provider, 'provider') as FcmsSyncPayload['provider'];
  if (!allowedProviders.has(provider)) throw new Error('provider não suportado');
  if (!Array.isArray(input.matches) || input.matches.length < 1 || input.matches.length > 240) {
    throw new Error('matches deve conter entre 1 e 240 jogos');
  }

  const seen = new Set<string>();
  const matches = input.matches.map((candidate, index): FcmsSyncMatch => {
    if (!candidate || typeof candidate !== 'object') throw new Error(`Jogo ${index + 1} inválido`);
    const match = candidate as Record<string, unknown>;
    const externalMatchId = requiredText(match.externalMatchId, `matches[${index}].externalMatchId`);
    if (seen.has(externalMatchId)) throw new Error(`externalMatchId duplicado: ${externalMatchId}`);
    seen.add(externalMatchId);
    const round = Number(match.round);
    if (!Number.isSafeInteger(round) || round < 1 || round > 60) throw new Error(`Jornada inválida no jogo ${externalMatchId}`);
    const kickoff = requiredText(match.kickoff, `matches[${index}].kickoff`);
    if (!Number.isFinite(Date.parse(kickoff))) throw new Error(`Data inválida no jogo ${externalMatchId}`);
    if (match.status !== 'finished') throw new Error(`Apenas jogos terminados podem ser sincronizados: ${externalMatchId}`);

    const eventsRaw = match.events ?? [];
    if (!Array.isArray(eventsRaw) || eventsRaw.length > 200) throw new Error(`Eventos inválidos no jogo ${externalMatchId}`);
    const events = eventsRaw.map((candidateEvent, eventIndex): FcmsSyncEvent => {
      if (!candidateEvent || typeof candidateEvent !== 'object') throw new Error(`Evento ${eventIndex + 1} inválido`);
      const event = candidateEvent as Record<string, unknown>;
      const type = requiredText(event.type, 'event.type') as FcmsEventType;
      if (!allowedEventTypes.has(type)) throw new Error(`Tipo de evento não suportado: ${type}`);
      const minute = event.minute === null || event.minute === undefined ? null : Number(event.minute);
      if (minute !== null && (!Number.isSafeInteger(minute) || minute < 0 || minute > 180)) {
        throw new Error(`Minuto inválido no jogo ${externalMatchId}`);
      }
      return {
        minute,
        type,
        teamExternalId: requiredText(event.teamExternalId, 'event.teamExternalId'),
        player: requiredText(event.player, 'event.player'),
        playerExternalId: typeof event.playerExternalId === 'string' ? event.playerExternalId.trim() || null : null,
        playerOut: typeof event.playerOut === 'string' ? event.playerOut.trim() || null : null,
        detail: typeof event.detail === 'string' ? event.detail.trim() || null : null,
      };
    });

    return {
      externalMatchId,
      round,
      kickoff,
      homeExternalId: requiredText(match.homeExternalId, 'homeExternalId'),
      awayExternalId: requiredText(match.awayExternalId, 'awayExternalId'),
      homeScore: score(match.homeScore, 'homeScore'),
      awayScore: score(match.awayScore, 'awayScore'),
      halfTimeHomeScore: match.halfTimeHomeScore == null ? null : score(match.halfTimeHomeScore, 'halfTimeHomeScore'),
      halfTimeAwayScore: match.halfTimeAwayScore == null ? null : score(match.halfTimeAwayScore, 'halfTimeAwayScore'),
      status: 'finished',
      stadium: typeof match.stadium === 'string' ? match.stadium.trim() || null : null,
      broadcaster: typeof match.broadcaster === 'string' ? match.broadcaster.trim() || null : null,
      ...(match.events === undefined ? {} : { events }),
    };
  });

  return {
    provider,
    tenant: requiredText(input.tenant, 'tenant'),
    competitionExternalId: requiredText(input.competitionExternalId, 'competitionExternalId'),
    seasonId: requiredText(input.seasonId, 'seasonId'),
    dryRun: input.dryRun === true,
    matches,
  };
}

export function normaliseFcmsMatches(payload: FcmsSyncPayload, mappings: FcmsTeamMapping[]): NormalisedFcmsMatch[] {
  const byExternalId = new Map(mappings.map((mapping) => [mapping.externalTeamId, mapping.teamId]));
  return payload.matches.map((match) => {
    const homeTeamId = byExternalId.get(match.homeExternalId);
    const awayTeamId = byExternalId.get(match.awayExternalId);
    if (!homeTeamId || !awayTeamId) {
      const missing = [!homeTeamId ? match.homeExternalId : null, !awayTeamId ? match.awayExternalId : null].filter(Boolean);
      throw new Error(`Mapeamento FCMS em falta: ${missing.join(', ')}`);
    }
    if (homeTeamId === awayTeamId) throw new Error(`Clubes iguais no jogo ${match.externalMatchId}`);
    const halfTimeKnown = match.halfTimeHomeScore != null && match.halfTimeAwayScore != null;
    const events: NormalisedFcmsMatch['events'] = (match.events ?? []).map((event) => {
      const teamSide = event.teamExternalId === match.homeExternalId
        ? 'home'
        : event.teamExternalId === match.awayExternalId
          ? 'away'
          : null;
      if (!teamSide) throw new Error(`Evento associado a clube alheio ao jogo ${match.externalMatchId}`);
      return { ...event, teamSide: teamSide as 'home' | 'away' };
    });
    const eventGoals = events.filter((event) => event.type === 'goal');
    const goalsComplete = eventGoals.length === match.homeScore + match.awayScore;
    if (goalsComplete) {
      const homeGoals = eventGoals.filter((event) => event.teamSide === 'home').length;
      const awayGoals = eventGoals.filter((event) => event.teamSide === 'away').length;
      if (homeGoals !== match.homeScore || awayGoals !== match.awayScore) {
        throw new Error(`Eventos de golo não coincidem com o resultado do jogo ${match.externalMatchId}`);
      }
    }
    return {
      ...match,
      homeTeamId,
      awayTeamId,
      score: `${match.homeScore}-${match.awayScore}`,
      halfTimeScore: halfTimeKnown ? `${match.halfTimeHomeScore}-${match.halfTimeAwayScore}` : null,
      events,
      eventsProvided: match.events !== undefined,
    };
  });
}

export function fcmsPayloadFingerprint(payload: FcmsSyncPayload): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}
