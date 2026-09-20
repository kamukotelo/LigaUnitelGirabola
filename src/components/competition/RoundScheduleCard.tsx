'use client';

import React from 'react';
import Link from 'next/link';
import { Tv, Swords, Crown } from 'lucide-react';
import { TEAMS, type Match } from '@/lib/data';
import TeamCrest from '@/components/ui/TeamCrest';

interface RoundScheduleCardProps {
  round: number;
  matches: Match[];
  title?: string;
}

export default function RoundScheduleCard({
  round,
  matches,
  title,
}: RoundScheduleCardProps) {
  const formatMatchKickoff = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { dayOfWeek: 'DOMINGO', date: '20/09', time: '15:30' };

    const days = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];
    const dayOfWeek = days[d.getDay()];
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');

    return {
      dayOfWeek,
      date: `${dd}/${mm}`,
      time: `${hh}:${min}`,
    };
  };

  const getSpecialTag = (m: Match) => {
    const teams = [m.homeTeamId, m.awayTeamId];
    if (teams.includes('petro') && teams.includes('dago')) {
      return { label: 'CLÁSSICO', type: 'classico' };
    }
    if ((teams.includes('dago') && teams.includes('fcluanda')) ||
        (teams.includes('kabuscorp') && teams.includes('interclube')) ||
        (teams.includes('petro') && teams.includes('interclube')) ||
        (teams.includes('petro') && teams.includes('kabuscorp'))) {
      return { label: 'DÉRBI LUANDA', type: 'derbi' };
    }
    if (teams.includes('sagrada') && teams.includes('petro')) {
      return { label: 'CLÁSSICO', type: 'classico' };
    }
    return null;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden font-sans">
      {/* Cabeçalho Laranja Vibrante Estilo Imagem 4 */}
      <div className="bg-[#f06428] text-white px-4 py-2.5 text-center">
        <h3 className="text-base font-black font-display uppercase tracking-wider">
          {title || `${round}.ª JORNADA`}
        </h3>
      </div>

      {/* Lista de Partidas */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
        {matches.map((match) => {
          const { dayOfWeek, date, time } = formatMatchKickoff(match.date);
          const tag = getSpecialTag(match);
          const broadcaster = match.broadcaster?.trim();
          const homeShortName = TEAMS.find((team) => team.id === match.homeTeamId)?.shortName ?? match.homeTeam;
          const awayShortName = TEAMS.find((team) => team.id === match.awayTeamId)?.shortName ?? match.awayTeam;
          const isFinished = match.status === 'finished';
          const isLive = match.status === 'live';
          const isPostponed = match.postponed === true;

          return (
            <Link
              key={match.id}
              href={`/matches/${match.id}`}
              className="block p-3.5 hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 transition-colors group"
            >
              {/* Linha Principal dos Clubes e Placar Central */}
              <div className="flex items-center justify-between gap-2">
                {/* Equipa Casa */}
                <div className="flex-1 flex items-center justify-end gap-2 text-right min-w-0">
                  <span className="font-bold text-xs sm:text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    <span className="sm:hidden">{homeShortName}</span><span className="hidden sm:inline">{match.homeTeam}</span>
                  </span>
                  <TeamCrest teamId={match.homeTeamId} size={22} className="flex-shrink-0 sm:w-7" />
                </div>

                {/* Placar Central em Pílula Arredondada (Imagem 4) */}
                <div className="flex-shrink-0 px-3 py-1 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs sm:text-sm font-black text-foreground shadow-sm">
                  {isFinished || isLive ? `${match.homeScore} : ${match.awayScore}` : '— — —'}
                </div>

                {/* Equipa Fora */}
                <div className="flex-1 flex items-center justify-start gap-2 text-left min-w-0">
                  <TeamCrest teamId={match.awayTeamId} size={22} className="flex-shrink-0 sm:w-7" />
                  <span className="font-bold text-xs sm:text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    <span className="sm:hidden">{awayShortName}</span><span className="hidden sm:inline">{match.awayTeam}</span>
                  </span>
                </div>
              </div>

              {/* Sublinha: Data/Horário + Tags Especiais + Transmissão TV/Rádio */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 pt-1 font-mono text-[10px]">
                <span className="text-zinc-500 font-semibold">
                  {isPostponed ? 'ADIADO · À ESPERA DE DATA' : `${dayOfWeek}, ${date} · ${time}`}
                </span>

                {/* Tag de Dérbi ou Clássico */}
                {tag && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    tag.type === 'classico'
                      ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                      : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  }`}>
                    {tag.type === 'classico' ? <Crown size={10} /> : <Swords size={10} />}
                    {tag.label}
                  </span>
                )}

                {/* Badge de TV Zsports */}
                {broadcaster && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#5C0F8B] text-white font-bold uppercase tracking-wider">
                    <Tv size={10} /> {broadcaster}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
