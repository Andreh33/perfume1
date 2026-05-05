import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { consume } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email().max(254),
  consent: z.string().optional(),
  locale: z.string().optional(),
});

export const runtime = "nodejs";

async function getIP(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  const ip = await getIP(req);
  const limit = await consume("newsletter", ip);
  if (!limit.success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const formData = await req.formData();
  const parsed = schema.safeParse({
    email: formData.get("email"),
    consent: formData.get("consent"),
    locale: formData.get("locale") ?? "es",
  });
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/?newsletter=error", req.url), 303);
  }
  if (!parsed.data.consent) {
    return NextResponse.redirect(new URL("/?newsletter=consent", req.url), 303);
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    update: { consent: true, consentIp: ip, unsubscribedAt: null },
    create: {
      email: parsed.data.email.toLowerCase(),
      consent: true,
      consentIp: ip,
      locale: parsed.data.locale ?? "es",
      source: "footer",
    },
  });

  return NextResponse.redirect(new URL("/?newsletter=ok", req.url), 303);
}
