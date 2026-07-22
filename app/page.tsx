import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listAlertasSync, listCasosSync, gapsFromCasos } from "@/lib/data";
import { CasosHomeClient } from "@/components/CasosHomeClient";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const casos = listCasosSync();
  const alertas = listAlertasSync();
  const gaps = gapsFromCasos(casos);
  const identidad = casos.filter((c) => c.discurso_identidad);
  const topCred = [...casos]
    .sort((a, b) => b.credibilidad - a.credibilidad)
    .slice(0, 3);

  return (
    <main>
      <PageHeader
        title="Colombia — casos y credibilidad"
        description="Credibilidad % = especificidad × repetición × centralidad (no es probabilidad de cumplimiento). Datos: Firestore + seed local."
      />

      <CasosHomeClient
        initialCasos={casos}
        identidad={identidad}
        topCred={topCred}
        alertas={alertas}
        gapsCount={gaps.length}
      />

      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/casos">
            Ver todos los casos
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </main>
  );
}
