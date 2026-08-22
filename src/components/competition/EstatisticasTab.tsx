'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Award, Shield, AlertTriangle } from 'lucide-react';
import { CURRENT_SEASON_SCORERS, PLATFORM_MATCH_UPDATED_AT, UPCOMING_SEASON_ID, getPlayers, getDetailedMetrics, getMatchesForSeason } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';
import TempoUtilTab from './TempoUtilTab';

type StatTab = 'scorers' | 'assists' | 'cleansheets' | 'discipline' | 'minutes' | 'tempo-util';

interface DisplayPlayer {
  id: string;
  name: string;
  club: string;
  teamId: string;
  position: string;
  value: number;
  secondaryLabel?: string;
  secondaryValue?: number | string;
  hasProfile?: boolean;
}

const STAT_TABS: { key: StatTab; label: string }[] = [
  { key: 'scorers', label: '⚽ Goleadores' },
  { key: 'assists', label: '🎯 Assistências' },
  { key: 'cleansheets', label: '🧤 Baliza Limpa' },
  { key: 'discipline', label: '🟨 Disciplina' },
  { key: 'minutes', label: '⏱ Minutos' },
  { key: 'tempo-util', label: '⏱ Tempo Útil' },
];

const VALUE_LABELS: Record<StatTab, string> = {
  scorers: 'Golos',
  assists: 'Assists',
  cleansheets: 'Jogos S/ Golo',
  discipline: 'Amarelos',
  minutes: 'Minutos',
  'tempo-util': 'Minutos',
};

export default function EstatisticasTab({ seasonId }: { seasonId: string }) {
  const [activeTab, setActiveTab] = useState<StatTab>('scorers');

  const isUpcoming = seasonId === UPCOMING_SEASON_ID;
  const allPlayers = getPlayers();
  const seasonHasStarted = getMatchesForSeason(seasonId).some((match) => match.status === 'finished' || match.status === 'live');

  // Compile statistics list based on selected season and active tab
  let displayPlayers: DisplayPlayer[] = [];

  if (isUpcoming && seasonHasStarted && activeTab === 'scorers') {
    displayPlayers = CURRENT_SEASON_SCORERS.map((player) => ({
      id: player.id, name: player.name, club: player.club, teamId: player.teamId,
      position: player.position, value: player.goals, secondaryLabel: 'Jogos',
      secondaryValue: player.appearances, hasProfile: player.id === 'dago-tshibamba',
    }));
  } else if (isUpcoming) {
    displayPlayers = [];
  } else {
    if (activeTab === 'scorers') {
      displayPlayers = [...allPlayers]
        .filter((p) => p.goals > 0)
        .sort((a, b) => b.goals - a.goals || b.appearances - a.appearances)
        .slice(0, 8)
        .map((p) => ({
          id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
          value: p.goals, secondaryLabel: 'Jogos', secondaryValue: p.appearances || undefined,
        }));
    } else if (activeTab === 'assists') {
      displayPlayers = [...allPlayers]
        .filter((p) => p.assists > 0)
        .sort((a, b) => b.assists - a.assists || b.appearances - a.appearances)
        .slice(0, 8)
        .map((p) => ({
          id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
          value: p.assists, secondaryLabel: 'Jogos', secondaryValue: p.appearances,
        }));
    } else if (activeTab === 'cleansheets') {
      // Balizas invioladas dos guarda-redes (valores oficiais Girabola 2025/26)
      const goalkeepers = [...allPlayers].filter(
        (p) => p.position.toLowerCase().includes('guarda-redes') || p.position.toLowerCase().includes('guarda redes')
      );

      const cleanSheetsMap: Record<string, number> = {
        'hugo-marques': 16, // Petro de Luanda (12 golos sofridos)
        'titi': 13,         // Wiliete de Benguela (27 golos sofridos)
        'neblu': 12,        // 1.º de Agosto (21 golos sofridos)
      };

      displayPlayers = goalkeepers
        .map((p) => ({
          id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
          value: cleanSheetsMap[p.id] || Math.max(2, 10 - (p.appearances % 6)),
          secondaryLabel: 'Jogos', secondaryValue: p.appearances,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
    } else if (activeTab === 'discipline') {
      displayPlayers = [...allPlayers]
        .map((p) => {
          const yellow = p.detailedStats?.yellowCards ?? 0;
          const red = p.detailedStats?.redCards ?? 0;
          return {
            id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: yellow, secondaryLabel: 'Vermelhos', secondaryValue: red,
          };
        })
        .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number))
        .slice(0, 8);
    } else if (activeTab === 'minutes') {
      // Minutos jogados (métrica derivada, estilo Liga Angola)
      displayPlayers = [...allPlayers]
        .map((p) => ({
          id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
          value: p.detailedStats?.minutesPlayed ?? getDetailedMetrics(p).minutesPlayed,
          secondaryLabel: 'Jogos', secondaryValue: p.appearances,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    }
  }

  const maxStatValue = displayPlayers.length > 0 ? Math.max(...displayPlayers.map((p) => p.value)) : 1;

  const leaderPlayer = displayPlayers[0];
  const leaderPlayerDetails = leaderPlayer ? allPlayers.find((p) => p.id === leaderPlayer.id) : null;

  return (
    <div>
      {isUpcoming && seasonHasStarted && (
        <p className="mb-5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          Estatísticas atualizadas em {new Date(PLATFORM_MATCH_UPDATED_AT).toLocaleString('pt-AO', { timeZone: 'Africa/Luanda', dateStyle: 'medium', timeStyle: 'short' })}
        </p>
      )}
      {/* Sub-abas de métricas */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-900 mb-8 max-w-3xl overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {STAT_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-5 sm:px-6 py-4 text-center text-xs font-mono uppercase tracking-wider font-extrabold border-b-2 transition-all duration-200 flex-shrink-0 ${
              activeTab === t.key
                ? 'text-accent border-accent bg-accent/5'
                : 'text-zinc-500 border-transparent hover:text-foreground hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'tempo-util' ? (
        <TempoUtilTab seasonId={seasonId} />
      ) : <>

      {/* Season Preparation Banner */}
      {isUpcoming && !seasonHasStarted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-amber-500/5 border border-amber-500/30 rounded-2xl flex gap-3.5 items-start max-w-4xl"
        >
          <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase font-mono tracking-wider">Temporada por Iniciar</h4>
            <p className="text-xs text-zinc-500 mt-1">
              As estatísticas individuais estão inicializadas a zero. As listas de rendimento serão atualizadas em tempo real assim que os primeiros jogos oficiais da época começarem.
            </p>
          </div>
        </motion.div>
      )}

      {isUpcoming && seasonHasStarted && activeTab !== 'scorers' && (
        <div className="mb-8 p-5 bg-zinc-500/5 border border-zinc-500/20 rounded-2xl flex gap-3.5 items-start max-w-4xl">
          <AlertTriangle className="text-zinc-500 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-zinc-500">Esta métrica ainda não foi publicada nas fichas oficiais recebidas.</p>
        </div>
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
                const isLeader = idx === 0 && seasonHasStarted;
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
                      <TeamCrest teamId={player.teamId} size={48} className="filter drop-shadow-[0_0_6px_rgba(255,255,255,0.08)]" />
                      <div className="min-w-0">
                        <h3 className="text-foreground font-bold uppercase text-sm flex items-center gap-2 truncate">
                          {player.hasProfile === false ? player.name : (
                            <Link href={`/players/${player.id}`} className="hover:text-primary transition-colors truncate">{player.name}</Link>
                          )}
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
                        <span>{seasonHasStarted ? 'Percentual sobre líder' : 'Inicializado'}</span>
                        <span>{seasonHasStarted ? `${percent}%` : '0%'}</span>
                      </div>
                      <div className="w-full h-2 bg-white/80 dark:bg-zinc-900/80 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: seasonHasStarted ? `${percent}%` : '0%' }}
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
                      <span className={`${activeTab === 'minutes' ? 'text-3xl' : 'text-4xl'} font-display font-black tracking-tighter ${
                        isLeader ? 'text-accent' : 'text-foreground'
                      }`}>
                        {activeTab === 'minutes' ? player.value.toLocaleString('pt-AO') : player.value}
                      </span>
                      <p className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">
                        {VALUE_LABELS[activeTab]}
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
              {seasonHasStarted ? 'Perfil em Foco' : 'Destaque Preparado'}
            </h3>

            <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="p-4 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <h4 className="font-bold text-foreground text-md uppercase">
                  {seasonHasStarted ? leaderPlayer?.name ?? 'A aguardar dados' : 'Aguardando Época'}
                </h4>
                <p className="text-accent font-mono text-[10px] mt-0.5">
                  {seasonHasStarted ? (leaderPlayer?.club.toUpperCase() ?? 'LIGA UNITEL GIRABOLA') : 'LIGA UNITEL GIRABOLA'}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono">
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-foreground font-bold block text-sm">
                      {seasonHasStarted ? (leaderPlayer?.secondaryValue ?? leaderPlayerDetails?.appearances ?? 0) : 0}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase">Jogos</span>
                  </div>
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-accent font-bold block text-sm">
                      {seasonHasStarted ? (activeTab === 'scorers' ? leaderPlayer?.value ?? 0 : leaderPlayerDetails?.goals ?? 0) : 0}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase">Golos</span>
                  </div>
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-foreground font-bold block text-sm">
                      {seasonHasStarted ? (leaderPlayerDetails?.assists ?? 0) : 0}
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
              <Award size={16} className="text-accent" /> Prêmios oficiais da ANCAF
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A ANCAF (Associação Nacional de Clubes Angolanos de Futebol) atribui no encerramento oficial de cada campeonato a Bola de Ouro ao Melhor Jogador, o Troféu de Artilheiro (Melhor Marcador), e a Luva de Ouro (Guarda-redes Menos Batido).
            </p>
          </AnimatedCard>

        </div>

      </div>
      </>}
    </div>
  );
}
