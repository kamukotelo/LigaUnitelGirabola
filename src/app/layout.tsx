import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Image from "next/image";

export const metadata: Metadata = {
  title: {
    default: "Liga Unitel Girabola — Campeonato Nacional de Futebol de Angola",
    template: "%s | Liga Unitel Girabola",
  },
  description: "Portal digital oficial da Liga Unitel Girabola, o Campeonato Nacional de Futebol de Angola. Acompanhe classificações, resultados, equipas e estatísticas em tempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="bg-background text-foreground min-h-screen">
        <div className="flex min-h-screen flex-col relative overflow-hidden">
          {/* Futuristic Aurora Blobs in background */}
          <div className="aurora-orb top-[-10%] left-[-10%]" />
          <div className="aurora-orb bottom-[-10%] right-[-10%] opacity-40" />
          
          {/* Holographic Watermark / HUD Target Reticle background logo */}
          <div className="holo-bg-logo">
            <div className="holo-logo-glow" />
            <div className="holo-logo-ring-outer" />
            <div className="holo-logo-ring-inner" />
            <Image 
              src="/logo-girabola.png" 
              alt="Hologram Logo" 
              className="holo-logo-image"
              width={500}
              height={500}
              priority
            />
            <div className="holo-logo-scanner" />
          </div>
          
          <Navbar />
          <main className="flex-1 z-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
