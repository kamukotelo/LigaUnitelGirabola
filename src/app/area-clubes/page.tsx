import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import TeamCrest from '@/components/ui/TeamCrest';
import { CLUB_PORTAL_COOKIE, getClubPortalSession } from '@/lib/club-auth';
import { CLUB_CATEGORIES, type ClubCategory } from '@/lib/club-submissions';
import { getTeamById } from '@/lib/data';
import { getNeonSql } from '@/lib/neon';
import ClubAccessForm from './ClubAccessForm';
import ClubSubmissionForm from './ClubSubmissionForm';

export const metadata: Metadata = {
  title: 'Área de Clubes',
  robots: { index: false, follow: false },
};

export default async function ClubAreaPage() {
  const token = (await cookies()).get(CLUB_PORTAL_COOKIE)?.value;
  const session = await getClubPortalSession(token);
  const team = session ? getTeamById(session.team_id) : undefined;
  const submissions = session ? await getNeonSql()`
    select id, category, subject
      from public.ancaf_club_submissions where team_id = ${session.team_id}
      order by created_at desc, id desc limit 20
  ` as { id: string; category: ClubCategory; subject: string }[] : [];

  return (
    <div className="page-shell">
      <section className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-background p-5 sm:p-8 dark:border-zinc-800">
        <h1 className="mb-5 font-display text-3xl font-bold">Área de Clubes</h1>
        {session ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <TeamCrest teamId={session.team_id} size={52} />
                <h2 className="text-xl font-semibold">{team?.name ?? session.username}</h2>
              </div>
              <form action="/api/club-portal" method="post">
                <button type="submit" name="action" value="logout" className="rounded-xl border border-zinc-300 px-4 py-2 dark:border-zinc-700">
                  Terminar sessão
                </button>
              </form>
            </div>
            <ClubSubmissionForm />
            <section className="mt-8 border-t border-zinc-200 pt-5 dark:border-zinc-800">
              <h2 className="mb-3 text-xl font-semibold">Últimos envios do clube</h2>
              {submissions.length === 0 ? <p className="text-sm">Ainda não há envios registados.</p> : (
                <ul className="grid gap-3">
                  {submissions.map((item) => <li key={item.id} className="break-words text-sm">
                    <span className="font-semibold">{item.subject}</span> · {CLUB_CATEGORIES[item.category]}
                    <span className="block break-all text-xs text-zinc-500">{item.id}</span>
                  </li>)}
                </ul>
              )}
            </section>
          </>
        ) : (
          <div className="max-w-md">
            <ClubAccessForm />
            <Link href="/login" className="mt-6 inline-block text-sm underline">Acesso administrativo ANCAF</Link>
          </div>
        )}
      </section>
    </div>
  );
}
