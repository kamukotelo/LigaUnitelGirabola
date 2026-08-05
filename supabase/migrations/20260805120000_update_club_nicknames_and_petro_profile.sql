-- Atualizações editoriais dos clubes e perfil institucional do Petro.
-- Aplicadas sem condição para corrigir também registos já semeados.

update public.ancaf_teams set nickname = 'Gorilas do Norte' where id = 'cabinda';
update public.ancaf_teams set nickname = 'Planquinos'       where id = 'kabuscorp';
update public.ancaf_teams set nickname = 'Tchianda'         where id = 'lundasul';

update public.ancaf_teams
set
  kits = '[{"label":"Principal","colors":["#F9C304","#F9C304"]},{"label":"Secundário","colors":["#000000","#000000"]}]'::jsonb,
  palmares = '[{"title":"Liga Unitel Girabola","count":20,"seasons":["2025/26","2023/24","2022/23"]},{"title":"Taça de Angola","count":15},{"title":"Supertaça de Angola","count":9}]'::jsonb
where id = 'petro';
