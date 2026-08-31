-- ═════════════════════════════════════════════════════════════════════
-- CLASSIFICAÇÕES OFICIAIS
-- Gerado por scripts/generate-db-seed.ts — não editar à mão.
-- ═════════════════════════════════════════════════════════════════════

insert into public.ancaf_standings (season_id, team_id, position, played, won, drawn, lost, goals_for, goals_against, points, goals_verified, form_verified) values
  ('2025-26', 'petro', 1, 30, 22, 6, 2, 63, 15, 72, true, true),
  ('2025-26', 'wiliete', 2, 30, 18, 8, 4, 49, 29, 62, true, true),
  ('2025-26', 'dago', 3, 30, 15, 12, 3, 47, 22, 57, true, true),
  ('2025-26', 'desphuila', 4, 30, 12, 10, 8, 35, 26, 46, true, true),
  ('2025-26', 'kabuscorp', 5, 30, 10, 12, 8, 26, 22, 42, true, true),
  ('2025-26', 'bravos', 6, 30, 12, 6, 12, 33, 30, 42, true, true),
  ('2025-26', 'interclube', 7, 30, 9, 13, 8, 35, 28, 40, true, true),
  ('2025-26', 'lundasul', 8, 30, 9, 11, 10, 27, 29, 38, true, true),
  ('2025-26', 'primeiromaio', 9, 30, 10, 7, 13, 29, 33, 37, true, true),
  ('2025-26', 'sagrada', 10, 30, 8, 12, 10, 34, 40, 36, true, true),
  ('2025-26', 'saosalvador', 11, 30, 9, 8, 13, 27, 33, 35, true, true),
  ('2025-26', 'lobito', 12, 30, 8, 11, 11, 25, 30, 35, true, true),
  ('2025-26', 'libolo', 13, 30, 9, 7, 14, 26, 37, 34, true, true),
  ('2025-26', 'luanda-city', 14, 30, 9, 6, 15, 21, 45, 33, true, true),
  ('2025-26', 'redonda', 15, 30, 5, 6, 19, 15, 47, 21, true, true),
  ('2025-26', 'guelson', 16, 30, 6, 3, 21, 24, 50, 21, true, true)
on conflict (season_id,team_id) do update set position = excluded.position, played = excluded.played, won = excluded.won, drawn = excluded.drawn, lost = excluded.lost, goals_for = excluded.goals_for, goals_against = excluded.goals_against, points = excluded.points, goals_verified = excluded.goals_verified, form_verified = excluded.form_verified;
