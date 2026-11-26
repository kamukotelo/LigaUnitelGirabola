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
    select id, category, subject, message, filename, created_at::text
      from public.ancaf_club_submissions where team_id = ${session.team_id}
      order by created_at desc, id desc limit 20
  ` as { id: string; category: ClubCategory; subject: string; message: string; filename: string | null; created_at: string }[] : [];

  return (
    <div className="page-shell">
      <section className={session ? "mx-auto max-w-5xl" : "mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 md:grid-cols-2"}>

        {session ? (
          <>
            <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-zinc-950 px-5 py-6 text-white sm:px-8">
              <div className="flex items-center gap-3">
                <TeamCrest teamId={session.team_id} size={52} />
                <div><p className="text-xs text-zinc-300">Área de Clubes</p><h1 className="font-display text-2xl font-bold">{team?.name ?? session.username}</h1></div>
              </div>
              <form action="/api/club-portal" method="post">
                <button type="submit" name="action" value="logout" className="rounded-xl border border-zinc-300 px-4 py-2 dark:border-zinc-700">
                  Terminar sessão
                </button>
              </form>
            </header>
            {team && <Link href={`/teams/${team.id}`} className="mt-4 inline-block text-sm font-semibold underline">Ficha pública do clube</Link>}
            <ClubSubmissionForm />
            <section className="mt-8 border-t border-zinc-200 pt-5 dark:border-zinc-800">
              <h2 className="mb-3 text-xl font-semibold">Últimos envios do clube</h2>
              {submissions.length === 0 ? <p className="text-sm">Ainda não há envios registados.</p> : (
                <ul className="grid gap-3">
                  {submissions.map((item) => <li key={item.id} className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-800">
                    <details>
                      <summary className="cursor-pointer break-words">
                        <span className="font-semibold">{item.subject}</span> · {CLUB_CATEGORIES[item.category]}
                      </summary>
                      <p className="mt-2 text-xs text-zinc-500">
                        {new Date(item.created_at).toLocaleString('pt-AO', { timeZone: 'Africa/Luanda' })}
                      </p>
                      {item.message && <p className="mt-2 whitespace-pre-wrap break-words">{item.message}</p>}
                      {item.filename && <a href={`/api/club-portal?anexo=${item.id}`} className="mt-2 inline-block break-all underline">Descarregar {item.filename}</a>}
                      <p className="mt-2 break-all text-xs text-zinc-500">Referência {item.id}</p>
                    </details>
                  </li>)}
                </ul>
              )}
            </section>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-end bg-zinc-950 p-7 text-white sm:p-10">
              <p className="mb-3 text-sm font-semibold text-zinc-300">Liga Unitel Girabola</p>
              <h1 className="font-display text-4xl font-bold">Área de Clubes</h1>
              <p className="mt-4 max-w-xs text-sm text-zinc-300">Envie documentos à ANCAF e acompanhe os pedidos do seu clube.</p>
            </div>
            <div className="p-7 sm:p-10">
              <h2 className="mb-5 text-lg font-semibold">Iniciar sessão</h2>
              <ClubAccessForm />
              <Link href="/login" className="mt-6 inline-block text-sm underline">Acesso administrativo ANCAF</Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
