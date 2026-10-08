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

// CD Lunda Sul — fotos enviadas pelo clube a 08/10/2026, com o nome de
// guerra no ficheiro. Sem correspondência segura no portal: Banana, Gaspar,
// Jack, Jota e Manucho (duas fotos de pessoas diferentes).
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
  'jepson',            // #17 Jepson
  'mussa-lunda-sul',   // #20 Mussá
  'dieu',              // #25 Dieu
  'sozito',            // #26 Sozito
  'joca-lunda-sul',    // #27 Joca
  'kibuata',           // #28 Kibuata
  'zonzo',             // #33 Zonzo
  'nicon',             // #34 Nicon
  'fuca',              // #35 Fuca
  'fifa-1sc99s4',      // #37 Cláudio Daniel
  'angola-gr',         // #41 Angola
  'fifa-1uwn5d8',      // Afonso
  'fifa-1k0s9k6',      // Bicho
  'fifa-1m7i902',      // Jairo (Tchilihi Luamba)
] as const;

export const PLAYER_PHOTOS: Readonly<Record<string, string>> = Object.fromEntries([
  ...KABUSCORP_PHOTO_IDS.map((id) => [id, `/players/kabuscorp/${id}.jpg`]),
  ...LUNDA_SUL_PHOTO_IDS.map((id) => [id, `/players/lundasul/${id}.jpg`]),
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
  '000801M60', // Iloua Ntumba — médico
  '003805M90', // Vanderlei Muaximbuba — treinador adjunto
] as const;

export const STAFF_PHOTOS: Readonly<Record<string, string>> = Object.fromEntries([
  ...KABUSCORP_STAFF_PHOTO_MA_IDS.map((maId) => [maId, `/staff/kabuscorp/${maId.toLowerCase()}.jpg`]),
  ...LUNDA_SUL_STAFF_PHOTO_MA_IDS.map((maId) => [maId, `/staff/lundasul/${maId.toLowerCase()}.jpg`]),
]);

/**
 * Foto do presidente de cada clube, mostrada na Ficha do Clube ao lado do
 * nome. Chave = id da equipa. Clube sem entrada mostra só o nome.
 */
export const CLUB_PRESIDENT_PHOTOS: Readonly<Record<string, string>> = {
  kabuscorp: STAFF_PHOTOS['001836M65'], // Bento dos Santos Kangamba — presidente de direção
};
