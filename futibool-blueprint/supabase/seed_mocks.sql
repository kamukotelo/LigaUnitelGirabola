-- Seed mock data for Futibool database tables

-- Insert default competition
INSERT INTO public.competitions (id, name, type, logo_url, season)
VALUES 
  ('a85e4da0-99aa-4034-933e-e3cfbf18b3cb', 'Liga Girabola', 'Nacional', '/logo-girabola.png', '2025/26')
ON CONFLICT (id) DO NOTHING;

-- Insert default players
INSERT INTO public.players (id, name, position, club, photo_url, birth_date, stats_json)
VALUES
  ('c51486ee-7788-410a-8bf8-028f32c3f81e', 'Marta Luanda', 'Avançado', 'Petro de Luanda', '/players/marta-luanda.jpg', '2001-04-12', '{"goals": 14, "assists": 6, "appearances": 12}'),
  ('d51486ee-7788-410a-8bf8-028f32c3f81f', 'Cristina Huambo', 'Médio', 'Primeiro de Agosto', '/players/cristina-huambo.jpg', '2000-08-19', '{"goals": 5, "assists": 11, "appearances": 12}'),
  ('e51486ee-7788-410a-8bf8-028f32c3f820', 'Ana Benguela', 'Defesa', 'Sagrada Esperança', '/players/ana-benguela.jpg', '2002-11-03', '{"goals": 1, "assists": 2, "appearances": 11}')
ON CONFLICT (id) DO NOTHING;

-- Insert default matches
INSERT INTO public.matches (id, competition_id, home_team, away_team, score, date, status)
VALUES
  ('f51486ee-7788-410a-8bf8-028f32c3f821', 'a85e4da0-99aa-4034-933e-e3cfbf18b3cb', 'Petro de Luanda', 'Sagrada Esperança', '3-1', '2026-06-10 16:00:00+01', 'finished'),
  ('f51486ee-7788-410a-8bf8-028f32c3f822', 'a85e4da0-99aa-4034-933e-e3cfbf18b3cb', 'Primeiro de Agosto', 'Kabuscorp', '2-0', '2026-06-11 15:30:00+01', 'finished'),
  ('f51486ee-7788-410a-8bf8-028f32c3f823', 'a85e4da0-99aa-4034-933e-e3cfbf18b3cb', 'Académica do Lobito', 'Interclube', '0-0', '2026-06-15 15:00:00+01', 'scheduled')
ON CONFLICT (id) DO NOTHING;
