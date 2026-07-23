import { listEscenariosSync, listSenalesSync } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { EscenariosLive } from "@/components/EscenariosLive";

export default async function EscenariosPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const escenarios = listEscenariosSync(country);
  const senales = listSenalesSync(country);

  return (
    <main>
      <PageHeader
        title="Escenarios y señales"
        description="Base / optimista / pesimista. Credibilidad de casos ≠ probabilidad de escenario. Sin fuente → N/D."
      />
      <EscenariosLive
        initialEscenarios={escenarios}
        initialSenales={senales}
      />
    </main>
  );
}
