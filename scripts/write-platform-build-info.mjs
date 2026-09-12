import { writeFileSync } from 'node:fs';

const builtAt = new Date().toISOString();
writeFileSync('src/lib/platform-build-info.ts',
  `// Gerado automaticamente em cada compilação; não editar à mão.\nexport const PLATFORM_BUILD_PUBLISHED_AT = ${JSON.stringify(builtAt)};\n`,
);
console.log(`Versão do calendário preparada em ${builtAt}`);
