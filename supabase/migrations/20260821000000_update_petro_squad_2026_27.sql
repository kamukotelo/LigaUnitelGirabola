-- Plantel principal do Petro de Luanda 2026/2027.
-- Fonte consultada em 21/08/2026:
-- https://www.zerozero.pt/equipa/petro-de-luanda?search=1&skp_owll=1

delete from public.ancaf_players where team_id = 'petro';

insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality, height,
   weight, goals, assists, appearances, photo_url, bio, attributes,
   career_history, fifa_connect_status)
values
  ('hugo-marques', 'petro', 'Hugo Marques', 'Guarda-redes', 1, 40, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('neblu', 'petro', 'Neblú', 'Guarda-redes', 22, 32, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('agostinho-calunga', 'petro', 'Agostinho Calunga', 'Guarda-redes', 30, 28, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('areola', 'petro', 'Areola', 'Guarda-redes', 38, 20, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('eddie-afonso', 'petro', 'Eddie Afonso', 'Defesa', 25, 32, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('antonio-hossi', 'petro', 'António Hossi', 'Defesa', 27, 25, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('ruben-aderito', 'petro', 'Rúben Adérito', 'Defesa', 4, 23, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('leo-bolgado', 'petro', 'Léo Bolgado', 'Defesa', 5, 28, 'Brasil', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('vidinho', 'petro', 'Vidinho', 'Defesa', 18, 28, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('kinito', 'petro', 'Kinito', 'Defesa', 24, 28, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('lourenco-didissa', 'petro', 'Lourenço Didissa', 'Defesa', 31, 18, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('nurio-fortuna', 'petro', 'Núrio Fortuna', 'Defesa', 2, 31, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('berna', 'petro', 'Berna', 'Defesa', 13, 22, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('deybi-flores', 'petro', 'Deybi Flores', 'Médio', 12, 30, 'Honduras', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('jorge-pereira', 'petro', 'Jorge Pereira', 'Médio', 20, 28, 'Portugal', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('gabriel', 'petro', 'Gabriel', 'Médio', 39, 17, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('mario-balburdia', 'petro', 'Mário Balbúrdia', 'Médio', 6, 29, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('jonathan-toro', 'petro', 'Jonathan Toro', 'Médio', 8, 29, 'Honduras', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('pedro-aparicio', 'petro', 'Pedro Aparício', 'Médio', 10, 30, 'Portugal', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('jairo-muanha', 'petro', 'Jairo Muanha', 'Médio', 34, 17, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('helder-costa', 'petro', 'Hélder Costa', 'Avançado', 11, 32, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('lucas-joao', 'petro', 'Lucas João', 'Avançado', 9, 32, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('tiago-reis', 'petro', 'Tiago Reis', 'Avançado', 23, 27, 'Brasil', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('tiago-azulao', 'petro', 'Tiago Azulão', 'Avançado', 26, 38, 'Brasil', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('depu', 'petro', 'Depú', 'Avançado', 29, 26, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('ivan-cavaleiro', 'petro', 'Ivan Cavaleiro', 'Avançado', 7, 32, 'Portugal', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('vanilson', 'petro', 'Vanilson', 'Avançado', 17, 27, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered'),
  ('ilidio-panda', 'petro', 'Ilídio Panda', 'Avançado', 33, 18, 'Angola', null, null, 0, 0, 0, null, null, '{}'::jsonb, '[]'::jsonb, 'unregistered')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  height = excluded.height,
  weight = excluded.weight,
  goals = excluded.goals,
  assists = excluded.assists,
  appearances = excluded.appearances,
  photo_url = excluded.photo_url,
  bio = excluded.bio,
  attributes = excluded.attributes,
  career_history = excluded.career_history,
  fifa_connect_status = excluded.fifa_connect_status;
