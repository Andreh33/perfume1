import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sol Perfumes Árabes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at top, oklch(0.22 0.04 60), oklch(0.14 0.015 60) 70%)",
          color: "oklch(0.96 0.010 80)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
            color: "oklch(0.78 0.13 82)",
            fontSize: 24,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          ◆ Sol Perfumes Árabes ◆
        </div>
        <div
          style={{
            fontSize: 96,
            fontStyle: "italic",
            lineHeight: 1.05,
            background: "linear-gradient(135deg, oklch(0.55 0.10 70), oklch(0.86 0.15 88))",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          El alma del oriente,
          <br />
          destilada en oro.
        </div>
        <div style={{ marginTop: 60, color: "oklch(0.72 0.015 75)", fontSize: 28 }}>
          Attar · Mukhallat · Oud · Bakhoor
        </div>
      </div>
    ),
    size,
  );
}
