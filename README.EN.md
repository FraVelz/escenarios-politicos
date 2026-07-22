# Political scenarios — Colombia

Web dashboard + agent playbook + n8n → **Firebase Firestore**.

Not an oracle: it tracks **cases** (campaign/government discourse and promises) with an auditable **credibility %** (specificity + repetition + centrality), plus feasibility and importance as separate dimensions.

## Stack

| Piece | Role |
|-------|------|
| Next.js (`app/`) | Visualization |
| `docs/playbook/` | Agent manual |
| `content/seed/` | Local seed data |
| Firebase `escenarios-politicos-co` | Store |
| n8n (`n8n/`) | Ingestion WF-A…E |

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production: [https://escenarios-politicos.vercel.app](https://escenarios-politicos.vercel.app)

Optional env: copy `.env.example` → `.env.local`.

## Playbook / agent

Use `/colombia-actual` → [`docs/playbook/00-indice.md`](docs/playbook/00-indice.md).

## Credibility

See [`docs/playbook/02-discurso-de-campana.md`](docs/playbook/02-discurso-de-campana.md) and `lib/credibilidad.ts`.

Credibility % is **not** a probability of delivery.

## Firebase

- Project: `escenarios-politicos-co`
- Rules: public read for viz collections; client writes denied
- Seed: `content/seed/*.json`

## n8n

See [`n8n/README.md`](n8n/README.md).

## Legacy Python

Scripts under `src/escenarios/` are optional legacy; the critical path is web + n8n + Firebase.

## License

MIT — see [LICENSE](./LICENSE).

[Versión en español](./README.md)
