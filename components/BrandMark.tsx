import { ChartColumnIncreasing } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Marca unificada (header = favicon SVG).
 * Contenedor sharp: void + hairline; acento iris en el trazo.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-none border border-border bg-black text-iris",
        className,
      )}
      aria-hidden
    >
      <ChartColumnIncreasing className="size-4" strokeWidth={2} />
    </span>
  );
}
