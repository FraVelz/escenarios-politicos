"use client";

import Link from "next/link";
import { AREA_ORDER, areaLabel } from "@/lib/areas";
import type { Caso } from "@/lib/types";
import { CasoFlags } from "@/components/CasoFlags";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeIn } from "@/components/motion";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

function CasosTable({ casos }: { casos: Caso[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Caso</TableHead>
              <TableHead className="w-20">Cred.%</TableHead>
              <TableHead className="w-24">Menciones</TableHead>
              <TableHead className="w-20">Espec.</TableHead>
              <TableHead>Importancia</TableHead>
              <TableHead>Factibilidad</TableHead>
              <TableHead>Flags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {casos.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <Link
                    href={`/casos/${c.id}`}
                    className={cn(
                      "font-medium text-foreground no-underline hover:text-primary",
                      focusRingInline,
                    )}
                  >
                    {c.titulo}
                  </Link>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    <Link
                      href="/fuentes"
                      className={cn("hover:underline", focusRingInline)}
                    >
                      ver fuentes
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono font-semibold tabular-nums">
                    {c.credibilidad}
                  </span>
                </TableCell>
                <TableCell className="tabular-nums">{c.n_menciones}</TableCell>
                <TableCell className="tabular-nums">{c.especificidad}</TableCell>
                <TableCell>{c.importancia}</TableCell>
                <TableCell>{c.factibilidad}</TableCell>
                <TableCell>
                  <CasoFlags c={c} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function CasosPageClient({ all }: { all: Caso[] }) {
  const byArea = AREA_ORDER.map((area) => ({
    area,
    casos: all
      .filter((c) => c.area === area)
      .sort((a, b) => b.credibilidad - a.credibilidad),
  })).filter((g) => g.casos.length > 0);

  const sinArea = all.filter((c) => !c.area || !AREA_ORDER.includes(c.area));

  const tabs = [
    ...byArea.map(({ area, casos }) => ({
      id: area,
      label: areaLabel(area),
      count: casos.length,
      casos,
    })),
    ...(sinArea.length > 0
      ? [
          {
            id: "sin-area",
            label: "Sin área",
            count: sinArea.length,
            casos: [...sinArea].sort((a, b) => b.credibilidad - a.credibilidad),
          },
        ]
      : []),
  ];

  const defaultTab = tabs[0]?.id ?? "all";

  return (
    <main>
      <PageHeader
        title="Casos"
        description="Agrupados por área. Dentro de cada área: credibilidad %, frecuencia y factibilidad."
      >
        <p className="text-sm text-muted-foreground">
          {all.length} casos · {byArea.length} áreas
        </p>
      </PageHeader>

      {tabs.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin casos.</p>
      ) : (
        <Tabs defaultValue={defaultTab}>
          <TabsList className="flex h-auto max-w-full flex-wrap justify-start">
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
                <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                  {t.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.id} value={t.id}>
              <FadeIn y={6}>
                <CasosTable casos={t.casos} />
              </FadeIn>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </main>
  );
}
