'use client';

import { useRouter } from 'next/navigation';
import { LayoutGrid, Trophy, CalendarDays, BarChart3, Timer, Flag } from 'lucide-react';
import { SEASONS } from '@/lib/data';
import PageHeader from '@/components/ui/PageHeader';
import { HUB_TABS, HubTab } from './tabs';
import MiniStandings from './MiniStandings';
import GeralTab from './GeralTab';
import ClassificacaoTab from './ClassificacaoTab';
import CalendarioTab from './CalendarioTab';
import EstatisticasTab from './EstatisticasTab';
import TempoUtilTab from './TempoUtilTab';
import NomeacoesTab from './NomeacoesTab';

const TAB_ICONS: Record<HubTab, typeof Trophy> = {
  geral: LayoutGrid,
  classificacao: Trophy,
  calendario: CalendarDays,
  estatisticas: BarChart3,
  'tempo-util': Timer,
  nomeacoes: Flag,
};

export default function CompetitionHubClient({ seasonId, tab }: { seasonId: string; tab: HubTab }) {
  const router = useRouter();
  const selectedSeason = SEASONS.find((s) => s.id === seasonId);

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
          description={`Época ${selectedSeason?.label ?? seasonId} · ${selectedSeason?.status === 'completed' ? 'Concluída' : 'Por disputar'} · Campeonato Nacional de Futebol de Angola`}
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
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                  active
                    ? 'bg-primary text-white border-primary'
                    : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-foreground'
                }`}
              >
                {s.label}
                <span className={`ml-2 text-[9px] uppercase ${active ? 'text-white/70' : 'text-zinc-500'}`}>
                  {s.status === 'completed' ? 'Concluída' : 'Por disputar'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout de duas colunas (estilo Liga Angola): mini-classificação fixa + conteúdo */}
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-8 items-start">

        {/* Barra lateral: mini-classificação persistente (xl+) */}
        <div className="hidden xl:block sticky top-28">
          <MiniStandings seasonId={seasonId} />
        </div>

        {/* Coluna principal: abas + conteúdo */}
        <div className="min-w-0">
          {/* Barra de abas */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-900 mb-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {HUB_TABS.map((t) => {
              const Icon = TAB_ICONS[t.key];
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => goTo(seasonId, t.key)}
                  className={`px-4 sm:px-5 py-4 text-center text-xs font-mono uppercase tracking-wider font-extrabold border-b-2 transition-all duration-200 flex-shrink-0 flex items-center gap-2 ${
                    active
                      ? 'text-accent border-accent bg-accent/5'
                      : 'text-zinc-500 border-transparent hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Conteúdo da aba ativa */}
          {tab === 'geral' && <GeralTab seasonId={seasonId} />}
          {tab === 'classificacao' && <ClassificacaoTab seasonId={seasonId} />}
          {tab === 'calendario' && <CalendarioTab seasonId={seasonId} />}
          {tab === 'estatisticas' && <EstatisticasTab seasonId={seasonId} />}
          {tab === 'tempo-util' && <TempoUtilTab seasonId={seasonId} />}
          {tab === 'nomeacoes' && <NomeacoesTab seasonId={seasonId} />}
        </div>
      </div>
    </div>
  );
}
