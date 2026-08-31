-- Fonte operacional única para jogos e respetiva rastreabilidade.
create table if not exists public.ancaf_match_audit_log (
  id uuid primary key default gen_random_uuid(),
  match_id text not null references public.ancaf_matches(id) on delete cascade,
  actor_email text not null,
  action text not null check (action in ('create', 'update', 'publish')),
  before_data jsonb not null default '{}'::jsonb,
  after_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);
create index if not exists ancaf_match_audit_match_idx on public.ancaf_match_audit_log (match_id, created_at desc);
alter table public.ancaf_match_audit_log enable row level security;
drop policy if exists "ancaf service write match audit" on public.ancaf_match_audit_log;
create policy "ancaf service write match audit" on public.ancaf_match_audit_log for all to service_role using (true) with check (true);

-- Evita estados e placares incoerentes no registo operacional.
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'ancaf_matches_nonnegative_score') then
    alter table public.ancaf_matches
      add constraint ancaf_matches_nonnegative_score check (home_score >= 0 and away_score >= 0) not valid;
  end if;
end $$;
