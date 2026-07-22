import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const alt = "Escenarios Colombia — Casos y credibilidad del discurso";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BRAND.pageBg,
          padding: 64,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: BRAND.bg,
              border: `1px solid ${BRAND.accent}73`,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 4,
              paddingBottom: 12,
            }}
          >
            <div
              style={{
                width: 6,
                height: 12,
                background: BRAND.accent,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                width: 6,
                height: 18,
                background: BRAND.accent,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                width: 6,
                height: 26,
                background: BRAND.accent,
                borderRadius: 2,
              }}
            />
          </div>
          <span style={{ color: "#8b9aab", fontSize: 22 }}>
            Análisis político
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              color: BRAND.fg,
              fontSize: 64,
              fontWeight: 650,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Escenarios Colombia
          </div>
          <div style={{ color: "#8b9aab", fontSize: 28, maxWidth: 720 }}>
            Casos y credibilidad del discurso
          </div>
        </div>
        <div
          style={{
            height: 4,
            width: 120,
            background: BRAND.accent,
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
