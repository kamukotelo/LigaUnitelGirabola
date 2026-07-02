import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { generateGirabolaCalendar } from '@/lib/ancaf-engine';

const SYNC_TOKEN = process.env.ANCAF_SYNC_TOKEN;

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    if (!SYNC_TOKEN) {
      return NextResponse.json(
        { error: 'server_misconfigured', message: 'ANCAF_SYNC_TOKEN não configurado' },
        { status: 503 },
      );
    }

    // 1. Authenticate Request
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'unauthorized', message: 'Token de autorização em falta' }, { status: 401 });
    }

    const token = authHeader.substring(7).trim();
    if (token !== SYNC_TOKEN) {
      return NextResponse.json({ error: 'unauthorized', message: 'Token de autorização inválido' }, { status: 401 });
    }

    // 2. Parse Body
    const { seed } = await request.json();
    const parsedSeed = Number(seed);
    if (!Number.isSafeInteger(parsedSeed) || parsedSeed <= 0) {
      return NextResponse.json({ error: 'bad_request', message: 'Parâmetro seed inválido ou ausente' }, { status: 400 });
    }

    const seedStr = String(parsedSeed);

    // 3. Gerar os jogos da época 2026/2027 dinamicamente com base na semente
    const matches2026_27 = generateGirabolaCalendar(parsedSeed, 2026, 'm27-');

    const dbMatches = matches2026_27.map(m => ({
      id: m.id,
      season_id: '2026-27',
      round: m.round,
      home_team_id: m.homeTeamId,
      away_team_id: m.awayTeamId,
      home_team: m.homeTeam,
      away_team: m.awayTeam,
      home_score: m.homeScore || 0,
      away_score: m.awayScore || 0,
      score: m.score || null,
      date: m.date,
      stadium: m.stadium,
      status: m.status
    }));

    const client = getSupabaseAdmin();

    // 4. Update Supabase Database (active seed e jogos)
    const { error: seedError } = await client
      .from('ancaf_configs')
      .upsert(
        { key: 'active_calendar_seed', value: seedStr, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

    if (seedError) {
      console.error('Falha ao persistir a seed no Supabase (ancaf_configs):', seedError.message);
      return NextResponse.json(
        { error: 'database_error', message: 'Não foi possível guardar a semente de sorteio' },
        { status: 503 },
      );
    }

    // Persistir também nas tabelas equivalentes com o prefixo liga_
    await client
      .from('liga_configs')
      .upsert(
        { key: 'active_calendar_seed', value: seedStr, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );

    // Efetuar upsert dos jogos gerados nas tabelas de correspondências (matches)
    const { error: matchErrorAncaf } = await client.from('ancaf_matches').upsert(dbMatches, { onConflict: 'id' });
    if (matchErrorAncaf) {
      console.error('Falha ao inserir jogos na tabela ancaf_matches:', matchErrorAncaf.message);
    }

    const { error: matchErrorLiga } = await client.from('liga_matches').upsert(dbMatches, { onConflict: 'id' });
    if (matchErrorLiga) {
      console.error('Falha ao inserir jogos na tabela liga_matches:', matchErrorLiga.message);
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Semente de calendário atualizada e jogos povoados com sucesso para 2026/2027',
      seed: seedStr,
      persisted: { database: true, matches_count: dbMatches.length },
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
