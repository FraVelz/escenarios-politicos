import { listAlertasSync, listCasosSync, gapsFromCasos } from "@/lib/data";
import { CasosHomeClient } from "@/components/CasosHomeClient";
import { HomeHero } from "@/components/HomeHero";

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
      <HomeHero />
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
