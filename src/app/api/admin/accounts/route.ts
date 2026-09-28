import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, getAdminSession, listAdminAccountsStatus } from '@/lib/admin-auth';
import { isSameOriginRequest } from '@/lib/request-security';

// GET /api/admin/accounts — devolve a lista das contas de administração oficiais
// e o respetivo estado (exige sessão administrativa ativa).
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'forbidden', message: 'Origem do pedido não autorizada.' }, { status: 403 });
  }

  const store = await cookies();
  const session = getAdminSession(store.get(ADMIN_COOKIE)?.value);
  if (!session || session.profile !== 'admin') {
    return NextResponse.json({ error: 'unauthorized', message: 'Sessão administrativa necessária.' }, { status: 401 });
  }

  try {
    const accounts = await listAdminAccountsStatus();
    return NextResponse.json({ ok: true, accounts });
  } catch (error) {
    console.error('[admin/accounts] erro:', error);
    return NextResponse.json({ error: 'server_error', message: 'Não foi possível listar as contas.' }, { status: 500 });
  }
}
