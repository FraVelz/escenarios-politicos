"""Stub FRED: opcional; v1 no requiere API key."""

from __future__ import annotations

import argparse
import os
from pathlib import Path

from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parents[2]


def fetch_fred_or_stub(series_id: str = "DEXCOUS") -> Path:
    """Si hay FRED_API_KEY, avisa que la integración real queda para v2; si no, escribe stub."""
    load_dotenv(REPO_ROOT / ".env")
    out = REPO_ROOT / "data" / "raw" / f"fred-{series_id}-stub.txt"
    out.parent.mkdir(parents=True, exist_ok=True)

    key = os.getenv("FRED_API_KEY", "").strip()
    if not key:
        out.write_text(
            "FRED stub: sin FRED_API_KEY. Usar World Bank en v1.\n"
            f"Serie solicitada: {series_id}\n",
            encoding="utf-8",
        )
        print(f"stub written: {out}")
        return out

    out.write_text(
        "FRED_API_KEY detectada, pero el cliente FRED completo no está en v1.\n"
        f"Serie: {series_id}\n"
        "Usar fetch_world_bank o ampliar este módulo en una versión posterior.\n",
        encoding="utf-8",
    )
    print(f"stub (key present, fetch not implemented): {out}")
    return out


def main() -> None:
    parser = argparse.ArgumentParser(description="Stub FRED (opcional)")
    parser.add_argument("--series", default="DEXCOUS")
    args = parser.parse_args()
    fetch_fred_or_stub(args.series)


if __name__ == "__main__":
    main()
