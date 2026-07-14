import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

// Rota histórica: as estatísticas vivem agora no hub de competição.
export default function StatsPage() {
  redirect(ROUTES.stats);
}
