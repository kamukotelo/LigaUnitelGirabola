"""Source-backed staging export; no network and no database mutations."""
import json, re
from pathlib import Path
import pdfplumber

OUT = Path('outputs/relatorios-arbitros-2026-09-03')
sources = json.loads((OUT/'fontes.json').read_text())
teams = {7:('saosalvador','interclube'),8:('wiliete','lobito'),10:('primeiromaio','dago'),11:('caala','wiliete'),13:('sagrada','saosalvador'),14:('kabuscorp','lundasul'),15:('libolo','bravos'),16:('lobito','petro'),17:('petro','libolo'),18:('desphuila','wiliete'),19:('dago','interclube')}
sections = {'STARTING':'starters','SUBSTITUTES':'bench','GOALS':'goals','SUBSTITUTIONS':'substitutions','CAUTIONS':'cautions','EXPULSIONS':'expulsions'}
def clean(s): return re.sub(r'\s+',' ', s or '').strip()
output=[]
for source in sources:
    if source['reportNumber']==8 and 'copia' not in source['textFile']: continue
    no=source['reportNumber']
    text=(OUT/source['textFile']).read_text()
    stamp=re.search(r'(\d\d)/(\d\d)/(\d{4}) (\d\d:\d\d) \(UTC\+1\)',text)
    d,mo,y,ti=stamp.groups()
    result=re.search(r'(\d+)\s*:\s*(\d+)', text[text.index('HOME TEAM'):])
    ht=re.search(r'(\d+) 1st Period (\d+)',text)
    attendance=re.search(r'Attendance: (\d+)',text)
    rec={'reportNumber':no,'source':source,'homeTeamId':teams[no][0],'awayTeamId':teams[no][1], 'round':int(re.search(r'ROUND (\d+)',text)[1]),'kickoff':f'{y}-{mo}-{d}T{ti}:00+01:00','homeScore':int(result[1]),'awayScore':int(result[2]),'halfTimeHomeScore':int(ht[1]),'halfTimeAwayScore':int(ht[2]),'attendance':int(attendance[1]) if attendance else None,'tables':[],'lineups':{'home':[],'away':[]},'staffText':{},'events':[],'issues':[]}
    current=''
    with pdfplumber.open(source['source']) as pdf:
        for pn,page in enumerate(pdf.pages,1):
            words=page.extract_words()
            headings=[(w['top'], sections[w['text']]) for w in words if w['text'] in sections and w['x0']<100]
            for table in page.find_tables():
                rows=table.extract()
                if not rows or rows[0][0]!='#': continue
                prior=[s for top,s in headings if top<table.bbox[1]]
                section=prior[-1] if prior else current
                side='home' if table.bbox[0]<240 else 'away'
                rec['tables'].append({'page':pn,'section':section,'side':side,'rows':rows,'bbox':table.bbox})
                if section in ('starters','bench'):
                    for row in rows[1:]:
                        if row[0] and not row[0].isdigit():
                            rec['issues'].append(f'Roster row to review p{pn}: {row}'); continue
                        ma=re.search(r'\((\d{6}[MF]\d{2})\)',row[1] or '')
                        rec['lineups'][side].append({'number':int(row[0]) if row[0] else None,'name':clean(re.sub(r'\(\d{6}[MF]\d{2}\)','',row[1] or '')),'maId':ma[1] if ma else None,'isStarter':section=='starters','sourcePage':pn})
            if headings: current=headings[-1][1]
            for side,x0,x1 in [('home',47,235),('away',250,437)]:
                ct=page.crop((x0,100,x1,810)).extract_text() or ''
                start=re.search(r'(?:Head Coach|Team Official|Assistant Coach):',ct)
                if start:
                    rec['staffText'][side]=ct[start.start():].split('GOALS')[0].strip()
            if pn==1:
                rec['officialsText']=page.crop((453,107,590,790)).extract_text()
                rec['headerText']=page.crop((150,40,460,85)).extract_text()
    for table in rec['tables']:
        section,side=table['section'],table['side']
        if section not in ('goals','substitutions','cautions','expulsions'):continue
        lookup={p['number']:p for p in rec['lineups'][side]}
        if section=='substitutions':
            entries=[]
            for row in table['rows'][1:]:
                nums=re.findall(r'\d+',row[0] or '')
                for num in nums: entries.append((int(num),row[3],row[1]))
            if len(entries)%2:rec['issues'].append(f'Odd substitutions count p{table["page"]}')
            for i in range(0,len(entries)-1,2):
                a,b=entries[i:i+2]
                minute=a[1] or b[1]
                if a[0] not in lookup or b[0] not in lookup: rec['issues'].append(f'Unresolved sub {a} {b}');continue
                rec['events'].append({'type':'sub','teamSide':side,'minuteLabel':minute,'player':lookup[a[0]]['name'],'playerMaId':lookup[a[0]]['maId'],'playerNumber':a[0],'playerOut':lookup[b[0]]['name'],'playerOutMaId':lookup[b[0]]['maId'],'playerOutNumber':b[0],'sourcePage':table['page']})
        else:
            for row in table['rows'][1:]:
                if not row[0] or not row[0].isdigit():continue
                num=int(row[0]);p=lookup.get(num)
                if not p:rec['issues'].append(f'Offender not in roster {side} #{num} p{table["page"]}')
                rec['events'].append({'type':{'goals':'goal','cautions':'yellow','expulsions':'red'}[section],'teamSide':side,'minuteLabel':row[3],'player':p['name'] if p else clean(row[1]),'playerMaId':p['maId'] if p else None,'playerNumber':num,'sourcePage':table['page'],'sourceDescription':clean(row[1]),'sourceType':row[2]})
    for e in rec['events']:
        nums=re.findall(r'\d+',e['minuteLabel'] or '')
        e['minute']=int(nums[0]) if nums else None
        e['addedTime']=int(nums[1]) if len(nums)>1 else 0
    output.append(rec)
    print('Extracted',no,flush=True)
(OUT/'levantamento_completo.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for r in output:print(r['reportNumber'],r['homeTeamId'],r['awayTeamId'],r['homeScore'],r['awayScore'],'lineups',[len(v) for v in r['lineups'].values()],'events',len(r['events']),'issues',r['issues'])
