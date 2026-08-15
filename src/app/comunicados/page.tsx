import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { getOfficialCommunications } from '@/lib/data';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';

export default function OfficialCommunicationsPage() {
  const communications = getOfficialCommunications();

  return (
    <main className="relative z-10 min-h-screen bg-background text-foreground">
      <div className="page-shell relative z-10">
        <PageHeader
          eyebrow="Informação institucional"
          title="Comunicados Oficiais"
          description="Informações, deliberações e notas oficiais da Liga Unitel Girabola."
          breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Comunicados Oficiais' }]}
        />

        {communications.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {communications.map((article) => (
              <article key={article.id} className="flex min-h-64 flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#E85D1A]/10 px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-wide text-[#B9430C] dark:text-[#F6A06D]">
                    <FileText size={12} aria-hidden="true" /> Comunicado Oficial
                  </span>
                  <time className="font-mono text-[9px] text-zinc-500">{article.date}</time>
                </div>
                <h2 className="font-display text-lg font-black uppercase leading-tight text-foreground">{article.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{article.summary}</p>
                <Link href={`/news/${article.id}`} className="mt-auto inline-flex items-center gap-1.5 pt-6 font-mono text-[10px] font-black uppercase text-[#B9430C] transition-colors hover:text-[#E85D1A] dark:text-[#F6A06D]">
                  Ler comunicado <ArrowRight size={11} />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="Ainda não existem comunicados publicados" description="Os comunicados oficiais da Liga Unitel Girabola serão disponibilizados nesta área." />
        )}
      </div>
    </main>
  );
}
