import 'server-only';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFDocument, StandardFonts, rgb, type PDFFont } from 'pdf-lib';
import type { LineupSlot } from '@/lib/match-lineups';

export interface MatchSheetInput {
  round: number;
  date: string;
  stadium: string;
  homeTeam: string;
  awayTeam: string;
  matchId: string;
  home: { players: LineupSlot[]; coach: string | null };
  away: { players: LineupSlot[]; coach: string | null };
  officials: { referee: string; assistants: [string, string]; fourth: string };
}

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 38;
const COL_GAP = 14;
const COL_W = (PAGE_W - MARGIN * 2 - COL_GAP) / 2;

const INK = rgb(0.09, 0.09, 0.11);
const MUTE = rgb(0.45, 0.45, 0.48);
const LINE = rgb(0.75, 0.75, 0.78);
const BAND = rgb(0.94, 0.94, 0.95);

const FIELD_COLS = [
  { key: 'g', label: 'G' },
  { key: 'a', label: 'A' },
  { key: 'min', label: 'MIN' },
  { key: 'am', label: 'AM' },
  { key: 'am2', label: '2A' },
  { key: 'vm', label: 'VM' },
] as const;

const NUM_W = 22;
const FIELD_W = 20;
const NAME_W = COL_W - NUM_W - FIELD_COLS.length * FIELD_W;
const ROW_H = 13.2;
const STARTERS = 11;

/** Mantém só caracteres representáveis em WinAnsi (StandardFonts do pdf-lib). */
function wa(value: string): string {
  return (value ?? '')
    .replace(/–|—/g, '-')
    .replace(/‘|’/g, "'")
    .replace(/“|”/g, '"')
    .replace(/[^\x20-\xFF]/g, '');
}

function formatKickoff(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const date = d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Africa/Luanda' });
  const time = d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Luanda' }).replace(':', 'H');
  return `${date} · ${time}`;
}

export async function buildMatchSheetPdf(input: MatchSheetInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const form = doc.getForm();
  const page = doc.addPage([PAGE_W, PAGE_H]);

  let logo: Awaited<ReturnType<typeof doc.embedPng>> | null = null;
  try {
    logo = await doc.embedPng(await readFile(join(process.cwd(), 'public/logo-ancaf.png')));
  } catch {
    logo = null;
  }

  const text = (s: string, x: number, y: number, size: number, f: PDFFont = font, color = INK) =>
    page.drawText(wa(s), { x, y, size, font: f, color });
  const centered = (s: string, cx: number, y: number, size: number, f: PDFFont = font, color = INK) => {
    const w = f.widthOfTextAtSize(wa(s), size);
    page.drawText(wa(s), { x: cx - w / 2, y, size, font: f, color });
  };
  const rightAt = (s: string, rx: number, y: number, size: number, f: PDFFont = font, color = INK) => {
    const w = f.widthOfTextAtSize(wa(s), size);
    page.drawText(wa(s), { x: rx - w, y, size, font: f, color });
  };
  const hline = (x1: number, x2: number, y: number, thickness = 0.7, color = LINE) =>
    page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness, color });

  // ── Cabeçalho ─────────────────────────────────────────────────────────
  let y = PAGE_H - MARGIN;
  if (logo) {
    const h = 34;
    const w = (logo.width / logo.height) * h;
    page.drawImage(logo, { x: MARGIN, y: y - h, width: w, height: h });
  }
  centered('LIGA UNITEL GIRABOLA', PAGE_W / 2, y - 12, 13, bold);
  centered('Campeonato Nacional de Futebol de Angola', PAGE_W / 2, y - 24, 7.5, font, MUTE);

  const rx = PAGE_W - MARGIN;
  rightAt(`${input.round}.ª JORNADA`, rx, y - 4, 9, bold);
  rightAt(formatKickoff(input.date), rx, y - 15, 8);
  rightAt(input.stadium || 'Estádio a confirmar', rx, y - 25, 8);

  y -= 44;
  hline(MARGIN, PAGE_W - MARGIN, y, 1.2, INK);
  y -= 16;
  centered('CONSTITUIÇÃO DAS EQUIPAS', PAGE_W / 2, y, 12, bold);
  y -= 22;

  // ── Cabeçalhos das equipas ────────────────────────────────────────────
  const colX = [MARGIN, MARGIN + COL_W + COL_GAP];
  const sides: Array<{ tag: 'home' | 'away'; teamName: string; data: MatchSheetInput['home'] }> = [
    { tag: 'home', teamName: input.homeTeam, data: input.home },
    { tag: 'away', teamName: input.awayTeam, data: input.away },
  ];

  colX.forEach((x, i) => {
    page.drawRectangle({ x, y: y - 15, width: COL_W, height: 16, color: BAND });
    centered(sides[i].teamName.toUpperCase(), x + COL_W / 2, y - 11, 9.5, bold);
  });
  y -= 26;

  const columnTop = y;

  const drawColumnHeader = (x: number, rowY: number) => {
    page.drawRectangle({ x, y: rowY - ROW_H + 2, width: COL_W, height: ROW_H, color: BAND });
    text('Nº', x + 4, rowY - ROW_H + 6, 6.5, bold, MUTE);
    text('NOME', x + NUM_W + 4, rowY - ROW_H + 6, 6.5, bold, MUTE);
    FIELD_COLS.forEach((c, ci) => {
      const fx = x + NUM_W + NAME_W + ci * FIELD_W;
      centered(c.label, fx + FIELD_W / 2, rowY - ROW_H + 6, 5.5, bold, MUTE);
    });
  };

  const drawPlayerRow = (x: number, rowY: number, side: 'home' | 'away', fieldIdx: number, slot: LineupSlot | null) => {
    hline(x, x + COL_W, rowY - ROW_H + 1, 0.4);
    const cap = slot?.isCaptain ? ' (C)' : '';
    text(slot && slot.number > 0 ? String(slot.number) : '', x + 4, rowY - ROW_H + 4.5, 8);
    text(slot ? `${slot.name}${cap}` : '', x + NUM_W + 4, rowY - ROW_H + 4.5, 8);
    FIELD_COLS.forEach((c, ci) => {
      const fx = x + NUM_W + NAME_W + ci * FIELD_W;
      const tf = form.createTextField(`${side}_${fieldIdx}_${c.key}`);
      tf.addToPage(page, {
        x: fx + 1.5, y: rowY - ROW_H + 2, width: FIELD_W - 3, height: ROW_H - 3,
        borderWidth: 0.4, borderColor: LINE, backgroundColor: rgb(1, 1, 1), font,
      });
      tf.setFontSize(7);
    });
  };

  const subRowCount = Math.max(
    7,
    input.home.players.filter((p) => !p.isStarter).length,
    input.away.players.filter((p) => !p.isStarter).length,
  );

  colX.forEach((x, si) => {
    const side = sides[si];
    let rowY = columnTop;
    drawColumnHeader(x, rowY);
    rowY -= ROW_H;

    const starters = side.data.players.filter((p) => p.isStarter);
    const subs = side.data.players.filter((p) => !p.isStarter);

    for (let i = 0; i < STARTERS; i += 1) {
      drawPlayerRow(x, rowY, side.tag, i + 1, starters[i] ?? null);
      rowY -= ROW_H;
    }

    rowY -= 3;
    page.drawRectangle({ x, y: rowY - ROW_H + 2, width: COL_W, height: ROW_H, color: BAND });
    text('SUPLENTES', x + 4, rowY - ROW_H + 6, 6.5, bold, MUTE);
    rowY -= ROW_H;

    for (let i = 0; i < subRowCount; i += 1) {
      drawPlayerRow(x, rowY, side.tag, 100 + i, subs[i] ?? null);
      rowY -= ROW_H;
    }

    rowY -= 8;
    text('TREINADOR:', x + 2, rowY, 7.5, bold, MUTE);
    text(side.data.coach || '—', x + 56, rowY, 8);
  });

  // ── Equipa de arbitragem ──────────────────────────────────────────────
  let oy = columnTop - ROW_H * (1 + STARTERS + 1 + subRowCount) - 36;
  hline(MARGIN, PAGE_W - MARGIN, oy + 8, 0.7);

  const officialRow = (label: string, fieldName: string, value: string) => {
    text(label, MARGIN, oy - 4, 7.5, bold, MUTE);
    const tf = form.createTextField(fieldName);
    tf.addToPage(page, {
      x: MARGIN + 128, y: oy - 8, width: PAGE_W - MARGIN * 2 - 128, height: 12,
      borderWidth: 0.4, borderColor: LINE, backgroundColor: rgb(1, 1, 1), font,
    });
    tf.setText(wa(value && value !== 'A definir' ? value : ''));
    tf.setFontSize(8);
    oy -= 17;
  };
  officialRow('ÁRBITRO', 'official_referee', input.officials.referee);
  officialRow('1.º ÁRBITRO ASSISTENTE', 'official_assistant_1', input.officials.assistants[0]);
  officialRow('2.º ÁRBITRO ASSISTENTE', 'official_assistant_2', input.officials.assistants[1]);
  officialRow('4.º ÁRBITRO', 'official_fourth', input.officials.fourth);

  centered(
    `Época 2026/2027 · Ficha gerada em ${new Date().toLocaleString('pt-PT', { timeZone: 'Africa/Luanda', dateStyle: 'short', timeStyle: 'short' })} · ANCAF`,
    PAGE_W / 2, MARGIN - 10, 6.5, font, MUTE,
  );

  form.updateFieldAppearances(font);
  return doc.save();
}
