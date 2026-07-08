import { redirect } from 'next/navigation';
import { CURRENT_SEASON_ID, UPCOMING_SEASON_ID } from '@/lib/data';

// Entrada do hub sem época: escolhe a época mais relevante para a aba pedida.
// O calendário abre na época por disputar; as restantes abas na época corrente.
export default async function CompetitionIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab ?? 'geral';
  const onUpcoming = activeTab === 'geral' || activeTab === 'calendario' || activeTab === 'nomeacoes';
  const season = onUpcoming ? UPCOMING_SEASON_ID : CURRENT_SEASON_ID;
  redirect(`/competicao/${season}?tab=${activeTab}`);
}
