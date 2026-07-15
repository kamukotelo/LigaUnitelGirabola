import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { ADMIN_COOKIE, isValidSession } from '@/lib/admin-auth';

// ── Overrides de conteúdo publicados pela consola de administração ────────
// Guardados em `ancaf_configs` (chave/valor JSON) sob as chaves `override_*`.
// GET é público (o portal lê os overrides publicados); POST exige sessão de
// administração válida e escreve com o service_role.

export const dynamic = 'force-dynamic';

const SECTIONS = ['news', 'calendar', 'players', 'nominations'] as const;
type Section = (typeof SECTIONS)[number];
const keyFor = (section: Section) => `override_${section}`;

// GET /api/admin/overrides — devolve os overrides publicados (leitura pública).
export async function GET() {
  const overrides: Record<string, unknown> = {};
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from('ancaf_configs')
      .select('key, value')
      .in('key', SECTIONS.map(keyFor));
    for (const row of (data ?? []) as { key: string; value: string }[]) {
      const section = row.key.replace(/^override_/, '');
      try {
        overrides[section] = JSON.parse(row.value);
      } catch {
        // valor corrompido — ignora a secção
      }
    }
  } catch {
    // Supabase não configurado: devolve overrides vazios (o portal usa os dados base).
  }
  return NextResponse.json({ overrides });
}

// POST /api/admin/overrides — publica o bloco de uma secção (exige sessão admin).
export async function POST(request: Request) {
  const sessionCookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!isValidSession(sessionCookie)) {
    return NextResponse.json({ error: 'unauthorized', message: 'Sessão de administração inválida.' }, { status: 401 });
  }

  let body: { section?: unknown; value?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request', message: 'Corpo inválido.' }, { status: 400 });
  }

  const { section, value } = body;
  if (typeof section !== 'string' || !SECTIONS.includes(section as Section)) {
    return NextResponse.json({ error: 'bad_request', message: 'Secção desconhecida.' }, { status: 400 });
  }

  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: 'server_misconfigured', message: 'Supabase não configurado no servidor.' },
      { status: 503 },
    );
  }

  const { error } = await admin
    .from('ancaf_configs')
    .upsert({ key: keyFor(section as Section), value: JSON.stringify(value ?? {}) }, { onConflict: 'key' });

  if (error) {
    return NextResponse.json({ error: 'write_failed', message: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
