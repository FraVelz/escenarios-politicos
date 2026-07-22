import fs from "fs";
import path from "path";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function EscenariosPage() {
  const file = path.join(
    process.cwd(),
    "content/informes/colombia-2026-07-21.md",
  );
  const md = fs.readFileSync(file, "utf8");
  const start = md.indexOf("## 6. Escenarios");
  const end = md.indexOf("## 7.");
  const chunk = start >= 0 ? md.slice(start, end > 0 ? end : undefined) : md;

  return (
    <main>
      <PageHeader
        title="Escenarios"
        description="Extraído del informe Colombia 2026-07-21. Credibilidad de casos ≠ probabilidad de escenario."
      />
      <Card>
        <CardContent className="p-5 sm:p-6">
          <article className="prose-dashboard">
            <pre className="m-0 whitespace-pre-wrap border-0 bg-transparent p-0 font-sans text-sm leading-relaxed text-foreground">
              {chunk}
            </pre>
          </article>
        </CardContent>
      </Card>
    </main>
  );
}
