import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141b24",
          borderRadius: 8,
          border: "1px solid rgba(61,156,253,0.45)",
          color: "#e8eef4",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        EC
      </div>
    ),
    { ...size },
  );
}
