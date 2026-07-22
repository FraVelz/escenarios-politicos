import { ChartColumnIncreasing } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Marca unificada (header = favicon SVG).
 * Icono Lucide chart-column-increasing vía icons0, mismo set que la UI.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-primary/45 bg-[#141b24] text-primary",
        className,
      )}
      aria-hidden
    >
      <ChartColumnIncreasing className="size-4" strokeWidth={2} />
    </span>
  );
}
