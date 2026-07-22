import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c1117",
          borderRadius: 36,
          border: "3px solid rgba(61,156,253,0.4)",
          color: "#e8eef4",
          fontSize: 72,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "-0.05em",
        }}
      >
        EC
      </div>
    ),
    { ...size },
  );
}
