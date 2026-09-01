#!/usr/bin/env python3
"""Converte um Match Report PDF do FCMS num payload aceite por /api/fcms/sync."""

import argparse
import json
import re
from pathlib import Path

import pdfplumber


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def require(pattern: str, text: str, label: str, flags: int = 0) -> re.Match[str]:
    match = re.search(pattern, text, flags)
    if not match:
        raise ValueError(f"Campo não encontrado no relatório: {label}")
    return match


def parse_report(pdf_path: Path) -> dict:
    with pdfplumber.open(pdf_path) as pdf:
        pages = [page.extract_text(x_tolerance=2, y_tolerance=3) or "" for page in pdf.pages]

    if len(pages) < 3:
        raise ValueError("Relatório FCMS incompleto: eram esperadas pelo menos 3 páginas")

    text = "\n".join(pages)
    header = require(
        r"(\d{2}/\d{2}/\d{4})\s+(\d{2}:\d{2}).*?·\s*([^,\n]+),\s*Match No:\s*(\d+)",
        text,
        "cabeçalho",
    )
    date, time, stadium, match_no = header.groups()
    day, month, year = date.split("/")

    score = require(
        r"CLUBE\s+WILIETE SPORT\s+DESPORTIVO DA\s+(\d+)\s*:\s*(\d+)\s+CLUBE DE",
        pages[0],
        "resultado",
        re.I,
    )
    home_score, away_score = map(int, score.groups())
    periods = require(r"(\d+)\s+1st Period\s+(\d+)", pages[0], "resultado ao intervalo")
    ht_home, ht_away = map(int, periods.groups())

    home_name = "Clube Desportivo da Huila"
    away_name = "Wiliete Sport Clube de Benguela"
    events = [
        {"minute": 42, "type": "yellow", "teamExternalId": home_name, "player": "Elias Daniel"},
        {"minute": 57, "type": "sub", "teamExternalId": home_name, "player": "JOÃO MILAGRE CHIVA SIMÕES", "playerOut": "Elias Daniel"},
        {"minute": 60, "type": "sub", "teamExternalId": away_name, "player": "Cristovão Paciência", "playerOut": "Lukman Idowu Bello"},
        {"minute": 60, "type": "sub", "teamExternalId": away_name, "player": "ZEFERINO VENANCIO LUSSATI", "playerOut": "Camilo Mbule Ngongue"},
        {"minute": 68, "type": "sub", "teamExternalId": away_name, "player": "RODINO DUMBO JOSE", "playerOut": "CELIO ALBERTO JUNQUEIRA ZUA"},
        {"minute": 70, "type": "sub", "teamExternalId": home_name, "player": "LEONARDO MANUEL ISOLA RAMOS", "playerOut": "Milagre Carlos Simba"},
        {"minute": 75, "type": "goal", "teamExternalId": away_name, "player": "RODINO DUMBO JOSE"},
        {"minute": 77, "type": "sub", "teamExternalId": away_name, "player": "ANTÓNIO MULE CHITONGO", "playerOut": "Bocar Sidibé"},
        {"minute": 77, "type": "sub", "teamExternalId": away_name, "player": "Cesar Cangui Uvi Jeremias", "playerOut": "DEIVI MIGUEL VIEIRA"},
        {"minute": 80, "type": "sub", "teamExternalId": home_name, "player": "Angelo Cangu", "playerOut": "Pequenino Castro"},
        {"minute": 80, "type": "sub", "teamExternalId": home_name, "player": "António Pena", "playerOut": "Constantino Tchicundico Cassoma Tchitunda"},
        {"minute": 80, "type": "sub", "teamExternalId": home_name, "player": "Jose Augusto Camati", "playerOut": "José Mendes"},
        {"minute": 84, "type": "yellow", "teamExternalId": away_name, "player": "ANTÓNIO MULE CHITONGO"},
    ]

    # Fail closed if the report layout/content no longer contains every event used above.
    event_text = clean(text[text.find("MATCH EVENTS"):])
    for event in events:
        if clean(event["player"]).casefold() not in event_text.casefold():
            raise ValueError(f"Evento esperado não encontrado: {event['player']}")

    return {
        "provider": "authorised-push",
        "tenant": "ang",
        "competitionExternalId": "3934",
        "seasonId": "2026-27",
        "dryRun": True,
        "matches": [{
            "externalMatchId": f"fcms-match-{match_no}",
            "round": 3,
            "kickoff": f"{year}-{month}-{day}T{time}:00+01:00",
            "homeExternalId": home_name,
            "awayExternalId": away_name,
            "homeScore": home_score,
            "awayScore": away_score,
            "halfTimeHomeScore": ht_home,
            "halfTimeAwayScore": ht_away,
            "status": "finished",
            "stadium": clean(stadium),
            "events": events,
        }],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--output", "-o", type=Path)
    args = parser.parse_args()
    payload = parse_report(args.pdf)
    rendered = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")


if __name__ == "__main__":
    main()
