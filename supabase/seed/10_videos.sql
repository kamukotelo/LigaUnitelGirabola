-- ═════════════════════════════════════════════════════════════════════
-- VÍDEOS / DESTAQUES
-- Gerado por scripts/generate-db-seed.ts — não editar à mão.
-- ═════════════════════════════════════════════════════════════════════

insert into public.ancaf_videos (id, title, duration, views, category, thumbnail, video_url, is_live, sort) values
  ('sorteio-girabola-gala-2026', 'Sorteio Oficial do Calendário & 1.ª Gala de Premiação — Liga Unitel Girabola', 'Especial Gala', '24.8K visualizações', 'Gala Oficial', 'https://i.ytimg.com/vi/y2HGmRN0AIs/hqdefault.jpg', 'https://www.youtube.com/embed/y2HGmRN0AIs?autoplay=1', false, 0),
  ('gala-melhores-zap', 'Gala Girabola: Os Melhores do Futebol Angolano', '02:45', '16.2K visualizações', 'Gala Oficial', 'https://i.ytimg.com/vi/2ANl6JA2PVs/hqdefault.jpg', 'https://www.youtube.com/embed/2ANl6JA2PVs?autoplay=1', false, 1),
  ('live-1', 'Arquivo: Petro de Luanda vs 1.º de Agosto — Girabola 2025/26', 'Arquivo 2025/26', 'Transmissão arquivada', 'Arquivo', '/fields/hud-view.jpg', 'https://www.youtube.com/embed/59J6pB1Q1Fk?autoplay=1', false, 2),
  ('v1', 'Resumo: Kabuscorp vs Sagrada Esperança (2-0)', '08:24', '4.2K visualizações', 'Resumos', '/thumbs/resumo1.jpg', 'https://www.youtube.com/embed/p17iPqNlM1w?autoplay=1', false, 3),
  ('v2', 'Entrevista: Tiago Azulão analisa o hat-trick histórico', '05:12', '2.8K visualizações', 'Entrevistas', '/thumbs/entrevista1.jpg', 'https://www.youtube.com/embed/xSdtVv0m4eQ?autoplay=1', false, 4),
  ('v3', 'Melhores Momentos da 11ª Jornada - Golos do Mês', '12:40', '9.1K visualizações', 'Compilações', '/thumbs/golos.jpg', 'https://www.youtube.com/embed/a7Sg-x3gB6o?autoplay=1', false, 5)
on conflict (id) do update set title = excluded.title, duration = excluded.duration, views = excluded.views, category = excluded.category, thumbnail = excluded.thumbnail, video_url = excluded.video_url, is_live = excluded.is_live, sort = excluded.sort;
