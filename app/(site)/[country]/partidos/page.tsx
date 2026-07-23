import { listPartidosSync } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export default async function PartidosPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const partidos = listPartidosSync(country);

  return (
    <main>
      <PageHeader
        title="Partidos y fuerzas"
        description="Coalición y espectro solo con cita o N/D. Sin inventar ideologías."
      />
      {partidos.length === 0 ? (
        <EmptyState
          title="Sin partidos"
          description="N/D — no hay partidos cargados para este país."
        />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {partidos.map((p) => (
            <li key={p.id} className="space-y-2 py-5">
              <h2 className="text-lg font-medium text-white">{p.nombre}</h2>
              <p className="text-sm text-muted-foreground">
                Coalición: {p.coalicion} · Espectro: {p.espectro}
              </p>
              {p.fuentes.length === 0 ? (
                <p className="text-xs text-muted-foreground">Fuente: N/D</p>
              ) : (
                <ul className="space-y-1">
                  {p.fuentes.map((f) => (
                    <li key={f.url} className="text-xs text-muted-foreground">
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-smoke no-underline hover:text-white"
                      >
                        {f.medio}
                      </a>
                      {" · "}
                      {f.fecha}
                      {f.nota ? ` — ${f.nota}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
