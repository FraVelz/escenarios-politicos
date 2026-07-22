import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CasoCredibilidadPanel } from "@/components/CasoCredibilidadPanel";
import { CasoMencionesClient } from "@/components/CasoMencionesClient";
import { areaLabel } from "@/lib/areas";
import { getCasoSync, listMencionesSync } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function CasoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caso = getCasoSync(id);
  if (!caso) notFound();
  const menciones = listMencionesSync(id);
  const d = caso.credibilidad_desglose;

  return (
    <main>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/casos">
          <ArrowLeft />
          Casos
        </Link>
      </Button>

      <div className="mb-6 space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {caso.titulo}
        </h1>
        <div className="flex flex-wrap gap-1.5">
          {caso.discurso_identidad && (
            <Badge variant="identidad">discurso identidad</Badge>
          )}
          <Badge>{areaLabel(caso.area)}</Badge>
          <Badge>{caso.fase}</Badge>
          <Badge>revisión: {caso.revision}</Badge>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <CasoCredibilidadPanel
          credibilidad={caso.credibilidad}
          especificidad={d.especificidad}
          repeticion_norm={d.repeticion_norm}
          centralidad={d.centralidad}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Métricas</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Menciones</dt>
                <dd className="font-mono font-medium tabular-nums">
                  {caso.n_menciones}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Especificidad</dt>
                <dd className="font-mono font-medium tabular-nums">
                  {caso.especificidad}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Importancia</dt>
                <dd className="font-medium">{caso.importancia}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Factibilidad</dt>
                <dd className="font-medium">{caso.factibilidad}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">Función</dt>
                <dd className="font-medium">
                  {caso.funcion_retorica ?? "N/D"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {caso.notas && (
        <p className="mb-8 text-sm text-muted-foreground">{caso.notas}</p>
      )}

      <CasoMencionesClient casoId={id} initial={menciones} />
    </main>
  );
}
