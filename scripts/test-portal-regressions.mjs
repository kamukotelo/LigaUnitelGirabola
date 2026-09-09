import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const files = {
  calendar: new URL('../src/lib/use-official-calendar.ts', import.meta.url),
  config: new URL('../next.config.ts', import.meta.url),
  favicon: new URL('../src/app/favicon.ico/route.ts', import.meta.url),
  data: new URL('../src/lib/data.ts', import.meta.url),
  publishedCalendar: new URL('../src/lib/published-ancaf-calendar.ts', import.meta.url),
  adminAuth: new URL('../src/lib/admin-auth.ts', import.meta.url),
  adminLogin: new URL('../src/app/api/admin/login/route.ts', import.meta.url),
  loginPage: new URL('../src/app/login/page.tsx', import.meta.url),
  advancedStatistics: new URL('../src/components/competition/AdvancedStatistics.tsx', import.meta.url),
  playerDetail: new URL('../src/components/PlayerDetailClient.tsx', import.meta.url),
  matchDetailClient: new URL('../src/components/MatchDetailClient.tsx', import.meta.url),
};

const [calendar, config, favicon, data, publishedCalendar, adminAuth, adminLogin, loginPage, advancedStatistics, playerDetail, matchDetailClient] = await Promise.all(
  Object.values(files).map((file) => readFile(file, 'utf8')),
);

function occurrences(source, expression) {
  return [...source.matchAll(expression)].length;
}

// Regressão de 09/09/2026: o portal esgotou a quota de egress do Supabase e
// ficou sem base de dados. A causa foi o padrão de leitura — rotas públicas
// `force-dynamic` consumidas com `no-store`, mais canais Realtime permanentes
// no browser (um deles subscrito a 12 tabelas). As asserções que aqui estavam
// protegiam a arquitetura antiga (um único canal por tópico); agora protegem a
// ausência dela. Ver src/lib/portal-cache.ts.
const srcFiles = await readdir(new URL('../src', import.meta.url), { recursive: true, withFileTypes: true });
const sourcePaths = srcFiles
  .filter((entry) => entry.isFile() && /\.tsx?$/.test(entry.name))
  .map((entry) => join(entry.parentPath ?? entry.path, entry.name));
const sources = await Promise.all(
  sourcePaths.map(async (file) => [file, await readFile(file, 'utf8')]),
);

const withRealtime = sources.filter(([, body]) => /\.channel\(|postgres_changes/.test(body));
assert.deepEqual(
  withRealtime.map(([file]) => file),
  [],
  'Nenhum ficheiro do portal pode abrir canais Realtime do Supabase — foi esse padrão que esgotou a quota.',
);

// Casa o `no-store` com a rota no MESMO fetch, para não disparar com
// comentários que mencionem as rotas nem com fetches de outros endpoints.
const NO_STORE_ON_CACHED_ROUTE =
  /fetch\(\s*['"`]\/api\/(?:portal-data|brand-logos|ancaf|admin\/overrides)[^)]*no-store/;
// A consola de administração é a exceção deliberada: está a editar, e tem de
// ler sempre o estado corrente para não gravar por cima de dados obsoletos.
// O custo é irrelevante — são meia dúzia de sessões, não o público do portal.
const isAdminConsole = (file) => /AdminClient|[/\\]admin[/\\]/.test(file);
const withNoStore = sources.filter(
  ([file, body]) => !isAdminConsole(file) && NO_STORE_ON_CACHED_ROUTE.test(body),
);
assert.deepEqual(
  withNoStore.map(([file]) => file),
  [],
  'As rotas públicas do portal vivem em cache; não voltar a consumi-las com no-store.',
);

for (const route of ['portal-data', 'brand-logos']) {
  const body = await readFile(new URL(`../src/app/api/${route}/route.ts`, import.meta.url), 'utf8');
  assert.match(body, /unstable_cache/, `A rota ${route} tem de servir de cache.`);
  assert.match(body, /PORTAL_DATA_TAG/, `A rota ${route} tem de usar a etiqueta partilhada de invalidação.`);
  // Só o export conta — os comentários explicam justamente porque foi removido.
  assert.doesNotMatch(
    body,
    /export\s+const\s+dynamic\s*=\s*['"`]force-dynamic/,
    `A rota ${route} não pode voltar a ser force-dynamic.`,
  );
}

assert.match(
  await readFile(new URL('../src/lib/portal-cache.ts', import.meta.url), 'utf8'),
  /revalidateTag\(PORTAL_DATA_TAG,\s*\{\s*expire:\s*0\s*\}\)/,
  'A invalidação tem de ser imediata (expire: 0), para o admin ver já o que publicou.',
);

// A CSP deve autorizar apenas workers do próprio portal e URLs blob.
assert.match(
  config,
  /worker-src 'self' blob:/,
  'A CSP deve manter worker-src para os workers legítimos do portal.',
);

// Navegadores antigos e extensões continuam a pedir esta rota diretamente.
assert.match(favicon, /export function GET/);
assert.match(favicon, /logo-girabola\.png/);

// A agenda aplicada pela plataforma e o calendário servido pela API devem
// manter a mesma hora confirmada para o jogo de 31/08/2026.
const huilaWilieteDate = '2026-08-31T15:30:00+01:00';
assert.match(data, new RegExp(huilaWilieteDate.replace(/[+]/g, '\\+')));
assert.match(publishedCalendar, new RegExp(huilaWilieteDate.replace(/[+]/g, '\\+')));
assert.match(data, /PLATFORM_MATCH_UPDATED_AT = '2026-09-06T17:50:00\+01:00'/);

// Alterações oficiais da 2.ª jornada devem permanecer iguais no calendário
// base e na agenda que alimenta competição, calendário e página inicial.
for (const confirmedDate of [
  '2026-08-28T15:30:00+01:00',
  '2026-08-29T15:30:00+01:00',
]) {
  const datePattern = new RegExp(confirmedDate.replace(/[+]/g, '\\+'));
  assert.match(data, datePattern);
  assert.match(publishedCalendar, datePattern);
}
assert.match(publishedCalendar, /"homeTeamId": "interclube"[\s\S]*?"date": "2026-08-28T15:30:00\+01:00"/);
assert.match(publishedCalendar, /"homeTeamId": "kabuscorp"[\s\S]*?"date": "2026-08-29T15:30:00\+01:00"/);
assert.match(publishedCalendar, /"id": "m27-4-5"[\s\S]*?"date": "2026-09-09T15:00:00\+01:00"/);
assert.match(publishedCalendar, /"id": "m27-5-1"[\s\S]*?"date": "2026-09-20T15:00:00\+01:00"/);
assert.match(publishedCalendar, /"id": "m27-5-7"[\s\S]*?"date": "2026-09-19T15:30:00\+01:00"[\s\S]*?"stadium": "Estádio França N’dalu"/);
assert.match(publishedCalendar, /"id": "m27-2-1"[\s\S]*?"homeScore": 1[\s\S]*?"awayScore": 2[\s\S]*?"date": "2026-08-27T16:00:00\+01:00"[\s\S]*?"status": "finished"/);
assert.match(publishedCalendar, /"id": "m27-2-7"[\s\S]*?"homeScore": 1[\s\S]*?"awayScore": 2[\s\S]*?"status": "finished"/);
assert.match(publishedCalendar, /"id": "m27-2-5"[\s\S]*?"homeScore": 2[\s\S]*?"awayScore": 1[\s\S]*?"date": "2026-08-28T15:30:00\+01:00"[\s\S]*?"status": "finished"[\s\S]*?"halfTimeScore": "0-0"/);
assert.match(data, /'m27-2-5'[\s\S]*?score: '2-1'[\s\S]*?halfTimeScore: '0-0'[\s\S]*?status: 'finished'/);
for (const scorer of ['Silvano da Cruz', 'Alberto Alves', 'Ricardo Batista']) {
  assert.match(data, new RegExp(scorer));
}

// Resultados publicados em 05/09/2026: placares, intervalos e marcadores
// devem permanecer ligados às fichas reais recebidas.
for (const resultPattern of [
  /'m27-3-1'[\s\S]*?score: '1-2'[\s\S]*?halfTimeScore: '1-0'[\s\S]*?status: 'finished'/,
  /'m27-3-4'[\s\S]*?score: '2-1'[\s\S]*?halfTimeScore: '1-1'[\s\S]*?status: 'finished'/,
  /'m27-3-8'[\s\S]*?score: '0-2'[\s\S]*?halfTimeScore: '0-1'[\s\S]*?status: 'finished'/,
  /'m27-3-5'[\s\S]*?score: '0-1'[\s\S]*?halfTimeScore: '0-1'[\s\S]*?status: 'finished'/,
]) {
  assert.match(data, resultPattern);
}
for (const scorer of ['Mariano da Costa Vidal', 'Benvindo Miguel André Afonso', 'Tiago Jamba Adelino', 'Jaime Caetano', 'Ariclenis Afonso Araújo Lede', 'Moisés', 'Kessie Messi', 'Beni Papel']) {
  assert.match(data, new RegExp(scorer));
}
assert.match(data, /'m27-3-8': \{ home: \{ corners: 1, yellowCards: 6 \}, away: \{ corners: 0, yellowCards: 3 \}/);

// A ficha FC Luanda–FC Cabinda deve manter as convocatórias e a arbitragem
// oficiais recebidas para a 3.ª jornada.
assert.match(data, /getPublishedLuandaCabindaLineups/);
for (const officialEntry of [
  'Ludiakueno Afonso',
  'Filipe Malanda',
  'João Eduardo',
  'Rodrigo dos Santos Ngimbi',
  'Evanildo Gaspar dos Santos Martins',
  'Nelson Agostinho da Silva',
]) {
  assert.match(data, new RegExp(officialEntry));
}

// Arbitragem e comissário da 3.ª jornada devem ficar registados em código.
for (const official of [
  'Aldair Quissanga Rodrigues Carmelino', 'João Amado Muanda Goma',
  'Sabino Garcez de Sousa de Carvalho', 'Rodrigues Aleixo César',
  'Edson António Esoko', 'Manuel Pires Nunda',
  'José Mateus de Carvalho Félix',
]) {
  assert.match(data, new RegExp(official));
}
assert.match(data, /commissioner\?: string/);
// Nas fichas públicas o cargo é sempre "Delegado", nunca "Comissário".
assert.match(matchDetailClient, /Delegado: \{officials\.commissioner\}/);
assert.doesNotMatch(matchDetailClient, /Comiss[aá]rio/i);

// A classificação pública só pode usar resultados finais, e estatísticas
// individuais não podem recorrer a eventos gerados ou valores estimados.
assert.match(data, /\.filter\(m => m\.status === 'finished'\)/);
assert.doesNotMatch(data, /status === 'finished' \|\| m\.status === 'live'/);
assert.match(data, /export function getCurrentSeasonAssists/);
assert.match(data, /export function getCurrentSeasonGoalHauls/);
assert.match(data, /matchTotal\.goals === 4[\s\S]*?row\.pokers \+= 1/);
assert.match(data, /matchTotal\.goals === 5[\s\S]*?row\.manitas \+= 1/);
assert.match(data, /else row\.overFive \+= 1/);
assert.match(data, /hasOfficialEvents/);
assert.match(data, /export const MATCHES: Match\[\] = \[\]/);
assert.doesNotMatch(data, /export const MATCHES: Match\[\] = generateAllMatches\(\)/);
assert.match(data, /publishedLineups\?\.home \?\? \[\]/);
assert.match(data, /publishedLineups\?\.away \?\? \[\]/);
assert.match(data, /goals: CURRENT_SEASON_PLAYER_TOTALS\.get\(player\.id\)\?\.goals \?\? 0/);
assert.match(data, /hasOfficialPlayerMinuteTotals = false/);
assert.doesNotMatch(data, /publishedLineups\?\.home \?\? buildLineup/);
assert.doesNotMatch(data, /homeScorers = pickScorers/);
assert.match(advancedStatistics, /referee === 'A definir'/);
assert.match(playerDetail, /hasOfficialAdvancedPlayerMetrics = false/);

// O login administrativo deve identificar cada pessoa, validar o perfil no
// servidor e emitir uma sessão assinada e limitada no tempo.
assert.match(adminAuth, /signInWithPassword/);
assert.match(adminAuth, /profile\?\.role !== 'admin'/);
assert.match(adminAuth, /expiresAt/);
assert.match(adminAuth, /faf-session-v3/);
assert.match(adminLogin, /authenticateAdminUser\(body\.email, body\.password\)/);
assert.match(loginPage, /JSON\.stringify\(\{ email, password \}\)/);
assert.match(loginPage, /type="email"[\s\S]*?required/);

console.log('✓ Proteções contra regressões do portal confirmadas.');
