import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { SignInForm } from "./SignInForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Iniciar sesión", path: "/cuenta/iniciar-sesion", noindex: true });

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md card-velvet p-8 md:p-10 space-y-7">
        <div className="text-center space-y-3">
          <Logo compact className="justify-center" />
          <h1 className="display text-3xl">Bienvenida de nuevo</h1>
          <p className="text-sm text-[var(--color-ink-muted)]">Accede a tu cuenta para ver pedidos y favoritos.</p>
        </div>

        <SignInForm />

        <p className="text-center text-xs text-[var(--color-ink-subtle)]">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/cuenta/registro" className="text-[var(--color-gold)] hover:underline">
            Crea una en 30 s
          </Link>
        </p>
      </div>
    </div>
  );
}
