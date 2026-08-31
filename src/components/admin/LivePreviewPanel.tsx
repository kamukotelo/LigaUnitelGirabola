'use client';

import { useState } from 'react';
import { RefreshCw, X, ExternalLink, Monitor } from 'lucide-react';

const PAGES = [
  { label: 'Início', path: '/' },
  { label: 'Calendário', path: '/competicao/2026-27?tab=calendario' },
  { label: 'Classificação', path: '/competicao/2026-27?tab=classificacao' },
  { label: 'Estatísticas', path: '/competicao/2026-27?tab=estatisticas' },
  { label: 'Equipas', path: '/teams' },
  { label: 'Jogadores', path: '/players' },
  { label: 'Notícias', path: '/news' },
];

export default function LivePreviewPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [path, setPath] = useState(PAGES[0].path);
  const [reloadKey, setReloadKey] = useState(0);

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:w-[440px] lg:w-[540px]">
      <div className="flex items-center gap-2 border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
        <Monitor size={14} className="text-accent shrink-0" />
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 shrink-0">Pré-visualização</span>
        <select
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="ml-1 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary dark:border-zinc-800 dark:bg-zinc-900"
        >
          {PAGES.map((p) => (
            <option key={p.path} value={p.path}>
              {p.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="rounded-lg p-1.5 text-zinc-500 hover:text-foreground"
          title="Recarregar"
        >
          <RefreshCw size={14} />
        </button>
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-1.5 text-zinc-500 hover:text-foreground"
          title="Abrir em separador"
        >
          <ExternalLink size={14} />
        </a>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-500 hover:text-red-500"
          title="Fechar"
        >
          <X size={15} />
        </button>
      </div>
      <iframe
        key={`${path}-${reloadKey}`}
        src={path}
        title="Pré-visualização do site"
        className="flex-1 w-full border-0 bg-white dark:bg-zinc-950"
      />
      <p className="border-t border-zinc-200 px-3 py-1.5 text-[10px] text-zinc-500 dark:border-zinc-800">
        Reflete o estado <b>publicado</b>. Guarde as alterações da secção para as ver aqui.
      </p>
    </div>
  );
}
