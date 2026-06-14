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

interface HeatSpot {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: string;
  color: string;
  pulseDelay?: number;
}

function HeatmapField({ position, playerId }: { position: string; playerId: string }) {
  let spots: HeatSpot[] = [];
  let zoneLabel = "Terço Médio";
  let heatDescription = "Distribuição posicional equilibrada.";
  let stats = {
    defensiveThird: "33%",
    midfieldThird: "33%",
    attackingThird: "33%",
  };

  const posLower = position.toLowerCase();

  if (posLower.includes("guarda-redes") || posLower.includes("guarda redes")) {
    zoneLabel = "Área de Baliza Própria";
    heatDescription = "Actuação estritamente defensiva na proteção do golo.";
    stats = { defensiveThird: "95%", midfieldThird: "5%", attackingThird: "0%" };
    spots = [
      { bottom: "8%", left: "calc(50% - 20px)", size: "w-10 h-10", color: "bg-red-500/40", pulseDelay: 0 },
      { bottom: "5%", left: "calc(50% - 32px)", size: "w-16 h-16", color: "bg-red-500/25", pulseDelay: 0.2 },
      { bottom: "12%", left: "calc(50% - 48px)", size: "w-24 h-16", color: "bg-red-500/15", pulseDelay: 0.4 },
    ];
  } else if (posLower.includes("defesa esquerdo") || posLower.includes("ala esquerda")) {
    zoneLabel = "Ala Esquerda Recuada/Média";
    heatDescription = "Forte presença na faixa esquerda defensiva, com incursões de apoio até à linha média.";
    stats = { defensiveThird: "55%", midfieldThird: "35%", attackingThird: "10%" };
    spots = [
      { bottom: "25%", left: "8%", size: "w-12 h-20", color: "bg-red-500/35", pulseDelay: 0.1 },
      { bottom: "45%", left: "10%", size: "w-10 h-16", color: "bg-red-500/25", pulseDelay: 0.3 },
      { bottom: "15%", left: "12%", size: "w-14 h-16", color: "bg-red-500/20", pulseDelay: 0.5 },
      { bottom: "65%", left: "15%", size: "w-8 h-12", color: "bg-red-500/15", pulseDelay: 0.2 },
    ];
  } else if (posLower.includes("defesa")) {
    zoneLabel = "Terço Defensivo Central";
    heatDescription = "Muralha defensiva central. Acção concentrada na entrada e interior da grande área recuada.";
    stats = { defensiveThird: "75%", midfieldThird: "20%", attackingThird: "5%" };
    spots = [
      { bottom: "20%", left: "calc(50% - 24px)", size: "w-12 h-12", color: "bg-amber-500/40", pulseDelay: 0.1 },
      { bottom: "15%", left: "calc(50% - 40px)", size: "w-20 h-12", color: "bg-amber-500/25", pulseDelay: 0.3 },
      { bottom: "30%", left: "calc(50% - 28px)", size: "w-14 h-14", color: "bg-amber-500/20", pulseDelay: 0.5 },
    ];
  } else if (posLower === "extremo" || posLower.includes("extremo") || posLower.includes("médio / extremo")) {
    const isRightWinger = playerId === "gibele" || playerId === "jaredi";
    if (isRightWinger) {
      zoneLabel = "Corredor Lateral Direito Ofensivo";
      heatDescription = "Aceleração e cruzamentos do corredor direito, com diagonais para dentro da grande área.";
      stats = { defensiveThird: "10%", midfieldThird: "35%", attackingThird: "55%" };
      spots = [
        { top: "20%", right: "8%", size: "w-12 h-24", color: "bg-amber-500/40", pulseDelay: 0.2 },
        { top: "35%", right: "12%", size: "w-10 h-16", color: "bg-amber-500/30", pulseDelay: 0.4 },
        { top: "15%", right: "25%", size: "w-12 h-12", color: "bg-red-500/30", pulseDelay: 0.1 },
        { top: "45%", right: "15%", size: "w-8 h-12", color: "bg-amber-500/15", pulseDelay: 0.5 },
      ];
    } else {
      zoneLabel = "Ala Ofensiva (Esquerda/Direita)";
      heatDescription = "Pressão e velocidade na ala. Linha de fundo e passes de rutura para a área de finalização.";
      stats = { defensiveThird: "10%", midfieldThird: "40%", attackingThird: "50%" };
      spots = [
        { top: "25%", left: "10%", size: "w-12 h-20", color: "bg-red-500/35", pulseDelay: 0.1 },
        { top: "25%", right: "12%", size: "w-10 h-16", color: "bg-red-500/25", pulseDelay: 0.3 },
        { top: "40%", left: "15%", size: "w-10 h-12", color: "bg-amber-500/20", pulseDelay: 0.5 },
        { top: "15%", left: "20%", size: "w-8 h-10", color: "bg-red-500/30", pulseDelay: 0.2 },
      ];
    }
  } else if (posLower.includes("médio ofensivo") || posLower.includes("ofensivo")) {
    zoneLabel = "Entre Linhas (Zone 14)";
    heatDescription = "Posicionamento estratégico à boca da grande área. Elevada taxa de assistências e remates.";
    stats = { defensiveThird: "15%", midfieldThird: "45%", attackingThird: "40%" };
    spots = [
      { top: "28%", left: "calc(50% - 24px)", size: "w-12 h-12", color: "bg-red-500/45", pulseDelay: 0.1 },
      { top: "35%", left: "calc(50% - 36px)", size: "w-18 h-18", color: "bg-red-500/30", pulseDelay: 0.3 },
      { top: "22%", left: "calc(50% - 16px)", size: "w-8 h-8", color: "bg-red-500/40", pulseDelay: 0.5 },
      { top: "30%", left: "calc(50% - 60px)", size: "w-30 h-12", color: "bg-amber-500/20", pulseDelay: 0.2 },
    ];
  } else if (posLower.includes("médio")) {
    zoneLabel = "Círculo Central & Box-to-Box";
    heatDescription = "Construção de jogo de transição. Distribuição fluida e contenção na faixa central do campo.";
    stats = { defensiveThird: "25%", midfieldThird: "55%", attackingThird: "20%" };
    spots = [
      { top: "calc(50% - 20px)", left: "calc(50% - 20px)", size: "w-10 h-10", color: "bg-amber-500/40", pulseDelay: 0 },
      { top: "calc(50% - 32px)", left: "calc(50% - 32px)", size: "w-16 h-16", color: "bg-amber-500/30", pulseDelay: 0.2 },
      { top: "calc(45% - 40px)", left: "calc(45% - 40px)", size: "w-20 h-20", color: "bg-amber-500/20", pulseDelay: 0.4 },
      { top: "calc(55% - 24px)", left: "calc(55% - 24px)", size: "w-12 h-12", color: "bg-amber-500/20", pulseDelay: 0.6 },
    ];
  } else if (posLower.includes("avançado") || posLower.includes("avancado")) {
    zoneLabel = "Grande Área Adversária";
    heatDescription = "Área de finalização. Presença centralizada na grande área do oponente, com forte pressão de golo.";
    stats = { defensiveThird: "5%", midfieldThird: "20%", attackingThird: "75%" };
    spots = [
      { top: "12%", left: "calc(50% - 24px)", size: "w-12 h-12", color: "bg-red-500/50", pulseDelay: 0.1 },
      { top: "18%", left: "calc(50% - 36px)", size: "w-18 h-18", color: "bg-red-500/35", pulseDelay: 0.3 },
      { top: "8%", left: "calc(50% - 16px)", size: "w-8 h-8", color: "bg-red-500/40", pulseDelay: 0.5 },
      { top: "25%", left: "calc(50% - 48px)", size: "w-24 h-16", color: "bg-red-500/15", pulseDelay: 0.2 },
    ];
  }

  return (
    <AnimatedCard variant="hud" className="bg-zinc-950/40 border-zinc-900 p-6 space-y-6 relative overflow-hidden">
      {/* Scanline sweep */}
      <motion.div
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent pointer-events-none z-0 shadow-[0_0_8px_rgba(210,21,21,0.5)]"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />

      <h3 className="text-md font-display text-white uppercase tracking-wider flex items-center gap-2 relative z-10">
        <Activity size={16} className="text-accent" /> Mapa de Calor Posicional
      </h3>

      <div className="grid grid-cols-1 gap-4 relative z-10">
        {/* The Pitch rendering */}
        <div className="relative w-full aspect-[2/3] max-w-[200px] mx-auto bg-zinc-900/60 rounded-xl border border-zinc-800/80 p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Field Lines */}
          <div className="absolute inset-4 border border-zinc-800/40">
            {/* Halfway Line */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-800/40 -translate-y-1/2" />
            
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 w-14 h-14 border border-zinc-800/40 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-zinc-800/50 rounded-full -translate-x-1/2 -translate-y-1/2" />

            {/* Penalty Box Top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 border-b border-x border-zinc-800/40">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2.5 border-b border-x border-zinc-800/20" />
            </div>

            {/* Penalty Box Bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 border-t border-x border-zinc-800/40">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-2.5 border-t border-x border-zinc-800/20" />
            </div>
          </div>

          {/* Heat spots overlays */}
          {spots.map((spot, idx) => {
            const posStyle: React.CSSProperties = {};
            if (spot.top) posStyle.top = spot.top;
            if (spot.bottom) posStyle.bottom = spot.bottom;
            if (spot.left) posStyle.left = spot.left;
            if (spot.right) posStyle.right = spot.right;

            return (
              <motion.div
                key={idx}
                style={posStyle}
                className={`absolute rounded-full filter blur-[12px] mix-blend-screen pointer-events-none ${spot.size} ${spot.color}`}
                animate={{
                  scale: [0.95, 1.1, 0.95],
                  opacity: [0.75, 0.95, 0.75]
                }}
                transition={{
                  duration: 3 + idx,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: spot.pulseDelay || 0
                }}
              />
            );
          })}
        </div>

        {/* Heat Details metadata */}
        <div className="space-y-4 font-mono text-[11px] border-t border-zinc-900/60 pt-4">
          <div>
            <span className="text-zinc-500 uppercase block text-[9px] mb-0.5">Foco de Acção Principal</span>
            <span className="font-bold text-white uppercase text-xs">{zoneLabel}</span>
          </div>
          <p className="text-zinc-400 text-[10px] leading-relaxed">
            {heatDescription}
          </p>
          
          {/* Positional distribution bars */}
          <div className="space-y-2 text-[9px] text-zinc-500 uppercase pt-2 border-t border-zinc-900/40">
            <span className="block mb-1 text-zinc-400 font-semibold">Território Ocupado</span>
            
            <div className="flex items-center justify-between gap-2">
              <span className="w-16">Defesa:</span>
              <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-red-500/60 rounded-full" style={{ width: stats.defensiveThird }} />
              </div>
              <span className="w-8 text-right font-bold text-zinc-400">{stats.defensiveThird}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="w-16">Meio-Campo:</span>
              <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500/60 rounded-full" style={{ width: stats.midfieldThird }} />
              </div>
              <span className="w-8 text-right font-bold text-zinc-400">{stats.midfieldThird}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="w-16">Ataque:</span>
              <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-green-500/60 rounded-full" style={{ width: stats.attackingThird }} />
              </div>
              <span className="w-8 text-right font-bold text-zinc-400">{stats.attackingThird}</span>
            </div>
          </div>
        </div>

      </div>
    </AnimatedCard>
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

          {/* Heatmap Field */}
          <HeatmapField position={player.position} playerId={player.id} />

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
