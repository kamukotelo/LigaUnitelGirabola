-- ═══════════════════════════════════════════════════════════════════════
-- ANCAF · ARMAZENAMENTO DE LOGÓTIPOS DE CLUBE (storage)
-- Liga Unitel Girabola — plataforma digital
--
-- Cria o bucket público `team-logos`, onde a consola de administração guarda
-- os emblemas trocados pelo gestor. A coluna `ancaf_teams.logo_url` (já criada
-- em 20260701000000_ancaf_init.sql) passa a apontar para estes ficheiros ou
-- para um URL externo.
--
-- Idempotente: pode ser executado várias vezes.
--
-- Como usar:
--   • Supabase → SQL Editor → colar este ficheiro → Run
--   • ou (CLI):  supabase db push
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Bucket público para os logótipos dos clubes.
insert into storage.buckets (id, name, public)
values ('team-logos', 'team-logos', true)
on conflict (id) do update set public = true;

-- 2. Políticas de acesso ao bucket.
--    Leitura pública (o site é público); escrita reservada ao service_role
--    (usado pela rota de API do servidor /api/teams/logo). A anon key não
--    escreve — a segurança fica na API (validação da credencial de gestão).
drop policy if exists "team-logos public read"    on storage.objects;
drop policy if exists "team-logos service write"   on storage.objects;
drop policy if exists "team-logos service update"  on storage.objects;
drop policy if exists "team-logos service delete"  on storage.objects;

create policy "team-logos public read"
  on storage.objects for select
  using (bucket_id = 'team-logos');

create policy "team-logos service write"
  on storage.objects for insert to service_role
  with check (bucket_id = 'team-logos');

create policy "team-logos service update"
  on storage.objects for update to service_role
  using (bucket_id = 'team-logos') with check (bucket_id = 'team-logos');

create policy "team-logos service delete"
  on storage.objects for delete to service_role
  using (bucket_id = 'team-logos');

-- 3. Realtime: reflete imediatamente nas páginas abertas a troca de um emblema
--    (a coluna logo_url vive em ancaf_teams).
alter table public.ancaf_teams replica identity full;
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'ancaf_teams'
     ) then
    alter publication supabase_realtime add table public.ancaf_teams;
  end if;
end
$$;

-- FIM — armazenamento de logótipos pronto.
