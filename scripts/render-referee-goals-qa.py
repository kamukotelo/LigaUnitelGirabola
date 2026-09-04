import json
from pathlib import Path
import pdfplumber
root=Path('outputs/relatorios-arbitros-2026-09-03')
qa=Path('tmp/pdfs/referee-qa');qa.mkdir(parents=True,exist_ok=True)
for r in json.loads((root/'levantamento_completo.json').read_text()):
    goals=[t for t in r['tables'] if t['section']=='goals']
    if not goals:continue
    with pdfplumber.open(r['source']['source']) as pdf:
        for pn in {t['page'] for t in goals}:
            ts=[t for t in goals if t['page']==pn]
            top=min(t['bbox'][1] for t in ts)-20
            bottom=max(t['bbox'][3] for t in ts)+5
            pdf.pages[pn-1].crop((45,top,440,bottom)).to_image(resolution=150).save(qa/f'goals-{r["reportNumber"]}-{pn}.png')
