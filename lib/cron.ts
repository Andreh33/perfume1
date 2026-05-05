import "server-only";
import { headers } from "next/headers";
import { env } from "@/lib/env";

/**
 * Vercel Cron añade el header `authorization: Bearer ${CRON_SECRET}` cuando
 * está configurado. En desarrollo dejamos pasar para poder testear con curl.
 */
export async function assertCronAuth() {
  const h = await headers();
  const auth = h.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;

  if (env.NODE_ENV === "development" && !secret) return;
  if (!secret) throw new Error("CRON_SECRET no configurado");
  if (auth !== `Bearer ${secret}`) {
    throw new Error("Cron auth inválida");
  }
}
