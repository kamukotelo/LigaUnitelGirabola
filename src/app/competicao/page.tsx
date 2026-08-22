import { redirect } from 'next/navigation';
import { CURRENT_SEASON_ID } from '@/lib/data';

// A entrada do hub abre sempre na temporada atual, independentemente da aba.
export default async function CompetitionIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === 'geral' ? 'calendario' : tab === 'tempo-util' ? 'estatisticas' : tab ?? 'calendario';
  redirect(`/competicao/${CURRENT_SEASON_ID}?tab=${activeTab}`);
}
