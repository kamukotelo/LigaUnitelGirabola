alter table public.ancaf_club_submissions
  add column if not exists status text not null default 'recebido'
    check (status in ('recebido','analise','corrigir','concluido')),
  add column if not exists details jsonb not null default '{}'::jsonb,
  add column if not exists assigned_to text,
  add column if not exists revision integer not null default 1,
  add column if not exists updated_at timestamptz;

create table if not exists public.ancaf_club_updates (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.ancaf_club_submissions(id),
  author text not null check (author in ('ancaf','clube')),
  actor text not null,
  status text not null check (status in ('recebido','analise','corrigir','concluido')),
  revision integer not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ancaf_club_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.ancaf_club_submissions(id),
  revision integer not null,
  filename text not null,
  attachment bytea not null check (octet_length(attachment) between 1 and 3000000)
);

create index if not exists ancaf_club_updates_submission_idx on public.ancaf_club_updates (submission_id, created_at);
create index if not exists ancaf_club_files_submission_idx on public.ancaf_club_files (submission_id, revision);
create index if not exists ancaf_club_status_idx on public.ancaf_club_submissions (status, updated_at desc);

alter table public.ancaf_club_updates enable row level security;
alter table public.ancaf_club_files enable row level security;

create or replace view public.ancaf_club_workflow with (security_invoker = true) as
select s.id, s.team_id, s.username, s.category, s.subject, s.message, s.filename,
       s.created_at, coalesce(s.updated_at, s.created_at) as activity_at,
       s.status, s.details, s.assigned_to, s.revision,
       coalesce((select jsonb_agg(jsonb_build_object('id', u.id, 'author', u.author,
         'status', u.status, 'message', u.message, 'created_at', u.created_at)
         order by u.created_at, u.id)
         from public.ancaf_club_updates u where u.submission_id = s.id), '[]'::jsonb) as updates,
       coalesce((select jsonb_agg(jsonb_build_object('id', f.id, 'filename', f.filename,
         'revision', f.revision) order by f.revision desc, f.filename, f.id)
         from public.ancaf_club_files f where f.submission_id = s.id), '[]'::jsonb) as files
from public.ancaf_club_submissions s;

revoke all on public.ancaf_club_workflow from public;
