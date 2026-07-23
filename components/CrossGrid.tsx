"use client";

import * as React from "react";
import { m, type HTMLMotionProps } from "motion/react";
import { CROSS_CELL, CROSS_GRID } from "@/lib/styles";
import { cn } from "@/lib/utils";

type CrossGridProps = HTMLMotionProps<"div"> & {
  cols?: 1 | 2 | 3 | 4;
};

/**
 * Rejilla sharp sin gap — m.div para stagger / reveal.
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
    <m.div
      data-slot="cross-grid"
      className={cn(CROSS_GRID, colsClass, className)}
      {...props}
    >
      {children}
    </m.div>
  );
}

export function CrossCell({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <m.div
      data-slot="cross-cell"
      className={cn(CROSS_CELL, className)}
      {...props}
    >
      {children}
    </m.div>
  );
}
