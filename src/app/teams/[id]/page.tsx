import React from 'react';
import { getTeamById, getPlayersByTeam, getMatchesByTeam, getStandingByTeamId, ALL_TEAMS } from '@/lib/data';
import TeamDetailClient from '@/components/TeamDetailClient';

// Static params generation — inclui os clubes promovidos de 2026/2027
export function generateStaticParams() {
  return ALL_TEAMS.map((t) => ({ id: t.id }));
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = getTeamById(id);
  
  if (!team) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-display text-foreground uppercase mb-2">Equipa Não Encontrada</h2>
      </div>
    );
  }

  const players = getPlayersByTeam(team.id);
  const matches = getMatchesByTeam(team.id);
  const standing = getStandingByTeamId(team.id);

  return (
    <TeamDetailClient 
      team={team} 
      players={players} 
      matches={matches} 
      standing={standing} 
    />
  );
}
