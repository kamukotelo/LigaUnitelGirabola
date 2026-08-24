-- Restringe a leitura anónima às configurações que alimentam o portal público.
-- Estados operacionais (por exemplo automation_match_update_status), endereços
-- editoriais e futuras configurações privadas ficam acessíveis só ao backend.

drop policy if exists "ancaf public read configs" on public.ancaf_configs;
create policy "ancaf public read configs"
  on public.ancaf_configs for select to anon, authenticated
  using (
    key like 'active_calendar_%'
    or key like 'override_%'
    or key in ('logo_vertical', 'logo_horizontal', 'logo_horizontal_white', 'logo_ancaf')
  );

drop policy if exists "ancaf public read configs" on public.liga_configs;
create policy "ancaf public read configs"
  on public.liga_configs for select to anon, authenticated
  using (
    key like 'active_calendar_%'
    or key like 'override_%'
    or key in ('logo_vertical', 'logo_horizontal', 'logo_horizontal_white', 'logo_ancaf')
  );
