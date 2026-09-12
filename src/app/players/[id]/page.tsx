import React from 'react';
import { getPlayerById, getTeamById, getPlayers } from '@/lib/data';
import PlayerDetailClient from '@/components/PlayerDetailClient';

// Permite gerar sob demanda e guardar em cache (ISR) qualquer jogador que não esteja na lista inicial do build
export const dynamicParams = true;

// Pré-renderiza no build apenas os atletas com atividade oficial (marcadores, assistências ou com jogos);
// os restantes 500+ são gerados sob demanda no primeiro acesso, reduzindo drasticamente o consumo de Build CPU Minutes na Vercel.
export function generateStaticParams() {
  const players = getPlayers();
  return players
    .filter(
      (p) =>
        (p.goals && p.goals > 0) ||
        (p.assists && p.assists > 0) ||
        (p.appearances && p.appearances > 0)
    )
    .slice(0, 45)
    .map((p) => ({ id: p.id }));
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
