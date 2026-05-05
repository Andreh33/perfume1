import Link from "next/link";
import { useTranslations } from "next-intl";
import { Instagram, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tNl = useTranslations("home.newsletter");

  return (
    <footer className="relative mt-24 border-t border-[oklch(0.55_0.10_70_/_0.2)] bg-[oklch(0.16_0.020_60)]">
      {/* Patrón mashrabiya sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23d4a04e' stroke-width='1'%3E%3Cpath d='M40 0 L80 40 L40 80 L0 40 Z'/%3E%3Ccircle cx='40' cy='40' r='14'/%3E%3Cpath d='M40 12 L60 40 L40 68 L20 40 Z'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-12 py-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-12">
          <div className="col-span-2 md:col-span-4 space-y-6">
            <Logo />
            <p className="text-sm max-w-xs">
              Attar, mukhallat y oud seleccionados a mano de los maestros perfumistas de Dubái, Damasco y Marrakech.
            </p>
            <div className="space-y-2 text-sm text-[var(--color-ink-muted)]">
              <a
                href="mailto:hola@solperfumesarabes.com"
                className="inline-flex items-center gap-2 hover:text-[var(--color-gold)]"
              >
                <Mail className="h-4 w-4" /> hola@solperfumesarabes.com
              </a>
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Madrid · Dubái
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/solperfumesarabes"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-[var(--color-gold-deep)] p-2.5 text-[var(--color-gold)] hover:bg-[oklch(0.78_0.13_82_/_0.1)]"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="accent text-[0.7rem] text-[var(--color-gold)] mb-5">{t("shop")}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/perfumes" className="hover:text-[var(--color-gold)]">{tNav("perfumes")}</Link></li>
              <li><Link href="/colecciones" className="hover:text-[var(--color-gold)]">{tNav("collections")}</Link></li>
              <li><Link href="/notas-olfativas" className="hover:text-[var(--color-gold)]">{tNav("notes")}</Link></li>
              <li><Link href="/ferias" className="hover:text-[var(--color-gold)]">{tNav("fairs")}</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="accent text-[0.7rem] text-[var(--color-gold)] mb-5">{t("company")}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/historia" className="hover:text-[var(--color-gold)]">{tNav("story")}</Link></li>
              <li><Link href="/blog" className="hover:text-[var(--color-gold)]">{tNav("blog")}</Link></li>
              <li><Link href="/contacto" className="hover:text-[var(--color-gold)]">{tNav("contact")}</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 space-y-4">
            <h4 className="accent text-[0.7rem] text-[var(--color-gold)]">{t("newsletter")}</h4>
            <p className="text-sm">{tNl("subtitle")}</p>
            <form className="flex flex-col gap-2 sm:flex-row" action="/api/newsletter" method="post">
              <Input
                type="email"
                name="email"
                required
                placeholder={tNl("placeholder")}
                aria-label={tNl("placeholder")}
                className="flex-1"
              />
              <Button type="submit" size="md">
                {tNl("cta")}
              </Button>
            </form>
            <label className="flex items-start gap-2 text-xs text-[var(--color-ink-subtle)]">
              <input type="checkbox" name="consent" required className="mt-0.5 accent-[var(--color-gold)]" />
              <span>{tNl("consent")}</span>
            </label>
          </div>
        </div>

        <hr className="my-12" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[var(--color-ink-subtle)]">
          <p>
            © {new Date().getFullYear()} Sol Perfumes Árabes. {t("rights")} · {t("handcrafted")}
          </p>
          <ul className="flex items-center gap-5">
            <li><Link href="/envios-y-devoluciones" className="hover:text-[var(--color-gold)]">{t("shippingReturns")}</Link></li>
            <li><Link href="/politica-privacidad" className="hover:text-[var(--color-gold)]">{t("privacy")}</Link></li>
            <li><Link href="/terminos" className="hover:text-[var(--color-gold)]">{t("terms")}</Link></li>
            <li><Link href="/aviso-legal" className="hover:text-[var(--color-gold)]">{t("imprint")}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
