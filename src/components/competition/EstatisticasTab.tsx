'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Award, Shield, AlertTriangle, CheckCircle2, Clock3, Filter } from 'lucide-react';
import { CURRENT_SEASON_SCORERS, getSeasonResultsUpdatedAt, UPCOMING_SEASON_ID, getPlayers, getCurrentSeasonCardReconciliation, getCurrentSeasonGoalReconciliation, getCurrentSeasonDiscipline, getCurrentSeasonAssists, getCurrentSeasonCleanSheets, getCurrentSeasonMinutesPlayed, getCurrentSeasonMinutesCoverage, getMatchesForSeason, getTeamFullName, getSeasonTeams } from '@/lib/data';
import {
  HISTORICAL_SCORERS_2025_26,
  HISTORICAL_ASSISTS_2025_26,
  HISTORICAL_CLEAN_SHEETS_2025_26,
  HISTORICAL_DISCIPLINE_2025_26,
} from '@/lib/historical-results-2025-26';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';
import AdvancedStatistics from './AdvancedStatistics';
import SeasonComparisonMatrix from './SeasonComparisonMatrix';

type StatTab = 'scorers' | 'assists' | 'cleansheets' | 'yellowcards' | 'redcards' | 'minutes';

/** Lugares apresentados em cada ranking, aplicados **depois** dos filtros. */
const RANKING_SIZE = 30;
const HISTORICAL_RANKING_SIZE = 15;
const LEGACY_RANKING_SIZE = 8;

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

/** Concordância de número nos totais de cartões ("1 amarelo", "12 amarelos"). */
function cardsLabel(yellow: number, red: number): string {
  const amarelos = `${yellow} ${yellow === 1 ? 'amarelo' : 'amarelos'}`;
  const vermelhos = `${red} ${red === 1 ? 'vermelho' : 'vermelhos'}`;
  return `${amarelos} e ${vermelhos}`;
}

const STAT_TABS: { key: StatTab; label: string }[] = [
  { key: 'scorers', label: '⚽ Goleadores' },
  { key: 'assists', label: '🎯 Assistências' },
  { key: 'cleansheets', label: '🧤 Baliza Limpa' },
  { key: 'yellowcards', label: '🟨 Amarelos' },
  { key: 'redcards', label: '🟥 Vermelhos' },
  { key: 'minutes', label: '⏱ Minutos' },
];

const VALUE_LABELS: Record<StatTab, string> = {
  scorers: 'Golos',
  assists: 'Assistências',
  cleansheets: 'Balizas Limpas',
  yellowcards: 'Amarelos',
  redcards: 'Vermelhos',
  minutes: 'Minutos',
};

export default function EstatisticasTab({ seasonId }: { seasonId: string }) {
  const [activeTab, setActiveTab] = useState<StatTab>('scorers');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');

  const isUpcoming = seasonId === UPCOMING_SEASON_ID;
  const allPlayers = useMemo(() => getPlayers(), []);
  // Apenas os clubes que disputam esta época. `getAllTeams()` devolve também
  // promovidos e emblemas históricos de outras edições, o que enchia o seletor
  // com clubes sem um único jogo na temporada escolhida.
  const seasonTeams = useMemo(() => getSeasonTeams(seasonId), [seasonId]);
  const currentSeasonAssists = useMemo(() => getCurrentSeasonAssists(), []);
  const seasonHasStarted = getMatchesForSeason(seasonId).some((match) => match.status === 'finished' || match.status === 'live');

  // Um clube escolhido numa época deixa de fazer sentido ao mudar de época.
  const activeTeam = seasonTeams.some((team) => team.id === filterTeam) ? filterTeam : 'all';
  const activeTeamName = activeTeam === 'all' ? null : getTeamFullName(activeTeam, activeTeam);

  // Compile statistics list based on selected season and active tab
  const { displayPlayers, rankingSize } = useMemo(() => {
    let displayPlayers: DisplayPlayer[] = [];
    let rankingSize = RANKING_SIZE;

    if (isUpcoming && seasonHasStarted && activeTab === 'scorers') {
      displayPlayers = CURRENT_SEASON_SCORERS.map((player) => ({
        id: player.id, name: player.name, club: player.club, teamId: player.teamId,
        position: player.position, value: player.goals, secondaryLabel: 'Jogos',
        secondaryValue: player.appearances, hasProfile: true,
      })).sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
    } else if (isUpcoming && seasonHasStarted && activeTab === 'assists') {
      displayPlayers = currentSeasonAssists.map((player) => ({
        id: player.id, name: player.name, club: player.club, teamId: player.teamId,
        position: player.position, value: player.assists, secondaryLabel: 'Jogos',
        secondaryValue: player.appearances, hasProfile: true,
      }));
    } else if (isUpcoming && seasonHasStarted && activeTab === 'yellowcards') {
      displayPlayers = getCurrentSeasonDiscipline()
        .filter((player) => player.yellowCards > 0)
        .map((player) => ({
          id: player.id, name: player.name, club: player.club, teamId: player.teamId,
          position: player.position, value: player.yellowCards, secondaryLabel: 'Vermelhos',
          secondaryValue: player.redCards, hasProfile: true,
        }))
        .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
    } else if (isUpcoming && seasonHasStarted && activeTab === 'redcards') {
      displayPlayers = getCurrentSeasonDiscipline()
        .filter((player) => player.redCards > 0)
        .map((player) => ({
          id: player.id, name: player.name, club: player.club, teamId: player.teamId,
          position: player.position, value: player.redCards, secondaryLabel: 'Amarelos',
          secondaryValue: player.yellowCards, hasProfile: true,
        }))
        .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
    } else if (isUpcoming && seasonHasStarted && activeTab === 'cleansheets') {
      // Um guarda-redes que ainda não fechou a baliza não pertence a um ranking
      // de balizas limpas — aparecia com "0" apenas por ter fichas publicadas.
      displayPlayers = getCurrentSeasonCleanSheets()
        .filter((gk) => gk.cleanSheets > 0)
        .map((gk) => ({
          id: gk.id, name: gk.name, club: gk.club, teamId: gk.teamId,
          position: gk.position, value: gk.cleanSheets, secondaryLabel: 'Jogos',
          secondaryValue: gk.appearances, hasProfile: true,
        }));
    } else if (isUpcoming && seasonHasStarted && activeTab === 'minutes') {
      // Praticamente todo o plantel escalado entra nesta lista. O corte dos 30
      // primeiros é aplicado depois dos filtros, para que escolher um clube não
      // devolva apenas os atletas que já estavam no top 30 da prova inteira.
      displayPlayers = getCurrentSeasonMinutesPlayed().map((p) => ({
        id: p.id, name: p.name, club: p.club, teamId: p.teamId,
        position: p.position, value: p.minutesPlayed, secondaryLabel: 'Jogos',
        secondaryValue: p.appearances, hasProfile: true,
      }));
    } else if (isUpcoming) {
      displayPlayers = [];
    } else if (seasonId === '2025-26') {
      rankingSize = HISTORICAL_RANKING_SIZE;
      if (activeTab === 'scorers') {
        displayPlayers = HISTORICAL_SCORERS_2025_26.map((p, idx) => ({
          id: `hist-scorer-${idx}`,
          name: p.name,
          club: getTeamFullName(p.teamId, p.teamId),
          teamId: p.teamId,
          position: 'Avançado',
          value: p.goals,
          hasProfile: false,
        }));
      } else if (activeTab === 'assists') {
        displayPlayers = HISTORICAL_ASSISTS_2025_26.map((p, idx) => ({
          id: `hist-assist-${idx}`,
          name: p.name,
          club: getTeamFullName(p.teamId, p.teamId),
          teamId: p.teamId,
          position: 'Médio / Extremo',
          value: p.assists,
          hasProfile: false,
        }));
      } else if (activeTab === 'cleansheets') {
        displayPlayers = HISTORICAL_CLEAN_SHEETS_2025_26.map((gk) => ({
          id: gk.id,
          name: gk.name,
          club: gk.club,
          teamId: gk.teamId,
          position: 'Guarda-redes',
          value: gk.cleanSheets,
          secondaryLabel: 'Jogos',
          secondaryValue: gk.appearances,
          hasProfile: false,
        }));
      } else if (activeTab === 'yellowcards') {
        displayPlayers = HISTORICAL_DISCIPLINE_2025_26.map((p) => ({
          id: `hist-yc-${p.id}`, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
          value: p.yellow, secondaryLabel: 'Vermelhos', secondaryValue: p.red, hasProfile: false,
        })).sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
      } else if (activeTab === 'redcards') {
        displayPlayers = HISTORICAL_DISCIPLINE_2025_26
          .filter((p) => p.red > 0)
          .map((p) => ({
            id: `hist-rc-${p.id}`, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: p.red, secondaryLabel: 'Amarelos', secondaryValue: p.yellow, hasProfile: false,
          }))
          .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
      } else if (activeTab === 'minutes') {
        displayPlayers = [];
      }
    } else {
      rankingSize = LEGACY_RANKING_SIZE;
      if (activeTab === 'scorers') {
        displayPlayers = [...allPlayers]
          .filter((p) => p.goals > 0)
          .sort((a, b) => b.goals - a.goals || b.appearances - a.appearances)
          .map((p) => ({
            id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: p.goals, secondaryLabel: 'Jogos', secondaryValue: p.appearances || undefined,
          }));
      } else if (activeTab === 'assists') {
        displayPlayers = [...allPlayers]
          .filter((p) => p.assists > 0)
          .sort((a, b) => b.assists - a.assists || b.appearances - a.appearances)
          .map((p) => ({
            id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: p.assists, secondaryLabel: 'Jogos', secondaryValue: p.appearances,
          }));
      } else if (activeTab === 'cleansheets') {
        const goalkeepers = [...allPlayers].filter(
          (p) => p.position.toLowerCase().includes('guarda-redes') || p.position.toLowerCase().includes('guarda redes')
        );
        displayPlayers = goalkeepers
          .map((p) => ({
            id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: p.detailedStats?.cleanSheets ?? 0,
            secondaryLabel: 'Jogos', secondaryValue: p.appearances,
          }))
          .filter((p) => p.value > 0)
          .sort((a, b) => b.value - a.value);
      } else if (activeTab === 'yellowcards') {
        displayPlayers = [...allPlayers]
          .map((p) => ({
            id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: p.detailedStats?.yellowCards ?? 0, secondaryLabel: 'Vermelhos', secondaryValue: p.detailedStats?.redCards ?? 0,
          }))
          .filter((p) => p.value > 0)
          .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
      } else if (activeTab === 'redcards') {
        displayPlayers = [...allPlayers]
          .map((p) => ({
            id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: p.detailedStats?.redCards ?? 0, secondaryLabel: 'Amarelos', secondaryValue: p.detailedStats?.yellowCards ?? 0,
          }))
          .filter((p) => p.value > 0)
          .sort((a, b) => b.value - a.value || (b.secondaryValue as number) - (a.secondaryValue as number));
      } else if (activeTab === 'minutes') {
        displayPlayers = [...allPlayers]
          .filter((p) => p.statsVerified && p.detailedStats?.minutesPlayed !== undefined)
          .map((p) => ({
            id: p.id, name: p.name, club: p.club, teamId: p.teamId, position: p.position,
            value: p.detailedStats!.minutesPlayed,
            secondaryLabel: 'Jogos', secondaryValue: p.appearances,
          }))
          .sort((a, b) => b.value - a.value);
      }
    }

    return { displayPlayers, rankingSize };
  }, [isUpcoming, seasonHasStarted, activeTab, seasonId, allPlayers, currentSeasonAssists]);

  const minutesCoverage = getCurrentSeasonMinutesCoverage();
  const cardReconciliation = getCurrentSeasonCardReconciliation();
  const goalReconciliation = getCurrentSeasonGoalReconciliation();

  // Posição e percentagem são sempre medidas contra a prova inteira. Antes
  // eram recalculadas dentro da lista filtrada, pelo que escolher um clube
  // promovia a "Líder" o melhor atleta desse clube — mesmo com um só golo.
  const leagueMaxValue = displayPlayers.length > 0 ? Math.max(...displayPlayers.map((p) => p.value)) : 0;
  const leagueRankById = useMemo(() => {
    const ranks = new Map<string, number>();
    for (const player of displayPlayers) {
      ranks.set(player.id, displayPlayers.filter((candidate) => candidate.value > player.value).length + 1);
    }
    return ranks;
  }, [displayPlayers]);

  const filteredPlayers = useMemo(() => {
    return displayPlayers.filter((player) => {
      const matchTeam = activeTeam === 'all' || player.teamId === activeTeam;
      if (!matchTeam) return false;
      if (filterPosition === 'all') return true;
      const pos = (player.position || '').toLowerCase();
      if (filterPosition === 'GR') return pos.includes('guarda') || pos.includes('gr');
      if (filterPosition === 'DEF') return pos.includes('def');
      if (filterPosition === 'MED') return pos.includes('médio') || pos.includes('medio');
      if (filterPosition === 'AVA') return pos.includes('avan');
      return true;
    });
  }, [displayPlayers, activeTeam, filterPosition]);

  // Um plantel sem posição publicada desaparece de qualquer filtro de posição.
  // Em vez de os apagar em silêncio, dizemos quantos ficaram de fora.
  const withoutPosition = useMemo(() => displayPlayers.filter((player) => {
    if (activeTeam !== 'all' && player.teamId !== activeTeam) return false;
    const pos = (player.position || '').toLowerCase();
    return !pos || pos.includes('por confirmar');
  }).length, [displayPlayers, activeTeam]);

  const visiblePlayers = filteredPlayers.slice(0, rankingSize);

  // Melhor marca do clube selecionado, para distinguir um destaque isolado de
  // um registo repartido por vários companheiros de equipa.
  const clubBestValue = filteredPlayers.length > 0 ? Math.max(...filteredPlayers.map((p) => p.value)) : 0;
  const sharedClubBest = filteredPlayers.filter((p) => p.value === clubBestValue).length > 1;

  const leaderPlayer = visiblePlayers[0];
  const leaderPlayerDetails = leaderPlayer?.hasProfile === false
    ? null
    : leaderPlayer ? allPlayers.find((p) => p.id === leaderPlayer.id) ?? null : null;

  const leaderAppearances = leaderPlayer?.secondaryLabel === 'Jogos'
    ? leaderPlayer.secondaryValue
    : leaderPlayerDetails?.appearances;
  const leaderThirdLabel = leaderPlayer?.secondaryLabel && leaderPlayer.secondaryLabel !== 'Jogos'
    ? leaderPlayer.secondaryLabel
    : 'Assistências';
  const leaderThirdValue = leaderPlayer?.secondaryLabel && leaderPlayer.secondaryLabel !== 'Jogos'
    ? leaderPlayer.secondaryValue
    : leaderPlayerDetails?.assists;

  const currentSeasonAvailability = [
    { label: 'Goleadores', available: CURRENT_SEASON_SCORERS.length > 0 },
    { label: 'Cartões amarelos', available: getCurrentSeasonDiscipline().some((p) => p.yellowCards > 0) },
    { label: 'Cartões vermelhos', available: getCurrentSeasonDiscipline().some((p) => p.redCards > 0) },
    { label: 'Balizas limpas', available: getCurrentSeasonCleanSheets().some((gk) => gk.cleanSheets > 0) },
    { label: 'Minutos jogados', available: getCurrentSeasonMinutesPlayed().length > 0 },
    { label: 'Assistências', available: currentSeasonAssists.length > 0 },
  ];

  return (
    <div>
      {seasonId === '2025-26' && (
        <div className="mb-6 max-w-4xl rounded-2xl border border-zinc-200/80 bg-white/60 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/40">
          <p className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Award size={16} className="text-accent" />
            Consolidado Oficial da Temporada 2025/2026 (Métrica Base do Girabola)
          </p>
          <p className="mt-1 text-xs text-zinc-500 font-mono">
            Classificação estatística definitiva dos 240 jogos realizados no Girabola 2025/2026. Serve como métrica de referência oficial para a época 2026/2027.
          </p>
        </div>
      )}

      {isUpcoming && seasonHasStarted && (
        <div className="mb-6 max-w-4xl rounded-2xl border border-zinc-200 bg-white/40 p-4 dark:border-zinc-800 dark:bg-zinc-950/30">
          <p className="mb-3 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Estatísticas atualizadas em {new Date(getSeasonResultsUpdatedAt(seasonId)).toLocaleString('pt-AO', { timeZone: 'Africa/Luanda', dateStyle: 'medium', timeStyle: 'short' })}
          </p>
          <div className="flex flex-wrap gap-2" aria-label="Disponibilidade das estatísticas oficiais">
            {currentSeasonAvailability.map((metric) => (
              <span
                key={metric.label}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
                  metric.available
                    ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                }`}
              >
                {metric.available ? <CheckCircle2 size={12} /> : <Clock3 size={12} />}
                {metric.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filtro-mestre: governa os rankings individuais, o comparador entre
          temporadas e toda a análise avançada por baixo. */}
      <div className="mb-6 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-500 font-bold">
              <Filter size={14} className="text-accent" />
              <span>Filtrar:</span>
            </div>

            <select
              value={activeTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              aria-label="Filtrar todas as estatísticas por clube"
              className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">Todos os Clubes ({seasonTeams.length})</option>
              {seasonTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name || team.shortName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: 'all', label: 'Todas Posições' },
              { key: 'GR', label: 'Guarda-Redes' },
              { key: 'DEF', label: 'Defesas' },
              { key: 'MED', label: 'Médios' },
              { key: 'AVA', label: 'Avançados' },
            ].map((pos) => (
              <button
                key={pos.key}
                onClick={() => setFilterPosition(pos.key)}
                className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition-colors ${
                  filterPosition === pos.key
                    ? 'bg-accent text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-foreground'
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[10px] font-mono text-zinc-500">
          {activeTeamName
            ? `Clube selecionado: ${activeTeamName}. Os rankings individuais, o comparador entre temporadas e a análise avançada abaixo mostram apenas este clube — as posições continuam a ser as da prova inteira.`
            : 'O filtro de clube aplica-se aos rankings individuais, ao comparador entre temporadas e a toda a análise avançada desta página. O filtro de posição aplica-se apenas aos rankings individuais.'}
        </p>
      </div>

      {/* Módulo Comparador Geral de Temporadas */}
      <SeasonComparisonMatrix clubFilter={activeTeam} />

      {/* Sub-abas de métricas */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-900 mb-6 max-w-3xl overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      {isUpcoming && seasonHasStarted && displayPlayers.length === 0 && (
        <div className="mb-8 p-5 bg-zinc-500/5 border border-zinc-500/20 rounded-2xl flex gap-3.5 items-start max-w-4xl">
          <AlertTriangle className="text-zinc-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs font-semibold text-foreground">Esta métrica ainda aguarda dados oficiais.</p>
            <p className="mt-1 text-xs text-zinc-500">Os cartões e goleadores continuam visíveis porque já foram identificados nas fichas recebidas. Esta lista será preenchida quando a respetiva informação for importada, sem criar valores estimados.</p>
          </div>
        </div>
      )}

      {seasonId === '2025-26' && (activeTab === 'yellowcards' || activeTab === 'redcards') && (
        <div className="mb-8 p-4 bg-amber-500/5 border border-amber-500/30 rounded-2xl max-w-4xl">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Disciplina individual de 2025/2026 em consolidação editorial: o arquivo da época guarda os totais de cartões
            por jogo, mas não a súmula nominal de cada partida. Estes nomes são o apuramento editorial conhecido e não
            substituem a ficha individual — os totais por jogo, esses, estão no comparador acima.
          </p>
        </div>
      )}

      {seasonId === '2025-26' && activeTab === 'minutes' && (
        <div className="mb-8 p-4 bg-amber-500/5 border border-amber-500/30 rounded-2xl max-w-4xl">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Minutos por atleta em 2025/2026 não são publicados: o arquivo da época não inclui onzes iniciais nem
            cronologia de substituições, e sem isso qualquer número seria uma estimativa. A métrica fica disponível a
            partir de 2026/2027, onde é reconstruída a partir das fichas oficiais.
          </p>
        </div>
      )}

      {isUpcoming && seasonHasStarted && activeTab === 'scorers' && displayPlayers.length > 0 && goalReconciliation.goalsUnattributed > 0 && (
        <div className="mb-8 p-4 bg-zinc-500/5 border border-zinc-500/20 rounded-2xl max-w-4xl">
          <p className="text-xs text-zinc-500">
            Lista individual baseada apenas nos golos cujo autor foi identificado nas fichas recebidas. Golos ainda sem nome confirmado ou autogolos permanecem apenas no resultado do respetivo jogo.
          </p>
          <p className="text-xs text-zinc-500 mt-2 font-mono">
            {'Golos nos resultados: '}
            {goalReconciliation.goalsInResults}
            {' · Atribuídos a jogador: '}
            {goalReconciliation.goalsAttributed}
            {goalReconciliation.ownGoals > 0 && ` · Autogolos: ${goalReconciliation.ownGoals}`}
            {' · Por identificar: '}
            {goalReconciliation.goalsUnattributed}.
          </p>
        </div>
      )}

      {isUpcoming && seasonHasStarted && activeTab === 'cleansheets' && displayPlayers.length > 0 && (
        <div className="mb-8 p-4 bg-zinc-500/5 border border-zinc-500/20 rounded-2xl max-w-4xl">
          <p className="text-xs text-zinc-500">
            Balizas invioladas apuradas automaticamente a partir do guarda-redes titular oficial de cada jogo terminado sem sofrer golos. Apenas entram partidas com escalação homologada.
          </p>
        </div>
      )}

      {isUpcoming && seasonHasStarted && (activeTab === 'yellowcards' || activeTab === 'redcards') && displayPlayers.length > 0 && (
        <div className="mb-8 p-4 bg-zinc-500/5 border border-zinc-500/20 rounded-2xl max-w-4xl">
          <p className="text-xs text-zinc-500">
            Lista individual baseada apenas nos cartões cujo jogador foi identificado nas fichas recebidas. Cartões ainda sem nome confirmado permanecem apenas no total do respetivo jogo.
          </p>
          <p className="text-xs text-zinc-500 mt-2 font-mono">
            Fichas oficiais: {cardsLabel(cardReconciliation.yellowInSheets, cardReconciliation.redInSheets)} ·
            {' '}Atribuídos a jogador: {cardsLabel(cardReconciliation.yellowAttributed, cardReconciliation.redAttributed)} ·
            {' '}Por identificar: {cardsLabel(cardReconciliation.yellowUnattributed, cardReconciliation.redUnattributed)}.
          </p>
        </div>
      )}

      {isUpcoming && seasonHasStarted && activeTab === 'minutes' && displayPlayers.length > 0 && (
        <div className="mb-8 p-4 bg-zinc-500/5 border border-zinc-500/20 rounded-2xl max-w-4xl">
          <p className="text-xs text-zinc-500">
            Minutos calculados a partir do onze inicial e da cronologia de substituições e expulsões de cada ficha oficial,
            sobre os 90 minutos regulamentares. Uma equipa só entra quando a ficha publica os titulares <strong>e</strong> as
            substituições — sem elas não é possível saber quem saiu de campo, e nenhum valor é estimado.
          </p>
          <p className="text-xs text-zinc-500 mt-2 font-mono">
            Fichas reconstruídas: {minutesCoverage.sidesCounted} de {minutesCoverage.sidesPossible} equipas-jogo ·
            {' '}{minutesCoverage.matchesFinished} jogos terminados ·
            {' '}Ranking: {RANKING_SIZE} primeiros.
          </p>
        </div>
      )}

      {/* Statistics List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main List Container */}
        <div className="lg:col-span-2 space-y-4">
          {filterPosition !== 'all' && withoutPosition > 0 && (
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[10px] text-amber-700 dark:text-amber-400">
              {withoutPosition} {withoutPosition === 1 ? 'atleta desta métrica ainda não tem posição publicada' : 'atletas desta métrica ainda não têm posição publicada'} e por isso não entram em nenhum filtro de posição. Escolha “Todas Posições” para os ver.
            </p>
          )}
          {filteredPlayers.length > visiblePlayers.length && (
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              A mostrar {visiblePlayers.length} de {filteredPlayers.length} atletas
            </p>
          )}
          {/* `motion.div` com chave, sem AnimatePresence: a lista nova é montada
              no mesmo instante em que o filtro muda. Com `AnimatePresence
              mode="wait"` só aparecia depois de a antiga terminar a animação
              de saída — e enquanto isso ficava em ecrã o ranking anterior. */}
          <motion.div
            key={`${seasonId}-${activeTab}-${activeTeam}-${filterPosition}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {visiblePlayers.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 font-mono text-xs">
                Nenhum jogador encontrado com os filtros selecionados.
                <button
                  onClick={() => { setFilterTeam('all'); setFilterPosition('all'); }}
                  className="mt-3 block mx-auto text-accent underline hover:opacity-80"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              visiblePlayers.map((player, idx) => {
                // Posição real na prova, independente dos filtros aplicados.
                const rank = leagueRankById.get(player.id) ?? idx + 1;
                const isLeagueLeader = rank === 1 && player.value > 0 && seasonHasStarted;
                const sharedLead = displayPlayers.filter((candidate) => candidate.value === player.value).length > 1;
                // Com um clube escolhido, o melhor do plantel é assinalado
                // como tal — nunca como líder da prova.
                const isClubBest = !isLeagueLeader && activeTeam !== 'all' && player.value === clubBestValue && player.value > 0 && seasonHasStarted;
                const percent = leagueMaxValue > 0 ? Math.round((player.value / leagueMaxValue) * 100) : 0;

                return (
                  <AnimatedCard
                    key={player.id}
                    variant={isLeagueLeader ? 'holographic' : 'hud'}
                    className="bg-zinc-100/30 dark:bg-zinc-950/30 border-zinc-200/60 dark:border-zinc-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >

                    {/* Rank, Name, Logo & Club */}
                    <div className="flex items-center gap-4 min-w-0 md:min-w-[250px] w-full md:w-auto">
                      <span className={`text-2xl font-display font-black w-8 text-center flex-shrink-0 ${
                        isLeagueLeader ? 'text-accent animate-pulse' : 'text-zinc-600'
                      }`}>
                        {rank}
                      </span>
                      <TeamCrest teamId={player.teamId} size={48} className="filter drop-shadow-[0_0_6px_rgba(255,255,255,0.08)]" />
                      <div className="min-w-0">
                        <h3 className="text-foreground font-bold uppercase text-sm flex items-center gap-2 truncate">
                          {player.hasProfile === false ? player.name : (
                            <Link href={`/players/${player.id}`} className="hover:text-primary transition-colors truncate">{player.name}</Link>
                          )}
                          {isLeagueLeader && (
                            <span className="text-[9px] font-mono bg-accent/20 text-accent border border-accent/40 px-2 py-0.5 rounded-full uppercase flex-shrink-0">
                              {sharedLead ? 'Liderança partilhada' : 'Líder'}
                            </span>
                          )}
                          {isClubBest && (
                            <span className="text-[9px] font-mono bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full uppercase flex-shrink-0">
                              {sharedClubBest ? 'Melhor do clube (partilhado)' : 'Melhor do clube'}
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
                        <span>{seasonHasStarted ? 'Percentual sobre o líder da prova' : 'Inicializado'}</span>
                        <span>{seasonHasStarted ? `${percent}%` : '0%'}</span>
                      </div>
                      <div className="w-full h-2 bg-white/80 dark:bg-zinc-900/80 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: seasonHasStarted ? `${percent}%` : '0%' }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                          className={`h-full rounded-full ${
                            isLeagueLeader
                              ? 'bg-gradient-to-r from-primary to-accent'
                              : 'bg-primary'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Score Value Display */}
                    <div className="text-center md:text-right pl-4 min-w-[80px]">
                      <span className={`${activeTab === 'minutes' ? 'text-3xl' : 'text-4xl'} font-display font-black tracking-tighter ${
                        isLeagueLeader ? 'text-accent' : 'text-foreground'
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
              })
            )}
          </motion.div>
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
                {/* As caixas acompanham a métrica escolhida. Quando um valor não
                    consta das fichas mostra-se "—", nunca um zero que se leria
                    como "jogou e não marcou". */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono">
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-foreground font-bold block text-sm">
                      {seasonHasStarted ? (leaderAppearances ?? '—') : 0}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase">Jogos</span>
                  </div>
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-accent font-bold block text-sm">
                      {seasonHasStarted ? (leaderPlayer ? leaderPlayer.value.toLocaleString('pt-AO') : '—') : 0}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase">{VALUE_LABELS[activeTab]}</span>
                  </div>
                  <div className="bg-zinc-100 dark:bg-black/30 p-2 rounded-lg border border-zinc-200 dark:border-zinc-900">
                    <span className="text-foreground font-bold block text-sm">
                      {seasonHasStarted ? (leaderThirdValue ?? '—') : 0}
                    </span>
                    <span className="text-[8px] text-zinc-500 uppercase">{leaderThirdLabel}</span>
                  </div>
                </div>
              </div>
              <p>
                {activeTeamName && leaderPlayer
                  ? `Melhor registo do ${activeTeamName} nesta métrica. A posição indicada na lista é a da prova inteira.`
                  : isUpcoming
                    ? (seasonHasStarted ? 'Dados oficiais consolidados a partir das fichas publicadas nesta temporada.' : 'A aguardar o início da temporada.')
                    : (leaderPlayerDetails?.bio ?? 'Destaque individual com rendimento estelar no campeonato nacional.')}
              </p>
            </div>
          </AnimatedCard>

          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award size={16} className="text-accent" /> Prémios oficiais da ANCAF
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A ANCAF (Associação Nacional de Clubes Angolanos de Futebol) atribui no encerramento oficial de cada campeonato a Bola de Ouro ao Melhor Jogador, o Troféu de Artilheiro (Melhor Marcador), e a Luva de Ouro (Guarda-redes Menos Batido).
            </p>
          </AnimatedCard>

        </div>

      </div>
      <AdvancedStatistics seasonId={seasonId} teamId={activeTeam === 'all' ? undefined : activeTeam} />
    </div>
  );
}
