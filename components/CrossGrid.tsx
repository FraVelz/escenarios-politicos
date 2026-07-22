import * as React from "react";
import { cn } from "@/lib/utils";

type CrossGridProps = React.ComponentProps<"div"> & {
  cols?: 1 | 2 | 3 | 4;
};

/**
 * Rejilla sharp sin gap: bordes compartidos + cruces charcoal en intersecciones.
 */
export function CrossGrid({
  className,
  cols = 4,
  children,
  ...props
}: CrossGridProps) {
  const colsClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : cols === 3
          ? "grid-cols-1 sm:grid-cols-3"
          : "grid-cols-2 lg:grid-cols-4";

  return (
    <div
      data-slot="cross-grid"
      className={cn("cross-grid", colsClass, className)}
      style={
        {
          "--cross-cols": cols,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}

export function CrossCell({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="cross-cell"
      className={cn("cross-cell group/cell", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/** Fila full-bleed dentro de una CrossGrid de N columnas (span all). */
export function CrossRow({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="cross-row"
      className={cn("cross-cell cross-row col-span-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}
