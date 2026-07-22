# Playbook Colombia — índice

Manual operativo para el agente: **estructurar datos**, **investigar el acto/gobierno colombiano** y **registrar múltiples casos** (promesas/temas de discurso) con **credibilidad %** auditable. Doce temas + marco de transición en `marco.json` / `/contexto`.

## Cuándo usarlo

- Correr o actualizar el análisis Colombia (`/colombia-actual`).
- Abrir o revisar casos de campaña/gobierno.
- Configurar o depurar ingesta n8n → Firebase.
- Revisar gaps (`N/D`) antes de publicar en la web.

## Mapa

| Archivo | Contenido |
|---------|-----------|
| [01-acto-y-casos.md](./01-acto-y-casos.md) | Acto macro + abrir múltiples casos |
| [02-discurso-de-campana.md](./02-discurso-de-campana.md) | Frecuencia, especificidad, credibilidad %, identidad |
| [03-estructurar-datos.md](./03-estructurar-datos.md) | Schemas, Firestore, completitud, feeds |
| [04-investigar.md](./04-investigar.md) | Mapa de poder CO → factibilidad |
| [05-escenarios-y-senales.md](./05-escenarios-y-senales.md) | Tres escenarios + señales |
| [06-checklist-revision.md](./06-checklist-revision.md) | Hecho cuando + prohibiciones |
| [plantillas/](./plantillas/) | Plantillas de caso y mención |

## Prioridad de datos (resumen)

1. **P1** Discurso/promesas → `casos` / `menciones`
2. **P2** Capacidad (Congreso, fiscal, Banrep, Cortes) → factibilidad
3. **P3** Macro (DANE / World Bank / Banrep) → `indicadores`
4. **P4** Medios de contraste → descubrir menciones

Detalle: [03-estructurar-datos.md](./03-estructurar-datos.md). Fuentes: [`docs/colombia/01-fuentes.md`](../colombia/01-fuentes.md).

## Stack del producto

| Pieza | Rol |
|-------|-----|
| Este playbook + `schemas/` | Contrato y reglas |
| Web (Next.js) | Visualización solo lectura |
| n8n | Ingesta WF-A…E |
| Firebase Firestore | Fuente de verdad operativa |

## Premisa de porcentajes

- **Sí:** `credibilidad %` con fórmula fija y desglose.
- **No:** “probabilidad de que se cumpla al X%” inventada.
- Factibilidad e importancia: `alta` / `media` / `baja` / `N/D` + nota citada.
