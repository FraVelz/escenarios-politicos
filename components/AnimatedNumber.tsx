"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { SCORE_MONO } from "@/lib/styles";
import { cn } from "@/lib/utils";

/** Número animado sutil para % de credibilidad */
export function AnimatedNumber({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 700;
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduce]);

  return (
    <m.span
      className={cn(SCORE_MONO, "tabular-nums", className)}
      initial={reduce ? false : { opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {display}
      {suffix}
    </m.span>
  );
}
