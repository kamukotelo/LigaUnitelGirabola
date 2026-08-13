'use client';

import { useEffect, useMemo, useState } from 'react';
import { getMatchesForSeason, Match, UPCOMING_SEASON_ID } from '@/lib/data';

/**
 * Fonte única do calendário público. Para 2026/27 consulta sempre o mesmo
 * endpoint usado pela página Calendário; noutras épocas usa o arquivo local.
 */
export function useOfficialCalendar(seasonId: string) {
  const fallback = useMemo(() => getMatchesForSeason(seasonId), [seasonId]);
  const [officialMatches, setOfficialMatches] = useState<Match[] | null>(null);

  useEffect(() => {
    if (seasonId !== UPCOMING_SEASON_ID) {
      setOfficialMatches(null);
      return;
    }

    const controller = new AbortController();
    setOfficialMatches(null);

    fetch('/api/ancaf?format=matches', { cache: 'no-store', signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`API ANCAF respondeu ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.matches) && data.matches.length === 240) {
          setOfficialMatches(data.matches);
        }
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Erro ao obter o calendário oficial:', error);
        }
      });

    return () => controller.abort();
  }, [seasonId]);

  return {
    matches: officialMatches ?? fallback,
    loading: seasonId === UPCOMING_SEASON_ID && officialMatches === null,
  };
}
