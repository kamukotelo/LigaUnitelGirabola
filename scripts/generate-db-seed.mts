// ═══════════════════════════════════════════════════════════════════════
// ANCAF · Gerador de seed SQL a partir do conteúdo em código
// Liga Unitel Girabola — plataforma digital
//
// Lê os getters/constantes de src/lib/data.ts e emite ficheiros
// supabase/seed/*.sql com INSERT ... ON CONFLICT DO UPDATE (re-executáveis).
// É a materialização de "criar a query para inserir na BD".
//
//   npx tsx scripts/generate-db-seed.ts
//
// Aplicar por ordem numérica, DEPOIS das migrações
// 20260901002000_portal_data_tables.sql e 20260901003000_extend_core_tables.sql.
// ═══════════════════════════════════════════════════════════════════════

import { mkdir, writeFile } from 'node:fs/promises';
import * as d from '../src/lib/data';

const OUT = new URL('../supabase/seed/', import.meta.url);

// ── helpers SQL ───────────────────────────────────────────────────────
const s = (v: unknown): string => {
  if (v === null || v === undefined || v === '') return 'null';
  return `'${String(v).replace(/'/g, "''")}'`;
};
const n = (v: unknown): string => {
  const num = Number(v);
  return Number.isFinite(num) ? String(num) : 'null';
};
const b = (v: unknown): string => (v ? 'true' : 'false');
const jsonb = (v: unknown): string => `'${JSON.stringify(v ?? null).replace(/'/g, "''")}'::jsonb`;
const textArray = (v: unknown[]): string =>
  v && v.length ? `array[${v.map((x) => s(x)).join(',')}]::text[]` : `'{}'::text[]`;
const isoDate = (v: string): string => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(v ?? '').trim());
  if (m) return `'${m[3]}-${m[2]}-${m[1]}'`;
  return s(v || null);
};

function upsert(table: string, rows: string[][], columns: string[], conflict: string): string {
  if (!rows.length) return `-- (sem linhas para ${table})\n`;
  const updates = columns
    .filter((c) => !conflict.split(',').map((x) => x.trim()).includes(c))
    .map((c) => `${c} = excluded.${c}`)
    .join(', ');
  const values = rows.map((r) => `  (${r.join(', ')})`).join(',\n');
  return (
    `insert into public.${table} (${columns.join(', ')}) values\n${values}\n` +
    `on conflict (${conflict}) do update set ${updates};\n`
  );
}

function header(title: string): string {
  return `-- ${'═'.repeat(69)}\n-- ${title}\n-- Gerado por scripts/generate-db-seed.ts — não editar à mão.\n-- ${'═'.repeat(69)}\n\n`;
}

await mkdir(OUT, { recursive: true });
const files: Array<[string, string]> = [];

// Conjunto de clubes que vão para ancaf_teams — usado para não emitir linhas
// filhas (jogos/jogadores) que violariam a foreign key.
const teamIds = new Set<string>([
  ...(d.getAllTeams() as unknown as Array<{ id: string }>).map((t) => t.id),
  ...(d.HISTORICAL_TEAMS as unknown as Array<{ id: string }>).map((t) => t.id),
]);
let skipped = 0;

// ── 01 · épocas (as do código + as históricas dos resultados) ─────────
{
  const cols = ['id', 'label', 'status'];
  const declared = (d.SEASONS as unknown as Array<{ id: string; label: string; status: string }>).map((x) => ({
    id: x.id, label: x.label,
    status: x.status === 'active' ? 'active' : x.status === 'completed' ? 'completed' : 'upcoming',
  }));
  const historical = [
    { id: '2024-25', label: '2024/2025', status: 'completed' },
    { id: '2023-24', label: '2023/2024', status: 'completed' },
    { id: '2022-23', label: '2022/2023', status: 'completed' },
  ];
  const byId = new Map<string, { id: string; label: string; status: string }>();
  for (const x of [...declared, ...historical]) if (!byId.has(x.id)) byId.set(x.id, x);
  const rows = [...byId.values()].map((x) => [s(x.id), s(x.label), s(x.status)]);
  files.push(['01_seasons.sql', header('ÉPOCAS') + upsert('ancaf_seasons', rows, cols, 'id')]);
}

// ── 02 · clubes ───────────────────────────────────────────────────────
{
  const cols = [
    'id', 'name', 'official_name', 'short_name', 'city', 'stadium', 'stadium_capacity', 'founded',
    'colors', 'coach', 'president', 'nickname', 'website', 'colors_hex', 'kits', 'data_status',
    'data_updated_at', 'is_historical',
  ];
  const mk = (t: Record<string, unknown>, historical: boolean) => [
    s(t.id), s(t.name), s(t.officialName ?? t.name), s(t.shortName), s(t.city), s(t.stadium),
    n(t.stadiumCapacity ?? 0), n(t.founded), s(t.colors), s(t.coach), s(t.president), s(t.nickname),
    s(t.website), textArray((t.colorsHex as unknown[]) ?? []), jsonb(t.kits ?? []), s(t.dataStatus),
    t.dataUpdatedAt ? s(t.dataUpdatedAt) : 'null', b(historical),
  ];
  const rows = [
    ...(d.getAllTeams() as unknown as Array<Record<string, unknown>>).map((t) => mk(t, false)),
    ...(d.HISTORICAL_TEAMS as unknown as Array<Record<string, unknown>>).map((t) => mk(t, true)),
  ];
  // dedupe por id (getAllTeams já pode incluir históricos)
  const seen = new Set<string>();
  const unique = rows.filter((r) => {
    const id = r[0];
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  files.push(['02_teams.sql', header('CLUBES') + upsert('ancaf_teams', unique, cols, 'id')]);
}

// ── 03 · perfis institucionais ────────────────────────────────────────
{
  const cols = ['team_id', 'official_name', 'president', 'website', 'socials', 'palmares', 'kits', 'board'];
  const rows = (d.getAllTeams() as unknown as Array<{ id: string }>).map((t) => {
    const p = d.getTeamProfile(t.id) as unknown as Record<string, unknown>;
    return [
      s(t.id), s(p.officialName), s(p.president), s(p.website),
      jsonb(p.socials ?? {}), jsonb(p.palmares ?? []), jsonb(p.kits ?? []), jsonb(p.board ?? []),
    ];
  });
  files.push(['03_team_profiles.sql', header('PERFIS INSTITUCIONAIS DOS CLUBES') + upsert('ancaf_team_profiles', rows, cols, 'team_id')]);
}

// ── 04 · equipa técnica ───────────────────────────────────────────────
{
  const cols = ['team_id', 'name', 'role', 'nationality', 'ma_id', 'fifa_id', 'sort_rank'];
  const staff = d.OFFICIAL_TEAM_STAFF_2026_27 as unknown as Record<string, Array<Record<string, unknown>>>;
  const rows: string[][] = [];
  for (const [teamId, members] of Object.entries(staff)) {
    members.forEach((m, i) => {
      rows.push([s(teamId), s(m.name), s(m.role), s(m.nationality), s(m.maId), s(m.fifaId), n(i)]);
    });
  }
  // team_id+name+role não é único garantido; usa uma chave sintética via delete+insert
  const sql =
    header('EQUIPA TÉCNICA DOS CLUBES') +
    `delete from public.ancaf_team_staff where team_id in (${Object.keys(staff).map(s).join(', ')});\n` +
    `insert into public.ancaf_team_staff (${cols.join(', ')}) values\n` +
    rows.map((r) => `  (${r.join(', ')})`).join(',\n') + ';\n';
  files.push(['04_team_staff.sql', sql]);
}

// ── 05 · jogadores ────────────────────────────────────────────────────
{
  const cols = [
    'id', 'team_id', 'club', 'name', 'full_name', 'position', 'jersey_number', 'age', 'birth_date',
    'nationality', 'height', 'goals', 'assists', 'appearances', 'ma_id', 'gender', 'fifa_connect_id',
    'fifa_connect_status', 'registered_squad', 'attributes', 'career_history', 'bio',
  ];
  const rows = (d.getPlayers() as unknown as Array<Record<string, unknown>>)
    .filter((p) => {
      if (p.teamId && teamIds.has(p.teamId as string)) return true;
      skipped += 1;
      return false;
    })
    .map((p) => [
    s(p.id), s(p.teamId), s(p.club), s(p.name), s(p.fullName ?? p.name), s(p.position),
    n(p.jerseyNumber ?? 0), n(p.age ?? 0), isoDate(p.birthDate as string), s(p.nationality), s(p.height),
    n(p.goals ?? 0), n(p.assists ?? 0), n(p.appearances ?? 0), s(p.maId), s(p.gender ?? 'MALE'),
    s(p.fifaConnectId), s(p.fifaConnectStatus ?? 'unregistered'), b(p.registeredSquad !== false),
    jsonb(p.attributes ?? {}), jsonb(p.careerHistory ?? []), s(p.bio),
  ]);
  files.push(['05_players.sql', header(`JOGADORES (${rows.length})`) + upsert('ancaf_players', rows, cols, 'id')]);
}

// ── 06 · jogos (época atual + históricos) ─────────────────────────────
{
  const cols = [
    'id', 'season_id', 'round', 'home_team_id', 'away_team_id', 'home_team', 'away_team',
    'home_score', 'away_score', 'score', 'half_time_score', 'date', 'stadium', 'status',
    'schedule_status', 'referee', 'broadcaster', 'attendance', 'useful_time_minutes',
  ];
  const seasons = ['2026-27', '2025-26', '2024-25', '2023-24', '2022-23'];
  const rows: string[][] = [];
  for (const season of seasons) {
    let matches: Array<Record<string, unknown>> = [];
    try {
      matches = d.getMatchesForSeason(season) as unknown as Array<Record<string, unknown>>;
    } catch {
      matches = [];
    }
    for (const m of matches) {
      if (!teamIds.has(m.homeTeamId as string) || !teamIds.has(m.awayTeamId as string)) {
        skipped += 1;
        continue;
      }
      rows.push([
        s(m.id), s(season), n(m.round), s(m.homeTeamId), s(m.awayTeamId), s(m.homeTeam), s(m.awayTeam),
        n(m.homeScore ?? 0), n(m.awayScore ?? 0), s(m.score), s(m.halfTimeScore),
        `'${new Date(m.date as string).toISOString()}'`, s(m.stadium), s(m.status ?? 'scheduled'),
        s(m.scheduleStatus), s(m.referee), s(m.broadcaster), n(m.attendance), n(m.usefulTimeMinutes),
      ]);
    }
  }
  files.push(['06_matches.sql', header(`JOGOS (${rows.length})`) + upsert('ancaf_matches', rows, cols, 'id')]);
}

// ── 07 · classificações oficiais ─────────────────────────────────────
{
  const cols = [
    'season_id', 'team_id', 'position', 'played', 'won', 'drawn', 'lost', 'goals_for',
    'goals_against', 'points', 'goals_verified', 'form_verified',
  ];
  const rows: string[][] = [];
  for (const season of ['2025-26']) {
    const table = d.getStandingsForSeason(season) as unknown as Array<Record<string, unknown>>;
    table.forEach((row, i) => {
      rows.push([
        s(season), s(row.teamId), n(row.position ?? i + 1), n(row.played), n(row.won), n(row.drawn),
        n(row.lost), n(row.goalsFor), n(row.goalsAgainst), n(row.points),
        b(row.goalsVerified), b(row.formVerified),
      ]);
    });
  }
  files.push(['07_standings.sql', header('CLASSIFICAÇÕES OFICIAIS') + upsert('ancaf_standings', rows, cols, 'season_id,team_id')]);
}

// ── 08 · estatísticas por jogador (época em curso) ───────────────────
{
  const cols = ['season_id', 'player_id', 'goals', 'assists', 'appearances', 'yellow_cards', 'red_cards'];
  const agg = new Map<string, { g: number; a: number; ap: number; y: number; r: number }>();
  const get = (id: string) => {
    if (!agg.has(id)) agg.set(id, { g: 0, a: 0, ap: 0, y: 0, r: 0 });
    return agg.get(id)!;
  };
  for (const p of d.getTopScorers() as unknown as Array<Record<string, unknown>>) {
    const e = get(p.id as string);
    e.g = Math.max(e.g, Number(p.goals) || 0);
    e.a = Math.max(e.a, Number(p.assists) || 0);
    e.ap = Math.max(e.ap, Number(p.appearances) || 0);
  }
  for (const p of d.getCurrentSeasonDiscipline() as unknown as Array<Record<string, unknown>>) {
    const e = get(p.id as string);
    e.y = Math.max(e.y, Number(p.yellowCards) || 0);
    e.r = Math.max(e.r, Number(p.redCards) || 0);
    e.ap = Math.max(e.ap, Number(p.appearances) || 0);
  }
  const rows = [...agg.entries()].map(([id, e]) => [
    s('2026-27'), s(id), n(e.g), n(e.a), n(e.ap), n(e.y), n(e.r),
  ]);
  files.push(['08_player_season_stats.sql', header('ESTATÍSTICAS POR JOGADOR (2026/27)') + upsert('ancaf_player_season_stats', rows, cols, 'season_id,player_id')]);
}

// ── 09 · notícias ────────────────────────────────────────────────────
{
  const cols = [
    'id', 'title', 'category', 'date', 'iso_date', 'summary', 'content', 'status', 'author',
    'source_name', 'source_url', 'published_at', 'document_images', 'document_url', 'ai_assisted',
  ];
  const rows = (d.newsMock as unknown as Array<Record<string, unknown>>).map((a) => [
    s(a.id), s(a.title), s(a.category ?? 'Geral'),
    a.isoDate ? `'${new Date(a.isoDate as string).toISOString()}'` : 'timezone(\'utc\', now())',
    s(a.isoDate), s(a.summary), s(a.content), s(a.status ?? 'published'), s(a.author),
    s(a.sourceName), s(a.sourceUrl), s(a.publishedAt),
    jsonb(a.documentImages ?? []), s(a.documentUrl), b(a.aiAssisted),
  ]);
  files.push(['09_news.sql', header('NOTÍCIAS') + upsert('ancaf_news', rows, cols, 'id')]);
}

// ── 10 · vídeos ──────────────────────────────────────────────────────
{
  const cols = ['id', 'title', 'duration', 'views', 'category', 'thumbnail', 'video_url', 'is_live', 'sort'];
  const rows = (d.videoHighlightsMock as unknown as Array<Record<string, unknown>>).map((v, i) => [
    s(v.id), s(v.title), s(v.duration), s(v.views), s(v.category), s(v.thumbnail), s(v.videoUrl),
    b(v.isLive), n(i),
  ]);
  files.push(['10_videos.sql', header('VÍDEOS / DESTAQUES') + upsert('ancaf_videos', rows, cols, 'id')]);
}

// ── 11 · escalações + eventos publicados ─────────────────────────────
{
  const lineupCols = ['match_id', 'team_id', 'side', 'players', 'coach', 'confirmed_by'];
  const eventCols = ['match_id', 'minute', 'type', 'team_side', 'player', 'player_id', 'assist', 'player_out', 'detail', 'sort'];
  const statCols = ['match_id', 'side', 'stat_key', 'value', 'published'];
  const lineupRows: string[][] = [];
  const eventRows: string[][] = [];
  const statRows: string[][] = [];
  const eventMatchIds = new Set<string>();

  for (const match of d.getMatchesForSeason('2026-27') as unknown as Array<Record<string, unknown>>) {
    const det = d.getMatchDetail(match as never) as unknown as Record<string, unknown>;
    const homeLineup = det.homeLineup as Array<Record<string, unknown>>;
    const awayLineup = det.awayLineup as Array<Record<string, unknown>>;
    const isPublishedLineup = [...homeLineup, ...awayLineup].some((p) => p.rating === 0);
    if (isPublishedLineup) {
      const pack = (lu: Array<Record<string, unknown>>) =>
        lu.map((p) => ({
          playerId: p.playerId ?? null, name: p.name, number: p.number ?? 0,
          position: p.position ?? null, isStarter: p.isStarter === true, isCaptain: false,
        }));
      lineupRows.push([s(match.id), s(match.homeTeamId), s('home'), jsonb(pack(homeLineup)), s(det.homeCoach), s('seed')]);
      lineupRows.push([s(match.id), s(match.awayTeamId), s('away'), jsonb(pack(awayLineup)), s(det.awayCoach), s('seed')]);
    }

    const events = det.events as Array<Record<string, unknown>>;
    const officialKeys = (det.officialStatKeys as string[]) ?? [];
    if (d.hasPublishedMatchEvents(match as never)) {
      eventMatchIds.add(match.id as string);
      events.forEach((e, i) => {
        eventRows.push([
          s(match.id), n(e.minute), s(e.type), s(e.team), s(e.player), s(e.playerId),
          s(e.assist), s(e.playerOut), s(e.detail), n(i),
        ]);
      });
      if (officialKeys.length) {
        const homeStats = det.homeStats as Record<string, unknown>;
        const awayStats = det.awayStats as Record<string, unknown>;
        for (const key of officialKeys) {
          statRows.push([s(match.id), s('home'), s(key), n(homeStats[key]), 'true']);
          statRows.push([s(match.id), s('away'), s(key), n(awayStats[key]), 'true']);
        }
      }
    }
  }

  let sql = header('ESCALAÇÕES, EVENTOS E ESTATÍSTICAS DE JOGO PUBLICADAS');
  if (lineupRows.length) {
    sql += upsert('ancaf_match_lineups', lineupRows, lineupCols, 'match_id,team_id') + '\n';
  }
  if (eventMatchIds.size) {
    sql += `delete from public.ancaf_match_events where match_id in (${[...eventMatchIds].map(s).join(', ')});\n`;
    sql += `insert into public.ancaf_match_events (${eventCols.join(', ')}) values\n`;
    sql += eventRows.map((r) => `  (${r.join(', ')})`).join(',\n') + ';\n\n';
    sql += upsert('ancaf_match_stats', statRows, statCols, 'match_id,side,stat_key');
  }
  files.push(['11_match_artifacts.sql', sql]);
}

// ── 12 · nomeações de arbitragem publicadas ─────────────────────────
{
  const cols = ['season_id', 'round', 'match_id', 'referee', 'assistants', 'fourth_official'];
  const rows: string[][] = [];
  for (const match of d.getMatchesForSeason('2026-27') as unknown as Array<Record<string, unknown>>) {
    const o = d.getMatchOfficials(match as never) as unknown as {
      referee: string; assistants: [string, string]; fourth: string;
    };
    const clean = (v?: string) => (v && v.trim() && v.trim() !== 'A definir' ? v.trim() : null);
    const referee = clean(o.referee);
    if (!referee) continue;
    const assistants = [clean(o.assistants[0]), clean(o.assistants[1])].filter(Boolean);
    rows.push([
      s('2026-27'), n(match.round), s(match.id), s(referee),
      jsonb(assistants), s(clean(o.fourth)),
    ]);
  }
  const sql = header('NOMEAÇÕES DE ARBITRAGEM PUBLICADAS') +
    upsert('ancaf_referee_nominations', rows, cols, 'match_id');
  files.push(['12_referee_nominations.sql', sql]);
}

// ── escrever ──────────────────────────────────────────────────────────
for (const [name, content] of files) {
  await writeFile(new URL(name, OUT), content, 'utf8');
  const lines = content.split('\n').length;
  console.log(`  ${name.padEnd(28)} ${lines} linhas`);
}
console.log(`\n${files.length} ficheiros em supabase/seed/`);
if (skipped) console.log(`${skipped} linhas ignoradas (clube fora de ancaf_teams).`);
