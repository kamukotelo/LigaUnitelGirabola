'use client';

import React from 'react';
import { X, Lock, ShieldCheck } from 'lucide-react';
import { TEAMS, type Match } from '@/lib/data';
import { officialScheduleSource } from '@/lib/admin-match-locks';

interface EditMatchModalProps {
  isOpen: boolean;
  match: Match | null;
  matchNumber?: number;
  onClose: () => void;
}

// Agenda oficial de um jogo, em só leitura. Jornada e equipas vêm do sorteio;
// data, hora, estádio e transmissão vêm do registo do jogo em src/data/jogos,
// atualizado só a partir de comunicado ou mapa oficial da ANCAF (ver
// src/lib/admin-match-locks.ts). O painel não os altera.
export default function EditMatchModal({ isOpen, match, matchNumber, onClose }: EditMatchModalProps) {
  if (!isOpen || !match) return null;

  const source = officialScheduleSource(match.id);
  const teamName = (id: string, fallback: string) => TEAMS.find((t) => t.id === id)?.name ?? fallback;
  const date = new Date(match.date);
  const when = Number.isNaN(date.getTime())
    ? match.date
    : date.toLocaleString('pt-AO', { timeZone: 'Africa/Luanda', weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const rows: Array<[string, string]> = [
    ['Jornada', String(match.round)],
    ...(matchNumber ? [['N.º da partida', String(matchNumber)] as [string, string]] : []),
    ['Equipa da casa', teamName(match.homeTeamId, match.homeTeam)],
    ['Equipa visitante', teamName(match.awayTeamId, match.awayTeam)],
    ['Data e hora (Africa/Luanda)', when],
    ['Estádio', match.stadium],
    ['Transmissão', match.broadcaster || 'Rádio 5 (por omissão)'],
    ['Publicação da data', match.scheduleStatus === 'provisional' ? 'Provisória' : 'Oficial'],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-zinc-800 dark:text-zinc-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-bold font-display uppercase tracking-tight text-foreground">Agenda oficial da partida</h2>
            <p className="text-[11px] font-mono text-zinc-400">
              ID Operacional: <span className="text-primary font-bold">{match.id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rows.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2">
                <dt className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{label}</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-sm font-medium">
                  <Lock size={12} className="flex-shrink-0 text-zinc-400" />
                  <span className="truncate">{value}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-xs font-mono text-zinc-500 flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-blue-500">Proteção de integridade da competição:</span>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                Jornada e equipas vêm do sorteio oficial. Data, hora, estádio e transmissão vêm de{' '}
                <strong>{source ?? 'mapa oficial da ANCAF'}</strong> e só mudam com um novo comunicado ou mapa oficial,
                enviado à equipa técnica do site. Resultado, eventos e assistência editam-se na Ficha de jogo.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 font-mono text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
