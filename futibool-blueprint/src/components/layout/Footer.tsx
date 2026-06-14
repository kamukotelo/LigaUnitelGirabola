import Link from 'next/link';
import { Trophy, Globe, Flame, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="p-2 bg-primary/20 border border-primary/40 rounded-xl group-hover:border-accent transition-all duration-300">
                <Trophy className="h-5 w-5 text-accent" />
              </div>
              <span className="font-display text-lg uppercase tracking-wider font-extrabold text-white">
                FUTI<span className="text-accent">BOOL</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-sm">
              Plataforma de alta fidelidade para ligas desportivas, construída com Next.js 16, Tailwind CSS v4 e animações de nível profissional.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-4">Plataforma</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/standings" className="hover:text-accent transition-colors">Classificação</Link>
              </li>
              <li>
                <Link href="/fixtures" className="hover:text-accent transition-colors">Calendário</Link>
              </li>
              <li>
                <Link href="/teams" className="hover:text-accent transition-colors">Clubes Parceiros</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">Central de Ajuda</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors">Termos de Uso</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors">Políticas de Privacidade</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} Futibool Engine. Todos os direitos reservados.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              <Flame className="h-4 w-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Globe className="h-4 w-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <ShieldAlert className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
