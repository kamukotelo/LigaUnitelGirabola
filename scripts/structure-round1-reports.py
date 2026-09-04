import json,re
from pathlib import Path
import pdfplumber
root=Path('outputs/atualizacao-jornada1-2026-09-03')
raw=json.loads((root/'extracted.json').read_text())
stripdate=lambda s:re.sub(r'Report Date: [^\n]+','',s)
assert stripdate('\n'.join(raw[0]['pages']))==stripdate('\n'.join(raw[1]['pages']))
meta={
1:('m27-1-4','lundasul','petro','Estádio Sagrada Esperança', ['Miguel Tchissingui Augusto Américo','João Manuel Fula António','Nery Domingos Pereira Amador da Silva','Isaías Justino Camaxi']),
2:('m27-1-2','bravos','sagrada','Estádio do Mundunduleno', ['Sanda Mateus Miguel Kitu','Natarino António Soares','Nelson Lutumba Quiala','Custódio Roque Lote']),
3:('m27-1-7','cabinda','libolo','Campo Vice António', ['Nelson João Milagre','Manuel Daniel Coelho','Hélder João Milagre','Laurindo Feliciano Aureleo']),
4:('m27-1-3','dago','desphuila','Estádio França Ndalu', ['Edilson Roberto Gomes André','Manuel Luís Benguela','Joaquim Manuel Chiyo','Miguel Julião Mateus']),
5:('m27-1-1','fcluanda','caala','Estádio França Ndalu', ['Gilberto Bernardino Kativa','Estanislau Guedes Tavares Muluta Prata','Jeremias Sessenta Cafussa','Aldair Quissanga Rodrigues Carmelino']),
6:('m27-1-6','primeiromaio','kabuscorp','Campo Municipal (Benguela)', ['Bernardo Hossi Nangolo','António Emiliano Livongue','Adolfo Luís Mutenha','António Caluassi Dungula'])}
# Events reviewed against the referee tables: (side, minute label, shirt in/player, shirt out).
subs={
1:[('h','45',7,10),('h','65',34,27),('h','65',17,20),('h','73',26,11),('h','73',33,7),('a','45',33,7),('a','60',27,25),('a','60',11,10),('a','73',29,26),('a','73',23,8)],
2:[('h','45',10,7),('h','45','ANTONIO JOSE',31),('h','60',28,23),('h','75',15,8),('h','88',17,19),('a','45',11,7),('a','45',8,32),('a','69',18,16)],
3:[('h','27',23,18),('h','56',15,3),('h','66',7,23),('a','70',22,17),('a','76',25,6),('a','76',24,5),('a','76',15,8),('a','85',19,10)],
4:[('h','60',14,9),('h','60',28,11),('h','60',8,3),('h','90+5',20,7),('a','6',6,10),('a','55',8,21),('a','55',27,18),('a','68',7,25),('a','78',29,32)],
5:[('h','63',24,23),('h','63',7,30),('h','81',14,16),('h','81',27,25),('h','87',9,10),('a','5',27,20),('a','65',24,7),('a','65',4,10),('a','79',6,19),('a','79',17,9)],
6:[('h','69',20,19),('h','69',8,14),('h','69',34,16),('h','86',25,22),('h','90+1',31,20),('a','46',17,3),('a','59',19,29),('a','59',32,15),('a','73',11,7),('a','80',27,10)]}
goals={1:[],2:[('h','23',8),('h','33',23),('h','78',28)],3:[('a','34',27),('a','68',27),('a','74',10)],4:[('h','90+1',17)],5:[],6:[('h','21',14),('a','65',18)]}
yellow={1:[('h','28',10),('h','37',6),('h','86',16),('h','90+5',28),('a','53',12),('a','63',27),('a','76',13)],2:[('h','49',8),('h','86',27),('a','6',32),('a','48',5),('a','51',16)],3:[('h','14',5),('h','55',16)],4:[('h','30',17),('h','40',3),('h','87',15),('a','52',13)],5:[('a','40',23)],6:[('h','46',9),('h','70',22),('a','45+1',15),('a','45+2',5),('a','45+3',2),('a','73',32)]}
results=[]
for r in raw:
    if r['stem']=='report-1-1':continue
    n=r['number'];mid,home,away,stadium,officials=meta[n]
    text='\n'.join(r['pages']);d,m,y,ti=re.search(r'(\d\d)/(\d\d)/(\d{4}) (\d\d:\d\d)',text).groups()
    score=re.search(r'(\d+) : (\d+)',text);ht=re.search(r'(\d+) 1st Period (\d+)',text)
    attendance=re.search(r'Attendance: (\d+)',text)
    rec={'matchId':mid,'report':n,'source':r['source'],'home':home,'away':away,'date':f'{y}-{m}-{d}T{ti}:00+01:00','stadium':stadium,'homeScore':int(score[1]),'awayScore':int(score[2]),'halfTimeScore':f'{ht[1]}-{ht[2]}','officials':officials,'lineups':{'home':[],'away':[]},'events':[]}
    if attendance:rec['attendance']=int(attendance[1])
    current=''
    with pdfplumber.open(r['source']) as pdf:
        for p in pdf.pages:
            headings=[(w['top'],w['text']) for w in p.extract_words() if w['text'] in ['STARTING','SUBSTITUTES','GOALS','SUBSTITUTIONS','CAUTIONS','EXPULSIONS'] and w['x0']<100]
            for t in p.find_tables():
                rows=t.extract()
                if rows[0][0]!='#':continue
                prior=[s for top,s in headings if top<t.bbox[1]];section=prior[-1] if prior else current
                if section not in ['STARTING','SUBSTITUTES']:continue
                side='home' if t.bbox[0]<240 else 'away'
                for row in rows[1:]:
                    ma=re.search(r'\((\d{6}[MF]\d{2})\)',row[1] or '')
                    assert ma,(n,row)
                    rec['lineups'][side].append({'number':int(row[0]) if row[0] else 0,'name':re.sub(r'\s+',' ',re.sub(r'\(\d{6}[MF]\d{2}\)','',row[1])).strip(),'maId':ma[1],'isStarter':section=='STARTING'})
            if headings:current=headings[-1][1]
    def lookup(side,num):
        a=[p for p in rec['lineups'][side] if (p['number']==num if isinstance(num,int) else p['name']==num)]
        assert len(a)==1,(n,side,num)
        return a[0]
    for typ,entries in [('goal',goals[n]),('yellow',yellow[n]),('sub',subs[n])]:
        for side,minute,num,*out in entries:
            side='home' if side=='h' else 'away';p=lookup(side,num)
            e={'type':typ,'team_side':side,'minute':int(minute.split('+')[0]),'minuteLabel':minute,'player':p['name'],'maId':p['maId'],'detail':f"Relatório do árbitro · {minute}'"}
            if out:
                po=lookup(side,out[0]);e['player_out']=po['name'];e['outMaId']=po['maId']
            rec['events'].append(e)
    assert len(goals[n])==rec['homeScore']+rec['awayScore']
    rec['events'].sort(key=lambda e:(e['minute'],int(e['minuteLabel'].split('+')[-1]) if '+' in e['minuteLabel'] else 0))
    results.append(rec)
    print(n,mid,rec['homeScore'],rec['awayScore'],[sum(p['isStarter'] for p in a) for a in rec['lineups'].values()],len(rec['events']))
(root/'validated.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
