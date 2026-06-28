/* One-off: traça os PNG oficiais do logo para SVG colorido (imagetracerjs). */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const ImageTracer = require('imagetracerjs');

const PUBLIC = path.join(__dirname, '..', 'public');

const options = {
  numberofcolors: 16,   // gradiente laranja + roxo + branco
  colorquantcycles: 4,
  pathomit: 8,          // descarta manchas minúsculas
  ltres: 1,             // limiar de linha
  qtres: 1,             // limiar de curva
  strokewidth: 0,
  linefilter: true,
  scale: 1,
  roundcoords: 2,
};

function trace(inFile, outFile) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(PUBLIC, inFile))
      .pipe(new PNG())
      .on('parsed', function () {
        const imgd = { width: this.width, height: this.height, data: this.data };
        const svg = ImageTracer.imagedataToSVG(imgd, options);
        fs.writeFileSync(path.join(PUBLIC, outFile), svg);
        console.log(`${inFile} -> ${outFile} (${(svg.length / 1024).toFixed(1)} KB, ${this.width}x${this.height})`);
        resolve();
      })
      .on('error', reject);
  });
}

(async () => {
  await trace('logo-girabola.png', 'logo-girabola.svg');
  await trace('logo-girabola-horizontal.png', 'logo-girabola-horizontal.svg');
})().catch((e) => { console.error(e); process.exit(1); });
