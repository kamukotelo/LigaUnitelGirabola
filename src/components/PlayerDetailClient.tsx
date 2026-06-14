'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, Award, Star, Calendar, Users } from 'lucide-react';
import { Player, Team, getPlayers, getMatches } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';

interface PlayerDetailClientProps {
  player: Player;
  team?: Team;
}

// Circular SVG Stat Ring component
function StatRing({ value, max, label, color = '#D21515' }: { value: number; max: number; label: string; color?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <svg className="rotate-[-90deg]" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} stroke="#27272a" strokeWidth="4" fill="none" />
          <motion.circle
            cx="32" cy="32" r={r}
            stroke={color} strokeWidth="4" fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-sm text-white font-extrabold">{value}</span>
        </div>
      </div>
      <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mt-2 text-center">{label}</p>
    </div>
  );
}

export default function PlayerDetailClient({ player, team }: PlayerDetailClientProps) {
  // Goals classification
  const allPlayers = getPlayers();
  const allGoals = [...allPlayers].sort((a, b) => b.goals - a.goals);
  const goalRank = allGoals.findIndex(p => p.id === player.id) + 1;
  const maxGoals = allGoals[0]?.goals || 1;

  // Filter recent finished matches of the player's club
  const allMatches = getMatches();
  const teamMatches = allMatches
    .filter(m => m.homeTeamId === player.teamId || m.awayTeamId === player.teamId)
    .filter(m => m.status === 'finished')
    .slice(0, 3); // top 3 recent games

  // Attributes mappings for styling
  const attrList = [
    { label: 'Ritmo / Velocidade', value: player.attributes.pace, color: 'from-amber-500 to-red-500' },
    { label: 'Finalização / Remate', value: player.attributes.shooting, color: 'from-red-500 to-pink-500' },
    { label: 'Passe / Visão', value: player.attributes.passing, color: 'from-blue-500 to-indigo-500' },
    { label: 'Drible / Técnica', value: player.attributes.dribbling, color: 'from-purple-500 to-pink-500' },
    { label: 'Defesa / Posicionamento', value: player.attributes.defending, color: 'from-green-500 to-emerald-500' },
    { label: 'Físico / Resistência', value: player.attributes.physical, color: 'from-orange-500 to-yellow-500' }
  ];

  const clubColor = team?.colorsHex ? team.colorsHex[0] : '#D21515';

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
      
      {/* Club theme ambient light glow */}
      <div 
        className="absolute top-[10%] left-1/3 -translate-x-1/2 w-[500px] h-[300px] rounded-full filter blur-[120px] opacity-10 pointer-events-none z-0"
        style={{ backgroundColor: clubColor }}
      />

      {/* Back Link */}
      <Link href="/stats" className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest mb-8 hover:-translate-x-1 transition-transform">
        <ArrowLeft size={14} /> Voltar para Líderes
      </Link>

      {/* Profile Header */}
      <AnimatedCard variant="holographic" className="bg-zinc-950/40 border-zinc-900/80 p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            REGISTO_FAF_ATIVO
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-end text-center md:text-left">
          {/* Jersey Card */}
          <div className="w-40 h-52 bg-zinc-900 rounded-2xl overflow-hidden running-border relative flex-shrink-0">
            <div className="absolute top-2 left-2 bg-primary text-white rounded-lg px-2.5 py-1 font-display text-2xl font-black">
              {player.jerseyNumber}
            </div>
            {/* Fallback image */}
            <div className="w-full h-full flex items-center justify-center bg-zinc-800/60 text-zinc-600">
              <Users size={48} className="animate-pulse" />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-semibold block mb-1">
                {player.position}
              </span>
              <h1 className="text-4xl md:text-5xl font-display text-white uppercase leading-none font-black">
                {player.name}
              </h1>
              <p className="text-zinc-400 font-mono text-xs uppercase tracking-wider mt-1">
                {player.nationality} · Idade: {player.age} anos · Altura: {player.height}
              </p>
            </div>

            {/* Stat Rings */}
            <div className="flex flex-wrap gap-6 justify-center md:justify-start pt-2 border-t border-zinc-900/60">
              <StatRing value={player.goals} max={maxGoals} label="Golos" color="#D21515" />
              <StatRing value={player.assists} max={15} label="Assistências" color="#F9C304" />
              <StatRing value={player.appearances} max={30} label="Jogos" color="#00F5FF" />
              {player.age && <StatRing value={player.age} max={40} label="Idade" color="#a855f7" />}
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Stats Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Biometric & Profile Card */}
          <div className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl">
            <h3 className="text-md font-display text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Star size={16} className="text-primary" /> Perfil Físico & Biográfico
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-900/60 text-xs font-mono">
              <div>
                <span className="text-[9px] text-zinc-500 uppercase block mb-1">Altura</span>
                <span className="font-bold text-white text-md block">{player.height || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 uppercase block mb-1">Peso</span>
                <span className="font-bold text-white text-md block">{player.weight || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 uppercase block mb-1">Clube</span>
                <span className="font-bold text-white text-md block">
                  {team ? (
                    <Link href={`/teams/${team.id}`} className="hover:text-primary transition-colors">
                      {team.name}
                    </Link>
                  ) : (
                    player.club
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* HUD Attributes Panel */}
          <AnimatedCard variant="hud" className="bg-zinc-950/40 border-zinc-900 p-8">
            <h3 className="text-md font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Activity size={18} className="text-accent" /> Matriz de Atributos (HUD)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attrList.map((attr, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400 uppercase">{attr.label}</span>
                    <span className="text-white font-extrabold">{attr.value} / 99</span>
                  </div>
                  
                  {/* Progress Meter bar */}
                  <div className="h-2 w-full bg-zinc-900 rounded-full border border-zinc-800/80 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(attr.value / 99) * 100}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                      className={`h-full rounded-full bg-gradient-to-r ${attr.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>

          {/* Histórico Recente de Jogos do Clube */}
          <div className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-2xl">
            <h3 className="text-md font-display text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-primary" /> Resultados Recentes
            </h3>
            
            <div className="space-y-3 pt-4 border-t border-zinc-900/60">
              {teamMatches.length > 0 ? (
                teamMatches.map((m) => {
                  const isHome = m.homeTeamId === player.teamId;
                  const opponent = isHome ? m.awayTeam : m.homeTeam;
                  const result = isHome 
                    ? (m.homeScore > m.awayScore ? 'V' : m.homeScore < m.awayScore ? 'D' : 'E') 
                    : (m.awayScore > m.homeScore ? 'V' : m.awayScore < m.homeScore ? 'D' : 'E');

                  return (
                    <div key={m.id} className="flex justify-between p-3.5 bg-black/40 rounded-xl items-center font-mono text-xs">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                        result === 'V' 
                          ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                          : result === 'D' 
                          ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                          : 'bg-zinc-800/30 border border-zinc-700/30 text-zinc-400'
                      }`}>
                        {result}
                      </span>
                      <span className="text-zinc-300 font-semibold">{isHome ? 'Casa' : 'Fora'} vs {opponent}</span>
                      <span className="font-bold text-white">{m.homeScore} - {m.awayScore}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-zinc-500 font-mono italic">Sem partidas concluídas registadas.</p>
              )}
            </div>
          </div>

          {/* Career History */}
          {player.careerHistory && (
            <AnimatedCard variant="hud" className="bg-zinc-950/40 border-zinc-900 p-8">
              <h3 className="text-md font-display text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Award size={18} className="text-accent" /> Histórico da Carreira
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[400px] font-mono text-xs text-zinc-400">
                  <thead>
                    <tr className="border-b border-zinc-900 pb-2 text-[10px] text-zinc-500 uppercase">
                      <th className="py-2">Temporada</th>
                      <th className="py-2">Clube</th>
                      <th className="py-2 text-center">Jogos</th>
                      <th className="py-2 text-center">Golos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60">
                    {player.careerHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-zinc-900/20">
                        <td className="py-3 font-bold text-white">{item.season}</td>
                        <td className="py-3 font-semibold text-zinc-300">{item.club}</td>
                        <td className="py-3 text-center">{item.apps}</td>
                        <td className="py-3 text-center font-extrabold text-primary">{item.goals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimatedCard>
          )}

        </div>

        {/* Right Columns: Bio & Overview */}
        <div className="space-y-8">
          
          {/* Biography */}
          <AnimatedCard variant="hud" className="bg-zinc-950/40 border-zinc-900 p-6 space-y-4">
            <h3 className="text-md font-display text-white uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-accent" /> Biografia Técnica
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              {player.bio || 'Sem biografia detalhada registada no banco de dados da Federação Angolana de Futebol.'}
            </p>
          </AnimatedCard>

          {/* League Stats Sidebar */}
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl h-fit space-y-6">
            <h3 className="text-md font-display uppercase flex items-center gap-2 text-white">
              <Activity size={14} className="text-accent" /> Estatísticas da Liga
            </h3>
            
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-zinc-900/60 pb-2.5">
                <span className="text-zinc-500">Class. Golos</span>
                <span className="font-bold text-white">#{goalRank}º</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/60 pb-2.5">
                <span className="text-zinc-500">Golos por Jogo</span>
                <span className="font-bold text-white">{(player.goals / (player.appearances || 1)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-zinc-500">Minutos Jogados</span>
                <span className="font-bold text-white">{player.appearances * 90}{"'"}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
