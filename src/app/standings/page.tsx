import { redirect } from 'next/navigation';

// Rota histórica: a classificação vive agora no hub de competição.
export default function StandingsPage() {
  redirect('/competicao?tab=classificacao');
}
