import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ADMIN_COOKIE, getAdminSession } from '@/lib/admin-auth';
import { CLUB_CATEGORIES, type ClubCategory } from '@/lib/club-submissions';
import { getNeonSql } from '@/lib/neon';

export const metadata: Metadata = {
  title: 'Envios dos clubes · ANCAF',
  robots: { index: false, follow: false },
};

const pageSize = 30;

export default async function ClubInbox({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  const admin = getAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
  if (admin?.profile !== 'admin' || admin.mustChangePassword) notFound();

  const { pagina } = await searchParams;
  const page = Math.max(1, Math.min(100000, Math.trunc(Number(pagina)) || 1));
  const submissions = await getNeonSql()`
    select entry.id, entry.username, entry.category, entry.subject, entry.message, entry.filename,
      entry.created_at::text, team.name as team_name
    from public.ancaf_club_submissions entry
    join public.ancaf_teams team on team.id = entry.team_id
    order by entry.created_at desc, entry.id desc limit ${pageSize + 1} offset ${(page - 1) * pageSize}
  ` as { id: string; username: string; category: ClubCategory; subject: string; message: string; filename: string | null; created_at: string; team_name: string }[];

  return (
    <div className="page-shell space-y-5">
      <Link href="/adminancaf2026" className="text-sm underline">Voltar à consola ANCAF</Link>
      <h1 className="font-display text-3xl font-bold">Envios dos clubes</h1>
      {submissions.length === 0 && <p>Sem envios nesta página.</p>}
      <ul className="grid gap-4">
        {submissions.slice(0, pageSize).map((item) => (
          <li key={item.id} className="space-y-2 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm">{item.team_name} ({item.username}) · {CLUB_CATEGORIES[item.category]}</p>
            <h2 className="break-words text-lg font-semibold">{item.subject}</h2>
            {item.message && <p className="whitespace-pre-wrap break-words text-sm">{item.message}</p>}
            {item.filename && <a href={`/api/club-portal?anexo=${item.id}`} className="break-all text-sm underline">Descarregar {item.filename}</a>}
            <p className="text-xs text-zinc-500">{new Date(item.created_at).toLocaleString('pt-AO', { timeZone: 'Africa/Luanda' })} · {item.id}</p>
          </li>
        ))}
      </ul>
      <nav aria-label="Páginas dos envios" className="flex gap-4">
        {page > 1 && <Link href={`?pagina=${page - 1}`} className="underline">Anterior</Link>}
        {submissions.length > pageSize && <Link href={`?pagina=${page + 1}`} className="underline">Seguinte</Link>}
      </nav>
    </div>
  );
}
