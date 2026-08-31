-- ═══════════════════════════════════════════════════════════════════════
-- ANCAF · ESCALAÇÕES CONFIRMADAS POR JOGO
-- Liga Unitel Girabola — plataforma digital
--
-- Guarda o onze inicial + suplentes confirmados na consola para cada jogo
-- e equipa. É a fonte da ficha de jogo "Constituição das Equipas" (PDF
-- preenchível enviado aos delegados) e, mais tarde, das escalações
-- publicadas no portal.
--
-- players: jsonb array de
--   { playerId: string|null, name: string, number: number,
--     position: 'GK'|'DEF'|'MID'|'FWD'|null, isStarter: bool, isCaptain: bool }
--
-- Idempotente.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.ancaf_match_lineups (
  id            uuid primary key default gen_random_uuid(),
  match_id      text not null,
  team_id       text not null,
  side          text not null check (side in ('home', 'away')),
  players       jsonb not null default '[]'::jsonb,
  coach         text,
  confirmed_at  timestamptz,
  confirmed_by  text,
  updated_at    timestamptz not null default timezone('utc', now()),
  unique (match_id, team_id)
);

create index if not exists ancaf_match_lineups_match_idx on public.ancaf_match_lineups (match_id);

alter table public.ancaf_match_lineups enable row level security;

drop policy if exists "ancaf public read lineups"  on public.ancaf_match_lineups;
drop policy if exists "ancaf service write lineups" on public.ancaf_match_lineups;
create policy "ancaf public read lineups"  on public.ancaf_match_lineups for select using (true);
create policy "ancaf service write lineups" on public.ancaf_match_lineups for all to service_role using (true) with check (true);

-- Realtime: o portal reage à confirmação de uma escalação sem recarregar.
alter table public.ancaf_match_lineups replica identity full;

drop trigger if exists ancaf_match_lineups_touch on public.ancaf_match_lineups;
create trigger ancaf_match_lineups_touch
  before update on public.ancaf_match_lineups
  for each row execute function public.ancaf_touch_updated_at();
