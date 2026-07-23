# Escenarios políticos

Dashboard web multi-país + playbook + n8n → **Firebase Firestore**. País de referencia actual: **Colombia** (`/co`).

No es un oráculo: registra **casos** de discurso/promesas con **credibilidad %** auditable (especificidad + repetición + centralidad), factibilidad e importancia por separado.

La visión de plataforma de inteligencia política (arquitectura sensible) vive solo en local en `docs/private/` — **no se versiona** en GitHub.

## Stack

| Pieza | Rol |
|-------|-----|
| Next.js (`app/`) | Visualización |
| `docs/playbook/` | Manual del agente |
| `content/seed/` | Semilla local |
| Firebase `escenarios-politicos-co` | Store |
| n8n (`n8n/`) | Ingesta WF-A…E |

## Desarrollo

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Producción: [https://escenarios-politicos.vercel.app](https://escenarios-politicos.vercel.app)

Variables opcionales: copiar `.env.example` → `.env.local` (ya hay defaults del proyecto Firebase).

## Playbook / agente

Usar `/colombia-actual` → [`docs/playbook/00-indice.md`](docs/playbook/00-indice.md).

## Credibilidad

Ver [`docs/playbook/02-discurso-de-campana.md`](docs/playbook/02-discurso-de-campana.md) y `lib/credibilidad.ts`.

## Firebase

- Proyecto: `escenarios-politicos-co`
- Rules: lectura pública de colecciones de visualización; escritura denegada al cliente
- Seed: `content/seed/*.json` (ya cargado en Firestore)

## n8n

Ver [`n8n/README.md`](n8n/README.md).

## Legacy Python

Scripts en `src/escenarios/` quedan como legado opcional; el camino crítico es web + n8n + Firebase.

## Licencia

MIT — ver [LICENSE](./LICENSE).
