# n8n — Colombia

Workflows del pipeline hacia Firebase. Código SDK en `workflows/`; instancias creadas en n8n Cloud del usuario.

## Workflows creados

| ID | Nombre | URL |
|----|--------|-----|
| `UoFg7Y0mGtt8yM9H` | CO WF-A Macro World Bank | https://fravelz.app.n8n.cloud/workflow/UoFg7Y0mGtt8yM9H |
| `sNfo0AZ9qb1vLr0T` | CO WF-C RSS Discurso/Medios | https://fravelz.app.n8n.cloud/workflow/sNfo0AZ9qb1vLr0T |
| `yXUW38FtfTgFLIt9` | CO WF-D Clasificar Credibilidad | https://fravelz.app.n8n.cloud/workflow/yXUW38FtfTgFLIt9 |

WF-A y WF-C están publicados. WF-D queda en borrador (solo Manual Trigger; n8n Cloud exige trigger programable para publicar — ejecutar a mano o añadir Schedule y republicar).

## Pendiente de cablear (manual en n8n)

1. **Credencial Firebase** (service account) → nodos HTTP Firestore REST o comunidad Firebase, para escribir `indicadores` / `raw_items` / `casos` / `menciones` / `ingest_errors`.
2. **WF-B Oficiales** y **WF-E Alertas** — crear siguiendo el mismo patrón (exports en repo cuando existan).
3. WF-D: sustituir el Code stub por nodo LLM con prompt de `docs/playbook/02-discurso-de-campana.md`.

## Orden de arranque

Credencial Firebase → probar WF-A (manual) → WF-C + WF-D → WF-B → WF-E.

## Reglas

- Validar schema antes de escribir; fallos → `ingest_errors`.
- No inventar % de cumplimiento; solo fórmula de credibilidad.
- Dedupe menciones por `url + caso_id`.
