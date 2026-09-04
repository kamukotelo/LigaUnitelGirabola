"""Extract only the seven requested PDFs, preserving source tables for review."""
import json, re, hashlib
from pathlib import Path
import pdfplumber

out = Path('outputs/atualizacao-jornada1-2026-09-03')
out.mkdir(parents=True, exist_ok=True)
records = []
for path in sorted(Path('/Users/nsungukamukotelo/Downloads').glob('REFEREE_MATCH_REPORT-*.pdf')):
    n = int(re.search(r'REPORT-(\d+)-', path.name)[1])
    if n not in range(1, 7) or (n == 1 and not re.search(r'\([12]\)\.pdf$', path.name)):
        continue
    suffix = re.search(r'\((\d)\)\.pdf$',path.name)
    stem = f'report-{n}' + (f'-{suffix[1]}' if suffix else '')
    with pdfplumber.open(path) as pdf:
        pages = [p.extract_text() or '' for p in pdf.pages]
        tables = [{'page':i+1,'bbox':t.bbox,'rows':t.extract()} for i,p in enumerate(pdf.pages) for t in p.find_tables()]
        for i,p in enumerate(pdf.pages):
            p.to_image(resolution=90).save(out/f'{stem}-page-{i+1}.png')
    (out/f'{stem}.txt').write_text('\n\n'.join(pages))
    records.append({'number':n,'source':str(path),'stem':stem,'hash':hashlib.sha256(path.read_bytes()).hexdigest(),'textHash':hashlib.sha256('\n'.join(pages).encode()).hexdigest(),'pages':pages,'tables':tables})
(out/'extracted.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
for r in records:
    print(r['stem'],r['textHash'],len(r['pages']))
    print(r['pages'][0][:1800])
