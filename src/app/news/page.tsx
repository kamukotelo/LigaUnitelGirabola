'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getNewsArticles } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';

export default function NewsPage() {
  const news = getNewsArticles();

  return (
    <main className="py-12 min-h-screen bg-background dark:bg-black text-foreground relative z-10">
      <div className="cyber-grid-bg absolute inset-0 opacity-20 pointer-events-none z-0" />
      <div className="scanline-overlay" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-accent tracking-widest font-semibold">
              MÉDIA CENTER · GIRABOLA
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display uppercase leading-none text-foreground">
            Notícias
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-mono text-sm tracking-widest mt-2 uppercase">
            O ritmo diário do campeonato nacional angolano
          </p>
        </header>

        {/* Notícias Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              {/* Note: since there is no news article subpage implemented, we can link it back or keep it dynamic, let's keep it simple */}
              <span className="inline-flex items-center gap-1 text-xs font-mono uppercase text-primary hover:text-accent transition-colors cursor-pointer">
                Ler Artigo <ArrowRight size={12} />
              </span>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </main>
  );
}
