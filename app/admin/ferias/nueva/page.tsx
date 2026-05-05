import { FairForm } from "../FairForm";

export default function NewFairPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="display text-3xl">Nueva feria</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mt-1">
          Crea un evento que aparecerá en /ferias y en el ICS público.
        </p>
      </header>

      <FairForm />
    </div>
  );
}
