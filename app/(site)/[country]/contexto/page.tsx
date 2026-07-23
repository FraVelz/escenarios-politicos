import { notFound } from "next/navigation";
import { getMarcoSync, listIndicadoresSync } from "@/lib/data";
import { ContextoTransicion } from "@/components/ContextoTransicion";
import { IndicadoresPanel } from "@/components/IndicadoresPanel";
import { PageHeader } from "@/components/PageHeader";

export default async function ContextoPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const marco = getMarcoSync(country);
  if (!marco) notFound();
  const indicadores = listIndicadoresSync(country);

  return (
    <main>
      <PageHeader
        title="Contexto"
        description="Quién gobierna, quién viene, timeline de transición, contraste por ejes e indicadores macro — con fuentes o N/D."
      />
      <div className="mb-12">
        <IndicadoresPanel initial={indicadores} />
      </div>
      <ContextoTransicion marco={marco} />
    </main>
  );
}
