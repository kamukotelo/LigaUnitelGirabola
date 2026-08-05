'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getNewsArticles } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';
import Link from 'next/link';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';

export default function NewsPage() {
  const news = getNewsArticles();

  return (
    <main className="min-h-screen bg-background text-foreground relative z-10">
      <div className="page-shell relative z-10">
        <PageHeader eyebrow="Atualidade" title="Notícias" description="Informação oficial, entrevistas e destaques do campeonato nacional angolano." breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Notícias' }]} />

        {/* Notícias Grid */}
        {news.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, i) => (
            <AnimatedCard key={article.id} variant="holographic" delay={i * 0.1}>
              <span className="text-[9px] font-mono uppercase bg-accent text-white px-2 py-0.5 rounded font-bold tracking-wider">
                {article.category}
              </span>
              <p className="text-[10px] text-zinc-500 font-mono mt-3">{article.date}</p>
              <h3 className="text-xl font-display uppercase text-foreground mt-2 mb-3 line-clamp-2 leading-tight">
                {article.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6 font-mono leading-relaxed">
                {article.summary}
              </p>
              <Link href={`/news/${article.id}`} className="inline-flex items-center gap-1 text-xs font-mono uppercase text-primary hover:text-accent transition-colors cursor-pointer">
                Ler Artigo <ArrowRight size={12} />
              </Link>
            </AnimatedCard>
          ))}
        </div> : <EmptyState title="Ainda não existem notícias publicadas" description="Volte em breve para acompanhar as atualizações oficiais da Liga." />}
      </div>
    </main>
  );
}
