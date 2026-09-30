import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';
import { getMatchById, getMatchOfficials, getMatchRecord } from '@/lib/data';
import { correctionReasonMessage, validCorrectionReason } from '@/lib/admin-match-locks';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePortalData } from '@/lib/portal-cache';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ matchId: string }> };
type EventInput = {
  minute: number | null;
  type: 'goal' | 'yellow' | 'red' | 'warning' | 'sub';
  teamSide: 'home' | 'away';
  player: string;
  playerId?: string | null;
  assist?: string | null;
  playerOut?: string | null;
  detail?: string | null;
};

function text(value: unknown, max = 300): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function safeEvents(value: unknown): EventInput[] | null {
  if (!Array.isArray(value) || value.length > 200) return null;
  const result: EventInput[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') return null;
    const item = raw as Record<string, unknown>;
    const type = item.type;
    const teamSide = item.teamSide;
    const minute = item.minute === null || item.minute === '' ? null : Number(item.minute);
    if (!['goal', 'yellow', 'red', 'warning', 'sub'].includes(String(type))) return null;
    if (teamSide !== 'home' && teamSide !== 'away') return null;
    if (minute !== null && (!Number.isInteger(minute) || minute < 0 || minute > 130)) return null;
    const player = text(item.player, 160);
    if (!player) return null;
    result.push({
      minute,
      type: type as EventInput['type'],
      teamSide,
      player,
      playerId: text(item.playerId, 120) || null,
      assist: text(item.assist, 160) || null,
      playerOut: text(item.playerOut, 160) || null,
      detail: text(item.detail, 500) || null,
    });
  }
  return result;
}

type OperationsMatch = {
  id: string; date: string; stadium: string; status: string; homeScore: number; awayScore: number;
  halfTimeScore: string; attendance: number; usefulTimeMinutes: number; broadcaster: string;
};

// Bloqueios da área administrativa (src/lib/admin-match-locks.ts): num jogo
// com registo, a agenda mostrada e gravada é sempre a do registo; num jogo
// encerrado, o resultado de referência é o do relatório do árbitro.
function withRecord(match: OperationsMatch): OperationsMatch & { scheduleLocked: boolean; scheduleSource: string | null; closed: boolean } {
  const record = getMatchRecord(match.id);
  if (!record) return { ...match, scheduleLocked: false, scheduleSource: null, closed: false };
  const closed = record.result?.status === 'finished';
  return {
    ...match,
    date: record.schedule.date,
    stadium: record.schedule.stadium,
    broadcaster: record.schedule.broadcaster ?? '',
    ...(closed && record.result ? {
      status: 'finished',
      homeScore: record.result.homeScore,
      awayScore: record.result.awayScore,
      halfTimeScore: record.result.halfTimeScore ?? '',
    } : {}),
    scheduleLocked: true,
    scheduleSource: record.schedule.source ?? null,
    closed,
  };
}

async function sessionOrNull() {
  return getAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
}

export async function GET(_request: Request, { params }: Context) {
  const session = await sessionOrNull();
  if (!session || session.profile !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { matchId } = await params;
  const fallback = getMatchById(matchId);
  if (!fallback) return NextResponse.json({ error: 'not_found', message: 'Jogo não encontrado.' }, { status: 404 });

  const officialsFallback = getMatchOfficials(fallback);
  try {
    const db = getSupabaseAdmin();
    const [matchResult, officialsResult, eventsResult, reportResult, auditResult] = await Promise.all([
      db.from('ancaf_matches').select('*').eq('id', matchId).maybeSingle(),
      db.from('ancaf_match_officials').select('*').eq('match_id', matchId).maybeSingle(),
      db.from('ancaf_match_events').select('*').eq('match_id', matchId).order('sort'),
      db.from('ancaf_match_reports').select('*').eq('match_id', matchId).maybeSingle(),
      db.from('ancaf_match_audit_log').select('id,action,actor_email,created_at').eq('match_id', matchId).order('created_at', { ascending: false }).limit(12),
    ]);
    const row = matchResult.data;
    return NextResponse.json({
      match: withRecord(row ? {
        id: matchId, date: row.date, stadium: row.stadium ?? '', status: row.status,
        homeScore: row.home_score ?? 0, awayScore: row.away_score ?? 0,
        halfTimeScore: row.half_time_score ?? '', attendance: row.attendance ?? 0,
        usefulTimeMinutes: row.useful_time_minutes ?? 0, broadcaster: row.broadcaster ?? '',
      } : {
        id: matchId, date: fallback.date, stadium: fallback.stadium, status: fallback.status,
        homeScore: fallback.homeScore, awayScore: fallback.awayScore,
        halfTimeScore: fallback.halfTimeScore ?? '', attendance: fallback.attendance ?? 0,
        usefulTimeMinutes: fallback.usefulTimeMinutes ?? 0, broadcaster: fallback.broadcaster ?? '',
      }),
      officials: officialsResult.data ?? {
        referee: officialsFallback.referee, assistant_1: officialsFallback.assistants[0],
        assistant_2: officialsFallback.assistants[1], fourth_official: officialsFallback.fourth,
        commissioner: '', referee_category: '',
      },
      events: (eventsResult.data ?? []).map((event) => ({
        minute: event.minute, type: event.type, teamSide: event.team_side,
        player: event.player, playerId: event.player_id, assist: event.assist,
        playerOut: event.player_out, detail: event.detail,
      })),
      report: reportResult.data ?? { summary: '', incidents: '', pitch_conditions: '', organisation_notes: '', status: 'draft' },
      audit: auditResult.data ?? [],
    });
  } catch {
    return NextResponse.json({
      match: withRecord({ id: matchId, date: fallback.date, stadium: fallback.stadium, status: fallback.status, homeScore: fallback.homeScore, awayScore: fallback.awayScore, halfTimeScore: fallback.halfTimeScore ?? '', attendance: fallback.attendance ?? 0, usefulTimeMinutes: fallback.usefulTimeMinutes ?? 0, broadcaster: fallback.broadcaster ?? '' }),
      officials: { referee: officialsFallback.referee, assistant_1: officialsFallback.assistants[0], assistant_2: officialsFallback.assistants[1], fourth_official: officialsFallback.fourth, commissioner: '', referee_category: '' },
      events: [], report: { summary: '', incidents: '', pitch_conditions: '', organisation_notes: '', status: 'draft' }, audit: [],
    });
  }
}

export async function PUT(request: Request, { params }: Context) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const rl = checkRateLimit(request, 'admin-match-operations', 80, 10 * 60 * 1000);
  if (!rl.allowed) return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
  const session = await sessionOrNull();
  if (!session || session.profile !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { matchId } = await params;
  if (!getMatchById(matchId)) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'bad_request' }, { status: 400 }); }
  const section = body.section;
  const value = body.value && typeof body.value === 'object' ? body.value as Record<string, unknown> : {};
  const db = getSupabaseAdmin();
  const now = new Date().toISOString();
  let before: unknown = {};
  let error: { message: string } | null = null;
  // O histórico só aceita estas ações (migração 20260919002000): o bloco
  // "partida" regista-se como 'update'; uma correção leva o motivo nos dados.
  const action = section === 'match' ? 'update' : String(section);
  let auditValue: unknown = value;

  if (section === 'match') {
    before = (await db.from('ancaf_matches').select('*').eq('id', matchId).maybeSingle()).data ?? {};
    const homeScore = Number(value.homeScore);
    const awayScore = Number(value.awayScore);
    const status = value.status;
    if (!Number.isInteger(homeScore) || homeScore < 0 || !Number.isInteger(awayScore) || awayScore < 0 || !['scheduled', 'live', 'finished'].includes(String(status))) {
      return NextResponse.json({ error: 'invalid_match', message: 'Estado ou placar inválido.' }, { status: 422 });
    }
    const record = getMatchRecord(matchId);
    const halfTimeScore = text(value.halfTimeScore, 20);
    // Jogo encerrado: mudar o resultado do relatório do árbitro exige motivo.
    if (record?.result?.status === 'finished') {
      const official = record.result;
      const changed = status !== 'finished' || homeScore !== official.homeScore || awayScore !== official.awayScore
        || halfTimeScore !== (official.halfTimeScore ?? '');
      if (changed) {
        const reason = validCorrectionReason(body.reason);
        if (!reason) return NextResponse.json({ error: 'reason_required', message: correctionReasonMessage([matchId]) }, { status: 422 });
        auditValue = { ...value, correction_reason: reason };
      }
    }
    // Agenda: num jogo com registo grava-se a do registo (mapa oficial), nunca
    // a que vier do pedido.
    const schedule = record
      ? { date: record.schedule.date, stadium: record.schedule.stadium, broadcaster: record.schedule.broadcaster ?? null, schedule_status: record.schedule.scheduleStatus }
      : { date: text(value.date, 60), stadium: text(value.stadium, 180), broadcaster: text(value.broadcaster, 100) || null, schedule_status: 'official' };
    const patch = {
      ...schedule, status,
      home_score: homeScore, away_score: awayScore, score: status === 'scheduled' ? null : `${homeScore}-${awayScore}`,
      half_time_score: halfTimeScore || null,
      attendance: Math.max(0, Math.trunc(Number(value.attendance) || 0)),
      useful_time_minutes: Math.min(130, Math.max(0, Math.trunc(Number(value.usefulTimeMinutes) || 0))),
      updated_at: now,
    };
    ({ error } = await db.from('ancaf_matches').update(patch).eq('id', matchId));
  } else if (section === 'officials') {
    before = (await db.from('ancaf_match_officials').select('*').eq('match_id', matchId).maybeSingle()).data ?? {};
    const row = {
      match_id: matchId, referee: text(value.referee, 180), referee_category: text(value.referee_category, 180),
      assistant_1: text(value.assistant_1, 180), assistant_2: text(value.assistant_2, 180),
      fourth_official: text(value.fourth_official, 180), commissioner: text(value.commissioner, 180), updated_at: now,
    };
    ({ error } = await db.from('ancaf_match_officials').upsert(row, { onConflict: 'match_id' }));
    if (!error) await db.from('ancaf_matches').update({ referee: row.referee || null, assistant_referees: [row.assistant_1, row.assistant_2], fourth_official: row.fourth_official || null, updated_at: now }).eq('id', matchId);
  } else if (section === 'events') {
    before = (await db.from('ancaf_match_events').select('*').eq('match_id', matchId).order('sort')).data ?? [];
    const events = safeEvents(value.events);
    if (!events) return NextResponse.json({ error: 'invalid_events', message: 'Revise os dados das ocorrências.' }, { status: 422 });
    const deletion = await db.from('ancaf_match_events').delete().eq('match_id', matchId);
    error = deletion.error;
    if (!error && events.length) {
      const inserted = await db.from('ancaf_match_events').insert(events.map((event, sort) => ({ match_id: matchId, minute: event.minute, type: event.type, team_side: event.teamSide, player: event.player, player_id: event.playerId, assist: event.assist, player_out: event.playerOut, detail: event.detail, sort, updated_at: now })));
      error = inserted.error;
    }
  } else if (section === 'report') {
    before = (await db.from('ancaf_match_reports').select('*').eq('match_id', matchId).maybeSingle()).data ?? {};
    const status = ['draft', 'review', 'approved'].includes(String(value.status)) ? value.status : 'draft';
    ({ error } = await db.from('ancaf_match_reports').upsert({ match_id: matchId, summary: text(value.summary, 10000), incidents: text(value.incidents, 10000), pitch_conditions: text(value.pitch_conditions, 5000), organisation_notes: text(value.organisation_notes, 10000), status, updated_by: session.email, updated_at: now }, { onConflict: 'match_id' }));
  } else {
    return NextResponse.json({ error: 'bad_request', message: 'Secção desconhecida.' }, { status: 400 });
  }

  if (error) return NextResponse.json({ error: 'write_failed', message: error.message }, { status: 500 });
  await db.from('ancaf_match_audit_log').insert({ match_id: matchId, actor_email: session.email, action, before_data: before, after_data: auditValue, created_at: now });
  revalidatePortalData();
  return NextResponse.json({ ok: true, savedAt: now });
}
