create table if not exists public.ancaf_club_accounts (
  email text primary key check (email = lower(trim(email))),
  full_name text not null,
  team_id text not null references public.ancaf_teams(id),
  active boolean not null default true
);

create table if not exists public.ancaf_club_otp (
  email text primary key references public.ancaf_club_accounts(email) on delete cascade,
  code_hash text not null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null,
  attempts integer not null default 0,
  used_at timestamptz
);

create table if not exists public.ancaf_club_sessions (
  token_hash text primary key,
  email text not null references public.ancaf_club_accounts(email) on delete cascade,
  team_id text not null references public.ancaf_teams(id),
  expires_at timestamptz not null
);

create index if not exists ancaf_club_sessions_expires_idx
  on public.ancaf_club_sessions (expires_at);

alter table public.ancaf_club_accounts enable row level security;
alter table public.ancaf_club_otp enable row level security;
alter table public.ancaf_club_sessions enable row level security;
