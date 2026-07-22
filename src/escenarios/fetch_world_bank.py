"""Descarga indicadores macro del World Bank (sin API key)."""

from __future__ import annotations

import argparse
import json
from datetime import date
from pathlib import Path

import httpx
import pandas as pd

REPO_ROOT = Path(__file__).resolve().parents[2]

# Indicador World Bank → etiqueta
INDICATORS: dict[str, str] = {
    "FP.CPI.TOTL.ZG": "inflacion_ipc_anual_pct",
    "NY.GDP.MKTP.KD.ZG": "pib_real_crecimiento_pct",
    "SL.UEM.TOTL.ZS": "desempleo_pct",
    "BX.KLT.DINV.WD.GD.ZS": "ied_pct_pib",
    "FP.CPI.TOTL": "indice_precios_consumo",
}

API = "https://api.worldbank.org/v2/country/{country}/indicator/{indicator}"


def fetch_indicator(country: str, indicator: str, client: httpx.Client) -> list[dict]:
    url = API.format(country=country.upper(), indicator=indicator)
    params = {"format": "json", "per_page": 60}
    r = client.get(url, params=params, timeout=60.0)
    r.raise_for_status()
    payload = r.json()
    if not isinstance(payload, list) or len(payload) < 2:
        return []
    rows = payload[1] or []
    out: list[dict] = []
    for row in rows:
        if row.get("value") is None:
            continue
        out.append(
            {
                "country_iso3": country.upper(),
                "indicator_id": indicator,
                "indicator_name": INDICATORS.get(indicator, indicator),
                "year": row.get("date"),
                "value": row.get("value"),
            }
        )
    return out


def fetch_world_bank(country: str = "COL") -> Path:
    today = date.today().isoformat()
    raw_dir = REPO_ROOT / "data" / "raw"
    processed_dir = REPO_ROOT / "data" / "processed"
    raw_dir.mkdir(parents=True, exist_ok=True)
    processed_dir.mkdir(parents=True, exist_ok=True)

    all_rows: list[dict] = []
    with httpx.Client(headers={"User-Agent": "escenarios-politicos/0.1"}) as client:
        for indicator in INDICATORS:
            rows = fetch_indicator(country, indicator, client)
            all_rows.extend(rows)

    raw_path = raw_dir / f"worldbank-{country.upper()}-{today}.json"
    raw_path.write_text(json.dumps(all_rows, ensure_ascii=False, indent=2), encoding="utf-8")

    if not all_rows:
        # CSV vacío con columnas esperadas
        df = pd.DataFrame(
            columns=["country_iso3", "indicator_id", "indicator_name", "year", "value"]
        )
    else:
        df = pd.DataFrame(all_rows)
        df = df.sort_values(["indicator_id", "year"], ascending=[True, False])

    # Resumen: último año no nulo por indicador
    if not df.empty:
        latest = df.groupby("indicator_id", as_index=False).first()
    else:
        latest = df

    slug = country.lower()
    csv_path = processed_dir / f"{slug}-indicadores.csv"
    latest.to_csv(csv_path, index=False)
    full_path = processed_dir / f"{slug}-indicadores-serie.csv"
    df.to_csv(full_path, index=False)

    print(f"raw: {raw_path}")
    print(f"latest: {csv_path}")
    print(f"series: {full_path}")
    return csv_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch World Bank indicators")
    parser.add_argument("--country", default="COL", help="ISO3 del país (default COL)")
    args = parser.parse_args()
    fetch_world_bank(args.country)


if __name__ == "__main__":
    main()
