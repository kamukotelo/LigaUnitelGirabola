import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { TEAMS, getMatchesForSeason, UPCOMING_SEASON_ID, type Match } from '@/lib/data';

export interface MatchFileDetails {
  numeroPartida?: number;
  jornada?: number;
  diaDeJogo?: number;
  epoca?: string;
  competicao?: string;
  duracao?: string;
  dataRelatorio?: string;
}

export interface MatchFileKickoff {
  data: string;
  hora: string;
  fusoHorario?: string;
  dataHoraIso?: string;
}

export interface MatchFileTeamRef {
  id: string;
  nome: string;
  nomeCurto?: string;
  numeroEquipa?: number;
}

export interface MatchFilePeriods {
  primeiroPeriodo?: { casa: number; fora: number };
  segundoPeriodo?: { casa: number; fora: number };
  prolongamento?: { casa: number; fora: number };
}

export interface MatchFileResult {
  estado: 'scheduled' | 'live' | 'finished';
  casa: number;
  fora: number;
  periodos?: MatchFilePeriods;
  tempoUtilMinutos?: number | null;
  espectadores?: number | null;
}

export interface MatchFileOfficials {
  arbitro: string;
  categoriaArbitro?: string;
  assistente1: string;
  assistente2: string;
  quartoArbitro: string;
  comissario?: string;
}

export interface MatchFileLineupItem {
  numero: number;
  nome: string;
  maId?: string | null;
  posicao?: 'GK' | 'DEF' | 'MID' | 'FWD';
  isGuardaRedes?: boolean;
  isCapitao?: boolean;
}

export interface MatchFileStaffItem {
  cargo: string;
  nome: string;
  maId?: string | null;
}

export interface MatchFileEvent {
  tipo: 'golo' | 'substituicao' | 'amarelo' | 'vermelho';
  equipa: 'casa' | 'fora';
  minuto: number;
  acrescimo?: number;
  jogador?: string;
  numero?: number | null;
  subtipo?: 'normal' | 'penalti' | 'autogolo';
  jogadorEntra?: string;
  numeroEntra?: number | null;
  jogadorSai?: string;
  numeroSai?: number | null;
  codigo?: string;
  motivo?: string;
  placar?: string;
}

export interface MatchFilePayload {
  versao?: string;
  tipo?: string;
  matchId?: string;
  detalhes: MatchFileDetails;
  kickoff: MatchFileKickoff;
  localizacao: { estadio: string; cidade?: string };
  equipas: { casa: MatchFileTeamRef; fora: MatchFileTeamRef };
  resultado: MatchFileResult;
  oficiais: MatchFileOfficials;
  transmissao?: { televisao?: string; radio?: string; tagEspecial?: string };
  equipaTecnica?: { casa: MatchFileStaffItem[]; fora: MatchFileStaffItem[] };
  escalacoes?: {
    casa: { titulares: MatchFileLineupItem[]; suplentes: MatchFileLineupItem[] };
    fora: { titulares: MatchFileLineupItem[]; suplentes: MatchFileLineupItem[] };
  };
  eventos: MatchFileEvent[];
  notas?: string;
}

export interface ValidationIssue {
  nivel: 'aviso' | 'erro';
  campo: string;
  mensagem: string;
}

export interface MatchFileValidationResult {
  valido: boolean;
  matchId: string | null;
  partidaEncontrada: Match | null;
  problemas: ValidationIssue[];
  sumario: {
    golosCasa: number;
    golosFora: number;
    titularesCasa: number;
    titularesFora: number;
    suplentesCasa: number;
    suplentesFora: number;
    totalEventos: number;
  };
  payloadNormalizado: MatchFilePayload;
}

// ── Normalizador canónico de clubes da Liga ─────────────────────────────
const TEAM_ALIASES: Record<string, string> = {
  'saosalvador': 'saosalvador',
  'sao salvador': 'saosalvador',
  'são salvador': 'saosalvador',
  'clube desportivo são salvador do kongo': 'saosalvador',
  'clube desportivo sao salvador do kongo': 'saosalvador',
  'cd são salvador do kongo': 'saosalvador',
  'cd sao salvador do kongo': 'saosalvador',

  'petro': 'petro',
  'petro atletico': 'petro',
  'petro atlético': 'petro',
  'petro de luanda': 'petro',
  'petro atlético futebol sad': 'petro',
  'petro atletico futebol sad': 'petro',

  'dago': 'dago',
  '1º de agosto': 'dago',
  '1 de agosto': 'dago',
  'primeiro de agosto': 'dago',
  'clube desportivo 1º de agosto': 'dago',
  'clube desportivo 1 de agosto': 'dago',
  'cd 1.º de agosto': 'dago',
  'cd 1º de agosto': 'dago',

  'fcluanda': 'fcluanda',
  'fc luanda': 'fcluanda',
  'futebol clube de luanda': 'fcluanda',

  'interclube': 'interclube',
  'gd interclube': 'interclube',
  'grupo desportivo interclube': 'interclube',

  'kabuscorp': 'kabuscorp',
  'kabuscorp sc': 'kabuscorp',
  'kabuscorp scp': 'kabuscorp',
  'kabuscorp s.c. do palanca': 'kabuscorp',
  'kabuscorp do palanca': 'kabuscorp',

  'sagrada': 'sagrada',
  'sagrada esperanca': 'sagrada',
  'sagrada esperança': 'sagrada',
  'gd sagrada esperança': 'sagrada',
  'grupo desportivo sagrada esperança': 'sagrada',

  'wiliete': 'wiliete',
  'wiliete de benguela': 'wiliete',
  'wiliete sc': 'wiliete',
  'wiliete sport clube': 'wiliete',
  'wiliete sport clube de benguela': 'wiliete',

  'lobito': 'lobito',
  'academica do lobito': 'lobito',
  'académica do lobito': 'lobito',
  'academica petroleos do lobito': 'lobito',
  'académica petróleos do lobito': 'lobito',

  'bravos': 'bravos',
  'bravos do maquis': 'bravos',
  'fc bravos do maquis': 'bravos',
  'futebol clube bravos do maquis': 'bravos',

  'desphuila': 'desphuila',
  'desportivo da huila': 'desphuila',
  'desportivo da huíla': 'desphuila',
  'clube desportivo da huila': 'desphuila',
  'clube desportivo da huíla': 'desphuila',

  'lundasul': 'lundasul',
  'lunda sul': 'lundasul',
  'desportivo da lunda sul': 'lundasul',
  'clube desportivo da lunda sul': 'lundasul',

  'libolo': 'libolo',
  'recreativo do libolo': 'libolo',
  'clube recreativo do libolo': 'libolo',
  'cr libolo': 'libolo',

  'caala': 'caala',
  'caála': 'caala',
  'cr caala': 'caala',
  'cr caála': 'caala',
  'clube recreativo da caala': 'caala',
  'clube recreativo da caála': 'caala',

  'fccabinda': 'fccabinda',
  'fc cabinda': 'fccabinda',
  'futebol clube de cabinda': 'fccabinda',

  'primeiromaio': 'primeiromaio',
  'primeiro de maio': 'primeiromaio',
  'estrela 1º de maio': 'primeiromaio',
  'estrela 1.º de maio': 'primeiromaio',
  'estrela clube primeiro de maio': 'primeiromaio',
};

export function resolveTeamId(input: string | undefined | null): string | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase().replace(/[.,–—\-_]/g, ' ').replace(/\s+/g, ' ');
  if (TEAM_ALIASES[clean]) return TEAM_ALIASES[clean];
  for (const [key, val] of Object.entries(TEAM_ALIASES)) {
    // Evita correspondências perigosas por fragmentos curtos (ex.: "1" ou "cd").
    if (key.length >= 6 && (clean.includes(key) || key.includes(clean))) return val;
  }
  const byId = TEAMS.find((t) => t.id === input.trim().toLowerCase());
  return byId ? byId.id : null;
}

export function findMatchInSeason(
  numeroPartida: number | undefined,
  round: number | undefined,
  homeTeamId: string | null,
  awayTeamId: string | null,
  seasonId = UPCOMING_SEASON_ID,
): Match | null {
  const matches = getMatchesForSeason(seasonId);
  if (homeTeamId && awayTeamId) {
    const direct = matches.find(
      (m) =>
        m.homeTeamId === homeTeamId &&
        m.awayTeamId === awayTeamId &&
        (round === undefined || m.round === round),
    );
    if (direct) return direct;
  }
  if (numeroPartida !== undefined && numeroPartida > 0) {
    const sorted = [...matches].sort((a, b) => a.round - b.round || a.id.localeCompare(b.id));
    if (sorted[numeroPartida - 1]) return sorted[numeroPartida - 1];
  }
  return null;
}

// ── Validação e Sanidade do Arquivo de Jogo ──────────────────────────────
export function validateMatchFile(input: unknown): MatchFileValidationResult {
  const problemas: ValidationIssue[] = [];
  if (!input || typeof input !== 'object') {
    return {
      valido: false,
      matchId: null,
      partidaEncontrada: null,
      problemas: [{ nivel: 'erro', campo: 'raiz', mensagem: 'Ficheiro não é um objeto JSON válido.' }],
      sumario: { golosCasa: 0, golosFora: 0, titularesCasa: 0, titularesFora: 0, suplentesCasa: 0, suplentesFora: 0, totalEventos: 0 },
      payloadNormalizado: input as MatchFilePayload,
    };
  }

  const payload = input as Partial<MatchFilePayload>;
  const detalhes = payload.detalhes || {};
  const kickoff = payload.kickoff || { data: '', hora: '' };
  const equipas = payload.equipas || { casa: { id: '', nome: '' }, fora: { id: '', nome: '' } };
  const resultado = payload.resultado || { estado: 'finished', casa: 0, fora: 0 };
  const oficiais = payload.oficiais || { arbitro: '', assistente1: '', assistente2: '', quartoArbitro: '' };
  const eventos = Array.isArray(payload.eventos) ? payload.eventos : [];

  if (!['scheduled', 'live', 'finished'].includes(String(resultado.estado))) {
    problemas.push({ nivel: 'erro', campo: 'resultado.estado', mensagem: 'Estado do jogo inválido.' });
  }
  if (!Number.isInteger(resultado.casa) || resultado.casa < 0 || !Number.isInteger(resultado.fora) || resultado.fora < 0) {
    problemas.push({ nivel: 'erro', campo: 'resultado', mensagem: 'O resultado deve conter números inteiros não negativos.' });
  }
  if (detalhes.jornada !== undefined && (!Number.isInteger(detalhes.jornada) || detalhes.jornada < 1 || detalhes.jornada > 30)) {
    problemas.push({ nivel: 'erro', campo: 'detalhes.jornada', mensagem: 'A jornada deve estar entre 1 e 30.' });
  }
  if (kickoff.dataHoraIso && Number.isNaN(Date.parse(kickoff.dataHoraIso))) {
    problemas.push({ nivel: 'erro', campo: 'kickoff.dataHoraIso', mensagem: 'Data e hora inválidas.' });
  }
  for (const [index, evento] of eventos.entries()) {
    if (!['golo', 'substituicao', 'amarelo', 'vermelho'].includes(evento.tipo)) {
      problemas.push({ nivel: 'erro', campo: `eventos[${index}].tipo`, mensagem: 'Tipo de evento inválido.' });
    }
    if (!['casa', 'fora'].includes(evento.equipa) || !Number.isInteger(evento.minuto) || evento.minuto < 0 || evento.minuto > 130) {
      problemas.push({ nivel: 'erro', campo: `eventos[${index}]`, mensagem: 'Equipa ou minuto do evento inválido.' });
    }
  }

  const homeTeamId = resolveTeamId(equipas.casa?.id || equipas.casa?.nome);
  const awayTeamId = resolveTeamId(equipas.fora?.id || equipas.fora?.nome);

  if (!homeTeamId) {
    problemas.push({ nivel: 'erro', campo: 'equipas.casa', mensagem: `Equipa local não identificada: "${equipas.casa?.nome || equipas.casa?.id}"` });
  }
  if (!awayTeamId) {
    problemas.push({ nivel: 'erro', campo: 'equipas.fora', mensagem: `Equipa visitante não identificada: "${equipas.fora?.nome || equipas.fora?.id}"` });
  }
  if (homeTeamId && awayTeamId && homeTeamId === awayTeamId) {
    problemas.push({ nivel: 'erro', campo: 'equipas', mensagem: 'A equipa local e visitante não podem ser a mesma.' });
  }

  const partidaEncontrada = findMatchInSeason(
    detalhes.numeroPartida,
    detalhes.jornada,
    homeTeamId,
    awayTeamId,
  );

  const matchId = payload.matchId || partidaEncontrada?.id || null;
  if (!matchId) {
    problemas.push({ nivel: 'aviso', campo: 'matchId', mensagem: 'Jogo não associado diretamente a um ID interno; selecione o jogo de destino.' });
  }

  const golosCasa = eventos.filter((e) => e.tipo === 'golo' && e.equipa === 'casa').length;
  const golosFora = eventos.filter((e) => e.tipo === 'golo' && e.equipa === 'fora').length;

  if (resultado.estado === 'finished') {
    if (resultado.casa !== golosCasa) {
      problemas.push({
        nivel: 'aviso',
        campo: 'resultado.casa',
        mensagem: `Golos da equipa local (${resultado.casa}) diferem dos eventos de golo registados (${golosCasa}).`,
      });
    }
    if (resultado.fora !== golosFora) {
      problemas.push({
        nivel: 'aviso',
        campo: 'resultado.fora',
        mensagem: `Golos da equipa visitante (${resultado.fora}) diferem dos eventos de golo registados (${golosFora}).`,
      });
    }
  }

  const titularesCasa = payload.escalacoes?.casa?.titulares?.length || 0;
  const titularesFora = payload.escalacoes?.fora?.titulares?.length || 0;
  const suplentesCasa = payload.escalacoes?.casa?.suplentes?.length || 0;
  const suplentesFora = payload.escalacoes?.fora?.suplentes?.length || 0;

  if (titularesCasa > 0 && titularesCasa !== 11) {
    problemas.push({ nivel: 'aviso', campo: 'escalacoes.casa.titulares', mensagem: `Equipa local tem ${titularesCasa} titulares (o padrão são 11).` });
  }
  if (titularesFora > 0 && titularesFora !== 11) {
    problemas.push({ nivel: 'aviso', campo: 'escalacoes.fora.titulares', mensagem: `Equipa visitante tem ${titularesFora} titulares (o padrão são 11).` });
  }

  const gkCasa = payload.escalacoes?.casa?.titulares?.filter((p) => p.isGuardaRedes || p.posicao === 'GK')?.length || 0;
  const gkFora = payload.escalacoes?.fora?.titulares?.filter((p) => p.isGuardaRedes || p.posicao === 'GK')?.length || 0;
  if (titularesCasa >= 11 && gkCasa !== 1) {
    problemas.push({ nivel: 'aviso', campo: 'escalacoes.casa.titulares', mensagem: `Equipa local tem ${gkCasa} guarda-redes titulares (esperado exatamente 1).` });
  }
  if (titularesFora >= 11 && gkFora !== 1) {
    problemas.push({ nivel: 'aviso', campo: 'escalacoes.fora.titulares', mensagem: `Equipa visitante tem ${gkFora} guarda-redes titulares (esperado exatamente 1).` });
  }

  const valido = problemas.filter((p) => p.nivel === 'erro').length === 0;

  const payloadNormalizado: MatchFilePayload = {
    versao: payload.versao || '1.0',
    tipo: 'arquivo_de_jogo_girabola',
    matchId: matchId || undefined,
    detalhes: {
      numeroPartida: detalhes.numeroPartida,
      jornada: detalhes.jornada || partidaEncontrada?.round,
      diaDeJogo: detalhes.diaDeJogo,
      epoca: detalhes.epoca || '2026/2027',
      competicao: detalhes.competicao || 'LIGA UNITEL GIRABOLA - 2026/2027',
      duracao: detalhes.duracao,
      dataRelatorio: detalhes.dataRelatorio,
    },
    kickoff: {
      data: kickoff.data || partidaEncontrada?.date?.slice(0, 10) || '',
      hora: kickoff.hora || partidaEncontrada?.date?.slice(11, 16) || '',
      fusoHorario: kickoff.fusoHorario || '(UTC+1) Africa/Luanda',
      dataHoraIso: kickoff.dataHoraIso || (kickoff.data && kickoff.hora ? `${kickoff.data}T${kickoff.hora}:00+01:00` : partidaEncontrada?.date),
    },
    localizacao: {
      estadio: payload.localizacao?.estadio || partidaEncontrada?.stadium || '',
      cidade: payload.localizacao?.cidade,
    },
    equipas: {
      casa: {
        id: homeTeamId || equipas.casa?.id || '',
        nome: equipas.casa?.nome || partidaEncontrada?.homeTeam || '',
        numeroEquipa: equipas.casa?.numeroEquipa,
      },
      fora: {
        id: awayTeamId || equipas.fora?.id || '',
        nome: equipas.fora?.nome || partidaEncontrada?.awayTeam || '',
        numeroEquipa: equipas.fora?.numeroEquipa,
      },
    },
    resultado: {
      estado: resultado.estado || 'finished',
      casa: resultado.casa ?? 0,
      fora: resultado.fora ?? 0,
      periodos: resultado.periodos,
      tempoUtilMinutos: resultado.tempoUtilMinutos,
      espectadores: resultado.espectadores,
    },
    oficiais: {
      arbitro: oficiais.arbitro || '',
      categoriaArbitro: oficiais.categoriaArbitro,
      assistente1: oficiais.assistente1 || '',
      assistente2: oficiais.assistente2 || '',
      quartoArbitro: oficiais.quartoArbitro || '',
      comissario: oficiais.comissario,
    },
    transmissao: payload.transmissao,
    equipaTecnica: payload.equipaTecnica,
    escalacoes: payload.escalacoes,
    eventos,
    notas: payload.notas,
  };

  return {
    valido,
    matchId,
    partidaEncontrada,
    problemas,
    sumario: {
      golosCasa,
      golosFora,
      titularesCasa,
      titularesFora,
      suplentesCasa,
      suplentesFora,
      totalEventos: eventos.length,
    },
    payloadNormalizado,
  };
}

// ── Parser Universal de Relatório do Árbitro PDF do FCMS ────────────────
export async function parseFcmsPdfBytes(bytes: Uint8Array): Promise<MatchFilePayload> {
  const pdf = await getDocument({ data: bytes, useWorkerFetch: false }).promise;
  const pagesText: string[] = [];
  for (let num = 1; num <= pdf.numPages; num += 1) {
    const page = await pdf.getPage(num);
    const content = await page.getTextContent();
    pagesText.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
  }
  const fullText = pagesText.join('\n');

  // Cabeçalho básico
  const matchNoMatch = fullText.match(/N\.[ºo]\s*(?:da\s*partida|de\s*jogo):?\s*(\d+)/i) || fullText.match(/Match\s*No:?\s*(\d+)/i);
  const numeroPartida = matchNoMatch ? parseInt(matchNoMatch[1], 10) : undefined;

  const roundMatch = fullText.match(/JORNADA\s*(\d+)/i) || fullText.match(/ROUND\s*(\d+)/i);
  const jornada = roundMatch ? parseInt(roundMatch[1], 10) : undefined;

  const dateMatch = fullText.match(/(\d{2})[/.-](\d{2})[/.-](\d{4})\s*(\d{2}:\d{2})/);
  let data = '';
  let hora = '';
  let dataHoraIso = '';
  if (dateMatch) {
    data = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
    hora = dateMatch[4];
    dataHoraIso = `${data}T${hora}:00+01:00`;
  }

  const stadiumMatch = fullText.match(/Est[aá]dio\s+([^,\n·]+)/i);
  const estadio = stadiumMatch ? stadiumMatch[1].trim() : '';

  // Extrair nomes das equipas
  let homeName = '';
  let awayName = '';
  const teamBlock = fullText.match(/EQUIPA LOCAL\s*[:\-]?\s*([^0-9\n]+?)\s*(\d+)\s*:\s*(\d+)\s*([^\n]+?)\s*EQUIPA VISITANTE/i);
  let homeScore = 0;
  let awayScore = 0;
  if (teamBlock) {
    homeName = teamBlock[1].trim();
    homeScore = parseInt(teamBlock[2], 10);
    awayScore = parseInt(teamBlock[3], 10);
    awayName = teamBlock[4].trim();
  } else {
    const scoreMatch = fullText.match(/([A-Z\s]{3,35})\s+(\d+)\s*:\s*(\d+)\s+([A-Z\s]{3,35})/);
    if (scoreMatch) {
      homeName = scoreMatch[1].trim();
      homeScore = parseInt(scoreMatch[2], 10);
      awayScore = parseInt(scoreMatch[3], 10);
      awayName = scoreMatch[4].trim();
    }
  }

  // Períodos
  const p1Match = fullText.match(/(\d+)\s+1[º.°]\s+Per[ií]odo\s+(\d+)/i) || fullText.match(/1st\s+Period\s+(\d+)\s*:\s*(\d+)/i);
  const p2Match = fullText.match(/(\d+)\s+2[º.°]\s+Per[ií]odo\s+(\d+)/i);

  // Árbitros
  const refMatch = fullText.match(/Árbitro:?\s*(?:Árbitro[^\n]*?Nacional\s+)?([A-Za-zÀ-ÿ\s]+?)(?:\s*-\s*\(|\s*\(\d)/i);
  const ass1Match = fullText.match(/1[º.°]\s+Árbitro\s+Assistente:?\s*(?:Árbitro[^\n]*?Nacional\s+)?([A-Za-zÀ-ÿ\s]+?)(?:\s*-\s*\(|\s*\(\d)/i);
  const ass2Match = fullText.match(/2[º.°]\s+Árbitro\s+Assistente:?\s*(?:Árbitro[^\n]*?Nacional\s+)?([A-Za-zÀ-ÿ\s]+?)(?:\s*-\s*\(|\s*\(\d)/i);
  const fourthMatch = fullText.match(/Quarto\s+Árbitro:?\s*(?:Árbitro[^\n]*?Nacional\s+)?([A-Za-zÀ-ÿ\s]+?)(?:\s*-\s*\(|\s*\(\d)/i);
  const comMatch = fullText.match(/Observador\s+de\s+Jogo:?\s*(?:Comissário[^\n]*?Nacional\s+)?([A-Za-zÀ-ÿ\s]+?)(?:\s*-\s*\(|\s*\(\d)/i);

  // Golos e eventos detectados
  const eventos: MatchFileEvent[] = [];
  const goalRegex = /(?:Golo|Goal)\s*#?\s*(\d+)?\s*([A-Za-zÀ-ÿ\s]+?)\s*(\d+)'(?:\s*\+\s*(\d+)Launch')?/gi;
  let gMatch: RegExpExecArray | null;
  while ((gMatch = goalRegex.exec(fullText)) !== null) {
    eventos.push({
      tipo: 'golo',
      equipa: 'fora',
      minuto: parseInt(gMatch[3], 10),
      acrescimo: gMatch[4] ? parseInt(gMatch[4], 10) : undefined,
      jogador: gMatch[2].trim(),
      numero: gMatch[1] ? parseInt(gMatch[1], 10) : undefined,
      subtipo: 'normal',
    });
  }

  const homeId = resolveTeamId(homeName) || '';
  const awayId = resolveTeamId(awayName) || '';

  if (!numeroPartida && !jornada && (!homeId || !awayId)) {
    throw new Error('O PDF não corresponde a um Relatório do Árbitro FCMS reconhecido. Nenhum dado foi publicado.');
  }

  return {
    versao: '1.0',
    tipo: 'arquivo_de_jogo_girabola',
    detalhes: {
      numeroPartida,
      jornada,
      epoca: '2026/2027',
      competicao: 'LIGA UNITEL GIRABOLA - 2026/2027',
    },
    kickoff: {
      data,
      hora,
      fusoHorario: '(UTC+1) Africa/Luanda',
      dataHoraIso: dataHoraIso || undefined,
    },
    localizacao: { estadio },
    equipas: {
      casa: { id: homeId, nome: homeName },
      fora: { id: awayId, nome: awayName },
    },
    resultado: {
      estado: 'finished',
      casa: homeScore,
      fora: awayScore,
      periodos: {
        primeiroPeriodo: { casa: p1Match ? parseInt(p1Match[1], 10) : 0, fora: p1Match ? parseInt(p1Match[2], 10) : 0 },
        segundoPeriodo: { casa: p2Match ? parseInt(p2Match[1], 10) : 0, fora: p2Match ? parseInt(p2Match[2], 10) : 0 },
      },
    },
    oficiais: {
      arbitro: refMatch ? refMatch[1].trim() : '',
      assistente1: ass1Match ? ass1Match[1].trim() : '',
      assistente2: ass2Match ? ass2Match[1].trim() : '',
      quartoArbitro: fourthMatch ? fourthMatch[1].trim() : '',
      comissario: comMatch ? comMatch[1].trim() : undefined,
    },
    eventos,
  };
}
