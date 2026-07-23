# 06 — Checklist de revisión (agente)

## Hecho cuando

- [ ] Brief Colombia actualizado (`docs/colombia/00-brief.md`) + espejo `content/seed/marco.json`
- [ ] ≥1 acto macro con pregunta central, `estado_acto` y horizontes 30/90/365
- [ ] Actores/fechas/contraste con URL+fecha o `N/D` (sin inventar)
- [ ] 12 temas en `lib/areas.ts` / schema; ≥1 caso por tema
- [ ] UI `/contexto` coherente con el marco (+ indicadores P3)
- [ ] Múltiples casos con schemas válidos (required presentes)
- [ ] Cada caso tiene `credibilidad` + `credibilidad_desglose`
- [ ] Checklist de especificidad solo con evidencias **fundado** (cita+URL)
- [ ] `evidencia_nivel` del caso coherente; candidatos no inflan `n_menciones`
- [ ] `discurso_identidad` marcado si aplica (y visible)
- [ ] Importancia/factibilidad con `N/D` explícito si no hay juicio
- [ ] Menciones con URL de pieza + fecha + cita + `fuente_id`/`evidencia_estado`
- [ ] Contraste multi-fuente antes de tratar un % como conclusión
- [ ] Informe con secciones Escenarios, Señales, Fuentes, Límites
- [ ] Gaps listados (`campos_pendientes` / `/gaps` + ops_summary)
- [ ] Nada dropeado en silencio (errores en `ingest_errors` si hubo)
- [ ] `ingest_runs` / ops por WF-A…E visibles en `/gaps`

## Prohibido

- Inventar cifras, escaños o URLs
- “Probabilidad de cumplimiento al X%” sin modelo auditable
- Subir importancia o credibilidad solo por repetición de un solo medio
- Descartar mención única por rareza
- Scraping agresivo / datos no públicos
- Commit de secretos (`.env`, service accounts)

## Comando Cursor

Usar `/colombia-actual` → este playbook como fuente de verdad.
