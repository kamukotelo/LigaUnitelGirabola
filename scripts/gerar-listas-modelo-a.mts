// Gera a "Lista de Jogadores e Staff" (Modelo A, claro) de cada clube em PDF.
// Uso: npx tsx scripts/gerar-listas-modelo-a.mts [teamId ...]
// Fonte padrão: Calibri (regra do CLAUDE.md). Sem posição. Linhas, letra e título ajustam-se para encher a página A4 sem a ultrapassar.
// Saída: outputs/listas_modelo_a/<teamId>.html e .pdf (PDF via Google Chrome headless).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { TEAMS, getPlayersByTeam, getTeamStaff } from '../src/lib/data.ts';
import { TEAM_CRESTS } from '../src/lib/team-crests.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'outputs', 'listas_modelo_a');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
// Calibri (fonte padrão): usa a instalada no sistema ou, se faltar, a do Microsoft Office.
const OFFICE_FONTS = ['/Applications/Microsoft PowerPoint.app/Contents/Resources/DFonts', '/Applications/Microsoft Word.app/Contents/Resources/DFonts']
  .find((d) => fs.existsSync(path.join(d, 'Calibri.ttf')));
const calibriFace = (file: string, weight: number) => OFFICE_FONTS
  ? `@font-face{font-family:Calibri;font-weight:${weight};src:local("Calibri${weight === 700 ? ' Bold' : ''}"),url("file://${encodeURI(path.join(OFFICE_FONTS, file))}")}`
  : '';
if (!OFFICE_FONTS) console.warn('⚠ Calibri do Office não encontrada; o Chrome usa a Calibri do sistema ou Carlito.');

const NAME_NOISE = /\s+(escal[ãa]o de forma[çc][ãa]o|preparador f[íi]sico|treinador (adjunto|principal|de guarda-redes))\s*$/i;
const cleanName = (n: string) => n.replace(NAME_NOISE, '').replace(/\s+/g, ' ').trim();
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const fileUrl = (p: string) => 'file://' + encodeURI(path.join(ROOT, 'public', p));

type Row = { num: string; name: string; lic: string };
const warnings: string[] = [];

function playerRows(teamId: string): Row[] {
  const rows: Row[] = [];
  for (const p of getPlayersByTeam(teamId) as any[]) {
    const name = cleanName(p.fullName || p.name || '');
    if (!name) { warnings.push(`${teamId}: jogador sem nome omitido (nº ${p.jerseyNumber ?? '—'})`); continue; }
    if (!p.maId) warnings.push(`${teamId}: sem licença — ${name}`);
    const num = p.jerseyNumber ? String(p.jerseyNumber) : '';
    if (!num || num === '0') warnings.push(`${teamId}: sem número — ${name}`);
    rows.push({ num: num === '0' ? '' : num, name, lic: p.maId ?? '' });
  }
  return rows.sort((a, b) => (Number(a.num) || 999) - (Number(b.num) || 999));
}

function render(team: any): string {
  const players = playerRows(team.id);
  const staff = (getTeamStaff(team.id) as any[]).map((s) => ({ name: cleanName(s.name), lic: s.maId ?? '' }));
  staff.filter((s) => !s.lic).forEach((s) => warnings.push(`${team.id}: staff sem licença — ${s.name}`));
  const crest = TEAM_CRESTS[team.id];
  const title = team.officialName || team.name;

  const pRow = (r: Row) => `<li><span class="num">${esc(r.num)}</span><span class="nm">${esc(r.name)}</span><span class="lic">${esc(r.lic)}</span></li>`;
  const sRow = (s: { name: string; lic: string }) => `<li><span class="dot">•</span><span class="nm">${esc(s.name)}</span><span class="lic">${esc(s.lic)}</span></li>`;

  return `<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Lista ${esc(title)}</title><style>
${calibriFace('Calibri.ttf', 400)}${calibriFace('Calibrib.ttf', 700)}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:210mm;height:297mm;background:#fdfbf4;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{position:relative;overflow:hidden;font-family:Calibri,Carlito,sans-serif;color:#1d1d1f}
.frame{position:absolute;inset:5mm;border:1.2mm solid #d9a521;border-radius:3mm}
.frame::after{content:"";position:absolute;inset:1mm;border:.35mm solid #d81e2c;border-radius:2mm}
:root{--row:8.6mm;--fs:9.6pt;--badge:6.4mm;--gap:5mm}
.page{position:absolute;inset:11mm 13mm 9mm;display:flex;flex-direction:column;overflow:hidden}
.ancaf{display:block;margin:0 auto;height:22mm;width:30mm;object-fit:contain;flex:none}
header{display:flex;align-items:center;justify-content:center;gap:5mm;margin-top:6mm}
header img{height:17mm;width:19mm;object-fit:contain;flex:none}
h1{white-space:nowrap;font-size:${title.length > 36 ? 19 : 23}pt;font-weight:700;letter-spacing:.2pt}
.sub{text-align:center;color:#d81e2c;font-size:8.5pt;letter-spacing:1.6mm;margin-top:1.5mm}
.rule{display:flex;align-items:center;gap:3mm;margin:3mm 3mm 0}
.rule i{flex:1;height:.45mm;background:#d9a521}.rule b{width:2.6mm;height:2.6mm;background:#d81e2c;transform:rotate(45deg)}
h2{display:flex;align-items:center;gap:3mm;font-size:14pt;margin:var(--gap) 0 1.5mm}
h2::before{content:"";width:6mm;height:6mm;border-radius:50%;background:#d81e2c}
ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;column-gap:9mm}
li{display:flex;align-items:center;gap:2.4mm;min-height:var(--row);border-bottom:.25mm dotted #c9b98a;font-size:var(--fs)}
.num,.dot{flex:none;width:var(--badge);height:var(--badge);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700}
.num{background:#1d1d1f;color:#e9b52c;font-size:calc(var(--fs) * .8)}
.dot{background:#d81e2c;color:#fff;font-size:calc(var(--fs) * .75)}
.nm{flex:1;min-width:0;line-height:1.12;padding:.4mm 0;overflow-wrap:anywhere}
.lic{flex:none;font-variant-numeric:tabular-nums;font-weight:700;font-size:calc(var(--fs) * .78);color:#d81e2c}
footer{margin-top:auto;padding-top:2.5mm;text-align:center;color:#a07c1c;font-size:7.4pt;letter-spacing:.9pt}
</style></head><body><div class="frame"></div><div class="page">
<img class="ancaf" src="${fileUrl('/logo-ancaf.png')}" alt="ANCAF">
<header>${crest ? `<img src="${fileUrl(crest)}" alt="">` : ''}<h1>${esc(title)}</h1></header>
<div class="sub">LISTA DE JOGADORES E STAFF</div>
<div class="rule"><i></i><b></b><i></i></div>
<h2>Jogadores</h2><ul>${players.map(pRow).join('')}</ul>
<h2>Staff</h2><ul>${staff.map(sRow).join('')}</ul>
<footer>ANCAF · ASSOCIAÇÃO NACIONAL DE CLUBES ANGOLANOS DE FUTEBOL</footer>
</div><script>
// Ajusta o conteúdo à página A4: maior linha/letra que caiba, sem cortar nomes.
function fit() {
  var root = document.documentElement.style, page = document.querySelector('.page');
  var h1 = document.querySelector('h1'), head = document.querySelector('header');
  var size = 23; h1.style.fontSize = size + 'pt';
  while (head.scrollWidth > head.clientWidth && size > 14) h1.style.fontSize = (size -= .5) + 'pt';
  function apply(row) {
    var fs = Math.max(7.2, Math.min(10.4, row * 1.12));
    root.setProperty('--row', row + 'mm'); root.setProperty('--fs', fs + 'pt');
    root.setProperty('--badge', Math.min(6.6, row - .7) + 'mm');
    root.setProperty('--gap', Math.max(2.5, Math.min(7, row * .6)) + 'mm');
  }
  var row = 10.5; apply(row);
  while (page.scrollHeight > page.clientHeight + 1 && row > 4.6) apply(row = Math.round((row - .1) * 10) / 10);
}
fit(); addEventListener('load', fit);
</script></body></html>`;
}

fs.mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
for (const team of TEAMS.filter((t) => !only.length || only.includes(t.id))) {
  const html = path.join(OUT, `${team.id}.html`);
  const pdf = path.join(OUT, `Lista_${team.id}_Modelo_A.pdf`);
  fs.writeFileSync(html, render(team));
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--allow-file-access-from-files', '--no-pdf-header-footer', `--print-to-pdf=${pdf}`, 'file://' + html], { stdio: 'ignore' });
  console.log('✓', pdf);
}
if (warnings.length) {
  fs.writeFileSync(path.join(OUT, 'PENDENTES.txt'), warnings.join('\n') + '\n');
  console.log(`\n${warnings.length} pendentes → ${path.join(OUT, 'PENDENTES.txt')}`);
}
