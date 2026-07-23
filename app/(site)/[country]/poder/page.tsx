import Link from "next/link";
import { listInstitucionesSync } from "@/lib/data";
import { countryPath } from "@/lib/countries";
import { CAPA_LABELS, CAPA_ORDER } from "@/lib/poder";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

export default async function PoderPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const instituciones = listInstitucionesSync(country);

  return (
    <main>
      <PageHeader
        title="Mapa de poder"
        description="Capas institucionales y veto points. Sin fuente fiable → N/D. No inventa composición ni cifras."
      />

      {instituciones.length === 0 ? (
        <EmptyState
          title="Sin instituciones"
          description="N/D — aún no hay mapa de poder para este país."
        />
      ) : (
        <div className="space-y-10">
          {CAPA_ORDER.map((capa) => {
            const items = instituciones.filter((i) => i.capa === capa);
            return (
              <section key={capa} aria-labelledby={`capa-${capa}`}>
                <h2
                  id={`capa-${capa}`}
                  className="mb-3 text-lg font-medium tracking-tight text-white"
                >
                  {CAPA_LABELS[capa]}
                </h2>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">N/D en esta capa.</p>
                ) : (
                  <ul className="divide-y divide-border border-y border-border">
                    {items.map((inst) => (
                      <li key={inst.id} className="space-y-2 py-4">
                        <h3 className="text-base font-medium text-white">
                          {inst.nombre}
                        </h3>
                        <p className="text-sm text-muted-foreground">{inst.rol}</p>
                        <p className="text-sm text-bone">
                          Veto: {inst.veto_notes || "N/D"}
                        </p>
                        {inst.caso_ids.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Casos:{" "}
                            {inst.caso_ids.map((cid, i) => (
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
                        {inst.fuentes.length > 0 && (
                          <ul className="space-y-1">
                            {inst.fuentes.map((f) => (
                              <li
                                key={f.url}
                                className="text-xs text-muted-foreground"
                              >
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
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
