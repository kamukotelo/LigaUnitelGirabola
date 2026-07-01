import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

// Bearer Token for securing the API sync
const SYNC_TOKEN = process.env.ANCAF_SYNC_TOKEN || 'ancaf_secret_sync_token_2026';

export async function POST(request: Request) {
  try {
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
    if (!seed || isNaN(Number(seed))) {
      return NextResponse.json({ error: 'bad_request', message: 'Parâmetro seed inválido ou ausente' }, { status: 400 });
    }

    const seedStr = String(seed).trim();

    // 3. Update Supabase Database (if configured)
    let dbUpdated = false;
    let dbError = null;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
      try {
        const { error } = await supabase
          .from('ancaf_configs')
          .upsert(
            { key: 'active_calendar_seed', value: seedStr, updated_at: new Date().toISOString() },
            { onConflict: 'key' }
          );
        if (!error) {
          dbUpdated = true;
        } else {
          dbError = error.message;
        }
      } catch (err: any) {
        dbError = err.message || err;
      }
    }

    // 4. Update local data.ts file (for local development and git sync persistence)
    let fileUpdated = false;
    try {
      const dataFilePath = path.join(process.cwd(), 'src/lib/data.ts');
      if (fs.existsSync(dataFilePath)) {
        let content = fs.readFileSync(dataFilePath, 'utf-8');
        
        // Regex to match and replace accessCode
        const accessCodeRegex = /(accessCode:\s*['"])\d+(['"])/g;
        // Regex to match and replace generatedAt
        const generatedAtRegex = /(generatedAt:\s*['"])[^'"]+(['"])/g;

        if (accessCodeRegex.test(content)) {
          content = content.replace(accessCodeRegex, `$1${seedStr}$2`);
          content = content.replace(generatedAtRegex, `$1${new Date().toISOString()}$2`);
          fs.writeFileSync(dataFilePath, content, 'utf-8');
          fileUpdated = true;
        }
      }
    } catch (err) {
      console.error('Failed to update local data.ts:', err);
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Semente de calendário atualizada com sucesso',
      seed: seedStr,
      persisted: {
        database: dbUpdated,
        localFile: fileUpdated
      },
      warning: (!dbUpdated && !fileUpdated) ? 'A semente não pôde ser guardada no Supabase nem no ficheiro de código.' : undefined,
      dbError
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
