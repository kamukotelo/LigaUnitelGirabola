import { redirect } from 'next/navigation';

// Rota histórica: as estatísticas vivem agora no hub de competição.
export default function StatsPage() {
  redirect('/competicao?tab=estatisticas');
}
