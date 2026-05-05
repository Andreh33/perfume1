"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBackupCodes, generateTotpSecret, verifyTotp } from "@/lib/totp";

export async function startTotpEnrollAction() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return { ok: false as const, error: "No autorizado" };

  const { base32, otpauthUrl } = generateTotpSecret(session.user.email);

  // Guarda el secret pendiente en una cookie HTTP-only — para evitar persistir
  // antes de verificar, lo escribimos en el user pero con totpEnabled=false.
  await prisma.user.update({
    where: { id: session.user.id },
    data: { totpSecret: base32, totpEnabled: false },
  });

  return { ok: true as const, otpauthUrl, base32 };
}

const verifySchema = z.object({ token: z.string().regex(/^\d{6}$/, "El código debe tener 6 dígitos") });

export async function confirmTotpEnrollAction(input: { token: string }) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "No autorizado" };

  const parsed = verifySchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Código no válido" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.totpSecret) return { ok: false as const, error: "No hay 2FA pendiente" };

  if (!verifyTotp(user.totpSecret, parsed.data.token)) {
    return { ok: false as const, error: "El código no es correcto" };
  }

  const backupCodes = generateBackupCodes(10);

  await prisma.user.update({
    where: { id: user.id },
    data: { totpEnabled: true, backupCodes },
  });

  revalidatePath("/cuenta/seguridad");
  return { ok: true as const, backupCodes };
}

export async function disableTotpAction(input: { token: string }) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "No autorizado" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.totpEnabled || !user.totpSecret) return { ok: false as const, error: "El 2FA no está activo" };
  if (!verifyTotp(user.totpSecret, input.token)) {
    return { ok: false as const, error: "El código no es correcto" };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { totpEnabled: false, totpSecret: null, backupCodes: [] },
  });
  revalidatePath("/cuenta/seguridad");
  return { ok: true as const };
}
