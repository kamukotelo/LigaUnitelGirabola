'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getMatchById, getMatchDetail, getTeamById, type Match, type MatchDetail } from '@/lib/data';
import MatchDetailClient from '@/components/MatchDetailClient';
import { ROUTES } from '@/lib/routes';

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const isDynamicCalendarMatch = id.startsWith('m27-');
  const [match, setMatch] = useState<Match | undefined>(() => isDynamicCalendarMatch ? undefined : getMatchById(id));
  const [serverDetail, setServerDetail] = useState<MatchDetail | undefined>();
  const [serverNow, setServerNow] = useState<number | undefined>();
  const [loading, setLoading] = useState(isDynamicCalendarMatch);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isDynamicCalendarMatch) return;

    let cancelled = false;
    fetch(`/api/ancaf?format=matches&id=${encodeURIComponent(id)}`, { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Jogo não encontrado (${response.status})`);
        return response.json() as Promise<{ match: Match; detail?: MatchDetail; serverTime?: number }>;
      })
      .then((data) => {
        if (!cancelled) {
          setMatch(data.match);
          if (data.detail) {
            setServerDetail(data.detail);
          }
          if (typeof data.serverTime === 'number') {
            setServerNow(data.serverTime);
          }
        }
      })
      .catch(() => {
        if (!cancelled) setMatch(undefined);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id, isDynamicCalendarMatch, reloadKey]);

  // Se o line up estiver sob embargo, agenda a atualização automática assim
  // que o embargo expirar segundo a hora oficial do servidor.
  useEffect(() => {
    if (!serverDetail?.lineupPublicFrom) return;
    const referenceNow = serverNow ?? Date.now();
    const remainingMs = serverDetail.lineupPublicFrom - referenceNow;
    if (remainingMs > 24 * 60 * 60 * 1000) return;
    const delayMs = Math.max(1500, remainingMs + 1000);

    const timer = setTimeout(() => {
      setReloadKey((prev) => prev + 1);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [serverDetail?.lineupPublicFrom, serverNow, reloadKey]);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center gap-3 text-zinc-500 font-mono text-xs uppercase tracking-widest">
        <Loader2 className="h-4 w-4 animate-spin text-accent" /> A carregar jogo do calendário ativo…
      </div>
    );
  }

  if (!match) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-display text-foreground uppercase mb-2">Jogo Não Encontrado</h2>
        <Link href={ROUTES.calendar} className="text-primary font-mono text-xs uppercase tracking-widest">
          Voltar ao Calendário
        </Link>
      </div>
    );
  }

  const detail = serverDetail ?? getMatchDetail(match);
  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);

  return <MatchDetailClient detail={detail} homeTeam={homeTeam} awayTeam={awayTeam} />;
}
