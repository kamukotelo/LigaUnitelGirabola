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
  description:
    "Portal digital oficial da Liga Unitel Girabola, o Campeonato Nacional de Futebol de Angola. Acompanhe classificações, resultados, equipas e estatísticas em tempo real.",
  metadataBase: new URL("https://liga-unitel-girabola.vercel.app"),

  /* ── Open Graph (Facebook, WhatsApp, LinkedIn, etc.) ── */
  openGraph: {
    type: "website",
    url: "https://liga-unitel-girabola.vercel.app",
    siteName: "Liga Unitel Girabola",
    title: "Liga Unitel Girabola — Campeonato Nacional de Futebol de Angola",
    description:
      "Acompanhe classificações, resultados, equipas e estatísticas da Liga Unitel Girabola em tempo real.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Liga Unitel Girabola — Portal Oficial",
      },
    ],
    locale: "pt_AO",
  },

  /* ── Twitter / X Card ── */
  twitter: {
    card: "summary_large_image",
    title: "Liga Unitel Girabola",
    description:
      "Portal digital oficial da Liga Unitel Girabola — Campeonato Nacional de Futebol de Angola.",
    images: ["/og-image.png"],
  },

  /* ── Ícones do site ── */
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo-girabola.png", type: "image/png" },
    ],
    apple: "/logo-girabola.png",
    shortcut: "/favicon.svg",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var d=document.documentElement;d.classList.toggle('dark',t==='dark');d.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
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
