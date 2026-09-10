#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "src/lib/generated-2025-26-data.json"
OUTPUT_FILE = ROOT / "src/lib/historical-results-2025-26.ts"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)
GOALKEEPERS_INFO = {'hugo-marques': ('hugo-marques', 'Hugo Marques', 'Petro de Luanda', 'petro'), 'titi': ('titi', 'Titi', 'Wiliete Sport Clube', 'wiliete'), 'neblu': ('neblu', 'Neblú', '1.º de Agosto', 'dago'), 'ndulo-huila': ('ndulo-huila', 'Ndulo', 'Desportivo da Huíla', 'desphuila'), 'augusto-kabuscorp': ('augusto-kabuscorp', 'Augusto Mualucano', 'Kabuscorp do Palanca', 'kabuscorp'), 'nathan-bravos': ('nathan-bravos', 'Nathan', 'Bravos do Maquis', 'bravos'), 'rui-interclube': ('rui-interclube', 'Rui', 'Interclube', 'interclube'), 'cacusso': ('cacusso', 'Kacusso', 'Desportivo da Lunda-Sul', 'lundasul'), 'antonio-primeiromaio': ('antonio-primeiromaio', 'António Pascoal', 'Estrela 1.º de Maio', 'primeiromaio'), 'leonardo-sagrada': ('leonardo-sagrada', 'Leonardo', 'Sagrada Esperança', 'sagrada'), 'simao-saosalvador': ('simao-saosalvador', 'Simão', 'São Salvador do Kongo', 'saosalvador'), 'guilherme-lobito': ('guilherme-lobito', 'Guilherme', 'Académica do Lobito', 'lobito'), 'beny-libolo': ('beny-libolo', 'Beny', 'Recreativo do Libolo', 'libolo'), 'ludiakueno': ('ludiakueno', 'Ludiakueno', 'Luanda City', 'luanda-city'), 'paulo-guelson': ('paulo-guelson', 'Paulo', 'Guelson FC', 'guelson'), 'miguel-redonda': ('miguel-redonda', 'Miguel', 'Redonda FC', 'redonda')}

matches = data["matches"]
match_stats = data["matchStats"]
match_events = data["matchEvents"]
scorers = data["scorers"]
assists = data["assists"]
clean_sheets = data["cleanSheets"]

# Prepare TypeScript content
lines = []
lines.append("import type { Match, MatchTeamStats, MatchEventDetail, CleanSheetRecord } from './data';")
lines.append("")
lines.append("type TeamInfo = { name: string; stadium: string };")
lines.append("")
lines.append("const TEAMS: Record<string, TeamInfo> = {")
lines.append("  'interclube': { name: 'Grupo Desportivo Interclube', stadium: 'Estádio 22 de Junho' },")
lines.append("  'kabuscorp': { name: 'Kabuscorp Sport Clube do Palanca', stadium: 'Estádio dos Coqueiros' },")
lines.append("  'bravos': { name: 'Futebol Clube Bravos do Maquis', stadium: 'Estádio Mundunduleno' },")
lines.append("  'primeiromaio': { name: 'Estrela Clube Primeiro de Maio', stadium: 'Estádio de São Filipe' },")
lines.append("  'libolo': { name: 'Clube Recreativo e Desportivo do Libolo', stadium: 'Estádio Municipal de Calulo' },")
lines.append("  'luanda-city': { name: 'Luanda City Football Club', stadium: 'Estádio dos Coqueiros' },")
lines.append("  'lobito': { name: 'Académica Petróleos Clube do Lobito', stadium: 'Estádio do Buraco' },")
lines.append("  'desphuila': { name: 'Clube Desportivo da Huíla', stadium: 'Estádio da Tundavala' },")
lines.append("  'saosalvador': { name: 'São Salvador do Kongo Futebol Clube', stadium: 'Estádio Álvaro Buta' },")
lines.append("  'redonda': { name: 'Redonda Futebol Clube', stadium: 'A confirmar' },")
lines.append("  'wiliete': { name: 'Wiliete Sport Clube', stadium: 'Estádio Nacional de Ombaka' },")
lines.append("  'guelson': { name: 'Recreativo Social Desportivo Guelson Futebol Clube', stadium: 'A confirmar' },")
lines.append("  'dago': { name: 'Clube Desportivo 1.º de Agosto', stadium: 'Estádio França Ndalu' },")
lines.append("  'lundasul': { name: 'Clube Desportivo da Lunda-Sul', stadium: 'Estádio das Mangueiras' },")
lines.append("  'sagrada': { name: 'Clube Desportivo Sagrada Esperança', stadium: 'Estádio Sagrada Esperança' },")
lines.append("  'petro': { name: 'Atlético Petróleos de Luanda', stadium: 'Estádio 11 de Novembro' },")
lines.append("};")
lines.append("")

# Build matches array
lines.append("// 240 jogos oficiais do Girabola 2025/2026 com resultados, intervalos, assistências, tempo útil e árbitros.")
lines.append("export const HISTORICAL_MATCHES_2025_26: Match[] = [")
for m in matches:
    h_name = f"TEAMS['{m['homeTeamId']}'].name"
    a_name = f"TEAMS['{m['awayTeamId']}'].name"
    stad = f"TEAMS['{m['homeTeamId']}'].stadium"
    score_str = f"{m['homeScore']}-{m['awayScore']}"
    lines.append("  {")
    lines.append(f"    id: '{m['id']}',")
    lines.append(f"    round: {m['round']},")
    lines.append(f"    homeTeamId: '{m['homeTeamId']}',")
    lines.append(f"    awayTeamId: '{m['awayTeamId']}',")
    lines.append(f"    homeTeam: {h_name},")
    lines.append(f"    awayTeam: {a_name},")
    lines.append(f"    homeScore: {m['homeScore']},")
    lines.append(f"    awayScore: {m['awayScore']},")
    lines.append(f"    score: '{score_str}',")
    lines.append(f"    halfTimeScore: '{m['halfTimeScore']}',")
    lines.append(f"    date: '{m['date']}T15:00:00+01:00',")
    lines.append(f"    stadium: {stad},")
    lines.append(f"    status: 'finished',")
    lines.append(f"    scheduleStatus: 'official',")
    lines.append(f"    attendance: {m['attendance']},")
    lines.append(f"    usefulTimeMinutes: {m['usefulTimeMinutes']},")
    lines.append(f"    referee: '{m['referee']}',")
    lines.append(f"    broadcaster: '{m['broadcaster']}',")
    lines.append("  },")
lines.append("];")
lines.append("")

# Build matchStats record
lines.append("// Estatísticas oficiais por jogo da época 2025/2026 (posse, remates, cantos, faltas, cartões, passes, defesas).")
lines.append("export const HISTORICAL_MATCH_STATS_2025_26: Record<string, { home: Partial<MatchTeamStats>; away: Partial<MatchTeamStats>; keys: (keyof MatchTeamStats)[] }> = {")
for mid, s in match_stats.items():
    home_json = json.dumps(s["home"])
    away_json = json.dumps(s["away"])
    keys_json = json.dumps(s["keys"])
    lines.append(f"  '{mid}': {{ home: {home_json}, away: {away_json}, keys: {keys_json} }},")
lines.append("};")
lines.append("")

# Build matchEvents record
lines.append("// Eventos de golos por jogo da época 2025/2026.")
lines.append("export const HISTORICAL_MATCH_EVENTS_2025_26: Record<string, MatchEventDetail[]> = {")
for mid, evs in match_events.items():
    evs_json = json.dumps(evs, ensure_ascii=False)
    lines.append(f"  '{mid}': {evs_json},")
lines.append("};")
lines.append("")

# Top scorers
lines.append("// Melhores marcadores da época 2025/2026.")
lines.append("export const HISTORICAL_SCORERS_2025_26 = " + json.dumps(scorers[:25], ensure_ascii=False, indent=2) + ";")
lines.append("")

# Top assists
lines.append("// Líderes de assistências da época 2025/2026.")
lines.append("export const HISTORICAL_ASSISTS_2025_26 = " + json.dumps(assists[:20], ensure_ascii=False, indent=2) + ";")
lines.append("")

# Clean sheets
lines.append("// Líderes de balizas invioladas da época 2025/2026.")
clean_sheet_list = [
    {"id": k, "name": GOALKEEPERS_INFO[k][1], "club": GOALKEEPERS_INFO[k][2], "teamId": GOALKEEPERS_INFO[k][3], "position": "Guarda-redes", "cleanSheets": v, "appearances": 30}
    for k, v in sorted(clean_sheets.items(), key=lambda x: -x[1])
]
lines.append("export const HISTORICAL_CLEAN_SHEETS_2025_26: CleanSheetRecord[] = " + json.dumps(clean_sheet_list, ensure_ascii=False, indent=2) + ";")
lines.append("")

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")

print(f"Successfully generated {OUTPUT_FILE}")
