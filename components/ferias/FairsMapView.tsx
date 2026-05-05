"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

type Fair = {
  id: string;
  slug: string;
  title: { es: string } | string;
  city: string;
  country: string;
  lat?: number | null;
  lng?: number | null;
};

export function FairsMapView({
  fairs,
  maptilerKey,
}: {
  fairs: Fair[];
  maptilerKey?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const geo = fairs.filter((f) => f.lat != null && f.lng != null);

  useEffect(() => {
    let map: { remove: () => void } | null = null;
    let cancelled = false;

    (async () => {
      if (!containerRef.current || geo.length === 0) return;
      try {
        const maplibre = await import("maplibre-gl");
        await import("maplibre-gl/dist/maplibre-gl.css");
        if (cancelled || !containerRef.current) return;

        const styleUrl = maptilerKey
          ? `https://api.maptiler.com/maps/streets-dark/style.json?key=${maptilerKey}`
          : "https://demotiles.maplibre.org/style.json";

        const m = new maplibre.Map({
          container: containerRef.current,
          style: styleUrl,
          center: [10, 40],
          zoom: 3,
          attributionControl: { compact: true },
        });
        map = m;

        m.on("load", () => {
          for (const f of geo) {
            const el = document.createElement("div");
            el.className = "sol-marker";
            el.style.cssText = `
              width: 22px; height: 22px; border-radius: 50%;
              background: oklch(0.78 0.13 82); border: 2px solid oklch(0.14 0.015 60);
              box-shadow: 0 0 0 4px oklch(0.78 0.13 82 / 0.25);
              cursor: pointer;
            `;
            const popup = new maplibre.Popup({ offset: 18, closeButton: false }).setHTML(
              `<div style="font-family: Georgia, serif; padding: 4px 8px;">
                 <div style="color: oklch(0.78 0.13 82); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">${f.city}, ${f.country}</div>
                 <div style="color: oklch(0.96 0.010 80); font-size: 16px; margin-top: 4px;">${typeof f.title === "string" ? f.title : f.title.es}</div>
                 <a href="/ferias/${f.slug}" style="display:inline-block; margin-top: 8px; color: oklch(0.78 0.13 82); font-size: 11px;">Ver detalle →</a>
               </div>`,
            );
            new maplibre.Marker({ element: el }).setLngLat([f.lng!, f.lat!]).setPopup(popup).addTo(m);
          }

          if (geo.length > 0) {
            const bounds = new maplibre.LngLatBounds();
            for (const f of geo) bounds.extend([f.lng!, f.lat!]);
            m.fitBounds(bounds, { padding: 80, duration: 0, maxZoom: 6 });
          }
        });
      } catch (e) {
        setError((e as Error).message);
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [geo, maptilerKey]);

  if (geo.length === 0) {
    return (
      <div className="card-velvet p-12 text-center text-[var(--color-ink-muted)]">
        Aún no hay ferias con coordenadas.
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <div className="card-velvet relative overflow-hidden h-[560px]">
        <div ref={containerRef} className="absolute inset-0" aria-label="Mapa de ferias" />
        {error && (
          <p className="absolute bottom-4 left-4 right-4 text-xs text-[var(--color-danger)] bg-[oklch(0.14_0.015_60_/_0.85)] p-2 rounded">
            Error cargando mapa: {error}
          </p>
        )}
      </div>

      <ul className="card-velvet p-4 space-y-1 max-h-[560px] overflow-y-auto">
        {geo.map((f) => (
          <li key={f.id}>
            <Link
              href={`/ferias/${f.slug}`}
              className="flex items-start gap-3 px-3 py-2 rounded-md hover:bg-[oklch(0.78_0.13_82_/_0.08)]"
            >
              <MapPin className="h-4 w-4 mt-1 shrink-0 text-[var(--color-gold)]" />
              <div>
                <p className="display text-sm">{typeof f.title === "string" ? f.title : f.title.es}</p>
                <p className="text-xs text-[var(--color-ink-subtle)]">{f.city}, {f.country}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
