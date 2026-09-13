import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import {
  BRAND_LOGOS_LOCKED,
  TEAM_CRESTS,
  TEAM_CRESTS_LOCKED,
  getTeamCrest,
  isTeamCrestProtected,
  resolveTeamCrest,
} from '../src/lib/team-crests';

// Originais recuperados de Downloads: F.C.C.png, C.R.C.png e lunda sul.png
// (12/08/2026). Os hashes de todos os ficheiros vivem em
// scripts/verify-brand-assets.mjs, que corre antes do build.
const originals = {
  cabinda: '0fef08b99a269e860ec296d72ebe7f6cc8c8d1d4ed7a9543d677d8c99afecc5e',
  caala: '52107cd5bc67f88edc3bd65fde137a18541e74666b16e6571e472affc8f57eb5',
  lundasul: '69abfb770209b07a844153e9d35ae6ce88248f89da68076b2d328edf193e54a6',
};

assert.equal(TEAM_CRESTS_LOCKED, true);
assert.equal(BRAND_LOGOS_LOCKED, true);
assert.equal(Object.keys(TEAM_CRESTS).length, 16, 'O registo deve ter os 16 clubes.');

for (const [id, hash] of Object.entries(originals)) {
  const expected = `/crests/${id}-official-20260812.png`;
  assert.equal(getTeamCrest(id), expected);
  const bytes = await readFile(new URL(`../public${expected}`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, `${id}: emblema original alterado`);
}

// Nenhum clube aceita outra fonte: BD disponível, ausente, URLs antigos ou
// uploads da consola devolvem sempre o ficheiro oficial.
const staleSources = [[], [undefined], ['https://old.example/logo.png'], ['data:image/png;base64,old'], ['/crests/caala.png']];
for (const id of Object.keys(TEAM_CRESTS)) {
  assert.equal(isTeamCrestProtected(id.toUpperCase()), true, `${id}: devia estar protegido`);
  const expected = getTeamCrest(id);
  for (const candidates of staleSources) {
    assert.equal(resolveTeamCrest(id.toUpperCase(), candidates), expected, `${id}: aceitou outra fonte`);
    // Se o original falhar, mostrar a sigla; nunca outro emblema.
    assert.equal(resolveTeamCrest(id, candidates, { [expected!]: true }), undefined);
  }
}
assert.equal(resolveTeamCrest('unknown', ['https://example.com/x.png']), undefined);
assert.equal(isTeamCrestProtected('unknown'), false);

const component = await readFile(new URL('../src/components/ui/TeamCrest.tsx', import.meta.url), 'utf8');
assert.match(component, /const crestPath = resolveTeamCrest\(/, 'O componente deve usar a resolução protegida.');
const endpoint = await readFile(new URL('../src/app/api/teams/logo/route.ts', import.meta.url), 'utf8');
assert.match(endpoint, /if \(isTeamCrestProtected\(teamId\)\)/);
const brandEndpoint = await readFile(new URL('../src/app/api/admin/logos/route.ts', import.meta.url), 'utf8');
assert.match(brandEndpoint, /if \(BRAND_LOGOS_LOCKED\)/, 'A consola não pode gravar logótipos da marca.');
console.log('✓ 16 emblemas e logótipos da marca fixados; nenhuma fonte externa aceite.');
