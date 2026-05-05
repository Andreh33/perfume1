import { NextResponse } from "next/server";
import ical from "ical-generator";
import { prisma } from "@/lib/prisma";
import { pickI18n } from "@/lib/utils";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  const fairs = await prisma.perfumeFair.findMany({
    where: {
      deletedAt: null,
      status: { not: "CANCELLED" },
      ...(slug ? { slug } : {}),
    },
    orderBy: { startDate: "asc" },
  });

  const calendar = ical({
    name: "Sol Perfumes Árabes — Ferias",
    description: "Calendario de ferias y eventos de perfumería",
    prodId: { company: "Sol Perfumes Árabes", product: "Calendar", language: "ES" },
    timezone: "Europe/Madrid",
    url: `${env.NEXT_PUBLIC_APP_URL}/ferias`,
    ttl: 60 * 60,
  });

  for (const fair of fairs) {
    calendar.createEvent({
      id: fair.id,
      start: fair.startDate,
      end: fair.endDate,
      allDay: fair.allDay,
      summary: pickI18n(fair.title, "es"),
      description: pickI18n(fair.description, "es"),
      location: [fair.venue, fair.address, fair.city, fair.country].filter(Boolean).join(", "),
      url: `${env.NEXT_PUBLIC_APP_URL}/ferias/${fair.slug}`,
      ...(fair.lat && fair.lng ? { geo: { lat: fair.lat, lon: fair.lng } } : {}),
      organizer: { name: "Sol Perfumes Árabes", email: "hola@solperfumesarabes.com" },
    });
  }

  return new NextResponse(calendar.toString(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="sol-perfumes-ferias${slug ? `-${slug}` : ""}.ics"`,
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
