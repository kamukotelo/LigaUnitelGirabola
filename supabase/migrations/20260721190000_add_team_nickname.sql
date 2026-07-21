-- ═══════════════════════════════════════════════════════════════════════
-- ANCAF · APELIDO/ALCUNHA DA EQUIPA
-- Liga Unitel Girabola — plataforma digital
--
-- Adiciona a coluna `nickname` à tabela `ancaf_teams` para que cada clube
-- tenha o seu apelido/alcunha oficial (ex.: 'MAQUISARDES' para Bravos do Maquis).
-- Editável diretamente na consola de administração sem necessidade de alterar código.
--
-- Idempotente: pode ser executado várias vezes.
-- ═══════════════════════════════════════════════════════════════════════

alter table public.ancaf_teams add column if not exists nickname text;

-- Semear os apelidos para os clubes existentes na Liga Unitel Girabola 2026/2027.
-- Apenas atualiza quando o campo ainda é NULL (preserva edições do admin).
update public.ancaf_teams set nickname = 'Tricolores'    where id = 'petro'         and nickname is null;
update public.ancaf_teams set nickname = 'Wilietes'      where id = 'wiliete'       and nickname is null;
update public.ancaf_teams set nickname = 'Militares'     where id = 'dago'          and nickname is null;
update public.ancaf_teams set nickname = 'Huilanos'      where id = 'desphuila'     and nickname is null;
update public.ancaf_teams set nickname = 'MAQUISARDES'   where id = 'bravos'        and nickname is null;
update public.ancaf_teams set nickname = 'Palanquinas'   where id = 'kabuscorp'     and nickname is null;
update public.ancaf_teams set nickname = 'Lundas'        where id = 'sagrada'       and nickname is null;
update public.ancaf_teams set nickname = 'Polícias'      where id = 'interclube'    and nickname is null;
update public.ancaf_teams set nickname = 'Sudistas'      where id = 'lundasul'      and nickname is null;
update public.ancaf_teams set nickname = 'Libolenses'    where id = 'libolo'        and nickname is null;
update public.ancaf_teams set nickname = 'Estudantes'    where id = 'lobito'        and nickname is null;
update public.ancaf_teams set nickname = 'Kongos'        where id = 'saosalvador'   and nickname is null;
update public.ancaf_teams set nickname = 'Cabindenses'   where id = 'cabinda'       and nickname is null;
update public.ancaf_teams set nickname = 'Proletários'   where id = 'primeiromaio'  and nickname is null;
update public.ancaf_teams set nickname = 'Caalenses'     where id = 'caala'         and nickname is null;
update public.ancaf_teams set nickname = 'Luandenses'    where id = 'fcluanda'      and nickname is null;
