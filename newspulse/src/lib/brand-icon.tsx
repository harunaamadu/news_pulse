import { ImageResponse } from "next/og";

// Satori doesn't support oklch, so this is the hex equivalent of --brand
const BRAND_HEX = "#372aac";

export function createBrandIcon(px: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_HEX,
          color: "#ffffff",
          fontSize: Math.round(px * 0.6),
          fontWeight: 700,
        }}
      >
        N
      </div>
    ),
    { width: px, height: px },
  );
}