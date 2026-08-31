-- ═════════════════════════════════════════════════════════════════════
-- ÉPOCAS
-- Gerado por scripts/generate-db-seed.ts — não editar à mão.
-- ═════════════════════════════════════════════════════════════════════

insert into public.ancaf_seasons (id, label, status) values
  ('2026-27', '2026/2027', 'active'),
  ('2025-26', '2025/2026', 'completed'),
  ('2024-25', '2024/2025', 'completed'),
  ('2023-24', '2023/2024', 'completed'),
  ('2022-23', '2022/2023', 'completed')
on conflict (id) do update set label = excluded.label, status = excluded.status;
