import { listInstitucionesSync } from "@/lib/data";
import { getPaisMeta } from "@/lib/countries";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { PoderMapLoader } from "@/components/PoderMapLoader";

export default async function PoderPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const instituciones = listInstitucionesSync(country);
  const pais = getPaisMeta(country);

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
        <PoderMapLoader
          instituciones={instituciones}
          country={country}
          rootLabel={pais?.nombre_corto ?? "Mapa de poder"}
        />
      )}
    </main>
  );
}
