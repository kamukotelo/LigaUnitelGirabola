import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

// Rota histórica: o calendário vive agora no hub de competição.
export default function FixturesPage() {
  redirect(ROUTES.calendar);
}
