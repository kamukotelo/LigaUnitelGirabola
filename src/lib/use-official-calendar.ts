'use client';

import { useEffect, useMemo, useState } from 'react';
import { applyRuntimeMatchOverrides, getMatchesForSeason, Match, UPCOMING_SEASON_ID } from '@/lib/data';
import { supabase } from '@/lib/supabase';

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
      setOfficialMatches(null);
      setGeneratedAt(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    let controller: AbortController | null = null;
    setOfficialMatches(null);

    const loadCalendar = () => {
      controller?.abort();
      controller = new AbortController();
      setLoading(true);

      fetch('/api/ancaf?format=matches', { cache: 'no-store', signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error(`API ANCAF respondeu ${response.status}`);
          return response.json();
        })
        .then((data) => {
          if (cancelled || !Array.isArray(data.matches) || data.matches.length !== 240) return;

          // Esta é a coleção canónica usada por calendário, página inicial,
          // clubes, competição e tempo útil. O endpoint já inclui a publicação
          // do administrador; a camada local cobre a atualização em tempo real.
          setOfficialMatches(applyRuntimeMatchOverrides(data.matches));
          // A data mostrada ao público é a última publicação editorial feita
          // na plataforma, não a data histórica da importação ANCAF.
          setGeneratedAt(data.platformUpdatedAt ?? null);
        })
        .catch((error) => {
          if (error instanceof Error && error.name !== 'AbortError') {
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ancaf_configs' }, loadCalendar)
      .subscribe();

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') loadCalendar();
    };
    window.addEventListener('focus', loadCalendar);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      cancelled = true;
      controller?.abort();
      window.removeEventListener('focus', loadCalendar);
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
