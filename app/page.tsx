import Link from "next/link";
import { listAlertasSync, listCasosSync, gapsFromCasos } from "@/lib/data";
import { CasosHomeClient } from "@/components/CasosHomeClient";
import { FadeIn } from "@/components/motion";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

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
      <FadeIn className="mb-10 space-y-4">
        <h1 className="max-w-3xl text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl md:leading-[1.1] md:tracking-[-0.03em]">
          Colombia — casos y credibilidad
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          Credibilidad % = especificidad × repetición × centralidad (no es
          probabilidad de cumplimiento). Datos: Firestore + seed local.
        </p>
        <Link
          href="/casos"
          className={cn(
            "inline-flex text-sm text-bone no-underline hover:text-white",
            focusRingInline,
          )}
        >
          Ver todos los casos →
        </Link>
      </FadeIn>

      <CasosHomeClient
        initialCasos={casos}
        identidad={identidad}
        topCred={topCred}
        alertas={alertas}
        gapsCount={gaps.length}
      />
    </main>
  );
}
