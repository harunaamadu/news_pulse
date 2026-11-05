import { ImageResponse } from "next/og";

// Satori doesn't support oklch, so this is the hex equivalent of --brand
const BRAND_HEX = "#d7372b";

interface OgImageInput {
  title: string;
  eyebrow?: string;
}

export function createOgImage({ title, eyebrow }: OgImageInput) {
  const fontSize = title.length > 90 ? 52 : title.length > 60 ? 62 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              background: BRAND_HEX,
            }}
          />
          <span>NewsPulse</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 700,
                color: BRAND_HEX,
                textTransform: "uppercase",
                letterSpacing: 4,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize,
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}