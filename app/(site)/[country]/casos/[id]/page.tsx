import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CasoCredibilidadPanel } from "@/components/CasoCredibilidadPanel";
import { CasoMetricsGrid } from "@/components/CasoMetricsGrid";
import { CasoMencionesClient } from "@/components/CasoMencionesClient";
import { areaLabel } from "@/lib/areas";
import { countryPath } from "@/lib/countries";
import { getCasoSync, listMencionesSync } from "@/lib/data";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

export default async function CasoDetailPage({
  params,
}: {
  params: Promise<{ country: string; id: string }>;
}) {
  const { country, id } = await params;
  const caso = getCasoSync(id, country);
  if (!caso) notFound();
  const menciones = listMencionesSync({ casoId: id, countryId: country });
  const d = caso.credibilidad_desglose;

  const meta = [
    caso.discurso_identidad ? "discurso identidad" : null,
    areaLabel(caso.area),
    caso.fase,
    `revisión: ${caso.revision}`,
  ].filter(Boolean);

  return (
    <main>
      <Link
        href={countryPath(country, "/casos")}
        className={cn(
          "mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-white",
          focusRingInline,
        )}
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Casos
      </Link>

      <header className="mb-8 space-y-3">
        <h1 className="max-w-3xl text-2xl font-medium tracking-tight text-white sm:text-3xl md:text-4xl md:tracking-[-0.02em]">
          {caso.titulo}
        </h1>
        <p className="text-sm text-muted-foreground">{meta.join(" · ")}</p>
      </header>

      <div className="mb-8 grid gap-0 md:grid-cols-2">
        <div className="md:pr-0">
          <CasoCredibilidadPanel
            credibilidad={caso.credibilidad}
            especificidad={d.especificidad}
            repeticion_norm={d.repeticion_norm}
            centralidad={d.centralidad}
          />
        </div>
        <div className="md:-ml-px">
          <CasoMetricsGrid
            n_menciones={caso.n_menciones}
            especificidad={caso.especificidad}
            importancia={caso.importancia}
            factibilidad={caso.factibilidad}
            funcion_retorica={caso.funcion_retorica}
          />
        </div>
      </div>

      {caso.notas && (
        <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
          {caso.notas}
        </p>
      )}

      <CasoMencionesClient casoId={id} initial={menciones} />
    </main>
  );
}
