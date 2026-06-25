import React from 'react';
import { getPlayerById, getTeamById, getPlayers } from '@/lib/data';
import PlayerDetailClient from '@/components/PlayerDetailClient';

// Static params generation for Next.js build optimization
export function generateStaticParams() {
  return getPlayers().map((p) => ({ id: p.id }));
}

export default async function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = getPlayerById(id);

  if (!player) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-display text-foreground uppercase mb-2">Jogador Não Encontrado</h2>
      </div>
    );
  }

  const team = getTeamById(player.teamId);

  return (
    <PlayerDetailClient 
      player={player} 
      team={team} 
    />
  );
}
