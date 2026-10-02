'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  Scale,
  ShieldCheck,
  Search,
  X,
  Download,
  Building2,
} from 'lucide-react';
import type { NewsArticle } from '@/lib/data';
import { isFafCommunication } from '@/lib/data';
import EmptyState from '@/components/ui/EmptyState';

type TabKey = 'todos' | 'ancaf' | 'faf';

interface ComunicadosClientProps {
  communications: NewsArticle[];
}

export default function ComunicadosClient({ communications }: ComunicadosClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get('tab') || searchParams.get('origem');
  const initialTab: TabKey = tabParam === 'faf' ? 'faf' : tabParam === 'ancaf' ? 'ancaf' : 'todos';

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  // Sincroniza a aba se o parâmetro na URL for alterado
  useEffect(() => {
    if (tabParam === 'faf') setActiveTab('faf');
    else if (tabParam === 'ancaf') setActiveTab('ancaf');
    else if (tabParam === 'todos') setActiveTab('todos');
  }, [tabParam]);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    const params = new URLSearchParams(window.location.search);
    if (key === 'todos') {
      params.delete('tab');
      params.delete('origem');
    } else {
      params.set('tab', key);
    }
    const newQuery = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/comunicados${newQuery}`, { scroll: false });
  };

  const fafCount = useMemo(() => communications.filter(isFafCommunication).length, [communications]);
  const ancafCount = useMemo(() => communications.filter((a) => !isFafCommunication(a)).length, [communications]);

  const filteredCommunications = useMemo(() => {
    return communications.filter((article) => {
      const isFaf = isFafCommunication(article);
      if (activeTab === 'faf' && !isFaf) return false;
      if (activeTab === 'ancaf' && isFaf) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = article.title.toLowerCase().includes(query);
        const matchSummary = article.summary.toLowerCase().includes(query);
        const matchAuthor = article.author?.toLowerCase().includes(query);
        const matchCategory = article.category.toLowerCase().includes(query);
        return matchTitle || matchSummary || matchAuthor || matchCategory;
      }

      return true;
    });
  }, [communications, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Barra de navegação por Abas e Pesquisa */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTabChange('todos')}
            className={`flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'todos'
                ? 'bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-950'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-foreground dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`}
          >
            <span>Todos</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] dark:bg-black/20">
              {communications.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('ancaf')}
            className={`flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
              activeTab === 'ancaf'
                ? 'bg-[#E85D1A] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-foreground dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`}
          >
            <Building2 size={14} />
            <span>ANCAF / Liga</span>
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px]">
              {ancafCount}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('faf')}
            className={`flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
              activeTab === 'faf'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-blue-50 text-blue-800 border-blue-200/80 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/50 dark:hover:bg-blue-900/40'
            }`}
          >
            <Scale size={14} />
            <span>Comunicados Oficiais da FAF</span>
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px]">
              {fafCount}
            </span>
          </button>
        </div>

        {/* Campo de pesquisa */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar comunicados…"
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-8 text-xs text-foreground placeholder-zinc-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent dark:border-zinc-800 dark:bg-zinc-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground"
              aria-label="Limpar pesquisa"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Banner explicativo quando na aba FAF / Conselho de Disciplina */}
      {activeTab === 'faf' && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Scale size={20} />
              </span>
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-400">
                  Federação Angolana de Futebol · Conselho de Disciplina
                </p>
                <h3 className="font-display text-base font-black uppercase text-foreground">
                  Advertência · Repreensão · Suspensão
                </h3>
                <p className="mt-1 max-w-3xl text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Publicação oficial das deliberações disciplinares, suspensões preventivas e mapas de sanções
                  emanados pelo Conselho de Disciplina da FAF relativos às jornadas da Liga Unitel Girabola.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-blue-600/10 px-3 py-1 font-mono text-[10px] font-bold text-blue-700 dark:text-blue-300">
              <ShieldCheck size={13} /> Órgão Jurisdicional
            </span>
          </div>
        </div>
      )}

      {/* Grelha de Comunicados */}
      {filteredCommunications.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCommunications.map((article) => {
            const isFaf = isFafCommunication(article);
            return (
              <article
                key={article.id}
                className={`flex min-h-64 flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all dark:bg-zinc-950 ${
                  isFaf
                    ? 'border-blue-200 hover:border-blue-300 dark:border-blue-900/40 dark:hover:border-blue-800'
                    : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                }`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  {isFaf ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 font-mono text-[9px] font-black uppercase tracking-wide text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                      <Scale size={11} aria-hidden="true" /> FAF · Conselho de Disciplina
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E85D1A]/10 px-3 py-1 font-mono text-[9px] font-black uppercase tracking-wide text-[#B9430C] dark:text-[#F6A06D] border border-orange-200/80 dark:border-orange-950">
                      <FileText size={11} aria-hidden="true" /> ANCAF · DCE
                    </span>
                  )}
                  <time className="font-mono text-[10px] text-zinc-500">{article.date}</time>
                </div>

                <h2 className="font-display text-lg font-black uppercase leading-tight text-foreground hover:text-accent transition-colors">
                  <Link href={`/news/${article.id}`}>{article.title}</Link>
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {article.summary}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900">
                  <Link
                    href={`/news/${article.id}`}
                    className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase transition-colors ${
                      isFaf
                        ? 'text-blue-600 hover:text-blue-700 dark:text-blue-400'
                        : 'text-[#B9430C] hover:text-[#E85D1A] dark:text-[#F6A06D]'
                    }`}
                  >
                    Ler comunicado <ArrowRight size={11} />
                  </Link>

                  {article.documentUrl && (
                    <a
                      href={article.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-500 hover:text-foreground transition-colors"
                      title="Descarregar documento original"
                    >
                      <Download size={12} /> PDF
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={
            activeTab === 'faf'
              ? 'Nenhum comunicado da FAF encontrado'
              : activeTab === 'ancaf'
                ? 'Nenhum comunicado da ANCAF encontrado'
                : 'Nenhum comunicado encontrado'
          }
          description={
            searchQuery
              ? `Não foram encontrados comunicados para a pesquisa "${searchQuery}".`
              : activeTab === 'faf'
                ? 'As deliberações e comunicados oficiais do Conselho de Disciplina da FAF serão disponibilizados nesta secção.'
                : 'Os comunicados oficiais da Liga Unitel Girabola serão disponibilizados nesta área.'
          }
        />
      )}
    </div>
  );
}
