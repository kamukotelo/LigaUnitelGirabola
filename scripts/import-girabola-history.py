#!/usr/bin/env python3
"""Importa resultados concluídos do Girabola e gera o módulo TypeScript histórico.

Fonte jogo a jogo: Futebol 365. A página histórica do 365Scores é usada para
confirmar as épocas e campeões, mas não expõe todos os jogos antigos no HTML.
"""

from __future__ import annotations

import concurrent.futures
import html
import json
import re
import subprocess
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src/lib/historical-results.ts"
EDITIONS = {2025: "2024-25", 2024: "2023-24", 2023: "2022-23"}

TEAM_IDS = {
    "Petro Luanda": "petro",
    "Wiliete": "wiliete",
    "1º de Agosto": "dago",
    "Desportivo Huíla": "desphuila",
    "Onze Bravos": "bravos",
    "Kabuscorp": "kabuscorp",
    "Sagrada Esperança": "sagrada",
    "Inter Luanda": "interclube",
    "Desportivo Lunda Sul": "lundasul",
    "Recreativo Libolo": "libolo",
    "Académica Lobito": "lobito",
    "CD São Salvador": "saosalvador",
    "Luanda City": "fcluanda",
    "Isaac Benguela": "isaac-benguela",
    "Santa Rita de Cássia": "santa-rita",
    "Carmona SC": "carmona",
    "Sporting Cabinda": "sporting-cabinda",
    "União de Malanje": "uniao-malanje",
    "ASK Dragão": "ask-dragao",
    "Sporting Benguela": "sporting-benguela",
}

DISPLAY_NAMES = {
    "petro": "Petro de Luanda",
    "wiliete": "Wiliete Sport Clube",
    "dago": "1.º de Agosto",
    "desphuila": "Desportivo da Huíla",
    "bravos": "Bravos do Maquis",
    "kabuscorp": "Kabuscorp do Palanca",
    "sagrada": "Sagrada Esperança",
    "interclube": "Interclube",
    "lundasul": "Desportivo da Lunda-Sul",
    "libolo": "Recreativo do Libolo",
    "lobito": "Académica do Lobito",
    "saosalvador": "São Salvador do Kongo",
    "fcluanda": "Luanda City",
    "isaac-benguela": "Isaac de Benguela",
    "santa-rita": "Santa Rita de Cássia",
    "carmona": "Carmona Sport Clube",
    "sporting-cabinda": "Sporting de Cabinda",
    "uniao-malanje": "União de Malanje",
    "ask-dragao": "ASK Dragão",
    "sporting-benguela": "Sporting de Benguela",
}


def fetch(args: tuple[int, int]) -> tuple[int, int, str]:
    edition, round_number = args
    url = (
        "https://futebol365.pt/competicao/72/jogos/"
        f"?competition_round={round_number}&edition={edition}"
    )
    body = subprocess.check_output(
        ["curl", "--fail", "--location", "--silent", "--show-error", url], text=True
    )
    return edition, round_number, body


def clean(value: str) -> str:
    return html.unescape(re.sub(r"<.*?>", "", value)).strip()


def parse(edition: int, round_number: int, body: str) -> list[dict]:
    matches = []
    for row in re.findall(r"<tr[^>]*>(.*?)</tr>", body, re.S):
        score = re.search(
            r'ink-label-score[^>]*>\s*<a[^>]*>(\d+)\s*-\s*(\d+)</a>', row, re.S
        )
        date = re.search(r"competition_round=\d+[^>]*>(\d{2}-\d{2}-\d{2})</a>", row)
        teams = re.findall(
            r'<td class="align-(?:right|left) hide-tiny hide-small">\s*'
            r'<a[^>]+equipa/\d+/jogos/[^>]*>(.*?)</a>',
            row,
            re.S,
        )
        if not score or not date or len(teams) != 2:
            continue
        home_source, away_source = map(clean, teams)
        if home_source not in TEAM_IDS or away_source not in TEAM_IDS:
            raise ValueError(f"Equipa sem mapeamento: {home_source} / {away_source}")
        home_id, away_id = TEAM_IDS[home_source], TEAM_IDS[away_source]
        day = datetime.strptime(date.group(1), "%d-%m-%y").strftime("%Y-%m-%d")
        home_score, away_score = map(int, score.groups())
        season = EDITIONS[edition]
        matches.append(
            {
                "id": f"hist-{season}-j{round_number}-{len(matches) + 1}",
                "homeTeamId": home_id,
                "awayTeamId": away_id,
                "homeTeam": DISPLAY_NAMES[home_id],
                "awayTeam": DISPLAY_NAMES[away_id],
                "homeScore": home_score,
                "awayScore": away_score,
                "score": f"{home_score}-{away_score}",
                "date": f"{day}T15:00:00+01:00",
                "stadium": "A confirmar",
                "status": "finished",
                "round": round_number,
            }
        )
    return matches


def main() -> None:
    pages: list[tuple[int, int, str]] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as executor:
        pages.extend(
            executor.map(fetch, [(edition, r) for edition in EDITIONS for r in range(1, 31)])
        )

    seasons = {season: [] for season in EDITIONS.values()}
    for edition, round_number, body in pages:
        seasons[EDITIONS[edition]].extend(parse(edition, round_number, body))

    expected = {"2024-25": 240, "2023-24": 210, "2022-23": 210}
    counts = {season: len(matches) for season, matches in seasons.items()}
    if counts != expected:
        raise ValueError(f"Contagem inesperada: {counts}; esperado: {expected}")

    payload = json.dumps(seasons, ensure_ascii=False, indent=2)
    source = "// Gerado por scripts/import-girabola-history.py. Não editar manualmente.\n"
    source += "import type { Match } from './data';\n\n"
    source += f"export const HISTORICAL_MATCHES: Record<string, Match[]> = {payload};\n"
    source += "\nexport const HISTORICAL_RESULTS_SOURCE = {\n"
    source += "  provider: 'Futebol 365',\n"
    source += "  validationProvider: '365Scores',\n"
    source += "  competition: 'Girabola',\n"
    source += "  importedAt: '2026-08-01',\n"
    source += "  seasons: ['2024-25', '2023-24', '2022-23'],\n"
    source += "} as const;\n"
    OUTPUT.write_text(source, encoding="utf-8")
    print(f"Gerado {OUTPUT.relative_to(ROOT)}: {counts}")


if __name__ == "__main__":
    main()
