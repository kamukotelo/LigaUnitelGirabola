import { readFile, writeFile } from 'node:fs/promises';

const [, , inputPath, outputPath, ...options] = process.argv;
const shouldMerge = options.includes('--merge');

if (!inputPath || !outputPath) {
  console.error('Uso: node scripts/generate-official-squads.mjs <entrada.json> <saida.ts> [--merge]');
  process.exit(1);
}

const CLUBS = new Map([
  ['1º de Maio de Benguela', { teamId: 'primeiromaio', club: 'Estrela 1.º de Maio' }],
  ['Wiliete', { teamId: 'wiliete', club: 'Wiliete de Benguela' }],
  ['CD Huíla', { teamId: 'desphuila', club: 'Desportivo da Huíla' }],
  ['1º de Agosto', { teamId: 'dago', club: 'CD 1.º de Agosto' }],
  ['Kabuscorp', { teamId: 'kabuscorp', club: 'Kabuscorp SC' }],
  ['Académica do Lobito', { teamId: 'lobito', club: 'Académica do Lobito' }],
  ['FC Luanda', { teamId: 'fcluanda', club: 'FC Luanda' }],
  ['Libolo', { teamId: 'libolo', club: 'Recreativo do Libolo' }],
  ['Recreativo da Caala', { teamId: 'caala', club: 'CR Caála' }],
  ['Interclube', { teamId: 'interclube', club: 'GD Interclube' }],
  ['Bravos do Maquis', { teamId: 'bravos', club: 'Bravos do Maquis' }],
  ['Sagrada Esperança', { teamId: 'sagrada', club: 'Sagrada Esperança' }],
  ['CD Lunda Sul', { teamId: 'lundasul', club: 'Desportivo da Lunda Sul' }],
  ['São Salvador', { teamId: 'saosalvador', club: 'São Salvador' }],
  ['Petro de Luanda', { teamId: 'petro', club: 'Petro de Luanda' }],
  ['FC Cabinda', { teamId: 'cabinda', club: 'FC Cabinda' }],
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

const rawInput = (await readFile(inputPath, 'utf8')).trim();
const jsonStart = rawInput.startsWith('```') ? rawInput.indexOf('\n') + 1 : 0;
const jsonEnd = rawInput.startsWith('```') ? rawInput.indexOf('\n```', jsonStart) : rawInput.length;
if (jsonEnd < 0) throw new Error('Bloco JSON sem delimitador final.');
const source = JSON.parse(rawInput.slice(jsonStart, jsonEnd));
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

let outputSquads = squads;
if (shouldMerge) {
  try {
    const existingOutput = await readFile(outputPath, 'utf8');
    const arrayStart = existingOutput.indexOf('[');
    const arrayEnd = existingOutput.lastIndexOf('] as const;');
    if (arrayStart < 0 || arrayEnd < 0) throw new Error('formato do ficheiro existente não reconhecido');
    const existingSquads = JSON.parse(existingOutput.slice(arrayStart, arrayEnd + 1));
    const updatedTeamIds = new Set(squads.map((squad) => squad.teamId));
    outputSquads = [
      ...existingSquads.filter((squad) => !updatedTeamIds.has(squad.teamId)),
      ...squads,
    ];
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

const confirmationDate = clean(source.fonte?.data_confirmacao).slice(0, 10).split('-').reverse().join('/');
const output = `// Ficheiro gerado a partir do JSON de inscrições recebido em ${confirmationDate || 'data por confirmar'}.\n`
  + `// Para atualizar sem apagar os outros clubes: node scripts/generate-official-squads.mjs <entrada.json> <este-ficheiro> --merge\n\n`
  + `export const OFFICIAL_SQUADS_2026_27 = ${JSON.stringify(outputSquads, null, 2)} as const;\n`;

await writeFile(outputPath, output, 'utf8');
console.log(`Gerados ${outputSquads.reduce((total, squad) => total + squad.players.length, 0)} jogadores de ${outputSquads.length} clubes.`);
