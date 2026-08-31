import 'server-only';
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

export async function getMatchLineups(matchId: string): Promise<StoredMatchLineup[]> {
  try {
    const { data } = await getSupabaseAdmin()
      .from('ancaf_match_lineups')
      .select('match_id, team_id, side, players, coach, confirmed_at, confirmed_by')
      .eq('match_id', matchId);
    return (data ?? []).map((row) => ({
      matchId: row.match_id as string,
      teamId: row.team_id as string,
      side: row.side as 'home' | 'away',
      players: sanitizeLineupPlayers(row.players),
      coach: (row.coach as string | null) ?? null,
      confirmedAt: (row.confirmed_at as string | null) ?? null,
      confirmedBy: (row.confirmed_by as string | null) ?? null,
    }));
  } catch {
    return [];
  }
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
