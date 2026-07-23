"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("./CredibilidadDesgloseChartInner"), {
  ssr: false,
  loading: () => (
    <div className="h-44 w-full border border-border bg-muted/20" aria-hidden />
  ),
});

export function CredibilidadDesgloseChart(props: {
  especificidad: number;
  repeticion_norm: number;
  centralidad: number;
}) {
  return <Chart {...props} />;
}
