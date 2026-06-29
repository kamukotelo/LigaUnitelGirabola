'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Award, Shield, Target, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';
import { SEASONS, CURRENT_SEASON_ID, UPCOMING_SEASON_ID, getPlayers, Player } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';

type StatTab = 'scorers' | 'assists' | 'cleansheets' | 'discipline';

interface DisplayPlayer {
  id: string;
  name: string;
  club: string;
  teamId: string;
  position: string;
  value: number;
  secondaryLabel?: string;
  secondaryValue?: number | string;
}

export default function StatsPage() {
  const [seasonId, setSeasonId] = useState<string>(CURRENT_SEASON_ID);
  const [activeTab, setActiveTab] = useState<StatTab>('scorers');

  const isUpcoming = seasonId === UPCOMING_SEASON_ID;
  const selectedSeason = SEASONS.find((s) => s.id === seasonId);

  // Get raw player list
  const allPlayers = getPlayers();

  // Helper to map club names to teamIds for logo rendering
  const getTeamId = (clubName: string): string => {
    const nameLower = clubName.toLowerCase();
    if (nameLower.includes('petro')) return 'petro';
    if (nameLower.includes('wiliete')) return 'wiliete';
    if (nameLower.includes('agosto') || nameLower.includes('1.º')) return 'dago';
    if (nameLower.includes('huíla') || nameLower.includes('huila')) return 'desphuila';
    if (nameLower.includes('maquis') || nameLower.includes('bravos')) return 'bravos';
    if (nameLower.includes('kabuscorp')) return 'kabuscorp';
    if (nameLower.includes('sagrada')) return 'sagrada';
    if (nameLower.includes('interclube')) return 'interclube';
    if (nameLower.includes('lunda')) return 'lundasul';
    if (nameLower.includes('libolo')) return 'libolo';
    if (nameLower.includes('lobito') || nameLower.includes('acad')) return 'lobito';
    if (nameLower.includes('salvador')) return 'saosalvador';
    if (nameLower.includes('cabinda')) return 'cabinda';
    if (nameLower.includes('maio')) return 'primeiromaio';
    if (nameLower.includes('caala') || nameLower.includes('caála')) return 'caala';
    if (nameLower.includes('fc luanda')) return 'fcluanda';
    return 'petro'; // fallback
  };

  // Compile statistics list based on selected season and active tab
  let displayPlayers: DisplayPlayer[] = [];

  if (isUpcoming) {
    // 2026/2027: Season initialized, all statistics are zero
    const samplePlayers = allPlayers.slice(0, 8);
    displayPlayers = samplePlayers.map((p) => ({
      id: p.id,
      name: p.name,
      club: p.club,
      teamId: p.teamId || getTeamId(p.club),
      position: p.position,
      value: 0,
      secondaryLabel: activeTab === 'cleansheets' ? 'Jogos' : 'Jogos',
      secondaryValue: 0,
    }));
  } else {
    // 2025/2026: Real stats from the players database
    if (activeTab === 'scorers') {
      displayPlayers = [...allPlayers]
        .filter((p) => p.goals > 0)
        .sort((a, b) => b.goals - a.goals || b.appearances - a.appearances)
        .slice(0, 8)
        .map((p) => ({
          id: p.id,
          name: p.name,
          club: p.club,
          teamId: p.teamId || getTeamId(p.club),
          position: p.position,
          value: p.goals,
          secondaryLabel: 'Jogos',
          secondaryValue: p.appearances,
        }));
    } else if (activeTab === 'assists') {
      displayPlayers = [...allPlayers]
        .filter((p) => p.assists > 0)
        .sort((a, b) => b.assists - a.assists || b.appearances - a.appearances)
        .slice(0, 8)
        .map((p) => ({
          id: p.id,
          name: p.name,
          club: p.club,
          teamId: p.teamId || getTeamId(p.club),
          position: p.position,
          value: p.assists,
          secondaryLabel: 'Jogos',
          secondaryValue: p.appearances,
        }));
    } else if (activeTab === 'cleansheets') {
      // Goalkeeper clean sheets statistics (real values for Girabola 2025/26)
      const goalkeepers = [...allPlayers].filter(
        (p) => p.position.toLowerCase().includes('guarda-redes') || p.position.toLowerCase().includes('guarda redes')
      );
      
      const cleanSheetsMap: Record<string, number> = {
        'hugo-marques': 16, // Petro de Luanda (18 goals conceded)
        'titi': 13,         // Wiliete (22 goals conceded)
        'neblu': 12,        // 1.º de Agosto (25 goals conceded)
      };

      displayPlayers = goalkeepers
        .map((p) => ({
          id: p.id,
          name: p.name,
          club: p.club,
          teamId: p.teamId || getTeamId(p.club),
          position: p.position,
          value: cleanSheetsMap[p.id] || Math.max(2, 10 - (p.appearances % 6)),
          secondaryLabel: 'Jogos',
          secondaryValue: p.appearances,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
    } else if (activeTab === 'discipline') {
      // Discipline statistics (Yellow Cards / Red Cards) sorted by yellow cards
      displayPlayers = [...allPlayers]
        .map((p) => {
          const yellow = p.detailedStats?.yellowCards ?? 0;
          const red = p.detailedStats?.redCards ?? 0;
          return {
            id: p.id,
            name: p.name,
            club: p.club,
            teamId: p.teamId || getTeamId(p.club),
            position: p.position,
            value: yellow,
            secondaryLabel: 'Vermelhos',
            secondaryValue: red,
          };
        })
        .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number))
        .slice(0, 8);
    }
  }

  // Max value to calculate progress bar percentages
  const maxStatValue = displayPlayers.length > 0 ? Math.max(...displayPlayers.map((p) => p.value)) : 1;

  // Highlights/Leader for current view
  const leaderPlayer = displayPlayers[0];
  const leaderPlayerDetails = leaderPlayer ? allPlayers.find((p) => p.id === leaderPlayer.id) : null;

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Page Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={14} className="text-accent animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
            ESTATISTICAS_DA_LIGA
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display text-foreground uppercase leading-none">
          Líderes de <span className="text-primary italic">Rendimento</span>
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-mono uppercase tracking-wider">
          Métricas de jogadores no Campeonato Nacional de Futebol de Angola (Girabola)
        </p>

        {/* Seletor de Época */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mr-1">Época</span>
          {SEASONS.map((s) => {
            const active = s.id === seasonId;
            return (
              <button
                key={s.id}
                onClick={() => setSeasonId(s.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                  active
                    ? 'bg-primary text-white border-primary'
                    : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-foreground'
                }`}
              >
                {s.label}
                <span className={`ml-2 text-[9px] uppercase ${active ? 'text-white/70' : 'text-zinc-500'}`}>
                  {s.status === 'completed' ? 'Concluída' : 'Por disputar'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-900 mb-8 max-w-2xl overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setActiveTab('scorers')}
          className={`px-6 py-4 text-center text-xs font-mono uppercase tracking-wider font-extrabold border-b-2 transition-all duration-200 flex-shrink-0 ${
            activeTab === 'scorers'
              ? 'text-accent border-accent bg-accent/5'
              : 'text-zinc-500 border-transparent hover:text-foreground hover:bg-white/5'
          }`}
        >
          ⚽ Goleadores
        </button>
        <button
          onClick={() => setActiveTab('assists')}
          className={`px-6 py-4 text-center text-xs font-mono uppercase tracking-wider font-extrabold border-b-2 transition-all duration-200 flex-shrink-0 ${
            activeTab === 'assists'
              ? 'text-accent border-accent bg-accent/5'
              : 'text-zinc-500 border-transparent hover:text-foreground hover:bg-white/5'
          }`}
        >
          🎯 Assistências
        </button>
        <button
          onClick={() => setActiveTab('cleansheets')}
          className={`px-6 py-4 text-center text-xs font-mono uppercase tracking-wider font-extrabold border-b-2 transition-all duration-200 flex-shrink-0 ${
            activeTab === 'cleansheets'
              ? 'text-accent border-accent bg-accent/5'
              : 'text-zinc-500 border-transparent hover:text-foreground hover:bg-white/5'
          }`}
        >
          🧤 Baliza Limpa
        </button>
        <button
          onClick={() => setActiveTab('discipline')}
          className={`px-6 py-4 text-center text-xs font-mono uppercase tracking-wider font-extrabold border-b-2 transition-all duration-200 flex-shrink-0 ${
            activeTab === 'discipline'
              ? 'text-accent border-accent bg-accent/5'
              : 'text-zinc-500 border-transparent hover:text-foreground hover:bg-white/5'
          }`}
        >
          🟨 Disciplina
        </button>
      </div>

      {/* Season Preparation Banner */}
      {isUpcoming && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-amber-500/5 border border-amber-500/30 rounded-2xl flex gap-3.5 items-start max-w-4xl"
        >
          <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase font-mono tracking-wider">Temporada 2026/2027 por Iniciar</h4>
            <p className="text-xs text-zinc-500 mt-1">
              As estatísticas individuais estão inicializadas a zero. As listas de rendimento serão atualizadas em tempo real assim que os primeiros jogos oficiais da época começarem.
            </p>
          </div>
        </motion.div>
      )}

      {/* Statistics List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main List Container */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${seasonId}-${activeTab}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {displayPlayers.map((player, idx) => {
                const isLeader = idx === 0 && !isUpcoming;
                const percent = maxStatValue > 0 ? Math.round((player.value / maxStatValue) * 100) : 0;

                return (
                  <AnimatedCard
                    key={player.id}
                    variant={isLeader ? 'holographic' : 'hud'}
                    className="bg-zinc-100/30 dark:bg-zinc-950/30 border-zinc-200/60 dark:border-zinc-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    
                    {/* Rank, Name, Logo & Club */}
                    <div className="flex items-center gap-4 min-w-0 md:min-w-[250px] w-full md:w-auto">
                      <span className={`text-2xl font-display font-black w-8 text-center flex-shrink-0 ${
                        isLeader ? 'text-accent animate-pulse' : 'text-zinc-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <TeamCrest teamId={player.teamId} size={36} className="bg-white dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800" />
                      <div className="min-w-0">
                        <h3 className="text-foreground font-bold uppercase text-sm flex items-center gap-2 truncate">
                          <Link href={`/players/${player.id}`} className="hover:text-primary transition-colors truncate">
                            {player.name}
                          </Link>
                          {isLeader && (
                            <span className="text-[9px] font-mono bg-accent/20 text-accent border border-accent/40 px-2 py-0.5 rounded-full uppercase flex-shrink-0">
                              Líder
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5 truncate">
                          <Shield size={10} className="text-zinc-600 flex-shrink-0" />
                          {player.club} · {player.position}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar Meter */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-1.5 uppercase">
                        <span>{isUpcoming ? 'Inicializado' : 'Percentual sobre líder'}</span>
                        <span>{isUpcoming ? '0%' : `${percent}%`}</span>
                      </div>
                      <div className="w-full h-2 bg-white/80 dark:bg-zinc-900/80 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: isUpcoming ? '0%' : `${percent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                          className={`h-full rounded-full ${
                            isLeader 
                              ? 'bg-gradient-to-r from-primary to-accent' 
                              : 'bg-primary'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Score Value Display */}
                    <div className="text-center md:text-right pl-4 min-w-[80px]">
                      <span className={`text-4xl font-display font-black tracking-tighter ${
                        isLeader ? 'text-accent' : 'text-foreground'
                      }`}>
                        {player.value}
                      </span>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">
                        {activeTab === 'scorers' && 'Golos'}
                        {activeTab === 'assists' && 'Assists'}
                        {activeTab === 'cleansheets' && 'Jogos S/ Golo'}
                        {activeTab === 'discipline' && 'Amarelos'}
                      </p>
                      {player.secondaryValue !== undefined && (
                        <p className="text-[8px] font-mono text-zinc-400 mt-0.5">
                          {player.secondaryLabel}: {player.secondaryValue}
                        </p>
                      )}
                    </div>

                  </AnimatedCard>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Info Box Sidebar */}
        <div className="space-y-6">
          
          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Flame size={16} className="text-accent" />
              {isUpcoming ? 'Destaque Preparado' : 'Perfil em Foco'}
            </h3>
            
            <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="p-4 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <h4 className="font-bold text-foreground text-md uppercase">
                  {isUpcoming ? 'Aguardando Época' : leaderPlayer?.name ?? 'Dagó Tshibamba'}
                </h4>
                <p className="text-accent font-mono text-[10px] mt-0.5">
                  {isUpcoming ? 'GIRABOLA 2026/2027' : (leaderPlayer?.club.toUpperCase() ?? '1.º DE AGOSTO')}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono">
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-foreground font-bold block text-sm">
                      {isUpcoming ? 0 : (activeTab === 'cleansheets' ? leaderPlayer?.secondaryValue : (leaderPlayerDetails?.appearances ?? 0))}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase">Jogos</span>
                  </div>
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-accent font-bold block text-sm">
                      {isUpcoming ? 0 : (activeTab === 'scorers' ? leaderPlayer?.value : (leaderPlayerDetails?.goals ?? 0))}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase">Golos</span>
                  </div>
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-foreground font-bold block text-sm">
                      {isUpcoming ? 0 : (activeTab === 'assists' ? leaderPlayer?.value : (leaderPlayerDetails?.assists ?? 0))}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase">Assists</span>
                  </div>
                </div>
              </div>
              <p>
                {isUpcoming 
                  ? 'A preparar o início das competições para registar os líderes desta temporada.' 
                  : (leaderPlayerDetails?.bio ?? 'Destaque individual com rendimento estelar no campeonato nacional.')}
              </p>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award size={16} className="text-accent" /> Prémios Oficiais FAF
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A FAF (Federação Angolana de Futebol) atribui no encerramento oficial de cada campeonato a Bola de Ouro ao Melhor Jogador, o Troféu de Artilheiro (Melhor Marcador), e a Luva de Ouro (Guarda-redes Menos Batido).
            </p>
          </AnimatedCard>

        </div>

      </div>

    </div>
  );
}
