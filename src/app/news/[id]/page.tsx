import React from 'react';
import { getNewsArticleById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const article = getNewsArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <main className="py-12 min-h-screen bg-background dark:bg-black text-foreground relative z-10">
      <div className="cyber-grid-bg absolute inset-0 opacity-20 pointer-events-none z-0" />
      <div className="scanline-overlay" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <Link 
          href="/news" 
          className="inline-flex items-center gap-2 text-sm font-mono uppercase text-zinc-500 hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Voltar às Notícias
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
            </div>
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
          </div>
        </AnimatedCard>
      </div>
    </main>
  );
}
