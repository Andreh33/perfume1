import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { formatDateRange, pickI18n } from "@/lib/utils";

export const runtime = "nodejs";
export const alt = "Sol Perfumes Árabes — Feria";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function FairOG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fair = await prisma.perfumeFair.findUnique({ where: { slug } });
  const title = fair ? pickI18n(fair.title, "es") : "Calendario de ferias";
  const dates = fair ? formatDateRange(fair.startDate, fair.endDate) : "";
  const where = fair ? `${fair.city}, ${fair.country}` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: fair?.coverImage
            ? `linear-gradient(135deg, oklch(0.14 0.015 60 / 0.85), oklch(0.14 0.015 60 / 0.6)), url(${fair.coverImage})`
            : "radial-gradient(ellipse at top, oklch(0.22 0.04 60), oklch(0.14 0.015 60) 70%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "oklch(0.96 0.010 80)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            color: "oklch(0.78 0.13 82)",
            fontSize: 18,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          ◆ Sol Perfumes Árabes — Feria ◆
        </div>
        <div
          style={{
            fontSize: 84,
            lineHeight: 1.05,
            fontStyle: "italic",
            background:
              "linear-gradient(135deg, oklch(0.55 0.10 70), oklch(0.86 0.15 88))",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 32,
            maxWidth: 950,
          }}
        >
          {title}
        </div>
        <div style={{ color: "oklch(0.72 0.015 75)", fontSize: 28, marginBottom: 8 }}>{dates}</div>
        <div style={{ color: "oklch(0.72 0.015 75)", fontSize: 28 }}>{where}</div>
      </div>
    ),
    size,
  );
}
