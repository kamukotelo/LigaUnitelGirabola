import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Futibool App — Portal de Futebol",
    template: "%s | Futibool",
  },
  description: "Website oficial de portal desportivo baseado no Futibool Engine.",
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
          
          <Navbar />
          <main className="flex-1 z-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
