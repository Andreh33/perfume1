"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "sol-cookies-consent-v1";

type Consent = { necessary: true; analytics: boolean; marketing: boolean };

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState<Consent>({ necessary: true, analytics: false, marketing: false });
  const [details, setDetails] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setOpen(true);
  }, []);

  const persist = (c: Consent) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ c, at: Date.now() }));
    setOpen(false);
    window.dispatchEvent(new CustomEvent("sol:consent", { detail: c }));
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Política de cookies"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 card-velvet shadow-[0_30px_80px_oklch(0_0_0_/_0.6)]"
    >
      <div className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="display text-lg">Cuidamos tu privacidad</p>
            <p className="text-sm text-[var(--color-ink-muted)] mt-1">
              Usamos cookies necesarias para que la tienda funcione. Con tu permiso, usaremos también cookies de
              analítica y marketing.{" "}
              <Link href="/politica-privacidad" className="text-[var(--color-gold)]">
                Saber más
              </Link>
            </p>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="text-[var(--color-ink-muted)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {details && (
          <div className="space-y-2 text-xs">
            <Toggle label="Necesarias" disabled checked />
            <Toggle
              label="Analítica (Vercel · PostHog)"
              checked={consent.analytics}
              onChange={(v) => setConsent((c) => ({ ...c, analytics: v }))}
            />
            <Toggle
              label="Marketing (remarketing, attribution)"
              checked={consent.marketing}
              onChange={(v) => setConsent((c) => ({ ...c, marketing: v }))}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => persist({ necessary: true, analytics: true, marketing: true })}
            className="btn-primary !px-4 !py-2 !text-[0.7rem] flex-1"
          >
            Aceptar todo
          </button>
          <button
            type="button"
            onClick={() => persist({ necessary: true, analytics: false, marketing: false })}
            className="btn-ghost !px-4 !py-2 !text-[0.7rem] flex-1"
          >
            Solo necesarias
          </button>
          {!details && (
            <button
              type="button"
              onClick={() => setDetails(true)}
              className="accent text-[0.65rem] text-[var(--color-ink-muted)] underline"
            >
              Personalizar
            </button>
          )}
          {details && (
            <button
              type="button"
              onClick={() => persist(consent)}
              className="btn-ghost !px-4 !py-2 !text-[0.7rem]"
            >
              Guardar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, disabled, onChange }: { label: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 py-1.5 border-t border-[oklch(0.55_0.10_70_/_0.15)]">
      <span className="text-[var(--color-ink)]">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="accent-[var(--color-gold)] h-4 w-4"
      />
    </label>
  );
}
