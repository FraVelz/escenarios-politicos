import { ImageResponse } from "next/og";

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
          background: "#0c1117",
          padding: 64,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#141b24",
              border: "1px solid rgba(61,156,253,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#e8eef4",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            EC
          </div>
          <span style={{ color: "#8b9aab", fontSize: 22 }}>
            Análisis político
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              color: "#e8eef4",
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
            background: "#3d9cfd",
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
