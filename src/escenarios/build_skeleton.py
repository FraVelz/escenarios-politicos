"""Crea outputs/<slug>-<fecha>/ con plantilla de informe y datos.md."""

from __future__ import annotations

import argparse
import re
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]

INFORME_TEMPLATE = """# Informe de escenarios — {title}

- **Fecha del informe:** {today}
- **Acto analizado:** _(completar)_
- **Horizontes:** 30 / 90 / 365 días
- **Pregunta central:** _(completar)_

## 1. Resumen ejecutivo

- …

## 2. Acto y contexto

…

## 3. Mapa de poder

| Actor | Situación |
|-------|-----------|
| Ejecutivo | |
| Congreso | |
| Cortes | |
| Banca central | |
| FFAA / policía | |
| Subnacionales | |
| Externos | |

## 4. Promesas vs capacidad

…

## 5. Indicadores baseline

| Indicador | Valor | Fecha | Fuente |
|-----------|-------|-------|--------|
| | | | |

Ver también `datos.md`.

## 6. Escenarios

### 6.1 Base

- Narrativa (90/365 días):
- Condiciones implícitas:
- **Señales de confirmación:**
- **Señales de invalidación:**

### 6.2 Optimista

- Narrativa:
- Condiciones necesarias:
- **Señales de confirmación:**
- **Señales de invalidación:**

### 6.3 Pesimista

- Narrativa:
- Condiciones de riesgo:
- **Señales de confirmación:**
- **Señales de invalidación:**

## 7. Señales a monitorear (próximas 2–4 semanas)

1. …

## 8. Fuentes

- …

## 9. Límites

- …
"""

DATOS_TEMPLATE = """# Datos — {title}

- **Fecha:** {today}
- **Slug:** `{slug}`

## Archivos procesados

Listar CSV/JSON usados, por ejemplo:

- `data/processed/{slug}-indicadores.csv` (si se corrió `fetch_world_bank`)

## Tabla resumen

| Indicador | Valor | Fecha | Fuente | Notas |
|-----------|-------|-------|--------|-------|
| | | | | |

## Notas de calidad

- Sin inventar series. Marcar `N/D` si falta el dato.
"""


def slugify(country: str) -> str:
    s = country.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s, flags=re.IGNORECASE)
    return s.strip("-") or "pais"


def build_skeleton(country: str, as_of: date | None = None) -> Path:
    today = as_of or date.today()
    slug = slugify(country)
    out_dir = REPO_ROOT / "outputs" / f"{slug}-{today.isoformat()}"
    out_dir.mkdir(parents=True, exist_ok=True)

    title = country.strip().title()
    informe = out_dir / "informe.md"
    datos = out_dir / "datos.md"

    if not informe.exists():
        informe.write_text(
            INFORME_TEMPLATE.format(title=title, today=today.isoformat()),
            encoding="utf-8",
        )
    if not datos.exists():
        datos.write_text(
            DATOS_TEMPLATE.format(title=title, today=today.isoformat(), slug=slug),
            encoding="utf-8",
        )

    return out_dir


def main() -> None:
    parser = argparse.ArgumentParser(description="Genera carpeta de salida con plantilla")
    parser.add_argument("--country", required=True, help="Nombre o slug del país")
    parser.add_argument(
        "--date",
        default=None,
        help="Fecha YYYY-MM-DD (default: hoy)",
    )
    args = parser.parse_args()
    as_of = date.fromisoformat(args.date) if args.date else None
    path = build_skeleton(args.country, as_of=as_of)
    print(path)


if __name__ == "__main__":
    main()
