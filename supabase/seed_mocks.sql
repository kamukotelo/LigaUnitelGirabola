-- Seed mock data for Girabola 2025/2026
-- Compatible with migrations/20260613000000_init.sql

-- Insert default competition
INSERT INTO public.competitions (id, name, type, logo_url, season)
VALUES 
  ('a85e4da0-99aa-4034-933e-e3cfbf18b3cb', 'Liga Girabola', 'Nacional', '/logo-girabola.png', '2025/26')
ON CONFLICT (id) DO NOTHING;

-- Insert default players (Top Scorers & Assists)
INSERT INTO public.players (id, name, position, club, photo_url, stats_json)
VALUES
  ('c51486ee-7788-410a-8bf8-028f32c3f81e', 'Dagó Tshibamba', 'Avançado', '1.º de Agosto', '/players/dago-tshibamba.jpg', '{"goals": 18, "assists": 4, "appearances": 28}'),
  ('d51486ee-7788-410a-8bf8-028f32c3f81f', 'Tiago Azulão', 'Avançado', 'Petro de Luanda', '/players/tiago-azulao.jpg', '{"goals": 14, "assists": 3, "appearances": 24}'),
  ('e51486ee-7788-410a-8bf8-028f32c3f820', 'Mano Mano', 'Médio / Extremo', 'Wiliete de Benguela', '/players/mano-mano.jpg', '{"goals": 12, "assists": 8, "appearances": 27}'),
  ('e51486ee-7788-410a-8bf8-028f32c3f821', 'Jaredi', 'Extremo', 'Petro de Luanda', '/players/jaredi.jpg', '{"goals": 8, "assists": 11, "appearances": 26}'),
  ('e51486ee-7788-410a-8bf8-028f32c3f822', 'Kaporal', 'Avançado', 'Académica do Lobito', '/players/kaporal.jpg', '{"goals": 11, "assists": 1, "appearances": 25}')
ON CONFLICT (id) DO NOTHING;

-- Insert default matches (Jornada 29, 30 & future matches)
INSERT INTO public.matches (id, competition_id, home_team, away_team, score, date, status)
VALUES
  ('f51486ee-7788-410a-8bf8-028f32c3f821', 'a85e4da0-99aa-4034-933e-e3cfbf18b3cb', 'Petro de Luanda', 'Desportivo da Lunda Sul', '3-0', '2026-05-02 16:00:00+01', 'finished'),
  ('f51486ee-7788-410a-8bf8-028f32c3f822', 'a85e4da0-99aa-4034-933e-e3cfbf18b3cb', '1.º de Agosto', 'Kabuscorp', '2-0', '2026-05-02 15:30:00+01', 'finished'),
  ('f51486ee-7788-410a-8bf8-028f32c3f823', 'a85e4da0-99aa-4034-933e-e3cfbf18b3cb', 'Wiliete', 'Interclube', '2-1', '2026-05-03 16:00:00+01', 'finished'),
  ('f51486ee-7788-410a-8bf8-028f32c3f824', 'a85e4da0-99aa-4034-933e-e3cfbf18b3cb', 'Desportivo da Lunda Sul', '1.º de Agosto', '1-2', '2026-05-09 15:30:00+01', 'finished'),
  ('f51486ee-7788-410a-8bf8-028f32c3f825', 'a85e4da0-99aa-4034-933e-e3cfbf18b3cb', 'Kabuscorp', 'Petro de Luanda', '1-2', '2026-05-09 15:30:00+01', 'finished'),
  ('f51486ee-7788-410a-8bf8-028f32c3f826', 'a85e4da0-99aa-4034-933e-e3cfbf18b3cb', 'Petro de Luanda', 'Wiliete de Benguela', '0-0', '2026-07-25 16:00:00+01', 'scheduled')
ON CONFLICT (id) DO NOTHING;
