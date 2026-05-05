export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
      <div
        className="h-12 w-12 rounded-full animate-spin"
        style={{
          background: "conic-gradient(from 0deg, transparent, oklch(0.78 0.13 82))",
          mask: "radial-gradient(circle at center, transparent 14px, black 16px)",
          WebkitMask: "radial-gradient(circle at center, transparent 14px, black 16px)",
        }}
      />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
