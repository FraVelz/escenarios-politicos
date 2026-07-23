import { notFound } from "next/navigation";
import {
  getMarcoSync,
  listAlertasSync,
  listCasosSync,
  listSenalesSync,
  gapsFromCasos,
} from "@/lib/data";
import { getPaisMeta } from "@/lib/countries";
import { HomeSituacional } from "@/components/HomeSituacional";

export default async function CountryHomePage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const pais = getPaisMeta(country);
  const marco = getMarcoSync(country);
  if (!marco || !pais) notFound();

  const casos = listCasosSync(country);
  const alertas = listAlertasSync(country);
  const senales = listSenalesSync(country);
  const gaps = gapsFromCasos(casos);
  const identidad = casos.filter((c) => c.discurso_identidad);
  const topCred = [...casos]
    .sort((a, b) => b.credibilidad - a.credibilidad)
    .slice(0, 3);

  return (
    <main>
      <HomeSituacional
        paisNombre={pais.nombre}
        marco={marco}
        identidad={identidad}
        topCred={topCred}
        alertas={alertas}
        gapsCount={gaps.length}
        senales={senales}
        casos={casos}
      />
    </main>
  );
}
