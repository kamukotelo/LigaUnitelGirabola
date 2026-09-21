'use client';

import { useRouter } from 'next/navigation';
import { LayoutGrid, Trophy, CalendarDays, BarChart3, Timer, Flag, ArrowRightLeft } from 'lucide-react';
import { SEASONS } from '@/lib/data';
import PageHeader from '@/components/ui/PageHeader';
import { HUB_TABS, HubTab } from './tabs';
import MiniStandings from './MiniStandings';
import GeralTab from './GeralTab';
import ClassificacaoTab from './ClassificacaoTab';
import CalendarioTab from './CalendarioTab';
import EstatisticasTab from './EstatisticasTab';
import SeasonComparisonMatrix from './SeasonComparisonMatrix';
import TempoUtilTab from './TempoUtilTab';
import NomeacoesTab from './NomeacoesTab';

const TAB_ICONS: Record<HubTab, typeof Trophy> = {
  geral: LayoutGrid,
  classificacao: Trophy,
  calendario: CalendarDays,
  estatisticas: BarChart3,
  comparador: ArrowRightLeft,
  'tempo-util': Timer,
  nomeacoes: Flag,
};

export default function CompetitionHubClient({ seasonId, tab }: { seasonId: string; tab: HubTab }) {
  const router = useRouter();
  const selectedSeason = SEASONS.find((s) => s.id === seasonId);
  const seasonStatusLabel = selectedSeason?.status === 'completed'
    ? 'Concluída'
    : selectedSeason?.status === 'active'
      ? 'Em curso'
      : 'Por disputar';

  const goTo = (nextSeason: string, nextTab: HubTab) => {
    router.replace(`/competicao/${nextSeason}?tab=${nextTab}`, { scroll: false });
    window.setTimeout(() => window.dispatchEvent(new PopStateEvent('popstate')), 0);
  };

  return (
    <div className="page-shell relative z-10">
      {/* Cabeçalho do hub de competição */}
      <div className="mb-8">
        <PageHeader
          eyebrow="Competição oficial"
          title="Liga Unitel"
          highlight="Girabola"
          description={`Época ${selectedSeason?.label ?? seasonId} · ${seasonStatusLabel} · Campeonato Nacional de Futebol de Angola`}
          breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Competição' }]}
        />

        {/* Seletor de Época — partilhado por todas as abas */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mr-1">Época selecionada</span>
          {SEASONS.map((s) => {
            const active = s.id === seasonId;
            return (
              <button
                key={s.id}
                onClick={() => goTo(s.id, tab)}
                className={`min-h-11 px-3.5 py-2 rounded-lg text-xs font-semibold font-mono transition-all border ${
                  active
                    ? 'bg-primary text-white border-primary'
                    : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-foreground'
                }`}
              >
                {s.label}
                <span className={`ml-2 text-[9px] uppercase ${active ? 'text-white/70' : 'text-zinc-500'}`}>
                  {s.status === 'completed' ? 'Concluída' : s.status === 'active' ? 'Em curso' : 'Por disputar'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout de duas colunas (estilo Liga Angola): mini-classificação fixa + conteúdo */}
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] 2xl:grid-cols-[320px_1fr] gap-8 2xl:gap-10 items-start">

        {/* Barra lateral: mini-classificação persistente (xl+) */}
        <div className="hidden xl:block sticky top-28">
          <MiniStandings seasonId={seasonId} />
        </div>

        {/* Coluna principal: abas + conteúdo */}
        <div className="min-w-0">
          {tab === 'geral' && <details className="mb-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/40 xl:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-xs font-bold uppercase tracking-wide text-foreground">
              <span>Top 5 da classificação</span>
              <span className="text-accent">Ver tabela</span>
            </summary>
            <MiniStandings seasonId={seasonId} limit={5} />
          </details>}

          {/* Barra de abas com scroll suave no mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mb-6 sm:mb-8 sm:flex-wrap sm:gap-0 sm:border-b sm:border-zinc-200 sm:dark:border-zinc-900 pb-1 sm:pb-0">
            {HUB_TABS.map((t) => {
              const Icon = TAB_ICONS[t.key];
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => goTo(seasonId, t.key)}
                  className={`min-h-[48px] sm:min-h-0 rounded-xl sm:rounded-none border sm:border-x-0 sm:border-t-0 sm:border-b-2 px-3 py-2 sm:px-5 sm:py-4 text-center text-xs font-mono uppercase tracking-tight sm:tracking-wider font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 flex-shrink-0 whitespace-nowrap ${
                    active
                      ? 'text-accent border-accent bg-accent/10 sm:bg-accent/5 shadow-xs sm:shadow-none'
                      : 'text-zinc-500 border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/30 sm:bg-transparent sm:dark:bg-transparent sm:border-transparent hover:text-foreground hover:bg-white/80 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon size={16} className={active ? 'text-accent' : 'text-zinc-500'} />
                  <span className="sm:hidden">{t.shortLabel}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conteúdo da aba ativa */}
          {tab === 'geral' && <GeralTab seasonId={seasonId} />}
          {tab === 'classificacao' && <ClassificacaoTab seasonId={seasonId} />}
          {tab === 'calendario' && <CalendarioTab seasonId={seasonId} />}
          {tab === 'estatisticas' && <EstatisticasTab seasonId={seasonId} />}
          {tab === 'comparador' && <SeasonComparisonMatrix seasonId={seasonId} />}
          {tab === 'tempo-util' && <TempoUtilTab seasonId={seasonId} />}
          {tab === 'nomeacoes' && <NomeacoesTab seasonId={seasonId} />}
        </div>
      </div>
    </div>
  );
}
