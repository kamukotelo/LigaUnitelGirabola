# 🏆 Guia de Implementação do Portal Masculino (Futibool Engine)

Este ficheiro recolhe e padroniza as estruturas, dados simulados (mocks) e layouts do portal feminino para que possa implementá-los de forma idêntica no portal masculino (Girabola/FAF Masculino). Adicionalmente, apresenta a estrutura do canal **LigaTV** e o roadmap para conversão futura em aplicação móvel.

---

## 🗄️ 1. Estrutura de Dados & Mocks (Supabase / TS)

Para garantir consistência nas estatísticas e visualizações, utilize a mesma modelagem de dados. Abaixo estão os scripts SQL e o ficheiro de mocks adaptado para o futebol masculino.

### 1.1. Esquema SQL Idêntico (Supabase Migrations)

Execute esta migração para suportar o portal masculino:

```sql
-- Profiles Masculinos
CREATE TABLE IF NOT EXISTS public.profiles_masculino (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Clubes/Equipas (Girabola)
CREATE TABLE IF NOT EXISTS public.teams_masculino (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    logo_url TEXT,
    city TEXT,
    stadium TEXT,
    founded INT,
    coach TEXT,
    colors TEXT[],
    points INT DEFAULT 0,
    played INT DEFAULT 0,
    won INT DEFAULT 0,
    drawn INT DEFAULT 0,
    lost INT DEFAULT 0,
    gf INT DEFAULT 0,
    ga INT DEFAULT 0,
    gd INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Jogadores Masculinos com Atributos Alargados
CREATE TABLE IF NOT EXISTS public.players_masculino (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    team_id UUID REFERENCES public.teams_masculino(id) ON DELETE SET NULL,
    position TEXT NOT NULL,
    nationality TEXT DEFAULT 'Angola',
    shirt_number INT NOT NULL,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    appearances INT DEFAULT 0,
    photo_url TEXT,
    age INT,
    height TEXT,
    weight TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Partidas do Girabola
CREATE TABLE IF NOT EXISTS public.matches_masculino (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    home_team_id UUID REFERENCES public.teams_masculino(id) ON DELETE CASCADE,
    away_team_id UUID REFERENCES public.teams_masculino(id) ON DELETE CASCADE,
    home_score INT DEFAULT 0,
    away_score INT DEFAULT 0,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished')),
    venue TEXT,
    round INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 1.2. Mocks em TypeScript (`src/data/mock-data-masculino.ts`)

Aqui está o ficheiro pronto a usar com equipas reais do Girabola (Petro, 1º de Agosto, Kabuscorp, Sagrada Esperança, etc.) e estatísticas alargadas idênticas ao feminino:

```typescript
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  city: string;
  stadium: string;
  founded: number;
  coach: string;
  colors: string[];
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  nationality: string;
  shirtNumber: number;
  goals: number;
  assists: number;
  appearances: number;
  photo: string;
  age?: number;
  height?: string;
  weight?: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  date: string;
  status: 'scheduled' | 'live' | 'finished';
  venue: string;
  round?: number;
}

export const teams: Team[] = [
  { id: 't1', name: 'Petro de Luanda', shortName: 'PET', logo: '/logos/petro.png', city: 'Luanda', stadium: 'Estádio 11 de Novembro', founded: 1980, coach: 'Alexandre Santos', colors: ['#f6c400', '#0b6b3a'], played: 12, won: 9, drawn: 2, lost: 1, gf: 28, ga: 8, gd: 20, points: 29 },
  { id: 't2', name: '1º de Agosto', shortName: 'AGO', logo: '/logos/1agosto.png', city: 'Luanda', stadium: 'Estádio França Ndalu', founded: 1977, coach: 'Filipe Nzanza', colors: ['#c80000', '#111111'], played: 12, won: 8, drawn: 3, lost: 1, gf: 24, ga: 7, gd: 17, points: 27 },
  { id: 't3', name: 'Kabuscorp do Palanca', shortName: 'KAB', logo: '/logos/kabuscorp.png', city: 'Luanda', stadium: 'Estádio dos Coqueiros', founded: 1994, coach: 'Zeca Amaral', colors: ['#ec4899', '#111827'], played: 12, won: 6, drawn: 3, lost: 3, gf: 18, ga: 12, gd: 6, points: 21 },
  { id: 't4', name: 'Sagrada Esperança', shortName: 'SAG', logo: '/logos/sagrada.png', city: 'Dundo', stadium: 'Estádio Sagrada Esperança', founded: 1976, coach: 'Roque Sapiri', colors: ['#137a3a', '#ffffff'], played: 12, won: 5, drawn: 4, lost: 3, gf: 15, ga: 10, gd: 5, points: 19 }
];

export const players: Player[] = [
  /* Petro de Luanda */
  { id: 'pm1', name: 'Tiago Azulão', teamId: 't1', position: 'Avançado', nationality: 'Brasil', shirtNumber: 9, goals: 13, assists: 4, appearances: 11, photo: '/players/azulao.jpg', age: 35, height: '1.79m', weight: '76kg' },
  { id: 'pm2', name: 'Gilberto (Gibelé)', teamId: 't1', position: 'Avançado', nationality: 'Angola', shirtNumber: 7, goals: 8, assists: 7, appearances: 12, photo: '/players/gibele.jpg', age: 23, height: '1.71m', weight: '68kg' },
  { id: 'pm3', name: 'Hugo Marques', teamId: 't1', position: 'Guarda-Redes', nationality: 'Angola', shirtNumber: 1, goals: 0, assists: 0, appearances: 12, photo: '/players/hugo.jpg', age: 37, height: '1.91m', weight: '88kg' },
  
  /* 1º de Agosto */
  { id: 'pm4', name: 'Manuel Keliano', teamId: 't2', position: 'Médio', nationality: 'Angola', shirtNumber: 8, goals: 3, assists: 9, appearances: 12, photo: '/players/keliano.jpg', age: 21, height: '1.78m', weight: '72kg' },
  { id: 'pm5', name: 'Bobó Ungenda', teamId: 't2', position: 'Defesa', nationality: 'RDC', shirtNumber: 4, goals: 1, assists: 1, appearances: 12, photo: '/players/bobo.jpg', age: 33, height: '1.87m', weight: '82kg' }
];

export const matches: Match[] = [
  { id: 'm1', homeTeamId: 't1', awayTeamId: 't2', homeScore: 2, awayScore: 1, date: '2026-06-10T16:00:00Z', status: 'finished', venue: 'Estádio 11 de Novembro', round: 1 },
  { id: 'm2', homeTeamId: 't3', awayTeamId: 't4', homeScore: 0, awayScore: 0, date: '2026-06-17T15:30:00Z', status: 'scheduled', venue: 'Estádio dos Coqueiros', round: 1 }
];
```

---

## 👕 2. Página de Detalhe do Jogador com Dados Alargados

Crie o ficheiro `src/app/players/[id]/page.tsx` no portal masculino utilizando a lógica de anéis estatísticos (`StatRing`), dados biométricos (altura/peso), companheiros de equipa e histórico de resultados (V/E/D) idêntico ao feminino.

```tsx
'use client';

import { useParams } from 'next/navigation';
import { players, teams, matches } from '@/data/mock-data-masculino';
import { motion } from 'framer-motion';
import { Star, Shield, ArrowLeft, Activity, Calendar } from 'lucide-react';
import Link from 'next/link';

function StatRing({ value, max, label }: { value: number; max: number; label: string }) {
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
            stroke="#D1208A" strokeWidth="4" fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-lg text-primary">{value}</span>
        </div>
      </div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-2">{label}</p>
    </div>
  );
}

export default function PlayerDetail() {
  const { id } = useParams();
  const player = players.find(p => p.id === id);
  const team = teams.find(t => t.id === player?.teamId);

  if (!player) return <div className="p-12 text-center">Jogador não encontrado</div>;

  const allGoals = [...players].sort((a, b) => b.goals - a.goals);
  const goalRank = allGoals.findIndex(p => p.id === player.id) + 1;
  const maxGoals = allGoals[0]?.goals || 1;

  const teamMatches = matches
    .filter(m => m.homeTeamId === player.teamId || m.awayTeamId === player.teamId)
    .filter(m => m.status === 'finished');

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12">
      {/* Voltar */}
      <Link href="/players" className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest mb-8 hover:-translate-x-1 transition-transform">
        <ArrowLeft size={14} /> Voltar para Jogadores
      </Link>

      {/* Hero do Jogador */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-end pb-8 border-b border-zinc-800">
        <div className="w-56 h-72 bg-zinc-900 rounded-2xl overflow-hidden running-border relative">
          <div className="absolute top-2 left-2 bg-primary text-white rounded-lg p-2 font-display text-2xl">
            {player.shirtNumber}
          </div>
          {/* Imagem do Jogador com fallback */}
          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
            <Users size={64} />
          </div>
        </div>

        <div className="flex-grow space-y-4">
          <div>
            <span className="text-xs font-mono text-accent uppercase tracking-widest">Ficha Técnica do Atleta</span>
            <h1 className="text-4xl md:text-6xl font-display uppercase font-extrabold mt-1">{player.name}</h1>
            <p className="text-zinc-400 font-mono mt-2">{player.position} | {player.nationality}</p>
          </div>

          {/* Anéis de Estatísticas */}
          <div className="flex gap-6 pt-4 flex-wrap">
            <StatRing value={player.goals} max={maxGoals} label="Golos" />
            <StatRing value={player.assists} max={15} label="Assistências" />
            <StatRing value={player.appearances} max={20} label="Jogos" />
            {player.age && <StatRing value={player.age} max={40} label="Idade" />}
          </div>
        </div>
      </div>

      {/* Detalhes Médios/Alargados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-850 p-6 rounded-2xl">
            <h3 className="text-lg font-display uppercase mb-4 flex items-center gap-2">
              <Star size={16} className="text-primary" /> Perfil Físico & Biográfico
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/60">
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase">Altura</p>
                <p className="font-bold text-white text-md">{player.height || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase">Peso</p>
                <p className="font-bold text-white text-md">{player.weight || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase">Clube</p>
                <p className="font-bold text-white text-md">{team?.name || 'Sem Clube'}</p>
              </div>
            </div>
          </div>

          {/* Histórico Recente de Jogos */}
          <div className="bg-zinc-900/50 border border-zinc-850 p-6 rounded-2xl">
            <h3 className="text-lg font-display uppercase mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-primary" /> Resultados Recentes
            </h3>
            <div className="space-y-2">
              {teamMatches.map(m => {
                const isHome = m.homeTeamId === player.teamId;
                const result = isHome ? (m.homeScore > m.awayScore ? 'V' : m.homeScore < m.awayScore ? 'D' : 'E') : (m.awayScore > m.homeScore ? 'V' : m.awayScore < m.homeScore ? 'D' : 'E');
                return (
                  <div key={m.id} className="flex justify-between p-3 bg-black/40 rounded-xl items-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${result === 'V' ? 'bg-green-500/20 text-green-400' : result === 'D' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-700/20 text-zinc-400'}`}>
                      {result}
                    </span>
                    <span className="text-sm font-semibold">{isHome ? 'Casa' : 'Fora'}</span>
                    <span className="font-mono text-zinc-300">{m.homeScore} - {m.awayScore}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl h-fit">
          <h3 className="text-lg font-display uppercase mb-4 flex items-center gap-2">
            <Activity size={14} className="text-accent" /> Estatísticas da Liga
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400 text-sm">Class. Golos</span>
              <span className="font-bold text-white">#{goalRank}º</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400 text-sm">Golos por Jogo</span>
              <span className="font-bold text-white">{(player.goals / (player.appearances || 1)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-zinc-400 text-sm">Minutos Jogados</span>
              <span className="font-bold text-white">{player.appearances * 90}'</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## 📰 3. Aba de Notícias Dedicada

Para o portal masculino, a aba de notícias deve filtrar e expor os artigos com cartões holográficos e efeito de scanline. Crie o ficheiro em `src/app/news/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Tag, Zap } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';

// Exemplo de Mock de Notícias Masculinas
const newsMock = [
  {
    id: 'n1',
    title: 'Petro de Luanda vence o clássico no 11 de Novembro',
    category: 'Girabola',
    date: '13 Jun 2026',
    excerpt: 'Com golo solitário de Tiago Azulão aos 88 minutos, os tricolores asseguraram a liderança da tabela.',
  },
  {
    id: 'n2',
    title: 'Manuel Keliano destaca subida de rendimento no meio-campo',
    category: 'Entrevista',
    date: '12 Jun 2026',
    excerpt: 'O internacional angolano analisou a fase positiva da equipa e o próximo jogo contra o Kabuscorp.',
  }
];

export default function NewsPage() {
  return (
    <main className="py-12 min-h-screen bg-black text-white relative">
      <div className="cyber-grid-bg absolute inset-0 opacity-20 pointer-events-none" />
      <div className="scanline-overlay" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-accent tracking-widest">MÉDIA CENTER · GIRABOLA</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display uppercase">Notícias</h1>
          <p className="text-zinc-400 font-mono text-sm tracking-widest mt-1">O ritmo diário do campeonato nacional</p>
        </header>

        {/* Notícias Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsMock.map((article, i) => (
            <AnimatedCard key={article.id} variant="holographic" delay={i * 0.1}>
              <span className="text-[9px] font-mono uppercase bg-accent text-white px-2 py-0.5 rounded">
                {article.category}
              </span>
              <p className="text-[10px] text-zinc-500 font-mono mt-3">{article.date}</p>
              <h3 className="text-xl font-display uppercase text-white mt-2 mb-3 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-zinc-400 line-clamp-3 mb-6">{article.excerpt}</p>
              <Link href={`/news/${article.id}`} className="inline-flex items-center gap-1 text-xs font-mono uppercase text-primary hover:text-accent transition-colors">
                Ler Artigo <ArrowRight size={12} />
              </Link>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </main>
  );
}
```

---

## 📺 4. LigaTV (ligaTvl) - Vídeo & Match Center

O **LigaTV** é o hub digital focado na exibição de streams ao vivo, conferências, e resumos de jogos de futebol. O layout segue o estilo HUD cyberpunk. Crie o ficheiro em `src/app/ligatv/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Tv, Eye, Calendar, Sparkles, Volume2 } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';

interface VideoHighlight {
  id: string;
  title: string;
  duration: string;
  views: string;
  category: string;
  thumbnail: string;
  isLive?: boolean;
}

export default function LigaTv() {
  const [activeVideo, setActiveVideo] = useState<VideoHighlight>({
    id: 'live-1',
    title: 'GIRABOLA 2025/26: Petro de Luanda vs 1º de Agosto [DIRECTO]',
    duration: 'LIVE',
    views: '12.4K a assistir',
    category: 'Transmissão Oficial',
    thumbnail: '/fields/hud-view.jpg',
    isLive: true,
  });

  const playlist: VideoHighlight[] = [
    { id: 'v1', title: 'Resumo: Kabuscorp vs Sagrada Esperança (2-0)', duration: '08:24', views: '4.2K visualizações', category: 'Resumos', thumbnail: '/thumbs/resumo1.jpg' },
    { id: 'v2', title: 'Entrevista: Tiago Azulão analisa o hat-trick histórico', duration: '05:12', views: '2.8K visualizações', category: 'Entrevistas', thumbnail: '/thumbs/entrevista1.jpg' },
    { id: 'v3', title: 'Melhores Momentos da 11ª Jornada - Golos do Mês', duration: '12:40', views: '9.1K visualizações', category: 'Compilações', thumbnail: '/thumbs/golos.jpg' },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 relative">
      <div className="cyber-grid-bg absolute inset-0 opacity-15 pointer-events-none" />
      <div className="scanline-overlay" />

      <header className="mb-12 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="status-pulse w-2.5 h-2.5" />
            <span className="text-accent font-mono text-xs uppercase tracking-widest font-semibold">LigaTV Broadcast System</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display uppercase font-extrabold text-white">LIGA<span className="text-accent">TV</span></h1>
        </div>
        <Tv className="h-12 w-12 text-primary hidden sm:block animate-pulse" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reprodutor de Vídeo Principal (HUD Glass Design) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video bg-zinc-950 rounded-2xl border-2 border-zinc-800 overflow-hidden hud-panel">
            <div className="scanline-overlay" />
            
            {/* HUD Corner Decorators */}
            <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-accent/60" />
            <span className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-accent/60" />
            <span className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accent/60" />
            <span className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-accent/60" />

            {/* Video Canvas Placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 text-center">
              <div className="p-6 bg-accent/25 border-2 border-accent rounded-full animate-pulse cursor-pointer">
                <Play size={40} className="text-white fill-white ml-1" />
              </div>
              <p className="font-mono text-xs text-zinc-500 mt-6 tracking-widest uppercase">
                {activeVideo.isLive ? 'Sinal de Satélite Conectado' : 'Reproduzir Vídeo Principal'}
              </p>
            </div>

            {/* Live Badge */}
            {activeVideo.isLive && (
              <div className="absolute top-6 left-6 bg-red-650 text-white font-mono text-xs px-3 py-1 rounded-md font-bold flex items-center gap-2 border border-red-500">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> DIRECTO
              </div>
            )}
          </div>

          {/* Detalhes do Vídeo Ativo */}
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <span className="text-[10px] font-mono text-primary uppercase tracking-widest">{activeVideo.category}</span>
            <h2 className="text-2xl font-display uppercase font-bold text-white mt-1">{activeVideo.title}</h2>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mt-4 pt-4 border-t border-zinc-800/60">
              <span className="flex items-center gap-1"><Eye size={12} /> {activeVideo.views}</span>
              <span className="flex items-center gap-1"><Volume2 size={12} /> Áudio Estéreo</span>
            </div>
          </div>
        </div>

        {/* Playlist Lateral (Vídeos Recomendados) */}
        <div className="space-y-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Sparkles size={12} className="text-accent" /> Playlist Recomendada
          </h3>

          <div className="space-y-4">
            {playlist.map((video) => (
              <div 
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="flex gap-4 p-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 rounded-xl cursor-pointer transition-all duration-300 group"
              >
                <div className="w-28 h-20 bg-zinc-850 rounded-lg relative overflow-hidden flex-shrink-0 flex items-center justify-center text-zinc-600">
                  <Play size={16} className="group-hover:text-primary transition-colors" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <h4 className="text-xs font-bold text-zinc-300 group-hover:text-white line-clamp-2 uppercase">
                    {video.title}
                  </h4>
                  <p className="text-[9px] font-mono text-zinc-500">
                    {video.category} · {video.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## 📱 5. Roadmap e Otimização para Aplicação Móvel (Futura PWA/App)

Para garantir que o portal masculino se transforme facilmente numa aplicação nativa ou híbrida no futuro, implemente estas diretrizes:

### 5.1. PWA Manifest (`public/manifest.json`)
Crie este ficheiro no diretório `public/` para permitir que o utilizador instale o site diretamente no ecrã inicial do smartphone (iOS/Android):

```json
{
  "short_name": "FutiboolM",
  "name": "Portal Girabola Masculino",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo-192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/",
  "background_color": "#050507",
  "theme_color": "#D1208A",
  "display": "standalone",
  "orientation": "portrait"
}
```

### 5.2. Otimização de Interface Touch (Mobile-First)
1. **Zonas de Toque Amplas**: Todos os botões, links de menu e cartões devem ter área mínima de interação de `48px x 48px` (use padding interno `py-3` e `px-6`).
2. **Suporte de Gestos (Swipe)**: Ao transicionar para ecrãs de equipas e jogadores, utilize o controlo de deslize horizontal nativo do telemóvel (`overflow-x-auto snap-x scrollbar-none`).
3. **Imagens Leves**: Utilize sempre o componente `next/image` do Next.js configurado para converter todas as fotos de jogadores para formato moderno **WebP** ou **AVIF** automaticamente.
