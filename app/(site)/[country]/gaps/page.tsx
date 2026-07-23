import { gapsFromCasos, listCasosSync } from "@/lib/data";
import { GapsGrid } from "@/components/GapsGrid";
import { GapsIngestErrors } from "@/components/GapsIngestErrors";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export default async function GapsPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const gaps = gapsFromCasos(listCasosSync(country));

  return (
    <main>
      <PageHeader
        title="Gaps / campos pendientes"
        description={
          <>
            Nada se omite: lo incompleto aparece aquí como{" "}
            <code className="rounded-none border border-border px-1.5 py-0.5 font-mono text-sm text-iris">
              N/D
            </code>{" "}
            o lista de pendientes. También errores de ingest del pipeline.
          </>
        }
      />
      {gaps.length === 0 ? (
        <EmptyState
          title="Sin gaps de casos"
          description="Todos los casos tienen importancia y factibilidad asignadas."
        />
      ) : (
        <GapsGrid gaps={gaps} />
      )}
      <GapsIngestErrors />
    </main>
  );
}
