import fs from "fs";
import path from "path";
import { FuentesMencionesClient } from "@/components/FuentesMencionesClient";
import { MarkdownEvidence } from "@/components/MarkdownEvidence";
import { PageHeader } from "@/components/PageHeader";
import { Separator } from "@/components/ui/separator";
import { listCasosSync, listMencionesSync } from "@/lib/data";
import { markdownToHtml } from "@/lib/markdown";

export default async function FuentesPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const filePath = "docs/colombia/01-fuentes.md";
  const file = path.join(process.cwd(), filePath);
  const md = fs.readFileSync(file, "utf8");
  const html = await markdownToHtml(md);
  const casos = listCasosSync(country);
  const menciones = listMencionesSync({ countryId: country });

  return (
    <main>
      <PageHeader
        title="Fuentes y menciones"
        description="Cada tema (caso) con sus citas y URL de origen. Lo que ingiere n8n aparece aquí cuando llega a Firestore."
      />

      <FuentesMencionesClient initialMenciones={menciones} casos={casos} />

      <Separator className="my-10" />

      <h2 className="mb-3 text-lg font-semibold tracking-tight">
        Catálogo de fuentes (metodología)
      </h2>
      <MarkdownEvidence markdown={md} html={html} file={filePath} />
    </main>
  );
}
