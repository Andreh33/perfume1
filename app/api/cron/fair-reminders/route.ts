import { NextResponse } from "next/server";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { email } from "@/lib/email";
import { assertCronAuth } from "@/lib/cron";
import { pickI18n, fairStatusFromDates } from "@/lib/utils";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COUNTRY_NAMES: Record<string, string> = {
  ES: "España",
  FR: "Francia",
  IT: "Italia",
  PT: "Portugal",
  DE: "Alemania",
  GB: "Reino Unido",
  US: "Estados Unidos",
  AE: "Emiratos Árabes Unidos",
};

export async function GET() {
  try {
    await assertCronAuth();
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 401 });
  }

  // Ferias que empiezan en los próximos 7-14 días
  const start = new Date();
  start.setDate(start.getDate() + 7);
  const end = new Date();
  end.setDate(end.getDate() + 14);

  const fairs = await prisma.perfumeFair.findMany({
    where: {
      deletedAt: null,
      startDate: { gte: start, lte: end },
    },
  });

  const upcoming = fairs.filter((f) => fairStatusFromDates(f.startDate, f.endDate) === "UPCOMING");

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { consent: true, unsubscribedAt: null },
    select: { email: true, locale: true },
    take: 500,
  });

  let sent = 0;
  for (const fair of upcoming) {
    for (const sub of subscribers) {
      const r = await email.fairReminder({
        to: sub.email,
        fairTitle: pickI18n(fair.title, sub.locale ?? "es"),
        city: fair.city,
        country: COUNTRY_NAMES[fair.country] ?? fair.country,
        startDate: format(fair.startDate, "d 'de' MMMM", { locale: es }),
        fairUrl: `${env.NEXT_PUBLIC_APP_URL}/ferias/${fair.slug}`,
      });
      if (r.ok) sent++;
    }
  }

  return NextResponse.json({ fairs: upcoming.length, subscribers: subscribers.length, sent });
}
