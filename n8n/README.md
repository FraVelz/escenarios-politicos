# n8n — Colombia

Pipeline hacia Firebase vía `POST https://escenarios-politicos.vercel.app/api/ingest` (Admin SDK; rules de cliente deniegan write).

## Workflows

| ID | Nombre | URL |
|----|--------|-----|
| `UoFg7Y0mGtt8yM9H` | CO WF-A Macro World Bank | https://fravelz.app.n8n.cloud/workflow/UoFg7Y0mGtt8yM9H |
| `sNfo0AZ9qb1vLr0T` | CO WF-C RSS Discurso/Medios | https://fravelz.app.n8n.cloud/workflow/sNfo0AZ9qb1vLr0T |
| `yXUW38FtfTgFLIt9` | CO WF-D Clasificar Credibilidad | https://fravelz.app.n8n.cloud/workflow/yXUW38FtfTgFLIt9 |

## Credencial (obligatoria)

En n8n → Credentials → **Header Auth** llamada `Escenarios Ingest`:

- **Name:** `x-ingest-secret`
- **Value:** el `INGEST_SECRET` de Vercel (nunca en el repo ni en parámetros del nodo)

## Seguridad

- Firestore: lectura pública de tablero; **write solo Admin**.
- `/api/ingest` exige secreto; sin fallback; body ≤ 256 KB.
- `raw_items` / `ingest_*` no son legibles desde el cliente.

## Flujo

1. WF-A → `indicadores`
2. WF-C → `raw_items`
3. WF-D (manual) → `menciones` + `casos`
4. Web: `/fuentes`, `/casos/[id]`
