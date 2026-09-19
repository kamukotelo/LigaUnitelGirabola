-- Publicação atómica de um Arquivo de Jogo validado pelo servidor.
create or replace function public.ancaf_publish_match_file(
  p_match_id text,
  p_actor_email text,
  p_payload jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before jsonb;
  v_now timestamptz := timezone('utc', now());
  v_home text := p_payload #>> '{equipas,casa,id}';
  v_away text := p_payload #>> '{equipas,fora,id}';
  v_home_score int := (p_payload #>> '{resultado,casa}')::int;
  v_away_score int := (p_payload #>> '{resultado,fora}')::int;
  v_half text;
  v_calendar jsonb;
  v_nominations jsonb;
begin
  select to_jsonb(m) into v_before from ancaf_matches m where id = p_match_id for update;
  if v_before is null then raise exception 'Jogo % não encontrado', p_match_id; end if;
  if v_before->>'home_team_id' <> v_home or v_before->>'away_team_id' <> v_away then
    raise exception 'As equipas do ficheiro não correspondem ao jogo de destino';
  end if;
  if p_payload #>> '{resultado,periodos,primeiroPeriodo,casa}' is not null then
    v_half := (p_payload #>> '{resultado,periodos,primeiroPeriodo,casa}') || '-' || (p_payload #>> '{resultado,periodos,primeiroPeriodo,fora}');
  end if;

  update ancaf_matches set
    score = v_home_score || '-' || v_away_score, home_score = v_home_score, away_score = v_away_score,
    status = p_payload #>> '{resultado,estado}',
    date = coalesce((p_payload #>> '{kickoff,dataHoraIso}')::timestamptz, date),
    stadium = coalesce(nullif(p_payload #>> '{localizacao,estadio}', ''), stadium),
    referee = coalesce(nullif(p_payload #>> '{oficiais,arbitro}', ''), referee),
    assistant_referees = jsonb_build_array(p_payload #>> '{oficiais,assistente1}', p_payload #>> '{oficiais,assistente2}'),
    fourth_official = nullif(p_payload #>> '{oficiais,quartoArbitro}', ''),
    half_time_score = coalesce(v_half, half_time_score), schedule_status = 'official',
    attendance = coalesce((p_payload #>> '{resultado,espectadores}')::int, attendance),
    useful_time_minutes = coalesce((p_payload #>> '{resultado,tempoUtilMinutos}')::int, useful_time_minutes),
    broadcaster = coalesce(nullif(p_payload #>> '{transmissao,televisao}', ''), broadcaster), updated_at = v_now
  where id = p_match_id;

  if p_payload ? 'escalacoes' then
    insert into ancaf_match_lineups(match_id, team_id, side, players, coach, confirmed_by, confirmed_at, updated_at)
    select p_match_id, team_id, side,
      coalesce((select jsonb_agg(jsonb_build_object('playerId',coalesce(x->>'maId','p-'||team_id||'-'||x->>'numero'),'name',x->>'nome','number',(x->>'numero')::int,'position',coalesce(x->>'posicao',case when (x->>'isGuardaRedes')::boolean then 'GK' end),'isStarter',starter,'isCaptain',coalesce((x->>'isCapitao')::boolean,false))) from (
        select value x, true starter from jsonb_array_elements(p_payload #> array['escalacoes',side_pt,'titulares'])
        union all select value, false from jsonb_array_elements(p_payload #> array['escalacoes',side_pt,'suplentes'])
      ) q), '[]'::jsonb),
      (select s->>'nome' from jsonb_array_elements(coalesce(p_payload #> array['equipaTecnica',side_pt], '[]'::jsonb)) s where s->>'cargo' ~* 'head coach|treinador principal' limit 1),
      'Arquivo de Jogo FCMS (Admin '||p_actor_email||')', v_now, v_now
    from (values (v_home,'home','casa'),(v_away,'away','fora')) t(team_id,side,side_pt)
    on conflict(match_id,team_id) do update set side=excluded.side,players=excluded.players,coach=excluded.coach,confirmed_by=excluded.confirmed_by,confirmed_at=excluded.confirmed_at,updated_at=excluded.updated_at;
  end if;

  delete from ancaf_match_events where match_id=p_match_id;
  insert into ancaf_match_events(match_id,minute,type,team_side,player,player_id,player_out,detail,sort,updated_at)
  select p_match_id,(e->>'minuto')::int,
    case e->>'tipo' when 'amarelo' then 'yellow' when 'vermelho' then 'red' when 'substituicao' then 'sub' else 'goal' end,
    case e->>'equipa' when 'casa' then 'home' else 'away' end,
    coalesce(e->>'jogador',e->>'jogadorEntra',''),
    case when e->>'numero' is null then null else 'p-'||case e->>'equipa' when 'casa' then v_home else v_away end||'-'||e->>'numero' end,
    e->>'jogadorSai', concat_ws(' · ',nullif(e->>'motivo',''),case e->>'subtipo' when 'autogolo' then 'Autogolo' when 'penalti' then 'Penálti' end), ord::int,v_now
  from jsonb_array_elements(coalesce(p_payload->'eventos','[]'::jsonb)) with ordinality q(e,ord);

  insert into ancaf_referee_nominations(season_id,round,match_id,referee,assistants,fourth_official,published_at,updated_at)
  select coalesce(v_before->>'season_id','2026-27'),(v_before->>'round')::int,p_match_id,p_payload #>> '{oficiais,arbitro}',jsonb_build_array(p_payload #>> '{oficiais,assistente1}',p_payload #>> '{oficiais,assistente2}'),p_payload #>> '{oficiais,quartoArbitro}',v_now,v_now
  where nullif(p_payload #>> '{oficiais,arbitro}','') is not null
  on conflict(match_id) do update set referee=excluded.referee,assistants=excluded.assistants,fourth_official=excluded.fourth_official,published_at=excluded.published_at,updated_at=excluded.updated_at;

  insert into ancaf_match_officials(match_id,referee,referee_category,assistant_1,assistant_2,fourth_official,commissioner,updated_at)
  values(p_match_id,p_payload #>> '{oficiais,arbitro}',p_payload #>> '{oficiais,categoriaArbitro}',p_payload #>> '{oficiais,assistente1}',p_payload #>> '{oficiais,assistente2}',p_payload #>> '{oficiais,quartoArbitro}',p_payload #>> '{oficiais,comissario}',v_now)
  on conflict(match_id) do update set referee=excluded.referee,referee_category=excluded.referee_category,assistant_1=excluded.assistant_1,assistant_2=excluded.assistant_2,fourth_official=excluded.fourth_official,commissioner=excluded.commissioner,updated_at=excluded.updated_at;

  if p_payload ? 'equipaTecnica' then
    delete from ancaf_match_staff where match_id=p_match_id;
    insert into ancaf_match_staff(match_id,team_id,side,role,name,ma_id,updated_at)
    select p_match_id,team_id,side,s->>'cargo',s->>'nome',s->>'maId',v_now
    from (values(v_home,'home','casa'),(v_away,'away','fora')) t(team_id,side,side_pt), lateral jsonb_array_elements(coalesce(p_payload #> array['equipaTecnica',side_pt],'[]'::jsonb)) s;
  end if;

  select coalesce(value::jsonb,'{}'::jsonb) into v_calendar from ancaf_configs where key='override_calendar' for update;
  v_calendar := jsonb_set(coalesce(v_calendar,'{}'::jsonb),array[p_match_id],jsonb_build_object('score',v_home_score||'-'||v_away_score,'homeScore',v_home_score,'awayScore',v_away_score,'status',p_payload #>> '{resultado,estado}','date',coalesce(p_payload #>> '{kickoff,dataHoraIso}',v_before->>'date'),'stadium',coalesce(nullif(p_payload #>> '{localizacao,estadio}',''),v_before->>'stadium'),'referee',p_payload #>> '{oficiais,arbitro}','halfTimeScore',v_half,'scheduleStatus','official'),true);
  insert into ancaf_configs(key,value) values('override_calendar',v_calendar::text) on conflict(key) do update set value=excluded.value;

  select coalesce(value::jsonb,'{}'::jsonb) into v_nominations from ancaf_configs where key='override_nominations' for update;
  v_nominations := jsonb_set(coalesce(v_nominations,'{}'::jsonb),array[p_match_id],jsonb_build_object('referee',p_payload #>> '{oficiais,arbitro}','assistants',jsonb_build_array(p_payload #>> '{oficiais,assistente1}',p_payload #>> '{oficiais,assistente2}'),'fourth',p_payload #>> '{oficiais,quartoArbitro}'),true);
  insert into ancaf_configs(key,value) values('override_nominations',v_nominations::text) on conflict(key) do update set value=excluded.value;

  insert into ancaf_match_audit_log(match_id,actor_email,action,before_data,after_data,created_at)
  select p_match_id,p_actor_email,'publish',v_before,to_jsonb(m),v_now from ancaf_matches m where id=p_match_id;
  return jsonb_build_object('matchId',p_match_id,'score',v_home_score||'-'||v_away_score,'eventsWritten',jsonb_array_length(coalesce(p_payload->'eventos','[]'::jsonb)));
end $$;

revoke all on function public.ancaf_publish_match_file(text,text,jsonb) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on function public.ancaf_publish_match_file(text,text,jsonb) from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on function public.ancaf_publish_match_file(text,text,jsonb) from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.ancaf_publish_match_file(text,text,jsonb) to service_role';
  end if;
end $$;
