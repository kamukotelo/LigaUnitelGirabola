create table if not exists public.ancaf_club_logins (
  username text primary key check (username ~ '^[A-Z0-9]{2,12}$'),
  team_id text not null unique references public.ancaf_teams(id),
  password_hash text not null,
  credential_version uuid not null default gen_random_uuid(),
  active boolean not null default true,
  window_started_at timestamptz not null default now(),
  attempts integer not null default 0
);

create table if not exists public.ancaf_club_portal_sessions (
  token_hash text primary key,
  username text not null references public.ancaf_club_logins(username) on delete cascade,
  credential_version uuid not null,
  expires_at timestamptz not null
);

create table if not exists public.ancaf_club_submissions (
  id uuid primary key default gen_random_uuid(),
  team_id text not null references public.ancaf_teams(id),
  username text not null,
  category text not null check (category in ('jogadores','jogos','staff','alteracoes','informacoes','solicitacoes','sugestoes')),
  subject text not null check (char_length(subject) between 1 and 150),
  message text not null check (char_length(message) <= 5000),
  filename text,
  attachment bytea check (octet_length(attachment) <= 3000000),
  created_at timestamptz not null default now()
);

create index if not exists ancaf_club_submissions_team_date_idx
  on public.ancaf_club_submissions (team_id, created_at desc);
create index if not exists ancaf_club_submissions_date_idx
  on public.ancaf_club_submissions (created_at desc);

alter table public.ancaf_club_logins enable row level security;
alter table public.ancaf_club_portal_sessions enable row level security;
alter table public.ancaf_club_submissions enable row level security;
