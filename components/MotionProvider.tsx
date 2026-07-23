"use client";

import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/** Carga diferida de features de Motion (~30kb menos en el path crítico). */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
