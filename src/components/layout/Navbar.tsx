'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/pages.config';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="glass-header w-full border-b border-zinc-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-1 bg-black/30 border border-zinc-800 rounded-xl group-hover:border-accent transition-all duration-300 flex items-center justify-center w-12 h-12">
                <Image
                  src="/logo-girabola.png"
                  alt="Girabola Logo"
                  className="h-10 w-10 object-contain"
                  width={40}
                  height={40}
                />
              </div>
              <span className="font-display text-xl uppercase tracking-wider font-extrabold text-white">
                GIRA<span className="text-accent">BOLA</span>
              </span>
            </Link>
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
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center">
            <Link href="/contact" className="premium-button text-sm">
              Área de Clubes
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 border-b border-zinc-800 px-4 pt-2 pb-6 space-y-2">
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
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
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
