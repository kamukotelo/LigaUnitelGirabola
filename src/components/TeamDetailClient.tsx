'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, MapPin, User, Calendar, Shield, Flame, Users, ArrowLeft } from 'lucide-react';
import { Team, Player, Match, StandingEntry } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';

interface TeamDetailClientProps {
  team: Team;
  players: Player[];
  matches: Match[];
  standing?: StandingEntry;
}

export default function TeamDetailClient({ team, players, matches, standing }: TeamDetailClientProps) {
  // Group players by position
  const playersByPosition = {
    'Guarda-redes': players.filter((p) => p.position === 'Guarda-redes'),
    'Defesa': players.filter((p) => p.position === 'Defesa' || p.position === 'Defesa Esquerdo' || p.position === 'Defesa Direito'),
    'Médio': players.filter((p) => p.position.includes('Médio') || p.position.includes('Extremo') && p.position !== 'Avançado'),
    'Avançado': players.filter((p) => p.position === 'Avançado' || p.position.includes('Ponta de Lança')),
  };

  const clubColor = team.colorsHex ? team.colorsHex[0] : '#D21515';

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Club ambient light glow */}
      <div 
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full filter blur-[120px] opacity-10 pointer-events-none z-0"
        style={{ backgroundColor: clubColor }}
      />

      {/* Back Button */}
      <Link href="/teams" className="inline-flex items-center gap-2 text-xs font-mono uppercase text-zinc-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={14} /> Voltar para Equipas
      </Link>

      {/* HUD Header */}
      <AnimatedCard variant="holographic" className="bg-zinc-950/40 border-zinc-900/80 p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 status-pulse" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            REGISTO_FAF_ATIVO
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          {/* Logo Badge */}
          <div 
            className="w-24 h-24 rounded-3xl bg-black/40 border border-zinc-800 flex items-center justify-center font-display text-4xl text-white uppercase select-none shadow-[0_0_30px_rgba(255,255,255,0.03)] font-black"
            style={{ textShadow: `0 0 15px ${clubColor}` }}
          >
            {team.shortName.substring(0, 2)}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-semibold block mb-1">
                CLUBE PARTICIPANTE
              </span>
              <h1 className="text-4xl md:text-5xl font-display text-white uppercase leading-none">
                {team.name}
              </h1>
              <p className="text-zinc-400 font-mono text-xs uppercase tracking-wider mt-1">
                Fundado em {team.founded} · Alcunha: {team.shortName}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-900/60 text-xs font-mono text-zinc-400">
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-600 block uppercase">Cidade</span>
                <span className="text-white font-bold flex items-center justify-center md:justify-start gap-1.5">
                  <MapPin size={12} className="text-primary" /> {team.city}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-600 block uppercase">Estádio</span>
                <span className="text-white font-bold flex items-center justify-center md:justify-start gap-1.5 truncate" title={team.stadium}>
                  <Trophy size={12} className="text-accent" /> {team.stadium}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-600 block uppercase">Treinador</span>
                <span className="text-white font-bold flex items-center justify-center md:justify-start gap-1.5">
                  <User size={12} className="text-zinc-500" /> {team.coach}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-600 block uppercase">Cores</span>
                <span className="text-white font-bold block truncate">
                  {team.colors}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Standings & Matches */}
        <div className="space-y-8 lg:col-span-1">
          {/* Standing Position Card */}
          {standing && (
            <AnimatedCard variant="hud" className="bg-zinc-950/40 border-zinc-900 p-6">
              <h3 className="text-md font-display text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield size={16} className="text-accent" /> Rendimento Geral
              </h3>
              
              <div className="flex items-center justify-between py-4 border-y border-zinc-900/60 font-mono">
                <div>
                  <span className="text-[9px] text-zinc-500 block uppercase">Classificação</span>
                  <span className="text-4xl font-display font-extrabold text-white flex items-baseline gap-1">
                    {standing.position}º
                    <span className="text-xs text-zinc-500">/16</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 block uppercase">Pontuação</span>
                  <span className="text-4xl font-display font-extrabold text-primary">
                    {standing.points}
                    <span className="text-xs text-zinc-500"> PTS</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-4 text-center font-mono text-xs text-zinc-400">
                <div>
                  <span className="text-[9px] text-zinc-500 block">VITORIAS</span>
                  <span className="text-white font-bold">{standing.won}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block">EMPATES</span>
                  <span className="text-white font-bold">{standing.drawn}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block">DERROTAS</span>
                  <span className="text-white font-bold">{standing.lost}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[9px] font-mono text-zinc-500 block mb-2">FORMA RECENTE</span>
                <div className="flex gap-2">
                  {standing.form.map((result, idx) => (
                    <span
                      key={idx}
                      className={`flex-1 py-1 rounded text-center text-xs font-mono font-bold ${
                        result === 'W'
                          ? 'bg-green-500/10 border border-green-500/30 text-green-500'
                          : result === 'D'
                          ? 'bg-zinc-800/20 border border-zinc-700/30 text-zinc-400'
                          : 'bg-red-500/10 border border-red-500/30 text-red-500'
                      }`}
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          )}

          {/* Stadium virtual info */}
          <AnimatedCard variant="hud" className="bg-zinc-950/40 border-zinc-900 p-6 relative overflow-hidden">
            <h3 className="text-md font-display text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Trophy size={16} className="text-accent" /> Estádio e Instalações
            </h3>
            
            <div className="space-y-3 font-mono text-xs text-zinc-400">
              <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                <span>Nome Oficial:</span>
                <span className="text-white font-bold text-right">{team.stadium}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                <span>Capacidade Oficial:</span>
                <span className="text-white font-bold">{team.stadiumCapacity.toLocaleString('pt-AO')} Lugares</span>
              </div>
              <div className="flex justify-between">
                <span>Localização:</span>
                <span className="text-white font-bold">{team.city}, Angola</span>
              </div>
            </div>
          </AnimatedCard>

          {/* Match Schedule List */}
          <AnimatedCard variant="hud" className="bg-zinc-950/40 border-zinc-900 p-6">
            <h3 className="text-md font-display text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-accent" /> Partidas Recentes e Futuras
            </h3>
            
            <div className="space-y-4">
              {matches.slice(0, 3).map((match) => {
                const isHome = match.homeTeam === team.shortName;
                const opponent = isHome ? match.awayTeam : match.homeTeam;
                const isFinished = match.status === 'finished';

                return (
                  <div key={match.id} className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl flex items-center justify-between gap-4 font-mono text-xs">
                    <div>
                      <span className="text-[8px] text-zinc-500 block uppercase">JORNADA {match.round}</span>
                      <span className="text-white font-bold block truncate max-w-[120px]">{opponent}</span>
                      <span className="text-[9px] text-zinc-500">{isHome ? 'Casa' : 'Fora'}</span>
                    </div>

                    {isFinished ? (
                      <div className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-center">
                        <span className="text-white font-bold block">{match.score}</span>
                        <span className="text-[8px] text-zinc-500 uppercase">FIM</span>
                      </div>
                    ) : (
                      <div className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded text-center text-primary font-bold">
                        VS
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </AnimatedCard>
        </div>

        {/* Right Column: Roster of Players */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatedCard variant="hud" className="bg-zinc-950/40 border-zinc-900 p-8">
            <h3 className="text-lg font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Users size={20} className="text-accent" /> Plantel de Atletas
            </h3>

            <div className="space-y-6">
              {Object.entries(playersByPosition).map(([position, list]) => (
                <div key={position} className="space-y-3">
                  <h4 className="text-xs font-mono text-accent uppercase tracking-widest font-extrabold border-b border-zinc-900 pb-1.5">
                    {position}
                  </h4>
                  {list.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {list.map((player) => (
                        <Link key={player.id} href={`/players/${player.id}`}>
                          <div className="p-4 bg-zinc-900/20 hover:bg-zinc-900/40 border border-zinc-900 rounded-xl flex items-center justify-between gap-4 transition-all group hover:border-zinc-800">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center font-mono text-xs text-zinc-400 group-hover:text-primary font-bold transition-colors">
                                #{player.jerseyNumber}
                              </span>
                              <div>
                                <h5 className="text-white font-bold text-sm uppercase group-hover:text-accent transition-colors truncate max-w-[140px]">
                                  {player.name}
                                </h5>
                                <span className="text-[9px] text-zinc-500 font-mono uppercase block">{player.nationality}</span>
                              </div>
                            </div>
                            
                            {player.goals > 0 && (
                              <div className="text-right flex items-center gap-1 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-lg text-primary font-mono text-[10px] font-bold">
                                <Flame size={10} className="animate-pulse" />
                                {player.goals} G
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-600 font-mono italic">Nenhum jogador registado.</p>
                  )}
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>

      </div>

    </div>
  );
}
