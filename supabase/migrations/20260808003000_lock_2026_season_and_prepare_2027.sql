-- A época 2026/2027 já foi publicada. Mantém o calendário ativo intacto,
-- regista o bloqueio de reenvio e prepara a época seguinte para receção futura.

insert into public.ancaf_seasons (id, label, status)
values ('2027-28', '2027/2028', 'upcoming')
on conflict (id) do update set label = excluded.label, status = excluded.status;

insert into public.ancaf_configs (key, value)
values ('calendar_2026-27_locked', 'true')
on conflict (key) do update set value = excluded.value, updated_at = timezone('utc', now());
