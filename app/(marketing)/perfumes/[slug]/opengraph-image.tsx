import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { pickI18n } from "@/lib/utils";

export const runtime = "nodejs";
export const alt = "Sol Perfumes Árabes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProductOG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, isPublished: true, deletedAt: null },
    include: { images: { take: 1, orderBy: { position: "asc" } } },
  });

  const name = product ? pickI18n(product.name, "es") : "Sol Perfumes Árabes";
  const family = product?.family.replace(/_/g, " · ") ?? "";
  const cover = product?.images[0]?.url;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(ellipse at 30% 30%, oklch(0.22 0.04 60), oklch(0.14 0.015 60) 70%)",
          fontFamily: "Georgia, serif",
        }}
      >
        {cover && (
          <div style={{ width: "44%", display: "flex" }}>
            <img
              src={cover}
              alt=""
              width={528}
              height={630}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "44%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent 60%, oklch(0.14 0.015 60))",
              }}
            />
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 80,
            width: cover ? "56%" : "100%",
            color: "oklch(0.96 0.010 80)",
          }}
        >
          <div
            style={{
              color: "oklch(0.78 0.13 82)",
              fontSize: 18,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            ◆ Sol Perfumes Árabes ◆
          </div>
          <div
            style={{
              fontSize: cover ? 84 : 110,
              lineHeight: 1.05,
              fontStyle: "italic",
              background:
                "linear-gradient(135deg, oklch(0.55 0.10 70), oklch(0.86 0.15 88))",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 24,
            }}
          >
            {name}
          </div>
          <div style={{ color: "oklch(0.72 0.015 75)", fontSize: 24, textTransform: "capitalize" }}>{family}</div>
        </div>
      </div>
    ),
    size,
  );
}
