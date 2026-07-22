import fs from "fs";
import path from "path";
import { MarkdownEvidence } from "@/components/MarkdownEvidence";
import { PageHeader } from "@/components/PageHeader";
import { markdownToHtml } from "@/lib/markdown";

export default async function EscenariosPage() {
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
