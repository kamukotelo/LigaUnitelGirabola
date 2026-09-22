'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Trophy, Target, CalendarDays, Flag, Tv, X, Filter, Sparkles, MapPin } from 'lucide-react';
import { UPCOMING_SEASON_ID, getMatchBroadcast, getMatchesForSeason, getAllTeams, getTeamById, Match, getActiveSeasonRound } from '@/lib/data';
import TeamCrest from '@/components/ui/TeamCrest';
import CalendarioPlaneamento from './CalendarioPlaneamento';
import { useOfficialCalendar } from '@/lib/use-official-calendar';

type StatusFilter = 'all' | 'finished' | 'live' | 'scheduled';
export type MatchTypeFilter = 'all' | 'classicos' | 'derbis_luanda' | 'derbis_benguela' | 'derbi_leste';

type CalendarFilters = {
  seasonId: string;
  selectedRound: number | 'all';
  filterStatus: StatusFilter;
  filterTeam: string;
  filterMonth: string;
  filterHighlight: MatchTypeFilter;
  filterProvince: string;
};

export const TEAM_PROVINCES: Record<string, string> = {
  petro: 'Luanda',
  dago: 'Luanda',
  interclube: 'Luanda',
  kabuscorp: 'Luanda',
  fcluanda: 'Luanda',
  'luanda-city': 'Luanda',
  guelson: 'Luanda',
  redonda: 'Luanda',
  wiliete: 'Benguela',
  lobito: 'Benguela',
  primeiromaio: 'Benguela',
  'isaac-benguela': 'Benguela',
  'sporting-benguela': 'Benguela',
  desphuila: 'Huíla',
  caala: 'Huambo',
  sagrada: 'Lunda-Norte',
  lundasul: 'Lunda-Sul',
  bravos: 'Moxico',
  saosalvador: 'Zaire',
  cabinda: 'Cabinda',
  'sporting-cabinda': 'Cabinda',
  libolo: 'Cuanza-Sul',
  'santa-rita': 'Uíge',
  carmona: 'Uíge',
  'ask-dragao': 'Uíge',
  'uniao-malanje': 'Malanje',
};

export function isClassicMatch(m: Match): boolean {
  const t = [m.homeTeamId, m.awayTeamId];
  // O Grande Clássico dos Clássicos
  if (t.includes('petro') && t.includes('dago')) return true;
  // Grandes confrontos históricos da I Divisão
  if (t.includes('petro') && (t.includes('sagrada') || t.includes('interclube') || t.includes('kabuscorp'))) return true;
  if (t.includes('dago') && (t.includes('sagrada') || t.includes('interclube') || t.includes('kabuscorp'))) return true;
  return false;
}

export function isDerbiLuanda(m: Match): boolean {
  return TEAM_PROVINCES[m.homeTeamId] === 'Luanda' && TEAM_PROVINCES[m.awayTeamId] === 'Luanda';
}

export function isDerbiBenguela(m: Match): boolean {
  return TEAM_PROVINCES[m.homeTeamId] === 'Benguela' && TEAM_PROVINCES[m.awayTeamId] === 'Benguela';
}

export function isDerbiLeste(m: Match): boolean {
  const lesteTeams = ['sagrada', 'lundasul', 'bravos'];
  return lesteTeams.includes(m.homeTeamId) && lesteTeams.includes(m.awayTeamId);
}

const ANGOLA_TIME_ZONE = 'Africa/Luanda';

// Jornada mostrada por defeito: a jornada ativa em disputa (ou a última se a época
// estiver concluída). Evita renderizar as 240 partidas de uma só vez — o utilizador
// pode sempre escolher "TODAS". Grande ganho de performance.
function getDefaultRound(seasonId: string, customMatches?: Match[]): number | 'all' {
  const matches = customMatches ?? getMatchesForSeason(seasonId);
  return getActiveSeasonRound(matches);
}

function getDefaultFilters(seasonId: string): CalendarFilters {
  return {
    seasonId,
    selectedRound: getDefaultRound(seasonId),
    filterStatus: 'all',
    filterTeam: 'all',
    filterMonth: 'all',
    filterHighlight: 'all',
    filterProvince: 'all',
  };
}

function CalendarMatchRow({ match, selectedTeamId }: { match: Match; selectedTeamId: string | null }) {
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';
  const isPostponed = match.postponed === true;
  const matchDate = new Date(match.date);
  const formattedTime = matchDate.toLocaleTimeString('pt-AO', {
    hour: '2-digit', minute: '2-digit',
    timeZone: ANGOLA_TIME_ZONE,
  });
  const formattedDay = matchDate.toLocaleDateString('pt-AO', {
    weekday: 'short', day: '2-digit', month: '2-digit',
    timeZone: ANGOLA_TIME_ZONE,
  }).replace('.', '');
  const selected = selectedTeamId !== null && (match.homeTeamId === selectedTeamId || match.awayTeamId === selectedTeamId);
  const muted = selectedTeamId !== null && !selected;
  const homeScore = isFinished || isLive ? match.homeScore : '—';
  const awayScore = isFinished || isLive ? match.awayScore : '—';
  const broadcast = getMatchBroadcast(match);
  const isDeferredBroadcast = broadcast.toLowerCase().includes('diferido');
  const homeShortName = getTeamById(match.homeTeamId)?.shortName ?? match.homeTeam;
  const awayShortName = getTeamById(match.awayTeamId)?.shortName ?? match.awayTeam;

  // Alinhamento padronizado: casa sempre à direita, fora sempre à esquerda,
  // com quebra de linha equilibrada (text-balance) para evitar linhas soltas.
  const teamNameClass = (isSelected: boolean, align: 'right' | 'left') =>
    `min-w-0 text-balance break-words font-condensed text-xs font-bold leading-tight sm:text-[13px] ${
      align === 'right' ? 'text-right' : 'text-left'
    } ${isSelected ? 'font-extrabold text-red-700' : 'text-zinc-950'}`;

  return (
    <Link
      href={`/matches/${match.id}`}
      className={`group relative z-10 flex flex-col gap-1.5 border-b border-zinc-300/80 px-2.5 py-2.5 transition-all last:border-b-0 ${
        muted ? 'opacity-40 grayscale hover:opacity-80 hover:grayscale-0' : 'hover:bg-orange-50/90'
      }`}
      title={`${match.homeTeam} — ${match.awayTeam} · ${isPostponed ? 'Adiado, à espera de data' : `${formattedDay} · ${formattedTime}`}`}
    >
      {/* Colunas fixas para emblemas e resultado: garantem que todas as linhas
          partilham exatamente as mesmas guias verticais, independentemente do
          comprimento do nome ou de o resultado ser numérico ou um traço. */}
      <div className="grid min-h-8 grid-cols-[minmax(0,1fr)_1.75rem_3.25rem_1.75rem_minmax(0,1fr)] items-center gap-x-1.5 sm:grid-cols-[minmax(0,1fr)_1.75rem_4rem_1.75rem_minmax(0,1fr)] sm:gap-x-2">
        {/* Casa */}
        <span className={teamNameClass(selected, 'right')}><span className="min-[400px]:hidden">{homeShortName}</span><span className="hidden min-[400px]:inline">{match.homeTeam}</span></span>
        <TeamCrest teamId={match.homeTeamId} size={24} className="shrink-0 justify-self-center sm:w-7" />

        {/* Resultado */}
        <div className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-1.5 py-1 font-mono text-sm font-black tabular-nums text-zinc-900 shadow-sm">
          <span className={isLive ? 'text-red-600' : undefined}>{homeScore}</span>
          <span className="text-zinc-300">–</span>
          <span className={isLive ? 'text-red-600' : undefined}>{awayScore}</span>
        </div>

        {/* Fora */}
        <TeamCrest teamId={match.awayTeamId} size={24} className="shrink-0 justify-self-center sm:w-7" />
        <span className={teamNameClass(selected, 'left')}><span className="min-[400px]:hidden">{awayShortName}</span><span className="hidden min-[400px]:inline">{match.awayTeam}</span></span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-normal text-zinc-700 sm:text-xs sm:tracking-wide">
        <span className={isLive ? 'text-red-600' : isPostponed ? 'text-amber-700' : undefined}>{isLive ? `● ${match.liveMinute ?? ''}' · Em direto` : isPostponed ? 'Adiado · À espera de data' : `${formattedDay} · ${formattedTime}`}</span>
        {match.stadium && (
          <span className="inline-flex items-center gap-1 text-zinc-600" title={match.stadium}>
            <MapPin size={10} aria-hidden="true" /> <span className="max-w-40 truncate sm:max-w-56">{match.stadium}</span>
          </span>
        )}
        {isClassicMatch(match) && (
          <span className="rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[11px] font-extrabold text-amber-700 dark:text-amber-400">
            👑 Clássico
          </span>
        )}
        {isDerbiBenguela(match) && (
          <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">
            🌊 Dérbi Benguela
          </span>
        )}
        {isDerbiLeste(match) && (
          <span className="rounded bg-purple-500/15 border border-purple-500/30 px-1.5 py-0.5 text-[11px] font-extrabold text-purple-700 dark:text-purple-400">
            💎 Dérbi do Leste
          </span>
        )}
        {isDerbiLuanda(match) && !isClassicMatch(match) && (
          <span className="rounded bg-blue-500/15 border border-blue-500/30 px-1.5 py-0.5 text-[11px] font-extrabold text-blue-700 dark:text-blue-400">
            ⚔️ Dérbi Luanda
          </span>
        )}
        {broadcast !== 'Por confirmar' && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 shadow-sm ring-1 ${match.broadcaster ? 'bg-[#5C0F8B] text-white ring-white/40' : 'bg-amber-100 text-amber-900 ring-amber-300'}`}>
            <Tv size={10} aria-hidden="true" /> {match.broadcaster && !isDeferredBroadcast ? `${isFinished ? 'Transmitido' : 'Em direto'} · ${broadcast}` : broadcast}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function CalendarioTab({ seasonId }: { seasonId: string }) {
  const [filterState, setFilterState] = useState<CalendarFilters>(() => getDefaultFilters(seasonId));
  const [viewMode, setViewMode] = useState<'lista' | 'planeamento'>('lista');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { matches: MATCHES, loading, generatedAt } = useOfficialCalendar(seasonId);

  const isUpcoming = seasonId === UPCOMING_SEASON_ID;
  const filters = filterState.seasonId === seasonId ? filterState : getDefaultFilters(seasonId);
  const { selectedRound, filterStatus, filterTeam, filterMonth, filterHighlight, filterProvince } = filters;

  const updateFilters = (patch: Partial<Omit<CalendarFilters, 'seasonId'>>) => {
    setFilterState((current) => ({
      ...(current.seasonId === seasonId ? current : getDefaultFilters(seasonId)),
      ...patch,
      seasonId,
    }));
  };

  const participantIds = new Set(MATCHES.flatMap((match) => [match.homeTeamId, match.awayTeamId]));
  const seasonTeams = getAllTeams().filter((team) => participantIds.has(team.id));

  const availableProvinces = useMemo(() => {
    const set = new Set<string>();
    seasonTeams.forEach((t) => {
      const prov = TEAM_PROVINCES[t.id];
      if (prov) set.add(prov);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [seasonTeams]);

  const rounds = Array.from(new Set(MATCHES.map((m) => m.round))).sort((a, b) => a - b);

  // Meses disponíveis (chave yyyy-mm, rótulo pt-AO), na ordem do calendário
  const months = Array.from(
    MATCHES.reduce((map, m) => {
      const key = m.date.slice(0, 7);
      if (!map.has(key)) {
        map.set(key, new Date(m.date).toLocaleDateString('pt-AO', { month: 'long', year: 'numeric', timeZone: ANGOLA_TIME_ZONE }));
      }
      return map;
    }, new Map<string, string>()).entries(),
  ).sort((a, b) => a[0].localeCompare(b[0]));

  // Resumo da época
  const finishedMatches = MATCHES.filter((m) => m.status === 'finished');
  const totalGoals = finishedMatches.reduce((s, m) => s + (m.homeScore ?? 0) + (m.awayScore ?? 0), 0);
  const activeSeasonRound = getActiveSeasonRound(MATCHES);
  const isSeasonFinished = MATCHES.length > 0 && MATCHES.every((m) => m.status === 'finished');
  const nextUpcomingRound = rounds.find((r) => r > activeSeasonRound && MATCHES.some((m) => m.round === r && m.status !== 'finished'));

  const seasonStats = [
    {
      label: isSeasonFinished ? 'Jornadas Concluídas' : 'Jornada Atual',
      value: isSeasonFinished ? `${rounds.length}/${rounds.length}` : `J${activeSeasonRound}`,
      icon: CalendarDays,
    },
    { label: 'Jogos Disputados', value: finishedMatches.length, icon: Trophy },
    { label: 'Golos Marcados', value: totalGoals, icon: Target },
    {
      label: 'Próxima Jornada',
      value: nextUpcomingRound ? `J${nextUpcomingRound}` : '—',
      icon: Flag,
    },
  ];

  const statusOptions: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'finished', label: 'Concluídos' },
    { key: 'live', label: 'Em direto' },
    { key: 'scheduled', label: 'Agendados' },
  ];

  const matchesFilter = (m: Match) => {
    if (filterStatus !== 'all' && m.status !== filterStatus) return false;
    if (filterMonth !== 'all' && !m.date.startsWith(filterMonth)) return false;
    if (filterTeam !== 'all' && m.homeTeamId !== filterTeam && m.awayTeamId !== filterTeam) return false;

    if (filterHighlight === 'classicos' && !isClassicMatch(m)) return false;
    if (filterHighlight === 'derbis_luanda' && !isDerbiLuanda(m)) return false;
    if (filterHighlight === 'derbis_benguela' && !isDerbiBenguela(m)) return false;
    if (filterHighlight === 'derbi_leste' && !isDerbiLeste(m)) return false;

    if (filterProvince !== 'all') {
      const pHome = TEAM_PROVINCES[m.homeTeamId];
      const pAway = TEAM_PROVINCES[m.awayTeamId];
      if (pHome !== filterProvince && pAway !== filterProvince) return false;
    }

    return true;
  };

  const selectedTeam = filterTeam === 'all' ? null : seasonTeams.find((team) => team.id === filterTeam) ?? null;

  // Jornadas visíveis + filtragem por estado/equipa/mês
  const filteredRoundGroups = (selectedRound === 'all' ? rounds : [selectedRound])
    .map((round) => ({
      round,
      matches: MATCHES.filter((m) => m.round === round && matchesFilter(m)),
    }))
    .filter((g) => g.matches.length > 0);

  const visibleRounds = filteredRoundGroups;

  const hasResults = visibleRounds.length > 0;

  const activeFilterCount = [
    filterStatus !== 'all',
    filterMonth !== 'all',
    filterTeam !== 'all',
    filterHighlight !== 'all',
    filterProvince !== 'all',
  ].filter(Boolean).length;

  const selectClass = 'min-h-11 bg-zinc-100 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary w-full sm:w-auto';

  return (
    <div>
      {/* Seletor de Modo de Visualização */}
      <div className="flex justify-end mb-4 sm:mb-6">
        <div className="grid w-full grid-cols-2 gap-1 bg-zinc-100/60 dark:bg-zinc-950/60 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 sm:flex sm:w-auto">
          <button
            onClick={() => setViewMode('lista')}
            className={`min-h-11 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              viewMode === 'lista'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
            }`}
          >
            Lista de Jogos
          </button>
          <button
            onClick={() => setViewMode('planeamento')}
            className={`min-h-11 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              viewMode === 'planeamento'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
            }`}
          >
            Grelha de Planeamento
          </button>
        </div>
      </div>

      {viewMode === 'planeamento' ? (
        <CalendarioPlaneamento matches={MATCHES} />
      ) : (
        <>
      <button
        type="button"
        onClick={() => setMobileFiltersOpen((open) => !open)}
        aria-expanded={mobileFiltersOpen}
        className="mb-4 flex min-h-11 w-full items-center justify-between rounded-xl border border-zinc-200 bg-white/70 px-4 text-xs font-bold text-foreground dark:border-zinc-800 dark:bg-zinc-900/70 sm:hidden"
      >
        <span className="inline-flex items-center gap-2"><Filter size={15} /> Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
        <span className="text-zinc-500">{mobileFiltersOpen ? 'Fechar' : 'Abrir'}</span>
      </button>

      {/* Capa e seletor visual de equipa: contextual no desktop, integrado nos filtros no mobile. */}
      <section className="mb-8 hidden overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-primary/15 via-white/60 to-accent/10 dark:from-primary/20 dark:via-zinc-950/80 dark:to-accent/10 sm:block">
        <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold text-primary">Calendário oficial · Época {seasonId.replace('-', '/')}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl uppercase tracking-wide text-foreground">
              {selectedTeam ? `Jogos do ${selectedTeam.name}` : 'Liga Unitel Girabola'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              {selectedTeam
                ? 'A lista mostra apenas os jogos desta equipa. Use os restantes filtros para restringir por jornada, mês ou estado.'
                : 'Escolha um emblema para mostrar apenas os jogos dessa equipa ao longo do calendário.'}
            </p>
          </div>
          <div className="flex min-h-28 items-center justify-center">
            {selectedTeam ? (
              <TeamCrest teamId={selectedTeam.id} size={112} className="drop-shadow-xl" />
            ) : (
              <Image src="/logo-ancaf.png" alt="ANCAF" width={132} height={132} className="h-28 w-auto object-contain drop-shadow-xl" />
            )}
          </div>
        </div>
        <div className="border-t border-zinc-200/70 dark:border-zinc-800/70 bg-white/45 dark:bg-zinc-950/35 p-4 sm:p-5">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => updateFilters({ filterTeam: 'all' })}
              aria-label="Mostrar todas as equipas"
              className={`relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border transition-all ${filterTeam === 'all' ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'border-zinc-200 bg-white/60 opacity-60 hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900/60'}`}
            >
              <Image src="/logo-ancaf.png" alt="Todas" width={42} height={42} className="h-10 w-10 object-contain" />
            </button>
            {seasonTeams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => updateFilters({ filterTeam: team.id, selectedRound: 'all' })}
                aria-label={`Destacar jogos do ${team.name}`}
                title={team.name}
                className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border transition-all ${filterTeam === team.id ? 'border-primary bg-primary/10 ring-2 ring-primary/20 scale-105' : 'border-zinc-200 bg-white/60 opacity-60 hover:scale-105 hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900/60'}`}
              >
                <TeamCrest teamId={team.id} size={38} />
              </button>
            ))}
            {selectedTeam && (
              <button type="button" onClick={() => updateFilters({ filterTeam: 'all' })} className="ml-1 flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-mono uppercase text-zinc-500 hover:text-foreground">
                <X size={13} /> Limpar
              </button>
            )}
          </div>
        </div>
      </section>
          {/* Estado de sincronização do calendário */}
      {isUpcoming && (
        <div className="mb-4 flex flex-col sm:mb-6 sm:flex-row sm:items-center gap-2 sm:gap-3 bg-green-500/5 border border-green-500/35 rounded-2xl p-3 sm:p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold font-mono text-green-400 uppercase tracking-widest">
              Calendário gerido na plataforma
            </span>
          </div>
          {generatedAt && (
            <div className="hidden text-xs text-zinc-500 flex-wrap gap-x-4 gap-y-1 sm:flex">
              <span>
                Última publicação na plataforma:{' '}
                <strong className="text-foreground font-semibold">
                  {new Date(generatedAt).toLocaleString('pt-AO', {
                    timeZone: ANGOLA_TIME_ZONE,
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Resumo da época */}
      <div className="hidden grid-cols-2 md:grid md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {seasonStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl sm:text-2xl text-foreground font-black leading-none">{stat.value}</p>
                <p className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1 truncate">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra de filtros */}
      <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm mb-5 space-y-4 sm:block sm:mb-8`}>
        <div className="flex flex-col gap-2 sm:hidden">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Equipa</span>
          <select aria-label="Filtrar calendário por equipa" value={filterTeam} onChange={(e) => updateFilters({ filterTeam: e.target.value, selectedRound: e.target.value === 'all' ? selectedRound : 'all' })} className={selectClass}>
            <option value="all">Todas as equipas</option>
            {seasonTeams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </div>
        {/* Linha 1: Estado, Mês e Província */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Estado */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider sm:w-16 flex-shrink-0">Estado</span>
            <div className="flex gap-1.5 bg-zinc-100/60 dark:bg-zinc-950/60 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto">
              {statusOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => updateFilters({ filterStatus: opt.key })}
                  className={`min-h-11 flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                    filterStatus === opt.key ? 'bg-primary text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mês */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider sm:w-12 flex-shrink-0">Mês</span>
            <select aria-label="Filtrar calendário por mês" value={filterMonth} onChange={(e) => updateFilters({ filterMonth: e.target.value })} className={selectClass}>
              <option value="all">Todos os meses</option>
              {months.map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Província */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider sm:w-16 flex-shrink-0 flex items-center gap-1">
              <MapPin size={11} className="text-accent" /> Província
            </span>
            <select
              aria-label="Filtrar calendário por província"
              value={filterProvince}
              onChange={(e) => updateFilters({ filterProvince: e.target.value })}
              className={selectClass}
            >
              <option value="all">Todas as províncias</option>
              {availableProvinces.map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Linha 2: Destaques & Confrontos / Clássicos */}
        <div className="hidden sm:flex sm:flex-row sm:items-center gap-2 sm:gap-3 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider sm:w-20 flex-shrink-0 flex items-center gap-1">
            <Sparkles size={11} className="text-accent" /> Destaque
          </span>
          <div className="flex flex-wrap gap-1.5 bg-zinc-100/60 dark:bg-zinc-950/60 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            {[
              { key: 'all', label: 'Todos os Jogos' },
              { key: 'classicos', label: '👑 Grandes Clássicos' },
              { key: 'derbis_luanda', label: '⚔️ Dérbis de Luanda' },
              { key: 'derbis_benguela', label: '🌊 Dérbi de Benguela' },
              { key: 'derbi_leste', label: '💎 Dérbi do Leste' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => updateFilters({
                  filterHighlight: item.key as MatchTypeFilter,
                  selectedRound: item.key !== 'all' ? 'all' : selectedRound,
                })}
                className={`min-h-11 px-3 py-2 rounded-lg text-xs font-semibold font-mono transition-all ${
                  filterHighlight === item.key
                    ? 'bg-accent text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Linha 3: Jornadas (scroll horizontal) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider sm:w-20 flex-shrink-0">Jornada</span>
          <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => updateFilters({ selectedRound: 'all' })}
              className={`snap-start px-3 py-1.5 rounded-lg text-xs font-semibold font-mono whitespace-nowrap transition-all flex-shrink-0 ${
                selectedRound === 'all'
                  ? 'bg-accent text-black'
                  : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-foreground border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              TODAS
            </button>
            {rounds.map((round) => (
              <button
                key={round}
                onClick={() => updateFilters({ selectedRound: round })}
                className={`snap-start px-3 py-1.5 rounded-lg text-xs font-semibold font-mono whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedRound === round
                    ? 'bg-accent text-black'
                    : 'bg-zinc-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-foreground border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                J{round}
              </button>
            ))}
          </div>
        </div>

        {/* Botão de limpeza de filtros se algum estiver ativo */}
        {(filterStatus !== 'all' || filterMonth !== 'all' || filterTeam !== 'all' || filterHighlight !== 'all' || filterProvince !== 'all' || selectedRound !== 'all') && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => updateFilters({
                filterStatus: 'all',
                filterMonth: 'all',
                filterTeam: 'all',
                filterHighlight: 'all',
                filterProvince: 'all',
                selectedRound: getDefaultRound(seasonId),
              })}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-accent transition-colors"
            >
              <X size={12} /> Limpar todos os filtros ativos
            </button>
          </div>
        )}
      </div>

      {/* Paginação de Jornada (Navegador Rápido) */}
      {selectedRound !== 'all' && (
        <div className="sticky top-16 z-20 flex justify-between items-center bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-2.5 sm:p-4 backdrop-blur-md mb-4 sm:mb-6 font-mono text-xs select-none shadow-sm">
          <button
            onClick={() => updateFilters({ selectedRound: selectedRound - 1 })}
            disabled={selectedRound === 1}
            className="min-h-11 px-3 sm:px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-white/20 disabled:opacity-40 transition-colors flex items-center gap-1 font-bold text-foreground disabled:cursor-not-allowed"
          >
            ◀ Anterior
          </button>

          <div className="flex items-center gap-2">
            <span className="text-zinc-600 dark:text-zinc-400 font-extrabold uppercase"><span className="sm:hidden">J{selectedRound}</span><span className="hidden sm:inline">Jornada {selectedRound} de {rounds.length}</span></span>
            <button
              onClick={() => updateFilters({ selectedRound: 'all' })}
              className="hidden text-[10px] bg-accent/10 hover:bg-accent/20 text-accent font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-accent/20 transition-colors sm:block"
            >
              Ver Todas
            </button>
          </div>

          <button
            onClick={() => updateFilters({ selectedRound: selectedRound + 1 })}
            disabled={selectedRound === rounds.length}
            className="min-h-11 px-3 sm:px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-white/20 disabled:opacity-40 transition-colors flex items-center gap-1 font-bold text-foreground disabled:cursor-not-allowed"
          >
            Próxima ▶
          </button>
        </div>
      )}

      {/* Lista de jogos agrupada por jornada */}
      {loading && MATCHES.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-500 font-mono">A carregar calendário...</p>
        </div>
      ) : hasResults ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {visibleRounds.map((group) => {
            const orderedMatches = [...group.matches].sort((a, b) => a.date.localeCompare(b.date));
            return (
              <motion.section
                key={group.round}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(group.round * 0.015, 0.25) }}
                className="overflow-hidden rounded-[10px] border-[3px] border-zinc-800 bg-[#fffdf8] shadow-[0_5px_0_rgba(24,24,27,0.85)] dark:border-zinc-950 dark:bg-zinc-100"
              >
                <div className="flex items-center justify-center bg-gradient-to-b from-[#F07942] to-[#E6540F] px-3 py-2 text-white">
                  <h2 className="whitespace-nowrap font-display text-sm font-black uppercase tracking-wider text-center sm:text-base">
                    {group.round}.ª Jornada
                  </h2>
                </div>
                <div className="relative isolate overflow-hidden px-1.5 py-1 text-zinc-950">
                  <Image
                    src="/logo-ancaf.png"
                    alt=""
                    aria-hidden="true"
                    width={210}
                    height={210}
                    className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-auto w-40 -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.14] grayscale sm:w-48"
                  />
                  {orderedMatches.map((match) => (
                    <CalendarMatchRow
                      key={match.id}
                      match={match}
                      selectedTeamId={filterTeam === 'all' ? null : filterTeam}
                    />
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-zinc-500 font-mono">Nenhum jogo encontrado com os filtros selecionados.</p>
        </div>
      )}

      {/* No telemóvel, o resumo vem depois dos jogos para não atrasar o conteúdo principal. */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:hidden">
        {seasonStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white/40 p-3 dark:border-zinc-800/80 dark:bg-zinc-900/40">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <Icon size={15} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-black leading-none text-foreground">{stat.value}</p>
                <p className="mt-1 text-[11px] font-mono uppercase leading-tight text-zinc-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
}
