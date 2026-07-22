import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Misma geometría que BrandMark / icon.svg (barras crecientes) */
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
          background: BRAND.pageBg,
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 0,
            background: BRAND.bg,
            border: `2px solid ${BRAND.border}`,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 10,
            paddingBottom: 28,
            paddingLeft: 28,
            paddingRight: 28,
          }}
        >
          <div
            style={{
              width: 16,
              height: 36,
              background: BRAND.accent,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              width: 16,
              height: 56,
              background: BRAND.accent,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              width: 16,
              height: 80,
              background: BRAND.accent,
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
