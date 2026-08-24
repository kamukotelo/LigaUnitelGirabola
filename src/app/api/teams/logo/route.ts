import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getTeamById } from '@/lib/data';
import { ADMIN_COOKIE, isAdminSession, verifyPasscode } from '@/lib/admin-auth';
import { isSameOriginRequest } from '@/lib/request-security';

// ── ENDPOINT · POST /api/teams/logo ──────────────────────────────────────
// Persiste (globalmente) o emblema/logótipo de um clube. Recebe da consola de
// administração um data URL (upload) ou um URL externo, guarda a imagem no
// bucket `team-logos` do Supabase Storage e atualiza `ancaf_teams.logo_url`.
// A escrita usa o service_role; o acesso é validado pela credencial de gestão.

export const dynamic = 'force-dynamic';

const BUCKET = 'team-logos';
const MAX_DATA_URL_BYTES = 800 * 1024; // ~800 KB por logótipo

const MIME_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

function publicUrlFor(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

// Garante que o bucket público existe (idempotente). O service_role ignora RLS,
// por isso basta o bucket ser público para a leitura anónima funcionar.
type SupabaseAdmin = ReturnType<typeof getSupabaseAdmin>;
async function ensureBucket(client: SupabaseAdmin): Promise<void> {
  const { data } = await client.storage.getBucket(BUCKET);
  if (!data) {
    await client.storage.createBucket(BUCKET, { public: true });
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'forbidden', message: 'Origem do pedido não autorizada.' }, { status: 403 });
  }
  let body: { teamId?: unknown; logoUrl?: unknown; passcode?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Corpo inválido.' }, { status: 400 });
  }

  const { teamId, logoUrl, passcode } = body;

  // 1. Autenticação: cookie de sessão (emitido por /api/admin/login) ou, em
  //    alternativa, a credencial de gestão no corpo (uso programático). Em
  //    ambos os casos a validação é feita no servidor.
  const sessionCookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  const authorized = isAdminSession(sessionCookie) || verifyPasscode(passcode);
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized', message: 'Credencial de gestão inválida.' }, { status: 401 });
  }

  // 2. Validação do clube.
  if (typeof teamId !== 'string' || !getTeamById(teamId)) {
    return NextResponse.json({ error: 'bad_request', message: 'Clube desconhecido.' }, { status: 400 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !serviceKey || serviceKey === 'your-supabase-service-role-key') {
    return NextResponse.json(
      { error: 'server_misconfigured', message: 'Chave de serviço do Supabase não configurada no servidor.' },
      { status: 503 },
    );
  }

  const client = getSupabaseAdmin();

  try {
    // 3a. Repor emblema — logoUrl vazio/nulo limpa a coluna e o ficheiro.
    if (logoUrl === null || logoUrl === undefined || logoUrl === '') {
      await client.storage.from(BUCKET).remove(
        Object.values(MIME_EXT).map((ext) => `${teamId}.${ext}`),
      );
      const { error } = await client.from('ancaf_teams').update({ logo_url: null }).eq('id', teamId);
      if (error) throw new Error(error.message);
      return NextResponse.json({ ok: true, logoUrl: null });
    }

    if (typeof logoUrl !== 'string') {
      return NextResponse.json({ error: 'bad_request', message: 'Logótipo inválido.' }, { status: 400 });
    }

    let finalUrl = logoUrl;

    // 3b. Upload — data URL de imagem é guardado no bucket.
    const dataMatch = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(logoUrl);
    if (dataMatch) {
      const mime = dataMatch[1].toLowerCase();
      const ext = MIME_EXT[mime];
      if (!ext) {
        return NextResponse.json({ error: 'bad_request', message: 'Formato de imagem não suportado.' }, { status: 400 });
      }
      const buffer = Buffer.from(dataMatch[2], 'base64');
      if (buffer.byteLength > MAX_DATA_URL_BYTES) {
        return NextResponse.json({ error: 'payload_too_large', message: 'Imagem demasiado grande (máx. ~800 KB).' }, { status: 413 });
      }

      await ensureBucket(client);

      // Remove versões anteriores noutras extensões para não deixar órfãos.
      await client.storage.from(BUCKET).remove(
        Object.values(MIME_EXT).filter((e) => e !== ext).map((e) => `${teamId}.${e}`),
      );

      const path = `${teamId}.${ext}`;
      const { error: uploadError } = await client.storage.from(BUCKET).upload(path, buffer, {
        contentType: mime,
        upsert: true,
        cacheControl: '3600',
      });
      if (uploadError) throw new Error(uploadError.message);
      finalUrl = `${publicUrlFor(path)}?v=${Date.now()}`;
    } else if (!/^https?:\/\//.test(logoUrl)) {
      // Nem data URL de imagem, nem URL http(s) — rejeitar.
      return NextResponse.json({ error: 'bad_request', message: 'Forneça um ficheiro de imagem ou um URL http(s).' }, { status: 400 });
    }

    // 4. Atualiza a coluna logo_url do clube.
    const { error } = await client.from('ancaf_teams').update({ logo_url: finalUrl }).eq('id', teamId);
    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true, logoUrl: finalUrl });
  } catch (err) {
    console.error('Erro ao guardar logótipo do clube:', err);
    return NextResponse.json(
      { error: 'server_error', message: err instanceof Error ? err.message : 'Erro interno.' },
      { status: 500 },
    );
  }
}
