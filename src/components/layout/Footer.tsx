import Link from 'next/link';
import { Globe, Flame, ShieldAlert, Lock } from 'lucide-react';
import Brand from './Brand';

export default function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Brand size="md" className="mb-4" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm">
              Website oficial de resultados e estatísticas do Campeonato Nacional de Futebol de Angola, baseado no Futibool Engine.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest mb-4">Plataforma</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/competicao?tab=classificacao" className="hover:text-accent transition-colors">Classificação</Link>
              </li>
              <li>
                <Link href="/competicao?tab=calendario" className="hover:text-accent transition-colors">Calendário</Link>
              </li>
              <li>
                <Link href="/teams" className="hover:text-accent transition-colors">Clubes Parceiros</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-accent transition-colors">Notícias</Link>
              </li>
              <li>
                <Link href="/ligatv" className="hover:text-accent transition-colors">LigaTV</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">Central de Ajuda</Link>
              </li>
              <li>
                <span title="Brevemente" className="cursor-not-allowed opacity-50 hover:text-accent transition-colors">Termos de Uso</span>
              </li>
              <li>
                <span title="Brevemente" className="cursor-not-allowed opacity-50 hover:text-accent transition-colors">Políticas de Privacidade</span>
              </li>
              <li>
                <Link href="/admin" className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-accent transition-colors">
                  <Lock className="h-3 w-3" /> Administração
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} Liga Unitel Girabola. Todos os direitos reservados.
          </div>
          <div className="flex gap-4">
            <span title="Brevemente" className="cursor-not-allowed opacity-50 hover:text-foreground transition-colors">
              <Flame className="h-4 w-4" />
            </span>
            <span title="Brevemente" className="cursor-not-allowed opacity-50 hover:text-foreground transition-colors">
              <Globe className="h-4 w-4" />
            </span>
            <span title="Brevemente" className="cursor-not-allowed opacity-50 hover:text-foreground transition-colors">
              <ShieldAlert className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
