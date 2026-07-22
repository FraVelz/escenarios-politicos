import { getMarcoSync } from "@/lib/data";
import { ContextoTransicion } from "@/components/ContextoTransicion";
import { PageHeader } from "@/components/PageHeader";

export default function ContextoPage() {
  const marco = getMarcoSync();

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
