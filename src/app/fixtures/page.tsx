import { redirect } from 'next/navigation';

// Rota histórica: o calendário vive agora no hub de competição.
export default function FixturesPage() {
  redirect('/competicao?tab=calendario');
}
