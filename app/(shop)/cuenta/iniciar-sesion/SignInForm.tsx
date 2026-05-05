"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: data.get("email"),
      password: data.get("password"),
      redirect: false,
    });
    setPending(false);
    if (result?.error) setError("Email o contraseña incorrectos.");
    else window.location.assign("/cuenta");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="accent text-[0.65rem] text-[var(--color-gold)]">Email</span>
        <Input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="block space-y-1.5">
        <span className="accent text-[0.65rem] text-[var(--color-gold)]">Contraseña</span>
        <Input name="password" type="password" required autoComplete="current-password" />
      </label>

      {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Iniciar sesión
      </Button>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/cuenta" })}
        className="btn-ghost w-full"
      >
        Continuar con Google
      </button>
    </form>
  );
}
