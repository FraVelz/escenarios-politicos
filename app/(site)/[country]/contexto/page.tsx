import { notFound } from "next/navigation";
import { getMarcoSync } from "@/lib/data";
import { ContextoTransicion } from "@/components/ContextoTransicion";
import { PageHeader } from "@/components/PageHeader";

export default async function ContextoPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const marco = getMarcoSync(country);
  if (!marco) notFound();

  return (
    <main>
      <PageHeader
        title="Contexto"
        description="Quién gobierna, quién viene, timeline de transición y contraste por ejes — con fuentes o N/D."
      />
      <ContextoTransicion marco={marco} />
    </main>
  );
}
