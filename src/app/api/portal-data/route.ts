import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { PortalData } from '@/lib/data';

// GET /api/portal-data — instantâneo do conteúdo migrado para a BD (tabelas
// ancaf_*), consumido no browser por PortalDataProvider. Cresce por vagas;
// um domínio ausente continua a ser servido pela constante em código.
export const dynamic = 'force-dynamic';

function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url !== 'https://placeholder.supabase.co';
}

type Row = Record<string, unknown>;
const str = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
const num = (v: unknown): number => (Number.isFinite(Number(v)) ? Number(v) : 0);
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

export async function GET() {
  if (!isConfigured()) return NextResponse.json({ data: {}, updatedAt: null });

  const data: PortalData = {};
  let updatedAt: string | null = null;
  const bump = (v: unknown) => {
    const s = typeof v === 'string' ? v : null;
    if (s && (!updatedAt || s > updatedAt)) updatedAt = s;
  };

  try {
    const [staffRes, profRes, standRes, teamRes, vidRes, newsRes, lineRes, evRes, statRes] = await Promise.all([
      supabase.from('ancaf_team_staff').select('team_id, name, role, nationality, ma_id, fifa_id, sort_rank, updated_at'),
      supabase.from('ancaf_team_profiles').select('team_id, official_name, president, website, socials, palmares, kits, board, updated_at'),
      supabase.from('ancaf_standings').select('*'),
      supabase.from('ancaf_teams').select('id, name'),
      supabase.from('ancaf_videos').select('*').order('sort'),
      supabase.from('ancaf_news').select('id, title, category, date, iso_date, summary, content, status, author, source_name, source_url, published_at, ai_assisted, updated_at').order('date', { ascending: false }),
      supabase.from('ancaf_match_lineups').select('match_id, team_id, side, players, coach, updated_at'),
      supabase.from('ancaf_match_events').select('*').order('sort'),
      supabase.from('ancaf_match_stats').select('*'),
    ]);

    // ── equipa técnica ────────────────────────────────────────────────
    const staffRows = arr<Row>(staffRes.data);
    if (staffRows.length) {
      const byTeam: Record<string, Array<{ member: import('@/lib/data').TeamStaffMember; rank: number }>> = {};
      for (const r of staffRows) {
        bump(r.updated_at);
        (byTeam[str(r.team_id)] ??= []).push({
          member: {
            name: str(r.name),
            role: str(r.role) || 'Função por confirmar',
            nationality: str(r.nationality) || 'A confirmar',
            maId: r.ma_id ? str(r.ma_id) : undefined,
            fifaId: r.fifa_id ? str(r.fifa_id) : undefined,
          },
          rank: num(r.sort_rank),
        });
      }
      data.staff = Object.fromEntries(
        Object.entries(byTeam).map(([id, list]) => [id, list.sort((a, b) => a.rank - b.rank).map((x) => x.member)]),
      );
    }

    // ── perfis institucionais ─────────────────────────────────────────
    const profRows = arr<Row>(profRes.data);
    if (profRows.length) {
      data.profiles = {};
      for (const r of profRows) {
        bump(r.updated_at);
        data.profiles[str(r.team_id)] = {
          officialName: r.official_name ? str(r.official_name) : undefined,
          president: r.president ? str(r.president) : undefined,
          website: r.website ? str(r.website) : undefined,
          socials: obj(r.socials) as { facebook?: string; instagram?: string; youtube?: string },
          palmares: arr(r.palmares),
          kits: arr(r.kits),
          board: arr(r.board),
        };
      }
    }

    // ── classificações ───────────────────────────────────────────────
    const standRows = arr<Row>(standRes.data);
    if (standRows.length) {
      const teamNames = new Map(arr<Row>(teamRes.data).map((t) => [str(t.id), str(t.name)]));
      const bySeason: Record<string, import('@/lib/data').StandingEntry[]> = {};
      for (const r of standRows) {
        bump(r.updated_at);
        const gf = num(r.goals_for);
        const ga = num(r.goals_against);
        (bySeason[str(r.season_id)] ??= []).push({
          position: num(r.position),
          teamId: str(r.team_id),
          teamName: teamNames.get(str(r.team_id)) ?? str(r.team_id),
          played: num(r.played), won: num(r.won), drawn: num(r.drawn), lost: num(r.lost),
          goalsFor: gf, goalsAgainst: ga, goalDifference: gf - ga, points: num(r.points),
          form: [],
          goalsVerified: r.goals_verified === true,
          formVerified: r.form_verified === true,
        });
      }
      for (const list of Object.values(bySeason)) list.sort((a, b) => a.position - b.position);
      data.standings = bySeason;
    }

    // ── vídeos ───────────────────────────────────────────────────────
    const vidRows = arr<Row>(vidRes.data);
    if (vidRows.length) {
      data.videos = vidRows.map((r) => {
        bump(r.updated_at);
        return {
          id: str(r.id), title: str(r.title), duration: str(r.duration), views: str(r.views),
          category: str(r.category), thumbnail: str(r.thumbnail), videoUrl: str(r.video_url),
          isLive: r.is_live === true,
        };
      });
    }

    // ── notícias editoriais ─────────────────────────────────────────
    const newsRows = arr<Row>(newsRes.data);
    if (newsRows.length) {
      data.news = newsRows.map((r) => {
        bump(r.updated_at);
        const publishedAt = r.published_at ? str(r.published_at) : undefined;
        return {
          id: str(r.id), title: str(r.title), category: str(r.category) || 'Geral',
          date: str(r.date), isoDate: str(r.iso_date) || str(r.date).slice(0, 10),
          summary: str(r.summary), content: str(r.content),
          status: (str(r.status) || 'published') as import('@/lib/data').NewsArticle['status'],
          author: r.author ? str(r.author) : undefined,
          sourceName: r.source_name ? str(r.source_name) : undefined,
          sourceUrl: r.source_url ? str(r.source_url) : undefined,
          publishedAt, aiAssisted: r.ai_assisted === true,
        };
      });
    }

    // ── escalações publicadas ────────────────────────────────────────
    const lineRows = arr<Row>(lineRes.data);
    if (lineRows.length) {
      data.lineups = {};
      for (const r of lineRows) {
        bump(r.updated_at);
        const mid = str(r.match_id);
        const side = str(r.side) as 'home' | 'away';
        const players = arr<Row>(r.players).map((p) => ({
          name: str(p.name),
          playerId: p.playerId ? str(p.playerId) : undefined,
          number: num(p.number),
          position: p.position ? (str(p.position) as import('@/lib/data').LineupPlayer['position']) : undefined,
          rating: 0,
          isStarter: p.isStarter === true,
        }));
        const entry = (data.lineups[mid] ??= { home: [], away: [] });
        entry[side] = players;
        if (side === 'home') entry.homeCoach = r.coach ? str(r.coach) : undefined;
        else entry.awayCoach = r.coach ? str(r.coach) : undefined;
      }
    }

    // ── eventos de jogo ──────────────────────────────────────────────
    const evRows = arr<Row>(evRes.data);
    if (evRows.length) {
      data.events = {};
      for (const r of evRows) {
        bump(r.updated_at);
        (data.events[str(r.match_id)] ??= []).push({
          minute: r.minute == null ? undefined : num(r.minute),
          type: str(r.type) as import('@/lib/data').MatchEventDetail['type'],
          team: str(r.team_side) as 'home' | 'away',
          player: str(r.player),
          playerId: r.player_id ? str(r.player_id) : undefined,
          assist: r.assist ? str(r.assist) : undefined,
          playerOut: r.player_out ? str(r.player_out) : undefined,
          detail: r.detail ? str(r.detail) : undefined,
        });
      }
    }

    // ── estatísticas de jogo ─────────────────────────────────────────
    const statRows = arr<Row>(statRes.data);
    if (statRows.length) {
      const grouped: Record<string, { home: Record<string, number>; away: Record<string, number>; keys: Set<string> }> = {};
      for (const r of statRows) {
        bump(r.updated_at);
        const mid = str(r.match_id);
        const g = (grouped[mid] ??= { home: {}, away: {}, keys: new Set() });
        const key = str(r.stat_key);
        g.keys.add(key);
        g[str(r.side) as 'home' | 'away'][key] = num(r.value);
      }
      data.matchStats = Object.fromEntries(
        Object.entries(grouped).map(([mid, g]) => [
          mid,
          { home: g.home, away: g.away, keys: [...g.keys] } as NonNullable<PortalData['matchStats']>[string],
        ]),
      ) as PortalData['matchStats'];
    }
  } catch {
    return NextResponse.json({ data: {}, updatedAt: null });
  }

  return NextResponse.json({ data, updatedAt });
}
