'use client';

import React from 'react';
import { getNewsArticleById } from '@/lib/data';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { isOfficialCommunication } from '@/lib/data';

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const article = getNewsArticleById(id);

  if (!article) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-display uppercase">Notícia não disponível</h1>
          <p className="mt-2 text-sm text-zinc-500">O conteúdo pode estar a carregar, em validação ou ter sido retirado.</p>
          <Link href="/news" className="inline-flex mt-6 text-primary hover:text-accent">Voltar às notícias</Link>
        </div>
      </main>
    );
  }

  const isOfficial = isOfficialCommunication(article);

  return (
    <main className="py-12 min-h-screen bg-background dark:bg-black text-foreground relative z-10">
      <div className="cyber-grid-bg absolute inset-0 opacity-20 pointer-events-none z-0" />
      <div className="scanline-overlay" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <Link 
          href={isOfficial ? '/comunicados' : '/news'}
          className="inline-flex items-center gap-2 text-sm font-mono uppercase text-zinc-500 hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft size={16} /> {isOfficial ? 'Voltar aos Comunicados Oficiais' : 'Voltar às Notícias'}
        </Link>

        <AnimatedCard variant="holographic" className="mb-8">
          <header className="mb-8">
            <span className="text-[10px] font-mono uppercase bg-accent text-white px-2 py-0.5 rounded font-bold tracking-wider inline-block mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-display uppercase leading-tight text-foreground mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-zinc-500 font-mono">
              <Calendar size={14} />
              <time>{article.date}</time>
              {article.author && <span>· Por {article.author}</span>}
            </div>
            {article.aiAssisted && (
              <p className="mt-3 text-xs text-zinc-500 font-mono">Texto produzido com assistência de IA e submetido a validação editorial humana.</p>
            )}
          </header>

          <div className="prose prose-zinc dark:prose-invert max-w-none font-mono">
            <p className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium mb-8">
              {article.summary}
            </p>
            {article.content ? (
              <div className="space-y-6 text-zinc-600 dark:text-zinc-400 leading-loose">
                {article.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                <p className="text-zinc-500 uppercase tracking-widest text-sm">
                  Conteúdo detalhado indisponível.
                </p>
              </div>
            )}
            {article.documentImages && article.documentImages.length > 0 && (
              <section className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800" aria-labelledby="official-document-pages">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#B9430C] dark:text-[#F6A06D]">Documento original</p>
                    <h2 id="official-document-pages" className="mt-1 font-display text-xl font-black uppercase text-foreground">Páginas do comunicado</h2>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500">{article.documentImages.length} páginas</span>
                </div>
                <div className="space-y-6">
                  {article.documentImages.map((src, index) => (
                    <figure key={src} className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                      <Image
                        src={src}
                        alt={`Página ${index + 1} do ${article.title}`}
                        width={1080}
                        height={1350}
                        sizes="(max-width: 896px) 100vw, 896px"
                        className="h-auto w-full"
                      />
                      <figcaption className="border-t border-zinc-200 px-4 py-2 text-center font-mono text-[9px] uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                        Página {index + 1} de {article.documentImages?.length}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}
            {(article.sourceName || article.sourceUrl) && (
              <aside className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-5 text-sm text-zinc-500 font-mono">
                <span className="font-semibold text-foreground">Fonte verificada: </span>
                {article.sourceUrl ? (
                  <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-primary hover:text-accent underline underline-offset-4">
                    {article.sourceName || article.sourceUrl}
                  </a>
                ) : article.sourceName}
              </aside>
            )}
          </div>
        </AnimatedCard>
      </div>
    </main>
  );
}
