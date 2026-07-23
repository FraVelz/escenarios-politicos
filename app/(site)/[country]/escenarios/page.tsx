import { listEscenariosSync, listSenalesSync } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export default async function EscenariosPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const escenarios = listEscenariosSync(country);
  const senales = listSenalesSync(country);

  return (
    <main>
      <PageHeader
        title="Escenarios y señales"
        description="Base / optimista / pesimista. Credibilidad de casos ≠ probabilidad de escenario. Sin fuente → N/D."
      />

      {escenarios.length === 0 ? (
        <EmptyState
          title="Sin escenarios"
          description="N/D — no hay escenarios tipados para este país."
        />
      ) : (
        <section className="mb-12" aria-labelledby="escenarios-list">
          <h2
            id="escenarios-list"
            className="mb-4 text-lg font-medium tracking-tight text-white"
          >
            Escenarios
          </h2>
          <ul className="divide-y divide-border border-y border-border">
            {escenarios.map((e) => (
              <li key={e.id} className="space-y-2 py-5">
                <p className="text-xs uppercase tracking-[0.12em] text-iris">
                  {e.tipo} · {e.horizonte_dias}d
                </p>
                <h3 className="text-base font-medium text-white">{e.titulo}</h3>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  {e.resumen}
                </p>
                {e.fuente_url ? (
                  <a
                    href={e.fuente_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs text-smoke no-underline hover:text-white"
                  >
                    Fuente →
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Fuente: N/D
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="senales-list">
        <h2
          id="senales-list"
          className="mb-4 text-lg font-medium tracking-tight text-white"
        >
          Señales
        </h2>
        {senales.length === 0 ? (
          <EmptyState
            title="Sin señales"
            description="N/D — no hay señales cargadas."
          />
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {senales.map((s) => (
              <li key={s.id} className="space-y-1 py-4">
                <h3 className="text-base text-white">{s.titulo}</h3>
                <p className="text-sm text-muted-foreground">{s.detalle}</p>
                {s.fuente_url ? (
                  <a
                    href={s.fuente_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs text-smoke no-underline hover:text-white"
                  >
                    Fuente →
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Fuente: N/D
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
