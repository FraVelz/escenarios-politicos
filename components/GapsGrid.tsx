"use client";

import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

type GapItem = { caso_id: string; campos: string[] };

export function GapsGrid({ gaps }: { gaps: GapItem[] }) {
  if (gaps.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin gaps.</p>;
  }

  return (
    <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" gap={0.05}>
      {gaps.map((g) => (
        <StaggerItem key={g.caso_id}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                <Link
                  href={`/casos/${g.caso_id}`}
                  className={cn(
                    "text-foreground no-underline hover:text-primary",
                    focusRingInline,
                  )}
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
        </StaggerItem>
      ))}
    </Stagger>
  );
}
