-- =====================================================================
-- GUIA BASE: PUBLICAR OU CORRIGIR O RESULTADO DE UM JOGO
-- Liga Unitel Girabola / Supabase
--
-- COMO USAR
-- 1. Altere SOMENTE os valores do bloco CONFIGURACAO.
-- 2. Confirme o ID do jogo em public.ancaf_matches.
-- 3. Execute todo o ficheiro no SQL Editor do Supabase.
-- 4. Se uma verificacao falhar, toda a operacao e anulada.
--
-- Tipos de evento: goal, yellow, red, warning, sub
-- Para substituicao: player = jogador que entra; playerOut = jogador que sai.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- CONFIGURACAO: EDITE ESTE BLOCO PARA CADA JOGO
-- ---------------------------------------------------------------------
create temporary table _resultado_config on commit drop as
select
  'SUBSTITUIR_ID_DO_JOGO'::text           as match_id,
  '2026-27'::text                         as season_id,
  1::integer                              as round_number,
  'SUBSTITUIR_ID_MANDANTE'::text          as home_team_id,
  'SUBSTITUIR_ID_VISITANTE'::text         as away_team_id,
  1::integer                              as home_score,
  0::integer                              as away_score,
  0::integer                              as half_time_home_score,
  0::integer                              as half_time_away_score,
  null::text                              as stadium,
  null::text                              as broadcaster,
  null::text                              as referee,
  null::integer                           as attendance,
  true::boolean                           as replace_events,
  'administrador@portal'::text            as actor_email,
  '[
    {
      "minute": 35,
      "type": "goal",
      "teamSide": "home",
      "player": "NOME DO MARCADOR",
      "playerOut": null,
      "detail": null
    },
    {
      "minute": 60,
      "type": "sub",
      "teamSide": "away",
      "player": "JOGADOR QUE ENTROU",
      "playerOut": "JOGADOR QUE SAIU",
      "detail": null
    }
  ]'::jsonb                              as events;

-- ---------------------------------------------------------------------
-- VALIDACOES: NAO EDITE
-- ---------------------------------------------------------------------
do $$
declare
  c record;
  found_count integer;
  event_goal_count integer;
begin
  select * into c from _resultado_config;

  if c.home_score < 0 or c.away_score < 0 then
    raise exception 'O resultado nao pode conter valores negativos.';
  end if;
  if c.home_team_id = c.away_team_id then
    raise exception 'Mandante e visitante nao podem ser o mesmo clube.';
  end if;
  if jsonb_typeof(c.events) <> 'array' then
    raise exception 'events deve ser uma lista JSON.';
  end if;

  select count(*) into found_count
  from public.ancaf_matches m
  where m.id = c.match_id
    and m.season_id = c.season_id
    and m.round = c.round_number
    and m.home_team_id = c.home_team_id
    and m.away_team_id = c.away_team_id;

  if found_count <> 1 then
    raise exception 'Jogo nao encontrado ou os dados de confirmacao nao coincidem: %', c.match_id;
  end if;

  if c.replace_events then
    select count(*) into event_goal_count
    from jsonb_array_elements(c.events) event
    where event->>'type' = 'goal';

    if event_goal_count > 0 and event_goal_count <> c.home_score + c.away_score then
      raise exception 'A quantidade de eventos de golo (%) nao coincide com o resultado (%).',
        event_goal_count, c.home_score + c.away_score;
    end if;

    if exists (
      select 1 from jsonb_array_elements(c.events) event
      where coalesce(event->>'type', '') not in ('goal', 'yellow', 'red', 'warning', 'sub')
         or coalesce(event->>'teamSide', '') not in ('home', 'away')
         or coalesce(event->>'player', '') = ''
    ) then
      raise exception 'Existe um evento com tipo, equipa ou jogador invalido.';
    end if;
  end if;
end $$;

-- Guarda o estado anterior para auditoria.
create temporary table _resultado_before on commit drop as
select to_jsonb(m.*) as data
from public.ancaf_matches m
join _resultado_config c on c.match_id = m.id;

-- Atualiza a fonte operacional principal.
update public.ancaf_matches m
set
  home_score = c.home_score,
  away_score = c.away_score,
  score = c.home_score::text || '-' || c.away_score::text,
  half_time_score = c.half_time_home_score::text || '-' || c.half_time_away_score::text,
  stadium = coalesce(c.stadium, m.stadium),
  broadcaster = coalesce(c.broadcaster, m.broadcaster),
  referee = coalesce(c.referee, m.referee),
  attendance = coalesce(c.attendance, m.attendance),
  status = 'finished',
  schedule_status = 'official',
  updated_at = timezone('utc', now())
from _resultado_config c
where m.id = c.match_id;

-- Mantem a tabela legada sincronizada enquanto ela existir no portal.
update public.liga_matches m
set
  home_score = c.home_score,
  away_score = c.away_score,
  score = c.home_score::text || '-' || c.away_score::text,
  stadium = coalesce(c.stadium, m.stadium),
  status = 'finished',
  updated_at = timezone('utc', now())
from _resultado_config c
where m.id = c.match_id;

-- Substitui os eventos somente quando replace_events = true.
delete from public.ancaf_match_events e
using _resultado_config c
where e.match_id = c.match_id
  and c.replace_events;

insert into public.ancaf_match_events
  (match_id, minute, type, team_side, player, player_id, player_out, detail, sort)
select
  c.match_id,
  nullif(event->>'minute', '')::integer,
  event->>'type',
  event->>'teamSide',
  event->>'player',
  nullif(event->>'playerId', ''),
  nullif(event->>'playerOut', ''),
  nullif(event->>'detail', ''),
  event_ordinality::integer - 1
from _resultado_config c
cross join lateral jsonb_array_elements(c.events) with ordinality as items(event, event_ordinality)
where c.replace_events;

-- Regista quem fez a alteracao e os estados anterior/posterior.
insert into public.ancaf_match_audit_log
  (match_id, actor_email, action, before_data, after_data)
select
  c.match_id,
  c.actor_email,
  'publish',
  b.data,
  to_jsonb(m.*)
from _resultado_config c
join _resultado_before b on true
join public.ancaf_matches m on m.id = c.match_id;

-- ---------------------------------------------------------------------
-- RECALCULA A CLASSIFICACAO DA EPOCA A PARTIR DOS JOGOS TERMINADOS
-- ---------------------------------------------------------------------
with participants as (
  select m.season_id, m.home_team_id as team_id
  from public.ancaf_matches m join _resultado_config c on c.season_id = m.season_id
  union
  select m.season_id, m.away_team_id as team_id
  from public.ancaf_matches m join _resultado_config c on c.season_id = m.season_id
), team_games as (
  select
    m.season_id,
    m.home_team_id as team_id,
    m.home_score as goals_for,
    m.away_score as goals_against
  from public.ancaf_matches m join _resultado_config c on c.season_id = m.season_id
  where m.status = 'finished'
  union all
  select
    m.season_id,
    m.away_team_id as team_id,
    m.away_score as goals_for,
    m.home_score as goals_against
  from public.ancaf_matches m join _resultado_config c on c.season_id = m.season_id
  where m.status = 'finished'
), totals as (
  select
    p.season_id,
    p.team_id,
    count(g.team_id)::integer as played,
    count(*) filter (where g.goals_for > g.goals_against)::integer as won,
    count(*) filter (where g.goals_for = g.goals_against)::integer as drawn,
    count(*) filter (where g.goals_for < g.goals_against)::integer as lost,
    coalesce(sum(g.goals_for), 0)::integer as goals_for,
    coalesce(sum(g.goals_against), 0)::integer as goals_against,
    (3 * count(*) filter (where g.goals_for > g.goals_against)
       + count(*) filter (where g.goals_for = g.goals_against))::integer as points
  from participants p
  left join team_games g on g.season_id = p.season_id and g.team_id = p.team_id
  group by p.season_id, p.team_id
), ranked as (
  select
    t.*,
    row_number() over (
      partition by t.season_id
      order by t.points desc,
               (t.goals_for - t.goals_against) desc,
               t.goals_for desc,
               t.team_id
    )::integer as position
  from totals t
)
insert into public.ancaf_standings
  (season_id, team_id, position, played, won, drawn, lost,
   goals_for, goals_against, points, goals_verified, form_verified)
select
  season_id, team_id, position, played, won, drawn, lost,
  goals_for, goals_against, points, true, false
from ranked
on conflict (season_id, team_id) do update set
  position = excluded.position,
  played = excluded.played,
  won = excluded.won,
  drawn = excluded.drawn,
  lost = excluded.lost,
  goals_for = excluded.goals_for,
  goals_against = excluded.goals_against,
  points = excluded.points,
  goals_verified = excluded.goals_verified,
  form_verified = excluded.form_verified,
  updated_at = timezone('utc', now());

-- Resultado final apresentado pelo SQL Editor.
select
  m.id,
  m.season_id,
  m.round,
  m.home_team,
  m.score,
  m.away_team,
  m.half_time_score,
  m.status,
  m.updated_at
from public.ancaf_matches m
join _resultado_config c on c.match_id = m.id;

commit;
