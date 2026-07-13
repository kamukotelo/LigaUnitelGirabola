import { redirect } from 'next/navigation';
import { UPCOMING_SEASON_ID } from '@/lib/data';

export default function MatchesPage() {
  redirect(`/competicao/${UPCOMING_SEASON_ID}?tab=calendario`);
}
