# Plan agente — cualquier país

Checklist operativa. Metodología: [`docs/metodologia/00-marco-general.md`](../docs/metodologia/00-marco-general.md).

## Entrada

- País (slug: `mexico`, `argentina`, …)
- Acto concreto
- Horizontes: 30 / 90 / 365 días
- Pregunta central

## Pasos

1. Leer marco general + plantilla + indicadores.
2. Crear skeleton:
   ```bash
   PYTHONPATH=src python -m escenarios.build_skeleton --country <slug>
   ```
3. (Opcional) Bajar macro World Bank si hay código ISO3:
   ```bash
   PYTHONPATH=src python -m escenarios.fetch_world_bank --country <ISO3>
   ```
4. Investigar mapa de poder y fuentes públicas (citar URLs).
5. Completar `outputs/<slug>-<fecha>/informe.md` y `datos.md`.
6. Validar:
   ```bash
   PYTHONPATH=src python -m escenarios.validate_report outputs/<slug>-<fecha>/informe.md
   ```
7. Listar señales de las próximas 2–4 semanas.

## Prohibido

- Inventar datos numéricos o “probabilidades” falsas.
- Presentar un solo futuro como inevitable.
- Scraping agresivo / datos no públicos.

## Hecho cuando

- Informe con secciones Escenarios, Señales, Fuentes, Límites.
- `validate_report` exitoso.
- Respuesta al usuario en español con ruta del output.
