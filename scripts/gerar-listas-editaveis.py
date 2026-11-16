#!/usr/bin/env python3
"""Transforma as listas Modelo A em PDF editável, com campos em Calibri embutida.

Uso (depois de `npx tsx scripts/gerar-listas-modelo-a.mts`):
  pip3 install pikepdf fonttools
  python3 scripts/gerar-listas-editaveis.py [teamId ...]
Entrada: outputs/listas_modelo_a/<teamId>.html
Saída:   outputs/listas_modelo_a/editaveis/Lista_<teamId>_Modelo_A_editavel.pdf
Sem a Calibri do Office só avança com --permitir-carlito (a regra do CLAUDE.md pede Calibri).
"""
import argparse, json, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path
from urllib.parse import quote
import pikepdf
from pikepdf import Name, Dictionary, Array, String
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
DF = '/Applications/Microsoft %s.app/Contents/Resources/DFonts'
CALIBRI = [(Path(DF % a) / 'Calibri.ttf', Path(DF % a) / 'Calibrib.ttf') for a in ('PowerPoint', 'Word')]
CARLITO = (Path('/usr/share/fonts/truetype/crosextra/Carlito-Regular.ttf'), Path('/usr/share/fonts/truetype/crosextra/Carlito-Bold.ttf'))
CHROMES = [os.environ.get('CHROME', ''), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
           shutil.which('chromium') or '', shutil.which('google-chrome') or '']

INJECT = r'''<style>.lic{min-width:4.9em;text-align:right}</style><script>
addEventListener('load',function(){
  var out=[],sec='',n={};
  function px(e){var r=e.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height}}
  function add(e,kind,base,rowBox){
    var c=getComputedStyle(e),b=px(e);
    if(rowBox){var l=px(e.closest('li'));b.y=l.y;b.h=l.h}
    out.push({name:base,kind:kind,value:e.textContent,box:b,size:parseFloat(c.fontSize),color:c.color});
  }
  add(document.querySelector('h1'),'title','titulo');
  document.querySelectorAll('h2').forEach(function(h,i){
    var tipo=i===0?'jogador':'staff',ul=h.nextElementSibling;
    ul.querySelectorAll('li').forEach(function(li,j){
      var id=tipo+'_'+String(j+1).padStart(2,'0'),num=li.querySelector('.num');
      if(num)add(num,'num',id+'_numero');
      add(li.querySelector('.nm'),'name',id+'_nome',true);
      add(li.querySelector('.lic'),'lic',id+'_licenca',true);
    });
  });
  var pre=document.createElement('pre');pre.id='campos';pre.style.display='none';pre.textContent=JSON.stringify(out);document.body.appendChild(pre);
  // Trava as medidas e retira o texto da base: o texto passa a viver só nos campos.
  var all=[].slice.call(document.querySelectorAll('h1,li,.num,.nm,.lic')),m=all.map(function(e){return e.getBoundingClientRect()});
  all.forEach(function(e,i){e.style.boxSizing='border-box';e.style.width=m[i].width+'px';e.style.height=m[i].height+'px';e.style.flex='none';if(e.tagName!=='LI')e.style.minWidth='0'});
  document.querySelectorAll('h1,.num,.nm,.lic').forEach(function(e){e.textContent=''});
});
</script></body>'''

def fonts(allow_carlito):
    for reg, bold in CALIBRI:
        if reg.exists() and bold.exists():
            return reg, bold, 'Calibri', 'Calibri-Bold'
    if allow_carlito and CARLITO[0].exists():
        print('⚠ Calibri não encontrada: a usar Carlito (só para pré-visualização).')
        return CARLITO[0], CARLITO[1], 'Carlito', 'Carlito-Bold'
    sys.exit('Calibri do Office não encontrada. Corra no Mac com o Office instalado.')

class Font:
    def __init__(self, pdf, path, base):
        t = TTFont(path); self.upm = t['head'].unitsPerEm
        cmap, hmtx = t.getBestCmap(), t['hmtx']
        self.base = base; self.w = {}
        for code in range(32, 256):
            try: ch = bytes([code]).decode('cp1252')
            except UnicodeDecodeError: continue
            g = cmap.get(ord(ch))
            if g: self.w[code] = hmtx[g][0] * 1000 / self.upm
        os2, head = t['OS/2'], t['head']; k = 1000 / self.upm
        self.asc, self.desc = t['hhea'].ascent * k, t['hhea'].descent * k
        self.cap = getattr(os2, 'sCapHeight', 644 * self.upm / 1000) * k
        data = Path(path).read_bytes()
        ff = pdf.make_stream(data); ff[Name.Length1] = len(data)
        desc = pdf.make_indirect(Dictionary(Type=Name.FontDescriptor, FontName=Name('/' + base), Flags=32,
            FontBBox=Array([int(head.xMin * k), int(head.yMin * k), int(head.xMax * k), int(head.yMax * k)]),
            ItalicAngle=0, Ascent=int(self.asc), Descent=int(self.desc), CapHeight=int(self.cap),
            StemV=80, FontFile2=pdf.make_indirect(ff)))
        self.obj = pdf.make_indirect(Dictionary(Type=Name.Font, Subtype=Name.TrueType, BaseFont=Name('/' + base),
            FirstChar=32, LastChar=255, Widths=Array([int(round(self.w.get(c, 0))) for c in range(32, 256)]),
            FontDescriptor=desc, Encoding=Name.WinAnsiEncoding))
    def width(self, enc, size): return sum(self.w.get(c, 0) for c in enc) * size / 1000

def lit(b):
    return b.replace(b'\\', b'\\\\').replace(b'(', b'\\(').replace(b')', b'\\)')

def add_fields(pdf_path, fields, out, reg_path, bold_path, reg_name, bold_name):
    pdf = pikepdf.open(pdf_path)
    if len(pdf.pages) != 1: sys.exit(f'{pdf_path}: esperava 1 página, tem {len(pdf.pages)}')
    F = {'R': Font(pdf, reg_path, reg_name), 'B': Font(pdf, bold_path, bold_name)}
    res = Dictionary(Font=Dictionary(F=F['R'].obj, FB=F['B'].obj))
    page = pdf.pages[0]; mb = [float(v) for v in page.MediaBox]; H = mb[3]; S = mb[2] / (210 / 25.4 * 96)
    annots, flds = [], []
    for f in fields:
        font_key = 'F' if f['kind'] == 'name' else 'FB'; font = F['R'] if font_key == 'F' else F['B']
        b = f['box']; x0, x1 = b['x'] * S, (b['x'] + b['w']) * S; y1 = H - b['y'] * S; y0 = y1 - b['h'] * S
        w, h = x1 - x0, y1 - y0; size = round(f['size'] * S, 2)
        value = f['value'].strip()
        try: enc = value.encode('cp1252')
        except UnicodeEncodeError: sys.exit(f'Carácter sem WinAnsi em: {value}')
        while font.width(enc, size) > w - 1 and size > 4: size = round(size - .1, 2)
        rgb = [int(v) / 255 for v in re.findall(r'\d+', f['color'])[:3]]
        color = '%.3f %.3f %.3f rg' % tuple(rgb)
        q = {'num': 1, 'title': 1, 'lic': 2}.get(f['kind'], 0)
        tw = font.width(enc, size); tx = {0: 1, 1: (w - tw) / 2, 2: w - tw - 1}[q]
        ty = (h - font.cap * size / 1000) / 2
        ap = pdf.make_stream(b'/Tx BMC q BT /%s %.2f Tf %s %.2f %.2f Td (%s) Tj ET Q EMC' % (font_key.encode(), size, color.encode(), tx, ty, lit(enc)))
        ap.update(Dictionary(Type=Name.XObject, Subtype=Name.Form, BBox=Array([0, 0, round(w, 2), round(h, 2)]), Resources=res))
        fd = pdf.make_indirect(Dictionary(Type=Name.Annot, Subtype=Name.Widget, FT=Name.Tx, T=String(f['name']), V=String(value), DV=String(value),
            Rect=Array([round(x0, 2), round(y0, 2), round(x1, 2), round(y1, 2)]), F=4, Q=q,
            DA=String(f'/{font_key} {size} Tf {color}'), AP=Dictionary(N=pdf.make_indirect(ap)), P=page.obj, MK=Dictionary()))
        annots.append(fd); flds.append(fd)
    page.Annots = Array(annots); page.Tabs = Name.R
    pdf.Root.AcroForm = pdf.make_indirect(Dictionary(Fields=Array(flds), DR=res, DA=String('/F 10 Tf 0 g'), NeedAppearances=False))
    pdf.save(out)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('times', nargs='*')
    ap.add_argument('--entrada', default=str(ROOT / 'outputs/listas_modelo_a')); ap.add_argument('--permitir-carlito', action='store_true')
    a = ap.parse_args(); src = Path(a.entrada); dst = src / 'editaveis'; dst.mkdir(exist_ok=True)
    chrome = next((c for c in CHROMES if c and Path(c).exists()), None)
    if not chrome: sys.exit('Chrome não encontrado; defina CHROME=<caminho>.')
    reg, bold, rn, bn = fonts(a.permitir_carlito)
    base = [chrome, '--headless=new', '--disable-gpu', '--allow-file-access-from-files', '--no-pdf-header-footer', '--window-size=794,1123', '--virtual-time-budget=5000']
    if sys.platform.startswith('linux'): base.append('--no-sandbox')
    files = sorted(src.glob('*.html')); files = [f for f in files if not a.times or f.stem in a.times]
    for html in files:
        tmp = Path(tempfile.mkdtemp()); page = html.with_name(f'.{html.stem}.ed.html')
        page.write_text(html.read_text(encoding='utf-8').replace('</body>', INJECT, 1), encoding='utf-8')
        url = 'file://' + quote(str(page))
        dom = subprocess.run(base + ['--dump-dom', url], capture_output=True, text=True, check=True).stdout
        m = re.search(r'<pre id="campos"[^>]*>(.*?)</pre>', dom, re.S)
        if not m: sys.exit(f'{html.name}: campos não medidos')
        import html as H
        fields = json.loads(H.unescape(m.group(1)))
        raw = tmp / 'b.pdf'
        subprocess.run(base + [f'--print-to-pdf={raw}', url], capture_output=True, check=True)
        out = dst / f'Lista_{html.stem}_Modelo_A_editavel.pdf'
        add_fields(raw, fields, out, reg, bold, rn, bn); page.unlink()
        print('✓', out, len(fields), 'campos')

main()
