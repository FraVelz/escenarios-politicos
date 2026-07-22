# 01 — Acto y casos (Colombia)

## Acto macro

Definir **una frase** que ancla el análisis (no “todo el país”):

- Gobierno en ejercicio / fase del mandato
- Posesión o transición
- Reforma o crisis concreta
- Ciclo electoral / precampaña

Registrar en [`docs/colombia/00-brief.md`](../colombia/00-brief.md) y espejo tipado [`content/seed/marco.json`](../../content/seed/marco.json):

- Fecha de actualización (`actualizado_at`)
- `estado_acto`: `gobierno_estable` | `transicion_pre_posesion` | `post_transicion_reciente` | `sin_sucesor_conocido`
- Acto + pregunta central + `tipo_analisis`
- Horizontes: **30 / 90 / 365 días**
- Actores (ejercicio / electo), timeline, contraste con **URL+fecha o N/D**
- UI: `/contexto`

## Doce temas (áreas)

| id | Label |
|----|--------|
| `paz_seguridad` | Paz y seguridad |
| `empleo` | Empleo y economía laboral |
| `fiscal` | Fiscal y macro |
| `salud` | Salud |
| `educacion` | Educación |
| `infraestructura` | Infraestructura y movilidad |
| `vivienda_social` | Vivienda y política social |
| `justicia` | Justicia e instituciones |
| `exterior` | Política exterior |
| `energia_clima` | Energía y clima |
| `agro_rural` | Agro y desarrollo rural |
| `tecnologia_estado` | Tecnología y Estado digital |

Fuente de verdad código: [`lib/areas.ts`](../../lib/areas.ts). ≥1 caso por tema en el seed.

## Casos (unidad principal)

Un **caso** es una promesa, tema, amenaza o línea discursiva rastreable (reforma, empleo, seguridad, fiscal, paz, exterior, símbolo de campaña, etc.).

Se registran **múltiples casos** a la vez. El informe de escenarios resume; los casos viven en Firestore / `content/seed/`.

### Cómo abrir un caso

1. Título corto y estable (`id` slug: `empleo-formal`, `reforma-salud`).
2. **Área** temática (12 ids en `lib/areas.ts` / schema).
3. `actor_id` (candidato, presidente, coalición).
4. `fase`: `campana` | `transicion` | `gobierno`.
5. Primera mención con **URL + cita corta + fecha** (aunque sea la única).
6. Campos siempre presentes: importancia, factibilidad, credibilidad, desglose, `discurso_identidad`, `campos_pendientes` (usar `"N/D"` si aún no hay juicio).
7. `revision`: `pendiente` hasta revisión humana/agente.

### Reglas

- Una mención única **no se descarta** por rareza.
- Repetición sube frecuencia/credibilidad parcial; **no** sube importancia sola.
- El caso marcado `discurso_identidad: true` es el eje narrativo del actor: siempre visible en la home.

### Plantilla

Ver [plantillas/caso.md](./plantillas/caso.md) y schema [`schemas/caso.schema.json`](../../schemas/caso.schema.json).
