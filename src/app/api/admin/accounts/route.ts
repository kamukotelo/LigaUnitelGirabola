import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getAdminSession, listAdminAccountsStatus } from '@/lib/admin-auth';

// GET /api/admin/accounts — devolve a lista e estado das contas oficiais de administração
export const dynamic = 'force-dynamic';

export async function GET() {
  const store = await cookies();
  const session = getAdminSession(store.get(ADMIN_COOKIE)?.value);

  if (!session || session.profile !== 'admin') {
    return NextResponse.json(
      { error: 'unauthorized', message: 'Acesso reservado aos administradores.' },
      { status: 401 },
    );
  }

  const accounts = await listAdminAccountsStatus();
  return NextResponse.json({ ok: true, accounts });
}
