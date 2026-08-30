import { readFile, writeFile } from 'node:fs/promises';

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error('Uso: node scripts/generate-official-squads.mjs <entrada.json> <saida.ts>');
  process.exit(1);
}

const CLUBS = new Map([
  ['1º de Maio de Benguela', { teamId: 'primeiromaio', club: 'Estrela 1.º de Maio' }],
  ['Wiliete', { teamId: 'wiliete', club: 'Wiliete de Benguela' }],
  ['CD Huíla', { teamId: 'desphuila', club: 'Desportivo da Huíla' }],
  ['1º de Agosto', { teamId: 'dago', club: 'CD 1.º de Agosto' }],
  ['Kabuscorp', { teamId: 'kabuscorp', club: 'Kabuscorp SC' }],
]);

const clean = (value) => String(value ?? '').trim().replace(/\s+/g, ' ');
const joinName = (first, last) => [clean(first), clean(last)].filter(Boolean).join(' ');

function personName(person) {
  const latin = joinName(person.primeiro_nome, person.ultimo_nome);
  const local = joinName(person.nome_local_primeiro, person.nome_local_ultimo);
  return clean(person.nome_popular) || latin || local;
}

function fullName(person) {
  const latin = joinName(person.primeiro_nome, person.ultimo_nome);
  const local = joinName(person.nome_local_primeiro, person.nome_local_ultimo);
  return latin || local || clean(person.nome_popular);
}

const source = JSON.parse(await readFile(inputPath, 'utf8'));
if (!Array.isArray(source.clubes)) throw new Error('O JSON deve conter o array "clubes".');

const squads = source.clubes.map((entry) => {
  const identity = CLUBS.get(clean(entry.nome));
  if (!identity) throw new Error(`Clube sem correspondência na plataforma: ${entry.nome}`);

  return {
    sourceName: clean(entry.nome),
    ...identity,
    players: (entry.plantel?.jogadores ?? []).map((player) => ({
      name: personName(player),
      fullName: fullName(player),
      popularName: clean(player.nome_popular),
      maId: clean(player.ma_id),
      fifaId: clean(player.fifa_id),
      gender: clean(player.genero),
      birthDate: clean(player.data_nascimento),
      nationality: clean(player.nacionalidade),
      position: clean(player.posicao),
      jerseyNumber: clean(player.camisola),
    })),
    staff: (entry.plantel?.equipa_tecnica ?? []).map((member) => ({
      name: personName(member),
      fullName: fullName(member),
      popularName: clean(member.nome_popular),
      maId: clean(member.ma_id),
      fifaId: clean(member.fifa_id),
      gender: clean(member.genero),
      role: clean(member.funcao),
      nationality: clean(member.nacionalidade),
    })),
  };
});

const output = `// Ficheiro gerado a partir do JSON de inscrições recebido em 30/08/2026.\n`
  + `// Para regenerar: node scripts/generate-official-squads.mjs <entrada.json> <este-ficheiro>\n\n`
  + `export const OFFICIAL_SQUADS_2026_27 = ${JSON.stringify(squads, null, 2)} as const;\n`;

await writeFile(outputPath, output, 'utf8');
console.log(`Gerados ${squads.reduce((total, squad) => total + squad.players.length, 0)} jogadores de ${squads.length} clubes.`);
