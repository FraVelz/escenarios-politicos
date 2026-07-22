"""Valida que un informe tenga secciones mínimas."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

REQUIRED = ("escenarios", "señales", "fuentes", "límites")


def normalize(text: str) -> str:
    return (
        text.lower()
        .replace("á", "a")
        .replace("é", "e")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ú", "u")
    )


def validate_report(path: Path) -> list[str]:
    if not path.is_file():
        return [f"no existe el archivo: {path}"]

    content = path.read_text(encoding="utf-8")
    # Solo encabezados markdown
    headers = [
        normalize(line.lstrip("#").strip())
        for line in content.splitlines()
        if line.startswith("#")
    ]
    blob = "\n".join(headers)
    missing: list[str] = []
    for req in REQUIRED:
        req_n = normalize(req)
        if req_n not in blob:
            missing.append(req)
    return missing


def main() -> None:
    parser = argparse.ArgumentParser(description="Valida secciones del informe")
    parser.add_argument("path", type=Path, help="Ruta a informe.md")
    args = parser.parse_args()
    missing = validate_report(args.path)
    if missing:
        print("Faltan secciones (en encabezados):", ", ".join(missing))
        sys.exit(1)
    print(f"OK: {args.path}")


if __name__ == "__main__":
    main()
