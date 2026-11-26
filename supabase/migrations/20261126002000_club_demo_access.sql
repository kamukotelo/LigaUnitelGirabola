create unique index if not exists ancaf_club_logins_official_team_uidx
  on public.ancaf_club_logins (team_id)
  where not (username = 'TESTE' and team_id = 'wiliete');

alter table public.ancaf_club_logins
  drop constraint if exists ancaf_club_logins_team_id_key;
