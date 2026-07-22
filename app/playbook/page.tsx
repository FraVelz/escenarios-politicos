import Link from "next/link";
import { FileText } from "lucide-react";
import { PLAYBOOK_FILES } from "@/lib/playbook";
import { PageHeader } from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PlaybookIndexPage() {
  return (
    <main>
      <PageHeader
        title="Playbook Colombia"
        description="Manual del agente: datos, discurso, credibilidad, escenarios."
      />
      <div className="grid gap-2 sm:grid-cols-2">
        {PLAYBOOK_FILES.map((f) => (
          <Link
            key={f}
            href={`/playbook/${f.replace(/\.md$/, "")}`}
            className="block no-underline"
          >
            <Card className="transition-colors hover:border-primary/40 hover:bg-accent/30">
              <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <CardTitle className="font-mono text-sm font-medium text-foreground">
                  {f}
                </CardTitle>
              </CardHeader>
              <CardContent className="sr-only">Abrir documento</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
