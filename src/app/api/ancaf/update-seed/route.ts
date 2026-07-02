import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

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

    // 3. Update Supabase Database (if configured)
    const { error } = await getSupabaseAdmin()
      .from('ancaf_configs')
      .upsert(
        { key: 'active_calendar_seed', value: seedStr, updated_at: new Date().toISOString() },
        { onConflict: 'key' },
      );

    if (error) {
      console.error('Falha ao persistir a seed no Supabase:', error.message);
      return NextResponse.json(
        { error: 'database_error', message: 'Não foi possível guardar a semente' },
        { status: 503 },
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Semente de calendário atualizada com sucesso',
      seed: seedStr,
      persisted: { database: true },
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
