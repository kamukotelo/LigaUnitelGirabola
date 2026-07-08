import { redirect } from 'next/navigation';
import { SEASONS, CURRENT_SEASON_ID } from '@/lib/data';
import CompetitionHubClient from '@/components/competition/CompetitionHubClient';
import { HUB_TABS, HubTab } from '@/components/competition/tabs';

// Hub de competição por época (estilo Liga Portugal):
// /competicao/{época}?tab=classificacao|calendario|estatisticas|tempo-util|nomeacoes
export function generateStaticParams() {
  return SEASONS.map((s) => ({ season: s.id }));
}

export default async function CompetitionSeasonPage({
  params,
  searchParams,
}: {
  params: Promise<{ season: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { season } = await params;
  const { tab } = await searchParams;

  if (!SEASONS.some((s) => s.id === season)) {
    redirect(`/competicao/${CURRENT_SEASON_ID}?tab=classificacao`);
  }

  const activeTab: HubTab = HUB_TABS.some((t) => t.key === tab) ? (tab as HubTab) : 'classificacao';

  return <CompetitionHubClient seasonId={season} tab={activeTab} />;
}
