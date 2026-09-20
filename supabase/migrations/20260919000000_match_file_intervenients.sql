-- Intervenientes internos provenientes do Arquivo de Jogo FCMS.
-- Não existe política pública: comissário e equipa técnica ficam disponíveis
-- apenas às operações autenticadas através do service_role.
create table if not exists public.ancaf_match_officials (
  match_id text primary key references public.ancaf_matches(id) on delete cascade,
  referee text,
  referee_category text,
  assistant_1 text,
  assistant_2 text,
  fourth_official text,
  commissioner text,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ancaf_match_staff (
  id uuid primary key default gen_random_uuid(),
  match_id text not null references public.ancaf_matches(id) on delete cascade,
  team_id text not null references public.ancaf_teams(id) on delete cascade,
  side text not null check (side in ('home', 'away')),
  role text not null,
  name text not null,
  ma_id text,
  updated_at timestamptz not null default timezone('utc', now())
);
create index if not exists ancaf_match_staff_match_idx on public.ancaf_match_staff(match_id);

alter table public.ancaf_match_officials enable row level security;
alter table public.ancaf_match_staff enable row level security;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'drop policy if exists "ancaf service manage match officials" on public.ancaf_match_officials';
    execute 'create policy "ancaf service manage match officials" on public.ancaf_match_officials for all to service_role using (true) with check (true)';
    execute 'drop policy if exists "ancaf service manage match staff" on public.ancaf_match_staff';
    execute 'create policy "ancaf service manage match staff" on public.ancaf_match_staff for all to service_role using (true) with check (true)';
  end if;
end $$;
