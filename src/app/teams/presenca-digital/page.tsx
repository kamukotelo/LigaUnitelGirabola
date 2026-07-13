import Link from 'next/link';
import { ExternalLink, Globe, Share2, ShieldCheck, TriangleAlert } from 'lucide-react';
import { TEAMS, getTeamProfile } from '@/lib/data';
import TeamCrest from '@/components/ui/TeamCrest';

const CHANNELS = [
  { key: 'website', label: 'Site', icon: Globe },
  { key: 'facebook', label: 'Facebook', icon: Share2 },
  { key: 'instagram', label: 'Instagram', icon: Share2 },
] as const;

type ChannelKey = (typeof CHANNELS)[number]['key'];

function getChannelUrl(teamId: string, channel: ChannelKey) {
  const profile = getTeamProfile(teamId);
  if (!profile) return undefined;
  if (channel === 'website') return profile.website;
  return profile.socials[channel];
}

export default function PresencaDigitalPage() {
  const rows = TEAMS.map((team) => {
    const links = {
      website: getChannelUrl(team.id, 'website'),
      facebook: getChannelUrl(team.id, 'facebook'),
      instagram: getChannelUrl(team.id, 'instagram'),
    };
    const missing = CHANNELS.filter((channel) => !links[channel.key]).map((channel) => channel.label);
    return { team, links, missing };
  });

  const completeCount = rows.filter((row) => row.missing.length === 0).length;
  const partialCount = rows.length - completeCount;
  const missingSiteCount = rows.filter((row) => !row.links.website).length;

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Globe size={14} className="text-accent" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
              PRESENCA_DIGITAL
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display text-foreground uppercase leading-none">
            Canais oficiais dos clubes
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-mono uppercase tracking-wider">
            Sites e redes sociais usados nas paginas de cada equipa
          </p>
        </div>
        <Link
          href="/teams"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          Voltar as equipas
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Clubes completos', value: completeCount, tone: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Com dados parciais', value: partialCount, tone: 'text-amber-600 dark:text-amber-400' },
          { label: 'Sem site confirmado', value: missingSiteCount, tone: 'text-red-600 dark:text-red-400' },
        ].map((metric) => (
          <div key={metric.label} className="rounded-lg border border-zinc-200 dark:border-zinc-900 bg-zinc-100/40 dark:bg-zinc-950/40 p-5">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500">{metric.label}</span>
            <span className={`mt-2 block text-4xl font-display font-black ${metric.tone}`}>{metric.value}</span>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-900 bg-zinc-100/30 dark:bg-zinc-950/30">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-900">
            <thead className="bg-white/50 dark:bg-zinc-950/60">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-zinc-500">Clube</th>
                {CHANNELS.map((channel) => (
                  <th key={channel.key} className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                    {channel.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-zinc-500">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-900/80">
              {rows.map(({ team, links, missing }) => (
                <tr key={team.id} className="hover:bg-white/40 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="px-4 py-4">
                    <Link href={`/teams/${team.id}`} className="flex items-center gap-3 group">
                      <TeamCrest teamId={team.id} size={42} className="rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1" />
                      <span>
                        <span className="block text-sm font-bold text-foreground group-hover:text-accent transition-colors">{team.name}</span>
                        <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">{team.city}</span>
                      </span>
                    </Link>
                  </td>
                  {CHANNELS.map((channel) => {
                    const Icon = channel.icon;
                    const url = links[channel.key];
                    return (
                      <td key={channel.key} className="px-4 py-4">
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                          >
                            <Icon size={12} /> Abrir <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                            Em falta
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-4">
                    {missing.length === 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck size={13} /> Completo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        <TriangleAlert size={13} /> Falta {missing.join(', ')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
