-- Atualização editorial dos perfis institucionais dos clubes.

update public.ancaf_teams set nickname = 'Palanquinos', coach = 'Leo Neiva',
  palmares = '[{"title":"Liga Unitel Girabola","count":1},{"title":"Taça de Angola","count":1},{"title":"Supertaça de Angola","count":1}]'::jsonb
where id = 'kabuscorp';

update public.ancaf_teams set coach = 'Beto Bianchi', president = 'Wilson Faria',
  board = '[{"role":"Presidente","name":"Wilson Faria"}]'::jsonb,
  kits = '[{"label":"Principal","colors":["#008751","#F9C304"]},{"label":"Secundário","colors":["#FFFFFF","#008751"]}]'::jsonb,
  palmares = '[{"title":"Taça de Angola","count":1},{"title":"Gira Bola B (2.ª Divisão)","count":1,"seasons":["2021/22"]}]'::jsonb
where id = 'wiliete';

update public.ancaf_teams set coach = 'Sandro Mendes',
  kits = '[{"label":"Principal","colors":["#00529B","#FFFFFF"]},{"label":"Secundário","colors":["#F9C304","#000000"]}]'::jsonb,
  palmares = '[{"title":"Taça de Angola","count":1,"seasons":["2019/20"]}]'::jsonb
where id = 'bravos';

update public.ancaf_teams set president = 'Gouveia de Sá Miranda',
  board = '[{"role":"Presidente","name":"Gouveia de Sá Miranda"},{"role":"Vice-presidente","name":"Adilson Kiala"},{"role":"Diretor Desportivo","name":"Beto Almeida"}]'::jsonb,
  palmares = '[{"title":"Liga Unitel Girabola","count":13,"seasons":["2018/19","2017/18","2016/17"]},{"title":"Taça de Angola","count":6},{"title":"Supertaça de Angola","count":10}]'::jsonb
where id = 'dago';

update public.ancaf_teams set
  palmares = '[{"title":"Liga Unitel Girabola","count":4,"seasons":["2015/16","2014/15","2012/13"]},{"title":"Taça de Angola","count":1},{"title":"Supertaça de Angola","count":2}]'::jsonb
where id = 'libolo';

update public.ancaf_teams set
  palmares = '[{"title":"Liga Unitel Girabola","count":2},{"title":"Taça de Angola","count":3},{"title":"Supertaça de Angola","count":1},{"title":"Gira Bola B (2.ª Divisão)","count":2}]'::jsonb
where id = 'primeiromaio';
