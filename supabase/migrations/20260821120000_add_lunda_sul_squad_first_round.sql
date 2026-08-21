-- Convocados do Desportivo da Lunda Sul para a 1.ª jornada de 2026/2027,
-- frente ao Petro de Luanda, publicados pelo clube em 21/08/2026.

delete from public.ancaf_players where team_id = 'lundasul';

insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality, goals,
   assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('nono', 'lundasul', 'Nonó', 'Defesa', 2, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('yuri', 'lundasul', 'Yuri', 'Defesa', 4, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('fred', 'lundasul', 'Fred', 'Defesa', 5, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('platini', 'lundasul', 'Platini', 'Médio', 6, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('neymar-lunda-sul', 'lundasul', 'Neymar', 'Avançado', 7, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('vado-lunda-sul', 'lundasul', 'Vado', 'Médio', 8, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('maranata', 'lundasul', 'Maranata', 'Médio', 10, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('magrinho', 'lundasul', 'Magrinho', 'Avançado', 11, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('cacusso', 'lundasul', 'Cacusso', 'Guarda-redes', 12, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('ximba', 'lundasul', 'Ximba', 'Médio', 16, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('jepson', 'lundasul', 'Jepson', 'Avançado', 17, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('fuca', 'lundasul', 'Fuca', 'Avançado', 18, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('manucho-lunda-sul', 'lundasul', 'Manucho', 'Avançado', 19, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('mussa-lunda-sul', 'lundasul', 'Mussá', 'Avançado', 20, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('mongadie', 'lundasul', 'Mongadié', 'Defesa', 23, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('dieu', 'lundasul', 'Dieu', 'Defesa', 25, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('sozito', 'lundasul', 'Sozito', 'Defesa', 26, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('joca-lunda-sul', 'lundasul', 'Joca', 'Avançado', 27, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('kibuata', 'lundasul', 'Kibuata', 'Defesa', 28, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('zonzo', 'lundasul', 'Zonzo', 'Médio', 33, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('nicon', 'lundasul', 'Nicon', 'Médio', 34, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('angola-gr', 'lundasul', 'Angola', 'Guarda-redes', 41, null, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'unregistered')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  goals = excluded.goals,
  assists = excluded.assists,
  appearances = excluded.appearances,
  attributes = excluded.attributes,
  career_history = excluded.career_history,
  fifa_connect_status = excluded.fifa_connect_status;
