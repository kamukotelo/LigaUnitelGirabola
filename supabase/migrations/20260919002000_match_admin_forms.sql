-- Dados editoriais da ficha operacional que não pertencem ao calendário.
create table if not exists public.ancaf_match_reports (
  match_id text primary key references public.ancaf_matches(id) on delete cascade,
  summary text not null default '',
  incidents text not null default '',
  pitch_conditions text not null default '',
  organisation_notes text not null default '',
  status text not null default 'draft' check (status in ('draft', 'review', 'approved')),
  updated_by text,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.ancaf_match_reports enable row level security;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'drop policy if exists "ancaf service manage match reports" on public.ancaf_match_reports';
    execute 'create policy "ancaf service manage match reports" on public.ancaf_match_reports for all to service_role using (true) with check (true)';
  end if;
end $$;

-- A ficha é alterada por blocos (partida, oficiais, ocorrências e relatório).
-- Estes valores passam a fazer parte da pista de auditoria existente.
alter table public.ancaf_match_audit_log drop constraint if exists ancaf_match_audit_log_action_check;
alter table public.ancaf_match_audit_log
  add constraint ancaf_match_audit_log_action_check
  check (action in ('create', 'update', 'publish', 'officials', 'events', 'report', 'lineup'));
