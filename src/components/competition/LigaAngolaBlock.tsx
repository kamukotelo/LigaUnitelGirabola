'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Play, CalendarDays, ExternalLink, Tv } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import TeamCrest from '@/components/ui/TeamCrest';
import {
  getNewsArticles,
  getMatchBroadcast,
  getMatchesForSeason,
  PREVIOUS_SEASON_ID,
  UPCOMING_SEASON_ID,
  TEAMS,
  getStandingsForSeason,
  getTeamFullName,
  getVideoHighlights,
} from '@/lib/data';
import { ROUTES } from '@/lib/routes';
import { useOfficialCalendar } from '@/lib/use-official-calendar';

const ANGOLA_TIME_ZONE = 'Africa/Luanda';
const TOTAL_ROUNDS = 30;

const OFFICIAL_PARTNERS = [
  { name: 'Unitel', logo: '/partners/unitel.png', scale: 'scale-[1.6]' },
  { name: 'Zsports', logo: '/partners/zsports.png', scale: 'scale-[1.55]' },
  { name: 'Rádio Cinco', logo: '/partners/radio-cinco.png', scale: 'scale-[1.7]' },
  { name: 'CHDCP', logo: '/partners/chdcp.png', scale: 'scale-[1.5]' },
] as const;

function getDefaultRoundForSeason(seasonId: string) {
  const finishedMatches = getMatchesForSeason(seasonId).filter((match) => match.status === 'finished');
  return finishedMatches.length > 0 ? Math.max(...finishedMatches.map((match) => match.round)) : 1;
}

export default function LigaAngolaBlock() {
  // ─── STATE FOR JOGOS (MATCHES) SWITCHER ───
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(UPCOMING_SEASON_ID);
  const [currentRound, setCurrentRound] = useState<number>(() => getDefaultRoundForSeason(UPCOMING_SEASON_ID));

  // A mesma fonte oficial consumida pela página Calendário.
  const { matches: seasonMatches } = useOfficialCalendar(selectedSeasonId);
  const matchesByRound = seasonMatches.filter((m) => m.round === currentRound);

  const selectSeason = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
    setCurrentRound(getDefaultRoundForSeason(seasonId));
  };

  // ─── STATE FOR STANDINGS (CLASSIFICAÇÃO) ───
  const [standingsSeasonId, setStandingsSeasonId] = useState<string>(UPCOMING_SEASON_ID);
  const standings = getStandingsForSeason(standingsSeasonId).slice(0, 5);

  // ─── STATE FOR NEWS (NOTÍCIAS) ───
  const news = getNewsArticles().slice(0, 4);
  const featuredNews = news[0];
  const secondaryNews = news.slice(1, 4);

  // ─── STATE FOR VIDEOS (VÍDEOS) ───
  const [activeVideoCategory, setActiveVideoCategory] = useState<string>('TODOS');
  const allVideos = getVideoHighlights();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(allVideos[0]?.id ?? null);
  const filteredVideos = useMemo(() => {
    if (activeVideoCategory === 'TODOS') {
      return allVideos;
    }

    return allVideos.filter((video) => video.category.toUpperCase() === activeVideoCategory.toUpperCase());
  }, [activeVideoCategory, allVideos]);
  const activeVideo = filteredVideos.find((video) => video.id === activeVideoId) ?? filteredVideos[0] ?? allVideos[0];

  // ─── HELPER FOR TIME DIFFERENCE (e.g., "há 3 horas") ───
  const getTimeLabel = (dateStr: string) => dateStr;

  return (
    <section className="py-12 bg-background relative overflow-hidden">
      <div className="content-shell relative z-10">
        
        {/* ─── 1. PARCERIAS (Sponsor Bar) ─── */}
        <div className="w-full bg-[#f8fafc] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col md:flex-row items-center overflow-hidden mb-12 shadow-sm" aria-label="Parceiros oficiais da Liga Unitel Girabola">
          <div 
            className="bg-[#0B1E43] dark:bg-primary text-white font-display font-black text-xs sm:text-sm uppercase px-8 py-4 relative flex items-center justify-center select-none w-full md:w-auto"
            style={{ clipPath: 'polygon(0 0, 88% 0, 100% 100%, 0 100%)' }}
          >
            <span className="pr-4 tracking-wider">PARCEIROS OFICIAIS</span>
          </div>
          <div className="grid w-full flex-1 grid-cols-2 items-center gap-3 px-4 py-4 sm:grid-cols-4 sm:px-6 md:px-10">
            {OFFICIAL_PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="relative flex min-h-20 items-center justify-center overflow-hidden rounded-lg border border-zinc-200/70 bg-white px-3 shadow-sm dark:border-zinc-700/70"
              >
                <Image
                  src={partner.logo}
                  alt={`Logótipo ${partner.name}`}
                  width={1182}
                  height={1182}
                  sizes="(max-width: 640px) 42vw, 18vw"
                  className={`h-20 w-20 max-w-none object-contain sm:h-24 sm:w-24 ${partner.scale}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ─── 2. TWO-COLUMN SPLIT GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ────── LEFT COLUMN (SIDEBAR - 4 Cols) ────── */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* ─── ACOMPANHE A SUA EQUIPA (Sign-in teaser) ─── */}
            <div className="bg-[#f8fafc] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden flex flex-col items-center">
              <div className="flex justify-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex items-center justify-center p-2 shadow-xs">
                  <TeamCrest teamId="petro" size={24} />
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-accent bg-white dark:bg-zinc-950 flex items-center justify-center p-2.5 shadow-md -translate-y-1">
                  <span className="font-display font-black text-xs text-primary dark:text-white">GB</span>
                </div>
                <div className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex items-center justify-center p-2 shadow-xs">
                  <TeamCrest teamId="dago" size={24} />
                </div>
              </div>
              <h3 className="text-sm font-display uppercase tracking-wider text-[#0B1E43] dark:text-zinc-300 font-extrabold mb-1 max-w-[200px]">
                Não perca os próximos jogos da sua equipa
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mb-4">
                Personalize os seus alertas e siga o seu clube favorito
              </p>
              <Link href={`/competicao/${UPCOMING_SEASON_ID}?tab=calendario`}>
                <button className="flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-mono font-bold text-xs uppercase px-5 py-2.5 rounded-xl shadow-xs">
                  <CalendarDays size={13} className="text-accent" /> Ver Calendário
                </button>
              </Link>
            </div>

            {/* ─── JOGOS ─── */}
            <div className="relative pt-6">
              <div 
                className="absolute top-0 left-0 bg-[#0B1E43] text-white font-display font-black text-xs uppercase px-6 py-2.5 z-10 select-none cursor-pointer"
                style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 100%)' }}
              >
                <span className="pr-3 tracking-wider">JOGOS</span>
              </div>
              
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 pt-8 shadow-sm">
                
                {/* Competition Selector Tabs */}
                <div className="flex border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-4">
                  <button
                    onClick={() => selectSeason(PREVIOUS_SEASON_ID)}
                    className={`flex-1 text-center py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors ${
                      selectedSeasonId === PREVIOUS_SEASON_ID
                        ? 'bg-primary/10 text-primary dark:text-white'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    <span className="block leading-tight">Girabola 25/26</span>
                    <span className="block text-[8px] font-semibold normal-case tracking-normal text-zinc-400 dark:text-zinc-500 mt-0.5">Época concluída</span>
                  </button>
                  <button
                    onClick={() => selectSeason(UPCOMING_SEASON_ID)}
                    className={`flex-1 text-center py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors ${
                      selectedSeasonId === UPCOMING_SEASON_ID
                        ? 'bg-[#0B1E43]/10 text-[#0B1E43] dark:text-zinc-300'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    <span className="block leading-tight">Girabola 26/27</span>
                    <span className="block text-[8px] font-semibold normal-case tracking-normal text-zinc-400 dark:text-zinc-500 mt-0.5">Nova época</span>
                  </button>
                </div>

                {/* Round Selector Header */}
                <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-2.5 mb-4">
                  <button 
                    onClick={() => currentRound > 1 && setCurrentRound(currentRound - 1)}
                    disabled={currentRound === 1}
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    aria-label="Jornada anterior"
                  >
                    <ChevronLeft size={16} className="text-zinc-600 dark:text-zinc-400" />
                  </button>
                  <span className="font-display font-extrabold text-xs text-foreground uppercase tracking-widest">
                    Jornada {currentRound}
                  </span>
                  <button 
                    onClick={() => currentRound < TOTAL_ROUNDS && setCurrentRound(currentRound + 1)}
                    disabled={currentRound === TOTAL_ROUNDS}
                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    aria-label="Próxima jornada"
                  >
                    <ChevronRight size={16} className="text-zinc-600 dark:text-zinc-400" />
                  </button>
                </div>

                {/* Matches List */}
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto [scrollbar-width:thin] pr-1">
                  {matchesByRound.length > 0 ? (
                    matchesByRound.map((match) => {
                      const isFinished = match.status === 'finished';
                      const matchDate = new Date(match.date);
                      const timeLabel = matchDate.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit', timeZone: ANGOLA_TIME_ZONE });
                      const homeObj = TEAMS.find((t) => t.id === match.homeTeamId);
                      const awayObj = TEAMS.find((t) => t.id === match.awayTeamId);
                      const homeAbbr = homeObj?.shortName ?? match.homeTeam.substring(0, 3).toUpperCase();
                      const awayAbbr = awayObj?.shortName ?? match.awayTeam.substring(0, 3).toUpperCase();
                      const broadcast = getMatchBroadcast(match);
                      const isDeferredBroadcast = broadcast.toLowerCase().includes('diferido');

                      return (
                        <Link href={`/matches/${match.id}`} key={match.id} className="block group">
                          <div className="flex flex-wrap items-center justify-between py-2.5 px-3 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                            {/* Home */}
                            <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                              <span className="truncate text-xs font-bold text-foreground text-right">{homeAbbr}</span>
                              <TeamCrest teamId={match.homeTeamId} size={22} className="flex-shrink-0" />
                            </div>

                            {/* Center Score/Status */}
                            <div className="flex-shrink-0 w-16 text-center">
                              {isFinished ? (
                                <span className="font-mono font-black text-xs text-foreground bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-2 py-0.5 select-none">
                                  {match.homeScore}-{match.awayScore}
                                </span>
                              ) : (
                                <span className="font-mono text-[10px] text-accent font-bold bg-accent/10 border border-accent/20 rounded-md px-2 py-0.5">
                                  {timeLabel}
                                </span>
                              )}
                            </div>

                            {/* Away */}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <TeamCrest teamId={match.awayTeamId} size={22} className="flex-shrink-0" />
                              <span className="truncate text-xs font-bold text-foreground">{awayAbbr}</span>
                            </div>
                            {broadcast !== 'Por confirmar' && (
                              <span className={`mt-1.5 flex basis-full items-center justify-center gap-1 font-mono text-[8px] font-bold uppercase tracking-wide ${match.broadcaster ? 'text-primary dark:text-purple-300' : 'text-amber-700 dark:text-amber-300'}`}>
                                <Tv size={10} /> {match.broadcaster && !isDeferredBroadcast ? `Em direto · ${broadcast}` : broadcast}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-xs text-zinc-500 font-mono">Não foram encontrados jogos.</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-900 mt-4 pt-3 text-center">
                  <Link href={ROUTES.calendar} className="inline-flex items-center gap-1 text-[10px] font-mono uppercase font-bold text-primary hover:text-accent transition-colors">
                    Ver todos os jogos <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>

            {/* ─── CLASSIFICAÇÃO ─── */}
            <div className="relative pt-6">
              <div 
                className="absolute top-0 left-0 bg-[#0B1E43] text-white font-display font-black text-xs uppercase px-6 py-2.5 z-10 select-none cursor-pointer"
                style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 100%)' }}
              >
                <span className="pr-3 tracking-wider">CLASSIFICAÇÃO</span>
              </div>
              
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 pt-8 shadow-sm">
                
                {/* Competition Selector Tabs */}
                <div className="flex border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-4">
                  <button
                    onClick={() => setStandingsSeasonId(PREVIOUS_SEASON_ID)}
                    className={`flex-1 text-center py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors ${
                      standingsSeasonId === PREVIOUS_SEASON_ID
                        ? 'bg-primary/10 text-primary dark:text-white'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    <span className="block leading-tight">Girabola 25/26</span>
                    <span className="block text-[8px] font-semibold normal-case tracking-normal text-zinc-400 dark:text-zinc-500 mt-0.5">Época concluída</span>
                  </button>
                  <button
                    onClick={() => setStandingsSeasonId(UPCOMING_SEASON_ID)}
                    className={`flex-1 text-center py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors ${
                      standingsSeasonId === UPCOMING_SEASON_ID
                        ? 'bg-[#0B1E43]/10 text-[#0B1E43] dark:text-zinc-300'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    <span className="block leading-tight">Girabola 26/27</span>
                    <span className="block text-[8px] font-semibold normal-case tracking-normal text-zinc-400 dark:text-zinc-500 mt-0.5">Nova época</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 px-2 py-1.5 border-b border-zinc-100 dark:border-zinc-900 text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                  <span className="w-6 text-center">#</span>
                  <span className="flex-1">Equipa</span>
                  <span className="w-8 text-center">J</span>
                  <span className="w-8 text-center text-primary font-bold">P</span>
                </div>

                <ol className="divide-y divide-zinc-100 dark:divide-zinc-900">
                  {standings.map((row) => {
                    const isChampion = row.position === 1;
                    const isCafChampions = row.position <= 2;
                    const isCafConfederation = row.position === 3;
                    const marker = isCafChampions
                      ? 'border-l-2 border-amber-500'
                      : isCafConfederation
                      ? 'border-l-2 border-blue-500'
                      : 'border-l-2 border-transparent';

                    return (
                      <li key={row.teamId} className={`${marker} hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors`}>
                        <Link
                          href={`/teams/${row.teamId}`}
                          className="flex items-center gap-2.5 py-2.5 px-2 text-xs"
                        >
                          <span className={`w-6 text-center font-mono font-bold ${isChampion ? 'text-accent' : 'text-zinc-500'}`}>
                            {row.position}.
                          </span>
                          <TeamCrest teamId={row.teamId} size={20} className="flex-shrink-0" />
                          <span className="flex-1 min-w-0 font-semibold leading-tight text-foreground whitespace-normal">{getTeamFullName(row.teamId, row.teamName)}</span>
                          <span className="w-8 text-center font-mono text-zinc-500 dark:text-zinc-400">{row.played}</span>
                          <span className="w-8 text-center font-mono font-black text-primary dark:text-white">{row.points}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>

                <div className="border-t border-zinc-100 dark:border-zinc-900 mt-4 pt-3 text-center">
                  <Link href={ROUTES.standings} className="inline-flex items-center gap-1 text-[10px] font-mono uppercase font-bold text-primary hover:text-accent transition-colors">
                    Ver classificação completa <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* ────── RIGHT COLUMN (MAIN CONTENT - 8 Cols) ────── */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* ─── NOTÍCIAS ─── */}
            <div className="relative pt-6">
              <div 
                className="absolute top-0 left-0 bg-[#C2FA0A] text-black font-display font-black text-sm uppercase px-6 py-2.5 z-10 flex items-center select-none"
                style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 100%)' }}
              >
                <span className="pr-4 tracking-wider flex items-center gap-1.5">
                  NOTÍCIAS <span className="text-[11px] font-black">›</span>
                </span>
              </div>

              <div className="border-t-2 border-[#C2FA0A] pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Big Featured News Card (2/3 width) */}
                {featuredNews && (
                  <div className="md:col-span-2 flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all group">
                    <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                      <div className="absolute top-4 left-4 z-20 flex gap-2">
                        <span className="text-[9px] font-mono uppercase font-bold bg-[#C2FA0A] text-black px-2 py-0.5 rounded shadow-sm">
                          {featuredNews.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <span className="text-[9px] font-mono text-zinc-300 block mb-1">
                          {getTimeLabel(featuredNews.date)}
                        </span>
                        <h3 className="text-lg md:text-xl font-display font-black uppercase text-white group-hover:text-[#C2FA0A] transition-colors leading-tight line-clamp-2">
                          {featuredNews.title}
                        </h3>
                      </div>
                      {/* Subtly animated decorative grid */}
                      <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
                        {featuredNews.summary}
                      </p>
                      <Link href={`/news/${featuredNews.id}`} className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-primary hover:text-accent transition-colors self-start">
                        Ler Comunicado <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Secondary News List Stack (1/3 width) */}
                <div className="flex flex-col gap-4">
                  {secondaryNews.map((article) => (
                    <div 
                      key={article.id} 
                      className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all group flex flex-col justify-between h-[120px] md:h-[135px]"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[8px] font-mono uppercase bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded font-bold">
                            {article.category}
                          </span>
                          <span className="text-[8px] font-mono text-zinc-400 dark:text-zinc-500">
                            {getTimeLabel(article.date)}
                          </span>
                        </div>
                        <Link href={`/news/${article.id}`}>
                          <h4 className="text-xs md:text-sm font-display font-bold uppercase text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                        </Link>
                      </div>
                      <Link href={`/news/${article.id}`} className="inline-flex items-center gap-1 text-[9px] font-mono uppercase font-bold text-primary hover:text-accent transition-colors">
                        Ler <ArrowRight size={9} />
                      </Link>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* ─── VÍDEOS ─── */}
            <div className="relative pt-6">
              <div 
                className="absolute top-0 left-0 bg-[#0B1E43] dark:bg-primary text-white font-display font-black text-sm uppercase px-6 py-2.5 z-10 flex items-center select-none"
                style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 100%)' }}
              >
                <span className="pr-4 tracking-wider flex items-center gap-1.5">
                  VÍDEOS <span className="text-[11px] font-black">›</span>
                </span>
              </div>

              <div className="border-t-2 border-[#0B1E43] dark:border-primary pt-6">
                
                {/* Video Category Filter Pill Row */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {['TODOS', 'RESUMOS', 'ENTREVISTAS', 'COMPILAÇÕES', 'TRANSMISSÃO OFICIAL'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveVideoCategory(cat)}
                      className={`px-4 py-1.5 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider border transition-all flex-shrink-0 ${
                        activeVideoCategory === cat
                          ? 'bg-[#0B1E43] dark:bg-primary border-transparent text-white shadow-xs'
                          : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Big Video Card on Left (2/3 width) */}
                  <div className="md:col-span-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all group flex flex-col justify-between">
                    <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden flex items-center justify-center">
                      <iframe
                        src={activeVideo.videoUrl}
                        title={activeVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0 z-10"
                      />
                      {/* Play/Loading Placeholder overlay that hides when playing is triggered (handled natively by iframe load, but showing visual outline) */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="text-[9px] font-mono uppercase font-bold bg-[#E6540F] text-white px-2 py-0.5 rounded shadow-sm">
                          {activeVideo.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 block mb-1">
                        {activeVideo.views} · {activeVideo.duration}
                      </span>
                      <h3 className="text-base md:text-lg font-display font-black uppercase text-foreground leading-snug">
                        {activeVideo.title}
                      </h3>
                    </div>
                  </div>

                  {/* Secondary Video Sidebar Column (1/3 width) */}
                  <div className="flex flex-col gap-4">
                    {filteredVideos.slice(0, 3).map((video) => (
                      <div 
                        key={video.id} 
                        onClick={() => setActiveVideoId(video.id)}
                        className={`bg-white dark:bg-zinc-950 border rounded-2xl p-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex gap-3 items-center h-[90px] ${
                          activeVideo.id === video.id 
                            ? 'border-primary dark:border-primary bg-primary/[0.02] dark:bg-primary/[0.02]' 
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        {/* Compact Video Thumbnail */}
                        <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-zinc-950 flex-shrink-0">
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                            <Play size={14} className="text-white fill-white group-hover:scale-110 transition-transform duration-250" />
                          </div>
                          <div className="text-[7px] font-mono absolute bottom-1 right-1 bg-black/70 text-white px-1 rounded z-20">
                            {video.duration}
                          </div>
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] font-mono text-zinc-400 dark:text-zinc-500 uppercase block leading-none mb-1">
                            {video.category}
                          </span>
                          <h4 className="text-[11px] font-display font-bold uppercase text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {video.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-900 mt-6 pt-4 text-center">
                  <Link href="/ligatv" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-primary hover:text-accent transition-colors">
                    Aceder à Liga TV <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
