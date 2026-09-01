import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { checkRateLimit, isSameOriginRequest, safeSecretEqual } from '@/lib/request-security';
import { fcmsPayloadFingerprint, normaliseFcmsMatches, parseFcmsSyncPayload } from '@/lib/fcms-sync';

export const dynamic = 'force-dynamic';

function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  return header?.startsWith('Bearer ') ? header.slice(7).trim() : null;
}

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, 'fcms-sync', 20, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'too_many_requests' }, { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } });
  }

  const adminSession = getAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
  const authorisedAdmin = adminSession?.profile === 'admin' && isSameOriginRequest(request);
  const syncToken = process.env.FCMS_SYNC_TOKEN;
  if (!authorisedAdmin && (!syncToken || safeSecretEqual(syncToken, process.env.SUPABASE_SERVICE_ROLE_KEY))) {
    return NextResponse.json({ error: 'server_misconfigured', message: 'FCMS_SYNC_TOKEN independente não configurado.' }, { status: 503 });
  }
  if (!authorisedAdmin && !safeSecretEqual(bearerToken(request), syncToken)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let runId: string | null = null;
  try {
    const payload = parseFcmsSyncPayload(await request.json());
    const fingerprint = fcmsPayloadFingerprint(payload);
    const client = getSupabaseAdmin();

    const externalIds = [...new Set(payload.matches.flatMap((match) => [match.homeExternalId, match.awayExternalId]))];
    const { data: mappingRows, error: mappingError } = await client
      .from('ancaf_fcms_team_mappings')
      .select('external_team_id,team_id')
      .eq('provider', payload.provider)
      .eq('tenant', payload.tenant)
      .in('external_team_id', externalIds);
    if (mappingError) throw mappingError;
    const matches = normaliseFcmsMatches(payload, (mappingRows ?? []).map((row) => ({
      externalTeamId: row.external_team_id,
      teamId: row.team_id,
    })));

    const { data: run, error: runError } = await client.from('ancaf_fcms_sync_runs').insert({
      provider: payload.provider,
      tenant: payload.tenant,
      competition_external_id: payload.competitionExternalId,
      season_id: payload.seasonId,
      request_fingerprint: fingerprint,
      dry_run: payload.dryRun === true,
      status: payload.dryRun ? 'validated' : 'running',
      matches_received: matches.length,
    }).select('id').single();
    if (runError) throw runError;
    runId = run.id;

    if (payload.dryRun) {
      return NextResponse.json({ status: 'ok', dryRun: true, runId, fingerprint, matchesValidated: matches.length });
    }

    const resolvedMatches = [] as Array<{ externalMatchId: string; matchId: string; match: typeof matches[number] }>;
    for (const match of matches) {
      const { data: existingMapping, error: existingMappingError } = await client
        .from('ancaf_fcms_match_mappings')
        .select('match_id')
        .eq('provider', payload.provider)
        .eq('tenant', payload.tenant)
        .eq('external_match_id', match.externalMatchId)
        .maybeSingle();
      if (existingMappingError) throw existingMappingError;

      let matchId = existingMapping?.match_id as string | undefined;
      if (!matchId) {
        const dayStart = `${match.kickoff.slice(0, 10)}T00:00:00`;
        const dayEnd = `${match.kickoff.slice(0, 10)}T23:59:59`;
        const { data: candidates, error: candidatesError } = await client
          .from('ancaf_matches')
          .select('id')
          .eq('season_id', payload.seasonId)
          .eq('round', match.round)
          .eq('home_team_id', match.homeTeamId)
          .eq('away_team_id', match.awayTeamId)
          .gte('date', dayStart)
          .lte('date', dayEnd);
        if (candidatesError) throw candidatesError;
        if (candidates?.length !== 1) throw new Error(`Jogo interno não resolvido de forma única: ${match.externalMatchId}`);
        matchId = candidates[0].id;
      }
      if (!matchId) throw new Error(`Jogo interno não resolvido: ${match.externalMatchId}`);
      resolvedMatches.push({ externalMatchId: match.externalMatchId, matchId, match });
    }

    for (const resolved of resolvedMatches) {
      const matchUpdate = {
        home_score: resolved.match.homeScore,
        away_score: resolved.match.awayScore,
        score: resolved.match.score,
        half_time_score: resolved.match.halfTimeScore,
        status: 'finished',
        broadcaster: resolved.match.broadcaster,
        stadium: resolved.match.stadium || undefined,
        updated_at: new Date().toISOString(),
      };
      const { error: updateError } = await client.from('ancaf_matches').update(matchUpdate).eq('id', resolved.matchId);
      if (updateError) throw updateError;
      await client.from('liga_matches').update(matchUpdate).eq('id', resolved.matchId);

      const { error: mapError } = await client.from('ancaf_fcms_match_mappings').upsert({
        provider: payload.provider,
        tenant: payload.tenant,
        external_match_id: resolved.externalMatchId,
        match_id: resolved.matchId,
      }, { onConflict: 'provider,tenant,external_match_id' });
      if (mapError) throw mapError;

      if (resolved.match.eventsProvided) {
        const { error: deleteError } = await client.from('ancaf_match_events').delete().eq('match_id', resolved.matchId);
        if (deleteError) throw deleteError;
      }
      if (resolved.match.eventsProvided && resolved.match.events.length) {
        const { error: eventsError } = await client.from('ancaf_match_events').insert(resolved.match.events.map((event, sort) => ({
          match_id: resolved.matchId,
          minute: event.minute,
          type: event.type,
          team_side: event.teamSide,
          player: event.player,
          // O ID FCMS do jogador não é um ID interno do portal. Só será
          // persistido depois de existir uma tabela explícita de jogadores.
          player_id: null,
          player_out: event.playerOut || null,
          detail: event.detail || null,
          sort,
        })));
        if (eventsError) throw eventsError;
      }
    }

    const eventsWritten = resolvedMatches.reduce((total, item) => total + item.match.events.length, 0);
    await client.from('ancaf_fcms_sync_runs').update({
      status: 'completed',
      matches_written: resolvedMatches.length,
      events_written: eventsWritten,
      completed_at: new Date().toISOString(),
    }).eq('id', runId);

    return NextResponse.json({ status: 'ok', dryRun: false, runId, fingerprint, matchesWritten: resolvedMatches.length, eventsWritten });
  } catch (error) {
    if (runId) {
      try {
        await getSupabaseAdmin().from('ancaf_fcms_sync_runs').update({
          status: 'failed',
          error_message: error instanceof Error ? error.message.slice(0, 1000) : 'Erro desconhecido',
          completed_at: new Date().toISOString(),
        }).eq('id', runId);
      } catch { /* a resposta original continua prioritária */ }
    }
    const message = error instanceof Error ? error.message : 'Erro interno';
    const badRequest = /inválido|não suportado|duplicado|Mapeamento|não resolvido|não coincidem|alheio/.test(message);
    return NextResponse.json({ error: badRequest ? 'bad_request' : 'sync_failed', message }, { status: badRequest ? 400 : 503 });
  }
}
