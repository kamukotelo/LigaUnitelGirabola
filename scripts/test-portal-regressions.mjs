import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = {
  calendar: new URL('../src/lib/use-official-calendar.ts', import.meta.url),
  config: new URL('../next.config.ts', import.meta.url),
  favicon: new URL('../src/app/favicon.ico/route.ts', import.meta.url),
};

const [calendar, config, favicon] = await Promise.all(
  Object.values(files).map((file) => readFile(file, 'utf8')),
);

function occurrences(source, expression) {
  return [...source.matchAll(expression)].length;
}

// Regressão de 27/08/2026: vários componentes montados ao mesmo tempo não
// podem chamar supabase.channel() separadamente com o mesmo tópico.
assert.equal(
  occurrences(calendar, /\.channel\(/g),
  1,
  'O calendário deve ter um único ponto de criação do canal Supabase.',
);
assert.match(
  calendar,
  /calendarRefreshListeners\s*=\s*new Set/,
  'Os consumidores do calendário devem partilhar uma lista única de listeners.',
);
assert.match(
  calendar,
  /official-calendar-public-\$\{calendarChannelSequence\}/,
  'Cada nova instância do canal deve usar uma identidade única.',
);
assert.doesNotMatch(
  calendar,
  /\.channel\(['"]official-calendar-public['"]\)/,
  'Não reutilizar o tópico fixo que provocou callbacks adicionados após subscribe().',
);
assert.match(
  calendar,
  /calendarRefreshListeners\.size\s*>\s*0/,
  'O canal só pode ser removido depois do último consumidor.',
);

// A CSP deve autorizar apenas workers do próprio portal e URLs blob.
assert.match(
  config,
  /worker-src 'self' blob:/,
  'A CSP deve manter worker-src para os workers legítimos do portal.',
);

// Navegadores antigos e extensões continuam a pedir esta rota diretamente.
assert.match(favicon, /export function GET/);
assert.match(favicon, /logo-girabola\.png/);

console.log('✓ Proteções contra regressões do portal confirmadas.');
