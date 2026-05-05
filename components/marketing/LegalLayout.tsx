import { format } from "date-fns";

export function LegalLayout({
  title,
  updated = new Date(),
  children,
}: {
  title: string;
  updated?: Date;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-[820px] px-6 md:px-12 py-16">
      <header className="mb-10">
        <p className="accent text-[0.7rem] text-[var(--color-gold)] mb-3">Documento legal</p>
        <h1 className="display text-4xl md:text-5xl text-[var(--color-ink)]">{title}</h1>
        <p className="mt-3 text-sm text-[var(--color-ink-subtle)]">
          Última actualización: {format(updated, "dd/MM/yyyy")}
        </p>
      </header>
      <div className="prose-legal space-y-6 leading-relaxed text-[var(--color-ink-muted)] [&_h2]:display [&_h2]:text-2xl [&_h2]:text-[var(--color-ink)] [&_h2]:mt-10 [&_h2]:mb-3 [&_a]:text-[var(--color-gold)]">
        {children}
      </div>
    </article>
  );
}
