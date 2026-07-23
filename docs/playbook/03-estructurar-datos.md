# 03 — Estructurar datos (Colombia)

## Colecciones Firestore

| Colección | Rol |
|-----------|-----|
| `casos` | Promesas/temas con scores |
| `menciones` | Cada aparición atribuible |
| `eventos` | Hechos/oficiales |
| `indicadores` | Macro P3 |
| `raw_items` | Cola pre-clasificación (n8n WF-C) |
| `tensiones` | Tensiones estructurales |
| `senales` | Confirmación/invalidación |
| `informes` | Snapshots de análisis |
| `alertas` | Flags materializados |
| `ingest_errors` | Rechazos (nunca drop silencioso) |
| `ingest_runs` | Log de corridas n8n |

Schemas: [`schemas/`](../../schemas/).

## Niveles de evidencia y promoción

Una sola fuente **nunca** mueve conclusiones. Estados de mención:

| Estado | Significado | Cuenta en credibilidad |
|--------|-------------|------------------------|
| `candidato` | Sin contraste multi-fuente | No |
| `contrastado` | ≥2 líneas independientes, o (oficial\|datos)+medio | Sí |
| `fundado` | contrastado + checklist parcial con cita+URL | Sí + alimenta checklist del caso |
| `en_conflicto` | Contradicción material | No → `ingest_errors` |
| `rechazado` | Spam / URL inválida / fuera de registro | No |

Nivel del caso (`evidencia_nivel`): `insuficiente` | `contraste_parcial` | `fundado`.

- `n_menciones` / `repeticion_norm` = solo `contrastado|fundado`.
- `n_menciones_candidato` = cola en cuarentena.
- Registro de fuentes: [`content/fuentes_registro.json`](../../content/fuentes_registro.json).
- Ventana de contraste: 90 días.

## Completitud

1. Validar contra schema **antes** de escribir.
2. Fallo → documento en `ingest_errors`.
3. Dedupe: menciones `url + caso_id`; eventos/raw por `url`.
4. Claves siempre presentes; vacío = `"N/D"`.
5. Tras mención OK → recalcular contadores + especificidad + credibilidad del caso.
6. Registrar `ingest_runs`.

## Required

**mencion:** `id`, `caso_id`, `actor_id`, `fecha`, `url`, `cita_corta`, `tipo_pieza`, `ingerido_en`, `workflow_id`

**caso:** `id`, `titulo`, `actor_id`, `fase`, `n_menciones`, `especificidad`, `credibilidad`, `credibilidad_desglose`, `discurso_identidad`, `importancia`, `factibilidad`, `revision`, `updated_at`, `campos_pendientes`

## Prioridad P1–P4

| P | Tipo | Destino |
|---|------|---------|
| P1 | Programas, discursos, entrevistas, comunicados | casos/menciones |
| P2 | Congreso, Minhacienda, Banrep, Cortes, Registraduría | factibilidad/tensiones/eventos |
| P3 | IPC, desempleo, PIB, FX | indicadores |
| P4 | ≥2 medios de contraste | raw → menciones |

Fuentes base: [`docs/colombia/01-fuentes.md`](../colombia/01-fuentes.md).

## Feeds sugeridos (n8n WF-C/B)

Verificar URLs al configurar:

- Presidencia (comunicados) — sitio oficial
- Congreso — listados públicos
- RSS medios: El Tiempo, El Espectador, La Silla Vacía, Portafolio (los que expongan RSS estable)
- World Bank API: país `COL` (WF-A)

Sin scrapers agresivos ni login walls en v1.

## Seed local

Semillas JSON en `content/seed/` para desarrollo y para cargar a Firestore (MCP o script).
