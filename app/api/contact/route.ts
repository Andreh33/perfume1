import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { consume } from "@/lib/rate-limit";
import { env } from "@/lib/env";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = await consume("contact", ip);
  if (!limit.success) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const data = await req.formData();
  const parsed = schema.safeParse({
    name: data.get("name"),
    email: data.get("email"),
    subject: data.get("subject"),
    message: data.get("message"),
  });
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/contacto?status=error", req.url), 303);
  }

  if (env.RESEND_API_KEY) {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: "hola@solperfumesarabes.com",
      replyTo: parsed.data.email,
      subject: `[Contacto] ${parsed.data.subject}`,
      text: `${parsed.data.message}\n\n— ${parsed.data.name} <${parsed.data.email}>`,
    });
  }

  return NextResponse.redirect(new URL("/contacto?status=ok", req.url), 303);
}
