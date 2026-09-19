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
  estatisticasTab: new URL('../src/components/competition/EstatisticasTab.tsx', import.meta.url),
  classificacaoTab: new URL('../src/components/competition/ClassificacaoTab.tsx', import.meta.url),
  seasonComparisonMatrix: new URL('../src/components/competition/SeasonComparisonMatrix.tsx', import.meta.url),
};

const [calendar, config, favicon, data, publishedCalendar, adminAuth, adminLogin, loginPage, advancedStatistics, playerDetail, matchDetailClient, estatisticasTab, classificacaoTab, seasonComparisonMatrix] = await Promise.all(
  Object.values(files).map((file) => readFile(file, 'utf8')),
);

// Dados de jogos: um registo por jogo em src/data/jogos/2026-27 e os totais
// gerados a partir deles (ver src/data/jogos/LEIA-ME.md).
const recordsDir = new URL('../src/data/jogos/2026-27/', import.meta.url);
const recordById = Object.fromEntries(await Promise.all(
  (await readdir(recordsDir))
    .filter((file) => /^m27-\d+-\d+\.ts$/.test(file))
    .map(async (file) => [file.slice(0, -3), await readFile(new URL(file, recordsDir), 'utf8')]),
));
const records = Object.values(recordById).join('\n');
const derived = await readFile(new URL('derivados.ts', recordsDir), 'utf8');
const record = (id) => recordById[id] ?? assert.fail(`Falta o registo de jogo ${id}.`);
// Nomes de atletas podem estar no plantel (alcunha), na ficha ou nos totais.
const matchData = [data, records, derived].join('\n');

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
assert.match(records, new RegExp(huilaWilieteDate.replace(/[+]/g, '\\+')));
assert.match(publishedCalendar, new RegExp(huilaWilieteDate.replace(/[+]/g, '\\+')));
assert.match(data, /PLATFORM_MATCH_UPDATED_AT = '2026-09-06T17:50:00\+01:00'/);

// Alterações oficiais da 2.ª jornada devem permanecer iguais no calendário
// base e na agenda que alimenta competição, calendário e página inicial.
for (const confirmedDate of [
  '2026-08-28T15:30:00+01:00',
  '2026-08-29T15:30:00+01:00',
]) {
  const datePattern = new RegExp(confirmedDate.replace(/[+]/g, '\\+'));
  assert.match(records, datePattern);
  assert.match(publishedCalendar, datePattern);
}
assert.match(publishedCalendar, /"homeTeamId": "interclube"[\s\S]*?"date": "2026-08-28T15:30:00\+01:00"/);
assert.match(publishedCalendar, /"homeTeamId": "kabuscorp"[\s\S]*?"date": "2026-08-29T15:30:00\+01:00"/);
assert.match(publishedCalendar, /"id": "m27-4-5"[\s\S]*?"date": "2026-09-09T15:00:00\+01:00"/);
assert.match(publishedCalendar, /"id": "m27-5-1"[\s\S]*?"date": "2026-09-20T15:00:00\+01:00"/);
assert.match(publishedCalendar, /"id": "m27-5-7"[\s\S]*?"date": "2026-09-20T15:00:00\+01:00"[\s\S]*?"stadium": "Estádio França Ndalu"/);
// 5.ª jornada · alterações de 14/09/2026: Wiliete–Libolo passa para as 17h15 com ZSports,
// 1.º de Agosto–FC Luanda passa a ZSports e Sagrada–Petro passa a Rádio 5. A Rádio 5 é a
// transmissão por omissão e não pode ter broadcaster, senão o cartão mostra "Em direto · Rádio 5".
assert.match(record('m27-5-2'), /date: '2026-09-19T15:30:00\+01:00'[^\n]*broadcaster: 'Zsports'/);
// Comunicado 010-DCE/ANCAF/2026: Sagrada–Petro remarcado para 4 de novembro.
assert.match(record('m27-5-3'), /date: '2026-11-04T15:30:00\+01:00'/);
assert.doesNotMatch(record('m27-5-3'), /broadcaster/);
assert.match(record('m27-5-6'), /date: '2026-09-20T17:15:00\+01:00'[^\n]*broadcaster: 'Zsports'/);
assert.match(publishedCalendar, /"id": "m27-2-1"[\s\S]*?"homeScore": 1[\s\S]*?"awayScore": 2[\s\S]*?"date": "2026-08-27T16:00:00\+01:00"[\s\S]*?"status": "finished"/);
assert.match(publishedCalendar, /"id": "m27-2-7"[\s\S]*?"homeScore": 1[\s\S]*?"awayScore": 2[\s\S]*?"status": "finished"/);
assert.match(publishedCalendar, /"id": "m27-2-5"[\s\S]*?"homeScore": 2[\s\S]*?"awayScore": 1[\s\S]*?"date": "2026-08-28T15:30:00\+01:00"[\s\S]*?"status": "finished"[\s\S]*?"halfTimeScore": "0-0"/);
assert.match(record('m27-2-5'), /result: \{ status: 'finished', homeScore: 2, awayScore: 1, halfTimeScore: '0-0'/);
for (const scorer of ['Silvano da Cruz', 'Alberto Alves', 'Ricardo Batista']) {
  assert.match(matchData, new RegExp(scorer));
}

// Resultados publicados em 05/09/2026 e 13/09/2026: placares, intervalos e marcadores
// devem permanecer ligados às fichas reais recebidas.
for (const [id, home, away, halfTime] of [
  ['m27-3-1', 1, 2, '1-0'],
  ['m27-3-4', 2, 1, '1-1'],
  ['m27-3-8', 0, 2, '0-1'],
  ['m27-3-5', 0, 1, '0-1'],
  ['m27-4-1', 1, 2, '1-0'],
  ['m27-4-3', 2, 0, '2-0'],
]) {
  assert.match(record(id), new RegExp(`result: \\{ status: 'finished', homeScore: ${home}, awayScore: ${away}, halfTimeScore: '${halfTime}'`));
}
for (const scorer of ['Mariano da Costa Vidal', 'Benvindo Miguel André Afonso', 'Tiago Jamba Adelino', 'Jaime Caetano', 'Ariclenis Afonso Araújo Lede', 'Moisés', 'Kessie Messi', 'Beni Papel', 'António Pena', 'Ado Pena', 'Mabululu']) {
  assert.match(matchData, new RegExp(scorer));
}
assert.match(publishedCalendar, /"id": "m27-4-1"[\s\S]*?"homeScore": 1[\s\S]*?"awayScore": 2[\s\S]*?"halfTimeScore": "1-0"[\s\S]*?"status": "finished"/);

// 4.ª jornada · CR Caála 1-2 Desportivo da Huíla — Relatório do Árbitro FCMS n.º 29.
// O golo dos 12' é de Benvindo (#4); Cuxixima não marcou (atribuição errada corrigida a 14/09).
assert.match(record('m27-4-1'), /stadium: 'Estádio Daniel Lutucuta'[\s\S]*?attendance: 1200/);
assert.match(
  record('m27-4-1'),
  /events: \[[\s\S]*?minute: 12, type: 'goal'[^\n]*playerId: 'fifa-1jz4pi8'[\s\S]*?minute: 52, type: 'goal'[^\n]*playerId: 'milagre-simba-huila'[\s\S]*?minute: 94, type: 'goal'[^\n]*playerId: 'ado-pena-huila'/,
  'Os golos do m27-4-1 têm de seguir o Relatório 29.',
);
assert.doesNotMatch(derived, /id: 'cuxixima-caala'/, 'Cuxixima não marcou no Relatório 29.');
assert.match(derived, /id: 'fifa-1jz4pi8'[^\n]*goals: 2,/);
assert.match(record('m27-4-1'), /officials: \{ referee: 'Paulo Sérgio Moreira'[^\n]*commissioner: 'Manuel André António'/);
assert.match(publishedCalendar, /"id": "m27-4-3"[\s\S]*?"homeScore": 2[\s\S]*?"awayScore": 0[\s\S]*?"halfTimeScore": "2-0"[\s\S]*?"status": "finished"/);
assert.match(record('m27-3-8'), /home: \{ corners: 1, yellowCards: 6 \},\s*away: \{ corners: 0, yellowCards: 3 \}/);

// 4.ª jornada · FC Cabinda 1-1 CD 1.º de Agosto (09/09/2026, Estádio França Ndalu).
assert.match(record('m27-4-5'), /result: \{ status: 'finished', homeScore: 1, awayScore: 1, halfTimeScore: '1-0'/);
assert.match(record('m27-4-5'), /events: \[[\s\S]*?playerId: 'luyeye-cabinda'[\s\S]*?playerId: 'axel-dago'/);
assert.match(derived, /id: 'luyeye-cabinda'[^\n]*goals: 2,/);
assert.match(derived, /id: 'axel-dago'[^\n]*goals: 2,/);

// A ficha FC Luanda–FC Cabinda deve manter as convocatórias e a arbitragem
// oficiais recebidas para a 3.ª jornada.
assert.match(record('m27-3-4'), /lineups: \{/);
for (const officialEntry of [
  'Ludiakueno Afonso',
  'Filipe Malanda',
  'João Eduardo',
  'Rodrigo dos Santos Ngimbi',
  'Evanildo Gaspar dos Santos Martins',
  'Nelson Agostinho da Silva',
]) {
  assert.match(records, new RegExp(officialEntry));
}

// Arbitragem e comissário da 3.ª jornada devem ficar registados em código.
for (const official of [
  'Aldair Quissanga Rodrigues Carmelino', 'João Amado Muanda Goma',
  'Sabino Garcez de Sousa de Carvalho', 'Rodrigues Aleixo César',
  'Edson António Esoko', 'Manuel Pires Nunda',
  'José Mateus de Carvalho Félix',
]) {
  assert.match(records, new RegExp(official));
}
// O commissioner existe nos ficheiros internos de jogo (fonte FCMS) — isso é correcto.
// Mas a interface pública MatchOfficials nunca deve expor o campo.
assert.doesNotMatch(data, /export interface MatchOfficials[\s\S]{0,300}commissioner\?: string/, 'MatchOfficials não deve expor commissioner publicamente.');
// Nas páginas públicas o Delegado/Comissário nunca pode aparecer.
assert.doesNotMatch(matchDetailClient, /Delegado:.*commissioner/, 'Delegado não deve ser renderizado no MatchDetailClient.');

// Segurança do novo Arquivo de Jogo: nunca inventar dados desportivos quando
// um PDF não é reconhecido, e a ação de pré-visualização não pode publicar.
const matchFileParser = await readFile(new URL('../src/lib/match-file-parser.ts', import.meta.url), 'utf8');
const matchFileLoader = await readFile(new URL('../src/components/admin/MatchFileLoaderSection.tsx', import.meta.url), 'utf8');
const matchFileRoute = await readFile(new URL('../src/app/api/admin/match-file/load/route.ts', import.meta.url), 'utf8');
assert.doesNotMatch(matchFileParser, /numeroPartida:\s*numeroPartida\s*\|\|\s*32/);
assert.doesNotMatch(matchFileParser, /eventos\.length\s*>\s*0\s*\?\s*eventos\s*:\s*\[/);
assert.match(matchFileLoader, /match-file\/load\?preview=1/);
// A publicação atómica corre na função SQL, via Neon (SQL direto) ou Supabase (rpc).
assert.match(matchFileRoute, /ancaf_publish_match_file\(|rpc\('ancaf_publish_match_file'/);
assert.match(matchFileRoute, /fixture_mismatch/);
assert.match(matchFileRoute, /MAX_FILE_BYTES\s*=\s*10\s*\*\s*1024\s*\*\s*1024/);
assert.doesNotMatch(adminAuth, /jabulani2026/);
assert.doesNotMatch(matchDetailClient, /Comiss[aá]rio/i, 'Comissário não deve aparecer no MatchDetailClient.');

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
// Os minutos em campo são derivados das escalações e substituições oficiais,
// nunca estimados a partir do número de jogos (ex.: `appearances * 90`).
assert.match(data, /export function getCurrentSeasonMinutesPlayed/);
assert.match(data, /export function getPlayerSeasonMinutes/);
assert.match(data, /starters\.length < 11/);
assert.match(data, /if \(!leaving\) \{ timelineIsConsistent = false; break; \}/);
assert.match(data, /if \(timelineIsConsistent\) eligible\.push\(/);
assert.match(data, /if \(match\.status !== 'finished' \|\| !hasPublishedMatchEvents\(match\)\) continue;/);
// A conciliação de nomes tem de cobrir também o atleta substituído, senão as
// substituições publicadas com o nome civil deixam 12 jogadores em campo.
assert.match(data, /function buildLineupNameIndex/);
// Golos, assistências e minutos do rácio por 90' saem dos mesmos jogos: um
// avançado com golos em jornadas sem ficha não pode dividi-los pelos minutos
// de um único jogo com escalação publicada.
assert.match(data, /export function getCurrentSeasonPer90/);
// Uma ficha com escalação mas sem substituições não permite reconstruir quem
// saiu de campo: dar 90 minutos aos onze titulares seria inventar a cronologia.
assert.match(data, /if \(teamSubs\.length === 0\) continue;/);
// As etiquetas de "atualizado em" seguem o jogo confirmado mais recente, para
// não voltarem a ficar presas a uma data escrita à mão.
assert.match(data, /export function getSeasonResultsUpdatedAt/);
assert.match(estatisticasTab, /getSeasonResultsUpdatedAt\(seasonId\)/);
assert.match(classificacaoTab, /getSeasonResultsUpdatedAt\(seasonId\)/);
assert.match(data, /function collectEligibleMatchSides/);
assert.match(advancedStatistics, /playerRates = isCurrent[\s\S]{0,160}getCurrentSeasonPer90\(\)/);
// O rácio por 90' exige um mínimo de minutos: sem ele, um suplente com um golo
// em 45 minutos liderava a tabela à frente de quem marca todas as jornadas.
assert.match(advancedStatistics, /const PER90_MIN_MINUTES = \d+;/);
assert.match(advancedStatistics, /minutesPlayed >= PER90_MIN_MINUTES/);
// As fichas publicam o mesmo árbitro abreviado ou com outra grafia; a tabela de
// arbitragem tem de o juntar numa linha só.
assert.match(advancedStatistics, /buildOfficialNameCanonicalizer/);
assert.match(data, /export function buildOfficialNameCanonicalizer/);
// O filtro de clube escolhido no topo governa também a análise avançada e o
// comparador entre temporadas — não apenas os rankings individuais.
assert.match(advancedStatistics, /teamId\?: string/);
assert.match(estatisticasTab, /<AdvancedStatistics seasonId=\{seasonId\} teamId=/);
assert.match(estatisticasTab, /<SeasonComparisonMatrix clubFilter=\{activeTeam\} \/>/);
assert.match(seasonComparisonMatrix, /clubFilter = 'all' \}: \{ clubFilter\?: string \}/);
assert.doesNotMatch(seasonComparisonMatrix, /setClubFilter/);
// O seletor de clubes lista apenas quem disputa a época escolhida: getAllTeams()
// devolve também promovidos e emblemas históricos de outras edições.
assert.match(data, /export function getSeasonTeams/);
assert.match(estatisticasTab, /getSeasonTeams\(seasonId\)/);
assert.doesNotMatch(estatisticasTab, /getAllTeams\(\)\./);
// Liderança é sempre medida contra a prova inteira: com um clube filtrado, o
// melhor do plantel é "Melhor do clube", nunca "Líder" com um golo.
assert.match(estatisticasTab, /leagueRankById/);
assert.match(estatisticasTab, /Melhor do clube/);
// Um guarda-redes sem qualquer baliza a zero não pertence ao ranking de balizas
// limpas — aparecia com "0" só por ter fichas publicadas.
assert.match(estatisticasTab, /filter\(\(gk\) => gk\.cleanSheets > 0\)/);
// Listas de disciplina de 2025/2026 numa fonte única: as cópias duplicadas
// incluíam o FC de Cabinda, que não disputou essa época.
assert.match(estatisticasTab, /HISTORICAL_DISCIPLINE_2025_26/);
assert.match(seasonComparisonMatrix, /HISTORICAL_DISCIPLINE_2025_26/);
assert.doesNotMatch(advancedStatistics, /getCurrentSeasonMinutesPlayed/);
assert.match(data, /const leaving = event\.playerOut \? lookupLineupName\(index, event\.playerOut\) : undefined;/);
assert.doesNotMatch(data, /publishedLineups\?\.home \?\? buildLineup/);
assert.doesNotMatch(data, /homeScorers = pickScorers/);
assert.match(advancedStatistics, /referee === 'A definir'/);
assert.match(playerDetail, /hasOfficialAdvancedPlayerMetrics = false/);

// O login administrativo deve identificar cada pessoa, validar o perfil no
// servidor e emitir uma sessão assinada e limitada no tempo.
assert.match(adminAuth, /password_hash = crypt\(\$2, password_hash\)/);
assert.match(adminAuth, /profile\.role !== 'admin'/);
assert.match(adminAuth, /expiresAt/);
assert.match(adminAuth, /faf-session-v3/);
assert.match(adminLogin, /authenticateAdminUser\(body\.email, body\.password\)/);
assert.match(loginPage, /JSON\.stringify\(\{ email, password \}\)/);
assert.match(loginPage, /type="email"[\s\S]*?required/);

console.log('✓ Proteções contra regressões do portal confirmadas.');
