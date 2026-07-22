# n8n — Colombia

Workflows del pipeline hacia Firebase vía `POST https://escenarios-politicos.vercel.app/api/ingest`.

## Workflows

| ID | Nombre | URL |
|----|--------|-----|
| `UoFg7Y0mGtt8yM9H` | CO WF-A Macro World Bank | https://fravelz.app.n8n.cloud/workflow/UoFg7Y0mGtt8yM9H |
| `sNfo0AZ9qb1vLr0T` | CO WF-C RSS Discurso/Medios | https://fravelz.app.n8n.cloud/workflow/sNfo0AZ9qb1vLr0T |
| `yXUW38FtfTgFLIt9` | CO WF-D Clasificar Credibilidad | https://fravelz.app.n8n.cloud/workflow/yXUW38FtfTgFLIt9 |

WF-A y WF-C publicados con nodo **POST Firebase via API**. WF-D queda en borrador (solo Manual Trigger).

## Auth de ingesta

Header `x-ingest-secret: escenarios-dev-ingest` (mismo valor que `INGEST_SECRET` en Vercel / `.env.example`).

## Flujo

1. WF-A → `indicadores` (inflación World Bank).
2. WF-C → `raw_items` (RSS El Espectador, max 15/run).
3. WF-D (manual) → `menciones` + `casos`.
4. Web: `/fuentes` y `/casos/[id]` leen menciones desde Firestore.

## Reglas

- Todo documento lleva `workflow_id` con prefijo `wf-` o `seed-`.
- Fallos → `ingest_errors`.
- No inventar % de cumplimiento; solo fórmula de credibilidad.
