import React from 'react';
import Link from 'next/link';
import { getMatchById, getMatchDetail, getMatches, getTeamById } from '@/lib/data';
import MatchDetailClient from '@/components/MatchDetailClient';

// Geração estática dos jogos para otimização de build
export function generateStaticParams() {
  return getMatches().map((m) => ({ id: m.id }));
}

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = getMatchById(id);

  if (!match) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-display text-foreground uppercase mb-2">Jogo Não Encontrado</h2>
        <Link href="/fixtures" className="text-primary font-mono text-xs uppercase tracking-widest">
          Voltar ao Calendário
        </Link>
      </div>
    );
  }

  const detail = getMatchDetail(match);
  const homeTeam = getTeamById(match.homeTeamId);
  const awayTeam = getTeamById(match.awayTeamId);

  return <MatchDetailClient detail={detail} homeTeam={homeTeam} awayTeam={awayTeam} />;
}
