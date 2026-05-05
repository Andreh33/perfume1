"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsAppButton({ number }: { number?: string }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);

  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent("Hola, tengo una consulta sobre Sol Perfumes Árabes")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-30 inline-flex items-center justify-center h-14 w-14 rounded-full shadow-lg",
        "bg-[oklch(0.65_0.18_145)] text-white hover:scale-105 transition-transform",
        !reduced && "animate-pulse-gold",
      )}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
