import { gapsFromCasos, listCasosSync } from "@/lib/data";
import { GapsGrid } from "@/components/GapsGrid";
import { PageHeader } from "@/components/PageHeader";

export default function GapsPage() {
  const gaps = gapsFromCasos(listCasosSync());

  return (
    <main>
      <PageHeader
        title="Gaps / campos pendientes"
        description={
          <>
            Nada se omite: lo incompleto aparece aquí como{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              N/D
            </code>{" "}
            o lista de pendientes.
          </>
        }
      />
      <GapsGrid gaps={gaps} />
    </main>
  );
}
