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

export const PLAYER_PHOTOS: Readonly<Record<string, string>> = Object.fromEntries(
  KABUSCORP_PHOTO_IDS.map((id) => [id, `/players/kabuscorp/${id}.jpg`]),
);
