'use client';

import { useEffect, useMemo, useState } from 'react';
import { applyRuntimeMatchOverrides, getMatchesForSeason, Match, UPCOMING_SEASON_ID } from '@/lib/data';
import { supabase } from '@/lib/supabase';

const CALENDAR_CACHE_TTL_MS = 60_000;

type CalendarPayload = {
  matches: Match[];
  platformUpdatedAt?: string | null;
};

let cachedCalendar: CalendarPayload | null = null;
let cachedAt = 0;
let pendingCalendarRequest: Promise<CalendarPayload> | null = null;

async function fetchOfficialCalendar(force = false): Promise<CalendarPayload> {
  const cacheIsFresh = cachedCalendar && Date.now() - cachedAt < CALENDAR_CACHE_TTL_MS;
  if (!force && cacheIsFresh) return cachedCalendar!;
  if (!force && pendingCalendarRequest) return pendingCalendarRequest;

  pendingCalendarRequest = fetch('/api/ancaf?format=matches', { cache: 'no-store' })
    .then(async (response) => {
      if (!response.ok) throw new Error(`API ANCAF respondeu ${response.status}`);
      const data = await response.json() as CalendarPayload;
      if (!Array.isArray(data.matches) || data.matches.length !== 240) {
        throw new Error('Calendário oficial incompleto');
      }
      cachedCalendar = data;
      cachedAt = Date.now();
      return data;
    })
    .finally(() => {
      pendingCalendarRequest = null;
    });

  return pendingCalendarRequest;
}

/**
 * Fonte única do calendário público. Para 2026/27 consulta sempre o mesmo
 * endpoint usado pela página Calendário; noutras épocas usa o arquivo local.
 */
export function useOfficialCalendar(seasonId: string) {
  const fallback = useMemo(() => getMatchesForSeason(seasonId), [seasonId]);
  const [officialMatches, setOfficialMatches] = useState<Match[] | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seasonId !== UPCOMING_SEASON_ID) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setOfficialMatches(null);
      setGeneratedAt(null);
      setLoading(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    let cancelled = false;
    setOfficialMatches(null);

    const loadCalendar = (force = false) => {
      setLoading(true);

      fetchOfficialCalendar(force)
        .then((data) => {
          if (cancelled) return;

          // Esta é a coleção canónica usada por calendário, página inicial,
          // clubes, competição e tempo útil. O endpoint já inclui a publicação
          // do administrador; a camada local cobre a atualização em tempo real.
          setOfficialMatches(applyRuntimeMatchOverrides(data.matches));
          // A data mostrada ao público é a última publicação editorial feita
          // na plataforma, não a data histórica da importação ANCAF.
          setGeneratedAt(data.platformUpdatedAt ?? null);
        })
        .catch((error) => {
          if (error instanceof Error) {
            console.error('Erro ao obter o calendário oficial:', error);
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    loadCalendar();

    // Uma publicação no ANCAF Calendar ou uma edição administrativa passa a
    // refletir-se simultaneamente em todos os componentes que usam este hook.
    const channel = supabase
      .channel('official-calendar-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ancaf_configs' }, () => loadCalendar(true))
      .subscribe();

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') loadCalendar();
    };
    const refreshOnFocus = () => loadCalendar();
    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      supabase.removeChannel(channel);
    };
  }, [seasonId]);

  return {
    matches: officialMatches ?? fallback,
    loading: seasonId === UPCOMING_SEASON_ID && loading,
    generatedAt,
  };
}
