import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { getTeamCrest, isTeamCrestProtected, resolveTeamCrest } from '../src/lib/team-crests';

// Originais recuperados de Downloads: F.C.C.png, C.R.C.png e lunda sul.png
// (12/08/2026). Só alterar estas referências após aprovação de novo emblema.
const originals = {
  cabinda: '0fef08b99a269e860ec296d72ebe7f6cc8c8d1d4ed7a9543d677d8c99afecc5e',
  caala: '52107cd5bc67f88edc3bd65fde137a18541e74666b16e6571e472affc8f57eb5',
  lundasul: '69abfb770209b07a844153e9d35ae6ce88248f89da68076b2d328edf193e54a6',
};

for (const [id, hash] of Object.entries(originals)) {
  const expected = `/crests/${id}-official-20260812.png`;
  assert.equal(getTeamCrest(id), expected);
  assert.equal(isTeamCrestProtected(id.toUpperCase()), true);
  const bytes = await readFile(new URL(`../public${expected}`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, `${id}: emblema original alterado`);
  // BD disponível, ausente e com URLs antigos: o resultado deve ser idêntico.
  for (const candidates of [[], [undefined], ['https://old.example/logo.png'], ['data:image/png;base64,old', `/crests/${id}.png`]]) {
    assert.equal(resolveTeamCrest(id.toUpperCase(), candidates), expected);
    // Se o original falhar, mostrar a sigla; nunca outro emblema.
    assert.equal(resolveTeamCrest(id, candidates, { [expected]: true }), undefined);
  }
}

assert.equal(resolveTeamCrest('petro', ['https://example.com/custom.png']), 'https://example.com/custom.png');
assert.equal(resolveTeamCrest('petro', ['https://example.com/custom.png'], { 'https://example.com/custom.png': true }), getTeamCrest('petro'));
assert.equal(resolveTeamCrest('unknown', []), undefined);

const component = await readFile(new URL('../src/components/ui/TeamCrest.tsx', import.meta.url), 'utf8');
assert.match(component, /const crestPath = resolveTeamCrest\(/, 'O componente deve usar a resolução protegida.');
const endpoint = await readFile(new URL('../src/app/api/teams/logo/route.ts', import.meta.url), 'utf8');
assert.match(endpoint, /if \(isTeamCrestProtected\(teamId\)\)/);
console.log('✓ Emblemas originais e proteção contra troca por falha da BD confirmados.');
