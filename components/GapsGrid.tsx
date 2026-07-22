"use client";

import Link from "next/link";
import { CrossCell, CrossGrid } from "@/components/CrossGrid";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

type GapItem = { caso_id: string; campos: string[] };

export function GapsGrid({ gaps }: { gaps: GapItem[] }) {
  if (gaps.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin gaps.</p>;
  }

  return (
    <CrossGrid cols={1} className="grid-cols-1">
      {gaps.map((g) => (
        <CrossCell
          key={g.caso_id}
          className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
        >
          <Link
            href={`/casos/${g.caso_id}`}
            className={cn(
              "font-mono text-sm text-white no-underline hover:text-iris-glow",
              focusRingInline,
            )}
          >
            {g.caso_id}
          </Link>
          <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-warn">
            {g.campos.map((c) => (
              <li key={c}>
                <span className="text-muted-foreground">N/D · </span>
                {c}
              </li>
            ))}
          </ul>
        </CrossCell>
      ))}
    </CrossGrid>
  );
}
