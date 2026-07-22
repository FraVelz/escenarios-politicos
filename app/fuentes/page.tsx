import fs from "fs";
import path from "path";
import { FuentesMencionesClient } from "@/components/FuentesMencionesClient";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { listCasosSync, listMencionesSync } from "@/lib/data";

export default function FuentesPage() {
  const file = path.join(process.cwd(), "docs/colombia/01-fuentes.md");
  const md = fs.readFileSync(file, "utf8");
  const casos = listCasosSync();
  const menciones = listMencionesSync();

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
      <Card>
        <CardContent className="p-5">
          <pre className="prose-dashboard m-0 whitespace-pre-wrap font-mono text-xs text-foreground">
            {md}
          </pre>
        </CardContent>
      </Card>
    </main>
  );
}
