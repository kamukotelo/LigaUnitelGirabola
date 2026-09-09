import type { NextConfig } from "next";

// Política de Segurança de Conteúdo (CSP).
// Nota: 'unsafe-inline'/'unsafe-eval' são necessários ao runtime do Next.js e à
// framer-motion (estilos e, em dev, avaliação). A afinar para nonces quando o
// pipeline o permitir. img-src https: cobre os emblemas/avatares remotos.
const isDev = process.env.NODE_ENV === 'development';
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "worker-src 'self' blob:",
  // Sem `wss://*.supabase.co`: o portal já não abre canais Realtime — as
  // leituras vivem em cache no servidor (ver src/lib/portal-cache.ts). O https
  // fica porque o login/reposição de senha ainda falam com o Supabase Auth.
  "connect-src 'self' https://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  agentRules: false,
  allowedDevOrigins: ['127.0.0.1'],
  // A ficha de jogo em PDF lê o emblema da ANCAF do disco; garante que o
  // ficheiro é empacotado junto da função serverless.
  outputFileTracingIncludes: {
    '/api/admin/match-sheet/[matchId]': ['./public/logo-ancaf.png'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/adminancaf2026',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      {
        source: '/login',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
