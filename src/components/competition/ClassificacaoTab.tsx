'use client';

import { motion } from 'framer-motion';
import { Info, Award } from 'lucide-react';
import Link from 'next/link';
import { SEASONS, UPCOMING_SEASON_ID, getStandingsForSeason } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';

export default function ClassificacaoTab({ seasonId }: { seasonId: string }) {
  const standingsList = getStandingsForSeason(seasonId);
  const selectedSeason = SEASONS.find(s => s.id === seasonId);
  const isUpcoming = seasonId === UPCOMING_SEASON_ID;

  // Curiosidades derivadas da tabela calculada (coincidem sempre com os jogos).
  const bestDefense = [...standingsList].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0];
  const bestAttack = [...standingsList].sort((a, b) => b.goalsFor - a.goalsFor)[0];
  const champion = standingsList[0];
  const hasVerifiedGoals = standingsList.every((row) => row.goalsVerified !== false);

  return (
    <div className="space-y-8">

      {/* Table Container */}
      <div className="overflow-hidden">
        <AnimatedCard variant="hud" className="p-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-900/40 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-4 px-3 sm:px-4 text-center w-10 sm:w-12">#</th>
                <th className="py-4 px-3 sm:px-4">Clube</th>
                <th className="py-4 px-2 sm:px-3 text-center w-10 sm:w-14">J</th>
                <th className="py-4 px-2 sm:px-3 text-center w-10 sm:w-12 hidden sm:table-cell">V</th>
                <th className="py-4 px-2 sm:px-3 text-center w-10 sm:w-12 hidden sm:table-cell">E</th>
                <th className="py-4 px-2 sm:px-3 text-center w-10 sm:w-12 hidden sm:table-cell">D</th>
                <th className="py-4 px-2 sm:px-3 text-center w-16 sm:w-20 hidden md:table-cell">Golos</th>
                <th className="py-4 px-2 sm:px-3 text-center w-12 sm:w-14">DG</th>
                <th className="py-4 px-3 sm:px-4 text-center w-14 sm:w-16 bg-primary/10 text-primary dark:text-white font-bold">PTS</th>
                <th className="py-4 px-3 sm:px-4 text-center w-28 sm:w-36">Forma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900/60">
              {standingsList.map((row, i) => {
                const isChampion = row.position === 1 && !isUpcoming;
                const isCafChampions = row.position <= 2;
                const isCafConfederation = row.position === 3;
                const isPlayoff = row.position === 14;
                const isRelegated = row.position >= 15;

                let rowBg = 'hover:bg-zinc-100 dark:hover:bg-zinc-900/20';
                let posColor = 'text-zinc-600 dark:text-zinc-400';
                let borderIndicator = 'border-l-2 border-transparent';

                if (isChampion) {
                  rowBg = 'bg-primary/5 hover:bg-primary/10';
                  posColor = 'text-accent font-extrabold';
                  borderIndicator = 'border-l-4 border-accent';
                } else if (isCafChampions) {
                  borderIndicator = 'border-l-2 border-amber-500';
                } else if (isCafConfederation) {
                  borderIndicator = 'border-l-2 border-blue-500';
                } else if (isPlayoff) {
                  borderIndicator = 'border-l-2 border-orange-500';
                } else if (isRelegated) {
                  borderIndicator = 'border-l-2 border-red-600';
                }

                return (
                  <motion.tr
                    key={row.teamId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className={`transition-colors duration-150 ${rowBg}`}
                  >
                    {/* Position Indicator */}
                    <td className={`py-4 px-3 sm:px-4 text-center font-mono ${posColor} ${borderIndicator}`}>
                      {isChampion ? (
                        <div className="flex justify-center items-center">
                          <Award className="h-5 w-5 text-accent animate-bounce" />
                        </div>
                      ) : (
                        row.position
                      )}
                    </td>

                    {/* Team Name and Crest */}
                    <td className="py-4 px-3 sm:px-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2.5 sm:gap-3.5">
                        <TeamCrest teamId={row.teamId} size={34} />
                        <Link href={`/teams/${row.teamId}`} className="hover:text-primary transition-colors truncate max-w-[100px] sm:max-w-none text-xs sm:text-sm block">
                          {row.teamName}
                          {isChampion && (
                            <span className="ml-1.5 text-[8px] font-mono bg-accent/25 text-accent border border-accent/40 px-1.5 py-0.2 rounded-full hidden sm:inline">
                              CAMPEÃO
                            </span>
                          )}
                        </Link>
                      </div>
                    </td>

                    {/* Match Stats */}
                    <td className="py-4 px-2 sm:px-3 text-center font-mono text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm">{row.played}</td>
                    <td className="py-4 px-2 sm:px-3 text-center font-mono text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm hidden sm:table-cell">{row.won}</td>
                    <td className="py-4 px-2 sm:px-3 text-center font-mono text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm hidden sm:table-cell">{row.drawn}</td>
                    <td className="py-4 px-2 sm:px-3 text-center font-mono text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm hidden sm:table-cell">{row.lost}</td>
                    <td className="py-4 px-2 sm:px-3 text-center font-mono text-zinc-600 dark:text-zinc-400 text-[10px] sm:text-xs hidden md:table-cell">
                      {row.goalsVerified === false ? '—' : `${row.goalsFor}-${row.goalsAgainst}`}
                    </td>
                    <td className={`py-4 px-2 sm:px-3 text-center font-mono font-semibold text-xs ${row.goalsVerified === false ? 'text-zinc-400' : row.goalDifference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {row.goalsVerified === false ? '—' : row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>

                    {/* Points */}
                    <td className="py-4 px-3 sm:px-4 text-center font-mono font-extrabold text-sm sm:text-md bg-primary/5 text-primary dark:text-white">
                      {row.points}
                    </td>

                    {/* Form History */}
                    <td className="py-4 px-3 sm:px-4">
                      {row.formVerified === false ? (
                        <span className="block text-center text-[9px] font-mono uppercase tracking-wide text-zinc-400">Não disponível</span>
                      ) : <div className="flex justify-center gap-1">
                        {row.form.map((result, idx) => {
                          let dotBg = 'bg-zinc-300 dark:bg-zinc-700';
                          let textColor = 'text-zinc-700 dark:text-white';
                          if (result === 'W') {
                            dotBg = 'bg-green-500/10 border border-green-500/40';
                            textColor = 'text-green-600 dark:text-green-500';
                          } else if (result === 'D') {
                            dotBg = 'bg-zinc-500/10 border border-zinc-500/30';
                            textColor = 'text-zinc-500';
                          } else if (result === 'L') {
                            dotBg = 'bg-red-500/10 border border-red-500/40';
                            textColor = 'text-red-500';
                          }
                          return (
                            <span
                              key={idx}
                              className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[9px] font-bold ${dotBg} ${textColor}`}
                              title={result === 'W' ? 'Vitória' : result === 'D' ? 'Empate' : 'Derrota'}
                            >
                              {result}
                            </span>
                          );
                        })}
                      </div>}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </AnimatedCard>
      </div>

      {/* Legenda abaixo: liberta toda a largura para a classificação */}
      <div className="space-y-6">

        {/* Legend Card */}
        <AnimatedCard variant="hud" className="p-6">
          <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Info size={16} className="text-accent" /> Legenda
          </h3>

          <div className="grid gap-4 text-xs sm:grid-cols-2 xl:grid-cols-5">
            <div className="flex items-start gap-3">
              <span className="w-1.5 h-6 bg-accent rounded-full block flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground font-mono uppercase">1º Lugar (Campeão)</h4>
                <p className="text-zinc-600 dark:text-zinc-400">Qualificação para a Liga dos Campeões da CAF.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full block flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground font-mono uppercase">2º Lugar</h4>
                <p className="text-zinc-600 dark:text-zinc-400">Qualificação para a Liga dos Campeões da CAF.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full block flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground font-mono uppercase">3º Lugar</h4>
                <p className="text-zinc-600 dark:text-zinc-400">Qualificação para a Taça das Confederações da CAF.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full block flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground font-mono uppercase">14º Lugar</h4>
                <p className="text-zinc-600 dark:text-zinc-400">Despromoção (play-offs) à Gira Bola B.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-1.5 h-6 bg-red-600 rounded-full block flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground font-mono uppercase">15º e 16º Lugar</h4>
                <p className="text-zinc-600 dark:text-zinc-400">Despromoção direta à Gira Bola B.</p>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Curiosidades — derivadas da tabela, apenas para épocas já disputadas */}
        {!isUpcoming && champion && hasVerifiedGoals && (
          <AnimatedCard variant="hud" className="p-6">
            <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award size={16} className="text-accent" /> Curiosidades
            </h3>
            <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-400">
              <p>
                ⚽ O <strong className="text-foreground">{bestDefense.teamName}</strong> registou a melhor defesa do campeonato, sofrendo apenas <strong className="text-accent">{bestDefense.goalsAgainst} golos</strong> em {bestDefense.played} jogos.
              </p>
              <p>
                🔥 O <strong className="text-foreground">{bestAttack.teamName}</strong> foi o ataque mais concretizador, com <strong className="text-accent">{bestAttack.goalsFor} golos</strong> marcados.
              </p>
              <p>
                🏆 O título de {selectedSeason?.label} pertence ao <strong className="text-foreground">{champion.teamName}</strong>, líder destacado da galeria de campeões da Liga Unitel Girabola.
              </p>
            </div>
          </AnimatedCard>
        )}

      </div>

    </div>
  );
}
