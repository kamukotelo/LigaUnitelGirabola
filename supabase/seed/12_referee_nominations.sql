-- ═════════════════════════════════════════════════════════════════════
-- NOMEAÇÕES DE ARBITRAGEM PUBLICADAS
-- Gerado por scripts/generate-db-seed.ts — não editar à mão.
-- ═════════════════════════════════════════════════════════════════════

insert into public.ancaf_referee_nominations (season_id, round, match_id, referee, assistants, fourth_official) values
  ('2026-27', 1, 'm27-1-4', 'Miguel Tchissingu Augusto Américo', '["João Manuel Fula António","Nery Domingos Pereira Amador da Silva"]'::jsonb, 'Isaías Justino Camaxi'),
  ('2026-27', 1, 'm27-1-2', 'Sanda Mateus Miguel Kitu', '["Natarino António Soares","Nelson Lutumba Quiala"]'::jsonb, 'Custódio Roque Lote'),
  ('2026-27', 1, 'm27-1-3', 'Edilson Roberto Gomes André', '["Manuel Luís Benguela","Joaquim Manuel Chiyo"]'::jsonb, 'Miguel Julião Mateus'),
  ('2026-27', 1, 'm27-1-7', 'Nelson João Milagre', '["Manuel Daniel Coelho","Hélder João Milagre"]'::jsonb, 'Laurindo Feliciano Aureleo'),
  ('2026-27', 2, 'm27-2-8', 'Gilberto Kativa', '["Jeremias Cafussa","Pedro Alberto"]'::jsonb, 'Pedro Katchisosa'),
  ('2026-27', 3, 'm27-3-7', 'Bernardo Mário', '["João António","António Miguel"]'::jsonb, 'Sabino De Carvalho'),
  ('2026-27', 3, 'm27-3-4', 'Edilson Roberto Gomes André', '["Evanildo Gaspar dos Santos Martins","Pedro Domingos de Andrade Micolo"]'::jsonb, 'Nelson Agostinho da Silva')
on conflict (match_id) do update set season_id = excluded.season_id, round = excluded.round, referee = excluded.referee, assistants = excluded.assistants, fourth_official = excluded.fourth_official;
