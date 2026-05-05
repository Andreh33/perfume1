"use client";

import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 text-center">
      <div className="max-w-lg space-y-6">
        <p className="accent text-[0.7rem] text-[var(--color-danger)]">Error</p>
        <h1 className="display text-4xl md:text-5xl">Algo se ha torcido</h1>
        <p className="text-lg text-[var(--color-ink-muted)]">
          Hemos registrado el problema. Si vuelve a ocurrir, escríbenos a hola@solperfumesarabes.com.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={reset} className="btn-primary">Reintentar</button>
          <Link href="/" className="btn-ghost">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
