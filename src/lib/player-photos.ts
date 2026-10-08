/**
 * Fotos oficiais de jogadores, entregues pelos clubes. Chave = id do jogador
 * no portal; os ficheiros vivem em public/players/<clube>/<id>.jpg (recorte
 * 4:5, 480×600). A correspondência faz-se por clube + número de camisola da
 * lista do clube, como nas alcunhas.
 */

// Kabuscorp — plantel 2026/27 enviado pelo clube a 07/10/2026.
// Sem página no portal (fora do plantel inscrito): #1 Efonge, #6 Zito,
// #23 Nathan, #31 Miguel, #39 Mpiana.
const KABUSCORP_PHOTO_IDS = [
  'fifa-1k4a836', // #2 Zamorano
  'fifa-1jyp8v8', // #3 Eliseu
  'fifa-1lgpgy7', // #4 Aldair
  'fifa-1snb179', // #5 Ady Boyo
  'fifa-1n3uhm6', // #7 Bayala
  'fifa-1v363a9', // #8 Mbali Sem
  'fifa-1k2pk58', // #10 Cuca
  'fifa-1lgpb81', // #11 Teodoro
  'fifa-1jriue5', // #12 J.B.
  'fifa-1v363c3', // #13 Ndongala
  'fifa-1k1sen7', // #14 Crespo
  'fifa-1jm7zr2', // #15 Danilson
  'fifa-1mppsb5', // #16 Henock
  'fifa-1jxicb5', // #17 Mona
  'fifa-1jrku39', // #18 Benarfa
  'fifa-1jm8hd7', // #19 Jó Paciência
  'fifa-1jwts88', // #20 Tula
  'fifa-1ma68g7', // #21 Chiló
  'fifa-1jrtva7', // #22 Mualucano
  'fifa-1snez57', // #25 Tresor
  'fifa-1pnr1r0', // #27 Joelson
  'fifa-1qxnl72', // #28 Abidal
  'fifa-1js6m05', // #29 Vingumba
  'fifa-1jrtxh4', // #32 Diógenes
  'fifa-1tgwgg5', // #35 Jojo
] as const;

// CD Lunda Sul — fotos enviadas pelo clube a 08/10/2026, com o nome de guerra
// no ficheiro, ligadas pela lista «Plantel 2026-2027» do clube. Sem página no
// Manucho (#19): o clube enviou duas fotos que parecem de pessoas diferentes;
// usa-se a primeira até o clube confirmar.
const LUNDA_SUL_PHOTO_IDS = [
  'nono',              // #2 Nonó
  'fifa-1k1k2v2',      // #3 Hanilton (Nguala)
  'yuri',              // #4 Yuri
  'fred',              // #5 Fredy
  'platini',           // #6 Platini
  'neymar-lunda-sul',  // #7 Neymar
  'vado-lunda-sul',    // #8 Vado
  'maranata',          // #10 Maranata
  'magrinho',          // #11 Magrinho
  'cacusso',           // #12 Kacusso
  'ximba',             // #16 Ximba
  'nacavuza-lunda-sul', // #14 Banana
  'jepson',            // #17 Jepson
  'manucho-lunda-sul', // #19 Manucho (por confirmar)
  'mussa-lunda-sul',   // #20 Mussá
  'dieu',              // #25 Dieu
  'sozito',            // #26 Sozito
  'joca-lunda-sul',    // #27 Joca
  'kibuata',           // #28 Kibuata
  'mongadie',          // #23 Afonso (Afonso Manuel Binga)
  'zonzo',             // #33 Zonzo
  'nicon',             // #34 Nicon
  'fuca',              // #35 Fuca
  'fifa-1sc99s4',      // #37 Cláudio Daniel
  'angola-gr',         // #41 Angola
  'fifa-1k0s9k6',      // #1 Bicho
  'fifa-1mptgz2',      // #32 Jack (Isaac Bombashi)
  'jota-lunda-sul',     // #36 Jota
  'fifa-1m7i902',      // #38 Jairo (Tchilihi Luamba)
  'gaspar-lunda-sul',   // Gaspar (GR)
] as const;

// 1.º de Agosto — fotos enviadas pelo clube a 08/10/2026, com o nome de guerra
// no ficheiro, ligadas pela lista «Atletas para a época 2026/2027» do clube
// (06/10/2026). Sem página no portal: Paulo (#21), Chinote (#30) e Julião
// (#31). «Ary Folha» e «Robson» não constam da lista do clube.
const DAGO_PHOTO_IDS = [
  'nuno-dago',        // #1 Nuno
  'milton-dago',      // #2 Milton
  'simao-dianzenza',  // #3 Mabelé (Simão Dianzenza)
  'bonifacio-dago',   // #5 Bonifácio
  'bruno-dago',       // #6 Bruno
  'mabilson-dago',    // #7 Mabilson
  'axel-dago',        // #8 Axel
  'rupson-dago',      // #9 Rupson
  'calebi-dago',      // #10 Calebi
  'fernando-dago',    // #11 Fernando
  'obed-dago',        // #14 Obed
  'venancio-dago',    // #15 Venâncio
  'macaia-dago',      // #16 Macaia
  'dago-tshibamba',   // #17 Dagó
  'cliver-dago',      // #18 Clíver
  'fifa-1pxu511',     // #19 Paxe
  'tombe-dago',       // #20 Tombé
  'anselmo-dago',     // #22 Anselmo
  'fifa-1pwaay2',     // #23 Aspirina
  'fifa-1pxwmn6',     // #24 Erique
  'fifa-1v12ek6',     // #25 Luciano
  'castro-dago',      // #27 Castro
  'bulaya-dago',      // #28 Felix (Bulaya)
  'bencao-dago',      // #36 Benção
] as const;

// Sagrada Esperança — fotos enviadas pelo clube a 08/10/2026, com número e
// nome de guerra no ficheiro, ligadas pela camisola nas escalações oficiais.
const SAGRADA_PHOTO_IDS = [
  'fifa-1v1a1u9',      // #2 Alex (Alexandre Abel Fernando)
  'manuel-sagrada',    // #3 Manú (Manuel Vunge)
  'lito-sagrada',      // #4 Lito
  'miguel-sagrada',    // #5 Basílio (Miguel Anselmo Basílio Daniel)
  'dabanda-sagrada',   // #7 Dabanda
  'guilherme-sagrada', // #8 Celso Cabuço
  'jorge-sagrada',     // #9 Jorge Txando
  'lepua-sagrada',     // #10 Lépua
  'melono-sagrada',    // #11 Melono Dala
  'nsesani-sagrada',   // #12 Nsesani
  'leonardo-sagrada',  // #13 Léo Mutunda
  'pimpao-sagrada',    // #16 Pimpão
  'gogoro-sagrada',    // #17 Gogoró
  'silvano-sagrada',   // #18 Vânio (Silvano)
  'fifa-1l3l5q7',      // #19 Dodão
  'luis-tati-sagrada', // #20 Luís Tati
  'fifa-1v0z7l2',      // #21 Messias Neves
  'manox-sagrada',     // #23 Manox (Paulo Catumbila)
  'mafuta-sagrada',    // #24 Mafuta
  'lulas-sagrada',     // #25 Lulas (Manuel Cunha)
  'barreira-sagrada',  // #28 Barreira
  'fifa-1l7lpp2',      // #30 Adolfo (GR)
  'cahilo-sagrada',    // #32 Fernando (Cahilo)
  'fifa-1l7vm13',      // #33 Cláudio Tunga (Claudio Barbosa)
  'fifa-1jrv034',      // #34 Kandumba
] as const;

export const PLAYER_PHOTOS: Readonly<Record<string, string>> = Object.fromEntries([
  ...KABUSCORP_PHOTO_IDS.map((id) => [id, `/players/kabuscorp/${id}.jpg`]),
  ...LUNDA_SUL_PHOTO_IDS.map((id) => [id, `/players/lundasul/${id}.jpg`]),
  ...DAGO_PHOTO_IDS.map((id) => [id, `/players/dago/${id}.jpg`]),
  ...SAGRADA_PHOTO_IDS.map((id) => [id, `/players/sagrada/${id}.jpg`]),
]);

/**
 * Fotos da equipa técnica e direção, por número de licença (maId) — a lista de
 * staff pode vir da base de dados, mas a licença é a mesma. Ficheiros em
 * public/staff/<clube>/<maId em minúsculas>.jpg (recorte 4:5, 480×600).
 */
// Kabuscorp — enviadas pelo clube a 07/10/2026. Sem foto: Marcelo Muniz Matos.
const KABUSCORP_STAFF_PHOTO_MA_IDS = [
  '007949M77', // Leonardo Neiva — treinador principal
  '007965M73', // Adriano Lancetta — adjunto
  '007732M86', // Daniel Mabata — assistente técnico
  '008244M84', // Marcelo Vitor — preparador físico
  '001838M73', // Jorge de Almeida — médico
  '005444M86', // Olavo Miguel — médico
  '003110M81', // Salomão Manuel — fisioterapeuta
  '001839M65', // Pedro de Oliveira — massagista
  '001846M94', // Manuel André — seccionista
  '001845M82', // Inácio Manuel — seccionista
  '002978M69', // Roberto Cambundo — director desportivo
  '000948M90', // Filipe Duculo — departamento de futebol
  '001836M65', // Bento dos Santos — presidente de direção
  '003033M67', // Raul Mendonça — vice-presidente
  '001837M63', // José Domingos — assessor de direção
] as const;

// CD Lunda Sul — enviadas pelo clube a 08/10/2026.
const LUNDA_SUL_STAFF_PHOTO_MA_IDS = [
  '001200M70', // Domingos dos Santos «Mingo Ayaya» — team manager
  '001202M84', // Lucas «Zeula» — treinador adjunto
  '000791M75', // Rogério Riangue «Man Pirras» — treinador adjunto
  '003805M90', // Vanderlei Muaximbuba — treinador adjunto de guarda-redes
  '000801M60', // Iloua Ntumba — massagista
  '007144M88', // Oliveira Nascimento «Meco» — massagista
  '000800M91', // Domingos Yeno «Max» — técnico de equipamentos
] as const;

export const STAFF_PHOTOS: Readonly<Record<string, string>> = Object.fromEntries([
  ...KABUSCORP_STAFF_PHOTO_MA_IDS.map((maId) => [maId, `/staff/kabuscorp/${maId.toLowerCase()}.jpg`]),
  ...LUNDA_SUL_STAFF_PHOTO_MA_IDS.map((maId) => [maId, `/staff/lundasul/${maId.toLowerCase()}.jpg`]),
]);

/**
 * Staff da lista do clube ainda sem número de licença: chave = id da equipa +
 * nome, como aparece na equipa técnica.
 */
const STAFF_PHOTOS_BY_NAME: Readonly<Record<string, string>> = {
  'lundasul:Maurílio Silva': '/staff/lundasul/maurilio-silva.jpg',
  'lundasul:Ricardo Vieira': '/staff/lundasul/ricardo-vieira.jpg',
};

export function getStaffPhoto(teamId: string, member: { name: string; maId?: string }): string | undefined {
  return (member.maId ? STAFF_PHOTOS[member.maId] : undefined) ?? STAFF_PHOTOS_BY_NAME[`${teamId}:${member.name}`];
}

/**
 * Foto do presidente de cada clube, em destaque no topo da Ficha do Clube.
 * Chave = id da equipa. Todos os clubes já mostram o destaque; sem entrada
 * aqui aparece um marcador «foto por publicar» no lugar da foto.
 *
 * Para acrescentar: se o presidente tem licença no staff, use
 * STAFF_PHOTOS['<maId>']; senão grave public/presidents/<id da equipa>.jpg
 * (recorte 4:5, 480×600) e aponte para lá.
 */
export const CLUB_PRESIDENT_PHOTOS: Readonly<Record<string, string>> = {
  kabuscorp: STAFF_PHOTOS['001836M65'], // Bento dos Santos Kangamba — presidente de direção (foto nova, 08/10/2026)
  dago: '/presidents/dago.jpg',          // Gouveia de Sá Miranda (08/10/2026)
  lundasul: '/presidents/lundasul.jpg',  // Miguel da Silva «Ipwupwu» (08/10/2026)
  // Por receber: petro, wiliete, desphuila, bravos, sagrada, interclube,
  // libolo, lobito, saosalvador, cabinda, primeiromaio, caala, fcluanda.
};
