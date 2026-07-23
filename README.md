# Escenarios políticos

Plataforma web **multi-país** de análisis político (discurso, poder, partidos, escenarios) + playbook + n8n → **Firebase Firestore**.

País de referencia: **Colombia** (`/co`). El selector solo lista países con datos analizados.

No es un oráculo: **credibilidad %** auditable (especificidad × repetición × centralidad) ≠ probabilidad de cumplimiento. Cifras y juicios: valor + fecha + fuente, o `N/D`.

Arquitectura sensible de plataforma (intel): solo local en `docs/private/` — **no se versiona** en GitHub.

## Rutas

| Ruta | Contenido |
|------|-----------|
| `/` | Redirect al país disponible |
| `/co` | Mesa situacional |
| `/co/contexto` | Transición / acto |
| `/co/poder` | Mapa de poder |
| `/co/partidos` · `/co/actores` | Fuerzas y actores |
| `/co/casos` · `/fuentes` · `/gaps` | Discurso y completitud |
| `/co/escenarios` | Escenarios y señales |
| `/playbook` | Metodología (global) |

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
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000) → redirige a `/co`.

Producción: [https://escenarios-politicos.vercel.app](https://escenarios-politicos.vercel.app)

## Playbook / agente

`/colombia-actual` → [`docs/playbook/00-indice.md`](docs/playbook/00-indice.md).

## Licencia

MIT — ver [LICENSE](./LICENSE).
