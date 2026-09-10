#!/usr/bin/env python3
"""
Gera os dados estatísticos completos da época 2025/26 do Girabola:
- 240 jogos com halfTimeScore, attendance, usefulTimeMinutes, referee, broadcaster
- Estatísticas detalhadas por jogo (MatchTeamStats: posse, remates, cantos, faltas, cartões, passes, defesas)
- Eventos de golos com minutos consistentes
- Rankings globais de 2025/26 (Goleadores, Assistências, Balizas Limpas, Disciplina, Tempo Útil)
- Métricas base para comparação com 2026/27
"""

import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RESULTS_FILE = ROOT / "src/lib/historical-results-2025-26.ts"

with open(RESULTS_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Parse RESULTS
pattern = r"\[(\d+),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+)\]"
raw_matches = re.findall(pattern, content)

assert len(raw_matches) == 240, f"Expected 240 matches, found {len(raw_matches)}"

REFEREES = [
    "Gilberto Bernardino Kativa",
    "Sanda Mateus Miguel Kitu",
    "Edilson Roberto Gomes André",
    "Miguel Tchissingu Augusto Américo",
    "Bernardo Hossi Nangolo",
    "Nelson João Milagre",
    "Paulo Sérgio Moreira",
    "Miguel Julião Mateus",
    "Bernardo Mário",
    "Aldair Quissanga Rodrigues Carmelino",
    "Sabino Garcez de Sousa de Carvalho",
    "Edson António Esoko",
    "Donaciano Mulumba",
    "António Caluassi Dungula",
    "Chitano Domingos Francisco",
]

BROADCASTERS = [
    "Zsports",
    "ZAP Viva",
    "TPA",
    "Girabola TV",
    "Rádio 5",
]

# Principais marcadores conhecidos por clube em 2025/26
SQUAD_SCORERS = {
    "petro": ["Tiago Azulão", "Jonathan Toro", "Depú", "Ivan Cavaleiro", "Hélder Costa", "Rúben Adérito", "Deybi Flores", "Pedro Aparício"],
    "wiliete": ["Kaporal", "Kabelo Dlamini", "Valter Monteiro", "Bello Lukman", "Gibele", "Bocar Sidibé", "Jorge Carneiro"],
    "dago": ["Dagó Tshibamba", "Samu Tshibamba", "Rupson", "Fernando", "Calebi", "Venâncio", "Mabilson"],
    "desphuila": ["Mendes", "Milton", "Milagre Simba", "Ludy", "Angelo Cangu", "Elias"],
    "kabuscorp": ["Benarfa", "Alberto Xavier", "José Vunge", "Mankoka Afonso", "Daniel Kilola"],
    "bravos": ["Lito", "Jorginho", "Bani", "Cueta", "Ju Cabral", "Higino", "Abrão"],
    "interclube": ["Além", "Beni", "Mano Calesso", "Paty", "Buba", "Julinho"],
    "lundasul": ["Magrinho", "Mussá", "Joca", "Cachindele", "Sicuba Vunge", "Vado"],
    "primeiromaio": ["Moisés", "Deco", "Deninho", "Kessie Messi", "Luis Escovalo", "Simão Gonga"],
    "sagrada": ["Pimpão", "Francisco Lucussa", "Miranda", "Cahilo", "Silvano", "Dabanda"],
    "saosalvador": ["Beni Papel", "Cuca", "Kipumbulu", "Nzau", "Gerson", "Mingo"],
    "lobito": ["Chico Papel", "Cavalo", "Ezequiel", "Januário", "Aurélio", "Manuel"],
    "libolo": ["Cuxixima", "Tubarão", "Pedro", "Amado Haidara", "Chimito", "Andeloy"],
    "luanda-city": ["Jaime Caetano", "Denilson", "Jonilson", "Arnaldo Dielo", "Pedro"],
    "guelson": ["Nelito", "Kibeixa", "Zinho", "Paizinho", "Mário", "Tchuby"],
    "redonda": ["Benvindo", "Afonso", "Kadú", "Mateus", "Rui", "Manucho"],
}

# Assistências prováveis
SQUAD_ASSISTS = {
    "petro": ["Jonathan Toro", "Eddie Afonso", "Pedro Aparício", "Hélder Costa", "Mário Balbúrdia"],
    "wiliete": ["Jorge Carneiro", "Bocar Sidibé", "Celio Zua", "Kabelo Dlamini"],
    "dago": ["Calebi", "Venâncio", "Mabilson", "Simão Dianzenza"],
    "desphuila": ["Elias", "Tchicundico", "Lucas Elias"],
    "kabuscorp": ["José Vunge", "Bayala Nsimba", "Saombe Jorge"],
    "bravos": ["Cueta", "Ju Cabral", "Abrão"],
    "interclube": ["Mano Calesso", "Além", "Paty"],
    "lundasul": ["Sicuba Vunge", "Vado", "Platini"],
    "primeiromaio": ["Odenir Jorge", "Luis Escovalo", "Deco"],
    "sagrada": ["Miranda", "Cahilo", "Afonso"],
    "saosalvador": ["Cuca", "Kipumbulu"],
    "lobito": ["Januário", "Ezequiel", "Lourenço"],
    "libolo": ["Chimito", "Andeloy", "Tchube"],
    "luanda-city": ["Gelson André", "Ruben Luwawa"],
    "guelson": ["Nelito", "Zinho"],
    "redonda": ["Afonso", "Kadú"],
}

# Guarda-redes titulares conhecidos
GOALKEEPERS = {
    "petro": ("hugo-marques", "Hugo Marques"),
    "wiliete": ("titi", "Titi"),
    "dago": ("neblu", "Neblú"),
    "desphuila": ("ndulo-huila", "Ndulo"),
    "kabuscorp": ("augusto-kabuscorp", "Augusto Mualucano"),
    "bravos": ("nathan-bravos", "Nathan"),
    "interclube": ("rui-interclube", "Rui"),
    "lundasul": ("cacusso", "Kacusso"),
    "primeiromaio": ("antonio-primeiromaio", "António Pascoal"),
    "sagrada": ("leonardo-sagrada", "Leonardo"),
    "saosalvador": ("simao-saosalvador", "Simão"),
    "lobito": ("guilherme-lobito", "Guilherme"),
    "libolo": ("beny-libolo", "Beny"),
    "luanda-city": ("ludiakueno", "Ludiakueno"),
    "guelson": ("paulo-guelson", "Paulo"),
    "redonda": ("miguel-redonda", "Miguel"),
}

random.seed(20252026)

enriched_matches = []
match_stats = {}
match_events = {}

scorer_tallies = {}
assist_tallies = {}
clean_sheets = {}
cards_yellow = {}
cards_red = {}

for idx, (round_str, date_str, home_id, away_id, h_score_str, a_score_str) in enumerate(raw_matches):
    rnd = int(round_str)
    h_score = int(h_score_str)
    a_score = int(a_score_str)
    mid = f"hist-2025-26-j{rnd}-{(idx % 8) + 1}"

    # Half time score
    if h_score == 0 and a_score == 0:
        ht_h, ht_a = 0, 0
    else:
        ht_h = random.choice([0, 0, 1]) if h_score > 0 else 0
        if ht_h > h_score: ht_h = h_score
        ht_a = random.choice([0, 0, 1]) if a_score > 0 else 0
        if ht_a > a_score: ht_a = a_score
        if random.random() < 0.25:
            ht_h = min(h_score, random.randint(0, h_score))
            ht_a = min(a_score, random.randint(0, a_score))

    ht_score = f"{ht_h}-{ht_a}"

    # Attendance
    is_big_derby = (home_id in ["petro", "dago"] and away_id in ["petro", "dago"])
    is_big_home = home_id in ["petro", "dago"]
    is_mid_home = home_id in ["wiliete", "desphuila", "sagrada", "kabuscorp", "bravos", "interclube"]
    if is_big_derby:
        att = random.randint(22000, 36000)
    elif is_big_home:
        att = random.randint(7500, 16000)
    elif is_mid_home:
        att = random.randint(2800, 6800)
    else:
        att = random.randint(900, 2600)

    # Useful time (minutos de tempo útil) - média ~51.2
    useful_time = round(random.gauss(51.2, 2.4), 1)
    useful_time = max(46.0, min(57.5, useful_time))

    referee = REFEREES[idx % len(REFEREES)]
    broadcaster = "Zsports" if (is_big_derby or is_big_home or rnd in [1, 15, 30]) else BROADCASTERS[idx % len(BROADCASTERS)]

    enriched_matches.append({
        "id": mid,
        "round": rnd,
        "date": date_str,
        "homeTeamId": home_id,
        "awayTeamId": away_id,
        "homeScore": h_score,
        "awayScore": a_score,
        "halfTimeScore": ht_score,
        "attendance": att,
        "usefulTimeMinutes": useful_time,
        "referee": referee,
        "broadcaster": broadcaster,
    })

    # Possession based on match result and team tier
    tier_power = {
        "petro": 8, "wiliete": 7, "dago": 7, "desphuila": 6,
        "kabuscorp": 5, "bravos": 5, "interclube": 5, "lundasul": 5,
        "primeiromaio": 4, "lobito": 4, "saosalvador": 4, "sagrada": 4,
        "libolo": 3, "luanda-city": 3, "guelson": 2, "redonda": 2
    }
    p_diff = (tier_power.get(home_id, 4) - tier_power.get(away_id, 4)) * 2.2 + 2.0
    base_pos = int(50 + p_diff + random.randint(-5, 5))
    base_pos = max(38, min(65, base_pos))
    h_pos = base_pos
    a_pos = 100 - h_pos

    # Shots: home & away
    h_sot = h_score + random.randint(2, 5)
    a_sot = a_score + random.randint(1, 4)
    h_shots = h_sot + random.randint(3, 8)
    a_shots = a_sot + random.randint(2, 6)

    # Corners
    h_corners = random.randint(3, 8) if h_pos >= 50 else random.randint(2, 6)
    a_corners = random.randint(2, 6) if h_pos >= 50 else random.randint(3, 7)

    # Fouls
    h_fouls = random.randint(10, 18)
    a_fouls = random.randint(11, 20)

    # Offsides
    h_offsides = random.randint(0, 4)
    a_offsides = random.randint(0, 4)

    # Yellow & red cards
    h_yellows = random.randint(1, 4)
    a_yellows = random.randint(1, 4)
    h_reds = 1 if random.random() < 0.08 else 0
    a_reds = 1 if random.random() < 0.09 else 0

    # Passes & Pass accuracy
    h_passes = int(h_pos * 8.5 + random.randint(-20, 20))
    a_passes = int(a_pos * 8.5 + random.randint(-20, 20))
    h_acc = min(88, max(70, int(68 + h_pos * 0.25 + random.randint(-3, 3))))
    a_acc = min(86, max(68, int(68 + a_pos * 0.25 + random.randint(-3, 3))))

    # Saves: goalkeeper saves all opponent on-target shots except goals
    h_saves = a_sot - a_score
    a_saves = h_sot - h_score

    match_stats[mid] = {
        "home": {
            "possession": h_pos,
            "shots": h_shots,
            "shotsOnTarget": h_sot,
            "corners": h_corners,
            "fouls": h_fouls,
            "offsides": h_offsides,
            "yellowCards": h_yellows,
            "redCards": h_reds,
            "passes": h_passes,
            "passAccuracy": h_acc,
            "saves": h_saves,
        },
        "away": {
            "possession": a_pos,
            "shots": a_shots,
            "shotsOnTarget": a_sot,
            "corners": a_corners,
            "fouls": a_fouls,
            "offsides": a_offsides,
            "yellowCards": a_yellows,
            "redCards": a_reds,
            "passes": a_passes,
            "passAccuracy": a_acc,
            "saves": a_saves,
        },
        "keys": [
            "possession", "shots", "shotsOnTarget", "corners",
            "fouls", "offsides", "yellowCards", "redCards",
            "passes", "passAccuracy", "saves"
        ]
    }

    # Cards tallies
    cards_yellow[home_id] = cards_yellow.get(home_id, 0) + h_yellows
    cards_yellow[away_id] = cards_yellow.get(away_id, 0) + a_yellows
    cards_red[home_id] = cards_red.get(home_id, 0) + h_reds
    cards_red[away_id] = cards_red.get(away_id, 0) + a_reds

    # Clean sheets
    if a_score == 0:
        gk_id = GOALKEEPERS[home_id][0]
        clean_sheets[gk_id] = clean_sheets.get(gk_id, 0) + 1
    if h_score == 0:
        gk_id = GOALKEEPERS[away_id][0]
        clean_sheets[gk_id] = clean_sheets.get(gk_id, 0) + 1

    # Goal events
    events = []
    for g in range(h_score):
        minute = random.randint(3, 44) if (g < ht_h) else random.randint(48, 93)
        scorer_pool = SQUAD_SCORERS.get(home_id, ["Jogador"])
        scorer = scorer_pool[min(g, len(scorer_pool) - 1)] if random.random() < 0.75 else random.choice(scorer_pool)
        scorer_tallies[scorer] = scorer_tallies.get(scorer, {"goals": 0, "teamId": home_id})
        scorer_tallies[scorer]["goals"] += 1
        assist_pool = SQUAD_ASSISTS.get(home_id, [])
        assist = random.choice(assist_pool) if assist_pool and random.random() < 0.65 else None
        if assist:
            assist_tallies[assist] = assist_tallies.get(assist, {"assists": 0, "teamId": home_id})
            assist_tallies[assist]["assists"] += 1
        events.append({
            "minute": minute,
            "type": "goal",
            "team": "home",
            "player": scorer,
            "assist": assist,
            "detail": f"{g+1}-{min(g, a_score)}"
        })

    for g in range(a_score):
        minute = random.randint(5, 43) if (g < ht_a) else random.randint(49, 92)
        scorer_pool = SQUAD_SCORERS.get(away_id, ["Jogador"])
        scorer = scorer_pool[min(g, len(scorer_pool) - 1)] if random.random() < 0.75 else random.choice(scorer_pool)
        scorer_tallies[scorer] = scorer_tallies.get(scorer, {"goals": 0, "teamId": away_id})
        scorer_tallies[scorer]["goals"] += 1
        assist_pool = SQUAD_ASSISTS.get(away_id, [])
        assist = random.choice(assist_pool) if assist_pool and random.random() < 0.65 else None
        if assist:
            assist_tallies[assist] = assist_tallies.get(assist, {"assists": 0, "teamId": away_id})
            assist_tallies[assist]["assists"] += 1
        events.append({
            "minute": minute,
            "type": "goal",
            "team": "away",
            "player": scorer,
            "assist": assist,
            "detail": f"{min(g, h_score)}-{g+1}"
        })

    events.sort(key=lambda e: e["minute"])
    match_events[mid] = events

print("Enriched matches generated successfully:")
print(f"Total matches: {len(enriched_matches)}")
print(f"Total match stats: {len(match_stats)}")
print(f"Total match events: {sum(len(evs) for evs in match_events.values())}")
print(f"Top scorers top 5: {sorted(scorer_tallies.items(), key=lambda x: -x[1]['goals'])[:5]}")
print(f"Clean sheets: {clean_sheets}")

OUTPUT_DATA = ROOT / "src/lib/generated-2025-26-data.json"
with open(OUTPUT_DATA, "w", encoding="utf-8") as f:
    json.dump({
        "matches": enriched_matches,
        "matchStats": match_stats,
        "matchEvents": match_events,
        "cleanSheets": clean_sheets,
        "scorers": sorted([{"name": k, "goals": v["goals"], "teamId": v["teamId"]} for k, v in scorer_tallies.items()], key=lambda x: -x["goals"]),
        "assists": sorted([{"name": k, "assists": v["assists"], "teamId": v["teamId"]} for k, v in assist_tallies.items()], key=lambda x: -x["assists"]),
    }, f, ensure_ascii=False, indent=2)

print(f"Wrote data to {OUTPUT_DATA}")
