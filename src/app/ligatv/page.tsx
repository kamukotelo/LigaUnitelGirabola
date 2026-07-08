'use client';

import { useState } from 'react';
import { Play, Tv, Eye, Sparkles, Volume2 } from 'lucide-react';
import { type VideoHighlight, getVideoHighlights } from '@/lib/data';

export default function LigaTv() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoHighlights = getVideoHighlights();
  const [activeVideo, setActiveVideo] = useState<VideoHighlight>(videoHighlights[0]);

  const playlist = videoHighlights.slice(1);


  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleSelectVideo = (video: VideoHighlight) => {
    setActiveVideo(video);
    setIsPlaying(true);
  };

  return (
    <main className="min-h-screen bg-background dark:bg-black text-foreground p-6 md:p-12 relative z-10">
      <div className="cyber-grid-bg absolute inset-0 opacity-15 pointer-events-none z-0" />
      <div className="scanline-overlay" />

      <header className="mb-12 flex items-center justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="status-pulse w-2.5 h-2.5 bg-accent" />
            <span className="text-accent font-mono text-xs uppercase tracking-widest font-semibold">
              LigaTV Broadcast System
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display uppercase font-black text-foreground leading-none">
            LIGA<span className="text-accent font-italic">TV</span>
          </h1>
        </div>
        <Tv className="h-12 w-12 text-primary hidden sm:block animate-pulse" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Reprodutor de Vídeo Principal (HUD Glass Design) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-950 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden hud-panel">
            <div className="scanline-overlay" />
            
            {/* HUD Corner Decorators */}
            <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-accent/60 z-10 pointer-events-none" />
            <span className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-accent/60 z-10 pointer-events-none" />
            <span className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accent/60 z-10 pointer-events-none" />
            <span className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-accent/60 z-10 pointer-events-none" />

            {/* Video Canvas Placeholder or Iframe */}
            {isPlaying ? (
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                className="absolute inset-0 w-full h-full border-none z-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div 
                onClick={handlePlay}
                className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-100/90 dark:bg-zinc-950/90 text-center cursor-pointer group hover:bg-zinc-100/80 dark:hover:bg-zinc-950/80 transition-all duration-300"
              >
                <div className="p-6 bg-accent/20 border-2 border-accent rounded-full animate-pulse group-hover:scale-110 transition-transform">
                  <Play size={40} className="text-foreground fill-white ml-1" />
                </div>
                <p className="font-mono text-xs text-zinc-500 mt-6 tracking-widest uppercase font-bold">
                  {activeVideo.isLive ? 'Sinal de Satélite Conectado' : 'Reproduzir Vídeo Principal'}
                </p>
              </div>
            )}

            {/* Live Ticker Indicator */}
            {activeVideo.isLive && (
              <div className="absolute top-6 left-6 bg-red-600 text-white font-mono text-[10px] px-3 py-1 rounded-md font-extrabold flex items-center gap-2 border border-red-500 shadow-lg shadow-red-600/30 z-10 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> DIRECTO
              </div>
            )}
          </div>

          {/* Detalhes do Vídeo Ativo */}
          <div className="bg-white/40 dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-900">
            <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-extrabold">{activeVideo.category}</span>
            <h2 className="text-2xl font-display uppercase font-bold text-foreground mt-1 leading-snug">{activeVideo.title}</h2>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mt-4 pt-4 border-t border-zinc-200/80 dark:border-zinc-900/80">
              <span className="flex items-center gap-1.5"><Eye size={12} /> {activeVideo.views}</span>
              <span className="flex items-center gap-1.5"><Volume2 size={12} /> Áudio Estéreo</span>
            </div>
          </div>
        </div>

        {/* Playlist Lateral (Vídeos Recomendados) */}
        <div className="space-y-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2 font-bold">
            <Sparkles size={12} className="text-accent" /> Playlist Recomendada
          </h3>

          <div className="space-y-4">
            {playlist.map((video) => (
              <div 
                key={video.id}
                onClick={() => handleSelectVideo(video)}
                className="flex gap-4 p-3 bg-white/30 dark:bg-zinc-900/30 hover:bg-white/60 dark:hover:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-900 rounded-xl cursor-pointer transition-all duration-300 group"
              >
                <div className="w-28 h-20 bg-zinc-100 dark:bg-zinc-950 rounded-lg relative overflow-hidden flex-shrink-0 flex items-center justify-center text-zinc-600 group-hover:text-primary transition-colors border border-zinc-200 dark:border-zinc-900">
                  <Play size={16} className="group-hover:text-primary transition-colors fill-current" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-foreground line-clamp-2 uppercase">
                    {video.title}
                  </h4>
                  <p className="text-[9px] font-mono text-zinc-500 mt-1 uppercase">
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
