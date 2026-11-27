import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ClubRequestDetails from '@/components/ClubRequestDetails';
import { ADMIN_COOKIE, getAdminSession, OFFICIAL_ADMIN_ACCOUNTS } from '@/lib/admin-auth';
import { CLUB_CATEGORIES, CLUB_STATUSES, type ClubRequest } from '@/lib/club-submissions';
import { getNeonSql } from '@/lib/neon';
import ClubReviewForm from './ClubReviewForm';

export const metadata: Metadata = {
  title: 'Envios dos clubes · ANCAF',
  robots: { index: false, follow: false },
};

const pageSize = 30;
type Query = { pagina?: string; clube?: string; categoria?: string; estado?: string; jornada?: string };

export default async function ClubInbox({ searchParams }: { searchParams: Promise<Query> }) {
  const admin = getAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
  if (admin?.profile !== 'admin' || admin.mustChangePassword) notFound();

  const { pagina, clube, categoria, estado, jornada } = await searchParams;
  const filters = {
    clube: typeof clube === 'string' && /^[a-z0-9-]{1,50}$/.test(clube) ? clube : '',
    categoria: typeof categoria === 'string' && Object.hasOwn(CLUB_CATEGORIES, categoria) ? categoria : '',
    estado: typeof estado === 'string' && Object.hasOwn(CLUB_STATUSES, estado) ? estado : '',
    jornada: typeof jornada === 'string' && /^[1-9][0-9]{0,2}$/.test(jornada) ? jornada : '',
  };
  const page = Math.max(1, Math.min(100000, Math.trunc(Number(pagina)) || 1));
  const sql = getNeonSql();
  const [submissions, teams] = await Promise.all([
    sql`
      select entry.id, entry.username, entry.category, entry.subject, entry.message, entry.filename,
        entry.created_at::text, entry.activity_at::text, entry.status, entry.details, entry.assigned_to, entry.revision,
        entry.updates, entry.files, team.name as team_name
      from public.ancaf_club_workflow entry
      join public.ancaf_teams team on team.id = entry.team_id
      where (${filters.clube}::text = '' or entry.team_id = ${filters.clube})
        and (${filters.categoria}::text = '' or entry.category = ${filters.categoria})
        and (${filters.estado}::text = '' or entry.status = ${filters.estado})
        and (${filters.jornada}::text = '' or entry.details->>'round' = ${filters.jornada})
      order by (entry.status = 'recebido') desc, entry.activity_at desc, entry.id desc
      limit ${pageSize + 1} offset ${(page - 1) * pageSize}
    `.then((rows) => rows as (ClubRequest & { username: string; team_name: string; activity_at: string })[]),
    sql`select id, name from public.ancaf_teams order by name`.then((rows) => rows as { id: string; name: string }[]),
  ]);
  const admins = Object.entries(OFFICIAL_ADMIN_ACCOUNTS).map(([email, account]) => ({ email, name: account.name }));
  const pageLink = (number: number) => `?${new URLSearchParams({ ...filters, pagina: String(number) })}`;
  const input = 'w-full rounded-lg border border-zinc-300 bg-background px-3 py-2 dark:border-zinc-700';

  return (
    <div className="page-shell space-y-5">
      <Link href="/adminancaf2026" className="text-sm underline">Voltar à consola ANCAF</Link>
      <h1 className="font-display text-3xl font-bold">Envios dos clubes</h1>
      <form method="get" className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <label className="text-sm">Clube<select name="clube" defaultValue={filters.clube} className={input}>
          <option value="">Todos</option>
          {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
        </select></label>
        <label className="text-sm">Categoria<select name="categoria" defaultValue={filters.categoria} className={input}>
          <option value="">Todas</option>
          {Object.entries(CLUB_CATEGORIES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select></label>
        <label className="text-sm">Estado<select name="estado" defaultValue={filters.estado} className={input}>
          <option value="">Todos</option>
          {Object.entries(CLUB_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select></label>
        <label className="text-sm">Jornada<input name="jornada" defaultValue={filters.jornada} inputMode="numeric" pattern="[1-9][0-9]{0,2}" className={input} /></label>
        <div className="flex items-center gap-3">
          <button type="submit" className="premium-button rounded-lg px-4 py-2">Filtrar</button>
          <Link href="/adminancaf2026/clubes" className="text-sm underline">Limpar</Link>
        </div>
      </form>
      {submissions.length === 0 && <p>Sem envios para estes filtros.</p>}
      <ul className="grid gap-4">
        {submissions.slice(0, pageSize).map((item) => (
          <li key={item.id} className={`space-y-2 rounded-xl border p-4 ${item.status === 'recebido' ? 'border-amber-500/50' : 'border-zinc-200 dark:border-zinc-800'}`}>
            <p className="text-sm">{item.team_name} ({item.username}) · {CLUB_CATEGORIES[item.category]}</p>
            <h2 className="break-words text-lg font-semibold">{item.subject}</h2>
            <p className="text-sm font-semibold">{CLUB_STATUSES[item.status]}{item.status === 'recebido' ? ' · Aguarda análise' : ''}</p>
            <ClubRequestDetails item={item} />
            <ClubReviewForm key={item.activity_at} id={item.id} activity={item.activity_at} status={item.status} assignee={item.assigned_to} admins={admins} />
          </li>
        ))}
      </ul>
      <nav aria-label="Páginas dos envios" className="flex gap-4">
        {page > 1 && <Link href={pageLink(page - 1)} className="underline">Anterior</Link>}
        {submissions.length > pageSize && <Link href={pageLink(page + 1)} className="underline">Seguinte</Link>}
      </nav>
    </div>
  );
}
