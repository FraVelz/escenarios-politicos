# n8n — Colombia

Pipeline hacia Firebase vía APIs en `https://escenarios-politicos.vercel.app` (Admin SDK; rules de cliente deniegan write).

## Workflows

| ID / archivo | Nombre | Endpoint |
|--------------|--------|----------|
| `wf-a-macro.ts` | CO WF-A Macro World Bank | World Bank → `POST /api/ingest` (indicadores + ingest_runs) |
| `wf-b-oficiales.ts` | CO WF-B Oficiales | `POST /api/oficiales-harvest` |
| `wf-c-rss.ts` | CO WF-C RSS | `POST /api/rss-harvest` (≥3 RSS del registro) |
| `wf-d-clasificar.ts` | CO WF-D Clasificar | `POST /api/classify-queue` |
| `wf-e-alertas.ts` | CO WF-E Alertas | `POST /api/alertas-refresh` |

Cloud IDs existentes (republicar tras sync del repo):

| ID | Nombre |
|----|--------|
| `UoFg7Y0mGtt8yM9H` | CO WF-A Macro World Bank |
| `sNfo0AZ9qb1vLr0T` | CO WF-C RSS Discurso/Medios |
| `yXUW38FtfTgFLIt9` | CO WF-D Clasificar Credibilidad |

## Credencial (obligatoria)

En n8n → Credentials → **Header Auth** llamada `Escenarios Ingest`:

- **Name:** `x-ingest-secret`
- **Value:** el `INGEST_SECRET` de Vercel (nunca en el repo ni en parámetros del nodo)

## Seguridad

- Firestore: lectura pública de tablero; **write solo Admin**.
- `/api/ingest` exige secreto; body ≤ 256 KB; valida dominio.
- `raw_items` / `ingest_runs` no son legibles desde el cliente; `ops_summary` sí (agregados).
- `ingest_errors` legible (para `/gaps`) con payload sanitizado.

## Flujo de evidencia

1. WF-A → `indicadores` (+ `ops_summary.last_wf_a`)
2. WF-C → `raw_items` (multi-línea RSS)
3. WF-D → menciones `candidato` → promoción automática a `contrastado`/`fundado` si hay contraste
4. WF-B → `eventos` oficiales/datos (si hay `rss_url` en registro)
5. WF-E → `alertas` materializadas
6. Web: `/co/fuentes`, `/co/casos/[id]`, `/co/gaps`, `/co/contexto` (indicadores)

Una sola fuente **no** mueve credibilidad. Ver playbook `03-estructurar-datos.md`.
