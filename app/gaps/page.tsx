import Link from "next/link";
import { gapsFromCasos, listCasosSync } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      {gaps.length === 0 && (
        <p className="text-sm text-muted-foreground">Sin gaps.</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gaps.map((g) => (
          <Card key={g.caso_id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                <Link
                  href={`/casos/${g.caso_id}`}
                  className="text-foreground no-underline hover:text-primary"
                >
                  {g.caso_id}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-wrap gap-1.5">
                {g.campos.map((c) => (
                  <li key={c}>
                    <Badge variant="warn">{c}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
