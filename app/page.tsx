import Link from "next/link";
import { listAlertasSync, listCasosSync, gapsFromCasos } from "@/lib/data";
import { CasosHomeClient } from "@/components/CasosHomeClient";

export default function HomePage() {
  const casos = listCasosSync();
  const alertas = listAlertasSync();
  const gaps = gapsFromCasos(casos);
  const identidad = casos.filter((c) => c.discurso_identidad);
  const topCred = [...casos].sort((a, b) => b.credibilidad - a.credibilidad).slice(0, 3);

  return (
    <main>
      <h1>Colombia — casos y credibilidad</h1>
      <p className="muted">
        Credibilidad % = especificidad × repetición × centralidad (no es probabilidad de
        cumplimiento). Datos: Firestore + seed local.
      </p>

      <CasosHomeClient
        initialCasos={casos}
        identidad={identidad}
        topCred={topCred}
        alertas={alertas}
        gapsCount={gaps.length}
      />

      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/casos">Ver todos los casos →</Link>
      </p>
    </main>
  );
}
