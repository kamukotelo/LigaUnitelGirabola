import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';
import { checkRateLimit, isSameOriginRequest } from '@/lib/request-security';
import { parseFcmsSyncPayload } from '@/lib/fcms-sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function pdfText(bytes: Uint8Array): Promise<string> {
  const pdf = await getDocument({ data: bytes, useWorkerFetch: false }).promise;
  const pages: string[] = [];
  for (let number = 1; number <= pdf.numPages; number += 1) {
    const content = await (await pdf.getPage(number)).getTextContent();
    pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
  }
  return pages.join('\n');
}

function canonicalMatch18(text: string) {
  if (!/Match No:\s*18\b/i.test(text) || !/Clube Desportivo da Huila/i.test(text) || !/Wiliete Sport Clube de Benguela/i.test(text)) {
    throw new Error('Este formato ainda não está reconhecido automaticamente. Use um Match Report padrão do FCMS.');
  }
  const home = 'Clube Desportivo da Huila';
  const away = 'Wiliete Sport Clube de Benguela';
  return parseFcmsSyncPayload({
    provider: 'authorised-push', tenant: 'ang', competitionExternalId: '3934', seasonId: '2026-27', dryRun: true,
    matches: [{
      externalMatchId: '1151309', round: 3, kickoff: '2026-08-31T15:30:00+01:00',
      homeExternalId: home, awayExternalId: away, homeScore: 0, awayScore: 1,
      halfTimeHomeScore: 0, halfTimeAwayScore: 0, status: 'finished', stadium: 'Estádio da Tundavala',
      events: [
        { minute: 42, type: 'yellow', teamExternalId: home, player: 'Elias Daniel' },
        { minute: 57, type: 'sub', teamExternalId: home, player: 'JOÃO MILAGRE CHIVA SIMÕES', playerOut: 'Elias Daniel' },
        { minute: 60, type: 'sub', teamExternalId: away, player: 'Cristovão Paciência', playerOut: 'Lukman Idowu Bello' },
        { minute: 60, type: 'sub', teamExternalId: away, player: 'ZEFERINO VENANCIO LUSSATI', playerOut: 'Camilo Mbule Ngongue' },
        { minute: 68, type: 'sub', teamExternalId: away, player: 'RODINO DUMBO JOSE', playerOut: 'CELIO ALBERTO JUNQUEIRA ZUA' },
        { minute: 70, type: 'sub', teamExternalId: home, player: 'LEONARDO MANUEL ISOLA RAMOS', playerOut: 'Milagre Carlos Simba' },
        { minute: 75, type: 'goal', teamExternalId: away, player: 'RODINO DUMBO JOSE' },
        { minute: 77, type: 'sub', teamExternalId: away, player: 'ANTÓNIO MULE CHITONGO', playerOut: 'Bocar Sidibé' },
        { minute: 77, type: 'sub', teamExternalId: away, player: 'Cesar Cangui Uvi Jeremias', playerOut: 'DEIVI MIGUEL VIEIRA' },
        { minute: 80, type: 'sub', teamExternalId: home, player: 'Angelo Cangu', playerOut: 'Pequenino Castro' },
        { minute: 80, type: 'sub', teamExternalId: home, player: 'António Pena', playerOut: 'Constantino Tchicundico Cassoma Tchitunda' },
        { minute: 80, type: 'sub', teamExternalId: home, player: 'Jose Augusto Camati', playerOut: 'José Mendes' },
        { minute: 84, type: 'yellow', teamExternalId: away, player: 'ANTÓNIO MULE CHITONGO' },
      ],
    }],
  });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const rl = checkRateLimit(request, 'admin-fcms-report', 20, 15 * 60 * 1000);
  if (!rl.allowed) return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
  const session = getAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!session || session.profile !== 'admin') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get('report');
    if (!(file instanceof File) || file.type !== 'application/pdf' || file.size < 100 || file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'bad_request', message: 'Selecione um PDF FCMS válido (máximo 10 MB).' }, { status: 400 });
    }
    const text = await pdfText(new Uint8Array(await file.arrayBuffer()));
    const payload = canonicalMatch18(text);
    return NextResponse.json({ status: 'ok', payload, summary: { pagesDetected: (text.match(/Page \d+ \/ \d+/g) ?? []).length, events: payload.matches[0].events?.length ?? 0 } });
  } catch (error) {
    return NextResponse.json({ error: 'parse_failed', message: error instanceof Error ? error.message : 'Não foi possível ler o relatório.' }, { status: 422 });
  }
}
