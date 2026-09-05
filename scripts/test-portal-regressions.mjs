import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = {
  calendar: new URL('../src/lib/use-official-calendar.ts', import.meta.url),
  config: new URL('../next.config.ts', import.meta.url),
  favicon: new URL('../src/app/favicon.ico/route.ts', import.meta.url),
  data: new URL('../src/lib/data.ts', import.meta.url),
  publishedCalendar: new URL('../src/lib/published-ancaf-calendar.ts', import.meta.url),
  adminAuth: new URL('../src/lib/admin-auth.ts', import.meta.url),
  adminLogin: new URL('../src/app/api/admin/login/route.ts', import.meta.url),
  loginPage: new URL('../src/app/login/page.tsx', import.meta.url),
};

const [calendar, config, favicon, data, publishedCalendar, adminAuth, adminLogin, loginPage] = await Promise.all(
  Object.values(files).map((file) => readFile(file, 'utf8')),
);

function occurrences(source, expression) {
  return [...source.matchAll(expression)].length;
}

// Regressão de 27/08/2026: vários componentes montados ao mesmo tempo não
// podem chamar supabase.channel() separadamente com o mesmo tópico.
assert.equal(
  occurrences(calendar, /\.channel\(/g),
  1,
  'O calendário deve ter um único ponto de criação do canal Supabase.',
);
assert.match(
  calendar,
  /calendarRefreshListeners\s*=\s*new Set/,
  'Os consumidores do calendário devem partilhar uma lista única de listeners.',
);
assert.match(
  calendar,
  /official-calendar-public-\$\{calendarChannelSequence\}/,
  'Cada nova instância do canal deve usar uma identidade única.',
);
assert.doesNotMatch(
  calendar,
  /\.channel\(['"]official-calendar-public['"]\)/,
  'Não reutilizar o tópico fixo que provocou callbacks adicionados após subscribe().',
);
assert.match(
  calendar,
  /calendarRefreshListeners\.size\s*>\s*0/,
  'O canal só pode ser removido depois do último consumidor.',
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
assert.match(publishedCalendar, /"id": "m27-2-1"[\s\S]*?"homeScore": 1[\s\S]*?"awayScore": 2[\s\S]*?"date": "2026-08-27T16:00:00\+01:00"[\s\S]*?"status": "finished"/);
assert.match(publishedCalendar, /"id": "m27-2-7"[\s\S]*?"homeScore": 1[\s\S]*?"awayScore": 2[\s\S]*?"status": "finished"/);
assert.match(publishedCalendar, /"id": "m27-2-5"[\s\S]*?"homeScore": 2[\s\S]*?"awayScore": 1[\s\S]*?"date": "2026-08-28T15:30:00\+01:00"[\s\S]*?"status": "finished"[\s\S]*?"halfTimeScore": "0-0"/);
assert.match(data, /'m27-2-5'[\s\S]*?score: '2-1'[\s\S]*?halfTimeScore: '0-0'[\s\S]*?status: 'finished'/);
for (const scorer of ['Silvano da Cruz', 'Alberto Alves', 'Ricardo Batista']) {
  assert.match(data, new RegExp(scorer));
}

// A classificação pública só pode usar resultados finais, e estatísticas
// individuais não podem recorrer a eventos gerados ou valores estimados.
assert.match(data, /\.filter\(m => m\.status === 'finished'\)/);
assert.doesNotMatch(data, /status === 'finished' \|\| m\.status === 'live'/);
assert.match(data, /export function getCurrentSeasonAssists/);
assert.match(data, /hasOfficialEvents/);

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
