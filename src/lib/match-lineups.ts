import 'server-only';
import { getMatchRecord, getPlayerMatchName, getPlayersByTeam } from '@/lib/data';
import { getNeonSql, isNeonConfigured } from '@/lib/neon';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export type SlotPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface LineupSlot {
  playerId: string | null;
  name: string; // alcunha apresentada na ficha (editável)
  number: number;
  position: SlotPosition | null;
  isStarter: boolean;
  isCaptain: boolean;
}

export interface StoredMatchLineup {
  matchId: string;
  teamId: string;
  side: 'home' | 'away';
  players: LineupSlot[];
  coach: string | null;
  confirmedAt: string | null;
  confirmedBy: string | null;
}

/** Converte a posição em português da base para o código de campo da ficha. */
export function toSlotPosition(position: string | undefined | null): SlotPosition | null {
  const s = (position ?? '').toLowerCase();
  if (!s || s.includes('confirmar')) return null;
  if (s.includes('guarda')) return 'GK';
  if (s.includes('defesa') || s.includes('lateral') || s.includes('central')) return 'DEF';
  if (s.includes('médio') || s.includes('medio') || s.includes('trinco')) return 'MID';
  return 'FWD';
}

function normalizeSlot(raw: unknown): LineupSlot | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const name = typeof r.name === 'string' ? r.name.trim() : '';
  if (!name) return null;
  const num = Number(r.number);
  const pos = typeof r.position === 'string' ? (r.position as SlotPosition) : null;
  return {
    playerId: typeof r.playerId === 'string' && r.playerId ? r.playerId : null,
    name,
    number: Number.isFinite(num) && num > 0 ? Math.trunc(num) : 0,
    position: pos && ['GK', 'DEF', 'MID', 'FWD'].includes(pos) ? pos : null,
    isStarter: r.isStarter === true,
    isCaptain: r.isCaptain === true,
  };
}

export function sanitizeLineupPlayers(players: unknown): LineupSlot[] {
  if (!Array.isArray(players)) return [];
  return players
    .map(normalizeSlot)
    .filter((s): s is LineupSlot => s !== null)
    .slice(0, 30);
}

function buildRecordFallbackLineups(matchId: string, existingSides: Set<'home' | 'away'>): StoredMatchLineup[] {
  const record = getMatchRecord(matchId);
  if (!record?.lineups) return [];
  const fallbacks: StoredMatchLineup[] = [];
  for (const side of ['home', 'away'] as const) {
    if (existingSides.has(side)) continue;
    const rawPlayers = record.lineups[side];
    if (!rawPlayers || rawPlayers.length === 0) continue;
    const teamId = side === 'home' ? record.homeTeamId : record.awayTeamId;
    const squad = getPlayersByTeam(teamId);
    const claimed = new Set(rawPlayers.map((slot) => slot.playerId).filter(Boolean));
    const players: LineupSlot[] = rawPlayers.map((slot) => {
      const byId = slot.playerId ? squad.find((p) => p.id === slot.playerId) : undefined;
      const byShirt = slot.number > 0
        ? squad.find((p) => p.jerseyNumber === slot.number && (p.id === slot.playerId || !claimed.has(p.id)))
        : undefined;
      const player = byShirt ?? byId;
      return {
        playerId: player?.id ?? slot.playerId ?? null,
        name: player ? getPlayerMatchName(player) : slot.name,
        number: slot.number,
        position: slot.position ?? toSlotPosition(player?.position) ?? null,
        isStarter: slot.isStarter,
        isCaptain: slot.isCaptain === true,
      };
    });
    fallbacks.push({
      matchId,
      teamId,
      side,
      players,
      coach: record.coaches?.[side] ?? null,
      confirmedAt: record.result?.updatedAt ?? record.schedule.date,
      confirmedBy: 'código',
    });
  }
  return fallbacks;
}

export async function getMatchLineups(matchId: string): Promise<StoredMatchLineup[]> {
  let dbRows: StoredMatchLineup[] = [];
  try {
    if (isNeonConfigured()) {
      const rows = (await getNeonSql().query(
        'select match_id, team_id, side, players, coach, confirmed_at, confirmed_by from public.ancaf_match_lineups where match_id = $1',
        [matchId],
      )) as Array<Record<string, unknown>>;
      dbRows = rows.map((row) => ({
        matchId: String(row.match_id),
        teamId: String(row.team_id),
        side: row.side as 'home' | 'away',
        players: sanitizeLineupPlayers(row.players),
        coach: (row.coach as string | null) ?? null,
        confirmedAt: row.confirmed_at ? String(row.confirmed_at) : null,
        confirmedBy: (row.confirmed_by as string | null) ?? null,
      }));
    } else {
      const { data } = await getSupabaseAdmin()
        .from('ancaf_match_lineups')
        .select('match_id, team_id, side, players, coach, confirmed_at, confirmed_by')
        .eq('match_id', matchId);
      dbRows = (data ?? []).map((row) => ({
        matchId: row.match_id as string,
        teamId: row.team_id as string,
        side: row.side as 'home' | 'away',
        players: sanitizeLineupPlayers(row.players),
        coach: (row.coach as string | null) ?? null,
        confirmedAt: (row.confirmed_at as string | null) ?? null,
        confirmedBy: (row.confirmed_by as string | null) ?? null,
      }));
    }
  } catch {
    dbRows = [];
  }

  const existingSides = new Set(dbRows.map((r) => r.side));
  return [...dbRows, ...buildRecordFallbackLineups(matchId, existingSides)];
}

export async function saveMatchLineup(input: {
  matchId: string;
  teamId: string;
  side: 'home' | 'away';
  players: LineupSlot[];
  coach: string | null;
  confirmedBy: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const now = new Date().toISOString();
  try {
    if (isNeonConfigured()) {
      await getNeonSql().query(
        `insert into public.ancaf_match_lineups (match_id, team_id, side, players, coach, confirmed_by, confirmed_at, updated_at)
         values ($1, $2, $3, $4::jsonb, $5, $6, $7, $7)
         on conflict (match_id, team_id) do update set
           side = excluded.side,
           players = excluded.players,
           coach = excluded.coach,
           confirmed_by = excluded.confirmed_by,
           confirmed_at = excluded.confirmed_at,
           updated_at = excluded.updated_at`,
        [input.matchId, input.teamId, input.side, JSON.stringify(input.players), input.coach, input.confirmedBy, now],
      );
      return { ok: true };
    }
    const { error } = await getSupabaseAdmin()
      .from('ancaf_match_lineups')
      .upsert(
        {
          match_id: input.matchId,
          team_id: input.teamId,
          side: input.side,
          players: input.players,
          coach: input.coach,
          confirmed_at: now,
          confirmed_by: input.confirmedBy,
          updated_at: now,
        },
        { onConflict: 'match_id,team_id' },
      );
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'erro desconhecido' };
  }
}
