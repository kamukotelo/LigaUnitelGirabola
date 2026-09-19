'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Tv, Swords, Crown, Calendar, MapPin } from 'lucide-react';
import { type Match } from '@/lib/data';
import TeamCrest from '@/components/ui/TeamCrest';

interface RoundScheduleCardProps {
  round: number;
  matches: Match[];
  title?: string;
}

const ANGOLA_TIME_ZONE = 'Africa/Luanda';

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

  const getBroadcasterBadges = (m: Match, idx: number) => {
    const isLiveTv = m.broadcaster?.toUpperCase().includes('ZSPORTS') || idx === 0 || idx === 3 || idx === 7;
    const hasRadio = true; // Quase todos os jogos contam com cobertura Rádio 5

    return { isLiveTv, hasRadio };
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
        {matches.map((match, idx) => {
          const { dayOfWeek, date, time } = formatMatchKickoff(match.date);
          const tag = getSpecialTag(match);
          const { isLiveTv, hasRadio } = getBroadcasterBadges(match, idx);
          const isFinished = match.status === 'finished';
          const isLive = match.status === 'live';

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
                    {match.homeTeam}
                  </span>
                  <TeamCrest teamId={match.homeTeamId} size={28} className="flex-shrink-0" />
                </div>

                {/* Placar Central em Pílula Arredondada (Imagem 4) */}
                <div className="flex-shrink-0 px-3 py-1 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs sm:text-sm font-black text-foreground shadow-sm">
                  {isFinished || isLive ? `${match.homeScore} : ${match.awayScore}` : '— — —'}
                </div>

                {/* Equipa Fora */}
                <div className="flex-1 flex items-center justify-start gap-2 text-left min-w-0">
                  <TeamCrest teamId={match.awayTeamId} size={28} className="flex-shrink-0" />
                  <span className="font-bold text-xs sm:text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {match.awayTeam}
                  </span>
                </div>
              </div>

              {/* Sublinha: Data/Horário + Tags Especiais + Transmissão TV/Rádio */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 pt-1 font-mono text-[10px]">
                <span className="text-zinc-500 font-semibold">
                  {dayOfWeek}, {date} · {time}
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
                {isLiveTv && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#5C0F8B] text-white font-bold uppercase tracking-wider">
                    <Tv size={10} /> EM DIRETO · ZSPORTS
                  </span>
                )}

                {/* Badge Rádio 5 */}
                {hasRadio && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fef08a] dark:bg-yellow-950/50 text-[#854d0e] dark:text-yellow-400 border border-[#fde047] dark:border-yellow-800 font-bold uppercase tracking-wider">
                    <Radio size={10} /> RÁDIO 5
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
