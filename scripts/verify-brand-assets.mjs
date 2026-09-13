#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════════════
// GUARDA DOS LOGÓTIPOS — corre antes de cada build
// ────────────────────────────────────────────────────────────────────────
// Bloqueia o build se algum emblema ou logótipo da marca não for o oficial,
// ou se o código voltar a aceitar logótipos da base de dados ou da consola.
//
// Existe por causa de duas regressões reais:
//  - 09/09: a BD e overrides da consola voltaram a ter prioridade e trocaram
//    emblemas sozinhos quando o Supabase falhou.
//  - 13/09: um `vercel --prod` feito a partir de uma cópia antiga do código
//    publicou emblemas falsos de CR Caála, FC Cabinda e FC Luanda.
//
// Só usa módulos do Node e lê a pasta atual, por isso também pode correr a
// partir das definições do projeto na Vercel sobre QUALQUER cópia enviada.
//
// Para trocar um logótipo de propósito: substituir o ficheiro, atualizar o
// SHA-256 abaixo (shasum -a 256 <ficheiro>) e publicar.
// ════════════════════════════════════════════════════════════════════════
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const CRESTS = {
  bravos: ['/crests/bravos.png', 'd377515968bd439e01d5cf2e5fab4d0cbbdb4310a3038436169a64ffc25c35e3'],
  caala: ['/crests/caala-official-20260812.png', '52107cd5bc67f88edc3bd65fde137a18541e74666b16e6571e472affc8f57eb5'],
  cabinda: ['/crests/cabinda-official-20260812.png', '0fef08b99a269e860ec296d72ebe7f6cc8c8d1d4ed7a9543d677d8c99afecc5e'],
  dago: ['/crests/dago.png', 'ba804e306f436a75e9db4f2c88841b7d1e8c795350d8e58b2dc90b6856744def'],
  desphuila: ['/crests/desphuila.png', '023b2a100871741dcfe0fd4d66246465471306158c0b1bdcbd1ff68fb19f74eb'],
  fcluanda: ['/crests/fcluanda.png', 'd7fd2d6a76a556e90477cd5e0a420dd6fd655ba2226e555d78b594b41681f6f3'],
  interclube: ['/crests/interclube.png', '5722eb43429f4f75222c5387b67cbeed48efcce754ec3e31cfbb9268eccb5ff6'],
  kabuscorp: ['/crests/kabuscorp.png', '24a07cb9e65e9d47a3ae21c45400bc1f173ab6cf292a459f835c2ba39c94f135'],
  libolo: ['/crests/libolo.png', 'c113051dd18226f8a13bb6d12423a9a72f4bb452671cc6c8c4319aa8ff903934'],
  lobito: ['/crests/lobito.png', 'ac513757e0a1818b3fad35c4b3847a21d101282b88cc949215c8d1aa2e2d612f'],
  lundasul: ['/crests/lundasul-official-20260812.png', '69abfb770209b07a844153e9d35ae6ce88248f89da68076b2d328edf193e54a6'],
  petro: ['/crests/petro.png', 'b7124c49b44d1b4e9b6b139a5c1f610cc2cd8e4183be77e38412a3e8dd2d2c86'],
  primeiromaio: ['/crests/primeiromaio.png', '8ed10d85b641ff589b4d078ad432c266447e5384c942e1faff1363c3ae69e336'],
  sagrada: ['/crests/sagrada.jpg', 'e87282b6487165510152fa60efc1c2b93ebdb6de5a34642b0a9216bf2280f81e'],
  saosalvador: ['/crests/saosalvador.png', '631a4dc0802a01943b5171ebab8a3283da3a01b504a5e0b34cdc4699100d6ae8'],
  wiliete: ['/crests/wiliete.png', '581ffaa770db0549ea58e7c8526c7fd8bf01e9e86737c44195ff79bde7b91bb4'],
};

const BRAND = {
  '/logo-girabola.png': '18a2f71603a55bc8bded92c6c43473577179bd27c21678a6609ce72952768157',
  '/logo-girabola-horizontal.png': 'bd02b89f4ff0c91004f844393d0daa19d3131836a13f678bb268c19ba3ec4bc8',
  '/logo-girabola-horizontal-white.png': 'e76c886e01014e75a67b507dd1027e4874035387f8a8439acc57a8d8a737f3fc',
  '/logo-girabola-white.png': '70d94a3985a0d585dccbfc9633f47927b819bd219743f7ec174a77f8bed9b635',
  '/logo-ancaf.png': '9a38e4d14c8b49b7bf118aa3566a416544391fe8a357508bee111f0eefb5b277',
};

const errors = [];
const read = (rel) => {
  const path = join(ROOT, rel);
  return existsSync(path) ? readFileSync(path, 'utf8') : null;
};
const sha256 = (publicPath) => {
  const path = join(ROOT, 'public', publicPath);
  return existsSync(path) ? createHash('sha256').update(readFileSync(path)).digest('hex') : null;
};
const checkFile = (label, publicPath, expected) => {
  const actual = sha256(publicPath);
  if (actual === null) errors.push(`${label}: ficheiro public${publicPath} em falta`);
  else if (actual !== expected) errors.push(`${label}: public${publicPath} não é o ficheiro oficial`);
};

// 1. Conteúdo de cada ficheiro.
for (const [team, [path, hash]] of Object.entries(CRESTS)) checkFile(`Emblema ${team}`, path, hash);
for (const [path, hash] of Object.entries(BRAND)) checkFile('Logótipo da marca', path, hash);

// 2. O registo aponta exatamente para esses ficheiros.
const registry = read('src/lib/team-crests.ts');
if (!registry) {
  errors.push('src/lib/team-crests.ts em falta');
} else {
  const found = [...registry.matchAll(/^\s+(\w+): '(\/crests\/[^']+)'/gm)].map((m) => `${m[1]}=${m[2]}`).sort();
  const expected = Object.entries(CRESTS).map(([team, [path]]) => `${team}=${path}`).sort();
  if (JSON.stringify(found) !== JSON.stringify(expected)) {
    errors.push('O registo de emblemas em src/lib/team-crests.ts não coincide com os ficheiros oficiais');
  }
  if (!/TEAM_CRESTS_LOCKED\s*=\s*true/.test(registry)) errors.push('TEAM_CRESTS_LOCKED tem de ser true');
  if (!/BRAND_LOGOS_LOCKED\s*=\s*true/.test(registry)) errors.push('BRAND_LOGOS_LOCKED tem de ser true');
  if (/\.\.\.candidates/.test(registry)) errors.push('resolveTeamCrest voltou a aceitar logótipos da BD ou da consola');
}

// 3. Nenhum caminho do código volta a aceitar logótipos de fora.
const crestComponent = read('src/components/ui/TeamCrest.tsx');
if (!crestComponent || !/const crestPath = resolveTeamCrest\(/.test(crestComponent)) {
  errors.push('TeamCrest tem de resolver o emblema com resolveTeamCrest');
}
const logos = read('src/lib/team-logos.tsx');
if (!logos) {
  errors.push('src/lib/team-logos.tsx em falta');
} else {
  if (/fetch\(/.test(logos)) errors.push('team-logos.tsx voltou a pedir logótipos à base de dados');
  if (/useContext/.test(logos)) errors.push('useBrandLogo voltou a aceitar logótipos da base de dados');
}
const applyTeamLogo = read('src/lib/data.ts')?.match(/function applyTeamLogo[\s\S]*?\n\}/)?.[0];
if (!applyTeamLogo || /dbLogo|overrideLogo|teamLogos/.test(applyTeamLogo)) {
  errors.push('applyTeamLogo em src/lib/data.ts voltou a usar a BD ou overrides da consola');
}
const brandRoute = read('src/app/api/admin/logos/route.ts');
if (!brandRoute || !/if \(BRAND_LOGOS_LOCKED\)/.test(brandRoute)) {
  errors.push('/api/admin/logos tem de recusar gravar logótipos da marca');
}
const splash = read('src/components/layout/AppSplash.tsx');
if (!splash || !/\/logo-girabola\.png/.test(splash)) errors.push('O splash tem de usar /logo-girabola.png');

if (errors.length) {
  console.error('\n✗ BUILD BLOQUEADO — logótipos diferentes dos oficiais:\n');
  for (const error of errors) console.error(`  - ${error}`);
  console.error('\nSe está a publicar a partir de uma cópia antiga do código, atualize-a para o branch atual.');
  console.error('Para trocar um logótipo de propósito: substitua o ficheiro e atualize o SHA-256 em scripts/verify-brand-assets.mjs.\n');
  process.exit(1);
}

console.log(`✓ Logótipos oficiais confirmados: ${Object.keys(CRESTS).length} emblemas e ${Object.keys(BRAND).length} logótipos da marca.`);
