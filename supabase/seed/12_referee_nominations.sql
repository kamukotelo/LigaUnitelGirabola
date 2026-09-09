-- ═════════════════════════════════════════════════════════════════════
-- NOMEAÇÕES DE ARBITRAGEM PUBLICADAS
-- Gerado por scripts/generate-db-seed.ts — não editar à mão.
-- ═════════════════════════════════════════════════════════════════════

insert into public.ancaf_referee_nominations (season_id, round, match_id, referee, assistants, fourth_official) values
  ('2026-27', 1, 'm27-1-4', 'Miguel Tchissingu Augusto Américo', '["João Manuel Fula António","Nery Domingos Pereira Amador da Silva"]'::jsonb, 'Isaías Justino Camaxi'),
  ('2026-27', 1, 'm27-1-2', 'Sanda Mateus Miguel Kitu', '["Natarino António Soares","Nelson Lutumba Quiala"]'::jsonb, 'Custódio Roque Lote'),
  ('2026-27', 1, 'm27-1-3', 'Edilson Roberto Gomes André', '["Manuel Luís Benguela","Joaquim Manuel Chiyo"]'::jsonb, 'Miguel Julião Mateus'),
  ('2026-27', 1, 'm27-1-7', 'Nelson João Milagre', '["Manuel Daniel Coelho","Hélder João Milagre"]'::jsonb, 'Laurindo Feliciano Aureleo'),
  ('2026-27', 1, 'm27-1-1', 'Gilberto Bernardino Kativa', '["Estanislau Guedes Tavares Muluta Prata","Jeremias Sessenta Cafussa"]'::jsonb, 'Aldair Quissanga Rodrigues Carmelino'),
  ('2026-27', 1, 'm27-1-6', 'Bernardo Hossi Nangolo', '["António Emiliano Livongue","Adolfo Luís Mutenha"]'::jsonb, 'António Caluassi Dungula'),
  ('2026-27', 1, 'm27-1-8', 'Donaciano Mulumba', '["Alzandre Diógenes Muiamba Capola","Manuel Dulo Cabaça"]'::jsonb, 'Bernardo Kenge Mário'),
  ('2026-27', 1, 'm27-1-5', 'Sabino Garcez de Sousa de Carvalho', '["Evandro Henrique Freitas da Rocha","Flávio Luís Cadete Dias"]'::jsonb, 'Pedro Filomeno Jacinto Katchisosa'),
  ('2026-27', 2, 'm27-2-3', 'Sanda Mateus Miguel Kitu', '["Natarino António Soares","Nelson Lutumba Quiala"]'::jsonb, 'Regina Vita Ngola Catati Bernardo'),
  ('2026-27', 2, 'm27-2-7', 'Chitano Domingos Francisco', '["Wilson Valdmiro Ntyamba","Andália Bimbi Francisco Jeremias"]'::jsonb, 'Flamel Victorino Matos'),
  ('2026-27', 2, 'm27-2-1', 'Miguel Tchissingui Augusto Américo', '["Bernardo Kunjuca Lúcio Serafim","Floriano Cawala"]'::jsonb, 'Ana Kuvundu Pumba'),
  ('2026-27', 2, 'm27-2-5', 'Miguel Julião Mateus', '["Pedro Domingos de Andrade Micolo","Domingos Monteiro Francisco"]'::jsonb, 'Aldair Quissanga Rodrigues Carmelino'),
  ('2026-27', 2, 'm27-2-4', 'Paulo Sérgio Moreira', '["Lídio Chicomo Cuimbra","Segunda Chisseque Francisco"]'::jsonb, 'Donaciano Mulumba'),
  ('2026-27', 2, 'm27-2-2', 'Edilson Roberto Gomes André', '["Manuel Luís Benguela","Joaquim Manuel Chiyo"]'::jsonb, 'Sabino Garcez de Sousa de Carvalho'),
  ('2026-27', 2, 'm27-2-8', 'Gilberto Kativa', '["Jeremias Cafussa","Pedro Alberto"]'::jsonb, 'Pedro Katchisosa'),
  ('2026-27', 2, 'm27-2-6', 'António Caluassi Dungula', '["Zacarias Chivanja Calembe","Victorino Nangolo Dungula"]'::jsonb, 'Jacinto Isidro Lucas'),
  ('2026-27', 3, 'm27-3-7', 'Bernardo Mário', '["João António","António Miguel"]'::jsonb, 'Sabino De Carvalho'),
  ('2026-27', 3, 'm27-3-2', 'Chitano Domingos Francisco', '["Wilson Valdmiro Ntyamba","Andália Bimbi Francisco Jeremias"]'::jsonb, 'José Álvaro Clemente Chitumba'),
  ('2026-27', 3, 'm27-3-6', 'Edson António Esoko', '["Jerson Emiliano dos Santos","Estanislau Guedes Tavares Muluta Prata"]'::jsonb, 'Sanda Mateus Miguel Kitu'),
  ('2026-27', 3, 'm27-3-1', 'Aldair Quissanga Rodrigues Carmelino', '["Nery Domingos Pereira Amador da Silva","Januário Simões Francisco"]'::jsonb, 'Fábio Ricardo dos Santos Macano'),
  ('2026-27', 3, 'm27-3-4', 'Edilson Roberto Gomes André', '["Evanildo Gaspar dos Santos Martins","Pedro Domingos de Andrade Micolo"]'::jsonb, 'Nelson Agostinho da Silva'),
  ('2026-27', 3, 'm27-3-8', 'Edson António Esoko', '["Estanislau Guedes Tavares Muluta Prata","João Manuel Fula António"]'::jsonb, 'Nelson Joaquim Camunga'),
  ('2026-27', 3, 'm27-3-5', 'Sabino Garcez de Sousa de Carvalho', '["Evandro Henrique Freitas da Rocha","Flávio Luís Cadete Dias"]'::jsonb, 'João Chipombe'),
  ('2026-27', 4, 'm27-4-5', 'António Dungula', '["Victorino Dungula","Zacarias Calembe"]'::jsonb, 'Aldair Carmelino')
on conflict (match_id) do update set season_id = excluded.season_id, round = excluded.round, referee = excluded.referee, assistants = excluded.assistants, fourth_official = excluded.fourth_official;
