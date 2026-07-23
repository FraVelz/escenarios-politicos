import Link from "next/link";
import { listActoresSync, listPartidosSync } from "@/lib/data";
import { countryPath } from "@/lib/countries";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export default async function ActoresPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const actores = listActoresSync(country);
  const partidos = Object.fromEntries(
    listPartidosSync(country).map((p) => [p.id, p.nombre]),
  );

  return (
    <main>
      <PageHeader
        title="Actores"
        description="Roles y vínculos a partidos/casos. Cada nombre con fuente o N/D."
      />
      {actores.length === 0 ? (
        <EmptyState
          title="Sin actores"
          description="N/D — no hay actores cargados para este país."
        />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {actores.map((a) => (
            <li key={a.id} className="space-y-2 py-5">
              <h2 className="text-lg font-medium text-white">{a.nombre}</h2>
              <p className="text-sm text-muted-foreground">
                {a.roles.join(" · ")}
                {a.partido_id
                  ? ` · ${partidos[a.partido_id] ?? a.partido_id}`
                  : " · partido N/D"}
              </p>
              {a.caso_ids.length > 0 && (
                <p className="text-sm">
                  {a.caso_ids.map((cid, i) => (
                    <span key={cid}>
                      {i > 0 ? " · " : ""}
                      <Link
                        href={countryPath(country, `/casos/${cid}`)}
                        className="text-iris no-underline hover:text-iris-glow"
                      >
                        {cid}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
              {a.fuentes.length === 0 ? (
                <p className="text-xs text-muted-foreground">Fuente: N/D</p>
              ) : (
                <ul className="space-y-1">
                  {a.fuentes.map((f) => (
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
