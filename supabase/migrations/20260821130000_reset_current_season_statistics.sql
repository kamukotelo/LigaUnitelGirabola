-- Reinício estatístico da época 2026/2027.
-- A contagem oficial começa na 1.ª jornada; nenhum número de 2025/2026 deve
-- transitar para a classificação ou para as estatísticas individuais.

update public.ancaf_players
set
  goals = 0,
  assists = 0,
  appearances = 0,
  attributes = '{}'::jsonb,
  career_history = coalesce(career_history, '[]'::jsonb);

update public.ancaf_matches
set
  home_score = 0,
  away_score = 0,
  score = null,
  status = 'scheduled'
where season_id = '2026-27';
