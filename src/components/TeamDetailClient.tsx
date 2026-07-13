'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trophy, MapPin, User, Calendar, Shield, Flame, Users, ArrowLeft, Medal, Shirt, Globe, ExternalLink, BarChart3, Newspaper, Building2 } from 'lucide-react';
import { Team, Player, Match, StandingEntry, getTeamProfile, getNewsArticles, getTeamZeroZeroUrl } from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';
import TeamCrest from '@/components/ui/TeamCrest';

interface TeamDetailClientProps {
  team: Team;
  players: Player[];
  matches: Match[];
  standing?: StandingEntry;
}

type TeamTab = 'geral' | 'plantel' | 'estatisticas' | 'resultados';

const TEAM_TABS: { key: TeamTab; label: string; icon: typeof Shield }[] = [
  { key: 'geral', label: 'Geral', icon: Shield },
  { key: 'plantel', label: 'Plantel', icon: Users },
  { key: 'estatisticas', label: 'Estatísticas', icon: BarChart3 },
  { key: 'resultados', label: 'Resultados', icon: Calendar },
];

export default function TeamDetailClient({ team, players, matches, standing }: TeamDetailClientProps) {
  const [tab, setTab] = useState<TeamTab>('geral');
  const profile = getTeamProfile(team.id);
  const zerozeroUrl = getTeamZeroZeroUrl(team);

  // Group players by position
  const playersByPosition = {
    'Guarda-redes': players.filter((p) => p.position === 'Guarda-redes'),
    'Defesa': players.filter((p) => p.position === 'Defesa' || p.position === 'Defesa Esquerdo' || p.position === 'Defesa Direito'),
    'Médio': players.filter((p) => p.position.includes('Médio') || p.position.includes('Extremo') && p.position !== 'Avançado'),
    'Avançado': players.filter((p) => p.position === 'Avançado' || p.position.includes('Ponta de Lança')),
  };

  const clubColor = team.colorsHex ? team.colorsHex[0] : '#5C0F8B';

  // Notícias que mencionam o clube (título ou resumo)
  const clubNews = getNewsArticles().filter((n) => {
    const needle = team.name.toLowerCase();
    return n.title.toLowerCase().includes(needle) || (n.summary ?? '').toLowerCase().includes(needle);
  }).slice(0, 3);
  const socialLinks = profile
    ? [
        { network: 'facebook', label: 'Facebook', url: profile.socials.facebook },
        { network: 'instagram', label: 'Instagram', url: profile.socials.instagram },
        { network: 'youtube', label: 'YouTube', url: profile.socials.youtube },
      ].filter((link): link is { network: string; label: string; url: string } => Boolean(link.url))
    : [];

  // Agregados do clube para a aba Estatísticas
  const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];
  const topAssister = [...players].sort((a, b) => b.assists - a.assists)[0];
  const totalYellow = players.reduce((s, p) => s + (p.detailedStats?.yellowCards ?? 0), 0);
  const totalRed = players.reduce((s, p) => s + (p.detailedStats?.redCards ?? 0), 0);
  const squadAvgAge = players.length > 0 ? players.reduce((s, p) => s + p.age, 0) / players.length : 0;

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      {/* Club ambient light glow */}
      <div
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full filter blur-[120px] opacity-10 pointer-events-none z-0"
        style={{ backgroundColor: clubColor }}
      />

      {/* Back Button */}
      <Link href="/teams" className="inline-flex items-center gap-2 text-xs font-mono uppercase text-zinc-600 dark:text-zinc-400 hover:text-foreground mb-8 transition-colors">
        <ArrowLeft size={14} /> Voltar para Equipas
      </Link>

      {/* HUD Header — denominação oficial, fundação, presidente e estádio */}
      <AnimatedCard variant="holographic" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200/80 dark:border-zinc-900/80 p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 status-pulse" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            REGISTO_FAF_ATIVO
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          {/* Logo Badge (TeamCrest SVG) */}
          <TeamCrest teamId={team.id} size={96} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-3xl" />

          <div className="flex-1 space-y-4">
            <div>
              <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-semibold block mb-1">
                {profile?.officialName && profile.officialName !== team.name ? profile.officialName : 'CLUBE PARTICIPANTE'}
              </span>
              <h1 className="text-4xl md:text-5xl font-display text-foreground uppercase leading-none">
                {team.name}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 font-mono text-xs uppercase tracking-wider mt-1">
                Fundado em {team.founded} · Alcunha: {team.shortName}
                {profile?.president && <> · Presidente: {profile.president}</>}
              </p>
              <a
                href={zerozeroUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
              >
                Perfil ZeroZero <ExternalLink size={11} />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/60 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-600 block uppercase">Cidade</span>
                <span className="text-foreground font-bold flex items-center justify-center md:justify-start gap-1.5">
                  <MapPin size={12} className="text-primary" /> {team.city}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-600 block uppercase">Estádio</span>
                {profile ? (
                  <a
                    href={profile.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-bold flex items-center justify-center md:justify-start gap-1.5 truncate hover:text-primary transition-colors"
                    title={`${team.stadium} · Ver no mapa`}
                  >
                    <Trophy size={12} className="text-accent" /> {team.stadium}
                  </a>
                ) : (
                  <span className="text-foreground font-bold flex items-center justify-center md:justify-start gap-1.5 truncate" title={team.stadium}>
                    <Trophy size={12} className="text-accent" /> {team.stadium}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-600 block uppercase">Treinador</span>
                <span className="text-foreground font-bold flex items-center justify-center md:justify-start gap-1.5">
                  <User size={12} className="text-zinc-500" /> {team.coach}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-600 block uppercase">Cores</span>
                <span className="text-foreground font-bold block truncate">
                  {team.colors}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Abas do clube (estilo Liga Angola) */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-900 mb-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {TEAM_TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 sm:px-6 py-4 text-center text-xs font-mono uppercase tracking-wider font-extrabold border-b-2 transition-all duration-200 flex-shrink-0 flex items-center gap-2 ${
                active
                  ? 'text-accent border-accent bg-accent/5'
                  : 'text-zinc-500 border-transparent hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── ABA GERAL ─────────────────────────────────────────────────── */}
      {tab === 'geral' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8 lg:col-span-1">
            {/* Ficha do clube (identidade consolidada, estilo zerozero.pt) */}
            <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
              <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield size={16} className="text-primary" /> Ficha do Clube
              </h3>
              <dl className="divide-y divide-zinc-200/60 dark:divide-zinc-900/60 text-xs font-mono border-t border-zinc-200/60 dark:border-zinc-900/60">
                {([
                  ['Nome oficial', profile?.officialName ?? team.name],
                  ['Alcunha / Sigla', team.shortName],
                  ['Fundação', String(team.founded)],
                  ['Cidade', `${team.city}, Angola`],
                  ['Estádio', team.stadium],
                  ['Capacidade', `${team.stadiumCapacity.toLocaleString('pt-AO')} lugares`],
                  ['Cores', team.colors],
                  ['Treinador', team.coach],
                  ['Presidente', profile?.president ?? '—'],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 py-2.5">
                    <dt className="text-[10px] text-zinc-500 uppercase tracking-wide">{label}</dt>
                    <dd className="font-bold text-foreground text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </AnimatedCard>

            {/* Standing Position Card */}
            {standing && (
              <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
                <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield size={16} className="text-accent" /> Rendimento Geral
                </h3>

                <div className="flex items-center justify-between py-4 border-y border-zinc-200/60 dark:border-zinc-900/60 font-mono">
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase">Classificação</span>
                    <span className="text-4xl font-display font-extrabold text-foreground flex items-baseline gap-1">
                      {standing.position}º
                      <span className="text-xs text-zinc-500">/16</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-500 block uppercase">Pontuação</span>
                    <span className="text-4xl font-display font-extrabold text-primary">
                      {standing.points}
                      <span className="text-xs text-zinc-500"> PTS</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-4 text-center font-mono text-xs text-zinc-600 dark:text-zinc-400">
                  <div>
                    <span className="text-[9px] text-zinc-500 block">VITORIAS</span>
                    <span className="text-foreground font-bold">{standing.won}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 block">EMPATES</span>
                    <span className="text-foreground font-bold">{standing.drawn}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 block">DERROTAS</span>
                    <span className="text-foreground font-bold">{standing.lost}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[9px] font-mono text-zinc-500 block mb-2">FORMA RECENTE</span>
                  <div className="flex gap-2">
                    {standing.form.map((result, idx) => (
                      <span
                        key={idx}
                        className={`flex-1 py-1 rounded text-center text-xs font-mono font-bold ${
                          result === 'W'
                            ? 'bg-green-500/10 border border-green-500/30 text-green-500'
                            : result === 'D'
                            ? 'bg-zinc-200/20 dark:bg-zinc-800/20 border border-zinc-300/30 dark:border-zinc-700/30 text-zinc-600 dark:text-zinc-400'
                            : 'bg-red-500/10 border border-red-500/30 text-red-500'
                        }`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            )}

            {/* Stadium virtual info */}
            <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6 relative overflow-hidden">
              <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Trophy size={16} className="text-accent" /> Estádio e Instalações
              </h3>

              <div className="space-y-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between border-b border-zinc-200/60 dark:border-zinc-900/60 pb-2">
                  <span>Nome Oficial:</span>
                  <span className="text-foreground font-bold text-right">{team.stadium}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200/60 dark:border-zinc-900/60 pb-2">
                  <span>Capacidade Oficial:</span>
                  <span className="text-foreground font-bold">{team.stadiumCapacity.toLocaleString('pt-AO')} Lugares</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200/60 dark:border-zinc-900/60 pb-2">
                  <span>Localização:</span>
                  <span className="text-foreground font-bold">{team.city}, Angola</span>
                </div>
                {profile && (
                  <a
                    href={profile.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 pt-1 text-accent hover:text-accent/80 uppercase tracking-widest text-[10px] font-bold transition-colors"
                  >
                    <MapPin size={11} /> Ver no mapa <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </AnimatedCard>

            {/* Órgãos sociais / direção */}
            {profile && profile.board.length > 0 && (
              <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
                <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building2 size={16} className="text-accent" /> Órgãos Sociais
                </h3>
                <div className="space-y-3">
                  {profile.board.map((member) => (
                    <div key={member.role} className="flex items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-900/60 pb-2 last:border-0 last:pb-0">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{member.role}</span>
                      <span className="text-xs font-bold text-foreground text-right">{member.name}</span>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            )}

            {/* Redes sociais e site oficial */}
            {profile && (profile.website || socialLinks.length > 0) && (
              <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
                <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Globe size={16} className="text-accent" /> Presença Digital
                </h3>
                <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider">
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5">
                      <Globe size={11} /> Site Oficial
                    </a>
                  )}
                  {socialLinks.map(({ network, label, url }) => (
                    <a key={network} href={url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors capitalize">
                      {label}
                    </a>
                  ))}
                </div>
              </AnimatedCard>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Palmarés */}
            <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-8">
              <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                <Medal size={20} className="text-accent" /> Palmarés
              </h3>
              {profile && profile.palmares.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.palmares.map((trophy) => (
                    <div key={trophy.title} className="p-4 bg-white/20 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900 rounded-xl text-center">
                      <span className="text-4xl font-display font-black text-accent block">{trophy.count}×</span>
                      <span className="text-xs font-bold text-foreground uppercase block mt-1">{trophy.title}</span>
                      {trophy.seasons && (
                        <span className="text-[9px] font-mono text-zinc-500 block mt-1.5">{trophy.seasons.join(' · ')}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-600 font-mono italic">Sem títulos nacionais registados — a história ainda está por escrever.</p>
              )}
            </AnimatedCard>

            {/* Equipamentos */}
            {profile && (
              <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-8">
                <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Shirt size={20} className="text-accent" /> Equipamentos
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {profile.kits.map((kit) => (
                    <div key={kit.label} className="p-4 bg-white/20 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900 rounded-xl text-center">
                      <div className="flex justify-center mb-3">
                        <div className="flex rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 w-16 h-16">
                          {kit.colors.map((c, i) => (
                            <span key={i} className="flex-1" style={{ background: c }} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{kit.label}</span>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            )}

            {/* Notícias do clube */}
            {clubNews.length > 0 && (
              <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-8">
                <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Newspaper size={20} className="text-accent" /> Últimas Notícias do Clube
                </h3>
                <div className="space-y-3">
                  {clubNews.map((n) => (
                    <Link key={n.id} href={`/news/${n.id}`} className="block p-4 bg-white/20 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900 hover:border-accent/30 rounded-xl transition-colors group">
                      <span className="text-[9px] font-mono text-accent uppercase tracking-widest">{n.category} · {n.date}</span>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mt-1">{n.title}</h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">{n.summary}</p>
                    </Link>
                  ))}
                </div>
              </AnimatedCard>
            )}
          </div>
        </div>
      )}

      {/* ── ABA PLANTEL ───────────────────────────────────────────────── */}
      {tab === 'plantel' && (
        <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-8">
          <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
            <Users size={20} className="text-accent" /> Plantel de Atletas
          </h3>

          <div className="space-y-6">
            {Object.entries(playersByPosition).map(([position, list]) => (
              <div key={position} className="space-y-3">
                <h4 className="text-xs font-mono text-accent uppercase tracking-widest font-extrabold border-b border-zinc-200 dark:border-zinc-900 pb-1.5">
                  {position}
                </h4>
                {list.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map((player) => (
                      <Link key={player.id} href={`/players/${player.id}`}>
                        <div className="p-4 bg-white/20 dark:bg-zinc-900/20 hover:bg-white/40 dark:hover:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900 rounded-xl flex items-center justify-between gap-4 transition-all group hover:border-zinc-200 dark:hover:border-zinc-800">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center font-mono text-xs text-zinc-600 dark:text-zinc-400 group-hover:text-primary font-bold transition-colors">
                              #{player.jerseyNumber}
                            </span>
                            <div>
                              <h5 className="text-foreground font-bold text-sm uppercase group-hover:text-accent transition-colors truncate max-w-[140px]">
                                {player.name}
                              </h5>
                              <span className="text-[9px] text-zinc-500 font-mono uppercase block">{player.nationality} · {player.age} anos</span>
                            </div>
                          </div>

                          {player.goals > 0 && (
                            <div className="text-right flex items-center gap-1 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-lg text-primary font-mono text-[10px] font-bold">
                              <Flame size={10} className="animate-pulse" />
                              {player.goals} G
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-600 font-mono italic">Nenhum jogador registado.</p>
                )}
              </div>
            ))}
          </div>
        </AnimatedCard>
      )}

      {/* ── ABA ESTATÍSTICAS ──────────────────────────────────────────── */}
      {tab === 'estatisticas' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Golos Marcados', value: standing?.goalsFor ?? 0 },
              { label: 'Golos Sofridos', value: standing?.goalsAgainst ?? 0 },
              { label: 'Diferença de Golos', value: standing ? (standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference) : 0 },
              { label: 'Idade Média do Plantel', value: squadAvgAge > 0 ? squadAvgAge.toFixed(1) : '—' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm text-center">
                <p className="font-display text-2xl sm:text-3xl text-foreground font-black leading-none">{stat.value}</p>
                <p className="text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topScorer && (
              <AnimatedCard variant="hud" className="p-6 text-center">
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-2">Melhor Marcador</span>
                <Link href={`/players/${topScorer.id}`} className="text-lg font-display text-foreground uppercase hover:text-primary transition-colors block">{topScorer.name}</Link>
                <span className="text-3xl font-display font-black text-accent block mt-2">{topScorer.goals} golos</span>
              </AnimatedCard>
            )}
            {topAssister && (
              <AnimatedCard variant="hud" className="p-6 text-center">
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-2">Rei das Assistências</span>
                <Link href={`/players/${topAssister.id}`} className="text-lg font-display text-foreground uppercase hover:text-primary transition-colors block">{topAssister.name}</Link>
                <span className="text-3xl font-display font-black text-accent block mt-2">{topAssister.assists} assists</span>
              </AnimatedCard>
            )}
            <AnimatedCard variant="hud" className="p-6 text-center">
              <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-2">Disciplina do Plantel</span>
              <span className="text-lg font-display text-foreground uppercase block">Cartões</span>
              <span className="text-3xl font-display font-black block mt-2">
                <span className="text-amber-500">{totalYellow} 🟨</span>
                <span className="text-red-500 ml-3">{totalRed} 🟥</span>
              </span>
            </AnimatedCard>
          </div>
        </div>
      )}

      {/* ── ABA RESULTADOS ────────────────────────────────────────────── */}
      {tab === 'resultados' && (
        <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6 sm:p-8">
          <h3 className="text-lg font-display text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-accent" /> Percurso na Época
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matches.map((match) => {
              const isHome = match.homeTeamId === team.id;
              const opponent = isHome ? match.awayTeam : match.homeTeam;
              const opponentId = isHome ? match.awayTeamId : match.homeTeamId;
              const isFinished = match.status === 'finished';
              const gf = isHome ? match.homeScore : match.awayScore;
              const ga = isHome ? match.awayScore : match.homeScore;
              const outcome = !isFinished ? null : gf > ga ? 'V' : gf < ga ? 'D' : 'E';
              const outcomeColor = outcome === 'V' ? 'text-green-500 border-green-500/30 bg-green-500/10' : outcome === 'D' ? 'text-red-500 border-red-500/30 bg-red-500/10' : 'text-zinc-500 border-zinc-500/30 bg-zinc-500/10';

              return (
                <Link key={match.id} href={`/matches/${match.id}`} className="p-4 bg-white/20 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900 hover:border-accent/30 transition-colors rounded-xl flex items-center justify-between gap-4 font-mono text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <TeamCrest teamId={opponentId} size={30} className="flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[8px] text-zinc-500 block uppercase">JORNADA {match.round} · {isHome ? 'Casa' : 'Fora'}</span>
                      <span className="text-foreground font-bold block truncate">{opponent}</span>
                    </div>
                  </div>

                  {isFinished ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="px-2.5 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-foreground font-bold">
                        {isHome ? match.score : match.score?.split('-').reverse().join('-')}
                      </span>
                      <span className={`w-6 h-6 rounded flex items-center justify-center border font-bold ${outcomeColor}`}>{outcome}</span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded text-center text-primary font-bold flex-shrink-0">
                      VS
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </AnimatedCard>
      )}

    </div>
  );
}
