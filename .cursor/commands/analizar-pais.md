# Analizar país (genérico)

Usar con **`/analizar-pais`**.

## Objetivo

Producir un informe de escenarios para el país y acto que indique el usuario, en `outputs/<slug>-<YYYY-MM-DD>/`.

## Procedimiento

1. Seguir [`plans/plan-general-pais.md`](../../plans/plan-general-pais.md).
2. Leer metodología en `docs/metodologia/`.
3. Ejecutar `build_skeleton` (y `fetch_world_bank` si hay ISO3).
4. Completar `informe.md` y `datos.md` con fuentes citadas.
5. Correr `validate_report` y corregir hasta que pase.
6. Resumir al usuario: ruta del informe + 3 viñetas de escenarios + límites.

## Restricciones

- No inventar datos. No % de certeza inventados.
- Español. No commit/push salvo petición.
