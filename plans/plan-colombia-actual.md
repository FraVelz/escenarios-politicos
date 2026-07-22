# Plan agente — Colombia actual

Checklist para una corrida enfocada en Colombia. Complementa el [plan general](./plan-general-pais.md).

## Leer primero

1. [`docs/colombia/00-brief.md`](../docs/colombia/00-brief.md) — actualizar el acto si hace falta
2. [`docs/colombia/01-fuentes.md`](../docs/colombia/01-fuentes.md)
3. [`docs/metodologia/00-marco-general.md`](../docs/metodologia/00-marco-general.md)
4. Plantilla: [`docs/metodologia/02-plantilla-escenarios.md`](../docs/metodologia/02-plantilla-escenarios.md)

## Pasos

1. Fijar el **acto actual** (una frase) y la **pregunta central**.
2. Skeleton:
   ```bash
   PYTHONPATH=src python -m escenarios.build_skeleton --country colombia
   ```
3. Indicadores:
   ```bash
   PYTHONPATH=src python -m escenarios.fetch_world_bank --country COL
   ```
   Incorporar el CSV de `data/processed/` en `datos.md` (sin inventar series faltantes).
4. Completar mapa de poder colombiano (Presidencia, Congreso, Banrep, Cortes, gobernaciones clave).
5. Redactar 3 escenarios (base / optimista / pesimista) con señales.
6. Validar:
   ```bash
   PYTHONPATH=src python -m escenarios.validate_report outputs/colombia-YYYY-MM-DD/informe.md
   ```
7. Actualizar `docs/colombia/00-brief.md` solo con hechos públicos ya citados en el informe (sin secretos).

## Enfoque analítico sugerido (Colombia)

- Gobernabilidad legislativa vs agenda del ejecutivo
- Ancla macro: inflación, desempleo, señal de Banrep / FX
- Seguridad / orden público con series oficiales si existen
- Relación con cortes y choques institucionales recientes (solo documentados)

## Hecho cuando

- Existe `outputs/colombia-<fecha>/informe.md` válido
- Fuentes colombianas + al menos un indicador de datos abiertos
- Límites explícitos; sin % de certeza inventados
