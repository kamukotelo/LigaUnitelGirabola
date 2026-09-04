"""Extract only the 12 supplied referee PDFs; never writes to the database."""
import hashlib
import json
import re
from pathlib import Path
import pdfplumber

OUT = Path('outputs/relatorios-arbitros-2026-09-03')
OUT.mkdir(parents=True, exist_ok=True)
records = []
for path in sorted(Path('/Users/nsungukamukotelo/Downloads').glob('REFEREE_MATCH_REPORT-*.pdf')):
    no = int(re.search(r'REPORT-(\d+)-', path.name)[1])
    if no not in {7,8,10,11,13,14,15,16,17,18,19} or (no == 18 and '(1)' not in path.name):
        continue
    with pdfplumber.open(path) as pdf:
        pages = [p.extract_text(layout=False) or '' for p in pdf.pages]
        layouts = [p.extract_text(layout=True) or '' for p in pdf.pages]
    suffix = '-copia' if '(1)' in path.name else ''
    stem = f'relatorio-{no}{suffix}'
    (OUT / (stem + '.txt')).write_text('\n\n'.join(f'--- PAGINA {i+1} ---\n{t}' for i,t in enumerate(pages)), encoding='utf-8')
    (OUT / (stem + '-layout.txt')).write_text('\n\n'.join(f'--- PAGINA {i+1} ---\n{t}' for i,t in enumerate(layouts)), encoding='utf-8')
    records.append({'reportNumber':no,'source':str(path),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'textSha256':hashlib.sha256('\n'.join(pages).encode()).hexdigest(),'pages':len(pages),'textFile':stem+'.txt'})
(OUT/'fontes.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(records,ensure_ascii=False,indent=2))
