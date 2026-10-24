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

// Wiliete — fotos enviadas pelo clube a 08–09/10/2026, ligadas pela «Lista
// nominal atletas WSCB-SAD» (07/10/2026). As fotos sem nome no ficheiro só
// entram quando o número se lê nos calções (#1, #6, #13, #32); as restantes
// esperam que o clube as identifique.
const WILIETE_PHOTO_IDS = [
  'fifa-1pkwt84',         // #1 Nayan (GR)
  'fifa-1jsrpl0',         // #5 Wiwi
  'janderson-wiliete',    // #6 Janderson
  'fifa-1jsjbh0',         // #7 Karanga
  'fifa-1k39nk6',         // #8 Mule
  'mabululu-wiliete',     // #9 Mabululu
  'fifa-1jru7c5',         // #10 Mindinho
  'fifa-1jsj8t3',         // #11 Gibelé
  'fifa-1pvxht8',         // #13 Yano
  'fifa-1jwu6z0',         // #17 Giovani
  'bello-lukman-wiliete', // #18 Belo (Lukman Bello)
  'fifa-1l05v38',         // #19 Kaká
  'fifa-1jwu0l8',         // #25 Ning
  'fifa-1pnmj53',         // #27 Júnior (Goiano)
  'fifa-1jrxs05',         // #28 Bito
  'fifa-1qvfjm7',         // #30 Sidibé
  'fifa-1m95s64',         // #32 Célio
  'fifa-1kzr1v5',         // #33 Quare
  'fifa-1k36hf0',         // #34 César (Cangué)
  'valter-monteiro',      // #35 Valter
] as const;

// Desportivo da Huíla — fotos enviadas pelo clube a 14/10/2026, com o nome de
// guerra no ficheiro, ligadas pelo «Plantel Sénior Masculino 2026/27» do clube.
// Sem página no portal: Mendes (#9, Adulai Jaló), Jó (#11, José Jó),
// Filó (#16), Mama (#17), Marcelo (#36) e Adó Jr (#37). Adó Pena (#27) sem foto.
// Geovany (#35) não consta do plantel do clube, mas a foto veio com o nome.
const HUILA_PHOTO_IDS = [
  'ndulo-huila',            // #1 Ndulo (GR)
  'katendi-huila',          // #2 Zinho (Nsambo Katendi)
  'desphuila-player-3',     // #3 Ady (Adilson Manuel)
  'dos-santos-huila',       // #4 Santos
  'joao-milagre-huila',     // #6 Jó (João Milagre)
  'leonardo-isola-huila',   // #7 Cabibi
  'mauricio-pedro-huila',   // #8 Djeizy
  'mendes-huila',           // #10 Mendes (José Nzombo)
  'passy-huila',            // #12 Passy (GR)
  'lucas-elias-huila',      // #13 Ludy
  'elias-huila',            // #15 Elias
  'milton-suca-huila',      // #18 Milton
  'fifa-1liyl15',           // #19 Casemiro (Alegria Safewangue)
  'toyzinho-huila',         // #20 Toyzinho
  'angelo-cangu-huila',     // #21 Tchutchu
  'fifa-1m7ibh3',           // #22 Jenivaldo (GR)
  'fifa-1k176v9',           // #23 Dino (Florentino António)
  'fifa-1k140k2',           // #24 Tchanga (Isidro Tchiangalala Chingango)
  'milagre-simba-huila',    // #25 Mira
  'jeremias-huila',         // #26 Jeremias
  'fifa-1pq2jf4',           // #28 Jamiro (José Augusto Camati)
  'pequenino-castro-huila', // #29 Cagodó
  'fifa-1mdngv9',           // #31 Leo (Diloy Valério)
  'tchicundico-huila',      // #32 Costa (Constantino Tchitunda)
  'fifa-1lniyj8',           // #33 Teté (Jorge Ismael Handanga José)
  'joao-samazanga-huila',   // #34 Juny
  'geovany-huila',          // #35 Geovany
] as const;

// São Salvador do Kongo — fotos enviadas pelo clube a 14/10/2026 na ficha
// «Clube Desportivo São Salvador do Kongo», ligadas pelo nome completo (a ficha
// traz números diferentes dos inscritos para Tchutchu, Busquet e Artur). Sem
// página no portal: Muanza (#37), Germano (#24), Paquetá (#36) e Adonai (#38).
const SAO_SALVADOR_PHOTO_IDS = [
  'fifa-1mubkp5', // #1 Kuanzambi (GR)
  'fifa-1kz4h82', // #2 Zenilson (José Garcia)
  'fifa-1t64mh7', // #3 Adriano
  'fifa-1jzirz7', // #4 Gui (Manuel de Matos)
  'fifa-1lih9v9', // #5 Feca
  'fifa-1lih506', // #6 Bigo (Fernando Camuege)
  'fifa-1k1sev5', // #7 Beni Papel (Batomene de Sousa)
  'fifa-1k39my6', // #8 João Vala (João Vemba)
  'fifa-1pny3g2', // #9 Geremias (Afonso Lukombo)
  'fifa-1jrutw6', // #10 Ary
  'fifa-1ljwbm7', // #11 Xavier
  'fifa-1jtv5a6', // #12 Gelson (Francisco Mangala, GR)
  'fifa-1lih5k4', // #13 Ramilton
  'fifa-1ng0f78', // #14 Lando
  'fifa-1px5zq4', // #15 Kelson (Pacheco Alfredo)
  'fifa-1ljvyf9', // #16 Manucho (Manuel Vieira Almeida)
  'fifa-1lih3r9', // #17 Luquinha
  'fifa-1ljz672', // #18 Paulenta (Paulo Panda)
  'fifa-1qpt743', // #19 Félix
  'fifa-1ljvxk1', // #20 Kimuanga (Nginakanda Vicente)
  'fifa-1k2pdb8', // #21 Samuel
  'fifa-1k1sm82', // #22 Eduardo
  'fifa-1nizqe4', // #23 Okita (Jonas Rodrigues)
  'fifa-1sr5rk8', // #25 Wilson
  'fifa-1k2pyw6', // #26 Anderson
  'fifa-1k12nm6', // #27 Dino (Justino César)
  'fifa-1thb252', // #28 Chinho (Constantino Domingos)
  'fifa-1sd3tm3', // #29 Tchutchu (Rivaldo Pacheco)
  'fifa-1swd8d7', // #30 Caetano
  'fifa-1k29464', // #31 Mano (António Mateus, GR)
  'fifa-1ljw6r1', // #32 Busquet (João Kuanzambi Lukombo Júnior)
  'fifa-1lj6z32', // #33 MC (Lutonda Sebastião)
  'fifa-1liwqf9', // #34 Artur
  'fifa-1k2wue9', // #35 Moyo (Pedro Moyo, GR)
] as const;

// FC Luanda — «Plantel FC Luanda – 1.ª volta» enviado pelo clube (14/10/2026),
// com nome de guerra e número por foto, ligado pelo número das fichas de jogo.
// Por ligar (número do clube ≠ número nas fichas): Viegas/2, Kelson/5,
// Chinés/6, Paiza/24, Edmilson/25. Sem página no portal (fora do plantel
// inscrito): Kaba/11, Tiago/18, Dollymenga/19, Yabala/20, Gabriel/21,
// Franck/31, Francês/31.
const FC_LUANDA_PHOTO_IDS = [
  'fifa-1t6azn3', // #1 Cafula (GR)
  'fifa-1qhqn96', // #4 Joel
  'fifa-1liwnq8', // #7 Motivado
  'fifa-1ljudk2', // #8 Cabeto
  'fifa-1l11132', // #9 Chiquinho
  'fifa-1l7lph0', // #10 Denilson
  'fifa-1l7wk59', // #12 Patrício (GR)
  'fifa-1t6b2z2', // #15 Rubem
  'fifa-1m8xdu3', // #16 Noé
  'fifa-1k2wth5', // #17 Filipe
  'fifa-1l7w9k9', // #22 Deo (GR)
  'fifa-1l064e1', // #23 Miguel
  'fifa-1qw3z14', // #26 Célio
  'fifa-1v0ca42', // #27 Batista
  'fifa-1maldr2', // #28 Pedro
  'fifa-1qw9vb1', // #30 Jaime
  'fifa-1malhf8', // #31 Kano
] as const;

export const PLAYER_PHOTOS: Readonly<Record<string, string>> = Object.fromEntries([
  ...KABUSCORP_PHOTO_IDS.map((id) => [id, `/players/kabuscorp/${id}.jpg`]),
  ...LUNDA_SUL_PHOTO_IDS.map((id) => [id, `/players/lundasul/${id}.jpg`]),
  ...DAGO_PHOTO_IDS.map((id) => [id, `/players/dago/${id}.jpg`]),
  ...SAGRADA_PHOTO_IDS.map((id) => [id, `/players/sagrada/${id}.jpg`]),
  ...WILIETE_PHOTO_IDS.map((id) => [id, `/players/wiliete/${id}.jpg`]),
  ...FC_LUANDA_PHOTO_IDS.map((id) => [id, `/players/fcluanda/${id}.jpg`]),
  ...HUILA_PHOTO_IDS.map((id) => [id, `/players/desphuila/${id}.jpg`]),
  ...SAO_SALVADOR_PHOTO_IDS.map((id) => [id, `/players/saosalvador/${id}.jpg`]),
  // Beni Papel tem ainda um registo à parte nas fichas de jogo: é o #7 Batomene.
  ['beni-papel-saosalvador', '/players/saosalvador/fifa-1k1sev5.jpg'],
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

// Desportivo da Huíla — enviadas pelo clube a 14/10/2026 com o «Plantel Sénior
// Masculino 2026/27».
const HUILA_STAFF_PHOTO_MA_IDS = [
  '000857M71', // Paulo Torres — treinador principal
  '000858M63', // Luís Borges — preparador físico
  '000847M87', // Sidney Candeias — técnico de scouting
  '000850M86', // Alfredo Calunganga «Chiwé» — técnico de scouting
  '002968M71', // Zela Barroso Emanuel — técnico de scouting
  '000832M66', // David Santos «Santos» — equipa médica
  '000831M67', // João António «Jojó» — equipa médica
] as const;

// São Salvador do Kongo — enviadas pelo clube a 14/10/2026. Sem foto: Eduardo
// Bakadila (massagista) e Joaquim Matondo (team manager).
const SAO_SALVADOR_STAFF_PHOTO_MA_IDS = [
  '002256M84', // Domingos Silvano Cussanda «Silva» — treinador principal
  '003178M94', // Salvador Cardoso — treinador adjunto
  '003126M87', // Eduardo Mendes Marciano «Mendonça» — treinador adjunto
  '000559M96', // Mota Sumbo — treinador de guarda-redes
  '002279M84', // Manuel Sousa — preparador físico
  '003167M96', // Miguel Santana Mário «Jeancy» — técnico de material
  '002326M90', // António Morgado Tulomba — médico
  '001208M66', // Marcos Pedro — massagista
  '007268F83', // Matondo Nsamu — fisioterapeuta
  '009030M73', // Manuel Moniz «Vici» — presidente de direção
  '003162M82', // André Vuvu Marques — secretário-geral
  '001327M98', // Cardoso Nunes Ferreira — director
] as const;

// FC Luanda — enviadas pelo clube a 14/10/2026. Fora da lista de staff do
// portal (sem licença na lista): Ruy Santos, Palinhas, Alminhas e Álvaro.
const FC_LUANDA_STAFF_PHOTO_MA_IDS = [
  '007496M57', // Paulino Silva — presidente
  '007495M80', // Adriano Manuel Pedro — director do departamento de futebol
  '007763M89', // Albino da Silva — técnico de licenciamento
  '006322M75', // Matoso da Cruz — treinador de guarda-redes
  '008953M90', // Sebastião Palavra Ngola — preparador físico
  '008007F02', // Lourdes Sicato — fisioterapeuta
] as const;

export const STAFF_PHOTOS: Readonly<Record<string, string>> = Object.fromEntries([
  ...KABUSCORP_STAFF_PHOTO_MA_IDS.map((maId) => [maId, `/staff/kabuscorp/${maId.toLowerCase()}.jpg`]),
  ...LUNDA_SUL_STAFF_PHOTO_MA_IDS.map((maId) => [maId, `/staff/lundasul/${maId.toLowerCase()}.jpg`]),
  ...FC_LUANDA_STAFF_PHOTO_MA_IDS.map((maId) => [maId, `/staff/fcluanda/${maId.toLowerCase()}.jpg`]),
  ...SAO_SALVADOR_STAFF_PHOTO_MA_IDS.map((maId) => [maId, `/staff/saosalvador/${maId.toLowerCase()}.jpg`]),
  ...HUILA_STAFF_PHOTO_MA_IDS.map((maId) => [maId, `/staff/desphuila/${maId.toLowerCase()}.jpg`]),
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
  fcluanda: STAFF_PHOTOS['007496M57'],   // Paulino Silva (14/10/2026)
  saosalvador: STAFF_PHOTOS['009030M73'], // Manuel Moniz «Vici» (14/10/2026)
  desphuila: '/presidents/desphuila.jpg', // Lucas Francisco Ndjongo (14/10/2026)
  // Por receber: petro, wiliete, bravos, sagrada, interclube,
  // libolo, lobito, cabinda, primeiromaio, caala.
};
