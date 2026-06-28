/* One-off: limpa os SVG traçados — remove o fundo claro (deixa transparente)
   e adiciona viewBox para escalar corretamente. */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');
const files = ['logo-girabola.svg', 'logo-girabola-horizontal.svg'];

const isLight = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r >= 224 && g >= 224 && b >= 224;
};

for (const file of files) {
  const p = path.join(PUBLIC, file);
  let svg = fs.readFileSync(p, 'utf8');

  // viewBox a partir de width/height
  if (!/viewBox=/.test(svg)) {
    const w = svg.match(/width="(\d+)px"/);
    const h = svg.match(/height="(\d+)px"/);
    if (w && h) {
      svg = svg.replace(/<svg /, `<svg viewBox="0 0 ${w[1]} ${h[1]}" `);
    }
  }

  // remover paths de fundo (quase brancos)
  let removed = 0;
  svg = svg.replace(/<path\b[^>]*\/>/g, (tag) => {
    const m = tag.match(/fill="(#[0-9a-fA-F]{6})"/);
    if (m && isLight(m[1])) { removed++; return ''; }
    return tag;
  });

  fs.writeFileSync(p, svg);
  console.log(`${file}: ${removed} paths de fundo removidos, viewBox ok`);
}
