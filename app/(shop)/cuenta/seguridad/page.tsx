import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TotpPanel } from "./TotpPanel";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { totpEnabled: true, role: true, email: true },
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="display text-3xl">Seguridad</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">
          Protege tu cuenta con autenticación en dos pasos.
          {user?.role && user.role !== "CUSTOMER" && (
            <span className="block mt-1 text-[var(--color-warning)]">
              Como administrador, el 2FA es obligatorio.
            </span>
          )}
        </p>
      </header>

      <TotpPanel enabled={!!user?.totpEnabled} />
    </div>
  );
}
