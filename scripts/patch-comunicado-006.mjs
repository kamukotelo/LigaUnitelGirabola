import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

const ROOT = process.cwd();
const DEST = path.join(ROOT, 'public/comunicados/comunicado-006-2026');
const ORIG_P1 = '/tmp/pagina-1-original.png';

async function main() {
  console.log('Patching pagina-1.png...');
  const svgP1 = Buffer.from(`
    <svg width="2481" height="3508">
      <rect x="330" y="1818" width="230" height="17" fill="#fffcf9" />
      <text x="444" y="1831" 
            font-family="Arial, Helvetica, sans-serif" 
            font-size="10.8" 
            fill="#6c6c6c" 
            text-anchor="middle" 
            letter-spacing="0.1px"
            font-weight="600">Domingo, 11/10  -  15:30</text>
    </svg>
  `);

  await sharp(ORIG_P1)
    .composite([{ input: svgP1, top: 0, left: 0 }])
    .png({ quality: 90, compressionLevel: 8 })
    .toFile(path.join(DEST, 'pagina-1.png'));

  console.log('Patching embedded_3.jpeg...');
  const svgEmb3 = Buffer.from(`
    <svg width="433" height="696">
      <rect x="150" y="492" width="135" height="12" fill="#fffcf9" />
      <text x="216.5" y="501" 
            font-family="Arial, Helvetica, sans-serif" 
            font-size="6.5" 
            fill="#6c6c6c" 
            text-anchor="middle" 
            font-weight="600">Domingo, 11/10  -  15:30</text>
    </svg>
  `);

  const emb3Buf = await sharp(path.join(DEST, 'embedded_3.jpeg'))
    .composite([{ input: svgEmb3, top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer();
  fs.writeFileSync(path.join(DEST, 'embedded_3.jpeg'), emb3Buf);

  console.log('Generating PDF from patched pages...');
  const pdfDoc = await PDFDocument.create();

  // Page 1: Patched official document (A4 dimensions: 595.28 x 841.89)
  const p1Bytes = fs.readFileSync(path.join(DEST, 'pagina-1.png'));
  const p1Image = await pdfDoc.embedPng(p1Bytes);
  const page1 = pdfDoc.addPage([595.28, 841.89]);
  page1.drawImage(p1Image, {
    x: 0,
    y: 0,
    width: 595.28,
    height: 841.89,
  });

  // Page 2: Retification notice (if exists)
  const p2Path = path.join(DEST, 'pagina-2.png');
  if (fs.existsSync(p2Path)) {
    const p2Bytes = fs.readFileSync(p2Path);
    const p2Image = await pdfDoc.embedPng(p2Bytes);
    const page2 = pdfDoc.addPage([595.28, 841.89]);
    page2.drawImage(p2Image, {
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
    });
  }

  pdfDoc.setTitle('Comunicado Oficial N.º 006-DCE/ANCAF/2026 - Programação Retificada');
  pdfDoc.setAuthor('ANCAF — Direção de Competições');
  pdfDoc.setSubject('Calendarização detalhada das jornadas 6 a 10 com retificação da 5.ª e 6.ª jornadas');

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(DEST, 'comunicado-006-dce-ancaf-2026.pdf'), pdfBytes);

  const outPdf = path.join(ROOT, 'output/pdf/comunicado-006-dce-ancaf-2026-corrigido.pdf');
  if (fs.existsSync(path.dirname(outPdf))) {
    fs.writeFileSync(outPdf, pdfBytes);
  }

  console.log('Done! All assets generated successfully.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
