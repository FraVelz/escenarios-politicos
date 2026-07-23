"use client";

import dynamic from "next/dynamic";
import type { Institucion } from "@/lib/types";

const PoderMap = dynamic(
  () => import("@/components/PoderMap").then((m) => m.PoderMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[min(62vh,560px)] w-full animate-pulse border border-border bg-muted/30" />
    ),
  },
);

export function PoderMapLoader(props: {
  instituciones: Institucion[];
  country: string;
  rootLabel?: string;
}) {
  return <PoderMap {...props} />;
}
