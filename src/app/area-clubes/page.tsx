import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import ClubRequestDetails from '@/components/ClubRequestDetails';
import TeamCrest from '@/components/ui/TeamCrest';
import { CLUB_PORTAL_COOKIE, getClubPortalSession } from '@/lib/club-auth';
import { CLUB_CATEGORIES, CLUB_STATUSES, type ClubRequest, type ClubStatus } from '@/lib/club-submissions';
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
  const [submissions, counts] = session ? await Promise.all([
    getNeonSql()`
      select id, category, subject, message, filename, created_at::text, status, details, assigned_to, revision, updates, files
      from public.ancaf_club_workflow where team_id = ${session.team_id}
      order by (status = 'corrigir') desc, activity_at desc, id desc limit 30
    `.then((rows) => rows as ClubRequest[]),
    getNeonSql()`
      select status, count(*)::integer as total
      from public.ancaf_club_submissions where team_id = ${session.team_id} group by status
    `.then((rows) => rows as { status: ClubStatus; total: number }[]),
  ]) : [[], []];

  const recentReplies = submissions.flatMap((item) =>
    item.updates.filter((update) => update.author === 'ancaf' && update.message)
      .map((update) => ({ ...update, requestId: item.id, subject: item.subject })),
  ).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 3);

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
            <nav aria-label="Acções do clube" className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <a href="#novo-envio" className="underline">Novo envio</a>
              <a href="#historico" className="underline">Histórico e respostas</a>
              {team && <Link href={`/teams/${team.id}`} className="underline">Ficha pública do clube</Link>}
            </nav>
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries(CLUB_STATUSES).map(([status, label]) => (
                <div key={status} className={`rounded-xl border p-3 ${status === 'corrigir' ? 'border-amber-500/50' : 'border-zinc-200 dark:border-zinc-800'}`}>
                  <dt className="text-sm">{label}</dt>
                  <dd className="text-2xl font-semibold">{counts.find((entry) => entry.status === status)?.total ?? 0}</dd>
                </div>
              ))}
            </dl>
            {recentReplies.length > 0 && (
              <section className="mt-6 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <h2 className="mb-2 text-lg font-semibold">Respostas recentes da ANCAF</h2>
                <ul className="grid gap-2 text-sm">
                  {recentReplies.map((reply) => <li key={reply.id}>
                    <a href={`#pedido-${reply.requestId}`} className="font-semibold underline">{reply.subject}</a>
                    <p className="line-clamp-2 break-words">{reply.message}</p>
                  </li>)}
                </ul>
              </section>
            )}
            <ClubSubmissionForm />
            <section id="historico" className="mt-8 border-t border-zinc-200 pt-5 dark:border-zinc-800">
              <h2 className="mb-3 text-xl font-semibold">Histórico e respostas da ANCAF</h2>
              {submissions.length === 0 ? <p className="text-sm">Ainda não há envios registados.</p> : (
                <ul className="grid gap-3">
                  {submissions.map((item) => <li id={`pedido-${item.id}`} key={item.id} className="scroll-mt-24 rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-800">
                    <details open={item.status === 'corrigir' || undefined}>
                      <summary className="cursor-pointer break-words">
                        <span className="font-semibold">{item.subject}</span> · {CLUB_CATEGORIES[item.category]} · {CLUB_STATUSES[item.status]}
                      </summary>
                      <ClubRequestDetails item={item} />
                      {item.status === 'corrigir' && <ClubSubmissionForm correctionId={item.id} />}
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
