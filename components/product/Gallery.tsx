"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Maximize2, RotateCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  blurDataUrl?: string | null;
};

export function Gallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [thumbsRef, thumbsApi] = useEmblaCarousel({ axis: "y", containScroll: "keepSnaps", dragFree: true });
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const i = emblaApi.selectedScrollSnap();
    setSelected(i);
    thumbsApi?.scrollTo(i);
  }, [emblaApi, thumbsApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scroll = useCallback(
    (dir: "prev" | "next") => {
      if (!emblaApi) return;
      dir === "prev" ? emblaApi.scrollPrev() : emblaApi.scrollNext();
    },
    [emblaApi],
  );

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ active: true, x, y });
  };

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] rounded-lg bg-[var(--color-bg-night)] grid place-items-center text-[var(--color-ink-subtle)]">
        Sin imágenes
      </div>
    );
  }

  const current = images[selected] ?? images[0];

  return (
    <>
      <div className="grid lg:grid-cols-[80px_1fr] gap-3 md:gap-4">
        {/* Thumbs (desktop vertical, móvil oculto) */}
        <div ref={thumbsRef} className="overflow-hidden hidden lg:block">
          <div className="flex flex-col gap-3">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Ver imagen ${i + 1}`}
                aria-current={i === selected}
                className={cn(
                  "relative shrink-0 aspect-square w-20 overflow-hidden rounded-md border transition-all",
                  i === selected ? "border-[var(--color-gold)]" : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden rounded-lg halo">
            <div className="flex">
              {images.map((img) => (
                <div key={img.id} className="relative flex-[0_0_100%] aspect-[4/5]">
                  <div
                    className="relative h-full w-full cursor-zoom-in"
                    onMouseEnter={() => setZoom((z) => ({ ...z, active: true }))}
                    onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
                    onMouseMove={onMouseMove}
                    onClick={() => setLightbox(true)}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      priority={img === current}
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-300"
                      placeholder={img.blurDataUrl ? "blur" : "empty"}
                      blurDataURL={img.blurDataUrl ?? undefined}
                      style={
                        zoom.active && img === current
                          ? {
                              transform: "scale(1.6)",
                              transformOrigin: `${zoom.x}% ${zoom.y}%`,
                            }
                          : undefined
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controles */}
          <button
            type="button"
            onClick={() => scroll("prev")}
            aria-label="Imagen anterior"
            className="absolute top-1/2 -translate-y-1/2 left-3 p-2.5 rounded-full bg-[oklch(0.14_0.015_60_/_0.7)] backdrop-blur text-[var(--color-ink)] hover:bg-[oklch(0.14_0.015_60_/_0.9)]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("next")}
            aria-label="Imagen siguiente"
            className="absolute top-1/2 -translate-y-1/2 right-3 p-2.5 rounded-full bg-[oklch(0.14_0.015_60_/_0.7)] backdrop-blur text-[var(--color-ink)] hover:bg-[oklch(0.14_0.015_60_/_0.9)]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute top-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={() => setLightbox(true)}
              aria-label="Ampliar"
              className="p-2 rounded-full bg-[oklch(0.14_0.015_60_/_0.7)] backdrop-blur text-[var(--color-ink)]"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Vista 360°"
              title="Vista 360° (próximamente)"
              disabled
              className="p-2 rounded-full bg-[oklch(0.14_0.015_60_/_0.7)] backdrop-blur text-[var(--color-ink-subtle)] disabled:opacity-50"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((img, i) => (
              <button
                key={`dot-${img.id}`}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Ir a imagen ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === selected ? "w-6 bg-[var(--color-gold)]" : "w-1.5 bg-[oklch(0.96_0.010_80_/_0.4)]",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de ${name}`}
          className="fixed inset-0 z-[70] bg-[oklch(0.06_0_0_/_0.95)] backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Cerrar"
            className="absolute top-5 right-5 p-3 rounded-full bg-[oklch(0.14_0.015_60_/_0.7)] text-[var(--color-ink)]"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative w-full h-full max-w-5xl max-h-[88vh]">
            {current && (
              <Image
                src={current.url}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            )}
          </div>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => scroll("prev")}
                aria-label="Anterior"
                className="absolute top-1/2 -translate-y-1/2 left-5 p-3 rounded-full bg-[oklch(0.14_0.015_60_/_0.7)] text-[var(--color-ink)]"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => scroll("next")}
                aria-label="Siguiente"
                className="absolute top-1/2 -translate-y-1/2 right-5 p-3 rounded-full bg-[oklch(0.14_0.015_60_/_0.7)] text-[var(--color-ink)]"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
