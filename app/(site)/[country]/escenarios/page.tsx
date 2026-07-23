import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MarkdownEvidence } from "@/components/MarkdownEvidence";
import { PageHeader } from "@/components/PageHeader";
import { isCountryAvailableSync } from "@/lib/countries";
import { markdownToHtml } from "@/lib/markdown";

export default async function EscenariosPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  if (!isCountryAvailableSync(country)) notFound();

  // MVP: informe Colombia; otros países → N/D cuando no exista pack
  if (country !== "co") {
    return (
      <main>
        <PageHeader
          title="Escenarios"
          description="Sin informe de escenarios para este país (N/D)."
        />
      </main>
    );
  }

  const filePath = "content/informes/colombia-2026-07-21.md";
  const file = path.join(process.cwd(), filePath);
  const md = fs.readFileSync(file, "utf8");
  const start = md.indexOf("## 6. Escenarios");
  const end = md.indexOf("## 7.");
  const chunk = start >= 0 ? md.slice(start, end > 0 ? end : undefined) : md;
  const html = await markdownToHtml(chunk);

  return (
    <main>
      <PageHeader
        title="Escenarios"
        description="Extraído del informe Colombia 2026-07-21. Credibilidad de casos ≠ probabilidad de escenario."
      />
      <MarkdownEvidence
        markdown={chunk}
        html={html}
        file={`${filePath} · §6`}
      />
    </main>
  );
}
