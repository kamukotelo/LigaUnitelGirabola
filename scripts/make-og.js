// Gera a imagem Open Graph (1200×630) usada nas partilhas (WhatsApp, Facebook…)
// a partir do LOGÓTIPO OFICIAL. Correr: node scripts/make-og.js
/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const path = require('path');

const W = 1200, H = 630;
const ROOT = path.join(__dirname, '..');
const LOGO = path.join(ROOT, 'public', 'logo-girabola-horizontal.png');
const OUT = path.join(ROOT, 'public', 'og-girabola.png');

const LOGO_W = 760;                       // largura alvo do logótipo
const LOGO_H = Math.round((LOGO_W * 208) / 635);

const bg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0B12"/>
      <stop offset="55%" stop-color="#120a0e"/>
      <stop offset="100%" stop-color="#1a0c0c"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="55%">
      <stop offset="0%" stop-color="#D21515" stop-opacity="0.30"/>
      <stop offset="60%" stop-color="#D21515" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#D21515" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <!-- barra de acento (cores de Angola) -->
  <rect x="0" y="0" width="${W}" height="6" fill="#D21515"/>
  <rect x="0" y="6" width="${W}" height="3" fill="#F9C304"/>
  <rect x="0" y="${H - 9}" width="${W}" height="3" fill="#F9C304"/>
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="#D21515"/>
  <!-- texto -->
  <text x="${W / 2}" y="${H / 2 + 150}" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700"
        fill="#FFFFFF" letter-spacing="1">Campeonato Nacional de Futebol de Angola</text>
  <text x="${W / 2}" y="${H / 2 + 196}" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500"
        fill="#F9C304" letter-spacing="6">PORTAL DIGITAL OFICIAL</text>
</svg>`;

(async () => {
  const logo = await sharp(LOGO).resize({ width: LOGO_W }).png().toBuffer();
  await sharp(Buffer.from(bg))
    .composite([{ input: logo, top: Math.round(H / 2 - LOGO_H / 2 - 70), left: Math.round((W - LOGO_W) / 2) }])
    .png()
    .toFile(OUT);
  console.log('OG image gerada:', OUT);
})();
