-- O Petro de Luanda conquistou a sua 10.ª Supertaça de Angola em 16/08/2026,
-- ao vencer o Wiliete de Benguela por 1-0 no Estádio Vicy António, no Uíge.
-- Fonte: https://rna.ao/rna.ao/2026/08/17/tricolores-conquistam-10a-vitoria-na-supertaca-de-angola/

update public.ancaf_teams
set palmares = '[
  {"title":"Liga Unitel Girabola","count":20,"seasons":["2025/26","2023/24","2022/23"]},
  {"title":"Taça de Angola","count":15},
  {"title":"Supertaça de Angola","count":10,"seasons":["2026/27","2025/26","2024/25","2023/24"]}
]'::jsonb
where id = 'petro';
