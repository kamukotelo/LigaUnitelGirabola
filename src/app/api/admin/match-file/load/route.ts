import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePortalData } from '@/lib/portal-cache';
import {
  validateMatchFile,
  parseFcmsPdfBytes,
  type MatchFilePayload,
  type MatchFileEvent,
} from '@/lib/match-file-parser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'forbidden', message: 'Origem não autorizada.' }, { status: 403 });
  }

  const rl = checkRateLimit(request, 'admin-match-file-load', 40, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: 'too_many_requests', message: 'Demasiados pedidos. Tente mais tarde.' }, { status: 429 });
  }

  const session = getAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!session || session.profile !== 'admin') {
    return NextResponse.json({ error: 'unauthorized', message: 'Sessão de administração inválida.' }, { status: 401 });
  }

  let rawPayload: unknown = null;
  let targetMatchIdOverride: string | null = null;

  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      targetMatchIdOverride = (formData.get('targetMatchId') as string) || null;

      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: 'bad_request', message: 'Nenhum ficheiro recebido.' }, { status: 400 });
      }

      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        const bytes = new Uint8Array(await file.arrayBuffer());
        rawPayload = await parseFcmsPdfBytes(bytes);
      } else if (file.name.toLowerCase().endsWith('.json') || file.type === 'application/json') {
        const text = await file.text();
        rawPayload = JSON.parse(text);
      } else {
        return NextResponse.json({ error: 'bad_request', message: 'Formato não suportado. Envie um ficheiro .json ou .pdf do FCMS.' }, { status: 400 });
      }
    } catch (err) {
      return NextResponse.json({ error: 'parse_error', message: `Erro ao ler o ficheiro: ${(err as Error).message}` }, { status: 400 });
    }
  } else {
    try {
      const body = await request.json();
      rawPayload = body.payload || body;
      targetMatchIdOverride = body.targetMatchId || null;
    } catch (err) {
      return NextResponse.json({ error: 'bad_request', message: 'Corpo JSON inválido.' }, { status: 400 });
    }
  }

  const validation = validateMatchFile(rawPayload);
  const matchId = targetMatchIdOverride || validation.matchId;

  if (!matchId) {
    return NextResponse.json(
      {
        error: 'match_not_found',
        message: 'Não foi possível associar este ficheiro a nenhum jogo do campeonato. Especifique o jogo de destino.',
        validation,
      },
      { status: 422 },
    );
  }

  const payload: MatchFilePayload = {
    ...validation.payloadNormalizado,
    matchId,
  };

  const admin = getSupabaseAdmin();

  // 1. Verificar jogo existente na BD
  const { data: matchBefore, error: matchReadErr } = await admin
    .from('ancaf_matches')
    .select('*')
    .eq('id', matchId)
    .maybeSingle();

  if (matchReadErr || !matchBefore) {
    return NextResponse.json(
      { error: 'match_not_found', message: `Jogo ${matchId} não foi encontrado na base de dados.` },
      { status: 404 },
    );
  }

  const nowStamp = new Date().toISOString();
  const scoreStr = `${payload.resultado.casa}-${payload.resultado.fora}`;
  const p1 = payload.resultado.periodos?.primeiroPeriodo;
  const halfTimeScore = p1 ? `${p1.casa}-${p1.fora}` : matchBefore.half_time_score;

  // 2. Preparar atualização de ancaf_matches
  const matchPatch: Record<string, unknown> = {
    score: scoreStr,
    home_score: payload.resultado.casa,
    away_score: payload.resultado.fora,
    status: payload.resultado.estado,
    stadium: payload.localizacao.estadio || matchBefore.stadium,
    referee: payload.oficiais.arbitro || matchBefore.referee,
    assistant_referees: [payload.oficiais.assistente1, payload.oficiais.assistente2].filter(Boolean),
    fourth_official: payload.oficiais.quartoArbitro || matchBefore.fourth_official,
    half_time_score: halfTimeScore,
    schedule_status: 'official',
    updated_at: nowStamp,
  };

  if (payload.kickoff.dataHoraIso) {
    matchPatch.date = payload.kickoff.dataHoraIso;
  }
  if (typeof payload.resultado.espectadores === 'number') {
    matchPatch.attendance = payload.resultado.espectadores;
  }
  if (typeof payload.resultado.tempoUtilMinutos === 'number') {
    matchPatch.useful_time_minutes = payload.resultado.tempoUtilMinutos;
  }
  if (payload.transmissao?.televisao) {
    matchPatch.broadcaster = payload.transmissao.televisao;
  }

  const { error: updateMatchErr } = await admin
    .from('ancaf_matches')
    .update(matchPatch)
    .eq('id', matchId);

  if (updateMatchErr) {
    return NextResponse.json(
      { error: 'db_error', message: `Falha ao atualizar jogo: ${updateMatchErr.message}` },
      { status: 500 },
    );
  }

  // 3. Atualizar escalações se fornecidas
  let lineupsCount = 0;
  if (payload.escalacoes) {
    const lineupsToUpsert = [];
    const homeCoach = payload.equipaTecnica?.casa?.find((t) => /head coach|treinador principal/i.test(t.cargo))?.nome || null;
    const awayCoach = payload.equipaTecnica?.fora?.find((t) => /head coach|treinador principal/i.test(t.cargo))?.nome || null;

    if (payload.escalacoes.casa) {
      const allHome = [
        ...(payload.escalacoes.casa.titulares || []).map((p) => ({
          playerId: p.maId || `p-${payload.equipas.casa.id}-${p.numero}`,
          name: p.nome,
          number: p.numero,
          position: p.posicao || (p.isGuardaRedes ? 'GK' : null),
          isStarter: true,
          isCaptain: Boolean(p.isCapitao),
        })),
        ...(payload.escalacoes.casa.suplentes || []).map((p) => ({
          playerId: p.maId || `p-${payload.equipas.casa.id}-${p.numero}`,
          name: p.nome,
          number: p.numero,
          position: p.posicao || null,
          isStarter: false,
          isCaptain: false,
        })),
      ];

      lineupsToUpsert.push({
        match_id: matchId,
        team_id: payload.equipas.casa.id || matchBefore.home_team_id,
        side: 'home',
        players: allHome,
        coach: homeCoach,
        confirmed_by: `Arquivo de Jogo FCMS (Admin ${session.email})`,
        confirmed_at: nowStamp,
        updated_at: nowStamp,
      });
      lineupsCount += allHome.length;
    }

    if (payload.escalacoes.fora) {
      const allAway = [
        ...(payload.escalacoes.fora.titulares || []).map((p) => ({
          playerId: p.maId || `p-${payload.equipas.fora.id}-${p.numero}`,
          name: p.nome,
          number: p.numero,
          position: p.posicao || (p.isGuardaRedes ? 'GK' : null),
          isStarter: true,
          isCaptain: Boolean(p.isCapitao),
        })),
        ...(payload.escalacoes.fora.suplentes || []).map((p) => ({
          playerId: p.maId || `p-${payload.equipas.fora.id}-${p.numero}`,
          name: p.nome,
          number: p.numero,
          position: p.posicao || null,
          isStarter: false,
          isCaptain: false,
        })),
      ];

      lineupsToUpsert.push({
        match_id: matchId,
        team_id: payload.equipas.fora.id || matchBefore.away_team_id,
        side: 'away',
        players: allAway,
        coach: awayCoach,
        confirmed_by: `Arquivo de Jogo FCMS (Admin ${session.email})`,
        confirmed_at: nowStamp,
        updated_at: nowStamp,
      });
      lineupsCount += allAway.length;
    }

    if (lineupsToUpsert.length > 0) {
      await admin.from('ancaf_match_lineups').upsert(lineupsToUpsert, { onConflict: 'match_id,team_id' });
    }
  }

  // 4. Atualizar eventos (golos, cartões, substituições)
  let eventsCount = 0;
  if (Array.isArray(payload.eventos)) {
    // Apagar eventos antigos deste jogo para garantir substituição idempotente
    await admin.from('ancaf_match_events').delete().eq('match_id', matchId);

    const eventRows = payload.eventos.map((ev: MatchFileEvent, index: number) => {
      let detail = ev.motivo || null;
      if (ev.tipo === 'golo' && ev.acrescimo) {
        detail = `+${ev.acrescimo}'`;
      }
      return {
        match_id: matchId,
        minute: ev.minuto,
        type: ev.tipo === 'amarelo' ? 'yellow' : ev.tipo === 'vermelho' ? 'red' : ev.tipo === 'substituicao' ? 'sub' : 'goal',
        team_side: ev.equipa,
        player: ev.jogador || ev.jogadorEntra || '',
        player_id: ev.numero ? `p-${ev.equipa === 'casa' ? payload.equipas.casa.id : payload.equipas.fora.id}-${ev.numero}` : null,
        player_out: ev.jogadorSai || null,
        detail,
        sort: index + 1,
        updated_at: nowStamp,
      };
    });

    if (eventRows.length > 0) {
      await admin.from('ancaf_match_events').insert(eventRows);
      eventsCount = eventRows.length;
    }
  }

  // 5. Atualizar nomeações de arbitragem
  if (payload.oficiais.arbitro) {
    const nomination = {
      season_id: matchBefore.season_id || '2026-27',
      round: matchBefore.round,
      match_id: matchId,
      referee: payload.oficiais.arbitro,
      assistants: [payload.oficiais.assistente1, payload.oficiais.assistente2].filter(Boolean),
      fourth_official: payload.oficiais.quartoArbitro || null,
      published_at: nowStamp,
      updated_at: nowStamp,
    };
    await admin.from('ancaf_referee_nominations').upsert(nomination, { onConflict: 'match_id' });
  }

  // 6. Atualizar configs de override em tempo real (override_calendar e override_nominations)
  try {
    const { data: calRow } = await admin.from('ancaf_configs').select('value').eq('key', 'override_calendar').maybeSingle();
    const calendarOverrides = calRow?.value ? JSON.parse(calRow.value) : {};
    calendarOverrides[matchId] = {
      ...(calendarOverrides[matchId] || {}),
      score: scoreStr,
      homeScore: payload.resultado.casa,
      awayScore: payload.resultado.fora,
      status: payload.resultado.estado,
      date: payload.kickoff.dataHoraIso || matchBefore.date,
      stadium: payload.localizacao.estadio || matchBefore.stadium,
      referee: payload.oficiais.arbitro || matchBefore.referee,
      halfTimeScore,
      scheduleStatus: 'official',
      ...(typeof payload.resultado.espectadores === 'number' ? { attendance: payload.resultado.espectadores } : {}),
      ...(typeof payload.resultado.tempoUtilMinutos === 'number' ? { usefulTimeMinutes: payload.resultado.tempoUtilMinutos } : {}),
      ...(payload.transmissao?.televisao ? { broadcaster: payload.transmissao.televisao } : {}),
    };
    await admin.from('ancaf_configs').upsert({ key: 'override_calendar', value: JSON.stringify(calendarOverrides) }, { onConflict: 'key' });

    if (payload.oficiais.arbitro) {
      const { data: nomRow } = await admin.from('ancaf_configs').select('value').eq('key', 'override_nominations').maybeSingle();
      const nominationOverrides = nomRow?.value ? JSON.parse(nomRow.value) : {};
      nominationOverrides[matchId] = {
        referee: payload.oficiais.arbitro,
        assistants: [payload.oficiais.assistente1, payload.oficiais.assistente2].filter(Boolean),
        fourth: payload.oficiais.quartoArbitro,
      };
      await admin.from('ancaf_configs').upsert({ key: 'override_nominations', value: JSON.stringify(nominationOverrides) }, { onConflict: 'key' });
    }
  } catch (overrideErr) {
    console.warn('Aviso ao sincronizar override_calendar / override_nominations:', overrideErr);
  }

  // 7. Registar no log de auditoria
  await admin.from('ancaf_match_audit_log').insert({
    match_id: matchId,
    actor_email: session.email,
    action: 'publish',
    before_data: matchBefore,
    after_data: { ...matchBefore, ...matchPatch },
    created_at: nowStamp,
  });

  // 8. Revalidar cache pública instantaneamente
  revalidatePortalData();

  return NextResponse.json({
    ok: true,
    message: `Jogo ${matchId} atualizado com sucesso no site!`,
    matchId,
    score: scoreStr,
    summary: {
      matchId,
      homeTeam: payload.equipas.casa.nome,
      awayTeam: payload.equipas.fora.nome,
      score: scoreStr,
      status: payload.resultado.estado,
      eventsWritten: eventsCount,
      lineupsWritten: lineupsCount,
      referee: payload.oficiais.arbitro,
    },
  });
}
