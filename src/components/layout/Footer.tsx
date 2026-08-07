'use client';

import Link from 'next/link';
// lucide-react v1 já não inclui ícones de marca; usam-se equivalentes genéricos.
import { Globe, Camera, PlayCircle, Mail, Phone, MapPin } from 'lucide-react';
import Brand from './Brand';
import { ROUTES } from '@/lib/routes';
import { useSiteSettings } from '@/lib/portal-overrides';

export default function Footer() {
  const site = useSiteSettings();
  const socials = [
    { url: site.facebookUrl, icon: Globe, label: 'Facebook' },
    { url: site.instagramUrl, icon: Camera, label: 'Instagram' },
    { url: site.youtubeUrl, icon: PlayCircle, label: 'YouTube' },
    { url: site.twitterUrl, icon: Globe, label: 'Twitter / X' },
  ].filter((s) => !!s.url);

  return (
    <footer className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 py-12 relative z-10">
      <div className="content-shell">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Brand size="md" className="mb-3" />
            <p className="text-[11px] font-mono uppercase tracking-widest text-accent mb-2">
              {site.tagline}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm">
              {site.footerDescription}
            </p>
            <ul className="mt-5 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              {site.contactEmail && (
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-accent" />
                  <a href={`mailto:${site.contactEmail}`} className="hover:text-accent transition-colors">{site.contactEmail}</a>
                </li>
              )}
              {site.contactPhone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-accent" /> {site.contactPhone}
                  {site.contactPhone2 && <span>· {site.contactPhone2}</span>}
                </li>
              )}
              {site.contactAddress && (
                <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-accent" /> {site.contactAddress}</li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest mb-4">Plataforma</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href={ROUTES.standings} className="hover:text-accent transition-colors">Classificação</Link>
              </li>
              <li>
                <Link href={ROUTES.calendar} className="hover:text-accent transition-colors">Calendário</Link>
              </li>
              <li>
                <Link href={ROUTES.teams} className="hover:text-accent transition-colors">Clubes Parceiros</Link>
              </li>
              <li>
                <Link href={ROUTES.news} className="hover:text-accent transition-colors">Notícias</Link>
              </li>
              <li>
                <Link href={ROUTES.ligaTv} className="hover:text-accent transition-colors">Liga TV</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href={ROUTES.contact} className="hover:text-accent transition-colors">Central de Ajuda</Link>
              </li>
              <li>
                <Link href={ROUTES.terms} className="hover:text-accent transition-colors">Termos de Uso</Link>
              </li>
              <li>
                <Link href={ROUTES.privacy} className="hover:text-accent transition-colors">Políticas de Privacidade</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} {site.copyright}
          </div>
          <div className="flex gap-4">
            {socials.map(({ url, icon: Icon, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                title={label}
                aria-label={label}
                className="hover:text-accent transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
