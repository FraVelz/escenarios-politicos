import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CasoLiveMetrics } from "@/components/CasoLiveMetrics";
import { CasoMencionesClient } from "@/components/CasoMencionesClient";
import { EvidenciaNivelBadge } from "@/components/EvidenciaBadge";
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
        <div className="flex flex-wrap items-center gap-3">
          <EvidenciaNivelBadge nivel={caso.evidencia_nivel} />
        </div>
        <h1 className="max-w-3xl text-2xl font-medium tracking-tight text-white sm:text-3xl md:text-4xl md:tracking-[-0.02em]">
          {caso.titulo}
        </h1>
        <p className="text-sm text-muted-foreground">{meta.join(" · ")}</p>
      </header>

      <div className="mb-8">
        <CasoLiveMetrics initial={caso} />
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
