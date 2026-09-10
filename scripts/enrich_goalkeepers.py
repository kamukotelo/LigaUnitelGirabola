import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

GOALKEEPERS_INFO = {
    "hugo-marques": ("hugo-marques", "Hugo Marques", "Petro de Luanda", "petro"),
    "titi": ("titi", "Titi", "Wiliete Sport Clube", "wiliete"),
    "neblu": ("neblu", "Neblú", "1.º de Agosto", "dago"),
    "ndulo-huila": ("ndulo-huila", "Ndulo", "Desportivo da Huíla", "desphuila"),
    "augusto-kabuscorp": ("augusto-kabuscorp", "Augusto Mualucano", "Kabuscorp do Palanca", "kabuscorp"),
    "nathan-bravos": ("nathan-bravos", "Nathan", "Bravos do Maquis", "bravos"),
    "rui-interclube": ("rui-interclube", "Rui", "Interclube", "interclube"),
    "cacusso": ("cacusso", "Kacusso", "Desportivo da Lunda-Sul", "lundasul"),
    "antonio-primeiromaio": ("antonio-primeiromaio", "António Pascoal", "Estrela 1.º de Maio", "primeiromaio"),
    "leonardo-sagrada": ("leonardo-sagrada", "Leonardo", "Sagrada Esperança", "sagrada"),
    "simao-saosalvador": ("simao-saosalvador", "Simão", "São Salvador do Kongo", "saosalvador"),
    "guilherme-lobito": ("guilherme-lobito", "Guilherme", "Académica do Lobito", "lobito"),
    "beny-libolo": ("beny-libolo", "Beny", "Recreativo do Libolo", "libolo"),
    "ludiakueno": ("ludiakueno", "Ludiakueno", "Luanda City", "luanda-city"),
    "paulo-guelson": ("paulo-guelson", "Paulo", "Guelson FC", "guelson"),
    "miguel-redonda": ("miguel-redonda", "Miguel", "Redonda FC", "redonda"),
}

with open("scripts/format_historical_results_ts.py") as f:
    code = f.read()

# Inject GOALKEEPERS_INFO into format script
code = code.replace("data = json.load(f)", "data = json.load(f)\n" + "GOALKEEPERS_INFO = " + str(GOALKEEPERS_INFO))
with open("scripts/format_historical_results_ts.py", "w") as f:
    f.write(code)

