'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/pages.config';
import Brand from './Brand';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="glass-header w-full border-b border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Brand size="md" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-semibold tracking-wide uppercase px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/contact" className="premium-button text-sm">
              Área de Clubes
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 border-b border-zinc-200 dark:border-zinc-800 px-4 pt-2 pb-6 space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold tracking-wide uppercase transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/15 text-accent border-l-4 border-accent'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 px-4">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="premium-button w-full text-center text-sm"
            >
              Área de Clubes
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
