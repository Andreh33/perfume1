import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 text-center">
      <div className="max-w-lg space-y-6">
        <p className="accent text-[0.7rem] text-[var(--color-gold)]">404</p>
        <h1 className="display text-5xl md:text-7xl">Esta esencia se ha evaporado</h1>
        <p className="text-lg text-[var(--color-ink-muted)]">
          La página que buscas ya no está disponible. Quizá te interesen nuestros perfumes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/perfumes" className="btn-primary">Ver perfumes</Link>
          <Link href="/" className="btn-ghost">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
