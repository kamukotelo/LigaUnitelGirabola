/**
 * Consolida na base de dados os artefactos de jogo que hoje vivem em código
 * (src/lib/data.ts): nomeações de arbitragem, escalações publicadas, eventos
 * (golos/cartões/substituições) e estatísticas de jogo.
 *
 * Lê de getMatchDetail / getMatchOfficials (que, corrido em Node, caem sempre
 * nas constantes do código) e faz upsert em:
 *   - ancaf_referee_nominations   (onConflict match_id)
 *   - ancaf_match_lineups         (onConflict match_id,team_id)
 *   - ancaf_match_events          (delete por match_id + insert)
 *   - ancaf_match_stats           (onConflict match_id,side,stat_key)
 *
 * Idempotente. Nunca toca em jogos cujo artefacto não existe em código
 * (ex.: escalações/eventos já vindos do FCMS ou confirmados no admin).
 *
 *   npx tsx scripts/seed-db-match-data.mts            # dry-run (só imprime)
 *   npx tsx scripts/seed-db-match-data.mts --write    # grava
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import {
  getMatchesForSeason,
  getMatchDetail,
  getMatchOfficials,
  hasPublishedMatchEvents,
  CURRENT_SEASON_ID,
} from '../src/lib/data';

for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const WRITE = process.argv.includes('--write');
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const SEASON = CURRENT_SEASON_ID;
const defined = (v?: string) => (v && v.trim() && v.trim() !== 'A definir' ? v.trim() : null);

const matches = getMatchesForSeason(SEASON);

const nominationRows: Record<string, unknown>[] = [];
const lineupRows: Record<string, unknown>[] = [];
const statRows: Record<string, unknown>[] = [];
const eventsByMatch: Record<string, Record<string, unknown>[]> = {};

for (const match of matches) {
  // ── nomeações ──────────────────────────────────────────────────────
  const o = getMatchOfficials(match);
  const ref = defined(o.referee);
  if (ref) {
    nominationRows.push({
      season_id: SEASON,
      round: match.round,
      match_id: match.id,
      referee: ref,
      assistants: [defined(o.assistants[0]), defined(o.assistants[1])].filter(Boolean),
      fourth_official: defined(o.fourth),
      published_at: new Date().toISOString(),
    });
  }

  const det = getMatchDetail(match);

  // ── escalações publicadas (rating === 0 => veio de ficha, não procedural) ──
  const isPublishedLineup = [...det.homeLineup, ...det.awayLineup].some((p) => p.rating === 0);
  if (isPublishedLineup) {
    const pack = (lu: typeof det.homeLineup) =>
      lu.map((p) => ({
        playerId: p.playerId ?? null,
        name: p.name,
        number: p.number ?? 0,
        position: p.position ?? null,
        isStarter: p.isStarter === true,
        isCaptain: Boolean((p as { isCaptain?: boolean }).isCaptain),
      }));
    lineupRows.push({
      match_id: match.id, team_id: match.homeTeamId, side: 'home',
      players: pack(det.homeLineup), coach: det.homeCoach ?? null, confirmed_by: 'seed',
    });
    lineupRows.push({
      match_id: match.id, team_id: match.awayTeamId, side: 'away',
      players: pack(det.awayLineup), coach: det.awayCoach ?? null, confirmed_by: 'seed',
    });
  }

  // ── eventos ────────────────────────────────────────────────────────
  if (hasPublishedMatchEvents(match)) {
    eventsByMatch[match.id] = det.events.map((e, i) => ({
      match_id: match.id,
      minute: e.minute ?? null,
      type: e.type,
      team_side: e.team,
      player: e.player,
      player_id: e.playerId ?? null,
      assist: (e as { assist?: string }).assist ?? null,
      player_out: e.playerOut ?? null,
      detail: e.detail ?? null,
      sort: i,
    }));
  }

  // ── estatísticas ───────────────────────────────────────────────────
  for (const key of det.officialStatKeys ?? []) {
    const h = (det.homeStats as Record<string, number>)[key];
    const a = (det.awayStats as Record<string, number>)[key];
    if (h != null) statRows.push({ match_id: match.id, side: 'home', stat_key: key, value: h, published: true });
    if (a != null) statRows.push({ match_id: match.id, side: 'away', stat_key: key, value: a, published: true });
  }
}

const eventMatchIds = Object.keys(eventsByMatch);
const eventRows = eventMatchIds.flatMap((id) => eventsByMatch[id]);

console.log(`Época ${SEASON} — ${matches.length} jogos`);
console.log(`  nomeações : ${nominationRows.length} jogos → ${nominationRows.map((r) => r.match_id).join(', ')}`);
console.log(`  escalações: ${lineupRows.length / 2} jogos → ${[...new Set(lineupRows.map((r) => r.match_id))].join(', ')}`);
console.log(`  eventos   : ${eventMatchIds.length} jogos, ${eventRows.length} linhas → ${eventMatchIds.join(', ')}`);
console.log(`  estat.    : ${statRows.length} linhas em ${[...new Set(statRows.map((r) => r.match_id))].length} jogos`);

if (!WRITE) {
  console.log('\n(dry-run — repetir com --write para gravar)');
  process.exit(0);
}

const chunk = <T,>(xs: T[], n: number) => xs.reduce<T[][]>((acc, x, i) => (i % n ? acc[acc.length - 1].push(x) : acc.push([x]), acc), []);

// nomeações
{
  const { error } = await db.from('ancaf_referee_nominations').upsert(nominationRows, { onConflict: 'match_id' });
  console.log('ancaf_referee_nominations:', error ? `ERRO ${error.message}` : `${nominationRows.length} ok`);
}
// escalações
{
  const { error } = await db.from('ancaf_match_lineups').upsert(lineupRows, { onConflict: 'match_id,team_id' });
  console.log('ancaf_match_lineups:', error ? `ERRO ${error.message}` : `${lineupRows.length} ok`);
}
// eventos: delete + insert por jogo
if (eventMatchIds.length) {
  const del = await db.from('ancaf_match_events').delete().in('match_id', eventMatchIds);
  if (del.error) console.log('ancaf_match_events delete:', `ERRO ${del.error.message}`);
  for (const part of chunk(eventRows, 200)) {
    const { error } = await db.from('ancaf_match_events').insert(part);
    if (error) { console.log('ancaf_match_events insert:', `ERRO ${error.message}`); break; }
  }
  console.log('ancaf_match_events:', `${eventRows.length} linhas (${eventMatchIds.length} jogos)`);
}
// estatísticas
{
  const { error } = await db.from('ancaf_match_stats').upsert(statRows, { onConflict: 'match_id,side,stat_key' });
  console.log('ancaf_match_stats:', error ? `ERRO ${error.message}` : `${statRows.length} ok`);
}

console.log('\nConcluído.');
