'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Activity, Award, Star, Calendar, Users,
  BarChart3, AlertTriangle, Shield, CheckCircle2,
  RefreshCw, Check, ExternalLink
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  Player, Team, getPlayers, getMatches,
  getPlayerRatings, getRecentRatings, getDetailedMetrics,
  getFifaConnectStatus, FIFA_CHECK_META, FifaCheckKey
} from '@/lib/data';
import AnimatedCard from '@/components/ui/AnimatedCard';

// Etiqueta de transparência: dados simulados, não oficiais.
function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-mono uppercase tracking-widest">
      <AlertTriangle size={10} /> Demonstração · dados não oficiais
    </span>
  );
}

interface PlayerDetailClientProps {
  player: Player;
  team?: Team;
}

// Circular SVG Stat Ring component
function StatRing({ value, max, label, color = '#5C0F8B' }: { value: number; max: number; label: string; color?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <svg className="rotate-[-90deg]" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} stroke="#27272a" strokeWidth="4" fill="none" />
          <motion.circle
            cx="32" cy="32" r={r}
            stroke={color} strokeWidth="4" fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-sm text-foreground font-extrabold">{value}</span>
        </div>
      </div>
      <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mt-2 text-center">{label}</p>
    </div>
  );
}

interface HeatSpot {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: string;
  color: string;
  pulseDelay?: number;
}

function HeatmapField({ position, playerId }: { position: string; playerId: string }) {
  let spots: HeatSpot[] = [];
  let zoneLabel = "Terço Médio";
  let heatDescription = "Distribuição posicional equilibrada.";
  let stats = {
    defensiveThird: "33%",
    midfieldThird: "33%",
    attackingThird: "33%",
  };

  const posLower = position.toLowerCase();

  if (posLower.includes("guarda-redes") || posLower.includes("guarda redes")) {
    zoneLabel = "Área de Baliza Própria";
    heatDescription = "Actuação estritamente defensiva na proteção do golo.";
    stats = { defensiveThird: "95%", midfieldThird: "5%", attackingThird: "0%" };
    spots = [
      { bottom: "8%", left: "calc(50% - 20px)", size: "w-10 h-10", color: "bg-red-500/40", pulseDelay: 0 },
      { bottom: "5%", left: "calc(50% - 32px)", size: "w-16 h-16", color: "bg-red-500/25", pulseDelay: 0.2 },
      { bottom: "12%", left: "calc(50% - 48px)", size: "w-24 h-16", color: "bg-red-500/15", pulseDelay: 0.4 },
    ];
  } else if (posLower.includes("defesa esquerdo") || posLower.includes("ala esquerda")) {
    zoneLabel = "Ala Esquerda Recuada/Média";
    heatDescription = "Forte presença na faixa esquerda defensiva, com incursões de apoio até à linha média.";
    stats = { defensiveThird: "55%", midfieldThird: "35%", attackingThird: "10%" };
    spots = [
      { bottom: "25%", left: "8%", size: "w-12 h-20", color: "bg-red-500/35", pulseDelay: 0.1 },
      { bottom: "45%", left: "10%", size: "w-10 h-16", color: "bg-red-500/25", pulseDelay: 0.3 },
      { bottom: "15%", left: "12%", size: "w-14 h-16", color: "bg-red-500/20", pulseDelay: 0.5 },
      { bottom: "65%", left: "15%", size: "w-8 h-12", color: "bg-red-500/15", pulseDelay: 0.2 },
    ];
  } else if (posLower.includes("defesa")) {
    zoneLabel = "Terço Defensivo Central";
    heatDescription = "Muralha defensiva central. Acção concentrada na entrada e interior da grande área recuada.";
    stats = { defensiveThird: "75%", midfieldThird: "20%", attackingThird: "5%" };
    spots = [
      { bottom: "20%", left: "calc(50% - 24px)", size: "w-12 h-12", color: "bg-amber-500/40", pulseDelay: 0.1 },
      { bottom: "15%", left: "calc(50% - 40px)", size: "w-20 h-12", color: "bg-amber-500/25", pulseDelay: 0.3 },
      { bottom: "30%", left: "calc(50% - 28px)", size: "w-14 h-14", color: "bg-amber-500/20", pulseDelay: 0.5 },
    ];
  } else if (posLower === "extremo" || posLower.includes("extremo") || posLower.includes("médio / extremo")) {
    const isRightWinger = playerId === "gibele" || playerId === "jaredi";
    if (isRightWinger) {
      zoneLabel = "Corredor Lateral Direito Ofensivo";
      heatDescription = "Aceleração e cruzamentos do corredor direito, com diagonais para dentro da grande área.";
      stats = { defensiveThird: "10%", midfieldThird: "35%", attackingThird: "55%" };
      spots = [
        { top: "20%", right: "8%", size: "w-12 h-24", color: "bg-amber-500/40", pulseDelay: 0.2 },
        { top: "35%", right: "12%", size: "w-10 h-16", color: "bg-amber-500/30", pulseDelay: 0.4 },
        { top: "15%", right: "25%", size: "w-12 h-12", color: "bg-red-500/30", pulseDelay: 0.1 },
        { top: "45%", right: "15%", size: "w-8 h-12", color: "bg-amber-500/15", pulseDelay: 0.5 },
      ];
    } else {
      zoneLabel = "Ala Ofensiva (Esquerda/Direita)";
      heatDescription = "Pressão e velocidade na ala. Linha de fundo e passes de rutura para a área de finalização.";
      stats = { defensiveThird: "10%", midfieldThird: "40%", attackingThird: "50%" };
      spots = [
        { top: "25%", left: "10%", size: "w-12 h-20", color: "bg-red-500/35", pulseDelay: 0.1 },
        { top: "25%", right: "12%", size: "w-10 h-16", color: "bg-red-500/25", pulseDelay: 0.3 },
        { top: "40%", left: "15%", size: "w-10 h-12", color: "bg-amber-500/20", pulseDelay: 0.5 },
        { top: "15%", left: "20%", size: "w-8 h-10", color: "bg-red-500/30", pulseDelay: 0.2 },
      ];
    }
  } else if (posLower.includes("médio ofensivo") || posLower.includes("ofensivo")) {
    zoneLabel = "Entre Linhas (Zone 14)";
    heatDescription = "Posicionamento estratégico à boca da grande área. Elevada taxa de assistências e remates.";
    stats = { defensiveThird: "15%", midfieldThird: "45%", attackingThird: "40%" };
    spots = [
      { top: "28%", left: "calc(50% - 24px)", size: "w-12 h-12", color: "bg-red-500/45", pulseDelay: 0.1 },
      { top: "35%", left: "calc(50% - 36px)", size: "w-18 h-18", color: "bg-red-500/30", pulseDelay: 0.3 },
      { top: "22%", left: "calc(50% - 16px)", size: "w-8 h-8", color: "bg-red-500/40", pulseDelay: 0.5 },
      { top: "30%", left: "calc(50% - 60px)", size: "w-30 h-12", color: "bg-amber-500/20", pulseDelay: 0.2 },
    ];
  } else if (posLower.includes("médio")) {
    zoneLabel = "Círculo Central & Box-to-Box";
    heatDescription = "Construção de jogo de transição. Distribuição fluida e contenção na faixa central do campo.";
    stats = { defensiveThird: "25%", midfieldThird: "55%", attackingThird: "20%" };
    spots = [
      { top: "calc(50% - 20px)", left: "calc(50% - 20px)", size: "w-10 h-10", color: "bg-amber-500/40", pulseDelay: 0 },
      { top: "calc(50% - 32px)", left: "calc(50% - 32px)", size: "w-16 h-16", color: "bg-amber-500/30", pulseDelay: 0.2 },
      { top: "calc(45% - 40px)", left: "calc(45% - 40px)", size: "w-20 h-20", color: "bg-amber-500/20", pulseDelay: 0.4 },
      { top: "calc(55% - 24px)", left: "calc(55% - 24px)", size: "w-12 h-12", color: "bg-amber-500/20", pulseDelay: 0.6 },
    ];
  } else if (posLower.includes("avançado") || posLower.includes("avancado")) {
    zoneLabel = "Grande Área Adversária";
    heatDescription = "Área de finalização. Presença centralizada na grande área do oponente, com forte pressão de golo.";
    stats = { defensiveThird: "5%", midfieldThird: "20%", attackingThird: "75%" };
    spots = [
      { top: "12%", left: "calc(50% - 24px)", size: "w-12 h-12", color: "bg-red-500/50", pulseDelay: 0.1 },
      { top: "18%", left: "calc(50% - 36px)", size: "w-18 h-18", color: "bg-red-500/35", pulseDelay: 0.3 },
      { top: "8%", left: "calc(50% - 16px)", size: "w-8 h-8", color: "bg-red-500/40", pulseDelay: 0.5 },
      { top: "25%", left: "calc(50% - 48px)", size: "w-24 h-16", color: "bg-red-500/15", pulseDelay: 0.2 },
    ];
  }

  return (
    <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6 space-y-6 relative overflow-hidden">
      {/* Scanline sweep */}
      <motion.div
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent pointer-events-none z-0 shadow-[0_0_8px_rgba(210,21,21,0.5)]"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />

      <h3 className="text-md font-display text-foreground uppercase tracking-wider flex items-center gap-2 relative z-10">
        <Activity size={16} className="text-accent" /> Mapa de Calor Posicional
      </h3>

      <div className="grid grid-cols-1 gap-4 relative z-10">
        {/* The Pitch rendering */}
        <div className="relative w-full aspect-[2/3] max-w-[200px] mx-auto bg-white/60 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Field Lines */}
          <div className="absolute inset-4 border border-zinc-200/40 dark:border-zinc-800/40">
            {/* Halfway Line */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-200/40 dark:bg-zinc-800/40 -translate-y-1/2" />
            
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 w-14 h-14 border border-zinc-200/40 dark:border-zinc-800/40 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full -translate-x-1/2 -translate-y-1/2" />

            {/* Penalty Box Top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 border-b border-x border-zinc-200/40 dark:border-zinc-800/40">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2.5 border-b border-x border-zinc-200/20 dark:border-zinc-800/20" />
            </div>

            {/* Penalty Box Bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 border-t border-x border-zinc-200/40 dark:border-zinc-800/40">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-2.5 border-t border-x border-zinc-200/20 dark:border-zinc-800/20" />
            </div>
          </div>

          {/* Heat spots overlays */}
          {spots.map((spot, idx) => {
            const posStyle: React.CSSProperties = {};
            if (spot.top) posStyle.top = spot.top;
            if (spot.bottom) posStyle.bottom = spot.bottom;
            if (spot.left) posStyle.left = spot.left;
            if (spot.right) posStyle.right = spot.right;

            return (
              <motion.div
                key={idx}
                style={posStyle}
                className={`absolute rounded-full filter blur-[12px] mix-blend-screen pointer-events-none ${spot.size} ${spot.color}`}
                animate={{
                  scale: [0.95, 1.1, 0.95],
                  opacity: [0.75, 0.95, 0.75]
                }}
                transition={{
                  duration: 3 + idx,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: spot.pulseDelay || 0
                }}
              />
            );
          })}
        </div>

        {/* Heat Details metadata */}
        <div className="space-y-4 font-mono text-[11px] border-t border-zinc-200/60 dark:border-zinc-900/60 pt-4">
          <div>
            <span className="text-zinc-500 uppercase block text-[9px] mb-0.5">Foco de Acção Principal</span>
            <span className="font-bold text-foreground uppercase text-xs">{zoneLabel}</span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-[10px] leading-relaxed">
            {heatDescription}
          </p>
          
          {/* Positional distribution bars */}
          <div className="space-y-2 text-[9px] text-zinc-500 uppercase pt-2 border-t border-zinc-200/40 dark:border-zinc-900/40">
            <span className="block mb-1 text-zinc-600 dark:text-zinc-400 font-semibold">Território Ocupado</span>
            
            <div className="flex items-center justify-between gap-2">
              <span className="w-16">Defesa:</span>
              <div className="flex-1 h-1 bg-white dark:bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-red-500/60 rounded-full" style={{ width: stats.defensiveThird }} />
              </div>
              <span className="w-8 text-right font-bold text-zinc-600 dark:text-zinc-400">{stats.defensiveThird}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="w-16">Meio-Campo:</span>
              <div className="flex-1 h-1 bg-white dark:bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500/60 rounded-full" style={{ width: stats.midfieldThird }} />
              </div>
              <span className="w-8 text-right font-bold text-zinc-600 dark:text-zinc-400">{stats.midfieldThird}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="w-16">Ataque:</span>
              <div className="flex-1 h-1 bg-white dark:bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-green-500/60 rounded-full" style={{ width: stats.attackingThird }} />
              </div>
              <span className="w-8 text-right font-bold text-zinc-600 dark:text-zinc-400">{stats.attackingThird}</span>
            </div>
          </div>
        </div>

      </div>
    </AnimatedCard>
  );
}

// ── ABA 2: Estatísticas Detalhadas (avaliação técnica FAF & Sofascore/ZeroZero) ──────────
function StatsTab({ player }: { player: Player }) {
  const ratings = getPlayerRatings(player);
  const recent = getRecentRatings(player);
  const metrics = getDetailedMetrics(player);

  const ratingColor = (r: number) =>
    r >= 8 ? '#22c55e' : r >= 7 ? '#00F5FF' : r >= 6 ? '#F9C304' : '#ef4444';

  const metricGrid = [
    { label: 'Precisão de Passe', value: `${metrics.passAccuracy}%` },
    { label: 'Duelos Ganhos', value: `${metrics.duelsWon}%` },
    { label: 'Remates à Baliza', value: `${metrics.shotsOnTarget}%` },
    { label: 'Cartões Amarelos', value: metrics.yellowCards },
    { label: 'Cartões Vermelhos', value: metrics.redCards },
    { label: 'Minutos Jogados', value: `${metrics.minutesPlayed}'` },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-end"><DemoBadge /></div>

      {/* Índices de avaliação técnica (FAF) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {([
          { name: 'Índice Sofascore', value: ratings.sofascore, accent: '#00F5FF', caption: 'Rating Sofascore Integrado' },
          { name: 'Rating ZeroZero', value: ratings.zerozero, accent: '#F9C304', caption: 'Rating ZeroZero Integrado' },
        ] as const).map((src) => (
          <AnimatedCard key={src.name} variant="holographic" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-foreground uppercase tracking-wider text-sm">{src.name}</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                {src.caption}
              </span>
            </div>
            <div className="flex items-end gap-3">
              <span
                className="font-display text-5xl font-black leading-none"
                style={{ color: src.accent }}
              >
                {src.value.toFixed(1)}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase mb-1.5">Rating médio</span>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Ligações externas Sofascore e ZeroZero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a 
          href={ratings.sofascoreUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-950/20 to-blue-900/10 hover:from-blue-900/30 hover:to-blue-800/20 border border-blue-900/30 hover:border-blue-700/50 rounded-2xl transition-all duration-300 group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">Perfil Sofascore</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">Ficha técnica e análise posicional estatística.</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-blue-400 group-hover:text-blue-300">
            Aceder <ExternalLink size={12} />
          </div>
        </a>

        <a 
          href={ratings.zerozeroUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-950/20 to-emerald-900/10 hover:from-emerald-900/30 hover:to-emerald-800/20 border border-emerald-900/30 hover:border-emerald-700/50 rounded-2xl transition-all duration-300 group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">Perfil ZeroZero</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">Consulte o histórico de clubes, carreira e estatísticas da época.</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 group-hover:text-emerald-300">
            Aceder <ExternalLink size={12} />
          </div>
        </a>
      </div>

      {/* Tendência últimos 5 jogos */}
      <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6">
        <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
          <BarChart3 size={16} className="text-accent" /> Tendência de Forma · Últimos 5 Jogos
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recent} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="match" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[5, 10]} stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#09090b',
                  border: '1px solid #27272a',
                  borderRadius: 12,
                  fontSize: 12,
                  fontFamily: 'monospace',
                }}
                labelStyle={{ color: '#a1a1aa' }}
                formatter={(v) => [Number(v).toFixed(1), 'Rating']}
              />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#00F5FF"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#00F5FF', stroke: '#09090b', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {recent.map((r) => (
            <span
              key={r.match}
              className="px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold border"
              style={{
                color: ratingColor(r.rating),
                borderColor: `${ratingColor(r.rating)}40`,
                background: `${ratingColor(r.rating)}12`,
              }}
            >
              {r.match}: {r.rating.toFixed(1)}
            </span>
          ))}
        </div>
      </AnimatedCard>

      {/* Grelha de métricas */}
      <div className="bg-white/30 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 p-6 rounded-2xl">
        <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity size={16} className="text-primary" /> Métricas de Rendimento
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/60 font-mono">
          {metricGrid.map((m) => (
            <div key={m.label} className="bg-zinc-100 dark:bg-black/40 rounded-xl p-3.5">
              <span className="text-[9px] text-zinc-500 uppercase block mb-1">{m.label}</span>
              <span className="font-bold text-foreground text-lg block">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ABA 3: Sistema de Inscrição & Validação (FIFA Connect) ──────────
function FifaConnectTab({ player }: { player: Player }) {
  const metaStatus = getFifaConnectStatus(player);
  const [simulationStep, setSimulationStep] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [currentChecks, setCurrentChecks] = useState<Record<FifaCheckKey, boolean>>(metaStatus.checks);
  const [finalStatus, setFinalStatus] = useState<'pending' | 'validated'>(metaStatus.status);

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);
    setSimulationLogs(["[CONEXÃO] A estabelecer ligação segura com o gateway da FIFA (FIFA Connect API)..."]);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, "[AUTENTICAÇÃO] Credenciais da Federação Angolana de Futebol (FAF) validadas com sucesso."]);
      setSimulationStep(1);
    }, 1000);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, `[CONSULTA] A verificar ID FIFA do atleta: ${player.fifaConnectId || 'Pendente'}...`]);
      setCurrentChecks(prev => ({ ...prev, identity: true }));
      setSimulationStep(2);
    }, 2200);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, "[CONTRATO] A auditar contrato de trabalho desportivo ativo com o clube do Liga Unitel Girabola..."]);
      setCurrentChecks(prev => ({ ...prev, contract: true }));
      setSimulationStep(3);
    }, 3400);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, "[ITC] Verificação de conformidade do Certificado de Transferência Internacional (ITC)..."]);
      setCurrentChecks(prev => ({ ...prev, itc: true }));
      setSimulationStep(4);
    }, 4600);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, "[SAÚDE/SEGURO] A verificar a vigência da ficha de exames médicos e seguro de acidentes..."]);
      setCurrentChecks(prev => ({ ...prev, insurance: true }));
      setSimulationStep(5);
    }, 5800);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, "[SUCESSO] Sincronização e auditoria concluídas! Inscrição FIFA Connect Validada com sucesso."]);
      setFinalStatus('validated');
      setIsSimulating(false);
      setSimulationStep(6);
    }, 7000);
  };

  const getStatusColor = (status: 'pending' | 'validated') => {
    return status === 'validated' 
      ? 'text-green-400 border-green-500/30 bg-green-500/10' 
      : 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-6">
        <div>
          <h2 className="text-xl font-display text-foreground uppercase tracking-wider flex items-center gap-2">
            <Shield size={20} className="text-accent" /> Validação de Inscrição FIFA Connect
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-mono">
            Roadmap FAF: Sistema digital integrado de elegibilidade e licenciamento internacional de atletas.
          </p>
        </div>
        <div className={`px-4 py-2 border rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2 ${getStatusColor(finalStatus)}`}>
          <span className={`w-2 h-2 rounded-full ${finalStatus === 'validated' ? 'bg-green-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
          {finalStatus === 'validated' ? 'Inscrição Ativa FIFA' : 'Pendente de Auditoria'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compliance Checklist and ID Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card de Identidade FIFA */}
          <div className="bg-zinc-100/60 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 relative overflow-hidden hud-panel">
            <div className="absolute top-4 right-4 text-[9px] text-zinc-600 uppercase">
              FIFA Digital ID Card
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 flex-shrink-0">
                <Users size={28} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">Nome de Inscrição</span>
                <div className="text-md font-bold text-foreground uppercase font-display">{player.name}</div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                  <span>FIFA ID: <strong className="text-accent">{player.fifaConnectId || 'PENDENTE'}</strong></span>
                  <span>Data Início: <strong className="text-foreground">{player.fifaConnectRegDate || 'N/A'}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Items */}
          <div className="bg-white/20 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-display text-foreground uppercase tracking-wider mb-2">Lista de Verificação de Conformidade</h3>
            <div className="divide-y divide-zinc-200/60 dark:divide-zinc-900/60">
              {FIFA_CHECK_META.map((item) => {
                const checked = currentChecks[item.key];
                return (
                  <div key={item.key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">{item.label}</span>
                    <div className="flex items-center gap-2">
                      {checked ? (
                        <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                          <Check size={12} /> CONCLUÍDO
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded animate-pulse">
                          <AlertTriangle size={12} /> PENDENTE
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Simulation Sandbox Console */}
        <div className="space-y-6">
          <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 flex flex-col justify-between h-full min-h-[350px] relative overflow-hidden">
            {/* Holographic scanning decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 pb-3">
                <span className="text-[10px] uppercase font-bold text-accent tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  FIFA Console Gateway
                </span>
                <span className="text-[9px] text-zinc-600">v2.1-connected</span>
              </div>

              {/* Console log display */}
              <div className="space-y-2 h-44 overflow-y-auto scrollbar-none text-[10px] text-zinc-500 leading-relaxed font-mono">
                {simulationLogs.map((log, i) => (
                  <div key={i} className={i === simulationLogs.length - 1 ? 'text-zinc-700 dark:text-zinc-300 font-bold' : ''}>
                    {log}
                  </div>
                ))}
                {isSimulating && (
                  <div className="flex items-center gap-2 text-accent mt-2 animate-pulse">
                    <RefreshCw size={10} className="animate-spin" />
                    Ligação ativa com o servidor FIFA Connect...
                  </div>
                )}
                {simulationStep === -1 && (
                  <div className="text-zinc-600 italic">
                    Consola pronta para auditoria. Clique no botão de simulação para iniciar a verificação de elegibilidade em tempo real.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-900 mt-auto">
              {simulationStep === 6 ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center space-y-2">
                  <div className="text-[10px] text-green-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <CheckCircle2 size={12} /> Elegibilidade Aprovada
                  </div>
                  <div className="text-[8px] text-zinc-500">
                    CERT: FIFA-CONNECT/FAF-OK-{player.id.slice(0,6).toUpperCase()}
                  </div>
                  <button 
                    onClick={() => {
                      setSimulationStep(-1);
                      setSimulationLogs([]);
                      setCurrentChecks(metaStatus.checks);
                      setFinalStatus(metaStatus.status);
                    }}
                    className="w-full py-1.5 bg-white dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-[10px] text-zinc-600 dark:text-zinc-400 font-bold uppercase transition-colors"
                  >
                    Simular Novamente
                  </button>
                </div>
              ) : (
                <button
                  disabled={isSimulating}
                  onClick={startSimulation}
                  className="w-full py-3 bg-accent hover:bg-accent/90 disabled:bg-white dark:bg-zinc-900 disabled:text-zinc-600 rounded-xl text-xs text-foreground font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" /> A Auditar Requisitos...
                    </>
                  ) : (
                    <>
                      <Shield size={12} /> Simular Validação FIFA
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type TabKey = 'perfil' | 'estatisticas' | 'fifaconnect';

export default function PlayerDetailClient({ player, team }: PlayerDetailClientProps) {
  // Goals classification
  const allPlayers = getPlayers();
  const allGoals = [...allPlayers].sort((a, b) => b.goals - a.goals);
  const goalRank = allGoals.findIndex(p => p.id === player.id) + 1;
  const maxGoals = allGoals[0]?.goals || 1;

  // Filter recent finished matches of the player's club
  const allMatches = getMatches();
  const teamMatches = allMatches
    .filter(m => m.homeTeamId === player.teamId || m.awayTeamId === player.teamId)
    .filter(m => m.status === 'finished')
    .slice(0, 3); // top 3 recent games

  // Attributes mappings for styling
  const attrList = [
    { label: 'Ritmo / Velocidade', value: player.attributes.pace, color: 'from-amber-500 to-red-500' },
    { label: 'Finalização / Remate', value: player.attributes.shooting, color: 'from-red-500 to-pink-500' },
    { label: 'Passe / Visão', value: player.attributes.passing, color: 'from-blue-500 to-indigo-500' },
    { label: 'Drible / Técnica', value: player.attributes.dribbling, color: 'from-purple-500 to-pink-500' },
    { label: 'Defesa / Posicionamento', value: player.attributes.defending, color: 'from-green-500 to-emerald-500' },
    { label: 'Físico / Resistência', value: player.attributes.physical, color: 'from-orange-500 to-yellow-500' }
  ];

  const clubColor = team?.colorsHex ? team.colorsHex[0] : '#5C0F8B';

  const [activeTab, setActiveTab] = useState<TabKey>('perfil');
  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'perfil', label: 'Perfil Geral', icon: Star },
    { key: 'estatisticas', label: 'Estatísticas', icon: BarChart3 },
    { key: 'fifaconnect', label: 'FIFA Connect', icon: Shield },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
      
      {/* Club theme ambient light glow */}
      <div 
        className="absolute top-[10%] left-1/3 -translate-x-1/2 w-[500px] h-[300px] rounded-full filter blur-[120px] opacity-10 pointer-events-none z-0"
        style={{ backgroundColor: clubColor }}
      />

      {/* Back Link */}
      <Link href="/competicao?tab=estatisticas" className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest mb-8 hover:-translate-x-1 transition-transform">
        <ArrowLeft size={14} /> Voltar para Líderes
      </Link>

      {/* Profile Header */}
      <AnimatedCard variant="holographic" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200/80 dark:border-zinc-900/80 p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            REGISTO_FAF_ATIVO
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-end text-center md:text-left">
          {/* Jersey Card */}
          <div className="w-40 h-52 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden running-border relative flex-shrink-0">
            <div className="absolute top-2 left-2 bg-primary text-white rounded-lg px-2.5 py-1 font-display text-2xl font-black">
              {player.jerseyNumber}
            </div>
            {/* Fallback image */}
            <div className="w-full h-full flex items-center justify-center bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600">
              <Users size={48} className="animate-pulse" />
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-semibold block mb-1">
                {player.position}
              </span>
              <h1 className="text-4xl md:text-5xl font-display text-foreground uppercase leading-none font-black">
                {player.name}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 font-mono text-xs uppercase tracking-wider mt-1">
                {player.nationality} · Idade: {player.age} anos · Altura: {player.height}
              </p>
            </div>

            {/* Stat Rings */}
            <div className="flex flex-wrap gap-6 justify-center md:justify-start pt-2 border-t border-zinc-200/60 dark:border-zinc-900/60">
              <StatRing value={player.goals} max={maxGoals} label="Golos" color="#D21515" />
              <StatRing value={player.assists} max={15} label="Assistências" color="#F9C304" />
              <StatRing value={player.appearances} max={30} label="Jogos" color="#00F5FF" />
              {player.age && <StatRing value={player.age} max={40} label="Idade" color="#a855f7" />}
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Barra de Abas */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-200/80 dark:border-zinc-900/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-4 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                isActive ? 'text-foreground' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-accent' : ''} /> {tab.label}
              {isActive && (
                <motion.span
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'estatisticas' && <StatsTab player={player} />}
          {activeTab === 'fifaconnect' && <FifaConnectTab player={player} />}
          {activeTab === 'perfil' && (
      /* Grid Layout */
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Columns: Stats Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Biometric & Profile Card */}
          <div className="bg-white/30 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 p-6 rounded-2xl">
            <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Star size={16} className="text-primary" /> Perfil Físico & Biográfico
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/60 text-xs font-mono">
              <div>
                <span className="text-[9px] text-zinc-500 uppercase block mb-1">Altura</span>
                <span className="font-bold text-foreground text-md block">{player.height || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 uppercase block mb-1">Peso</span>
                <span className="font-bold text-foreground text-md block">{player.weight || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 uppercase block mb-1">Clube</span>
                <span className="font-bold text-foreground text-md block">
                  {team ? (
                    <Link href={`/teams/${team.id}`} className="hover:text-primary transition-colors">
                      {team.name}
                    </Link>
                  ) : (
                    player.club
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* HUD Attributes Panel */}
          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-8">
            <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
              <Activity size={18} className="text-accent" /> Matriz de Atributos (HUD)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attrList.map((attr, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-600 dark:text-zinc-400 uppercase">{attr.label}</span>
                    <span className="text-foreground font-extrabold">{attr.value} / 99</span>
                  </div>
                  
                  {/* Progress Meter bar */}
                  <div className="h-2 w-full bg-white dark:bg-zinc-900 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(attr.value / 99) * 100}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                      className={`h-full rounded-full bg-gradient-to-r ${attr.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>

          {/* Histórico Recente de Jogos do Clube */}
          <div className="bg-white/30 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-900 p-6 rounded-2xl">
            <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-primary" /> Resultados Recentes
            </h3>
            
            <div className="space-y-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/60">
              {teamMatches.length > 0 ? (
                teamMatches.map((m) => {
                  const isHome = m.homeTeamId === player.teamId;
                  const opponent = isHome ? m.awayTeam : m.homeTeam;
                  const result = isHome 
                    ? (m.homeScore > m.awayScore ? 'V' : m.homeScore < m.awayScore ? 'D' : 'E') 
                    : (m.awayScore > m.homeScore ? 'V' : m.awayScore < m.homeScore ? 'D' : 'E');

                  return (
                    <div key={m.id} className="flex justify-between p-3.5 bg-zinc-100 dark:bg-black/40 rounded-xl items-center font-mono text-xs">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                        result === 'V' 
                          ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                          : result === 'D' 
                          ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                          : 'bg-zinc-200/30 dark:bg-zinc-800/30 border border-zinc-300/30 dark:border-zinc-700/30 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {result}
                      </span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{isHome ? 'Casa' : 'Fora'} vs {opponent}</span>
                      <span className="font-bold text-foreground">{m.homeScore} - {m.awayScore}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-zinc-500 font-mono italic">Sem partidas concluídas registadas.</p>
              )}
            </div>
          </div>

          {/* Career History */}
          {player.careerHistory && (
            <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-8">
              <h3 className="text-md font-display text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                <Award size={18} className="text-accent" /> Histórico da Carreira
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[400px] font-mono text-xs text-zinc-600 dark:text-zinc-400">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-900 pb-2 text-[10px] text-zinc-500 uppercase">
                      <th className="py-2">Temporada</th>
                      <th className="py-2">Clube</th>
                      <th className="py-2 text-center">Jogos</th>
                      <th className="py-2 text-center">Golos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-900/60">
                    {player.careerHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/20 dark:hover:bg-zinc-900/20">
                        <td className="py-3 font-bold text-foreground">{item.season}</td>
                        <td className="py-3 font-semibold text-zinc-700 dark:text-zinc-300">{item.club}</td>
                        <td className="py-3 text-center">{item.apps}</td>
                        <td className="py-3 text-center font-extrabold text-primary">{item.goals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimatedCard>
          )}

        </div>

        {/* Right Columns: Bio & Overview */}
        <div className="space-y-8">
          
          {/* Biography */}
          <AnimatedCard variant="hud" className="bg-zinc-100/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-900 p-6 space-y-4">
            <h3 className="text-md font-display text-foreground uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-accent" /> Biografia Técnica
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono">
              {player.bio || 'Sem biografia detalhada registada no banco de dados da Federação Angolana de Futebol.'}
            </p>
          </AnimatedCard>

          {/* Heatmap Field */}
          <HeatmapField position={player.position} playerId={player.id} />

          {/* League Stats Sidebar */}
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl h-fit space-y-6">
            <h3 className="text-md font-display uppercase flex items-center gap-2 text-foreground">
              <Activity size={14} className="text-accent" /> Estatísticas da Liga
            </h3>
            
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-zinc-200/60 dark:border-zinc-900/60 pb-2.5">
                <span className="text-zinc-500">Class. Golos</span>
                <span className="font-bold text-foreground">#{goalRank}º</span>
              </div>
              <div className="flex justify-between border-b border-zinc-200/60 dark:border-zinc-900/60 pb-2.5">
                <span className="text-zinc-500">Golos por Jogo</span>
                <span className="font-bold text-foreground">{(player.goals / (player.appearances || 1)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-zinc-500">Minutos Jogados</span>
                <span className="font-bold text-foreground">{player.appearances * 90}{"'"}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
