import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

// Rota histórica: a classificação vive agora no hub de competição.
export default function StandingsPage() {
  redirect(ROUTES.standings);
}
