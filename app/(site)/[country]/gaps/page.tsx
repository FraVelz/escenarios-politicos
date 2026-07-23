import { gapsFromCasos, listCasosSync } from "@/lib/data";
import { GapsIngestErrors } from "@/components/GapsIngestErrors";
import { GapsOpsSummary } from "@/components/GapsOpsSummary";
import { PageHeader } from "@/components/PageHeader";
import { GapsCasosLive } from "@/components/GapsCasosLive";

export default async function GapsPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const seedGaps = gapsFromCasos(listCasosSync(country));

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
            o lista de pendientes. También errores de ingest y operación del
            pipeline.
          </>
        }
      />
      <GapsCasosLive initialGaps={seedGaps} />
      <GapsOpsSummary />
      <GapsIngestErrors />
    </main>
  );
}
