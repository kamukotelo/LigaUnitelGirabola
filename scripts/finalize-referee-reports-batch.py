"""Build a reviewed staging dataset, never an executable database import.

Run after extract-referee-reports-batch.py and structure-referee-reports-batch.py.
Manual corrections below are tied to visually reviewed source pages.
"""
import copy
import json
import re
from collections import Counter
from pathlib import Path

OUT = Path('outputs/relatorios-arbitros-2026-09-03')
MA = re.compile(r'\((\d{6}[MF]\d{2})\)')
IDS = {7:'m27-1-8',8:'m27-1-5',10:'m27-2-7',11:'m27-2-1',13:'m27-2-4',14:'m27-2-2',15:'m27-2-6',16:'m27-2-8',17:'m27-3-7',18:'m27-3-2',19:'m27-3-6'}
NAMES = {'saosalvador':'São Salvador','interclube':'Interclube','wiliete':'Wiliete','lobito':'Académica do Lobito','primeiromaio':'1.º de Maio','dago':'1.º de Agosto','caala':'Caála','sagrada':'Sagrada Esperança','kabuscorp':'Kabuscorp','lundasul':'Lunda Sul','libolo':'Libolo','bravos':'Bravos do Maquis','petro':'Petro','desphuila':'Desportivo da Huíla'}
ROLES = ['Team Official','Head Coach','Assistant Coach','Team Manager','Assistant Manager','Physical Trainer','Technical secretary','Doctor','GK Coach','Kit Manager','Massage Therapist','Physiotherapist','Team Medic','Team Staff']
ROLE_RE = re.compile(r'^('+'|'.join(ROLES)+r'): ', re.M)
OFFICIAL_RE = re.compile(r'^(Referee|1st Assistant referee|2nd Assistant referee|Fourth official|Match commissioner):\s*', re.M)

def clean(text):
    return re.sub(r'\s+', ' ', text).strip()

def people(text, pattern):
    matches = list(pattern.finditer(text))
    result = []
    for i, match in enumerate(matches):
        body = text[match.end():matches[i+1].start() if i+1<len(matches) else len(text)]
        identity = MA.search(body)
        # Right-column staff crops continue into event tables; stop at the ID.
        if identity:
            body = body[:identity.end()]
        result.append({'roleAsPrinted':match[1], 'nameAsPrinted':clean(MA.sub('',body)).rstrip(' -'), 'maId':identity[1] if identity else None, 'sourceText':clean(body), 'needsReview':identity is None or '…' in body})
    return result

raw = json.loads((OUT/'levantamento_completo.json').read_text())
sources = json.loads((OUT/'fontes.json').read_text())
matches = copy.deepcopy(raw)
checks = []
for m in matches:
    no = m['reportNumber']
    text = (OUT/m['source']['textFile']).read_text()
    m['candidateMatchId'] = IDS[no]
    m['matchMappingStatus'] = 'candidate_from_local_seed_not_checked_in_live_database'
    m['externalMatchId'] = None
    m['seasonId'] = '2026-27'
    m['status'] = 'finished'
    m['homeTeamName'] = NAMES[m['homeTeamId']]
    m['awayTeamName'] = NAMES[m['awayTeamId']]
    m['venueAsPrinted'] = clean(m['headerText'].split('Africa/Luanda · ')[1].split('Attendance:')[0])
    m['stadiumAsPrinted'] = m['venueAsPrinted'].split(',')[0]
    m['kickoffMeaning'] = 'header_time_as_printed_not_verified_actual_start'
    m['attendanceAsPrinted'] = m['attendance']
    m['attendanceStatus'] = 'recorded_in_source' if m['attendance'] is not None else 'not_provided'
    m['issues'] = []
    m['reviewNotes'] = []
    m['staff'] = {side:people(value, ROLE_RE) for side,value in m.pop('staffText').items()}
    m['officials'] = people(m['officialsText'].split('\nTIME')[0], OFFICIAL_RE)
    m['periodTimesAsPrinted'] = m['officialsText'].split('\nTIME\n')[1].split('\nLEGEND')[0]
    del m['officialsText']
    m['matchNotesAsPrinted'] = re.sub(r'\nPage \d+ / \d+\s*$', '',text.split('MATCH NOTES\n',1)[1]).strip()
    m['matchNotesSourcePage'] = 3
    m['staffDisciplinaryEvents'] = []
    for side, roster in m['lineups'].items():
        for p in roster:
            p['dateOfBirth'] = None
            p['position'] = None
            p['isCaptain'] = None
            p['minutesPlayed'] = None
            if p['number'] is None:
                m['issues'].append({'field':f'lineups.{side}.{p["maId"]}.number','reason':'Número de camisola ausente na ficha; não inferido.'})
    if no == 15:
        m['events'] = [e for e in m['events'] if not (e['type']=='sub' and e['teamSide']=='away')]
        roster = {p['number']:p for p in m['lineups']['away'] if p['number'] is not None}
        bruno = next(p for p in m['lineups']['away'] if p['maId']=='000772M98')
        for entered,left,minute,added in [(bruno,roster[26],46,0),(roster[28],roster[23],68,0),(roster[31],roster[19],82,0),(roster[32],roster[8],90,2)]:
            m['events'].append({'type':'sub','teamSide':'away','minute':minute,'addedTime':added,'minuteLabel':f"{minute}'"+(f"(+{added}')" if added else ''),'player':entered['name'],'playerMaId':entered['maId'],'playerNumber':entered['number'],'playerOut':left['name'],'playerOutMaId':left['maId'],'playerOutNumber':left['number'],'sourcePage':2,'extractionNote':'Par entra/sai conferido visualmente; camisola de Bruno não consta no PDF.'})
        m['reviewNotes'].append('Quatro substituições dos Bravos recompostas a partir da tabela visual da página 2, sem inventar o número de Bruno Trindade.')
    for index,e in enumerate(m['events'],1):
        e['localEventKey'] = f'report-{no}-event-{index}'
        e['reviewStatus'] = 'recorded_in_source'
        if e['type']=='goal':
            own = (no==13 and e['playerMaId']=='001937M02' and e['minute']==64) or (no==15 and e['playerMaId']=='003692M98' and e['minute']==85)
            e['isOwnGoal'] = own
            e['playerTeamSide'] = e['teamSide']
            e['creditedTeamSide'] = ('away' if e['teamSide']=='home' else 'home') if own else e['teamSide']
            e['countsForIndividualScorer'] = not own
            e['penaltyStatus'] = 'not_encoded_in_this_export'
            if own:
                e['type'] = 'own_goal'
                e['extractionNote'] = 'Símbolo de autogolo conferido visualmente no PDF, página 2.'
        if e['type']=='red':
            e['dismissalSubtype'] = None
            m['issues'].append({'field':e['localEventKey']+'.dismissalSubtype','reason':'Expulsão registada; confirmar se vermelho direto ou segundo amarelo antes de calcular disciplina detalhada.'})
        if no==19 and e['type']=='sub' and e['teamSide']=='away' and e['minute']==90 and e['addedTime']==2:
            e['reviewStatus'] = 'pending_confirmation'
            m['issues'].append({'field':e['localEventKey'],'reason':'Afonso Baptista (#36) sai aos 64 minutos e aparece a reentrar aos 90+2. Confirmar identidade do jogador que entrou; não publicar esta substituição automaticamente.'})
    if no==11:
        m['attendance'] = None
        m['attendanceStatus'] = 'pending_confirmation'
        m['issues'].append({'field':'attendance','reason':'A ficha indica literalmente 8 espectadores. Valor original preservado; valor para inserção suspenso até confirmação.'})
        m['issues'].append({'field':'periodTimesAsPrinted','reason':'Bloco TIME indica 04:00/05:03, incompatível com o cabeçalho 16:00. Não usar para calcular minutos.'})
    if no==7:
        m['reviewNotes'].append('Notas referem início com quatro minutos de atraso; cabeçalho e bloco TIME registam 15:00. Hora efetiva não inferida.')
        m['issues'].append({'field':'stadiumAsPrinted','reason':'PDF: Campo Vice António, Camabatela; seed local: Estádio Álvaro Buta. Confirmar antes de substituir o local no portal.'})
    if no in (10,11):
        m['issues'].append({'field':'stadiumAsPrinted','reason':'Designação do estádio no PDF difere da seed local; confirmar correspondência antes de atualizar o portal.'})
    if no==16:
        m['issues'].append({'field':'kickoff','reason':'PDF indica 16:00 (UTC+1); seed local indica 15:30 (UTC+1). Confirmar antes de substituir.'})
    if no==14:
        m['staffDisciplinaryEvents'] = [
            {'type':'yellow','teamSide':'away','minute':60,'nameAsPrinted':'Vanderlei Muaximbumba','maIdAsPrintedInNotes':'003005M90','candidateRosterMaId':'003805M90','reviewStatus':'pending_identity_confirmation','sourcePage':3},
            {'type':'yellow','teamSide':'away','minute':74,'nameAsPrinted':'Domingos dos Santos','maIdAsPrintedInNotes':'001200M70','candidateRosterMaId':'001200M70','reviewStatus':'recorded_in_source','sourcePage':3}]
        m['issues'].append({'field':'staffDisciplinaryEvents[0]','reason':'Advertência a Vanderlei aos 60 minutos: licença 003005M90 nas notas difere de 003805M90 no plantel técnico. Confirmar identidade.'})
    for side,staff in m['staff'].items():
        for i,p in enumerate(staff):
            if p['needsReview']:
                m['issues'].append({'field':f'staff.{side}[{i}]','reason':'Nome/licença truncado no PDF; preservar texto e confirmar identificação.'})
    for i,p in enumerate(m['officials']):
        if p['needsReview']:
            m['issues'].append({'field':f'officials[{i}]','reason':'Nome truncado no PDF; não completar por suposição.'})
    m['events'].sort(key=lambda e:(e['minute'],e['addedTime'],e['localEventKey']))
    m['publicationStatus'] = 'staging_requires_mapping_and_review'
    score = Counter(e['creditedTeamSide'] for e in m['events'] if e['type'] in ('goal','own_goal'))
    half = Counter(e['creditedTeamSide'] for e in m['events'] if e['type'] in ('goal','own_goal') and e['minute']<=45)
    assert [score['home'],score['away']] == [m['homeScore'],m['awayScore']], (no,score)
    assert [half['home'],half['away']] == [m['halfTimeHomeScore'],m['halfTimeAwayScore']], (no,half)
    assert len(m['officials'])==5, no
    for side,roster in m['lineups'].items():
        assert sum(p['isStarter'] for p in roster)==11, (no,side)
        ma_ids = [p['maId'] for p in roster]
        assert None not in ma_ids and len(ma_ids)==len(set(ma_ids)), (no,side,'identity')
        shirts = [p['number'] for p in roster if p['number'] is not None]
        assert len(shirts)==len(set(shirts)), (no,side,'jersey')
        active={p['maId'] for p in roster if p['isStarter']}
        used=set(active)
        for e in m['events']:
            if e['teamSide']!=side: continue
            assert e['playerMaId'] in ma_ids, (no,e)
            if e['type']=='sub':
                assert e['playerOutMaId'] in ma_ids, (no,e)
                if e['reviewStatus']=='pending_confirmation': continue
                assert e['playerOutMaId'] in active and e['playerMaId'] not in used, (no,e,'invalid substitution')
                active.remove(e['playerOutMaId']); active.add(e['playerMaId']); used.add(e['playerMaId'])
            elif e['type']=='red': active.discard(e['playerMaId'])
    checks.append({'reportNumber':no,'fullTimeGoalsReconciled':True,'halfTimeGoalsReconciled':True,'startingElevenBothTeams':True,'playerIdentitiesUniqueWithinTeam':True,'substitutionSequenceValidExceptFlagged':True,'officialsCount':len(m['officials'])})

matches.sort(key=lambda m:m['reportNumber'])
counts = Counter(e['type'] for m in matches for e in m['events'])
package = {
    'schemaVersion':'referee-report-staging/1.0',
    'purpose':'Levantamento para revisão e posterior inserção; não é payload do importador FCMS.',
    'databaseModified':False,
    'competition':'Liga Unitel Girabola', 'season':'2026/2027',
    'sourceFiles':sources,
    'deduplication':{'reportNumber':8,'selected':'cópia (1), relatório gerado às 16:56','reason':'Conteúdo desportivo igual; outra versão gerada às 16:53. Não contar duas vezes.'},
    'limitations':[
        'Dados extraídos das fichas fornecidas. Não verificados contra base de dados de produção.',
        'reportNumber é número da ficha, não é o ID FCMS. candidateMatchId é apenas correspondência proposta à seed local.',
        'Ficheiro completo de preparação, NÃO importar diretamente em /api/fcms/sync: esse contrato não suporta plantéis, autogolos, arbitragem, equipa técnica e todos os campos aqui incluídos.',
        'Não calcular classificação completa com este lote parcial. Não preencher ausências com zero.',
        'Funções técnicas e nomes preservam a ficha, sem aplicar correções de outras mensagens ou épocas.',
        'Datas de nascimento, posições, capitães, minutos individuais, penáltis e assistências não foram codificados. Identificadores MA não são prova de data de nascimento.',
        'Não divulgar licenças individuais nem notas integrais automaticamente no portal público. São dados de preparação administrativa.',
        'Tabelas originais e texto extraído mantidos para auditoria; valores estruturados revistos prevalecem sobre a extração bruta.'
    ],
    'summary':{'pdfFiles':len(sources),'distinctMatches':len(matches),'rosterEntries':sum(len(r) for m in matches for r in m['lineups'].values()),'eventsByType':dict(counts),'staffCautions':sum(len(m['staffDisciplinaryEvents']) for m in matches),'flaggedItems':sum(len(m['issues']) for m in matches)},
    'matches':matches,
    'validation':checks,
}
(OUT/'dados_para_insercao_REVISAR.json').write_text(json.dumps(package,ensure_ascii=False,indent=2)+'\n')
(OUT/'validacao.json').write_text(json.dumps({'summary':package['summary'],'checks':checks},ensure_ascii=False,indent=2)+'\n')

lines = ['# Levantamento dos relatórios de arbitragem','',
    '12 PDFs recebidos, 11 jogos distintos. A ficha 8 foi enviada em duas versões com os mesmos dados desportivos. Nenhuma alteração foi feita na base de dados.', '',
    '## Como utilizar','',
    'O ficheiro `dados_para_insercao_REVISAR.json` é a base completa de preparação. NÃO é compatível diretamente com o importador FCMS atual. Confirmar mapeamentos e pendências antes de converter para o formato de inserção. Não executar os textos SQL existentes do projeto para carregar este lote sem adaptação.', '',
    'Contém resultados, intervalos, horários, locais, convocados, titulares, suplentes, golos/autogolos, cartões, substituições, equipa técnica, arbitragem, assistência e notas. As funções técnicas são as impressas no PDF, não correções de mensagens anteriores.', '',
    'Identificadores individuais servem para conciliação administrativa. Não publicar as licenças ou as notas integrais automaticamente.', '',
    '## Resultados','',
    '| Ficha | Jornada | Data/hora de Luanda | Jogo | Resultado | Intervalo |',
    '|---|---|---|---|---|---|']
for m in matches:
    lines.append(f"| {m['reportNumber']} | {m['round']} | {m['kickoff'][:16].replace('T',' ')} | {m['homeTeamName']} – {m['awayTeamName']} | {m['homeScore']}–{m['awayScore']} | {m['halfTimeHomeScore']}–{m['halfTimeAwayScore']} |")
lines += ['', '## Validação e limites','',
    f"{package['summary']['rosterEntries']} entradas de convocados (não jogadores únicos). Eventos: {dict(counts)}; mais 2 advertências a membros da equipa técnica.", '',
    'Verificados: onze titulares por equipa, identidades e camisolas sem duplicações dentro de cada equipa, soma dos golos igual ao resultado final e ao intervalo, cinco oficiais por jogo e sequência de substituições, exceto a reentrada de Afonso Baptista já sinalizada.', '',
    'Autogolos: Augusto Fecayamale (São Salvador), 64’, a favor do Sagrada; Marcos Benua (Libolo), 85’, a favor dos Bravos. Não contam para os melhores marcadores. O golo de Libolo–Bravos não é atribuído a Higino Kaptingo nesta ficha.', '',
    'Não foram calculados minutos individuais, idades/sub-18, classificação completa nem estatísticas de guarda-redes. Não foram codificados capitães, posições, assistências ou penáltis. Os nomes truncados mantêm a indicação de revisão.', '',
    '## Pendências antes da inserção','']
for m in matches:
    if m['issues']:
        lines.append(f"### Ficha {m['reportNumber']} — {m['homeTeamName']}–{m['awayTeamName']}")
        lines.append('')
        lines.extend(f"- {issue['reason']} (`{issue['field']}`)" for issue in m['issues'])
        lines.append('')
lines += ['## Fontes e reprodução','',
    'Os caminhos, resumos SHA-256 e versões constam de `fontes.json`. Cada evento e convocado tem página de origem. A ficha 8 selecionada é a versão (1), gerada às 16:56. Os PDFs originais não foram alterados.', '',
    'Processo: extração textual e de tabelas → inspeção visual dos golos e anomalias → estruturação revista → validações automáticas. Scripts: `extract-referee-reports-batch.py`, `structure-referee-reports-batch.py`, `render-referee-goals-qa.py`, `finalize-referee-reports-batch.py`.', '',
    'Os ficheiros `levantamento_completo.json` e `relatorio-*.txt` são extrações brutas de auditoria, NÃO versões para inserção; usar a base revista acima.', '']
(OUT/'LEIA-ME.md').write_text('\n'.join(lines))

details = ['# Dados levantados por jogo','', 'Consulta administrativa; usar em conjunto com LEIA-ME.md. Não é uma lista de alterações já aplicadas.', '']
labels={'goal':'Golo','own_goal':'Autogolo','sub':'Substituição','yellow':'Amarelo','red':'Vermelho'}
for m in matches:
    details += [f"## Ficha {m['reportNumber']} — {m['homeTeamName']} {m['homeScore']}–{m['awayScore']} {m['awayTeamName']}", '',
        f"Jornada {m['round']} · {m['kickoff']} · Intervalo {m['halfTimeHomeScore']}–{m['halfTimeAwayScore']}", '',
        f"Local conforme ficha: {m['venueAsPrinted']}. Assistência original: {m['attendanceAsPrinted'] if m['attendanceAsPrinted'] is not None else 'não indicada'}.", '',
        f"Fonte: [{Path(m['source']['source']).name}](<{m['source']['source']}>)", '',
        '### Ocorrências','']
    for e in m['events']:
        team=m[e['teamSide']+'TeamName']
        description=f"entra {e['player']}; sai {e['playerOut']}" if e['type']=='sub' else e['player']
        if e['type']=='own_goal':description+=f"; beneficia {m[e['creditedTeamSide']+'TeamName']}"
        pending=' — PENDENTE DE CONFIRMAÇÃO' if e['reviewStatus']=='pending_confirmation' else ''
        details.append(f"- {e['minuteLabel']} · {team} · {labels[e['type']]}: {description} (p. {e['sourcePage']}){pending}")
    for e in m['staffDisciplinaryEvents']:
        details.append(f"- {e['minute']}' · {m[e['teamSide']+'TeamName']} · Amarelo a membro técnico: {e['nameAsPrinted']} (p. 3; {e['reviewStatus']}).")
    for side in ('home','away'):
        details += ['',f"### Convocados — {m[side+'TeamName']}",'','| Camisola | Nome | MA | Condição |','|---|---|---|---|']
        details += [f"| {p['number'] if p['number'] is not None else 'Não indicada'} | {p['name']} | {p['maId']} | {'Titular' if p['isStarter'] else 'Suplente'} |" for p in m['lineups'][side]]
        details += ['', 'Equipa técnica (função conforme a ficha):','']
        details += [f"- {p['roleAsPrinted']}: {p['sourceText']}" for p in m['staff'][side]]
    details += ['', '### Arbitragem','']
    details += [f"- {p['roleAsPrinted']}: {p['sourceText']}" for p in m['officials']]
    details += ['', '### Notas da ficha','',m['matchNotesAsPrinted'],'']
(OUT/'DADOS_POR_JOGO.md').write_text('\n'.join(details))
print(json.dumps(package['summary'],ensure_ascii=False,indent=2))
print('Todas as validações passaram; pendências preservadas e assinaladas.')
